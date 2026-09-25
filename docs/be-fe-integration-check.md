# BE ↔ FE Integration Check: ฟอร์ม Guestbook และ Contact (Lab 05 ขั้นที่ 4)

> ผู้ตรวจ: Claude agent `frontend` · ตรวจอย่างเดียว ไม่ได้แก้โค้ด · branch `lab-05-backend` @ `f50f3fc` · 2026-09-25  
> อ่านคู่กับ `docs/fe-be-contract-check.md` (mismatch ก่อน Lab 05) · `docs/handoffs/05-opencode-to-claude.md` · `docs/DECISIONS.md` D8 D9 D10 D11 D13

## สรุป

**UI กับ API ต่อกันได้ ไม่เจอ mismatch ของสัญญา** field, method, path, response shape, status และ kill switch ตรงกันทุกข้อ และ mismatch ทั้ง 5 ข้อใน `fe-be-contract-check.md` ปิดครบแล้ว (ตรวจจากโค้ดและจาก curl บน build จริง)  
เหลือแค่ข้อเสนอแนะที่ไม่ขวางการผูกฟอร์ม ข้อที่ควรทำก่อนคือ rate limit ฝั่ง BE ที่ใช้คีย์ `x-forwarded-for` ตัวแรก ถ้าไม่มี header นี้ ทุกคนจะใช้ bucket เดียวกัน และถ้าปลอม header ก็ข้ามได้ (ดู Suggestion ข้อ 1)

## Match

| หัวข้อ | UI (`guestbook.astro` / `index.astro` / `contact.astro`) | API (`api/guestbook.ts` · `api/contact.ts` · `db.ts`) | ผลตรวจ |
|---|---|---|---|
| path + method | `fetch('/api/guestbook')` GET และ POST · หน้า contact ไม่ยิง API (mailto + GitHub ตาม D8) | `GET` / `POST` ใน `api/guestbook.ts` · `prerender = false` | ตรง |
| request body | `JSON.stringify({ name, message, website })` · `content-type: application/json` · name/message ผ่าน `trim().slice(0, 80/500)` · `maxlength` 80/500 | `request.json()` → `{ name, message, website }` · `db.ts` trim แล้วตรวจ 1–80 / 1–500 | ตรง · curl: ชื่อ 80 → 201 · 81 → 400 · ข้อความ 500 → 201 · 501 → 400 · `" "+80 ตัว` → 201 (trim ก่อนนับ) · ชื่อเป็นช่องว่างล้วน → 400 · ไทย 80 ตัว → 201 |
| honeypot `website` | ช่องซ่อนด้วย CSS · `aria-hidden="true"` · `tabindex="-1"` · `autocomplete="off"` · คนจริงส่ง `""` | `website` ไม่ว่าง → `201 { ok: true }` ไม่ insert | ตรง · UI อ่านแค่ `res.ok` จึงขึ้น "ขอบคุณที่แวะมาทักทายนะ" แล้ว reload รายการ ไม่อ่าน body จึงไม่พังเพราะ `{ ok: true }` ไม่มี `id` · ไม่มีช่อง `website` เลย → 201 ปกติ |
| response GET | `data.entries` (ถ้าไม่ใช่ array ถือเป็น `[]`) · ใช้ `name` / `message` / `created_at` | `{ entries: [{ id, name, message, created_at }] }` เรียงใหม่ก่อน (`ORDER BY id DESC`) | ตรง · UI ไม่ใช้ `id` |
| รูปแบบเวลา | regex `YYYY-MM-DD HH:MM:SS` → เติม `T…Z` (UTC) → `Intl.DateTimeFormat('th-TH')` | `datetime('now')` → `"2026-09-25 07:57:42"` | ตรง |
| response POST 201 | ไม่อ่าน body · reset ฟอร์ม + `load()` | คืน row `{ id, name, message, created_at }` (ค่าหลัง trim) | ตรง |
| 400 / 429 / 503 / 500 | `!res.ok` ทุกตัว → `ตอนนี้ยังส่งไม่ได้ ลองใหม่ภายหลังนะ` · GET พัง → `ตอนนี้ยังโหลดข้อความไม่ได้ ลองใหม่ภายหลังนะ` (D11) | 400 `INVALID_INPUT` · 429 `RATE_LIMITED` · 503 `GUESTBOOK_CLOSED` · 500 `INTERNAL_ERROR` | ตรง · UI ไม่ render `data.error` (ใน HTML ที่ build ไม่มี `innerHTML` และไม่มี `data.error`) · โค้ด error ทั้งหมดเป็นคำสั้นที่ไม่ใช่ข้อความภายใน แม้จะ curl ตรง ๆ |
| 410 contact | UI ไม่ยิง | POST JSON → `410 { error: "GONE" }` · GET → 404 (Astro) · POST แบบ form ข้าม origin → 403 จาก Astro `checkOrigin` | ตรง D8 · ทุกทางปิดอยู่ |
| kill switch: อ่านค่า | `process.env.GUESTBOOK_ENABLED !== 'false'` ใน frontmatter (`guestbook.astro`, `index.astro`) | `process.env.GUESTBOOK_ENABLED === 'false'` ใน handler ทุก request | ตรง · `"false"` ตัวเดียวที่ปิด · ใน `dist/server/chunks` ยังเหลือ `process.env.GUESTBOOK_ENABLED` ทั้ง 3 chunk (ไม่ถูกแทนเป็นค่าคงที่ตอน build) |
| kill switch: ตอนปิด | ไม่มีฟอร์ม · ไม่มี `#gb-entries` · ขึ้น "ตอนนี้ปิดรับข้อความชั่วคราว — …" · Home ไม่มีปุ่มรอง Guestbook · script ยังส่งมาแต่ `load()` return เพราะไม่มี list จึงไม่ fetch | GET → `200 {"entries":[]}` แม้ DB มี 9 แถว · POST → 503 (honeypot ก็ 503) | ตรง D10 · สลับค่าได้โดยไม่ build ใหม่ |
| XSS | ทุก field ผ่าน `textContent` (`text()` / `renderTime()`) · `created_at` ที่ parse ไม่ได้ก็ใส่ผ่าน `textContent` | เก็บและคืน `<img src=x onerror=alert(1)>` / `<script>…` เป็น string ตรง ๆ ใน JSON | ปลอดภัย · API ไม่ต้อง escape เพราะ UI ไม่ตีความเป็น HTML |
| ข้อความหลุด | grep HTML ที่ build ทั้ง 5 หน้า (ตอนเปิด) ไม่เจอ Lab / แล็บ / คอร์ส / เวิร์กช็อป / โค้ด error | `db.ts` throw แค่ `VALIDATION_ERROR` / `DB_ERROR` และ route ไม่ส่งต่อ `err.message` | ตรง D11 |

