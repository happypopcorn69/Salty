# Trello Init Command

Create a Trello board from a JSON spec (the "Mirror Project" board maker).

## What This Command Does

1. Uses the **planning-agent** to produce a `trello/board_spec.json` based on your brief (or picks an existing example spec).
2. Uses **trello-operator** to execute the spec via `scripts/trello_init.py`.
3. Runs `/review` to confirm no secrets or placeholders shipped.

## Usage

```
/trello-init [project name] — [one sentence brief]
```

Examples:

```
/trello-init Mirror Project — build an auto Trello board maker from template specs
/trello-init SALTY — build board for the SALTY static website
```

## Output Contract

- A committed spec file under `trello/board_specs/`
- A created Trello board with:
  - lists
  - labels (optional)
  - seed cards and checklists
- A short summary including the board URL

## Notes

- Credentials must be provided via environment variables:
  - `TRELLO_KEY`
  - `TRELLO_TOKEN`
  - optional: `TRELLO_ORG_ID`
- The command must never print secrets.
