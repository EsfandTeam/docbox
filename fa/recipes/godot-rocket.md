---
layout: default
title: فیزیک موشک در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 1
---

# پیاده‌سازی فیزیک موشک در Godot 4

> **وضعیت تأیید (Verification):** `automated` (تست شده در سندباکس)
> **نسخه موتور (Engine):** Godot 4.x
> **زبان:** GDScript
> **مجوز (License):** MIT

## ۱. منبع اصلی (Provenance)
این مستند بر اساس مفاهیم پایه‌ای فیزیک در مستندات رسمی Godot (تحت مجوز CC BY 3.0) تدوین شده است. پیاده‌سازی کد و تست پذیرش، حاصل بازنویسی و آزمایش مستقل در محیط Godot 4 است.

## ۲. خلاصه اجرایی
برای شبیه‌سازی حرکت یک موشک (یا هر وسیله نقلیه پرنده)، نباید مستقیماً به موقعیت (Position) یا سرعت (Velocity) دست بزنیم. بهترین روش استفاده از یک نود `RigidBody3D` و اعمال نیروی پیشران (Thrust) در هر فریم فیزیکی است. این کار باعث می‌شود موتور فیزیک Godot به صورت خودکار برخوردها، جرم (Mass) و درگ (Drag) را محاسبه کند.

## ۳. کد کامل (GDScript)
این اسکریپت را روی یک نود از نوع `RigidBody3D` قرار دهید. مطمئن شوید که جرم (Mass) نود در Inspector روی یک مقدار منطقی (مثلاً 10) تنظیم شده است.

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
		# استفاده از apply_central_force باعث می‌شود نیرو دقیقاً به مرکز جرم وارد شود (بدون ایجاد گشتاور ناخواسته)
		apply_central_force(-transform.basis.z * thrust_force)
		
		# کاهش سوخت بر اساس زمان سپری شده
		current_fuel -= fuel_burn_rate * delta

۴. تست پذیرش (Acceptance Test)
برای اطمینان از صحت فیزیک، این تست را اجرا کنید:

پیش‌نیاز: یک نود RigidBody3D با جرم 10، بدون گرانش (gravity_scale = 0)، با کد بالا.

ورودی: thrust_force = 500

خروجی مورد انتظار: طبق قانون دوم نیوتن (
F
=
m
a
F=ma)، شتاب اولیه باید دقیقاً 
50
 
m
/
s
2
50m/s 
2
  باشد.

بررسی: پس از گذشت ۱ ثانیه، سرعت موشک باید تقریباً ۵۰ متر بر ثانیه باشد و مقدار current_fuel باید به ۹۰ برسد. پس از اتمام سوخت، شتاب باید صفر شده و موشک با سرعت ثابت به حرکت ادامه دهد.

۵. حالت‌های شکست (Failure Modes)
ناپایداری عددی (Tunneling): اگر thrust_force را بسیار بالا ببرید (مثلاً 100,000) و نرخ تیک فیزیک (Physics Tick Rate) پایین باشد، ممکن است موشک در یک فریم از دیوار عبور کند. راه‌حل: افزایش نرخ تیک فیزیک یا استفاده از Continuous CD در تنظیمات RigidBody.

گشتاور ناخواسته: اگر به جای apply_central_force از apply_force استفاده کنید، نیرو به یک نقطه خاص وارد شده و موشک به دور خودش می‌چرخد.

اجرا در _process: اگر کد را در _process(delta) به جای _physics_process(delta) بنویسید، فیزیک موشک روی سیستم‌های مختلف با نرخ فریم متفاوت، رفتار متفاوتی خواهد داشت.
		
		# جلوگیری از منفی شدن سوخت
		if current_fuel <= 0.0:
			current_fuel = 0.0
