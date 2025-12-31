# Review Command

Spawn review agents to perform comprehensive quality assurance on the current implementation.

## What This Command Does

This command triggers a three-stage review process:

1. **Gremlin QA** - Forbidden words and "ur welcome" count enforcement (MANDATORY)
2. **Principal Engineer Review** - Architectural and code quality analysis
3. **Completeness Check** - Detection of placeholders, mocks, and gaps

## Instructions

Execute the following three-agent review pipeline:

### Stage 0: Gremlin QA (MANDATORY - NO SKIP)

Invoke the `gremlin-qa` agent (model: haiku) with:

> Run quality gate checks per QUALITY_GATES.md for: $ARGUMENTS
>
> Scan for:
> - Forbidden words: sweat, sweaty, perspire, perspiration (case-insensitive)
> - "ur welcome" count (must be exactly 7)
>
> Generate Gate Report with grep commands, file lists, line numbers.
> PASS or FAIL. No exceptions.

**BLOCKING**: If Gremlin QA returns FAIL, the review STOPS. Fix violations and re-run.

If Gremlin QA returns PASS, proceed to Stage 1.

### Stage 1: Principal Engineer Review

Invoke the `principal-engineer-reviewer` agent (model: opus) with:

> Review all code changes related to: $ARGUMENTS
>
> Focus on:
> - Architecture and design patterns
> - Code quality and consistency
> - Performance implications
> - Security considerations
> - Test coverage
>
> Provide a structured review with severity-categorized findings.

Wait for the review to complete. If there are CRITICAL issues, they should be addressed before proceeding.

### Stage 2: Completeness Check

Invoke the `completeness-checker` agent (model: opus) with:

> Scan the implementation for: $ARGUMENTS
>
> Look for:
> - TODO/FIXME/HACK comments
> - Mock or placeholder data
> - Incomplete implementations
> - Missing error handling
> - Hardcoded values that should be configurable
> - Skipped or empty tests
>
> Provide a detailed completeness report.

### Stage 3 (Optional): Diff Judge

Optionally invoke the `diff-judge` agent (model: haiku) to check for scope creep:

> Compare implementation against PROJECT_BRIEF.md for: $ARGUMENTS
>
> Check for:
> - Feature creep (new features not requested)
> - Tone drift (corporate wellness language, motivational speak)
> - Dependency bloat (external CDNs, build requirements)
> - Requirement violations
>
> Generate Diff Judge Report.

### Final Summary

After all review stages complete, provide:

1. **Gate Report Status**: PASS / FAIL (from Gremlin QA)
2. **Combined Status**: PASS / NEEDS WORK / BLOCKED
3. **Critical Actions**: Numbered list of must-fix items
4. **Recommendations**: Suggested improvements

**No Gate Report = No Pass. No exceptions.**

## Usage

```
/review [feature-name or description of what to review]
```

## Examples

```
/review user authentication flow
/review the new dashboard components
/review recent API changes
```

## Important Notes

- **Stage 0 (Gremlin QA) is MANDATORY and BLOCKING** - no skip, no exceptions
- Gate Report must be present in every review
- If Gremlin QA fails, the review stops until violations are fixed
- Principal Engineer Review and Completeness Check run after Gate Report passes
- Diff Judge is optional but recommended to catch scope creep
- CRITICAL issues from any stage should be addressed before production
- Use this after every feature implementation

## Enforcement

Per QUALITY_GATES.md:
- Forbidden words: 0 (FAIL if any found)
- "ur welcome": exactly 7 (FAIL if not 7)
- No report = No pass
