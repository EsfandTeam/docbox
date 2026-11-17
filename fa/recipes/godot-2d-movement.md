---
layout: default
title: حرکت کاراکتر دوبعدی در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 2
---

# حرکت کاراکتر دوبعدی در Godot 4

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

این مستند بر اساس الگوی رسمی `CharacterBody2D` در مستندات Godot تدوین شده است — [CharacterBody2D — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_characterbody2d.html). پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل در Godot 4 است.

## ۲. خلاصه اجرایی {: #summary }

برای حرکت بازیکن دوبعدی از `CharacterBody2D` استفاده کنید، نه `RigidBody2D`. کاراکتر کنترل‌شده توسط بازیکن باید دقیقاً طبق فرمان حرکت کند و توسط موتور فیزیک پرتاب نشود؛ `CharacterBody2D` دقیقاً برای همین ساخته شده. گرانش را دستی به `velocity.y` اضافه می‌کنیم و متد `move_and_slide()` برخورد و لغزش روی دیوارها را خودکار مدیریت می‌کند.

## ۳. کد کامل (GDScript) {: #code }

این اسکریپت را روی یک نود `CharacterBody2D` بگذارید. در تنظیمات پروژه (Project Settings → Input Map) سه اکشن با نام‌های `move_left`، `move_right` و `jump` تعریف کنید.

```gdscript
extends CharacterBody2D

@export var speed: float = 300.0
@export var jump_velocity: float = -400.0
@export var gravity: float = 980.0

func _physics_process(delta: float) -> void:
    # افزودن گرانش وقتی روی زمین نیستیم
    if not is_on_floor():
        velocity.y += gravity * delta

    # پرش فقط از روی زمین
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_velocity

    # حرکت افقی
    var direction := Input.get_axis("move_left", "move_right")
    if direction != 0.0:
        velocity.x = direction * speed
    else:
        velocity.x = move_toward(velocity.x, 0.0, speed)

    move_and_slide()
```

## ۴. تست پذیرش {: #test }

**پیش‌نیازها:** نود `CharacterBody2D` با کد بالا روی یک نود `StaticBody2D` افقی (زمین)، مقادیر پیش‌فرض اسکریپت.

**خروجی مورد انتظار (پرش):** با `gravity = 980` و `jump_velocity = -400`، زمان رسیدن به بالاترین نقطه باید `0.408` ثانیه باشد و ارتفاع پرش حداکثر `~82` پیکسل:

```text
t_apex  = |jump_velocity| / gravity = 400 / 980  ≈ 0.41 s
h_max   = v² / (2·g)             = 160000 / 1960 ≈ 81.6 px
```

**بررسی نتایج:**

- با نگه‌داشتن کلید حرکت، کاراکتر باید دقیقاً `300 px/s` جابه‌جا شود (اندازه‌گیری: یک ثانیه حرکت = ۳۰۰ پیکسل).
- در هنگام پرش، سرعت افقی نباید تغییر کند (کند یا تند نشود).
- پس از فرود، `is_on_floor()` باید `true` شود و پرش دوباره ممکن باشد.
- روی دیوار فشار داده شود: کاراکتر باید لغزشی بایستد، نه اینکه تکان بخورد یا داخل دیوار برود.

## ۵. حالت‌های شکست (Failure Modes) {: #failures }

**فراخوانی `move_and_slide()` در `_process`:**
حرکت باید در `_physics_process(delta)` انجام شود؛ در `_process` نرخ فریم روی فیزیک اثر می‌گذارد و رفتار روی دستگاه‌های مختلف ناسازگار می‌شود.

**استفاده از `is_action_pressed` برای پرش:**
با نگه‌داشتن کلید پرش، کاراکتر مدام می‌پرد. برای پرش باید `is_action_just_pressed` استفاده شود تا فقط یک بار در هر فشردن ثبت شود.

**حرکت بدون `move_toward`:**
اگر به‌جای `move_toward` مستقیماً `velocity.x = 0` بگذارید، کاراکتر به‌صورت ناگهانی می‌ایستد و حس اسنیپ (snapping) ناخوشایند می‌دهد.

**پرش قبل از نخستین `move_and_slide`:**
`is_on_floor()` بر اساس برخورد فریم قبل است؛ در فریم اول روی هوا، همیشه `false` است. این طبیعی است و نباید برای «رفع» آن کد افزودن پرش غیرمشروط نوشت.
