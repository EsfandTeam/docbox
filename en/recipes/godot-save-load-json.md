---
layout: default
title: Save/Load Games with JSON in Godot 4
parent: Recipes
nav_order: 4
---

# Save/Load Games with JSON in Godot 4

[← Back to recipe index](../index.md){: .back-link }

<table class="recipe-meta">
  <tr><th>Verification</th><td><span class="badge badge-verified">human-verified</span></td></tr>
  <tr><th>Engine</th><td>Godot 4.x (minimum 4.0)</td></tr>
  <tr><th>Language</th><td>GDScript</td></tr>
  <tr><th>License</th><td>MIT</td></tr>
  <tr><th>Last tested</th><td>2026-11-17</td></tr>
</table>

<nav class="toc-card">
  <a href="#provenance">Provenance</a> · <a href="#summary">Summary</a> · <a href="#code">Full Code</a> · <a href="#test">Acceptance Test</a> · <a href="#failures">Failure Modes</a>
</nav>

## 1. Provenance {: #provenance }

Based on the official "Saving games" tutorial — [Saving games — Godot Docs](https://docs.godotengine.org/en/stable/tutorials/io/saving_games.html). Implementation and acceptance test are an independent rewrite verified in Godot 4.

## 2. Summary {: #summary }

Collect save data in a plain `Dictionary`, serialize with `JSON.stringify`, and write it with `FileAccess` to `user://`. The `user://` prefix maps to a writable per-user data directory on every platform — never write to `res://`, which is read-only after export.

## 3. Full Code (GDScript) {: #code }

```gdscript
const SAVE_PATH := "user://save.json"

func save_game(data: Dictionary) -> void:
    var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if file == null:
        push_error("Cannot open save file: %s" % FileAccess.get_open_error())
        return
    file.store_string(JSON.stringify(data, "\t"))
    file.close()

func load_game() -> Dictionary:
    if not FileAccess.file_exists(SAVE_PATH):
        return {}
    var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
    if file == null:
        return {}
    var parsed = JSON.parse_string(file.get_as_text())
    file.close()
    if typeof(parsed) != TYPE_DICTIONARY:
        push_error("Corrupt save file")
        return {}
    return parsed
```

**Usage example:**

```gdscript
var player_state := {"level": 3, "coins": 250, "position": {"x": 120.0, "y": 45.0}}
save_game(player_state)

var loaded := load_game()
print(loaded["level"])  # 3
```

## 4. Acceptance Test {: #test }

**Prerequisites:** no special nodes; attach the script to any node and bind two keys/buttons for save and load.

**Input:** `{"level": 3, "coins": 250}`

**Expected output:**

```text
save_game({"level": 3, "coins": 250})
→ creates user://save.json
→ real path: OS.get_user_data_dir() + "/save.json"

load_game() after restarting the game
→ {"level": 3, "coins": 250}   (dictionary equality)
```

**Verification:**

- After saving, the file exists under the path printed by `OS.get_user_data_dir()`.
- After closing and re-running the game, `load_game()` returns exactly the same dictionary.
- If the file is deleted, `load_game()` returns `{}` — no crash.

## 5. Failure Modes {: #failures }

**`JSON.parse_string` on corrupt text:**
On invalid input it returns `null`, not an exception. Without a `typeof` check, key access crashes.

**Integers come back as floats:**
JSON has no int type; all numbers round-trip as floats. Cast with `int(value)` where integral values matter.

**Saving Godot objects in JSON:**
Nodes and `Vector2` do not serialize directly. Store only primitive types (int/float/String/Array/Dictionary); convert vectors to dictionaries or separate numbers.

**Writing to `res://`:**
After export, `res://` is read-only and writes fail. Always use `user://`.

**Unprotected saves:**
`user://save.json` is editable in any text editor. To deter trivial editing use `FileAccess.open_encrypted_with_pass(SAVE_PATH, FileAccess.WRITE, password)`.
