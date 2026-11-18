---
layout: default
title: فیزیک موشک در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 1
---

# پیاده‌سازی فیزیک موشک در Godot 4

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

## ۱. منبع اصلی (Provenance) {: #provenance }

این مستند بر اساس مفاهیم پایه‌ای فیزیک در مستندات رسمی Godot (تحت مجوز CC BY 3.0) تدوین شده است. پیاده‌سازی کد و تست پذیرش، حاصل بازنویسی و آزمایش مستقل در محیط Godot 4 است.

## ۲. خلاصه اجرایی {: #summary }

برای شبیه‌سازی حرکت یک موشک (یا هر وسیله نقلیه پرنده)، نباید مستقیماً به موقعیت (Position) یا سرعت (Velocity) دست بزنیم. بهترین روش استفاده از یک نود `RigidBody3D` و اعمال نیروی پیشران (Thrust) در هر فریم فیزیکی است. این کار باعث می‌شود موتور فیزیک Godot به صورت خودکار برخوردها، جرم (Mass) و درگ (Drag) را محاسبه کند.

## ۳. کد کامل (GDScript) {: #code }

این اسکریپت را روی یک نود از نوع `RigidBody3D` قرار دهید. مطمئن شوید که جرم (Mass) نود در Inspector روی یک مقدار منطقی (مثلاً ۱۰) تنظیم شده است.

```gdscript
extends RigidBody3D

# نیروی پیشران (نیوتن)
@export var thrust_force: float = 500.0
# نرخ مصرف سوخت در ثانیه
@export var fuel_burn_rate: float = 10.0
# مقدار سوخت اولیه
@export var max_fuel: float = 100.0

var current_fuel: float

func _ready() -> void:
    current_fuel = max_fuel

func _physics_process(delta: float) -> void:
    if current_fuel > 0.0:
        # اعمال نیرو در جهت محور Z- (رو به جلوی موشک در Godot)
        # استفاده از apply_central_force باعث می‌شود نیرو دقیقاً به مرکز جرم
        # وارد شود (بدون ایجاد گشتاور ناخواسته)
        apply_central_force(-transform.basis.z * thrust_force)

        # کاهش سوخت بر اساس زمان سپری شده
        current_fuel -= fuel_burn_rate * delta

        # جلوگیری از منفی شدن سوخت
        if current_fuel <= 0.0:
            current_fuel = 0.0
```

## ۴. تست پذیرش (Acceptance Test) {: #test }

برای اطمینان از صحت فیزیک، این تست را اجرا کنید:

**پیش‌نیازها:** یک نود `RigidBody3D` با جرم `10`، بدون گرانش (`gravity_scale = 0`)، با کد بالا.

**ورودی:** `thrust_force = 500`

**خروجی مورد انتظار:** طبق قانون دوم نیوتن (`F = m · a`)، شتاب اولیه باید دقیقاً برابر با `50 m/s²` باشد:

```text
F = m · a
500 = 10 · a
a = 50 m/s²
```

**بررسی نتایج:**

- پس از گذشت ۱ ثانیه، سرعت موشک باید تقریباً `50 m/s` باشد.
- مقدار `current_fuel` باید به `90` برسد.
- پس از اتمام سوخت، شتاب باید صفر شده و موشک با سرعت ثابت به حرکت ادامه دهد (قانون اول نیوتن).

## ۵. حالت‌های شکست (Failure Modes) {: #failures }

**ناپایداری عددی (Tunneling):**
اگر `thrust_force` را بسیار بالا ببرید (مثلاً `100,000`) و نرخ تیک فیزیک (Physics Tick Rate) پایین باشد، ممکن است موشک در یک فریم از دیوار عبور کند.
**راه‌حل:** افزایش نرخ تیک فیزیک یا استفاده از Continuous CD در تنظیمات `RigidBody`.

**گشتاور ناخواسته:**
اگر به جای `apply_central_force` از `apply_force` استفاده کنید، نیرو به یک نقطه خاص وارد شده و موشک به دور خودش می‌چرخد.

**اجرا در `_process`:**
اگر کد را در `_process(delta)` به جای `_physics_process(delta)` بنویسید، فیزیک موشک روی سیستم‌های مختلف با نرخ فریم متفاوت، رفتار متفاوتی خواهد داشت.
