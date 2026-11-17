---
layout: default
title: Home
nav_exclude: true
---

<div class="hero">
  <p class="hero-kicker">A registry of executable knowledge for game engines</p>
  <h1>Code that is <span class="highlight-word">tested</span>, not code that "looks right"</h1>
  <p class="hero-sub">DocBox publishes tested, executable recipes for game engines — with acceptance tests, failure modes, and copy-paste-ready GDScript. A trust layer for AI agents.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="recipes/godot-rocket.md">Start: Rocket Physics</a>
    <a class="btn btn-ghost" href="../about.md">About DocBox</a>
  </div>
  <div class="hero-stats">
    <div class="stat"><b>7</b><span>recipes</span></div>
    <div class="stat"><b>Godot 4.x</b><span>engine</span></div>
    <div class="stat"><b>100%</b><span>human-verified</span></div>
  </div>
</div>

## How it works

<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <h3>Structured files</h3>
    <p>An agent fetches <b>llms.txt</b> or <b>recipes.json</b> and reads the catalog with <code>min_engine_version</code> and <code>requires</code> fields.</p>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <h3>Acceptance test</h3>
    <p>Every recipe ships a precise, measurable condition — concrete inputs and outputs — that proves the code works.</p>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <h3>Runnable code</h3>
    <p>Tested GDScript gets copied into the project, and failure modes clarify when the code should not be used.</p>
  </div>
</div>

## Recipes

<div class="cards">
  <a class="card" href="recipes/godot-2d-movement.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>2D Character Movement</h3>
    <p>Move and jump with <code>CharacterBody2D</code> and <code>move_and_slide</code> — with calculable jump height.</p>
    <div class="card-tags"><span>physics</span><span>2d</span><span>character</span></div>
  </a>
  <a class="card" href="recipes/godot-camera-follow.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Camera Follow</h3>
    <p>Native <code>Camera2D</code> smoothing with world limits — no hand-rolled lerp, no jitter.</p>
    <div class="card-tags"><span>camera</span><span>2d</span><span>smoothing</span></div>
  </a>
  <a class="card" href="recipes/godot-save-load-json.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Save/Load Games</h3>
    <p>Persist progress with <code>FileAccess</code> and JSON in the safe <code>user://</code> path — with error handling.</p>
    <div class="card-tags"><span>io</span><span>json</span><span>save</span></div>
  </a>
  <a class="card" href="recipes/godot-scene-transition.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Scene Transitions</h3>
    <p>Switch scenes with <code>change_scene_to_file</code> plus a fade effect — with error-code checks.</p>
    <div class="card-tags"><span>scenes</span><span>flow</span><span>ui</span></div>
  </a>
  <a class="card" href="recipes/godot-tween.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Tweens</h3>
    <p>Chained, parallel and looping animations with <code>create_tween</code> — no memory leaks.</p>
    <div class="card-tags"><span>animation</span><span>tween</span><span>ui</span></div>
  </a>
  <a class="card" href="recipes/godot-audio.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Audio Playback</h3>
    <p>Looping music and SFX with pitch variance — with decibels done right.</p>
    <div class="card-tags"><span>audio</span><span>sfx</span><span>music</span></div>
  </a>
  <a class="card" href="recipes/godot-rocket.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Rocket Physics</h3>
    <p>Thrust-based motion on <code>RigidBody3D</code> with fuel burn — per Newton's second law.</p>
    <div class="card-tags"><span>physics</span><span>3d</span><span>rigidbody</span></div>
  </a>
</div>

## Coming soon

<div class="cards">
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">Soon</span></div>
    <h3>Object Pooling</h3>
    <p>Manage bullets and particles with an object pool — no GC pressure.</p>
    <div class="card-tags"><span>performance</span><span>pattern</span></div>
  </div>
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">Soon</span></div>
    <h3>Input Buffer</h3>
    <p>Buffered key presses for responsive controls — the action-game standard.</p>
    <div class="card-tags"><span>input</span><span>pattern</span></div>
  </div>
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">Soon</span></div>
    <h3>Dialogue System</h3>
    <p>Typewriter conversations with branching choices.</p>
    <div class="card-tags"><span>ui</span><span>pattern</span></div>
  </div>
</div>

## For AI agents

If you are an agent, get the structured catalog with one HTTP request:

<div class="cards">
  <a class="card" href="../recipes.json">
    <div class="card-head"><span class="card-engine">JSON</span><span class="badge badge-automated">machine-readable</span></div>
    <h3>recipes.json</h3>
    <p>Full catalog with <code>min_engine_version</code>, <code>requires</code>, <code>conflicts</code> and per-recipe URLs.</p>
    <div class="card-tags"><span>api</span><span>json</span></div>
  </a>
  <a class="card" href="../llms.txt">
    <div class="card-head"><span class="card-engine">llmstxt.org</span><span class="badge badge-automated">machine-readable</span></div>
    <h3>llms.txt</h3>
    <p>A plain-text file following the llmstxt.org standard for fast LLM ingestion.</p>
    <div class="card-tags"><span>api</span><span>text</span></div>
  </a>
  <a class="card" href="../about.md">
    <div class="card-head"><span class="card-engine">Docs</span><span class="badge badge-verified">human-verified</span></div>
    <h3>About DocBox</h3>
    <p>The AI hallucination problem, our solution, and the anatomy of every recipe.</p>
    <div class="card-tags"><span>about</span></div>
  </a>
</div>
