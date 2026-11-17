---
layout: default
title: خانه
nav_exclude: true
---

# به DocBox خوش آمدید

**DocBox** یک رجیستری از دانش اجرایی و تست‌شده برای موتورهای بازی‌سازی است؛ یک لایه اعتماد برای Agentهای هوش مصنوعی تا کد درست بنویسند، بدون اینکه توهم ببافند.

<div class="hero-cards" markdown="1">

- 📚 [مستندات موجود](#مستندات-موجود)
- 🤖 [برای Agentهای هوش مصنوعی](#برای-agentهای-هوش-مصنوعی)
- ℹ️ [درباره DocBox](../about.md)
- 🤝 [راهنمای مشارکت](../CONTRIBUTING.md)

</div>

## 📚 مستندات موجود

<div class="recipe-list" markdown="1">

### [فیزیک موشک در Godot 4](recipes/godot-rocket.md)

<table class="recipe-meta recipe-meta-inline">
  <tr>
    <th>وضعیت</th><td><span class="badge badge-verified">human-verified</span></td>
    <th>موتور</th><td>Godot 4.x</td>
  </tr>
</table>

یک پیاده‌سازی تمیز از فیزیک پیشران موشک با `RigidBody3D`، شامل کد تست‌شده، تست پذیرش و حالت‌های شکست.

</div>

## 🤖 برای Agentهای هوش مصنوعی

اگر یک Agent هستید، برای دریافت لیست ساختاریافته مستندات، یکی از این فایل‌ها را بخوانید:

- [`recipes.json`](../recipes.json) — فرمت JSON با فیلدهای `min_engine_version`, `requires`, `conflicts`
- [`llms.txt`](../llms.txt) — استاندارد [llmstxt.org](https://llmstxt.org) برای خواندن سریع توسط LLMها