## Mismatch

| หัวข้อ | UI | API | ฝั่งที่ควรแก้ | ข้อเสนอ |
|---|---|---|---|---|
| ไม่มี | — | — | — | — |

**mismatch 5 ข้อเดิมใน `fe-be-contract-check.md`: ปิดครบ**

| # เดิม | หัวข้อ | สถานะ | หลักฐาน |
|---|---|---|---|
| 5 | `/api/contact` ปิดรับ | ปิดแล้ว | `api/contact.ts` คืน 410 เสมอ · curl `410 {"error":"GONE"}` · route ไม่ import `insertContact` |
| 4c | kill switch ฝั่ง API | ปิดแล้ว | `isGuestbookClosed()` ถูกเรียกใน handler · curl ตอน `false`: GET `200 {"entries":[]}` · POST 503 |
| 6a | error leak | ปิดแล้ว | ไม่มี `Lab 05 OpenCode` ใน `db.ts` · 5xx คืน `INTERNAL_ERROR` · ไม่มี pass-through |
| 2b | validate / rate limit / honeypot | ปิดแล้ว | ขอบ 80/500 ถูกต้อง · honeypot → 201 ไม่ insert · คำขอที่ 6 จาก IP เดิม → 429 |
| 4d | แยก status | ปิดแล้ว | 400 / 429 / 503 / 500 แยกกันชัด |

หมายเหตุ: ใน handoff 05 เขียนว่า error คือ `VALIDATION_ERROR` / `DB_ERROR` ซึ่งเป็นค่าที่ **`db.ts` throw** ส่วน body ที่ route คืนจริงคือ `INVALID_INPUT` / `INTERNAL_ERROR` / `RATE_LIMITED` / `GUESTBOOK_CLOSED` / `GONE` · UI ไม่อ่าน body จึงไม่กระทบ แต่ Lab 06 ควรใช้ชื่อตามที่ route คืนจริง

## Suggestion

