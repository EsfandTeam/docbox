---
layout: default
title: Input Buffering for Jumping in Godot 4
parent: Recipes
nav_order: 8
---

# Input Buffering for Jumping in Godot 4

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

Based on the official `CharacterBody2D` tutorial in the Godot documentation — [CharacterBody2D — Godot Docs](https://docs.godotengine.org/en/stable/tutorials/2d/character_body_2d.html). Input buffering is a well-known platformer pattern; the implementation and acceptance test are an independent rewrite verified in Godot 4.

## 2. Executive Summary {: #summary } {: #summary }

If the player must press jump on the exact frame they touch the floor, the jump feels stiff and slightly-early presses are dropped. The fix: whenever `Input.is_action_just_pressed("jump")` is true, reset a buffer timer (e.g. `0.12` seconds). In `_physics_process`, execute the jump only when the character is on the floor **and** the buffer is still active. The result: a press up to `0.12` seconds before landing still fires the jump.

## 3. Full Code (GDScript) {: #code }

**CharacterBody2D with jump buffering:**

```gdscript
extends CharacterBody2D

const SPEED := 300.0
const JUMP_VELOCITY := -420.0
const BUFFER_WINDOW := 0.12  # seconds; equals 7 frames at 60 fps

var _jump_buffer := 0.0

func _physics_process(delta: float) -> void:
    if not is_on_floor():
        velocity += get_gravity() * delta

    # Record the jump press into the buffer
    if Input.is_action_just_pressed("jump"):
        _jump_buffer = BUFFER_WINDOW

    if _jump_buffer > 0.0:
        _jump_buffer -= delta

    var direction := Input.get_axis("move_left", "move_right")
    if direction:
        velocity.x = direction * SPEED
    else:
        velocity.x = move_toward(velocity.x, 0.0, SPEED)

    # Jump only when grounded and the buffer is still alive
    if is_on_floor() and _jump_buffer > 0.0:
        velocity.y = JUMP_VELOCITY
        _jump_buffer = 0.0

    move_and_slide()
```

**A more generic buffer with reusable helper (any action):**

```gdscript
extends Node

var _buffers: Dictionary[String, float] = {}

func buffer_action(action: StringName, window: float = 0.12) -> void:
    _buffers[action] = window

func consume_buffer(action: StringName) -> bool:
    if _buffers.get(action, 0.0) > 0.0:
        _buffers.erase(action)
        return true
    return false

func tick(delta: float) -> void:
    for action: String in _buffers:
        _buffers[action] = maxf(0.0, _buffers[action] - delta)
```

**Using it in the character (call tick each physics frame):**

```gdscript
var input_buffer := preload("res://input_buffer.gd").new()

func _ready() -> void:
    add_child(input_buffer)

func _physics_process(delta: float) -> void:
    input_buffer.tick(delta)
    if Input.is_action_just_pressed("jump"):
        input_buffer.buffer_action("jump")
    if is_on_floor() and input_buffer.consume_buffer("jump"):
        velocity.y = JUMP_VELOCITY
    move_and_slide()
```

## 4. Acceptance Test {: #test }

**Prerequisites:** a CharacterBody2D scene with a floor and a wall; the `jump`, `move_left`, `move_right` actions defined in the Input Map; the game running at 60 fps (delta ≈ `0.01667` s).

**Expected output (early jump press):** drop the character so that the jump key is pressed `0.10` seconds before touching the ground. The buffer must still be alive, so the jump fires on the landing frame:

```text
buffer window   = 0.12 s
press lead time = 0.10 s  →  buffer remaining at landing = 0.12 - 0.10 = 0.02 s > 0
frames at 60fps = 0.12 / 0.01667 ≈ 7 frames of tolerance
result          = jump fires on the landing frame
```

**Verification:**

- The jump must fire exactly on the landing frame; `velocity.y` must become `JUMP_VELOCITY` (-420) immediately.
- A press `0.13` seconds or more before landing must NOT fire the jump (buffer expired).
- Pressing in mid-air without a subsequent landing within the window must not trigger a jump, and no double jump may occur.
- Add a debug `print("jump fired")` and confirm it prints exactly once on landing, not on every ground-contact frame.

## 5. Failure Modes {: #failures }

**Decaying the buffer in `_process` instead of `_physics_process`:**
`_process` and `_physics_process` run at different rates. If you decrement in `_process` but check in physics, the buffer drains at the wrong rate — at 144 fps you effectively lose half the tolerance window. Both the buffer and its consumption belong in physics.

**Not consuming the buffer after the jump:**
If you forget `_jump_buffer = 0.0` after firing, the jump re-triggers on every grounded frame until the window expires (rapid consecutive jumps). Always zero the buffer on consumption.

**Wrong or undefined action name:**
`Input.is_action_just_pressed("jupm")` (typo) makes the condition never true — often only a runtime warning, no error. Define actions in Project Settings → Input Map before testing, and guard with `InputMap.has_action`.

**Buffering continuous actions:**
Buffers suit discrete actions (jump, attack, interact), not held ones (running). If you buffer `move_right`, the character keeps walking for `0.12` s after release, and controls feel sticky.

