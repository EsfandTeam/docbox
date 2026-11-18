# راهنمای آپدیت DocBox — مسیر تست‌شده با GitHub Desktop

> این فایل نسخه‌های سالم و تست‌شده‌ی فرآیند آپدیت را ثبت می‌کند تا دفعه‌ی بعد
> که خواستیم نسخه‌ی جدید را جایگزین کنیم، دقیقاً همین مسیر را برویم.
> **هرگز از این مسیرها خارج نشو.**

## قانون‌های طلایی (قبل از هر کاری بخوان)

1. **فولدر `.git` را هرگز پاک نکن.** این فولدر مخفی است ولی Ctrl+A آن را هم انتخاب می‌کند و با حذفش، GitHub Desktop ریپو را نمی‌شناسد (خطای «Can't find docbox»).
2. **فولدر ریپو را خودش را حذف نکن** — فقط محتویات داخلش.
3. **هرگز از PowerShell و robocopy استفاده نکن.** مسیر تست‌شده فقط File Explorer + GitHub Desktop است.
4. هنگام paste اگر پنجره «Replace or Skip Files» آمد، **Replace files in the destination** را بزن.
5. هیچ‌وقت روی فولدرهای قدیمی تست‌شده‌ی قبلی (`Desktop\docbox`، `Desktop\docboxclone`) کار نکن — همیشه یک فولدر تازه بساز.

## مسیر تست‌شده (۹ قدم)

### قدم ۱ — فایل‌های جدید را آماده کن

فایل زیپ جدید (مثلاً `docbox.zip`) را از چت دانلود کن، راست‌کلیک → **Extract All...** → قبول مسیر پیش‌فرض.
بعد از extract یک فولدر `docbox-main` می‌بینی؛ پنجره‌اش را باز نگه دار.

### قدم ۲ — clone تازه با GitHub Desktop

1. GitHub Desktop را باز کن
2. اگر صفحه خطای «Can't find docbox» بود: دکمه **Clone Again**
   اگر نبود: `File` → `Clone Repository` → انتخاب `esfandteam/docbox`
3. در قسمت **Local Path** مسیر تازه بگذار:
   ```
   C:\Users\SADRA\Desktop\docbox-final
   ```
   (نام فولدر مهم نیست، فقط **تازه** باشد)
4. **Clone** بزن و صبر کن تمام شود

### قدم ۳ — باز کردن فولدر ریپو

در GitHub Desktop دکمه **Show in Explorer** را بزن تا فولدر ریپو در File Explorer باز شود.

### قدم ۴ — کپی فایل‌های جدید

در پنجره‌ی فولدر `docbox-main`:

1. همه را انتخاب کن: `Ctrl + A`
2. کپی کن: `Ctrl + C`
3. برو به فولدر ریپو (از قدم ۳) و paste کن: `Ctrl + V`
4. اگر پنجره «Replace or Skip Files» آمد: **Replace files in the destination**

**نکته:** فایل‌های قدیمی را حذف نکن — paste روی آن‌ها overwrite می‌کند و فایل‌هایی که در نسخه جدید نیستند (مثل `assets/`) دست‌نخورده می‌مانند.

### قدم ۵ — بررسی تغییرات

به GitHub Desktop برگرد. در تب **Changes** باید لیستی ببینی:

- 🟢 سبز = فایل جدید
- 🟡 زرد = فایل تغییر‌یافته
- 🔴 قرمز = فایل حذف‌شده

اگر لیست خالی بود، یعنی paste درست انجام نشده — قدم ۴ را تکرار کن.

### قدم ۶ — کامیت

پایین چپ در کادر **Summary** بنویس (مثلاً):

```
Add 6 new recipes, modernize UX, add update guide
```

دکمه **Commit to main** را بزن.

### قدم ۷ — پوش

بالای پنجره دکمه **Push origin** را بزن.

### قدم ۸ — انتظار برای build

۲-۱ دقیقه صبر کن تا GitHub Pages دوباره build کند.

### قدم ۹ — تأیید نهایی

آدرس‌های زیر را در مرورگر باز کن و **`Ctrl + Shift + R`** بزن (hard refresh):

```
https://esfandteam.github.io/docbox/
https://esfandteam.github.io/docbox/llms.txt
https://esfandteam.github.io/docbox/recipes.json
```

اگر محتوای جدید را دیدی، آپدیت موفق بوده. ✅

## عیب‌یابی

| خطا / مشکل | راه‌حل |
|---|---|
| «Can't find docbox» | فولدر جابه‌جا یا پاک شده — دکمه **Clone Again** بزن و از قدم ۲ با مسیر تازه ادامه بده |
| دکمه Push origin کار نمی‌کند / خطا داد | اول **Fetch origin** بزن، بعد **Pull origin**، بعد دوباره Push |
| تب Changes خالی است | فایل‌ها را paste نکرده‌ای یا در فولدر اشتباه paste کرده‌ای — قدم ۴ را تکرار کن |
| سایت آپدیت نشده | `Ctrl + Shift + R` بزن؛ صبر کن؛ `https://github.com/esfandteam/docbox/actions` را چک کن |
| پیام «repository has untracked files» | طبیعی است — یعنی فایل‌های جدید هنوز کامیت نشده‌اند؛ قدم ۶ و ۷ را انجام بده |

## تاریخچه مسیرها (چه چیزی کار کرد و چه چیزی نه)

| روش | وضعیت |
|---|---|
| GitHub Desktop + paste با Replace | ✅ **تست‌شده — مسیر رسمی** |
| `robocopy /MIR` | ❌ ممنوع — فایل‌های اضافی ریپو را حذف می‌کند |
| `Ctrl + A` + Delete در File Explorer | ❌ ممنوع — `.git` را هم پاک می‌کند |
| PowerShell `Remove-Item` | ❌ ممنوع — ریسک حذف اشتباه (یک بار فولدر اشتباه را خالی کرد) |
| وب‌جستجوی GitHub Web UI | ❌ برای `_config.yml` و فولدرهای مخفی کار نمی‌کند |

## یادداشت نسخه ۵ (فیکس باگ‌های بحرانی)

| فایل جدید/تغییر یافته | نکته |
|---|---|
| `assets/js/docbox.js` | **فایل جدید** — تمام جاوااسکریپت سایت اینجاست. هرگز داخل `<script>` در `head_custom.html` کد ننویس؛ `compress_html` خط‌های جدید را حذف می‌کند و کامنت `//` کل اسکریپت را می‌کُشد |
| `_config.yml` | `endings: all` ممنوع — برای همیشه `endings: []` بماند |
| لینک‌های `.md` | هرگز به `*.md` لینک نده (روی GitHub Pages بدون front matter → 404؛ با front matter → تبدیل به HTML می‌شود). آدرس بدون پسوند یا لینک raw `raw.githubusercontent.com/.../main/...md` |
| `recipes.json` | فیلد `category` جدید اضافه شد (movement/physics/ui/data/patterns) — با چیپ‌های صفحه اصلی باید هم‌خوان بماند |
| فوتر | تم خروجی را `<footer>` بدون کلاس می‌دهد؛ استایل در `custom.scss` با سلکتور `footer` است نه `.site-footer` |
