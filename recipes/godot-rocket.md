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
		
		# جلوگیری از منفی شدن سوخت
		if current_fuel <= 0.0:
			current_fuel = 0.0
