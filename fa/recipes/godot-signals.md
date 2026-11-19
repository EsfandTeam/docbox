---
layout: default
title: سیگنال‌های سفارشی در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 12
---

# سیگنال‌های سفارشی در Godot 4

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

این مستند بر اساس دو صفحه‌ی رسمی مستندات Godot تدوین شده است — بخش سیگنال‌های [GDScript basics — Godot Docs](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#signals) و مستندات کلاس [Object — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_object.html) (متدهای `connect`، `emit_signal` و پرچم‌های `ConnectFlags`). پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل است.

<h2 id="summary">۲. خلاصه اجرایی</h2>

برای ارتباط باز←دستگاه (مثلاً سلامت بازیکن به HUD) از سیگنال سفارشی استفاده کنید تا فرستنده لازم نداند چه کسی گوش می‌دهد: `signal health_changed(current: int, max: int)` در فرستنده، `emit` هنگام تغییر، و `connect` در گیرنده در `_ready`. این جداسازی (decoupling) یعنی می‌توانید HUD را عوض کنید بدون دست زدن به کد بازیکن. در صورت نیاز، اتصال را با `CONNECT_ONE_SHOT` یا `CONNECT_DEFERRED` تنظیم کنید.

<h2 id="code">۳. کد کامل (GDScript)</h2>

**فرستنده — نود سلامت با سیگنال تایپ‌دار:**

```gdscript
class_name Health
extends Node

signal health_changed(current: int, max: int)
signal died

@export var max_health: int = 100
var current_health: int = 100

func _ready() -> void:
    current_health = max_health

func take_damage(amount: int) -> void:
    current_health = maxi(0, current_health - amount)
    health_changed.emit(current_health, max_health)
    if current_health == 0:
        died.emit()

func heal(amount: int) -> void:
    current_health = mini(max_health, current_health + amount)
    health_changed.emit(current_health, max_health)
```

**گیرنده — HUD با اتصال در `_ready`:**

```gdscript
extends Label

var health: Health

func _ready() -> void:
    health = get_node("../../Player/Health")
    # CONNECT_DEFERRED: فراخوانی به پایان فریم موکول می‌شود تا وسط تغییرات فیزیک رخ ندهد
    health.health_changed.connect(_on_health_changed, CONNECT_DEFERRED)
    health.died.connect(_on_died, CONNECT_ONE_SHOT)
    _on_health_changed(health.current_health, health.max_health)

func _on_health_changed(current: int, max_value: int) -> void:
    text = "HP: %d / %d" % [current, max_value]

func _on_died() -> void:
    text = "GAME OVER"
```

**اتصال امن با بررسی نوع و قطع اتصال:**

```gdscript
func bind_hud(health_node: Health) -> void:
    if not health_node.health_changed.is_connected(_on_health_changed):
        health_node.health_changed.connect(_on_health_changed)

func unbind_hud(health_node: Health) -> void:
    health_node.health_changed.disconnect(_on_health_changed)
    health_node.died.disconnect(_on_died)
```

<h2 id="test">۴. تست پذیرش</h2>

**پیش‌نیازها:** نود بازیکن با فرزند `Health` و یک `Label` در HUD که با اسکریپت گیرنده وصل شده.

**خروجی مورد انتظار (انتشار با مقدار ۷۵ از ۱۰۰):** پس از فراخوانی `take_damage(25)` روی شخصیت با سلامت کامل، لیبل باید دقیقاً به‌روز شود:

```text
emit args            = (75, 100)
label.format         = "HP: %d / %d" % [75, 100]
label.text           = "HP: 75 / 100"
emit count per call  = 1
```

**بررسی نتایج:**

- پس از یک `take_damage(25)`، متن لیبل باید دقیقاً `"HP: 75 / 100"` باشد — نه بیشتر، نه کمتر.
- ادامه‌ی آسیب تا ۰ باید به ترتیب `HP: 50 / 100`، `HP: 25 / 100`، `HP: 0 / 100` و سپس یک بار `GAME OVER` (از `CONNECT_ONE_SHOT`) را نشان دهد.
- آسیب اضافه در سلامت صفر نباید متن را دوباره تغییر دهد؛ فقط `died` باید قبلاً یک بار منتشر شده باشد.
- `take_damage(-10)` نباید مقدار را از max بیشتر کند؛ `mini/maxi` باید مقدار را مهار کنند و همچنان دقیقاً یک emit داشته باشند.

<h2 id="failures">۵. حالت‌های شکست (Failure Modes)</h2>

**اتصال به نمونه‌ی آزادشده:**
اگر HUD به نود `Health` وصل باشد و بازیکن `queue_free` شود، اتصال خودکار قطع می‌شود؛ اما اگر Health خارج از درخت باشد (مثلاً نگه‌داری‌شده در autoload با WeakRef)، فراخوانی گیرنده‌ی مرده باعث خطای «previously freed instance» می‌شود. اتصال‌ها را در `_exit_tree` قطع کنید یا مطمئن شوید طول عمر فرستنده از گیرنده بیشتر نیست.

**اتصال‌های تکراری:**
صدا زدن چندباره‌ی `connect` همان تابع همان سیگنال، چند اتصال جداگانه می‌سازد و گیرنده چند بار در هر emit صدا زده می‌شود (در Godot 4 سیگنال‌ها چند订阅 دارند). قبل از اتصال، `is_connected` را بررسی کنید.

**ترتیب پارامترهای emit:**
`health_changed.emit(max_health, current_health)` آرگومان‌ها را جابه‌جا می‌فرستد و لیبل «HP: 100 / 75» نشان می‌دهد — بی‌صدا و گمراه‌کننده. امضای سیگنال را تایپ‌دار تعریف کنید و ترتیب آرگومان‌ها را با تست ثابت نگه دارید.

**سایت-افکت در هنگام emit داخل فیزیک:**
اگر `health_changed.emit` وسط `_physics_process` گیرنده را مستقیماً صدا بزند و گیرنده درخت صحنه را تغییر دهد (مثلاً افزودن نود)، خطای «Parent node is busy» می‌گیرید. برای این حالت‌ها از پرچم `CONNECT_DEFERRED` استفاده کنید تا فراخوانی به پایان فریم موکول شود.

