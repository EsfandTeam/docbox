---
layout: default
title: پخش صدا در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 7
---

# پخش صدا و جلوه‌های صوتی در Godot 4

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

این مستند بر اساس مستندات کلاس رسمی `AudioStreamPlayer` و آموزش صوت مستندات Godot تدوین شده است — [AudioStreamPlayer — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_audio_stream_player.html). پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل است.

## ۲. خلاصه اجرایی {: #summary }

برای موسیقی و جلوه‌های صوتی در Godot 4 از `AudioStreamPlayer` (صوت دوبعدی از رابط کاربری/بدون موقعیت)، `AudioStreamPlayer2D` (صوت مکانی در دنیا) و `AudioStreamPlayer3D` (صوت سه‌بعدی) استفاده کنید. بلندی صدا با `volume_db` بر حسب دسی‌بل تنظیم می‌شود (نه درصد!) و گام صدا با `pitch_scale` ضرب می‌شود — هم سرعت هم زیربایی را تغییر می‌دهد، پس برای واریانس جلوه‌های صوتی ابزار ساده و مؤثری است.

## ۳. کد کامل (GDScript) {: #code }

**موسیقی پس‌زمینه با لوپ ساده:**

```gdscript
extends AudioStreamPlayer

@export var autoplay_music: bool = true

func _ready() -> void:
    if autoplay_music:
        volume_db = -6.0
        play()
        finished.connect(play)  # وقتی تمام شد، دوباره پخش کن
```

**جلوه صوتی با واریانس گام (خستگی صوتی را می‌کُشد):**

```gdscript
extends AudioStreamPlayer

@export var pitch_variance := 0.05  # ±۵٪

func play_sfx() -> void:
    pitch_scale = 1.0 + randf_range(-pitch_variance, pitch_variance)
    play()
```

## ۴. تست پذیرش {: #test }

**پیش‌نیازها:** یک `AudioStreamPlayer` با یک استریم وارد‌شده (مثلاً یک WAV دو ثانیه‌ای)، کد بالا.

**خروجی مورد انتظار:**

```text
volume_db = -6.0
→ دامنه‌ی صوت تقریباً نصف: 10^(−6/20) ≈ 0.501

pitch_scale = 2.0
→ استریم دو ثانیه‌ای باید در حدود ۱ ثانیه تمام شود (duration / pitch)
```

**بررسی نتایج:**

- موسیقی باید پس از تمام‌شدن، بدون وقفه دوباره پخش شود (سیگنال `finished`).
- `play_sfx()` با واریانس `±۵٪` باید هر بار کمی متفاوت به نظر برسد، ولی همان صدا شنیده شود.
- با `pitch_scale = 2.0`، زمان پخش باید نصف شود و زیربایی صداقت مشهود داشته باشد.

## ۵. حالت‌های شکست (Failure Modes) {: #failures }

**فراخوانی `play()` روی پلیر در حال پخش:**
پخش جاری ری‌استارت می‌شود. برای شلیک‌های سریع و پشت‌سرهم (تیراندازی)، یا `max_polyphony` را در Inspector بالا ببرید یا چند `AudioStreamPlayer` از یک استریم داشته باشید.

**بلندی صدا با درصد ذهنی:**
`volume_db = 50` «۵۰٪ بلندتر» نیست؛ دسی‌بل لگاریتمی است و مقدار مثبت بزرگ خروجی را بریده (clipping). برای کاهش صدا از مقادیر منفی استفاده کنید: هر `−6 dB` تقریباً نصف دامنه.

**نام باس اشتباه:**
اگر `bus` را به نامی ست کنید که در `AudioServer` وجود ندارد، صدا روی باس پیش‌فرض پخش می‌شود و فقط یک هشدار چاپ می‌شود — با `AudioServer.get_bus_index("Music")` قبل از ست کردن صحت نام را چک کنید.

**استریم خالی (null):**
اگر فایل صوتی هنوز import نشده باشد، `stream` برابر `null` است و `play()` کاری نمی‌کند. در `_ready` با `if stream == null: push_error(...)` وضعیت را چک کنید.

**انتخاب نود اشتباه:**
`AudioStreamPlayer` صوت مکانی ندارد؛ برای صدای قدم در دنیای بازی باید `AudioStreamPlayer2D` (دوبعدی) یا `AudioStreamPlayer3D` (سه‌بعدی) استفاده کنید تا فاصله و جهت صدا اعمال شود.
