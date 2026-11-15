# پیاده‌سازی فیزیک موشک در Godot 4

**وضعیت تأیید:** `verification: automated` (تست شده در محیط سندباکس)
**نسخه موتور:** Godot 4.x
**مجوز کد:** MIT

## ۱. منبع اصلی
این مستند بر اساس مفاهیم موجود در مستندات رسمی Godot (CC BY 3.0) و پیاده‌سازی‌های تست‌شده جامعه توسعه‌دهندگان تدوین شده است. 
*(در نسخه‌های بعدی، لینک دقیق به منبع اضافه می‌شود.)*

## ۲. خلاصه اجرایی
برای شبیه‌سازی حرکت موشک، به جای تغییر مستقیم موقعیت (Position)، از نیروهای فیزیکی روی یک `RigidBody3D` استفاده می‌کنیم تا موتور فیزیک Godot برخوردها و درگ (Drag) را به درستی محاسبه کند.

## ۳. کد کامل (GDScript)
این اسکریپت را به یک نود از نوع `RigidBody3D` متصل کنید:

```gdscript
extends RigidBody3D

@export var thrust_force: float = 500.0
@export var fuel_burn_rate: float = 10.0
var current_fuel: float = 100.0

func _physics_process(delta):
    if current_fuel > 0:
        # اعمال نیرو در جهت محور Z محلی (رو به جلو)
        apply_central_force(-transform.basis.z * thrust_force)
        current_fuel -= fuel_burn_rate * delta
    else:
        thrust_force = 0.0
