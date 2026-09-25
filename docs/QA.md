# QA — Personal Site

> Lab 06

## E2E Playwright

- วันที่: 2026-09-25 15:54–15:56 +07:00 · ผู้ทดสอบ: Claude (Playwright MCP) · branch `lab-05-backend`
- เป้าหมาย: `http://localhost:4321` (`PORT=4321` ใน `.env`) · `npm run dev` ที่รันอยู่แล้ว · `GUESTBOOK_ENABLED` ไม่ตั้งค่า · `DATA_DIR` default (`./data`)
- ไม่ได้แก้ `src/` ในรอบนี้

| # | Step | Expected | Result |
|---|---|---|---|
| 1 | เปิด `/` | 200 · แสดง Name + Headline จาก `docs/PROFILE.md` | ✅ 200 · `<h1>` = `xA0Mz` · headline "Programmer ที่ทำงานคู่ AI — เว็บ · automation · กำลังลงมือกับ AI agents" ตรงกับ PROFILE · `<title>` = name · headline |
| 2 | nav → About (`/about`) | 200 ไม่ใช่ 404 | ✅ 200 · title "เกี่ยวกับเรา · xA0Mz" |
| 3 | nav → Interests (`/interests`) | 200 · รายการตรง PROFILE | ✅ 200 · 3 รายการ: Web development · Automation · AI agents / multi-agent · `/api/interests` 200 ข้อมูลตรงกัน |
| 4 | nav → Contact (`/contact`) | 200 · **ไม่มีฟอร์ม** (D8) · ลิงก์ติดต่อจาก PROFILE | ✅ 200 · `form` = 0 · ลิงก์ `mailto:demo@example.com` + GitHub `https://github.com/xA0Mz` |
| 5 | POST `/api/contact` ด้วย demo data (`demo@example.com`) | 410 (D8 — route ปิด) | ✅ 410 `{"error":"GONE"}` — error ที่คาด |
| 6 | nav → Guestbook (`/guestbook`) | 200 · โหลดรายการ | ✅ 200 · GET `/api/guestbook` 200 · honeypot `website` อยู่ใต้ `aria-hidden` + `tabindex=-1` |
| 7 | ส่ง guestbook ผ่าน UI: `Demo QA` / "ทดสอบ E2E จาก Playwright (demo data)" | 201 · ข้อความขอบคุณ · รายการใหม่ขึ้นบนสุด · ฟอร์มล้าง | ✅ POST 201 → GET 200 · แสดง "ขอบคุณที่แวะมาทักทายนะ" · โพสต์ใหม่อยู่บนสุด (ใหม่ก่อน) · ช่องชื่อถูกล้าง |
| 8 | ส่ง guestbook ข้อความเว้นวรรคล้วน | ถูกกันฝั่ง client · ไม่ยิง API | ✅ แสดง "ใส่ชื่อเล่นและข้อความก่อนนะ" · ไม่มี POST ใน network log |
| 9 | POST `/api/guestbook` message 501 ตัว | 400 · error ปลอดภัย (D11) | ✅ 400 `{"error":"INVALID_INPUT"}` — ไม่มี stack / SQL |
| 10 | ส่ง guestbook ที่มี HTML: `Demo <b>QA</b>` / `<i>escape check</i> & demo` | แสดงเป็นข้อความ ไม่ render tag | ✅ render เป็น `&lt;b&gt;…` · ไม่มี `<b>`/`<i>` ใน DOM ของรายการ (escape ก่อน `innerHTML` ทำงาน) |
| 11 | เปิด URL ที่ไม่มี (`/no-such-page`) | 404 | ⚠️ 404 ถูกต้องแต่เป็นหน้า default ของ Astro ("404: Not Found") — ตรงกับ L12 ที่ค้างอยู่ |
| 12 | Console errors | ไม่มี error นอกจากที่ตั้งใจยิง | ✅ error 3 รายการ = 404 (ข้อ 11) · 410 (ข้อ 5) · 400 (ข้อ 9) ที่ตั้งใจเอง · ไม่มี JS error |
| 13 | Screenshot | ≥ 2 หน้า ใน `docs/screenshots/` | ✅ `home.png` · `guestbook-after-submit.png` · `contact.png` (full page) |

### ข้อสังเกต / ตามต่อ

