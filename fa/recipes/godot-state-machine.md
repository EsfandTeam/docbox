---
layout: default
title: ماشین حالت ساده در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 10
---

# ماشین حالت ساده در Godot 4

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

این مستند بر اساس راهنمای رسمی مبانی GDScript تدوین شده است — [GDScript basics — Godot Docs](https://docs.godotengine.org/en/stable/getting_started/scripting/gdscript/gdscript_basics.html) (بخش‌های `match` و `enum`). پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل است.

## ۲. خلاصه اجرایی {: #summary }

برای شخصیت‌هایی با چند رفتار متمایز (ایستاده، دویدن، پرش)، به‌جای پرچم‌های بولی متعدد که با هم تناقض پیدا می‌کنند، از یک `enum` برای حالت‌ها و `match` در `_physics_process` استفاده کنید. در هر فریم فقط یک حالت فعال است و هر حالت ورودی و فیزیک مخصوص خودش را دارد. گذارها در یک تابع کوچک متمرکز می‌شوند تا رفتار قابل پیش‌بینی و قابل تست باشد.

## ۳. کد کامل (GDScript) {: #code }

**ماشین حالت با enum + match روی CharacterBody2D:**

```gdscript
extends CharacterBody2D

enum State { IDLE, RUN, JUMP }

const SPEED := 300.0
const JUMP_VELOCITY := -420.0
const ACCEL := 1800.0
const DECEL := 2200.0

var state: State = State.IDLE

func _physics_process(delta: float) -> void:
    var direction := Input.get_axis("move_left", "move_right")

    match state:
        State.IDLE:
            velocity.x = move_toward(velocity.x, 0.0, DECEL * delta)
            if not is_on_floor():
                state = State.JUMP
            elif direction != 0.0:
                state = State.RUN
            elif Input.is_action_just_pressed("jump"):
                _do_jump()

        State.RUN:
            velocity.x = move_toward(velocity.x, direction * SPEED, ACCEL * delta)
            if not is_on_floor():
                state = State.JUMP
            elif direction == 0.0:
                state = State.IDLE
            elif Input.is_action_just_pressed("jump"):
                _do_jump()

        State.JUMP:
            velocity.x = move_toward(velocity.x, direction * SPEED, ACCEL * delta * 0.6)
            if is_on_floor():
                state = State.RUN if direction != 0.0 else State.IDLE

    if not is_on_floor():
        velocity += get_gravity() * delta

    move_and_slide()
```

**تابع گذار متمرکز با گارد گذار تکراری:**

```gdscript
func _do_jump() -> void:
    if state == State.JUMP or not is_on_floor():
        return
    velocity.y = JUMP_VELOCITY
    _change_state(State.JUMP)

func _change_state(new_state: State) -> void:
    if new_state == state:
        return  # گذار تکراری را نادیده بگیر
    state = new_state
```

**نمایش وضعیت فعلی برای دیباگ:**

```gdscript
func _process(_delta: float) -> void:
    $StateLabel.text = State.keys()[state]
```

## ۴. تست پذیرش {: #test }

**پیش‌نیازها:** صحنه‌ی CharacterBody2D با زمین و پرتگاه؛ اکشن‌های `jump`، `move_left`، `move_right` تعریف شده باشند؛ یک `StateLabel` برای نمایش حالت.

**جدول گذارهای مورد انتظار:**

```text
from  | condition                        | to
------+----------------------------------+------
IDLE  | direction != 0 and on floor      | RUN
IDLE  | jump pressed and on floor        | JUMP
IDLE  | leaves floor (walked off ledge)  | JUMP
RUN   | direction == 0 and on floor      | IDLE
RUN   | jump pressed and on floor        | JUMP
JUMP  | lands and direction != 0         | RUN
JUMP  | lands and direction == 0         | IDLE
any   | same-state transition requested  | ignored (no change)
```

**بررسی نتایج:**

- راه رفتن از حالت IDLE باید دقیقاً در همان فریمی که `direction` غیرصفر می‌شود، برچسب را به `RUN` تغییر دهد.
- از لبه‌ی پرتگاه راه رفتن باید حالت را به `JUMP` ببرد **بدون** فشردن کلید پرش و بدون پرش (velocity.y صفر شروع می‌شود و گرانش عمل می‌کند).
- فشردن پرش در حالت JUMP نباید هیچ تغییری ایجاد کند (گارد `_do_jump`).
- پس از فرود، حالت باید بلافاصله RUN یا IDLE شود، هرگز JUMP باقی نماند.

## ۵. حالت‌های شکست (Failure Modes) {: #failures }

**گذار تکراری یا چرخه‌ای:**
اگر چند شاخه در یک فریم هم‌زمان شرط گذار را درست کنند (مثلاً هم `direction != 0` و هم `jump pressed`)، آخرین شرط برنده می‌شود و رفتار ممکن است بین حالت‌ها لرزش داشته باشد. ترتیب شاخه‌ها را مشخص کنید و از گارد `new_state == state` استفاده کنید.

**فراموش‌کردن حالت JUMP هنگام سقوط از لبه:**
اگر فقط با فشردن کلید پرش وارد حالت JUMP شوید، سقوط از پرتگاه شخصیت را در IDLE/RUN با `is_on_floor() == false` رها می‌کند و ورودی‌های مخصوص هوا (کنترل کمتر) اعمال نمی‌شوند. هر گذار به هوا باید حالت را به JUMP ببرد.

**دستکاری مستقیم velocity بیرون از حالت:**
اگر کد دیگری (مثلاً ضربه‌خوردن) مستقیماً `velocity.y` را تغییر دهد، ماشین حالت از وضعیت واقعی بی‌خبر می‌ماند — شخصیت در IDLE معلق می‌ماند در حالی که در هوا است. همه‌ی تغییرات فیزیکی را از داخل شاخه‌ی حالت یا از طریق توابع گذار انجام دهید.

**استفاده از رشته به‌جای enum:**
مقایسه‌ی `state == "jump"` با `var state: String` اجازه‌ی حالت‌های بی‌معنا مثل `"jupm"` می‌دهد و در compile-time خطا نمی‌گیرد. همیشه `enum State` و نوع‌دهی `var state: State` استفاده کنید.

