Project: SALTWORKS (one-page site)

Tone: salty, funny, blunt. No corporate wellness voice.

Hard rule: never use the words “sweat”, “sweaty”, “perspire”, “perspiration” anywhere in on-page text.

Must-have sections:

Hero

The Code (rules)

Field Manual (pre-flight/loadout/reset)

WHY HUMANS WON (big evolution + endurance pursuit section)

Salinity Index (tiny interactive widget)

Footer

Motto: “ur welcome” appears exactly 7 times across the page, always lowercase, no explanation.

Definition of Done:

Mobile + desktop responsive

Accessible basics (headings, buttons, keyboard focus)

Fast load, minimal dependencies

Deliverable is runnable locally by opening the file (or npm run dev if you choose Vite)

The soundcheck run (10 minutes)
Run these two commands in Claude Code:

/plan Create a minimal project skeleton for SALTWORKS that satisfies PROJECT_BRIEF.md.

Then immediately: /review SALTWORKS skeleton against PROJECT_BRIEF.md.

Success looks like:

The plan is phased, not a novel.

The reviewer produces a punchlist, not applause.

Nothing tries to invent features you didn’t ask for.
If this part feels clean, you’re ready.

Build the website in controlled passes
Do it in three passes so the band stays in lane:

Pass A: Copy only

Agent outputs all text for every section.

It must also output a quick “forbidden words scan” result (should be zero).

It must confirm “ur welcome” count is exactly 7.

Pass B: Layout and styling

Implement static site (start with plain HTML/CSS/JS unless you really want React).

No animations yet except maybe a tiny toast for the motto if you want.

Pass C: The Salinity Index widget

Simple sliders and a generated status card.

No analytics. No external calls.

Add one non-negotiable QA gate
Before “done,” one agent must do a literal text scan: forbidden words = 0, “ur welcome” = 7.
This is how you stop the band from accidentally saying the S-word at 2am.