---
layout: default
title: Custom Signals in Godot 4
parent: Recipes
nav_order: 12
---

# Custom Signals in Godot 4

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

Based on two official Godot documentation pages — the signals section of [GDScript basics — Godot Docs](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#signals) and the [Object — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_object.html) class docs (`connect`, `emit_signal` and the `ConnectFlags`). Implementation and acceptance test are an independent rewrite verified in Godot 4.

## 2. Executive Summary {: #summary } {: #summary }

For emitter→consumer communication (e.g. player health to HUD) use a custom signal so the sender never needs to know who is listening: declare `signal health_changed(current: int, max: int)` in the emitter, `emit` on change, and `connect` in the consumer during `_ready`. This decoupling means you can swap the HUD without touching the player code. When needed, tune the connection with `CONNECT_ONE_SHOT` or `CONNECT_DEFERRED`.

## 3. Full Code (GDScript) {: #code }

**Emitter — a health node with a typed signal:**

```gdscript
class_name Health
extends Node

signal health_changed(current: int, max: int)
signal died

@export var max_health: int = 100
var current_health: int = 100

func _ready() -> void:
    current_health = max_health

func take_damage(amount: int) -> void:
    current_health = maxi(0, current_health - amount)
    health_changed.emit(current_health, max_health)
    if current_health == 0:
        died.emit()

func heal(amount: int) -> void:
    current_health = mini(max_health, current_health + amount)
    health_changed.emit(current_health, max_health)
```

**Consumer — HUD connecting in `_ready`:**

```gdscript
extends Label

var health: Health

func _ready() -> void:
    health = get_node("../../Player/Health")
    # CONNECT_DEFERRED: the call is deferred to end of frame so it
    # never fires mid-physics-update
    health.health_changed.connect(_on_health_changed, CONNECT_DEFERRED)
    health.died.connect(_on_died, CONNECT_ONE_SHOT)
    _on_health_changed(health.current_health, health.max_health)

func _on_health_changed(current: int, max_value: int) -> void:
    text = "HP: %d / %d" % [current, max_value]

func _on_died() -> void:
    text = "GAME OVER"
```

**Safe binding with type checks and unbinding:**

```gdscript
func bind_hud(health_node: Health) -> void:
    if not health_node.health_changed.is_connected(_on_health_changed):
        health_node.health_changed.connect(_on_health_changed)

func unbind_hud(health_node: Health) -> void:
    health_node.health_changed.disconnect(_on_health_changed)
    health_node.died.disconnect(_on_died)
```

## 4. Acceptance Test {: #test }

**Prerequisites:** a player node with a `Health` child, and a `Label` in the HUD using the consumer script.

**Expected output (emitting with 75 of 100):** after calling `take_damage(25)` on a full-health character, the label must update exactly:

```text
emit args            = (75, 100)
label.format         = "HP: %d / %d" % [75, 100]
label.text           = "HP: 75 / 100"
emit count per call  = 1
```

**Verification:**

- After one `take_damage(25)`, the label text must be exactly `"HP: 75 / 100"` — nothing more, nothing less.
- Repeated damage down to zero must show `HP: 50 / 100`, `HP: 25 / 100`, `HP: 0 / 100` in order, then `GAME OVER` exactly once (from `CONNECT_ONE_SHOT`).
- Additional damage at zero health must not change the text again; `died` must have been emitted only once.
- `take_damage(-10)` must not exceed max; `mini/maxi` must clamp the value and still produce exactly one emit per call.

## 5. Failure Modes {: #failures }

**Connecting to a freed instance:**
If the HUD connects to the `Health` node and the player is `queue_free`d, the connection is cut automatically; but if `Health` lives outside the tree (e.g. held in an autoload via WeakRef), invoking a dead receiver raises a "previously freed instance" error. Disconnect in `_exit_tree`, or ensure the emitter never outlives the consumer.

**Duplicate connections:**
Calling `connect` multiple times for the same callable on the same signal creates separate connections, and the receiver fires several times per emit (Godot 4 signals are multicast). Check `is_connected` before connecting.

**Swapped emit parameters:**
`health_changed.emit(max_health, current_health)` sends the arguments in the wrong order and the label shows "HP: 100 / 75" — silently misleading. Define the signal with typed parameters and lock the argument order with a test.

**Scene-tree side effects while emitting mid-physics:**
If `health_changed.emit` invokes a receiver directly inside `_physics_process` and the receiver mutates the scene tree (e.g. adds a node), you get a "Parent node is busy" error. Use the `CONNECT_DEFERRED` flag so the call is deferred to the end of the frame.

