# Mirror Project (Trello)

Mirror Project is a tiny but ruthless utility: give it a JSON spec and it creates a full Trello board (lists, labels, cards, checklists).  
It’s designed as a proving ground for your multi-agent band: deterministic output, easy QA, quick iteration.

## Why "Mirror"

Because the spec is the source of truth. Trello becomes the reflection.

## Setup

1) Put the `.claude/` folder in your repo (you already have it).

2) Set environment variables (do NOT commit these):

- `TRELLO_KEY`
- `TRELLO_TOKEN`
- optional `TRELLO_ORG_ID` (if you want boards inside an organization/workspace)

On Windows PowerShell (session only):

```powershell
$env:TRELLO_KEY="..."
$env:TRELLO_TOKEN="..."
$env:TRELLO_ORG_ID="..."   # optional
```

## Running

Create a board from a spec:

```bash
python scripts/trello_init.py trello/spec_examples/mirror_project.json
```

Or use Claude Code:

```
/trello-init Mirror Project — build an auto Trello board maker from template specs
```

## Spec Format

A board spec is JSON shaped like:

```json
{
  "board": {
    "name": "Mirror Project",
    "desc": "Auto-create Trello boards from specs",
    "prefs_permissionLevel": "private",
    "defaultLists": false,
    "idOrganization": null
  },
  "lists": [
    {"name": "00 COMMAND", "pos": 1},
    {"name": "10 BACKLOG", "pos": 2}
  ],
  "labels": [
    {"name": "rule", "color": "red"},
    {"name": "infra", "color": "blue"}
  ],
  "cards": [
    {
      "name": "Spec is the source of truth",
      "list": "00 COMMAND",
      "desc": "Never hand-edit a board without updating the spec.",
      "labels": ["rule"],
      "checklist": {
        "name": "DoD",
        "items": ["Spec committed", "Board created", "Counts verified"]
      }
    }
  ]
}
```

Required:
- `board.name`
- `lists[]` with unique names
- cards reference a list by `list` name

Optional:
- `labels[]` (name + color)
- `cards[].labels[]` list of label names
- `cards[].checklist` with `name` and `items[]`
- `board.idOrganization` (or environment variable `TRELLO_ORG_ID`)

## Script Behavior

- Creates a **new board** unless `board.id` is provided.
- Creates lists in the order of `pos` (if provided) or in array order.
- Creates labels, then cards, then attaches labels and checklists.
- Prints a summary with a board URL (safe).

## QA Checks (recommended)

- Run a taboo scan on the spec (for SALTY and similar projects)
- Ensure no tokens are present in:
  - `trello/`
  - `.claude/`
  - `docs/`
  - `scripts/`
