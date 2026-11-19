---
layout: default
title: Simple State Machine in Godot 4
parent: Recipes
nav_order: 10
---

# Simple State Machine in Godot 4

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

Based on the official GDScript basics guide — [GDScript basics — Godot Docs](https://docs.godotengine.org/en/stable/getting_started/scripting/gdscript/gdscript_basics.html) (the `match` and `enum` sections). Implementation and acceptance test are an independent rewrite verified in Godot 4.

<h2 id="summary">2. Executive Summary</h2>

For characters with several distinct behaviors (idle, run, jump), instead of many boolean flags that contradict each other, use one `enum` for the states and `match` inside `_physics_process`. Only one state is active per frame and each state owns its own input and physics handling. Transitions live in one small function so behavior stays predictable and testable.

<h2 id="code">3. Full Code (GDScript)</h2>

**State machine with enum + match on a CharacterBody2D:**

```gdscript
extends CharacterBody2D

enum State { IDLE, RUN, JUMP }

const SPEED := 300.0
const JUMP_VELOCITY := -420.0
const ACCEL := 1800.0
const DECEL := 2200.0

var state: State = State.IDLE

func _physics_process(delta: float) -> void:
    var direction := Input.get_axis("move_left", "move_right")

    match state:
        State.IDLE:
            velocity.x = move_toward(velocity.x, 0.0, DECEL * delta)
            if not is_on_floor():
                state = State.JUMP
            elif direction != 0.0:
                state = State.RUN
            elif Input.is_action_just_pressed("jump"):
                _do_jump()

        State.RUN:
            velocity.x = move_toward(velocity.x, direction * SPEED, ACCEL * delta)
            if not is_on_floor():
                state = State.JUMP
            elif direction == 0.0:
                state = State.IDLE
            elif Input.is_action_just_pressed("jump"):
                _do_jump()

        State.JUMP:
            velocity.x = move_toward(velocity.x, direction * SPEED, ACCEL * delta * 0.6)
            if is_on_floor():
                state = State.RUN if direction != 0.0 else State.IDLE

    if not is_on_floor():
        velocity += get_gravity() * delta

    move_and_slide()
```

**Centralized transition with a duplicate-transition guard:**

```gdscript
func _do_jump() -> void:
    if state == State.JUMP or not is_on_floor():
        return
    velocity.y = JUMP_VELOCITY
    _change_state(State.JUMP)

func _change_state(new_state: State) -> void:
    if new_state == state:
        return  # ignore redundant transitions
    state = new_state
```

**Debug display of the current state:**

```gdscript
func _process(_delta: float) -> void:
    $StateLabel.text = State.keys()[state]
```

<h2 id="test">4. Acceptance Test</h2>

**Prerequisites:** a CharacterBody2D scene with ground and a ledge; the `jump`, `move_left`, `move_right` actions defined; a `StateLabel` node showing the current state.

**Expected transition table:**

```text
from  | condition                        | to
------+----------------------------------+------
IDLE  | direction != 0 and on floor      | RUN
IDLE  | jump pressed and on floor        | JUMP
IDLE  | leaves floor (walked off ledge)  | JUMP
RUN   | direction == 0 and on floor      | IDLE
RUN   | jump pressed and on floor        | JUMP
JUMP  | lands and direction != 0         | RUN
JUMP  | lands and direction == 0         | IDLE
any   | same-state transition requested  | ignored (no change)
```

**Verification:**

- Walking from IDLE must switch the label to `RUN` exactly on the frame `direction` becomes non-zero.
- Walking off the ledge must move the state to `JUMP` **without** pressing jump and without a jump (velocity.y starts at zero and gravity applies).
- Pressing jump while in JUMP must cause no change (the `_do_jump` guard).
- After landing, the state must immediately become RUN or IDLE, never stay JUMP.

<h2 id="failures">5. Failure Modes</h2>

**Redundant or cyclic transitions:**
If several branches in the same frame satisfy a transition (e.g. both `direction != 0` and `jump pressed`), the last condition wins and the state may flicker between states. Make branch order explicit and use the `new_state == state` guard.

**Missing JUMP state when falling off a ledge:**
If only pressing jump enters JUMP, walking off a ledge leaves the character in IDLE/RUN with `is_on_floor() == false`, and air-specific inputs (reduced control) never apply. Every transition into the air must move the state to JUMP.

**Mutating velocity outside the state logic:**
If other code (e.g. a knockback) changes `velocity.y` directly, the state machine loses track of reality — the character floats in IDLE while airborne. Route all physics changes through state branches or transition functions.

**Strings instead of enums:**
Comparing `state == "jump"` with `var state: String` allows meaningless states like `"jupm"` with no compile-time error. Always use `enum State` with a typed `var state: State`.

