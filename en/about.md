---
layout: default
title: About DocBox
nav_order: 99
---

# About DocBox

> **DocBox is a bridge between scattered human knowledge and AI agents.**

## What is DocBox?

DocBox is an open-source registry of tested, executable "recipes" for game engines. Every recipe has three core parts:

1. **Runnable code** — written for a specific engine (currently Godot 4) and ready to copy into a project.
2. **Acceptance test** — a precise, measurable condition proving the code works.
3. **Failure modes** — a list of situations where the code breaks, so you know when not to use it.

All recipes are published as Markdown + JSON + `llms.txt` so humans can read them comfortably and AI agents can fetch them in a structured way.

## The problem

When an AI agent (such as an LLM) is asked to write Godot code, it usually falls back to one of two approaches:

- **Searching Google or forums** — then imitating code fragments that may be outdated, incomplete, or wrong.
- **Hallucination** — producing code that looks right but does not run, or behaves incorrectly.

The result: broken code, wasted user time, and declining trust in AI. The problem grows once you realize the **correct knowledge** definitely exists — it is just scattered in the heads of experienced developers and not readily available to agents.

## Our solution

DocBox collects this scattered knowledge in one place, with a clear structure and a **verification level** attached to each recipe:

| Level | Meaning |
| --- | --- |
| `human-verified` | A human has run the code in a real engine environment and recorded the result in the acceptance test. |
| `automated` | The code is tested automatically in CI (for example via Godot headless in GitHub Actions). |

> **Current status:** all recipes are currently `human-verified`. As soon as the CI pipeline with Godot headless is in place, recipes that pass it will be upgraded to `automated`.

## Why this site is built for AI

DocBox is designed so an agent can fetch a list of all trustworthy recipes with a single HTTP request:

1. **`recipes.json`** — standard JSON with `min_engine_version`, `requires`, `conflicts`, `verification`, and markdown/HTML URLs.
2. **`llms.txt`** — a plain-text file following the [llmstxt.org](https://llmstxt.org) standard for fast LLM ingestion.
3. **Markdown files** — every recipe follows a fixed structure (Provenance → Summary → Code → Acceptance Test → Failure Modes) so an agent knows exactly where to look for what.

That way, instead of hallucinating or imitating anonymous forums, an agent can fetch a trusted source, parse its structure, and recommend code with confidence.

## How to contribute

If you have a tested recipe that would help others:

1. Read `CONTRIBUTING.md`.
2. Create a Markdown file in `fa/recipes/` (and preferably `en/recipes/` for the English version).
3. Follow the structure exactly as in `godot-rocket.md`.
4. Submit a Pull Request.

After review by the team, the recipe is published with `human-verified` status.

## License

All recipes and code inside DocBox are published under the **MIT** license. The full text is in [`LICENSE`](LICENSE).
