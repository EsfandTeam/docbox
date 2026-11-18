---
layout: default
title: Typewriter Dialogue System in Godot 4
parent: Recipes
nav_order: 11
---

# Typewriter Dialogue System in Godot 4

[← Back to recipe index](../){: .back-link }

<table class="recipe-meta">
  <tr><th>Verification</th><td><span class="badge badge-verified">human-verified</span></td></tr>
  <tr><th>Engine</th><td>Godot 4.x (minimum 4.0)</td></tr>
  <tr><th>Language</th><td>GDScript</td></tr>
  <tr><th>License</th><td>MIT</td></tr>
  <tr><th>Last tested</th><td>2026-11-17</td></tr>
</table>

<nav class="toc-card">
  <a href="#provenance">Provenance</a> · <a href="#summary">Summary</a> · <a href="#code">Full Code</a> · <a href="#test">Acceptance Test</a> · <a href="#failures">Failure Modes</a>
</nav>

## 1. Provenance {: #provenance }

Based on the official `RichTextLabel` class documentation — [RichTextLabel — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_richtextlabel.html) (the `visible_ratio` property). Implementation and acceptance test are an independent rewrite verified in Godot 4.

## 2. Executive Summary {: #summary } {: #summary }

A minimal dialogue system needs three things: an array of lines, a typewriter that reveals text gradually via `visible_ratio`, and a Next key that either skips the typewriter (show the full line instantly) or advances to the next line. When the last line ends, the `dialogue_finished` signal is emitted so the player regains control. No other node needs to know dialogue internals — only the signal.

## 3. Full Code (GDScript) {: #code }

**Dialogue core with typewriter:**

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
            label.visible_ratio = 1.0    # skip the typewriter
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

**Triggering dialogue from an NPC (the signal releases player control):**

```gdscript
extends Area2D

@onready var dialogue := get_tree().current_scene.get_node("DialogueBox")

func _ready() -> void:
    dialogue.dialogue_finished.connect(_on_dialogue_finished)

func _on_body_entered(body: Node2D) -> void:
    if body.is_in_group("player"):
        dialogue.start(PackedStringArray([
            "Hello, traveler. The roads are dangerous tonight.",
            "If you head east, take this sword."
        ]))

func _on_dialogue_finished() -> void:
    print("player regained control")
```

**Preventing player movement during dialogue:**

```gdscript
func _physics_process(delta: float) -> void:
    if get_tree().current_scene.get_node("DialogueBox").visible:
        return  # ignore player input
    # ... normal character control ...
    move_and_slide()
```

## 4. Acceptance Test {: #test }

**Prerequisites:** a `DialogueBox` with a `RichTextLabel` and two test lines; the default `ui_accept` action enabled.

**Expected output (typewriter):** a line of 40 characters at 30 characters per second must be fully visible after `1.333` seconds:

```text
line length          = 40 chars
speed                = 30 chars/s
time to full reveal  = 40 / 30 = 1.333 s
visible_ratio delta  = per-frame increment = 30 / 40 = 0.75 per second
                     = 0.0125 per frame at 60 fps
```

**Verification:**

- After `start()`, half a second later (0.5 × 30 = 15 characters) `visible_ratio` must be exactly `0.375`.
- Pressing Next mid-typewriter must reveal the full line instantly; pressing again must start the next line at ratio zero.
- After the last line plus one more press, `dialogue_finished` must be emitted exactly once and the box hidden.
- While the box is visible the player must not be able to move; movement must resume immediately after the signal.

## 5. Failure Modes {: #failures }

**Division by zero on empty lines:**
If a line is an empty string, `float(label.text.length())` is zero and the ratio increment raises a division-by-zero error. Filter empty lines before playing or use `maxi(1, text.length())` for the length.

**The Next key leaking to the player:**
If interacting with the NPC uses the same key as Next, the very press that opens the dialogue instantly skips or advances the first line. Ignore input for one frame with a `_just_opened` flag, or call `set_input_as_handled()`.

**Signal connected multiple times:**
If the NPC area re-runs `dialogue_finished.connect(...)` on every body entry, connections pile up and the receiver fires several times per dialogue end. Connect once in `_ready`, or check `is_connected` first.

**BBCode broken by visible_ratio:**
If the text contains BBCode like `[b]` with `bbcode_enabled` on, a fractional ratio can half-reveal tags, garbling the text or showing raw markup. Keep formatting tags at line starts, or drive `visible_characters` counting tag-free characters instead.

