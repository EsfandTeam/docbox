---
layout: default
title: Home
nav_exclude: true
description: DocBox — tested, executable recipes for Godot 4 with acceptance tests and failure modes; a trust layer for AI agents
---

<div class="hero">
  <p class="hero-kicker">A registry of executable knowledge for game engines</p>
  <h1>Code that is <span class="highlight-word">tested</span>, not code that "looks right"</h1>
  <p class="hero-sub">Tested, executable recipes for Godot 4 — with acceptance tests, failure modes, and copy-paste-ready GDScript. A trust layer for AI agents.</p>
  <div class="hero-code">
    <div class="hero-code-bar"><i></i><i></i><i></i><span>terminal</span></div>
    <pre><code>$ curl -s https://esfandteam.github.io/docbox/recipes.json | jq '.[0]'
{
  "id": "godot-2d-movement",
  "verification": "human-verified",
  "min_engine_version": "4.0",
  "requires": ["CharacterBody2D"]
}</code></pre>
  </div>
  <div class="hero-actions">
    <a class="btn btn-primary" href="#library">Browse the library</a>
    <a class="btn btn-ghost" href="recipes/godot-2d-movement">Start: 2D Movement</a>
  </div>
  <div class="hero-stats">
    <div class="stat"><b>12</b><span>recipes</span></div>
    <div class="stat"><b>6</b><span>categories</span></div>
    <div class="stat"><b>Godot 4.x</b><span>engine</span></div>
    <div class="stat"><b>100%</b><span>human-verified</span></div>
  </div>
</div>

## Recipe Library {: #library }

<div class="lib-toolbar">
  <div class="lib-search">
    <input type="text" id="lib-search-input" class="lib-search-input" placeholder="Search: jump, camera, save, tween …" autocomplete="off">
  </div>
  <div class="filter-chips" id="lib-chips">
    <button class="chip active" data-cat="all"><span class="chip-count">12</span>All</button>
    <button class="chip" data-cat="movement"><span class="chip-count">3</span>Movement &amp; Control</button>
    <button class="chip" data-cat="physics"><span class="chip-count">1</span>Physics</button>
    <button class="chip" data-cat="ui"><span class="chip-count">3</span>Animation &amp; UI</button>
    <button class="chip" data-cat="data"><span class="chip-count">2</span>Data &amp; Audio</button>
    <button class="chip" data-cat="patterns"><span class="chip-count">3</span>Patterns</button>
  </div>
  <p class="lib-count" id="lib-count">12 recipes</p>
</div>

