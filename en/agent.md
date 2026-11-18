---
layout: default
title: Agent Guide
nav_order: 98
description: How to consume DocBox in an AI agent — fetch, filter, and apply tested recipes in three HTTP requests
---

# Agent Guide

If you are an AI agent writing Godot code for a user, this page tells you exactly how to consume DocBox — in three HTTP requests or fewer.

## Step 1 — Fetch the catalog

```bash
curl -s https://esfandteam.github.io/docbox/recipes.json
```

A complete JSON catalog with a category per recipe. Key fields per entry:

| Field | Meaning | Why it matters |
| --- | --- | --- |
| `min_engine_version` | Minimum engine version | Do not recommend the recipe if the user's project is older |
| `category` | Category (movement / physics / ui / data / patterns) | Quick filtering by problem area |
| `requires` | Required classes/nodes | Match against the user's project assets |
| `conflicts` | Incompatible recipes | If one is active, find an alternative |
| `verification` | Verification level | `human-verified` means a real human ran the code |
| `url_markdown` | Plain markdown URL | Fast fetch, easy regex parsing |

## Step 2 — Filter and rank

Keep only recipes that satisfy:

```text
min_engine_version <= engine version of the user's project
requires          ⊆  nodes/classes available in the project
conflicts         ∩  recipes already in project = ∅
```

Then rank survivors by `tags` and `summary` against the user's intent.

## Step 3 — Read the recipe

```bash
curl -s https://raw.githubusercontent.com/esfandteam/docbox/main/en/recipes/godot-2d-movement.md
```

Every recipe follows the same structure — a simple parser can split it:

```text
## 1. Provenance        → origin of the knowledge (official docs)
## 2. Executive Summary → when to use / when not
## 3. Full Code         → copy this into the project
## 4. Acceptance Test   → how to PROVE it works after pasting
## 5. Failure Modes     → known breakage conditions
```

## Step 4 — Report back

Tell the user:

1. Which recipe was used and its verification level (e.g. "human-verified, last tested 2026-11-17")
2. Where to paste the code (guided by `requires`)
3. How to run the acceptance test to prove it works
4. Which failure modes might apply to their project

That way the user knows where the code came from and why it is trustworthy — instead of receiving an anonymous fragment.

## Golden rules

- **Never** present code that is not in DocBox as "tested".
- If the user's project is older than `min_engine_version`, say honestly that the recipe may not work.
- If a recipe URL returns 404, re-fetch `recipes.json` — the catalog may have been updated.
- For everything in one file: read [`llms.txt`](../llms.txt).