1. **(BE · ควรทำก่อน ship) คีย์ rate limit** `clientKey()` ใช้ `x-forwarded-for` ตัวแรก ถ้าไม่มีจะใช้ `'unknown'`
   - ไม่มี header (รัน node ตรง ๆ หรือ proxy ไม่ส่ง) → **ผู้ชมทุกคนใช้ bucket เดียวกัน** ทั้งเว็บโพสต์ได้แค่ 5 ครั้งต่อ 10 นาที (curl: คำขอที่ 6 ที่ไม่มี XFF ได้ 429 และคำขอ valid ถัดไปก็ 429)
   - ค่าตัวแรกของ XFF มาจาก client เอง · curl `x-forwarded-for: 10.3.0.99, 10.3.0.1` หลัง `10.3.0.1` โดนจำกัดแล้ว ยังได้ 400 (ไม่ใช่ 429) แปลว่าข้ามได้
   - `postHits` ไม่ลบ key ที่หมดอายุ · ถ้าปลอม XFF ไม่ซ้ำกัน map จะโตไม่หยุด
   - ข้อเสนอ: ใช้ `clientAddress` จาก Astro context หรือใช้ค่า**ตัวท้าย**ของ XFF ที่ proxy (Coolify/Traefik) เติมให้ · ลบ key ที่ array ว่าง · D9 เขียนว่า best-effort อยู่แล้ว แต่ bucket รวมจะทำให้คนจริงถูกบล็อก ไม่ใช่แค่บอท
2. **(BE · เล็ก) honeypot ที่ไม่ใช่ string** เช่น `"website": 1` ไม่ถูกทิ้ง และไปถึงขั้น insert · เสนอให้ถือว่า `website` ที่มีค่าและไม่ใช่ `""` เป็นบอท
3. **(FE · P1) หน้า 404** ตอนนี้ใช้หน้า default ของ Astro (`lang="en"`, โลโก้ Astro, `Path: /api/contact`) ไม่ใช่ข้อความภายในของคอร์ส แต่ไม่ตรงกับแบรนด์และ D13 · เสนอ `src/pages/404.astro` ภาษาไทย ใช้ `BaseLayout`
4. **(FE · ไม่ต้องทำตอนนี้) 429** UI แสดงข้อความกลางเดียวกับ error อื่น ("ลองใหม่ภายหลังนะ") ซึ่งใช้ได้กับ 429 อยู่แล้ว ไม่ต้องแยกข้อความ
5. **Lab 06 QA ควรทดสอบต่อ**
   - `playwright/smoke.spec.ts` เคส `contact page has form fields` ยังหา `getByLabel('Name' | 'Email' | 'Message')` **จะ fail แน่นอน** เพราะ D8 ไม่มีฟอร์มแล้ว (L8) · ให้เปลี่ยนเป็นตรวจหัวข้อ `ทักทางไหนได้บ้าง`, ลิงก์ `mailto:` ที่ JS สร้าง และลิงก์ GitHub
   - E2E guestbook (ไม่ตั้ง `GUESTBOOK_ENABLED`): กรอกฟอร์ม → ขึ้น `ขอบคุณที่แวะมาทักทายนะ` → รายการใหม่อยู่บนสุด · โพสต์ `<img src=x onerror=alert(1)>` แล้วยืนยันว่าเห็นเป็นข้อความ ไม่มี `img` ใน `.gb-list` และไม่มี dialog
   - error: mock `route.fulfill({ status: 500 | 429 | 503, body: '{"error":"INTERNAL_ERROR"}' })` แล้ว assert ว่าเห็นข้อความกลาง และ**ไม่เห็น**โค้ด error (D11) · อย่า assert โค้ด error ดิบในหน้า
   - honeypot: `#gb-website` ต้องไม่อยู่ใน a11y tree และ Tab ข้ามไป
   - kill switch: รันแยกด้วย `GUESTBOOK_ENABLED=false` บน build (`node dist/server/entry.mjs`) ไม่ใช่ dev · ไม่มี `#gb-form` · Home ไม่มีปุ่ม `เขียน Guestbook ทักทายกัน`
   - E2E ต้องใช้ `DATA_DIR` ชั่วคราว อย่าเขียนลง `./data` จริง · ถ้ายิง POST หลายครั้งจากเครื่องเดียว จะโดน 429 ตั้งแต่ครั้งที่ 6 (bucket `unknown`) ให้ restart server ระหว่างชุด หรือส่ง XFF ต่างกัน

## วิธีตรวจ

ทุกคำสั่งรันจริงบนเครื่องนี้ · ไม่ได้รัน `npm run dev` · ไม่ได้อ่าน `.env` · `./data/site.sqlite` mtime ก่อนและหลังเท่ากัน (`2026-09-25 14:49:49`)

```bash
npm run build                                   # Complete
grep -rho "GUESTBOOK_ENABLED[^;,)]\{0,20\}" dist/server | sort | uniq -c
#   2 GUESTBOOK_ENABLED !== "false"   (index + guestbook page)
#   1 GUESTBOOK_ENABLED === "false"   (api/guestbook)
netstat -ano | grep ":4460 "                    # ว่าง

# รอบ 1: ไม่ตั้ง kill switch · DATA_DIR = %TEMP%\gb-fe-check
env -u GUESTBOOK_ENABLED DATA_DIR='C:\Users\Lenovo\AppData\Local\Temp\gb-fe-check' HOST=127.0.0.1 PORT=4460 node dist/server/entry.mjs
```

