---
layout: default
title: بافر ورودی برای پرش در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 8
---

# بافر ورودی برای پرش در Godot 4

[← بازگشت به فهرست دستورپخت‌ها](../){: .back-link }

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

این مستند بر اساس آموزش رسمی `CharacterBody2D` مستندات Godot تدوین شده است — [CharacterBody2D — Godot Docs](https://docs.godotengine.org/en/stable/tutorials/2d/character_body_2d.html). ایده‌ی بافر ورودی الگوی شناخته‌شده‌ی بازی‌های پلتفرمری است؛ پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل است.

## ۲. خلاصه اجرایی {: #summary }

اگر بازیکن فقط در همان فریمی که `is_on_floor()` است کلید پرش را بفشارد، پرش حس «سفت» می‌دهد و ورودی‌های کمی زودتر نادیده گرفته می‌شوند. راه‌حل: هر بار `Input.is_action_just_pressed("jump")` درست بود، یک تایمر بافر (مثلاً `0.12` ثانیه) ریست کنید. در `_physics_process`، پرش فقط وقتی اجرا شود که شخصیت روی زمین باشد **و** بافر هنوز فعال باشد. نتیجه: فشردن کلید تا `0.12` ثانیه قبل از فرود هم پرش را فعال می‌کند.

## ۳. کد کامل (GDScript) {: #code }

**CharacterBody2D با بافر ورودی و coyote time:**

```gdscript
extends CharacterBody2D

const SPEED := 300.0
const JUMP_VELOCITY := -420.0
const BUFFER_WINDOW := 0.12  # ثانیه؛ در ۶۰fps معادل ۷ فریم است

var _jump_buffer := 0.0

func _physics_process(delta: float) -> void:
    if not is_on_floor():
        velocity += get_gravity() * delta

    # ثبت ورودی پرش در بافر — هر فریم که کلید تازه فشرده شده باشد
    if Input.is_action_just_pressed("jump"):
        _jump_buffer = BUFFER_WINDOW

    if _jump_buffer > 0.0:
        _jump_buffer -= delta

    var direction := Input.get_axis("move_left", "move_right")
    if direction:
        velocity.x = direction * SPEED
    else:
        velocity.x = move_toward(velocity.x, 0.0, SPEED)

    # پرش فقط وقتی روی زمین هستیم و بافر فعال است
    if is_on_floor() and _jump_buffer > 0.0:
        velocity.y = JUMP_VELOCITY
        _jump_buffer = 0.0

    move_and_slide()
```

**بافر عمومی‌تر با نود Timer (برای هر action):**

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

**استفاده در شخصیت (فراخوانی tick هر فریم فیزیک):**

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

## ۴. تست پذیرش {: #test }

**پیش‌نیازها:** صحنه‌ی CharacterBody2D با دیوار و زمین، اکشن‌های `jump`، `move_left`، `move_right` در Input Map تعریف شده باشند. بازی با ۶۰ فریم بر ثانیه اجرا شود (delta ≈ `0.01667` ثانیه).

**خروجی مورد انتظار (پرش با ورودی زودهنگام):** بازیکن را به‌گونه‌ای رها کنید که `0.10` ثانیه قبل از برخورد با زمین کلید پرش را فشار دهد. بافر باید هنوز فعال باشد و پرش در فریم فرود اجرا شود:

```text
buffer window   = 0.12 s
press lead time = 0.10 s  →  buffer remaining at landing = 0.12 - 0.10 = 0.02 s > 0
frames at 60fps = 0.12 / 0.01667 ≈ 7 frames of tolerance
result          = jump fires on the landing frame
```

**بررسی نتایج:**

- پرش باید درست در فریم فرود اجرا شود؛ `velocity.y` باید بلافاصله برابر `JUMP_VELOCITY` (-۴۲۰) شود.
- اگر کلید `0.13` ثانیه یا بیشتر قبل از فرود فشرده شود، پرش نباید اجرا شود (بافر منقضی شده).
- فشردن کلید در هوا **بدون** بافر نباید پرش ایجاد کند؛ پس از فرود هم نباید پرش رخ دهد اگر بافر مصرف شده یا منقضی شده باشد.
- لاگ debug بگذارید (`print("jump fired")`) و مطمئن شوید دقیقاً یک بار در فرود چاپ می‌شود، نه در هر فریم تماس.

## ۵. حالت‌های شکست (Failure Modes) {: #failures }

**کاهش بافر داخل `_process` به‌جای `_physics_process`:**
`_process` و `_physics_process` نرخ متفاوتی دارند؛ اگر delta را در `_process` کم کنید و پرش را در فیزیک بررسی کنید، بافر با سرعت اشتباهی خالی می‌شود و در ۱۴۴fps عملاً نصف پنجره‌ی تحمل را از دست می‌دهید. بافر و مصرف آن هر دو باید در فیزیک باشند.

**مصرف نکردن بافر بعد از پرش:**
اگر بعد از اجرای پرش `_jump_buffer = 0.0` نکنید، تا پایان پنجره در هر فریمی که روی زمین هستید پرش دوباره تریگر می‌شود (پرش‌های پشت‌سرهم). همیشه پس از مصرف، بافر را صفر کنید.

**نام اکشن اشتباه یا تعریف‌نشده:**
`Input.is_action_just_pressed("jupm")` (غلط املایی) باعث می‌شود شرط هرگز درست نشود و خطا هم در بعضی نسخه‌ها فقط هشدار runtime است. اکشن‌ها را قبل از تست در Project Settings → Input Map تعریف کنید و از `InputMap.has_action` برای اطمینان استفاده کنید.

**بافر برای حرکت افقی:**
بافر برای اکشن‌های لحظه‌ای (پرش، حمل، تعامل) مناسب است نه اکشن‌های پیوسته (دویدن). اگر `move_right` را بافر کنید، شخصیت تا `0.12` ثانیه بعد از رهاکردن کلید به راه رفتن ادامه می‌دهد و کنترل «چسبناک» حس می‌شود.

