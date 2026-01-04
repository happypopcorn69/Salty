#!/usr/bin/env python3
"""
Mirror Project: Trello Board Initializer

Creates a Trello board from a JSON spec.
- No external dependencies (stdlib only)
- Secrets are read from environment variables and never printed

Usage:
    python scripts/trello_init.py trello/spec_examples/mirror_project.json
    python scripts/trello_init.py path/to/spec.json --dry-run

Env:
    TRELLO_KEY (required)
    TRELLO_TOKEN (required)
    TRELLO_ORG_ID (optional, used if spec doesn't set board.idOrganization)
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple


API_BASE = "https://api.trello.com/1"


class TrelloError(RuntimeError):
    pass


def _env(name: str, required: bool = False) -> Optional[str]:
    v = os.environ.get(name)
    if required and not v:
        raise TrelloError(f"Missing required environment variable: {name}")
    return v


def _safe(msg: str) -> None:
    # Output channel that's safe by construction (no secrets should be passed in)
    print(msg)


def trello_request(
    method: str,
    path: str,
    *,
    key: str,
    token: str,
    params: Optional[Dict[str, Any]] = None,
    body: Optional[Dict[str, Any]] = None,
) -> Any:
    if not path.startswith("/"):
        path = "/" + path

    q = dict(params or {})
    q["key"] = key
    q["token"] = token

    url = f"{API_BASE}{path}?{urllib.parse.urlencode(q, doseq=True)}"

    data = None
    headers = {"Accept": "application/json"}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url=url, data=data, method=method.upper(), headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read().decode("utf-8")
            if not raw:
                return None
            return json.loads(raw)
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8") if hasattr(e, "read") else ""
        # Do NOT print URL (contains key/token). Print method/path and server error.
        raise TrelloError(f"Trello API error {e.code} on {method} {path}: {raw[:500]}") from e
    except urllib.error.URLError as e:
        raise TrelloError(f"Network error calling Trello on {method} {path}: {e}") from e


def load_spec(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def validate_spec(spec: Dict[str, Any]) -> None:
    if "board" not in spec or not isinstance(spec["board"], dict):
        raise TrelloError("Spec must contain object: board")
    if not spec["board"].get("name"):
        raise TrelloError("Spec board.name is required")

    lists = spec.get("lists")
    if not isinstance(lists, list) or not lists:
        raise TrelloError("Spec must contain non-empty array: lists")

    list_names = []
    for i, l in enumerate(lists):
        if not isinstance(l, dict) or not l.get("name"):
            raise TrelloError(f"Spec lists[{i}] must have name")
        list_names.append(l["name"])
    if len(set(list_names)) != len(list_names):
        raise TrelloError("Spec lists[].name must be unique")

    labels = spec.get("labels", [])
    if labels is not None:
        if not isinstance(labels, list):
            raise TrelloError("Spec labels must be an array if provided")
        for i, lab in enumerate(labels):
            if not isinstance(lab, dict) or "name" not in lab or "color" not in lab:
                raise TrelloError(f"Spec labels[{i}] must have name and color")

    cards = spec.get("cards", [])
    if cards is not None:
        if not isinstance(cards, list):
            raise TrelloError("Spec cards must be an array if provided")
        for i, c in enumerate(cards):
            if not isinstance(c, dict) or not c.get("name"):
                raise TrelloError(f"Spec cards[{i}] must have name")
            if c.get("list") not in set(list_names):
                raise TrelloError(f"Spec cards[{i}] references unknown list: {c.get('list')}")


def create_board(spec: Dict[str, Any], *, key: str, token: str, dry_run: bool) -> Dict[str, Any]:
    board = spec["board"]
    if board.get("id"):
        _safe(f"Using existing board id: {board['id']}")
        return {"id": board["id"], "url": board.get("url")}

    params = {
        "name": board["name"],
        "desc": board.get("desc", ""),
        "defaultLists": str(bool(board.get("defaultLists", False))).lower(),
        "prefs_permissionLevel": board.get("prefs_permissionLevel", "private"),
    }

    org = board.get("idOrganization") or _env("TRELLO_ORG_ID", required=False)
    if org:
        params["idOrganization"] = org

    if dry_run:
        _safe(f"[dry-run] Would create board: {board['name']}")
        return {"id": "DRY_RUN_BOARD", "url": "https://trello.com/"}

    created = trello_request("POST", "/boards/", key=key, token=token, params=params)
    if not created or "id" not in created:
        raise TrelloError("Failed to create board (no id returned)")
    return created


def create_lists(board_id: str, lists: List[Dict[str, Any]], *, key: str, token: str, dry_run: bool) -> Dict[str, str]:
    mapping: Dict[str, str] = {}
    for idx, l in enumerate(lists):
        name = l["name"]
        pos = l.get("pos", idx + 1)
        if dry_run:
            mapping[name] = f"DRY_LIST_{idx+1}"
            continue
        created = trello_request("POST", f"/boards/{board_id}/lists", key=key, token=token, params={"name": name, "pos": pos})
        mapping[name] = created["id"]
    return mapping


def create_labels(board_id: str, labels: List[Dict[str, Any]], *, key: str, token: str, dry_run: bool) -> Dict[str, str]:
    mapping: Dict[str, str] = {}
    for idx, lab in enumerate(labels):
        name = lab["name"]
        color = lab["color"]
        if dry_run:
            mapping[name] = f"DRY_LABEL_{idx+1}"
            continue
        created = trello_request("POST", f"/boards/{board_id}/labels", key=key, token=token, params={"name": name, "color": color})
        mapping[name] = created["id"]
    return mapping


def create_checklist(card_id: str, checklist: Dict[str, Any], *, key: str, token: str, dry_run: bool) -> Tuple[Optional[str], int]:
    if not checklist:
        return None, 0
    name = checklist.get("name", "Checklist")
    items = checklist.get("items", [])
    if dry_run:
        return "DRY_CHECKLIST", len(items)

    created = trello_request("POST", "/checklists", key=key, token=token, params={"idCard": card_id, "name": name})
    checklist_id = created["id"]
    count = 0
    for item in items:
        trello_request("POST", f"/checklists/{checklist_id}/checkItems", key=key, token=token, params={"name": item, "pos": "bottom"})
        count += 1
    return checklist_id, count


def create_cards(
    spec_cards: List[Dict[str, Any]],
    *,
    list_map: Dict[str, str],
    label_map: Dict[str, str],
    key: str,
    token: str,
    dry_run: bool,
) -> Dict[str, Any]:
    created_cards = []
    checklist_items_total = 0

    for c in spec_cards:
        name = c["name"]
        desc = c.get("desc", "")
        list_name = c.get("list")
        if not list_name:
            raise TrelloError(f"Card '{name}' missing list")
        idList = list_map[list_name]

        if dry_run:
            card_id = f"DRY_CARD_{len(created_cards)+1}"
            created_cards.append({"id": card_id, "name": name})
        else:
            created = trello_request("POST", "/cards", key=key, token=token, params={"idList": idList, "name": name, "desc": desc})
            card_id = created["id"]
            created_cards.append(created)

        # attach labels
        for lab_name in c.get("labels", []):
            if lab_name not in label_map:
                raise TrelloError(f"Card '{name}' references unknown label: {lab_name}")
            if dry_run:
                continue
            trello_request("POST", f"/cards/{card_id}/idLabels", key=key, token=token, params={"value": label_map[lab_name]})

        # checklist
        cl = c.get("checklist")
        if cl:
            _, count = create_checklist(card_id, cl, key=key, token=token, dry_run=dry_run)
            checklist_items_total += count

    return {"cards": created_cards, "checklist_items_total": checklist_items_total}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("spec_path", help="Path to Trello board spec JSON")
    ap.add_argument("--dry-run", action="store_true", help="Validate and simulate without calling Trello")
    args = ap.parse_args()

    key = _env("TRELLO_KEY", required=True)
    token = _env("TRELLO_TOKEN", required=True)

    spec = load_spec(args.spec_path)
    validate_spec(spec)

    board = create_board(spec, key=key, token=token, dry_run=args.dry_run)
    board_id = board["id"]

    lists = spec.get("lists", [])
    labels = spec.get("labels", []) or []
    cards = spec.get("cards", []) or []

    list_map = create_lists(board_id, lists, key=key, token=token, dry_run=args.dry_run)
    label_map = create_labels(board_id, labels, key=key, token=token, dry_run=args.dry_run)
    cards_out = create_cards(cards, list_map=list_map, label_map=label_map, key=key, token=token, dry_run=args.dry_run)

    # Summary
    _safe("")
    _safe("=== Mirror Project: Trello Init Summary ===")
    _safe(f"Board: {spec['board']['name']}")
    if not args.dry_run:
        _safe(f"URL:  {board.get('url', '(no url returned)')}")
    _safe(f"Lists: {len(lists)}")
    _safe(f"Labels:{len(labels)}")
    _safe(f"Cards: {len(cards)}")
    _safe(f"Checklist items: {cards_out['checklist_items_total']}")
    _safe("==========================================")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except TrelloError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        raise SystemExit(2)
