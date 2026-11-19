---
layout: default
title: Audio Playback in Godot 4
parent: Recipes
nav_order: 7
---

# Audio Playback in Godot 4

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

<h2 id="provenance">1. Provenance</h2>

Based on the official `AudioStreamPlayer` class documentation — [AudioStreamPlayer — Godot Docs](https://docs.godotengine.org/en/stable/classes/class_audio_stream_player.html). Implementation and acceptance test are an independent rewrite verified in Godot 4.

<h2 id="summary">2. Summary</h2>

Use `AudioStreamPlayer` for UI/music sound, `AudioStreamPlayer2D` for positional sound in a 2D world, and `AudioStreamPlayer3D` for 3D worlds. Volume is set with `volume_db` in decibels (not a percentage!) and `pitch_scale` multiplies playback speed — changing both pitch and duration, which makes it a cheap tool for adding variance to repeated sound effects.

<h2 id="code">3. Full Code (GDScript)</h2>

**Background music with a simple loop:**

```gdscript
extends AudioStreamPlayer

@export var autoplay_music: bool = true

func _ready() -> void:
    if autoplay_music:
        volume_db = -6.0
        play()
        finished.connect(play)  # replay when finished
```

**Sound effect with pitch variance (kills audio fatigue):**

```gdscript
extends AudioStreamPlayer

@export var pitch_variance := 0.05  # ±5%

func play_sfx() -> void:
    pitch_scale = 1.0 + randf_range(-pitch_variance, pitch_variance)
    play()
```

<h2 id="test">4. Acceptance Test</h2>

**Prerequisites:** an `AudioStreamPlayer` with an imported stream (e.g. a 2-second WAV), using the script above.

**Expected output:**

```text
volume_db = -6.0
→ amplitude roughly halved: 10^(−6/20) ≈ 0.501

pitch_scale = 2.0
→ a 2-second stream finishes in about 1 second (duration / pitch)
```

**Verification:**

- Music restarts seamlessly via the `finished` signal.
- `play_sfx()` with `±5%` variance sounds slightly different each time but remains the same sound.
- With `pitch_scale = 2.0`, playback time halves and the pitch audibly rises.

<h2 id="failures">5. Failure Modes</h2>

**Calling `play()` on an already-playing player:**
The current playback restarts. For rapid repeated sounds (gunfire) either raise `max_polyphony` in the Inspector or use several players sharing one stream.

**Thinking volume is a percentage:**
`volume_db = 50` is not "50% louder"; decibels are logarithmic and large positive values clip the output. To reduce volume use negative values: every `−6 dB` is roughly half amplitude.

**Wrong bus name:**
Setting `bus` to a name that does not exist in `AudioServer` silently falls back to the default bus with only a warning. Validate with `AudioServer.get_bus_index("Music")` before assigning.

**Null stream:**
If the audio file is not imported yet, `stream` is `null` and `play()` does nothing. Check in `_ready` with `if stream == null: push_error(...)`.

**Wrong node type:**
`AudioStreamPlayer` has no spatialization; for footsteps in the game world use `AudioStreamPlayer2D` or `AudioStreamPlayer3D` so distance and direction apply.
