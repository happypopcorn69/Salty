# Quality Enforcement System

## Overview

The SALTWORKS/SALTY project has three specialized agents to enforce quality gates, prevent scope creep, and maintain the salty tone.

---

## Agents

### 1. Gremlin QA (MANDATORY)
**File**: `.claude/agents/gremlin-qa.md`
**Model**: haiku (fast, cheap)
**Tone**: Annoying, blunt, zero tolerance

**What it does**:
- Scans for forbidden words: `sweat`, `sweaty`, `perspire`, `perspiration` (case-insensitive)
- Counts "ur welcome" occurrences (must be exactly 7)
- Shows grep commands, file lists, exact line numbers
- Returns PASS or FAIL (no in-between)

**When to use**:
```
/review [description]  # Gremlin QA runs first (mandatory)
```

Or invoke directly for sweaty diagnostics:
- "Run gremlin QA"
- "Check quality gates"
- "ur welcome count check"

**Output example**:
```
## Gremlin QA Report

### Forbidden Words Scan
Command: grep -rni "sweat|sweaty|perspire|perspiration" src/
Files checked: index.html, styles.css, widget.js
Forbidden hits: 0
Status: PASS

### "ur welcome" Count
Command: grep -n "ur welcome" src/index.html
Expected: 7
Actual: 7
Locations: [lines 41, 56, 97, 131, 166, 196, 222]
Status: PASS

### Verdict
PASS
```

---

### 2. Diff Judge
**File**: `.claude/agents/diff-judge.md`
**Model**: haiku
**Tone**: Skeptical, direct, no compromise

**What it does**:
- Compares implementation against PROJECT_BRIEF.md
- Catches feature creep (new sections, widgets, forms not requested)
- Detects tone drift (corporate wellness language, motivational speak)
- Finds dependency bloat (CDNs, build tools, npm packages)
- Checks requirement violations

**When to use**:
```
/review [description]  # Diff Judge is optional (Stage 3)
```

Or invoke directly:
- "Run diff judge"
- "Check for scope creep"
- "Did we stay in lane?"
- "Compare against the brief"

**Output example**:
```
## Diff Judge Report

### 1. Feature Creep Check
Requested sections: Hero, The Code, Field Manual, WHY HUMANS WON, Salinity Index, Footer
Implemented sections: [same list]
New features NOT requested: None
Status: PASS

### 2. Tone Drift Check
Sample copy: "You're Losing Salt. Deal With It."
Tone assessment: Still salty, blunt, funny. No corporate creep.
Status: PASS

### 3. Dependency Bloat Check
External scripts: None
External stylesheets: None
Build requirements: None
Status: PASS

### Overall Verdict
PASS

The band stayed in lane.
```

---

## Review Pipeline

The `/review` command now runs **three stages**:

### Stage 0: Gremlin QA (MANDATORY - BLOCKING)
- Scans forbidden words and "ur welcome" count
- **If FAIL**: Review STOPS. Fix violations. Re-run.
- **If PASS**: Proceed to Stage 1.

### Stage 1: Principal Engineer Review
- Architecture, code quality, performance, security
- Identifies CRITICAL/MAJOR/MINOR issues

### Stage 2: Completeness Check
- TODOs, placeholders, mocks, incomplete implementations
- Hardcoded values, missing error handling

### Stage 3: Diff Judge (Optional)
- Feature creep, tone drift, dependency bloat
- Recommended but not blocking

---

## Commands

### Current Agents (as of implementation)
```
.claude/agents/
├── backend-engineer.md           # Backend tasks (not used for SALTY)
├── completeness-checker.md       # Placeholder/mock detection
├── diff-judge.md                 # Scope creep prevention (NEW)
├── frontend-engineer.md          # Frontend implementation
├── gremlin-qa.md                 # Quality gate enforcement (NEW)
├── meta-agent.md                 # Agent creation
├── planning-agent.md             # Implementation planning
└── principal-engineer-reviewer.md # Code review
```

### Slash Commands
```
/plan [description]     # Create implementation plan
/review [description]   # Run 3-stage review (Gremlin QA is mandatory)
/meta [description]     # Create new agent
```

---

## The Workflow That Triggered This

Here's what was run to build the SALTY site:

### 1. Planning
```
/plan Create a minimal project skeleton for SALTWORKS that satisfies PROJECT_BRIEF.md.
```

**Result**: Planning agent created a phased plan (Pass A: Content, Pass B: Layout, Pass C: Widget)

### 2. Review (Initial)
```
/review SALTWORKS skeleton against PROJECT_BRIEF.md
```

**Result**:
- Found that only infrastructure existed, no actual website
- Identified Windows compatibility issue in stop.py
- Recommended creating the website itself

### 3. Execution
User said "Alright, proceed."

**Actions taken**:
- Pass A: Created all content with QA scan (forbidden words = 0, "ur welcome" = 7)
- Pass B: Built HTML/CSS with responsive design
- Pass C: Implemented Salinity Index widget
- Fixed Windows compatibility in stop.py
- Final review caught forbidden word "sweat" in widget.js (2 occurrences)
- Fixed violations
- Updated to SALTY brand hierarchy per user feedback

---

## Key Files

| File | Purpose |
|------|---------|
| `QUALITY_GATES.md` | Defines forbidden words and "ur welcome" requirement |
| `QUALITY_ENFORCEMENT.md` | This file - agent documentation |
| `PROJECT_BRIEF.md` | Original requirements |
| `BRAND_HIERARCHY.md` | SALTY/saltworks brand system |
| `IMPLEMENTATION_COMPLETE.md` | Final deliverable documentation |

---

## Philosophy

**The site can't say the forbidden words. The factory (SALTWORKS) can.**

This is the petty paradox that keeps the project alive:
- The **site** (SALTY) enforces the prohibition
- The **factory** (SALTWORKS) documents it
- The **Gremlin QA agent** does "sweaty diagnostics" (ironic, since the site can't say that)

---

## No Report = No Pass

Every `/review` MUST include a Gate Report from Gremlin QA.

**No exceptions. No "close enough."**

If Gremlin QA fails:
1. BLOCK the review
2. REPORT exact violations
3. REQUIRE fixes
4. RE-RUN the gate

---

## Why This Exists

To stop the band from:
- Drifting into scope creep at 2am
- Adding features that weren't requested
- Softening the tone into corporate wellness speak
- Saying the forbidden S-word accidentally
- Losing track of "ur welcome" count

**The gates keep the band honest.**

---

**ur welcome**
