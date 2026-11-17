---
layout: default
title: استخر اشیا (Object Pooling) در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 9
---

# استخر اشیا (Object Pooling) در Godot 4

[← بازگشت به فهرست دستورپخت‌ها](../index.md){: .back-link }

<table class="recipe-meta">
  <tr><th>وضعیت تأیید</th><td><span class="badge badge-verified">human-verified</span></td></tr>
  <tr><th>موتور</th><td>Godot 4.x (حداقل ۴.۰)</td></tr>
  <tr><th>زبان</th><td>GDScript</td></tr>
  <tr><th>مجوز</th><td>MIT</td></tr>
  <tr><th>آخرین تست</th><td>۲۰۲۶-۱۱-۱۷</td></tr>
</table>

<nav class="toc-card">
  <a href="#provenance">منبع اصلی</a> · <a href="#summary">خلاصه اجرایی</a> · <a href="#code">کد کامل</a> · <a href="#test">تست پذیرش</a> · <a href="#failures">حالت‌های شکست</a>
</nav>

## ۱. منبع اصلی {: #provenance }

این مستند بر اساس مستندات کلاس رسمی `Node` تدوین شده است — [Node — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_node.html). متدهای `set_visible`، `set_physics_process` و `queue_free` در همین صفحه مستند شده‌اند. پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل است.

## ۲. خلاصه اجرایی {: #summary }

ساختن و آزادکردن مکرر گلوله‌ها یا ذرات در هر فریم باعث بار زیاد روی Allocation و در نتیجه هنگ‌های کوتاه می‌شود. راه‌حل: یک استخر اشیا — در ابتدا N نمونه از پیش بسازید و مخفی کنید؛ برای «تولید» یکی را از استخر بردارید (`acquire`)، برای «حذف» به‌جای `queue_free` فقط `set_visible(false)` و `set_physics_process(false)` بزنید و به استخر برگردانید (`release`). تعداد نمونه‌های واقعی در طول عمر بازی ثابت می‌ماند.

## ۳. کد کامل (GDScript) {: #code }

**استخر ساده با آرایه‌ی از پیش تخصیص‌یافته:**

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
        add_child(bullet)       # والد مشترک، صحنه را مرتب نگه می‌دارد
        _pool.append(bullet)

func acquire() -> Node2D:
    if _pool.is_empty():
        return null             # یا اندازه‌ی استخر را داینامیک بزرگ کنید
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

**شلیک با استفاده از استخر:**

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

**گلوله به‌عنوان مصرف‌کننده‌ی استخر (خودش را برنمی‌گرداند):**

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

## ۴. تست پذیرش {: #test }

**پیش‌نیازها:** استخر با اندازه‌ی `20` ساخته شده و در طول `10` ثانیه، `100` گلوله شلیک شود (۱۰ گلوله در ثانیه، عمر هر گلوله ۱ ثانیه).

**خروجی مورد انتظار (پایداری تعداد نمونه‌ها):** با شمارش `get_child_count()` روی نود استخر:

```text
pool size (warmup)          = 20 instances
spawned over 10 s           = 100 bullets
freed instances (queue_free)= 0
child_count after 10 s      = 20  (constant; only visibility toggles)
peak concurrent bullets     = min(pool_size, spawn rate × lifetime) = min(20, 10) = 10
acquire failures            = 0 (10 concurrent < 20 capacity)
```

**بررسی نتایج:**

- `get_child_count()` باید همیشه `20` بماند؛ هیچ نمونه‌ی تازه‌ای پس از warmup ساخته نمی‌شود.
- `bullet.get_instance_id()` ها باید بین شلیک‌ها تکرار شوند (همان نمونه‌ها بازیافت می‌شوند) — با چاپ شناسه‌ها بررسی کنید.
- در Profiler هرگز نباید رشد مداوم تعداد Nodeها دیده شود؛ منحنی «Nodes» باید خط صاف باشد.
- اگر هم‌زمانی از ظرفیت بیشتر شود (مثلاً ۲۵ گلوله‌ی زنده با استخر ۲۰)، `acquire` باید `null` برگرداند و `shoot` باید بی‌صدا از آن عبور کند، نه کرش.

## ۵. حالت‌های شکست (Failure Modes) {: #failures }

**فراموش‌کردن ریست حالت هنگام acquire:**
اگر موقع برداشتن گلوله از استخر، پراپرتی‌های قبلی (جهت، سرعت، `modulate`، وضعیت برخورد) را ریست نکنید، گلوله‌ی جدید با داده‌های شلیک قبلی راه می‌افتد — گلوله‌ها «به اشتباه به سمت عقب» شلیک می‌شوند. همه‌ی حالت‌های پویا را در `acquire` بازنویسی کنید.

**صف شدن گلوله‌های زنده:**
اگر یک گلوله‌ی فعال را `release` کنید ولی `set_physics_process(false)` نزنید، همچنان حرکت می‌کند در حالی که از استخر هم برداشته شده — دو مصرف‌کننده برای یک شیء. `release` باید همیشه visibility **و** پردازش را خاموش کند.

**رشد بی‌رویه‌ی استخر:**
اگر در `acquire` وقتی استخر خالی است بی‌قید نمونه‌ی جدید بسازید و به استخر برگردانید، استخر فقط بزرگ می‌شود و هدف pooling از بین می‌رود. تصمیم بگیرید: سقف ثابت (برگشت `null`) یا سقف داینامیک با `pool_max` و لاگ هشدار.

**اتصال سیگنال‌های مکرر:**
اگر در `_ready` هر گلوله به سیگنالی وصل شوید و موقع release وصل‌بماند، گلوله‌ی باز recycled به رویدادهای قدیمی هم واکنش نشان می‌دهد. اتصال‌ها را در `release` قطع کنید یا از اتصال‌های خودکار مبتنی بر تایمر/نود والد استفاده کنید.

