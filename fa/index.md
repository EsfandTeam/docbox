---
layout: default
title: خانه
nav_exclude: true
description: DocBox — رجیستری دستورپخت‌های تست‌شده برای Godot 4 با تست پذیرش و حالت‌های شکست؛ لایه اعتماد برای Agentهای هوش مصنوعی
---

<div class="hero">
  <p class="hero-kicker">رجیستری دانش اجرایی برای بازی‌سازی</p>
  <h1>کدی که <span class="highlight-word">تست شده</span>، نه کدی که «به نظر می‌رسه»</h1>
  <p class="hero-sub">دستورپخت‌های تست‌شده و قابل‌اجرا برای Godot 4 — با تست پذیرش، حالت‌های شکست و کد GDScript آماده کپی. لایه اعتماد برای Agentهای هوش مصنوعی.</p>
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
    <a class="btn btn-primary" href="#library">مرور کتابخانه</a>
    <a class="btn btn-ghost" href="recipes/godot-2d-movement">شروع: حرکت دوبعدی</a>
  </div>
  <div class="hero-stats">
    <div class="stat"><b>۱۲</b><span>دستورپخت</span></div>
    <div class="stat"><b>۶</b><span>دسته‌بندی</span></div>
    <div class="stat"><b>Godot 4.x</b><span>موتور</span></div>
    <div class="stat"><b>۱۰۰٪</b><span>human-verified</span></div>
  </div>
</div>

<h2 id="library">کتابخانه دستورپخت‌ها</h2>

<div class="lib-toolbar">
  <div class="lib-search">
    <input type="text" id="lib-search-input" class="lib-search-input" placeholder="جستجو: پرش، دوربین، ذخیره، tween …" autocomplete="off">
  </div>
  <div class="filter-chips" id="lib-chips">
    <button class="chip active" data-cat="all"><span class="chip-count">۱۲</span>همه</button>
    <button class="chip" data-cat="movement"><span class="chip-count">۳</span>حرکت و کنترل</button>
    <button class="chip" data-cat="physics"><span class="chip-count">۱</span>فیزیک</button>
    <button class="chip" data-cat="ui"><span class="chip-count">۳</span>انیمیشن و UI</button>
    <button class="chip" data-cat="data"><span class="chip-count">۲</span>داده و صدا</button>
    <button class="chip" data-cat="patterns"><span class="chip-count">۳</span>معماری و الگوها</button>
  </div>
  <p class="lib-count" id="lib-count">۱۲ دستورپخت</p>
</div>

