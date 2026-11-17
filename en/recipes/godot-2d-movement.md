---
layout: default
title: 2D Character Movement in Godot 4
parent: Recipes
nav_order: 2
---

# 2D Character Movement in Godot 4

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

Based on the official `CharacterBody2D` pattern from the Godot documentation — [CharacterBody2D — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_characterbody2d.html). Implementation and acceptance test are an independent rewrite verified in Godot 4.

## 2. Summary {: #summary }

Use `CharacterBody2D` for player-controlled movement, not `RigidBody2D` — a player must move exactly as commanded instead of being pushed around by the physics engine. Add gravity manually to `velocity.y` and call `move_and_slide()` to get collisions and wall sliding for free.

## 3. Full Code (GDScript) {: #code }

Attach to a `CharacterBody2D` node. Define three input actions in Project Settings → Input Map: `move_left`, `move_right`, `jump`.

```gdscript
extends CharacterBody2D

@export var speed: float = 300.0
@export var jump_velocity: float = -400.0
@export var gravity: float = 980.0

func _physics_process(delta: float) -> void:
    # Add gravity while airborne
    if not is_on_floor():
        velocity.y += gravity * delta

    # Jump only from the floor
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_velocity

    # Horizontal movement
    var direction := Input.get_axis("move_left", "move_right")
    if direction != 0.0:
        velocity.x = direction * speed
    else:
        velocity.x = move_toward(velocity.x, 0.0, speed)

    move_and_slide()
```

## 4. Acceptance Test {: #test }

**Prerequisites:** `CharacterBody2D` with the script above standing on a horizontal `StaticBody2D`, default values.

**Expected output:** with `gravity = 980` and `jump_velocity = -400`, apex time must be `0.41 s` and maximum jump height `~82 px`:

```text
t_apex  = |jump_velocity| / gravity = 400 / 980  ≈ 0.41 s
h_max   = v² / (2·g)                = 160000 / 1960 ≈ 81.6 px
```

**Verification:**

- Holding a movement key moves the character exactly `300 px/s` (1 second = 300 px).
- Horizontal speed must not change during a jump.
- After landing, `is_on_floor()` becomes `true` and jumping works again.
- Pressing into a wall: the character stops with a sliding motion, no jitter, no penetration.

## 5. Failure Modes {: #failures }

**Calling `move_and_slide()` in `_process`:**
Movement must run in `_physics_process(delta)`; frame rate leaks into physics and behavior differs across machines.

**Using `is_action_pressed` for jumping:**
Holding the jump key makes the character bounce repeatedly. Use `is_action_just_pressed` so a single press triggers one jump.

**Stopping without `move_toward`:**
Setting `velocity.x = 0` directly makes the character stop instantly with an unpleasant snap.

**Jumping before the first `move_and_slide`:**
`is_on_floor()` reflects the previous frame's collision state; in the first airborne frame it is `false`. This is expected — do not add an unconditional jump to "fix" it.
