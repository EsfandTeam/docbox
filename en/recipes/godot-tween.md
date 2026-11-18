---
layout: default
title: Tweens in Godot 4
parent: Recipes
nav_order: 6
---

# Tweens in Godot 4

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

Based on the official `Tween` class documentation — [Tween — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_tween.html). Implementation and acceptance test are an independent rewrite verified in Godot 4.

## 2. Summary {: #summary }

For short animations (movement, fading, color changes) use `create_tween()` instead of a full `AnimationPlayer`. A Tween is an ordered chain: each `tween_property` starts after the previous one finishes. Tweens are bound to the node that created them — when the node dies, the Tween dies with it, so there is no leak.

## 3. Full Code (GDScript) {: #code }

**Simple chain — move, then fade:**

```gdscript
extends Sprite2D

func _ready() -> void:
    var tween := create_tween()
    tween.tween_property(self, "position", position + Vector2(100, 0), 0.5)
    tween.tween_property(self, "modulate:a", 0.0, 0.3)
    tween.tween_callback(queue_free)
```

**Parallel and looping — repeated bouncing:**

```gdscript
func start_bounce() -> void:
    var y0 := position.y
    var bounce := create_tween().set_loops()
    bounce.tween_property(self, "position:y", y0 - 20.0, 0.25) \
        .set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
    bounce.tween_property(self, "position:y", y0, 0.25) \
        .set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
```

**Running two animations simultaneously:**

```gdscript
func pop_in() -> void:
    var tween := create_tween().set_parallel(true)
    tween.tween_property(self, "scale", Vector2.ONE, 0.3)
    tween.tween_property(self, "modulate:a", 1.0, 0.3)
```

## 4. Acceptance Test {: #test }

**Prerequisites:** a `Sprite2D` with the script above.

**Expected output (simple chain):** with `TRANS_LINEAR` (default), the animation is linear; after `0.25 s` (half the duration) the sprite must have moved exactly `50 px`:

```text
progress(0.25s) = 0.25 / 0.5 = 0.5
offset          = 100 · 0.5 = 50 px
```

**Verification:**

- The whole chain takes `0.8 s` (`0.5 + 0.3`) and then frees the sprite (`queue_free`).
- With `set_loops`: the bounce repeats forever; freeing the node stops it without errors in the Output panel.
- With `set_parallel(true)`: scale and alpha change simultaneously, not back-to-back.

## 5. Failure Modes {: #failures }

**Creating a Tween every frame:**
Calling `create_tween()` inside `_process` builds a fresh Tween each frame, each restarting halfway — the animation appears locked and CPU is wasted. Create it once.

**Owner node freed:**
A Tween is bound to its creator; if the node dies the animation silently stops. If the animation must outlive the node, create it on another node (`get_tree().create_tween()` for a node-independent Tween).

**Unintended parallel chains:**
Back-to-back `tween_property` calls run sequentially. For simultaneity use `set_parallel(true)` or `.parallel()`; to return to sequential mode use `.chain()`.

**Wrong property path:**
`tween_property(self, "pos", ...)` fails with an "invalid property" error (the correct name is `position`). Paths must be exact property names; use `"position:x"` for sub-properties.
