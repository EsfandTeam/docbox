---
layout: default
title: Scene Transitions in Godot 4
parent: Recipes
nav_order: 5
---

# Scene Transitions in Godot 4

[← Back to recipe index](../){: .back-link }

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

Based on the official "Change scenes manually" tutorial — [Change scenes manually — Godot Docs](https://docs.godotengine.org/en/stable/tutorials/scripting/change_scenes_manually.html). Implementation and acceptance test are an independent rewrite verified in Godot 4.

## 2. Summary {: #summary }

The standard way to switch scenes in Godot 4 is `get_tree().change_scene_to_file(path)`. The change is deferred to the end of the current frame so the running node is not freed mid-code. For a polished feel, fade the screen with a Tween before switching.

## 3. Full Code (GDScript) {: #code }

**Simple transition — script on a Button:**

```gdscript
extends Button

@export var next_scene_path := "res://scenes/level_2.tscn"

func _ready() -> void:
    pressed.connect(_on_pressed)

func _on_pressed() -> void:
    var err := get_tree().change_scene_to_file(next_scene_path)
    if err != OK:
        push_error("Scene change failed: %s" % err)
```

**Transition with fade — script on a CanvasLayer with a ColorRect child named Fade:**

```gdscript
extends CanvasLayer

@export var next_scene_path := "res://scenes/level_2.tscn"

func _ready() -> void:
    var rect := get_node("Fade") as ColorRect
    rect.color.a = 0.0

func start_transition() -> void:
    var rect := get_node("Fade") as ColorRect
    var tween := create_tween()
    tween.tween_property(rect, "color:a", 1.0, 0.3)
    tween.tween_callback(func(): get_tree().change_scene_to_file(next_scene_path))
```

## 4. Acceptance Test {: #test }

**Prerequisites:** two scenes (`level_1.tscn`, `level_2.tscn`) and a button in the first scene with the script above.

**Expected output:**

```text
Click the button
→ err == OK
→ at the end of the frame the scene switches
→ get_tree().current_scene.name == "Level2"
```

**Verification:**

- After clicking, no crash occurs and the new scene loads completely.
- In the fade version: the screen darkens over `0.3 s`, the scene switches, and the fade resets when the new scene's `_ready` runs its fade-in.
- With a wrong path (missing file): `err` is non-zero and the error is printed — no crash.

## 5. Failure Modes {: #failures }

**Path without `res://`:**
Paths must be complete; `"level_2.tscn"` without the `res://scenes/` prefix fails and returns a non-zero error. Check the error or the switch fails silently.

**Expecting an instant switch:**
`change_scene_to_file` waits until the end of the frame. Reading `current_scene` right after the call still returns the old scene. Check one frame later.

**Freeing the calling node mid-transition:**
The deferred mechanism handles it, but any follow-up calls on that node are undefined.

**String paths in production:**
String paths are looked up at runtime; a typo only surfaces on click. For fixed scenes prefer `change_scene_to_packed(preloaded_scene)` with `preload("res://...")`.
