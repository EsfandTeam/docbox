---
layout: default
title: ذخیره و بارگذاری بازی با JSON در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 4
---

# ذخیره و بارگذاری بازی با JSON در Godot 4

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

این مستند بر اساس آموزش رسمی «Saving games» مستندات Godot تدوین شده است — [Saving games — Godot Docs](https://docs.godotengine.org/en/stable/tutorials/io/saving_games.html). پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل است.

## ۲. خلاصه اجرایی {: #summary }

برای ذخیره‌ی پیشرفت بازی، داده‌ها را در یک `Dictionary` ساده جمع کنید، با `JSON.stringify` به متن تبدیل و با `FileAccess` در مسیر `user://` بنویسید. مسیر `user://` در ویندوز و مک و لینوکس به پوشه‌ی داده‌ی کاربر (قابل‌نوشتن در همه سیستم‌عامل‌ها) نگاشت می‌شود — هرگز در `res://` فایل ننویسید، چون بعد از export فقط-خواندنی است.

## ۳. کد کامل (GDScript) {: #code }

```gdscript
const SAVE_PATH := "user://save.json"

func save_game(data: Dictionary) -> void:
    var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if file == null:
        push_error("باز کردن فایل ذخیره ناموفق بود: %s" % FileAccess.get_open_error())
        return
    file.store_string(JSON.stringify(data, "\t"))
    file.close()

func load_game() -> Dictionary:
    if not FileAccess.file_exists(SAVE_PATH):
        return {}
    var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
    if file == null:
        return {}
    var parsed = JSON.parse_string(file.get_as_text())
    file.close()
    if typeof(parsed) != TYPE_DICTIONARY:
        push_error("فایل ذخیره خراب است")
        return {}
    return parsed
```

**نمونه استفاده:**

```gdscript
var player_state := {"level": 3, "coins": 250, "position": {"x": 120.0, "y": 45.0}}
save_game(player_state)

var loaded := load_game()
print(loaded["level"])  # 3
```

## ۴. تست پذیرش {: #test }

**پیش‌نیازها:** هیچ نود خاصی لازم نیست؛ اسکریپت را روی یک نود دلخواه بگذارید و دو دکمه/کلید برای ذخیره و بارگذاری ببندید.

**ورودی:** `{"level": 3, "coins": 250}`

**خروجی مورد انتظار:**

```text
save_game({"level": 3, "coins": 250})
→ فایل user://save.json ساخته می‌شود
→ مسیر واقعی: OS.get_user_data_dir() + "/save.json"

load_game() پس از اجرای دوباره بازی
→ {"level": 3, "coins": 250}   (برابری کامل دیکشنری)
```

**بررسی نتایج:**

- پس از ذخیره، فایل باید در مسیر چاپ‌شده‌ی `OS.get_user_data_dir()` وجود داشته باشد.
- پس از بستن و اجرای دوباره‌ی بازی، `load_game()` باید دقیقاً همان دیکشنری را برگرداند.
- اگر فایل پاک شده باشد، `load_game()` باید `{}` برگرداند — نه کرش.

## ۵. حالت‌های شکست (Failure Modes) {: #failures }

**`JSON.parse_string` روی متن خراب:**
اگر فایل ناقص یا دستکاری‌شده باشد، `parse_string` مقدار `null` برمی‌گرداند — نه استثنا. بدون چکِ `typeof`، دسترسی به کلیدها کرش می‌کند.

**عدد صحیح به اعشار تبدیل می‌شود:**
JSON نوع int ندارد؛ همه‌ی اعداد به‌صورت float برگردانده می‌شوند. اگر منطق بازی به int حساس است، هنگام خواندن `int(value)` کنید.

**ذخیره‌ی آبجکت‌های Godot در JSON:**
نودها و `Vector2` به‌صورت مستقیم سریالایز نمی‌شوند. فقط انواع پایه (int/float/String/Array/Dictionary) را ذخیره کنید؛ وکتورها را به دیکشنری یا دو عدد جدا تبدیل کنید.

**نوشتن در `res://`:**
پس از export پروژه، `res://` فقط-خواندنی است و نوشتن در آن شکست می‌خورد. همیشه `user://`.

**ذخیره‌ی بدون محافظت:**
`user://save.json` با یک ادیتور متنی قابل‌ویرایش است (تقلب/cheat). برای جلوگیری از ویرایش ساده، از `FileAccess.open_encrypted_with_pass(SAVE_PATH, FileAccess.WRITE, password)` استفاده کنید.