<div class="cards" id="lib-grid">

  <a class="card cat-movement" href="recipes/godot-2d-movement" data-cat="movement" data-text="2d character movement characterbody2d move_and_slide jump gravity physics">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>2D Character Movement</h3>
    <p>Move and jump with <code>CharacterBody2D</code> and <code>move_and_slide</code> — with calculable jump height.</p>
    <div class="card-tags"><span>physics</span><span>2d</span><span>character</span></div>
  </a>

  <a class="card cat-movement" href="recipes/godot-camera-follow" data-cat="movement" data-text="camera follow camera2d smoothing limits world jitter">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Camera Follow</h3>
    <p>Native <code>Camera2D</code> smoothing with world limits — no hand-rolled lerp, no jitter.</p>
    <div class="card-tags"><span>camera</span><span>2d</span><span>smoothing</span></div>
  </a>

  <a class="card cat-movement" href="recipes/godot-input-buffer" data-cat="movement" data-text="input buffer jump responsive action game feel forgiveness">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Input Buffer</h3>
    <p>Buffered key presses a few frames before landing — the responsiveness standard of action games.</p>
    <div class="card-tags"><span>input</span><span>jump</span><span>feel</span></div>
  </a>

  <a class="card cat-physics" href="recipes/godot-rocket" data-cat="physics" data-text="rocket physics rigidbody3d thrust fuel newton">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Rocket Physics</h3>
    <p>Thrust-based motion on <code>RigidBody3D</code> with fuel burn — per Newton's second law.</p>
    <div class="card-tags"><span>physics</span><span>3d</span><span>rigidbody</span></div>
  </a>

  <a class="card cat-ui" href="recipes/godot-tween" data-cat="ui" data-text="tween animation chained parallel loop fade create_tween">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Tweens</h3>
    <p>Chained, parallel and looping animations with <code>create_tween</code> — no memory leaks.</p>
    <div class="card-tags"><span>animation</span><span>tween</span><span>ui</span></div>
  </a>

  <a class="card cat-ui" href="recipes/godot-scene-transition" data-cat="ui" data-text="scene transition change_scene fade level switch">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Scene Transitions</h3>
    <p>Switch scenes with <code>change_scene_to_file</code> plus a fade effect — with error-code checks.</p>
    <div class="card-tags"><span>scenes</span><span>flow</span><span>ui</span></div>
  </a>

  <a class="card cat-ui" href="recipes/godot-dialogue" data-cat="ui" data-text="dialogue system typewriter conversation richtextlabel story">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Dialogue System</h3>
    <p>Typewriter conversations with a Next key — with a finished signal for game flow.</p>
    <div class="card-tags"><span>ui</span><span>typewriter</span><span>story</span></div>
  </a>

  <a class="card cat-data" href="recipes/godot-save-load-json" data-cat="data" data-text="save load json fileaccess user:// progress persist">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Save/Load Games</h3>
    <p>Persist progress with <code>FileAccess</code> and JSON in the safe <code>user://</code> path — with error handling.</p>
    <div class="card-tags"><span>io</span><span>json</span><span>save</span></div>
  </a>

  <a class="card cat-data" href="recipes/godot-audio" data-cat="data" data-text="audio music sfx loop pitch decibel volume">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Audio Playback</h3>
    <p>Looping music and SFX with pitch variance — with decibels done right.</p>
    <div class="card-tags"><span>audio</span><span>sfx</span><span>music</span></div>
  </a>

  <a class="card cat-patterns" href="recipes/godot-object-pooling" data-cat="patterns" data-text="object pooling bullets particles performance garbage collector">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Object Pooling</h3>
    <p>Manage bullets and particles with an object pool — no GC pressure.</p>
    <div class="card-tags"><span>performance</span><span>pattern</span></div>
  </a>

  <a class="card cat-patterns" href="recipes/godot-state-machine" data-cat="patterns" data-text="state machine enum match idle run jump architecture">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Simple State Machine</h3>
    <p>Manage character states (idle, run, jump) with <code>enum</code> and <code>match</code> — instead of an <code>if</code> pile.</p>
    <div class="card-tags"><span>pattern</span><span>architecture</span></div>
  </a>

  <a class="card cat-patterns" href="recipes/godot-signals" data-cat="patterns" data-text="custom signals health_changed decoupling hud">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>Custom Signals</h3>
    <p>Wire a player to the HUD without direct coupling — via <code>signal health_changed</code>.</p>
    <div class="card-tags"><span>signals</span><span>decoupling</span></div>
  </a>

</div>

<div class="lib-empty" id="lib-empty" hidden>
  <p>Nothing matched that query. Try another term or reset the filter to "All".</p>
</div>

## Coming soon

<div class="cards">
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">Soon</span></div>
    <h3>Screen Shake</h3>
    <p>Noisy camera shake for hits and explosions — adjustable intensity with decay.</p>
    <div class="card-tags"><span>camera</span><span>feel</span></div>
  </div>
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">Soon</span></div>
    <h3>Cooldown System</h3>
    <p>Ability timers for RPG and MOBA-style gameplay — with UI-ready remaining time.</p>
    <div class="card-tags"><span>timer</span><span>rpg</span></div>
  </div>
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">Soon</span></div>
    <h3>Simple 2D Shader</h3>
    <p>Silhouette and flash effects with shaders — for hits and damage feedback.</p>
    <div class="card-tags"><span>shader</span><span>vfx</span></div>
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

## For AI agents

If you are an agent, get the structured catalog with one HTTP request:

<div class="cards">
  <a class="card" href="agent">
    <div class="card-head"><span class="card-engine">Guide</span><span class="badge badge-automated">machine-readable</span></div>
    <h3>Agent Guide</h3>
    <p>Four steps from fetch to reporting back — with the parser structure every recipe follows.</p>
    <div class="card-tags"><span>guide</span><span>workflow</span></div>
  </a>
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
  <a class="card" href="../about">
    <div class="card-head"><span class="card-engine">Docs</span><span class="badge badge-verified">human-verified</span></div>
    <h3>About DocBox</h3>
    <p>The AI hallucination problem, our solution, and the anatomy of every recipe.</p>
    <div class="card-tags"><span>about</span></div>
  </a>
</div>
