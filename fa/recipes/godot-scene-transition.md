---
layout: default
title: انتقال بین صحنه‌ها در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 5
---

# انتقال بین صحنه‌ها (Scene Transition) در Godot 4

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

این مستند بر اساس آموزش رسمی «Change scenes manually» مستندات Godot تدوین شده است — [Change scenes manually — Godot Docs](https://docs.godotengine.org/en/stable/tutorials/scripting/change_scenes_manually.html). پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل است.

## ۲. خلاصه اجرایی {: #summary }

روش استاندارد تعویض صحنه در Godot 4 فراخوانی `get_tree().change_scene_to_file(path)` است. این متد فوری صحنه را عوض نمی‌کند: عملیات تا انتهای فریم جاری به تعویق می‌افتد (deferred) تا از حذف نودِ در حال اجرا وسط کد جلوگیری شود. برای جلوه‌ی حرفه‌ای، قبل از تعویض یک محو‌شدگی (fade) با Tween اضافه می‌کنیم.

## ۳. کد کامل (GDScript) {: #code }

**انتقال ساده — اسکریپت روی یک دکمه:**

```gdscript
extends Button

@export var next_scene_path := "res://scenes/level_2.tscn"

func _ready() -> void:
    pressed.connect(_on_pressed)

func _on_pressed() -> void:
    var err := get_tree().change_scene_to_file(next_scene_path)
    if err != OK:
        push_error("تعویض صحنه ناموفق بود: %s" % err)
```

**انتقال با محو‌شدگی (fade) — اسکریپت روی یک نود CanvasLayer با فرزند ColorRect به نام Fade:**

```gdscript
extends CanvasLayer

@export var next_scene_path := "res://scenes/level_2.tscn"

func _ready() -> void:
    var rect := get_node("Fade") as ColorRect
    rect.color.a = 0.0

func start_transition() -> void:
    var rect := get_node("Fade") as ColorRect
    var tween := create_tween()
    tween.tween_property(rect, "color:a", 1.0, 0.3)
    tween.tween_callback(func(): get_tree().change_scene_to_file(next_scene_path))
```

## ۴. تست پذیرش {: #test }

**پیش‌نیازها:** دو صحنه (`level_1.tscn` و `level_2.tscn`)، دکمه‌ای در صحنه‌ی اول با اسکریپت بالا.

**خروجی مورد انتظار:**

```text
کلیک روی دکمه
→ err == OK
→ در انتهای همان فریم، صحنه تعویض می‌شود
→ get_tree().current_scene.name == "Level2"
```

**بررسی نتایج:**

- بعد از کلیک، هیچ کرشی رخ نمی‌دهد و صحنه‌ی جدید به‌طور کامل لود می‌شود.
- در نسخه‌ی fade: صفحه در `0.3` ثانیه سیاه می‌شود، صحنه عوض می‌شود و سپس fade باید با ورود صحنه‌ی جدید ریست شود (فید-این در `_ready` صحنه‌ی جدید).
- مسیر اشتباه (فایل ناموجود): `err` باید غیرصفر باشد و پیام خطا در Output چاپ شود — بدون کرش.

## ۵. حالت‌های شکست (Failure Modes) {: #failures }

**مسیر بدون `res://`:**
مسیر باید کامل باشد؛ `"level_2.tscn"` بدون پیشوند `res://scenes/` پیدا نمی‌شود و `err` غیرصفر برمی‌گردد. خطا را چک کنید وگرنه تعویض بی‌صدا شکست می‌خورد.

**انتظار تعویض فوری:**
`change_scene_to_file` تا انتهای فریم صبر می‌کند. اگر بلافاصله بعد از فراخوانی `current_scene` را بخوانید، هنوز صحنه‌ی قبلی است. چک را در فریم بعد (مثلاً با یک تایمر یک‌فریمی) انجام دهید.

**حذف نود فراخوان وسط تعویض:**
اگر نودی که `change_scene_to_file` را صدا زده در همان فریم `queue_free` شود مشکلی نیست (عملیات deferred است)، ولی نتیجه‌ی فراخوانی‌های بعدی روی آن نود تعریف‌نشده است.

**استفاده از رشته در بازی نهایی:**
مسیر رشته‌ای در زمان اجرا lookup می‌شود و غلط املایی فقط هنگام کلیک فاش می‌شود. برای صحنه‌های ثابت، `change_scene_to_packed(preloaded_scene)` با `preload("res://...")` امن‌تر است.