| คำขอ (รอบ 1 · เปิด) | ผลจริง |
|---|---|
| `GET /api/guestbook` (DB ว่าง) | `200 {"entries":[]}` |
| `POST {"name":"  Bob  ","message":"  hi there  ","website":""}` | `201 {"id":1,"name":"Bob","message":"hi there","created_at":"2026-09-25 07:57:42"}` |
| `POST {"name":"<img src=x onerror=alert(1)>","message":"<script>alert(2)</script><img src=x onerror=alert(1)>","website":""}` | `201` คืน string เดิมไม่แปลง |
| `GET /api/guestbook` | `200` · id 2 ก่อน id 1 · XSS payload เป็น string ใน JSON |
| ชื่อ 80 / 81 ตัว | `201` / `400` |
| ข้อความ 500 / 501 ตัว | `201` / `400` |
| ชื่อ `" "` + 80 ตัว | `201` |
| ชื่อ `"   "` | `400` |
| ไม่มี field `website` | `201` |
| ชื่อไทย 80 ตัว (ส่งจากไฟล์ UTF-8 `--data-binary @thai.json`) | `201` · ยาว 80 · codepoint `e01` (ก) · ถ้าส่งไทยผ่าน argv ของ Git Bash จะกลายเป็น `?` ซึ่งเป็นปัญหา encoding ของ shell ไม่ใช่ของ server |
| honeypot `"website":"http://spam"` | `201 {"ok":true}` · ไม่มีแถวใหม่ |
| body `{bad` | `400 {"error":"INVALID_INPUT"}` |
| `"name":1` | `400 {"error":"INVALID_INPUT"}` |
| XFF `10.3.0.1` × 6 | `400 400 400 400 400 429` |
| ไม่มี XFF × 6 แล้วส่ง valid | `400 ×5` → `429` → valid ก็ `429 {"error":"RATE_LIMITED"}` |
| XFF `10.3.0.99, 10.3.0.1` หลัง 10.3.0.1 โดนจำกัด | `400` (ข้ามได้) |
| `POST /api/contact` JSON | `410 {"error":"GONE"}` |
| `GET /api/contact` | `404` (หน้า default ของ Astro) |
| `GET /api/interests` | `200 {"interests":["Web development","Automation","AI agents / multi-agent"],"source":"profile"}` |
| `/` `/guestbook` `/contact` `/about` `/interests` | `200` ทุกหน้า · `/guestbook` มี `#gb-form` 1 · honeypot `<div class="hp" aria-hidden="true">` + `<input … tabindex="-1" autocomplete="off">` · `innerHTML` 0 · `data.error` 0 · Home มีปุ่มรอง 1 · grep คำ Lab / แล็บ / คอร์ส / เวิร์กช็อป / โค้ด error ใน 5 หน้า = 0 |

```bash
taskkill //PID 13532 //F
# รอบ 2: ปิด · ใช้ DB เดิม (มี 9 แถว) · ไม่ build ใหม่
GUESTBOOK_ENABLED=false DATA_DIR='C:\Users\Lenovo\AppData\Local\Temp\gb-fe-check' HOST=127.0.0.1 PORT=4460 node dist/server/entry.mjs
```

| คำขอ (รอบ 2 · `GUESTBOOK_ENABLED=false`) | ผลจริง |
|---|---|
| `GET /api/guestbook` | `200 {"entries":[]}` (ไม่มี 9 แถวที่อยู่ใน DB) |
| `POST` valid | `503 {"error":"GUESTBOOK_CLOSED"}` |
| `POST` honeypot | `503 {"error":"GUESTBOOK_CLOSED"}` |
| `POST /api/contact` JSON | `410 {"error":"GONE"}` |
| `POST /api/contact` แบบ form ไม่มี Origin / มี Origin ตรง | `403 Cross-site POST form submissions are forbidden` / `410` |
| `GET /guestbook` | `200` · `#gb-form` 0 · `<div id="gb-entries">` 0 · "ตอนนี้ปิดรับข้อความชั่วคราว" 1 |
| `GET /` | `200` · ปุ่ม `เขียน Guestbook ทักทายกัน` 0 · การ์ดขึ้น "ตอนนี้ปิดรับข้อความชั่วคราว" |

```bash
taskkill //PID 6696 //F                         # port 4460 ว่าง
rm -rf "$TEMP/gb-fe-check"                      # ลบ DATA_DIR ชั่วคราวแล้ว
stat -c '%y' data/site.sqlite                   # 2026-09-25 14:49:49 (ไม่เปลี่ยน)
```
