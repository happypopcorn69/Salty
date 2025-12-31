# QUALITY GATES

## Non-Negotiable Requirements

### 1. Forbidden Strings (Case-Insensitive)
The following words are **NEVER** allowed in on-page text (HTML, visible content):
- `sweat`
- `sweaty`
- `perspire`
- `perspiration`

**Scope**: All user-facing content (HTML text nodes, meta descriptions, button text, ARIA labels, alt text, visible content)

**Exempt**: Code comments in `.js` files are discouraged but not blocking. `.md` files documenting the prohibition are exempt.

### 2. Required Phrase
The phrase `ur welcome` must appear **exactly 7 times** in the HTML.

**Exact casing required**: `ur welcome` (lowercase, two words)

**Locations** (as of implementation):
1. Hero tagline
2. The Code - Rule 1
3. Field Manual - Pre-Flight
4. Field Manual - Reset
5. Why Humans Won - closing
6. Salinity Index - closing
7. Footer - final tagline

---

## Gate Report Format

Every review MUST include a "Gate Report" section showing:

```
## Gate Report

### Forbidden Words Scan
- Files checked: [list]
- Forbidden hits: 0
- Status: PASS / FAIL

### "ur welcome" Count
- Expected: 7
- Actual: [count]
- Status: PASS / FAIL
- Locations: [line numbers]

### Verdict
PASS / FAIL
```

**No report, no pass.**

---

## Enforcement

1. **Every `/review` command** must run the Gate Report
2. **Gremlin QA agent** (when invoked) performs annoying, thorough scans:
   - grep-like scans across all files
   - Proves forbidden words didn't sneak into comments, meta tags, alt text
   - Shows exact line numbers for every "ur welcome" occurrence
   - No politeness, pure compliance
3. **Diff Judge agent** (when invoked) compares changes against PROJECT_BRIEF.md:
   - Did you introduce new features not requested?
   - Did you change the tone?
   - Did you add dependencies?

---

## Why This Exists

The site can't say the forbidden words. The factory (SALTWORKS) can. The factory documents the prohibition while the site enforces it. This is the kind of petty paradox that keeps the project honest.

**Sweaty diagnostics are a factory concern. The site stays dry.**

---

## Gate Failure Protocol

If a gate fails:
1. **BLOCK** the review from passing
2. **REPORT** exact locations of violations
3. **REQUIRE** fixes before proceeding
4. **RE-RUN** the gate after fixes

No exceptions. No "close enough."

---

**ur welcome**
