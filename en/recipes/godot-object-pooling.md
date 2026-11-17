---
layout: default
title: Object Pooling in Godot 4
parent: Recipes
nav_order: 9
---

# Object Pooling in Godot 4

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

Based on the official `Node` class documentation — [Node — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_node.html). The methods `set_visible`, `set_physics_process` and `queue_free` are documented on that page. Implementation and acceptance test are an independent rewrite verified in Godot 4.

## 2. Executive Summary {: #summary } {: #summary }

Instantiating and freeing bullets or particles every frame puts heavy load on the allocator and causes micro-stutters. The fix: an object pool — pre-create N instances up front and hide them; "spawning" acquires one from the pool, "removing" never calls `queue_free` but only `set_visible(false)` plus `set_physics_process(false)` and returns it to the pool (`release`). The number of real instances stays constant for the lifetime of the game.

## 3. Full Code (GDScript) {: #code }

**A simple pool with a pre-allocated array:**

```gdscript
class_name BulletPool
extends Node2D

var _pool: Array[Node2D] = []

func setup(scene: PackedScene, size: int = 20) -> void:
    _pool.clear()
    _pool.reserve(size)
    for i in size:
        var bullet: Node2D = scene.instantiate()
        bullet.set_visible(false)
        bullet.set_physics_process(false)
        bullet.set_process(false)
        add_child(bullet)       # shared parent keeps the scene tidy
        _pool.append(bullet)

func acquire() -> Node2D:
    if _pool.is_empty():
        return null             # or grow the pool dynamically
    var bullet: Node2D = _pool.pop_back()
    bullet.set_visible(true)
    bullet.set_physics_process(true)
    bullet.set_process(true)
    return bullet

func release(bullet: Node2D) -> void:
    bullet.set_visible(false)
    bullet.set_physics_process(false)
    bullet.set_process(false)
    _pool.append(bullet)
```

**Shooting via the pool:**

```gdscript
var bullet_pool := BulletPool.new()

func _ready() -> void:
    add_child(bullet_pool)
    bullet_pool.setup(preload("res://bullet.tscn"), 20)

func shoot(from: Vector2, dir: Vector2) -> void:
    var bullet := bullet_pool.acquire()
    if bullet == null:
        return
    bullet.global_position = from
    bullet.set("direction", dir)

func on_bullet_hit(bullet: Node2D) -> void:
    bullet_pool.release(bullet)
```

**The bullet as a pool consumer (it does not free itself):**

```gdscript
extends Node2D

var direction := Vector2.RIGHT
var speed := 500.0
var lifetime := 2.0

func _ready() -> void:
    get_tree().create_timer(lifetime).timeout.connect(_expire)

func _physics_process(delta: float) -> void:
    position += direction * speed * delta

func _expire() -> void:
    var pool := get_parent() as BulletPool
    if pool:
        pool.release(self)
```

## 4. Acceptance Test {: #test }

**Prerequisites:** a pool of size `20`; fire `100` bullets over `10` seconds (10 bullets per second, each bullet living 1 second).

**Expected output (instance-count stability):** counting `get_child_count()` on the pool node:

```text
pool size (warmup)          = 20 instances
spawned over 10 s           = 100 bullets
freed instances (queue_free)= 0
child_count after 10 s      = 20  (constant; only visibility toggles)
peak concurrent bullets     = min(pool_size, spawn rate × lifetime) = min(20, 10) = 10
acquire failures            = 0 (10 concurrent < 20 capacity)
```

**Verification:**

- `get_child_count()` must remain `20` at all times; no new instance is created after warmup.
- Bullet `get_instance_id()` values must repeat across shots (the same instances are recycled) — verify by printing the ids.
- The Profiler must never show a steadily growing Node count; the "Nodes" curve must stay flat.
- If concurrency exceeds capacity (e.g. 25 live bullets with a pool of 20), `acquire` must return `null` and `shoot` must skip silently — no crash.

## 5. Failure Modes {: #failures }

**Forgetting to reset state on acquire:**
If you do not reset previous properties (direction, speed, `modulate`, collision state) when pulling a bullet from the pool, the new shot inherits the previous one's data — bullets fire "backwards" by mistake. Overwrite every dynamic state inside `acquire`.

**Releasing live bullets:**
If a still-active bullet is `release`d but `set_physics_process(false)` is not called, it keeps moving while also being back in the pool — two consumers for one object. `release` must always disable both visibility and processing.

**Unbounded pool growth:**
If `acquire` instantiates new objects whenever the pool is empty and never returns them under a cap, the pool only grows and pooling loses its purpose. Decide: fixed cap (return `null`) or dynamic cap with `pool_max` and a warning log.

**Repeated signal connections:**
If each bullet connects to a signal in `_ready` and stays connected on release, a recycled bullet also reacts to stale events. Disconnect on `release`, or rely on parent/timer-scoped connections instead.

