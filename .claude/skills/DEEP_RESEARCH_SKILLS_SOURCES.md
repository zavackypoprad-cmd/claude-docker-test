# Installed deep-research skills

Three GitHub skill packages installed for deep/systematic research workflows in Claude Code.
Selection is based on convergent popularity across multiple GitHub searches for dedicated
"deep research" Claude Skills (this environment's network policy blocks direct GitHub API /
shields.io star-count queries, so exact live star counts could not be verified at install time —
verify on github.com if precise ranking matters).

## 1. deep-dive (`.claude/skills/deep-dive`)
- Source: https://github.com/kimsb2429/deep-dive-skill
- License: MIT
- What it does: DAG-based autonomous deep research (same pattern as Google's Deep Research) —
  decomposes a question into a dependency graph of sub-questions, runs parallel subagents,
  does one round of gap analysis, then synthesizes a sourced report.
- Self-contained, no extra setup required.

## 2. research / research-deep / research-report / research-add-items / research-add-fields
   (`.claude/skills/research*`)
- Source: https://github.com/Weizhena/Deep-Research-skills
- License: MIT
- What it does: Structured two-phase research workflow (outline generation, then deep
  investigation) with human-in-the-loop control. Good for paper surveys, tech/framework
  comparisons, market research, due diligence.
- Requires the companion agent installed at `.claude/agents/web-search-agent.md` (+ 
  `.claude/agents/web-search-modules/`).
- Extra setup: `pip install pyyaml` (used by `research/validate_json.py`).

## 3. deep-research (`.claude/skills/deep-research`)
- Source: https://github.com/Imbad0202/academic-research-skills
- License: CC BY-NC 4.0 (Attribution-NonCommercial) — personal/non-commercial use only
- What it does: 13-agent academic research pipeline (Scoping → Investigation → Analysis →
  Composition → Review → Revision) with modes for full research, quick brief, Socratic
  guidance, PRISMA systematic review, literature review, fact-check, and paper review.
  Includes reference docs (API protocols for arXiv/OpenAlex/Semantic Scholar/CrossRef,
  APA7 style guide, ethics checklist, etc.) and report/preregistration templates.
