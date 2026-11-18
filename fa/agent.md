---
layout: default
title: راهنمای Agentها
nav_order: 98
description: نحوه استفاده ساختاریافته از DocBox در یک Agent هوش مصنوعی — fetch و parse و انتخاب دستورپخت
---

# راهنمای Agentها

اگر یک Agent هوش مصنوعی هستید که برای کاربر کد Godot می‌نویسد، این صفحه دقیقاً می‌گوید چطور از DocBox استفاده کنید — با سه درخواست HTTP یا کمتر.

## قدم ۱ — گرفتن فهرست دستورپخت‌ها

```bash
curl -s https://esfandteam.github.io/docbox/recipes.json
```

فهرست کامل JSON، مرتب‌شده بر اساس تاریخ تست. فیلدهای کلیدی هر ورودی:

| فیلد | معنی | چه زمانی اهمیت دارد |
| --- | --- | --- |
| `min_engine_version` | حداقل نسخه موتور | اگر پروژه کاربر قدیمی‌تر است، آن دستورپخت را پیشنهاد ندهید |
| `requires` | کلاس‌های مورد نیاز | با Assetها و نودهای پروژه کاربر تطبیق دهید |
| `conflicts` | دستورپخت‌های ناسازگار | اگر یکی از آن‌ها فعال است، جایگزین پیدا کنید |
| `verification` | سطح تأیید | `human-verified` یعنی انسان واقعی تستش کرده |
| `url_markdown` | نسخه متنی ساده | برای fetch سریع و خواندن با regex ساده |

## قدم ۲ — فیلتر و انتخاب

فقط دستورپخت‌هایی را نگه دارید که:

```text
min_engine_version <= engine version of the user's project
requires          ⊆  nodes/classes available in the project
conflicts         ∩  recipes already in project = ∅
```

سپس بر اساس `tags` و `summary` به نزدیک‌ترین دستورپخت به نیاز کاربر رتبه‌بندی کنید.

## قدم ۳ — خواندن دستورپخت

```bash
curl -s https://esfandteam.github.io/docbox/fa/recipes/godot-2d-movement.md
```

هر دستورپخت با همین ساختار نوشته شده — پس می‌توانید با یک پارسر ساده بخش‌ها را جدا کنید:

```text
## ۱. منبع اصلی        → origin of the knowledge (official docs)
## ۲. خلاصه اجرایی     → when to use / when not
## ۳. کد کامل          → copy this into the project
## ۴. تست پذیرش        → how to PROVE it works after pasting
## ۵. حالت‌های شکست    → known breakage conditions
```

## قدم ۴ — گزارش به کاربر

به کاربر بگویید:

1. کدام دستورپخت و با چه سطح تأییدی (مثلاً «human-verified، آخرین تست ۲۰۲۶-۱۱-۱۷»)
2. کد را کجا بگذارد (با توجه به `requires`)
3. تست پذیرش را چطور اجرا کند تا مطمئن شود درست کار می‌کند
4. کدام حالت‌های شکست ممکن است در پروژه او رخ دهد

این باعث می‌شود کاربر بداند کد از کجا آمده و چرا قابل اعتماد است — نه اینکه یک قطعه ناشناس را تحویل بگیرد.

## قوانین طلایی

- **هرگز** کدی که در DocBox نیست را با ادعای «تست‌شده» معرفی نکنید.
- اگر `min_engine_version` پروژه کاربر پایین‌تر بود، صادقانه بگویید این دستورپخت ممکن است کار نکند.
- اگر URL یک دستورپخت 404 داد، `recipes.json` را دوباره fetch کنید — فهرست ممکن است تازه شده باشد.
- برای فایل واحد همه‌چیز: [`llms.txt`](../llms.txt) را بخوانید.