<div class="cards" id="lib-grid">

  <a class="card cat-movement" href="recipes/godot-2d-movement" data-cat="movement" data-text="حرکت کاراکتر دوبعدی characterbody2d move_and_slide پرش گرانش physics character jump">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>حرکت کاراکتر دوبعدی</h3>
    <p>حرکت و پرش با <code>CharacterBody2D</code> و <code>move_and_slide</code> — با ارتفاع پرش قابل‌محاسبه.</p>
    <div class="card-tags"><span>physics</span><span>2d</span><span>character</span></div>
  </a>

  <a class="card cat-movement" href="recipes/godot-camera-follow" data-cat="movement" data-text="دوربین دنبال‌کننده camera2d smoothing نرم‌سازی مرز دنیا camera limits">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>دوربین دنبال‌کننده</h3>
    <p>نرم‌سازی داخلی <code>Camera2D</code> با مرزهای دنیا — بدون لرپ دستی و بدون لرزش.</p>
    <div class="card-tags"><span>camera</span><span>2d</span><span>smoothing</span></div>
  </a>

  <a class="card cat-movement" href="recipes/godot-input-buffer" data-cat="movement" data-text="بافر ورودی input buffer پرش حساس اکشن jump responsive">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>بافر ورودی (Input Buffer)</h3>
    <p>ثبت فشردن کلید چند فریم قبل از فرود — پرش‌های حساس استاندارد بازی‌های اکشن.</p>
    <div class="card-tags"><span>input</span><span>jump</span><span>feel</span></div>
  </a>

  <a class="card cat-physics" href="recipes/godot-rocket" data-cat="physics" data-text="فیزیک موشک rigidbody3d پیشران thrust سوخت fuel نیوتن">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>فیزیک موشک</h3>
    <p>حرکت با پیشران روی <code>RigidBody3D</code> و مصرف سوخت — طبق قانون دوم نیوتن.</p>
    <div class="card-tags"><span>physics</span><span>3d</span><span>rigidbody</span></div>
  </a>

  <a class="card cat-ui" href="recipes/godot-tween" data-cat="ui" data-text="انیمیشن tween زنجیره موازی حلقه محو‌شدگی animation">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>انیمیشن با Tween</h3>
    <p>زنجیره، موازی و حلقه‌ای با <code>create_tween</code> — بدون نشتی حافظه.</p>
    <div class="card-tags"><span>animation</span><span>tween</span><span>ui</span></div>
  </a>

  <a class="card cat-ui" href="recipes/godot-scene-transition" data-cat="ui" data-text="انتقال صحنه change_scene محو‌شدگی fade تعویض سطح scene">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>انتقال بین صحنه‌ها</h3>
    <p>تعویض صحنه با <code>change_scene_to_file</code> و جلوه محو‌شدگی — با چک کردن کد خطا.</p>
    <div class="card-tags"><span>scenes</span><span>flow</span><span>ui</span></div>
  </a>

  <a class="card cat-ui" href="recipes/godot-dialogue" data-cat="ui" data-text="سیستم دیالوگ تایپ‌رایتر مکالمه گفتگو richtextlabel typewriter">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>سیستم دیالوگ</h3>
    <p>نمایش مکالمات با تایپ‌رایتر و کلید ادامه — با سیگنال پایان گفتگو.</p>
    <div class="card-tags"><span>ui</span><span>typewriter</span><span>story</span></div>
  </a>

  <a class="card cat-data" href="recipes/godot-save-load-json" data-cat="data" data-text="ذخیره بارگذاری save load json fileaccess user:// پیشرفت">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>ذخیره و بارگذاری بازی</h3>
    <p>ذخیره پیشرفت با <code>FileAccess</code> و JSON در مسیر امن <code>user://</code> — با مدیریت خطا.</p>
    <div class="card-tags"><span>io</span><span>json</span><span>save</span></div>
  </a>

  <a class="card cat-data" href="recipes/godot-audio" data-cat="data" data-text="صدا موسیقی جلوه صوتی audio sfx music لو loop دسی‌بل pitch">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>صدا و موسیقی</h3>
    <p>پخش موسیقی با لوپ و جلوه صوتی با واریانس گام — با دسی‌بل درست.</p>
    <div class="card-tags"><span>audio</span><span>sfx</span><span>music</span></div>
  </a>

  <a class="card cat-patterns" href="recipes/godot-object-pooling" data-cat="patterns" data-text="استخر اشیا object pooling گلوله ذرات کارایی performance gc">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>استخر اشیا (Object Pooling)</h3>
    <p>مدیریت گلوله و ذرات با استخر اشیا — بدون فشار به Garbage Collector.</p>
    <div class="card-tags"><span>performance</span><span>pattern</span></div>
  </a>

  <a class="card cat-patterns" href="recipes/godot-state-machine" data-cat="patterns" data-text="ماشین حالت state machine ای دیل idle دویدن پرش معماری">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>ماشین حالت ساده</h3>
    <p>مدیریت وضعیت کاراکتر (سکون، دویدن، پرش) با <code>enum</code> و <code>match</code> — جایگزین پشته‌ای از <code>if</code>.</p>
    <div class="card-tags"><span>pattern</span><span>architecture</span></div>
  </a>

  <a class="card cat-patterns" href="recipes/godot-signals" data-cat="patterns" data-text="سیگنال سفارشی signals جداسازی سلامتی health_changed decoupling">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-verified">human-verified</span></div>
    <h3>سیگنال‌های سفارشی</h3>
    <p>اتصال باز به HUD بدون وابستگی مستقیم — با <code>signal health_changed</code>.</p>
    <div class="card-tags"><span>signals</span><span>decoupling</span></div>
  </a>

</div>

<div class="lib-empty" id="lib-empty" hidden>
  <p>چیزی با این عبارت پیدا نشد. عبارت دیگری امتحان کنید یا فیلتر را روی «همه» بگذارید.</p>
</div>

## به‌زودی

<div class="cards">
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">به‌زودی</span></div>
    <h3>لرزش دوربین (Screen Shake)</h3>
    <p>لرزش نویزی برای برخورد و انفجار — با شدت قابل‌تنظیم و افت تدریجی.</p>
    <div class="card-tags"><span>camera</span><span>feel</span></div>
  </div>
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">به‌زودی</span></div>
    <h3>سیستم کوولدان (Cooldown)</h3>
    <p>مدیریت زمان انتظار قابلیت‌ها با تایمر — استاندارد بازی‌های RPG و MOBA.</p>
    <div class="card-tags"><span>timer</span><span>rpg</span></div>
  </div>
  <div class="card card-soon">
    <div class="card-head"><span class="card-engine">Godot 4.x</span><span class="badge badge-soon">به‌زودی</span></div>
    <h3>شیدر ساده ۲بعدی</h3>
    <p>افکت سیلوئت و چشمک‌زدن با شیدر — برای برخورد و آسیب.</p>
    <div class="card-tags"><span>shader</span><span>vfx</span></div>
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

## برای Agentهای هوش مصنوعی

اگر یک Agent هستید، با یک درخواست HTTP ساده فهرست ساختاریافته دستورپخت‌ها را بگیرید:

<div class="cards">
  <a class="card" href="agent">
    <div class="card-head"><span class="card-engine">راهنما</span><span class="badge badge-automated">machine-readable</span></div>
    <h3>راهنمای Agentها</h3>
    <p>۴ قدم از fetch تا گزارش به کاربر — با ساختار پارسر برای هر دستورپخت.</p>
    <div class="card-tags"><span>guide</span><span>workflow</span></div>
  </a>
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
  <a class="card" href="../about">
    <div class="card-head"><span class="card-engine">مستندات</span><span class="badge badge-verified">human-verified</span></div>
    <h3>درباره DocBox</h3>
    <p>مشکل توهم AI، راه‌حل ما و ساختار هر دستورپخت.</p>
    <div class="card-tags"><span>about</span></div>
  </a>
</div>