- **ข้อมูลทดสอบค้างใน `data/site.sqlite` ของเครื่อง** — id 7 (`Demo QA`) และ id 8 (`Demo <b>QA</b>`) ยังไม่ได้ลบ (คำสั่งลบถูกปฏิเสธในรอบนี้ · รอเจ้าของ) · id 6 (`Box`) มีอยู่ก่อนรอบนี้ ไม่ใช่ของ QA · `data/` อยู่ใน `.gitignore` ไม่หลุดขึ้น repo
- **`docs/guestbook-delete.md` คำสั่งใช้ `process.env.DATA_DIR||'data/site.sqlite'`** — ถ้าตั้ง `DATA_DIR` (เช่น `/data` ใน Docker) จะเปิด path ของ*โฟลเดอร์* ไม่ใช่ไฟล์ `site.sqlite` → ควรเป็น `path.join(process.env.DATA_DIR||'data','site.sqlite')` · owner = OpenCode backend
- Rate limit: รอบนี้ใช้ POST guestbook ไป 3 ครั้ง (limit 5 / 10 นาที / IP) — ไม่ได้ทดสอบ 429 ผ่าน UI (curl ตรวจแล้วใน Lab 05)
- screenshot มี Astro dev toolbar ติดล่างจอ — เป็นของ `npm run dev` เท่านั้น ไม่อยู่ใน build
- Playwright MCP เขียน snapshot/console log ไว้ที่ `.playwright-mcp/` ใน root — ยังไม่อยู่ใน `.gitignore` · อย่า commit
- L8 (`playwright/smoke.spec.ts` ยังคาดฟอร์ม Contact) ยังไม่แก้ในรอบนี้ — ผล E2E ข้างบนยืนยันว่าสเปกนั้นจะ fail ที่ Contact

## a11y Debate

> 2026-09-25 16:00 +07:00 · จำลอง 2 บทบาทโดย Claude · input = ผล E2E ข้างบน + หน้า Contact (`src/pages/contact.astro`, `src/layouts/BaseLayout.astro`) · ตรวจสดด้วย Playwright MCP (Tab ทีละขั้น · viewport 320px) + คำนวณ contrast ตามสูตร WCAG จาก token ใน `:root`
> หลักฐานภาพ: `docs/screenshots/contact-skip-link-focus.png` · `contact-email-focus.png` · `contact-320px.png`

### Advocate

**Contrast (WCAG 1.4.3 / 1.4.11)** — palette D15 ผ่าน AA ทุกคู่ที่เป็นข้อความ:

| คู่สี | Ratio | เกณฑ์ |
|---|---|---|
| `--text` บน `--bg` / `--card` | 13.36 / 14.14 | ✅ AAA |
| `--muted` (ย่อหน้า, nav) บน `--card` / `--bg` | 6.84 / 6.46 | ✅ AA (เกือบ AAA) |
| `--accent` (ลิงก์) บน `--card` / `--bg` | 5.47 / 5.17 | ✅ AA |
| ปุ่ม `--on-accent` บน `--accent` · ตอน hover | 5.47 · 7.00 | ✅ AA |
| focus ring `--accent` บน `--card` · ขอบ input `--muted` | 5.47 · 6.84 | ✅ ≥ 3:1 (non-text) |
| `--text` บนแถบ `.mark` สีเหลือง | 9.23 | ✅ |
| ขอบการ์ด `--border` บน `--bg` | 1.23 | ⚠️ ต่ำ — แต่เป็นของตกแต่ง การ์ดบน Contact ไม่ได้เป็นปุ่ม จึงไม่ติดเกณฑ์ |

**Focus (2.4.1 / 2.4.3 / 2.4.7)** — Tab บน `/contact` ได้ลำดับ: skip link → brand → nav 5 ตัว → อีเมล → GitHub · ตรงกับลำดับที่อ่าน · ทุกตัวมี `:focus-visible` outline สี accent หนาประมาณ 3px · skip link โผล่มุมบนซ้ายเมื่อโฟกัส · nav มี `aria-current="page"` + ขีดเส้นใต้ ไม่ได้บอกด้วยสีอย่างเดียว ✅

