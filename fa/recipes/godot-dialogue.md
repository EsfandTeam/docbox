---
layout: default
title: سیستم دیالوگ با تایپ‌رایتر در Godot 4
parent: دستورپخت‌ها (Recipes)
nav_order: 11
---

# سیستم دیالوگ با تایپ‌رایتر در Godot 4

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

این مستند بر اساس مستندات کلاس رسمی `RichTextLabel` تدوین شده است — [RichTextLabel — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_richtextlabel.html) (پراپرتی `visible_ratio`). پیاده‌سازی و تست پذیرش، بازنویسی و آزمایش مستقل است.

<h2 id="summary">۲. خلاصه اجرایی</h2>

یک سیستم دیالوگ حداقلی سه چیز لازم دارد: آرایه‌ای از خطوط، تایپ‌رایتر که با `visible_ratio` متن را به‌تدریج آشکار می‌کند، و کلید Next که یا تایپ‌رایتر را رد می‌کند (کل خط فوراً نمایش داده شود) یا به خط بعدی می‌رود. با اتمام آخرین خط، سیگنال `dialogue_finished` منتشر می‌شود تا بازیکن کنترل بازی را پس بگیرد. هیچ نود دیگری نیازی به دانستن جزئیات دیالوگ ندارد — فقط سیگنال.

<h2 id="code">۳. کد کامل (GDScript)</h2>

**هسته‌ی دیالوگ با تایپ‌رایتر:**

```gdscript
class_name DialogueBox
extends CanvasLayer

signal dialogue_finished

const CHARS_PER_SECOND := 30.0

var _lines: PackedStringArray = []
var _index := 0
var _revealing := false

@onready var label: RichTextLabel = $Panel/RichTextLabel

func start(lines: PackedStringArray) -> void:
    _lines = lines
    _index = 0
    visible = true
    _play_line()

func _play_line() -> void:
    label.text = _lines[_index]
    label.visible_ratio = 0.0
    _revealing = true

func _process(delta: float) -> void:
    if _revealing:
        label.visible_ratio += delta * CHARS_PER_SECOND / float(label.text.length())
        if label.visible_ratio >= 1.0:
            label.visible_ratio = 1.0
            _revealing = false

func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("ui_accept"):
        if _revealing:
            _revealing = false
            label.visible_ratio = 1.0    # رد کردن تایپ‌رایتر
        else:
            _advance()

func _advance() -> void:
    _index += 1
    if _index < _lines.size():
        _play_line()
    else:
        visible = false
        dialogue_finished.emit()
```

**اجرای دیالوگ از سمت NPC (تمام‌شدن دیالوگ کنترل بازی را آزاد می‌کند):**

```gdscript
extends Area2D

@onready var dialogue := get_tree().current_scene.get_node("DialogueBox")

func _ready() -> void:
    dialogue.dialogue_finished.connect(_on_dialogue_finished)

func _on_body_entered(body: Node2D) -> void:
    if body.is_in_group("player"):
        dialogue.start(PackedStringArray([
            "سلام، مسافر. جاده‌ها امشب خطرناک‌اند.",
            "اگر به سمت شرق می‌روی، شمشیرت را بگیر."
        ]))

func _on_dialogue_finished() -> void:
    print("player regained control")
```

**جلوگیری از حرکت بازیکن در طول دیالوگ:**

```gdscript
func _physics_process(delta: float) -> void:
    if get_tree().current_scene.get_node("DialogueBox").visible:
        return  # ورودی بازیکن را نادیده بگیر
    # ... کنترل عادی شخصیت ...
    move_and_slide()
```

<h2 id="test">۴. تست پذیرش</h2>

**پیش‌نیازها:** یک `DialogueBox` با `RichTextLabel` و دو خط تست؛ اکشن `ui_accept` پیش‌فرض فعال.

**خروجی مورد انتظار (تایپ‌رایتر):** خطی با ۴۰ کاراکتر با سرعت ۳۰ کاراکتر در ثانیه باید پس از `1.333` ثانیه کاملاً نمایان شود:

```text
line length          = 40 chars
speed                = 30 chars/s
time to full reveal  = 40 / 30 = 1.333 s
visible_ratio delta  = per-frame increment = 30 / 40 = 0.75 per second
                     = 0.0125 per frame at 60 fps
```

**بررسی نتایج:**

- پس از `start()`، نیم‌ثانیه بعد (۰.۵ × ۳۰ = ۱۵ کاراکتر) باید دقیقاً `visible_ratio = 0.375` باشد.
- فشردن Next وسط تایپ‌رایتر باید کل خط را فوراً نشان دهد؛ فشردن دوباره باید خط بعدی را با ratio صفر شروع کند.
- پس از آخرین خط و یک فشردن دیگر، `dialogue_finished` باید یک بار منتشر شود و جعبه مخفی شود.
- در حین دیالوگ بازیکن نباید بتواند حرکت کند؛ پس از سیگنال، حرکت باید فوراً از سر گرفته شود.

<h2 id="failures">۵. حالت‌های شکست (Failure Modes)</h2>

**تقسیم بر صفر در خط خالی:**
اگر یک خط رشته‌ی خالی باشد، `float(label.text.length())` صفر می‌شود و افزایش ratio باعث خطای تقسیم بر صفر می‌گردد. قبل از پخش، خطوط خالی را فیلتر کنید یا برای طول از `maxi(1, text.length())` استفاده کنید.

**مصرف شدن کلید Next برای بازیکن:**
اگر کلید تعامل با NPC همان کلید Next باشد، بلافاصله پس از شروع دیالوگ، همان فشردن کلید خط اول را رد می‌کند یا خط را می‌پراند. با یک پرچم `_just_opened` یک فریم ورودی را نادیده بگیرید یا از `set_input_as_handled()` استفاده کنید.

**سیگنال چندبار اتصال‌شده:**
اگر هر بار ورود به ناحیه‌ی NPC دوباره `dialogue_finished.connect(...)` اجرا شود، اتصال‌ها انباشته می‌شوند و پس از پایان دیالوگ، تابع گیرنده چند بار صدا زده می‌شود. اتصال را فقط یک بار در `_ready` انجام دهید یا قبل از اتصال، `is_connected` را بررسی کنید.

**BBCode خراب توسط visible_ratio:**
اگر متن شامل تگ‌های BBCode مثل `[b]` باشد و `bbcode_enabled` روشن باشد، ratio بخشی از تگ‌ها را نیمه‌آشکار می‌کند و متن به‌هم می‌ریزد یا تگ نمایش داده می‌شود. تگ‌های قالب‌بندی را فقط در ابتدای خط نگه دارید یا `visible_characters` را با شمارش کاراکترهای بدون تگ کنترل کنید.

