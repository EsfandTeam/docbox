---
layout: default
title: دوربین دنبال‌کننده در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 3
---

# دوربین دنبال‌کننده (Camera Follow) در Godot 4

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

این مستند بر اساس مستندات کلاس رسمی `Camera2D` در Godot 4 تدوین شده است — [Camera2D — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_camera2d.html). پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل است.

<h2 id="summary">۲. خلاصه اجرایی</h2>

برای دنبال کردن بازیکن، لرپ (lerp) دستی ننویسید — Godot 4 قابلیت داخلی `position_smoothing` را در `Camera2D` دارد که با نرخ به‌روزرسانی فیزیک هماهنگ است و لرزش (jitter) ندارد. برای جلوگیری از دیدن بیرون نقشه هم `limit_left/right/top/bottom` را تنظیم می‌کنیم؛ دوربین هیچ‌وقت از این مرزها خارج نمی‌شود.

<h2 id="code">۳. کد کامل (GDScript)</h2>

این اسکریپت را روی یک نود `Camera2D` بگذارید و آن را به‌عنوان فرزند نود بازیکن اضافه کنید (یا در صحنه مستقر کنید — `make_current()` در کد هست).

```gdscript
extends Camera2D

@export var follow_speed: float = 5.0

func _ready() -> void:
    # نرم‌سازی داخلی موتور — لرپ دستی ننویسید
    position_smoothing_enabled = true
    position_smoothing_speed = follow_speed

    # اگر هدف در _physics_process حرکت می‌کند، دوربین هم در تیک فیزیک به‌روز شود
    process_callback = Camera2D.PROCESS_CALLBACK_PHYSICS

    # مرزهای دنیا: دوربین بیرون این کادر را نشان نمی‌دهد
    limit_left = 0
    limit_top = 0
    limit_right = 2048
    limit_bottom = 1152

    make_current()
```

<h2 id="test">۴. تست پذیرش</h2>

**پیش‌نیازها:** دوربین با `follow_speed = 5.0`، بازیکن دور از دوربین، مرزهای دنیا فعال.

**خروجی مورد انتظار:** نرم‌سازی دوربین در Godot 4 نمایی (exponential decay) است؛ با اختلاف اولیه `200 px` و `speed = 5.0`، پس از `1` ثانیه باقی‌مانده‌ی فاصله باید حدود `1.35 px` باشد:

```text
gap(t) = gap₀ · e^(−speed·t)
gap(1) = 200 · e^(−5) ≈ 1.35 px
```

**بررسی نتایج:**

- دوربین باید بدون تاخیر محسوس و بدون لرزش، بازیکن را دنبال کند.
- بازیکن تا لبه‌ی نقشه برود: تصویر باید در `limit` متوقف شود، نه اینکه بیرون نقشه (پس‌زمینه خالی) دیده شود.
- با تغییر `follow_speed` به `2.0`، حرکت دوربین باید مشهوداً کندتر شود.

<h2 id="failures">۵. حالت‌های شکست (Failure Modes)</h2>

**لرپ دستی + فرزند بودن دوربین از بازیکن:**
اگر دوربین فرزند بازیکن باشد و باز هم دستی `global_position` را لرپ کنید، دو ترنسفورم روی هم اعمال می‌شود و دوربین «می‌پرد» یا دو برابر سرعت حرکت می‌کند. یا فرزند باشید یا لرپ دستی — هر دو نه.

**مرزها با زوم اشتباه گرفته می‌شوند:**
`limit_*` بر حسب پیکسل دنیا است، نه پیکسل صفحه. اگر `zoom` را تغییر دهید، مرزها جابه‌جا به‌نظر می‌رسند ولی مقدارشان ثابت است — مقدار را با زوم تنظیم نکنید.

**به‌روزرسانی در Idle به‌جای Physics:**
اگر بازیکن در `_physics_process` حرکت کند ولی دوربین در callback پیش‌فرض (idle) به‌روزرسانی شود، در فریم‌های بالای ۶۰ حرکت بازیکن «تکان‌خورده» دیده می‌شود. راه‌حل: `PROCESS_CALLBACK_PHYSICS`.

**فعال نبودن دوربین:**
اگر چند دوربین در صحنه باشد، آخرین دوربین `current` می‌شود. با `make_current()` مطمئن شوید دوربین درست فعال است.
