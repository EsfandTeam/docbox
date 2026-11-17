---
layout: default
title: Rocket Physics in Godot 4
parent: Recipes
nav_order: 1
---

# Implementing Rocket Physics in Godot 4

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

This document is based on foundational physics concepts from the official Godot documentation (licensed under CC BY 3.0). The code implementation and acceptance test are the result of independent rewriting and experimentation in Godot 4.

## 2. Executive Summary {: #summary }

To simulate the motion of a rocket (or any flying vehicle), you should never directly modify its position or velocity. The recommended approach is to use a `RigidBody3D` node and apply a thrust force on every physics frame. This lets Godot's physics engine automatically handle collisions, mass, and drag.

## 3. Full Code (GDScript) {: #code }

Attach this script to a `RigidBody3D` node. Make sure the node's mass in the Inspector is set to a reasonable value (e.g. `10`).

```gdscript
extends RigidBody3D

# Thrust force (newtons)
@export var thrust_force: float = 500.0
# Fuel burn rate per second
@export var fuel_burn_rate: float = 10.0
# Initial fuel amount
@export var max_fuel: float = 100.0

var current_fuel: float

func _ready() -> void:
    current_fuel = max_fuel

func _physics_process(delta: float) -> void:
    if current_fuel > 0.0:
        # Apply force along the -Z axis (forward direction for the rocket in Godot)
        # apply_central_force applies the force at the center of mass
        # (avoiding unwanted torque)
        apply_central_force(-transform.basis.z * thrust_force)

        # Decrease fuel based on elapsed time
        current_fuel -= fuel_burn_rate * delta

        # Prevent fuel from going negative
        if current_fuel <= 0.0:
            current_fuel = 0.0
```

## 4. Acceptance Test {: #test }

Run this test to verify the physics behavior:

**Prerequisites:** a `RigidBody3D` node with mass `10`, no gravity (`gravity_scale = 0`), using the script above.

**Input:** `thrust_force = 500`

**Expected output:** By Newton's second law (`F = m · a`), the initial acceleration must be exactly `50 m/s²`:

```text
F = m · a
500 = 10 · a
a = 50 m/s²
```

**Verification:**

- After 1 second, the rocket's velocity should be approximately `50 m/s`.
- `current_fuel` should reach `90`.
- Once fuel is depleted, acceleration must drop to zero and the rocket should continue moving at constant velocity (Newton's first law).

## 5. Failure Modes {: #failures }

**Numerical instability (Tunneling):**
If you set `thrust_force` too high (e.g. `100,000`) while the physics tick rate is low, the rocket may tunnel through a wall in a single frame.
**Solution:** increase the physics tick rate or enable Continuous CD in the `RigidBody` settings.

**Unwanted torque:**
If you use `apply_force` instead of `apply_central_force`, the force is applied to a specific point and the rocket will spin around itself.

**Running in `_process`:**
If you put this code in `_process(delta)` instead of `_physics_process(delta)`, the rocket physics will behave differently across systems with different frame rates.
