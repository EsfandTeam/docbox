---
layout: default
title: Camera Follow in Godot 4
parent: Recipes
nav_order: 3
---

# Camera Follow in Godot 4

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

<h2 id="provenance">1. Provenance</h2>

Based on the official `Camera2D` class documentation — [Camera2D — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_camera2d.html). Implementation and acceptance test are an independent rewrite verified in Godot 4.

<h2 id="summary">2. Summary</h2>

Do not hand-roll lerp followers — Godot 4 has built-in `position_smoothing` on `Camera2D` that is frame-rate friendly and jitter-free. Add `limit_left/right/top/bottom` so the camera never shows space outside your level.

<h2 id="code">3. Full Code (GDScript)</h2>

Attach to a `Camera2D` node; make it a child of the player, or let `make_current()` activate it.

```gdscript
extends Camera2D

@export var follow_speed: float = 5.0

func _ready() -> void:
    # Engine-native smoothing — do not hand-roll lerp
    position_smoothing_enabled = true
    position_smoothing_speed = follow_speed

    # Update in the physics tick if the target moves in _physics_process
    process_callback = Camera2D.PROCESS_CALLBACK_PHYSICS

    # World bounds: the camera never shows outside this rect
    limit_left = 0
    limit_top = 0
    limit_right = 2048
    limit_bottom = 1152

    make_current()
```

<h2 id="test">4. Acceptance Test</h2>

**Prerequisites:** camera with `follow_speed = 5.0`, a player far from the camera, limits enabled.

**Expected output:** Godot 4 camera smoothing decays exponentially; with an initial gap of `200 px` and `speed = 5.0`, the remaining distance after `1 s` must be about `1.35 px`:

```text
gap(t) = gap₀ · e^(−speed·t)
gap(1) = 200 · e^(−5) ≈ 1.35 px
```

**Verification:**

- The camera follows the player with no visible lag and no jitter.
- Walking to the level edge: the view stops at the `limit`, never showing empty space.
- Lowering `follow_speed` to `2.0` makes the follow visibly slower.

<h2 id="failures">5. Failure Modes</h2>

**Manual lerp while the camera is a child of the player:**
Two transforms stack and the camera jumps or moves double-speed. Choose one: child-of-player or manual lerp — not both.

**Confusing limits with zoom:**
`limit_*` values are in world pixels, not screen pixels. Changing `zoom` changes how much world is visible but not the limit values.

**Updating in Idle instead of Physics:**
If the player moves in `_physics_process` but the camera updates in the default idle callback, movement jitters above 60 FPS. Use `PROCESS_CALLBACK_PHYSICS`.

**Camera not current:**
With multiple cameras, the last one becomes active. Call `make_current()` to be explicit.