**หน้า Contact — จุดที่ติด**
1. **สไตล์ลิงก์อีเมลไม่ทำงาน** — `.email a { font-weight: 700; font-size: 1.1rem }` เป็น scoped style ของ Astro แต่ `<a>` ถูกสร้างด้วย JS ตอน runtime จึงไม่มี attribute scope → วัดสดได้ `font-weight: 400` · `16px` · กล่องโฟกัส 150×21px · ช่องทางติดต่อหลักของหน้าจึงดูเท่ากับลิงก์ทั่วไป และ target เล็ก (ผ่าน 2.5.8 ได้เพราะข้อยกเว้นเรื่องระยะห่างเท่านั้น)
2. ไม่มี JS → `<noscript>` แสดง `demo [at] example.com` เป็นข้อความ ไม่ใช่ลิงก์ — ยอมรับได้ตาม D8 (กันบอทเก็บอีเมล) แต่ต้องรู้ไว้ว่าเป็น trade-off
3. `<p class="email">` ว่างอยู่ก่อน JS เติม — screen reader ที่อ่านเร็วจะเจอ heading "อีเมล" ตามด้วยความว่างชั่วครู่ (เล็กน้อย)

**Heading order (1.3.1 / 2.4.6)** — ทุกหน้าเริ่มที่ `h1` ตัวเดียว แล้วลงไป `h2` ไม่มีข้ามชั้น · Contact = `h1 ทักทางไหนได้บ้าง` → `h2 อีเมล` → `h2 GitHub` ✅ · landmark `header` / `nav[aria-label="เมนูหลัก"]` / `main` ครบ · `<html lang="th">` ✅ · ไม่มี `footer` (ไม่ผิด)

**Labels ฟอร์ม (Guestbook — ฟอร์มเดียวที่มีบนเว็บ) (1.3.1 / 3.3.1 / 3.3.2 / 4.1.3)**
- ✅ `label for` ผูกครบทั้ง 2 ช่อง · ตัวนับตัวอักษรผูกด้วย `aria-describedby="gb-count"` · honeypot อยู่นอกจอ + `aria-hidden` + `tabindex=-1` · `#gb-status` มี `role="status"` จึงประกาศผลได้
- ❌ ส่งฟอร์มว่าง → ขึ้นข้อความ "ใส่ชื่อเล่นและข้อความก่อนนะ" แต่ **โฟกัสยังอยู่ที่ปุ่ม** · ไม่มี `aria-invalid` ในช่องที่ว่าง · ไม่ได้บอกว่าช่องไหนผิด (3.3.1 ต้องระบุช่องที่ผิด)
- ⚠️ `#gb-entries` เป็น `aria-live="polite"` ทั้งรายการ → หลังโพสต์ระบบ re-render รายการใหม่ทั้งชุด screen reader อาจอ่านทุกโพสต์ซ้ำต่อจาก "ขอบคุณ…"
- ⚠️ ไม่มีเครื่องหมายบอกด้วยตาว่าช่องไหนต้องกรอก (มีแค่ `required` ให้ AT)

**Reflow (1.4.10)** — viewport 320px: `scrollWidth` = 320 ไม่มี scroll แนวนอน · nav ตัดขึ้นบรรทัดใหม่ สูง 103px ✅

**404** — `/no-such-page` เป็นหน้า default ของ Astro: ไม่มี nav กลับ · ไม่ใช่ `lang="th"` · ไม่อยู่ในโทนเว็บ (= L12)

### Pragmatist

