---
layout: default
title: خانه
nav_exclude: true
---

<div class="hero">
  <p class="hero-kicker">رجیستری دانش اجرایی برای بازی‌سازی</p>
  <h1>کدی که <span class="highlight-word">تست شده</span>، نه کدی که «به نظر می‌رسه»</h1>
  <p class="hero-sub">DocBox دستورپخت‌های (Recipes) تست‌شده و قابل‌اجرا برای موتورهای بازی ارائه می‌دهد — با تست پذیرش، حالت‌های شکست و کد GDScript آماده کپی. لایه اعتماد برای Agentهای هوش مصنوعی.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="recipes/godot-rocket.md">شروع: فیزیک موشک</a>
    <a class="btn btn-ghost" href="../about.md">درباره DocBox</a>
  </div>
  <div class="hero-stats">
    <div class="stat"><b>۷</b><span>دستورپخت</span></div>
    <div class="stat"><b>Godot 4.x</b><span>موتور</span></div>
    <div class="stat"><b>۱۰۰٪</b><span>human-verified</span></div>
  </div>
</div>

## چطور کار می‌کند؟

<div class="steps">
  <div class="step">
    <div class="step-num">۱</div>
    <h3>فایل ساختاریافته</h3>
    <p>Agent فایل <b>llms.txt</b> یا <b>recipes.json</b> را fetch می‌کند و فهرست دستورپخت‌ها با فیلدهای <code>min_engine_version</code> و <code>requires</code> را می‌خواند.</p>
  </div>
  <div class="step">
    <div class="step-num">۲</div>
    <h3>تست پذیرش</h3>
    <p>هر دستورپخت یک شرط دقیق و قابل‌سنجش دارد — اعداد ورودی و خروجی مشخص — تا درستی کد تضمین شود.</p>
  </div>
  <div class="step">
    <div class="step-num">۳</div>
    <h3>کد آماده اجرا</h3>
    <p>کد GDScript تست‌شده کپی می‌شود و حالت‌های شکست مشخص می‌کنند چه زمانی نباید از آن استفاده کرد.</p>
  </div>
</div>

## دستورپخت‌ها

<div class="cards">
  <a class="card" href="recipes/godot-2d-movement.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>حرکت کاراکتر دوبعدی</h3>
    <p>حرکت و پرش با <code>CharacterBody2D</code> و <code>move_and_slide</code> — با ارتفاع پرش قابل‌محاسبه.</p>
    <div class="card-tags"><span>physics</span><span>2d</span><span>character</span></div>
  </a>
  <a class="card" href="recipes/godot-camera-follow.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>دوربین دنبال‌کننده</h3>
    <p>نرم‌سازی داخلی <code>Camera2D</code> با مرزهای دنیا — بدون لرپ دستی و بدون لرزش.</p>
    <div class="card-tags"><span>camera</span><span>2d</span><span>smoothing</span></div>
  </a>
  <a class="card" href="recipes/godot-save-load-json.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>ذخیره و بارگذاری بازی</h3>
    <p>ذخیره پیشرفت با <code>FileAccess</code> و JSON در مسیر امن <code>user://</code> — با مدیریت خطا.</p>
    <div class="card-tags"><span>io</span><span>json</span><span>save</span></div>
  </a>
  <a class="card" href="recipes/godot-scene-transition.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>انتقال بین صحنه‌ها</h3>
    <p>تعویض صحنه با <code>change_scene_to_file</code> و جلوه محو‌شدگی — با چک کردن کد خطا.</p>
    <div class="card-tags"><span>scenes</span><span>flow</span><span>ui</span></div>
  </a>
  <a class="card" href="recipes/godot-tween.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>انیمیشن با Tween</h3>
    <p>زنجیره، موازی و حلقه‌ای با <code>create_tween</code> — بدون نشتی حافظه.</p>
    <div class="card-tags"><span>animation</span><span>tween</span><span>ui</span></div>
  </a>
  <a class="card" href="recipes/godot-audio.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>صدا و موسیقی</h3>
    <p>پخش موسیقی با لوپ و جلوه صوتی با واریانس گام — با دسی‌بل درست.</p>
    <div class="card-tags"><span>audio</span><span>sfx</span><span>music</span></div>
  </a>
  <a class="card" href="recipes/godot-rocket.md">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>فیزیک موشک</h3>
    <p>حرکت با پیشران روی <code>RigidBody3D</code> و مصرف سوخت — طبق قانون دوم نیوتن.</p>
    <div class="card-tags"><span>physics</span><span>3d</span><span>rigidbody</span></div>
  </a>
</div>

## به‌زودی

<div class="cards">
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">به‌زودی</span></div>
    <h3>Object Pooling</h3>
    <p>مدیریت گلوله و ذرات با استخر اشیا — بدون فشار به Garbage Collector.</p>
    <div class="card-tags"><span>performance</span><span>pattern</span></div>
  </div>
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">به‌زودی</span></div>
    <h3>بافر ورودی (Input Buffer)</h3>
    <p>ثبت فشردن کلیدها برای کنترل حساس — استاندارد بازی‌های اکشن.</p>
    <div class="card-tags"><span>input</span><span>pattern</span></div>
  </div>
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">به‌زودی</span></div>
    <h3>سیستم دیالوگ</h3>
    <p>نمایش مکالمات با تایپ‌رایتر و انتخاب پاسخ.</p>
    <div class="card-tags"><span>ui</span><span>pattern</span></div>
  </div>
</div>

## برای Agentهای هوش مصنوعی

اگر یک Agent هستید، با یک درخواست HTTP ساده فهرست ساختاریافته دستورپخت‌ها را بگیرید:

<div class="cards">
  <a class="card" href="../recipes.json">
    <div class="card-head"><span class="card-engine">JSON</span><span class="badge badge-automated">machine-readable</span></div>
    <h3>recipes.json</h3>
    <p>فهرست کامل با فیلدهای <code>min_engine_version</code>، <code>requires</code>، <code>conflicts</code> و URL هر دستورپخت.</p>
    <div class="card-tags"><span>api</span><span>json</span></div>
  </a>
  <a class="card" href="../llms.txt">
    <div class="card-head"><span class="card-engine">llmstxt.org</span><span class="badge badge-automated">machine-readable</span></div>
    <h3>llms.txt</h3>
    <p>فایل متنی ساده پیرو استاندارد llmstxt.org برای خواندن سریع توسط LLMها.</p>
    <div class="card-tags"><span>api</span><span>text</span></div>
  </a>
  <a class="card" href="../about.md">
    <div class="card-head"><span class="card-engine">مستندات</span><span class="badge badge-verified">human-verified</span></div>
    <h3>درباره DocBox</h3>
    <p>مشکل توهم AI، راه‌حل ما و ساختار هر دستورپخت.</p>
    <div class="card-tags"><span>about</span></div>
  </a>
</div>
