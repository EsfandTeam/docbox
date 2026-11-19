---
layout: default
title: انیمیشن با Tween در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 6
---

# انیمیشن با Tween در Godot 4

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

<h2 id="provenance">۱. منبع اصلی</h2>

این مستند بر اساس مستندات کلاس رسمی `Tween` و آموزش انیمیشن مستندات Godot تدوین شده است — [Tween — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_tween.html). پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل است.

<h2 id="summary">۲. خلاصه اجرایی</h2>

در Godot 4 برای انیمیشن‌های کوتاه (حرکت، محو‌شدگی، تغییر رنگ) از `create_tween()` استفاده کنید، نه `AnimationPlayer`. هر Tween یک زنجیره‌ی مرتب از انیمیشن‌هاست: هر `tween_property` بعد از تمام‌شدن قبلی اجرا می‌شود. Tween به نودِ سازنده گره خورده است — اگر نود حذف شود، Tween هم خودکار می‌میرد و نشتی حافظه رخ نمی‌دهد.

<h2 id="code">۳. کد کامل (GDScript)</h2>

**زنجیره‌ی ساده — حرکت و سپس محو شدن:**

```gdscript
extends Sprite2D

func _ready() -> void:
    var tween := create_tween()
    tween.tween_property(self, "position", position + Vector2(100, 0), 0.5)
    tween.tween_property(self, "modulate:a", 0.0, 0.3)
    tween.tween_callback(queue_free)
```

**انیمیشن موازی و حلقه‌ای — پرش‌های مکرر:**

```gdscript
func start_bounce() -> void:
    var y0 := position.y
    var bounce := create_tween().set_loops()
    bounce.tween_property(self, "position:y", y0 - 20.0, 0.25) \
        .set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
    bounce.tween_property(self, "position:y", y0, 0.25) \
        .set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
```

**اجرای هم‌زمان دو انیمیشن:**

```gdscript
func pop_in() -> void:
    var tween := create_tween().set_parallel(true)
    tween.tween_property(self, "scale", Vector2.ONE, 0.3)
    tween.tween_property(self, "modulate:a", 1.0, 0.3)
```

<h2 id="test">۴. تست پذیرش</h2>

**پیش‌نیازها:** یک `Sprite2D` با اسکریپت بالا.

**خروجی مورد انتظار (زنجیره‌ی ساده):** با `TRANS_LINEAR` (پیش‌فرض)، انیمیشن خطی است؛ پس از `0.25` ثانیه (نصف مدت) اسپرایت باید دقیقاً `50 px` جابه‌جا شده باشد:

```text
progress(0.25s) = 0.25 / 0.5 = 0.5
offset          = 100 · 0.5 = 50 px
```

**بررسی نتایج:**

- کل زنجیره باید `0.8` ثانیه طول بکشد (`0.5 + 0.3`) و بعد اسپرایت حذف شود (`queue_free`).
- در نسخه‌ی `set_loops`: پرش باید بی‌نهایت تکرار شود؛ با حذف نود، تکرار هم متوقف شود (بدون خطا در Output).
- در نسخه‌ی `set_parallel(true)`: تغییر `scale` و `alpha` باید هم‌زمان باشد، نه پشت‌سرهم.

<h2 id="failures">۵. حالت‌های شکست (Failure Modes)</h2>

**ساختن Tween در هر فریم:**
اگر `create_tween()` را داخل `_process` صدا بزنید، هر فریم یک Tween تازه ساخته می‌شود که هرکدام از نصفه‌ راه دوباره شروع می‌کنند — نتیجه: قفل‌شدگی ظاهری و CPU اضافه. Tween را یک بار بسازید.

**فری‌شدن نود مالک:**
Tween به نود سازنده گره خورده است؛ اگر نود حذف شود، انیمیشن بی‌صدا می‌میرد. اگر انیمیشن باید به‌کارش ادامه دهد، آن را روی نود دیگری بسازید (`get_tree().create_tween()` برای Tween مستقل از نود).

**زنجیره‌ی موازی ناخواسته:**
فراخوانی‌های پشت‌سرهم `tween_property` به‌صورت sequential اجرا می‌شوند. اگر هم‌زمانی می‌خواهید باید `set_parallel(true)` یا `.parallel()` صدا بزنید؛ اگر بعد از آن به حالت sequential برگردید، `.chain()` بزنید.

**مسیر پراپرتی غلط:**
`tween_property(self, "pos", ...)` با پیام خطای «invalid property» شکست می‌خورد (نام درست `position` است). مسیر باید دقیقاً نام پراپرتی نود باشد؛ برای پراپرتی‌های تو در تو از `"position:x"` استفاده کنید.