- **ไม่มี P0 ด้าน a11y** — ไม่มีอะไรที่ทำให้คนใช้คีย์บอร์ดหรือ screen reader ติดจนใช้งานไม่ได้: contrast ผ่านทั้งหมด · focus มองเห็นได้ · ลำดับ Tab ถูก · label ครบ · Contact ใช้ได้ทั้งแบบมีและไม่มี JS · ปล่อย ship ได้โดยไม่ต้องรอเรื่องนี้
- **ก่อน ship (ถูก + ผลชัด · รวมไม่เกิน 30 นาที)**: ลิงก์อีเมลที่ style หลุด (บั๊กจริง ไม่ใช่ความเห็น · แก้บรรทัดเดียว) · error ของ guestbook ต้องบอกว่าช่องไหน + ย้ายโฟกัสไปช่องนั้น (ฟอร์มเดียวของเว็บ คนแปลกหน้าจะใช้) · ถอด `aria-live` ออกจากรายการ เพราะ `#gb-status` ประกาศผลอยู่แล้ว
- **404 (L12)** — อยู่ในคิว Lab 06 อยู่แล้ว ใช้เวลามากกว่า 30 นาทีเพราะต้องออกแบบหน้า → P1 แยกออกมา ทำก่อน ship ถ้าทัน
- **หลัง ship**: ขอบการ์ด 1.23:1 (ตกแต่ง) · เครื่องหมาย "จำเป็น" (ทั้งฟอร์มมีแค่ 2 ช่อง และบังคับทั้งคู่ — hint บอกบริบทอยู่แล้ว) · ช่องว่างก่อน JS เติมอีเมล · เพิ่ม axe-core ใน Playwright spec (ผูกกับงาน L8) · ทดสอบ forced-colors / screen reader จริง (NVDA)
- ไม่ควรแก้: `<noscript>` แบบ `[at]` — เป็นการตัดสินใจ D8 ไม่ใช่บั๊ก a11y · เปลี่ยนต้องเปิด debate ใหม่

## a11y Action items (prioritized P0/P1/P2)

> owner แก้ UI = Claude `frontend` · ยังไม่ได้แก้ `src/` — รอเจ้าของยืนยัน

| # | Pri | Item | ไฟล์ | เวลาโดยประมาณ | Done เมื่อ |
|---|---|---|---|---|---|
| A1 | P0 | — ไม่พบ (ดู Pragmatist) | — | — | — |
| A2 | P1 | ลิงก์อีเมลบน Contact ไม่ได้ style (scoped CSS ไม่ติด `<a>` ที่ JS สร้าง) → ใช้ `:global(a)` | `src/pages/contact.astro` | 5 นาที | วัดได้ `font-weight: 700` · `17.6px` · target สูงขึ้น |
| A3 | P1 | Guestbook error: ใส่ `aria-invalid="true"` ในช่องที่ว่าง + `focus()` ช่องแรกที่ผิด + ข้อความบอกชื่อช่อง · ล้าง `aria-invalid` เมื่อพิมพ์ | `src/pages/guestbook.astro` (script) | 15 นาที | ส่งว่าง → โฟกัสไปที่ช่อง `gb-name` · AT อ่านว่า invalid |
| A4 | P1 | ถอด `aria-live="polite"` ออกจาก `#gb-entries` (เก็บ `aria-busy` ไว้) — ให้ `#gb-status` เป็นตัวประกาศตัวเดียว | `src/pages/guestbook.astro` | 5 นาที | หลังโพสต์ ประกาศแค่ "ขอบคุณ…" |
| A5 | P1 | หน้า 404 ไทยใน `BaseLayout` (มี nav + `lang="th"` + ลิงก์กลับหน้าแรก) = L12 | `src/pages/404.astro` (ใหม่) | 20–30 นาที (แยกจาก 30 นาทีของ A2–A4) | `/no-such-page` 404 + ใช้ layout ของเว็บ |
| A6 | P2 | เครื่องหมาย "จำเป็น" ที่ label ของ guestbook | `guestbook.astro` | 5 นาที | — |
| A7 | P2 | เพิ่ม axe-core scan ใน `playwright/smoke.spec.ts` ไปพร้อมงาน L8 | `playwright/` | 30 นาที | spec เขียว ไม่มี violation ระดับ serious |
| A8 | P2 | ทดสอบ NVDA + forced-colors จริง · ขอบการ์ดถ้าจะใช้การ์ดเป็นปุ่มเพิ่ม | — | — | — |

A2 + A3 + A4 = ประมาณ 25 นาที

### Diff ที่เสนอ (A2) — ยังไม่ได้แก้ไฟล์ รอยืนยัน

```diff
--- a/src/pages/contact.astro
+++ b/src/pages/contact.astro
@@ <style>
   .channel + .channel { margin-top: 1.25rem; }
   .channel h2 { margin-bottom: 0.25rem; }
-  .email a { font-weight: 700; font-size: 1.1rem; }
+  /* <a> is created by the script below, so it has no scope attribute */
+  .email :global(a) { font-weight: 700; font-size: 1.1rem; }
 </style>
```
