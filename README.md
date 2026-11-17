# DocBox

> DocBox یک رجیستری آزاد و متن‌باز از دستورپخت‌های (Recipes) تست‌شده و قابل‌اجرا برای موتورهای بازی‌سازی است — یک لایه اعتماد برای Agentهای هوش مصنوعی.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Engine: Godot 4](https://img.shields.io/badge/Engine-Godot%204.x-478CBF.svg)](https://godotengine.org)
[![Verification: human-verified](https://img.shields.io/badge/Verification-human--verified-green.svg)](#)

## مشکل چیست؟

وقتی یک Agent هوش مصنوعی کد Godot می‌نویسد، معمولاً یا از فروم‌ها تقلید می‌کند یا توهم می‌بافد. کد خراب درمی‌آید، زمان کاربر هدر می‌رود، و اعتماد به AI کاهش می‌یابد. دانش درست وجود دارد، اما در ذهن توسعه‌دهنده‌های باتجربه پخش شده و در دسترس Agent نیست.

## راه‌حل

DocBox این دانش را در یک محل واحد، با ساختار مشخص و با **سطح تأیید** جمع می‌کند. هر دستورپخت شامل:

- **کد قابل اجرا** — نوشته‌شده برای یک موتور خاص.
- **تست پذیرش** — شرطی دقیق و قابل‌سنجش که درستی کد را نشان می‌دهد.
- **حالت‌های شکست** — فهرستی از مواردی که کد در آن‌ها خراب می‌شود.

تمام دستورپخت‌ها به‌صورت **Markdown + JSON + `llms.txt`** منتشر می‌شوند تا هم انسان‌ها و هم Agentهای AI بتوانند آن‌ها را بخوانند.

## وضعیت تأیید

| سطح | معنی |
| --- | --- |
| `human-verified` | یک انسان کد را در محیط واقعی موتور اجرا کرده است. |
| `automated` | کد به‌صورت خودکار در CI تست می‌شود (با Godot headless در GitHub Actions). |

> **وضعیت فعلی:** تمام دستورپخت‌ها در حال حاضر `human-verified` هستند. به‌محض راه‌اندازی لوله CI، دستورپخت‌های عبورکرده به `automated` ارتقا می‌یابند.

## ساختار پروژه

```
docbox/
├── _config.yml              # تنظیمات Jekyll + تم just-the-docs
├── _sass/custom/custom.scss # استایل سفارشی (RTL + UI مدرن)
├── about.md                 # درباره DocBox (فارسی)
├── CONTRIBUTING.md          # راهنمای مشارکت
├── LICENSE                  # مجوز MIT
├── llms.txt                 # استاندارد llmstxt.org برای AI
├── recipes.json             # فهرست ساختاریافته دستورپخت‌ها
├── README.md                # این فایل
├── fa/                      # نسخه فارسی (اصلی)
│   ├── index.md
│   └── recipes/
│       └── godot-rocket.md
├── en/                      # نسخه انگلیسی
│   ├── index.md
│   └── recipes/
│       └── godot-rocket.md
└── .github/
    ├── ISSUE_TEMPLATE/
    │   └── recipe_request.md
    └── pull_request_template.md
```

## دستورپخت‌های موجود

| ID | عنوان | موتور | وضعیت |
| --- | --- | --- | --- |
| `godot-rocket` | [فیزیک موشک در Godot 4](fa/recipes/godot-rocket.md) | Godot 4.x | human-verified |

## برای Agentهای هوش مصنوعی

اگر یک Agent هستید، یکی از این سه روش را برای دسترسی به دستورپخت‌ها استفاده کنید:

```bash
# ۱. فهرست ساختاریافته JSON (با فیلدهای min_engine_version, requires, conflicts)
curl https://esfandteam.github.io/docbox/recipes.json

# ۲. فایل متنی llms.txt (استاندارد llmstxt.org)
curl https://esfandteam.github.io/docbox/llms.txt

# ۳. فایل Markdown یک دستورپخت خاص
curl https://esfandteam.github.io/docbox/fa/recipes/godot-rocket.md
```

## مشارکت

اگر دستورپخت تست‌شده‌ای داری، [`CONTRIBUTING.md`](CONTRIBUTING.md) را بخوان و یک Pull Request بفرست.

## مجوز

این پروژه تحت مجوز **MIT** منتشر می‌شود — برای جزئیات به [`LICENSE`](LICENSE) مراجعه کنید.

## لینک‌ها

- **سایت زنده:** <https://esfandteam.github.io/docbox/>
- **ریپو GitHub:** <https://github.com/esfandteam/docbox>
