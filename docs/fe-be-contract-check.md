# FE ↔ BE Contract Check — Guestbook / Contact (ก่อน Lab 05)

> รอบนี้ = review อย่างเดียว (one-shot) ตาม `docs/_call-opencode-prompt.md` · ไม่ได้แก้โค้ดใด ๆ · 2026-09-25

## สรุป

สัญญาหลักตรงกัน: UI ยิง `GET/POST /api/guestbook` อ่าน `{ entries: [{ id, name, message, created_at }] }` และจัดการ error ทุก status ด้วยข้อความกลาง (ไม่แสดง `data.error` ดิบ) สอดคล้องกับ D9–D11 · ช่องว่างอยู่ฝั่ง backend ทั้งหมดและเป็นงาน Lab 05 อยู่แล้ว: kill switch ยังไม่มีใน stub route, `/api/contact` ยังตอบ 501/400/201 ทั้งที่ D8 สั่ง 404/410 (ไม่ขัดกับ lab05 test เพราะ test ยิง `db.ts` ตรง ๆ) และ error ที่ส่งออกจาก route/`db.ts` ยัง leak ข้อความภายใน ("NOT_IMPLEMENTED … Lab 05 OpenCode") ขัด D11

## Match

| หัวข้อ | UI คาด | stub/DECISIONS | หมายเหตุ |
|---|---|---|---|
| 1. path + method | `GET` + `POST /api/guestbook` (`ENDPOINT` ใน `guestbook.astro`) · หน้า contact ไม่ยิง API เลย (mailto + GitHub ตาม D8) | stub `src/pages/api/guestbook.ts` มี `GET`/`POST` ครบ · `prerender = false` | ตรง · `/api/interests` (GET `{ interests, source }`) ไม่เกี่ยวกับสัญญานี้และไม่ต้องแตะ (D12 ค้ำว่า `interests: string[]` เหมือนเดิม) |
| 2. request fields | POST body `{ name (trim, 1–80), message (trim, 1–500), website }` · `website` = honeypot ต้องว่าง · UI บอกชัดว่า "server reject หรือ silently drop ก็ได้" | D9 กำหนดชื่อ ≤ 80 · ข้อความ ≤ 500 · server validate | ตรง · type `insertGuestbook({name, message})` ไม่มี `website` โดยตั้งใจ — honeypot จัดการที่ชั้น route ก่อนเรียก db |
| 3. response shape | GET → `data.entries` เป็น array · render `name` / `message` / `created_at` ผ่าน `textContent` ทุก field · POST → อ่านแค่ `res.ok` แล้ว reload list | stub GET คืน `{ entries: rows }` · POST คืน row `{ id, name, message, created_at }` + 201 | ตรง · UI รองรับ `created_at` ทั้งรูป `YYYY-MM-DD HH:MM:SS` (ตีเป็น UTC แล้วเติม `Z`) และ ISO — ตรงกับ `datetime('now')` ของ SQLite ใน `db.ts` |
| 4. status code | เช็คแค่ `res.ok` — 400/429/501/503/5xx ทุกตัว map เป็นข้อความกลางเดียวกัน | D9/D10 กำหนด 201 / 400 / 429 / 503 | ตรงโดยออกแบบ · UI ไม่ผูกกับ status ใด นอกจาก 2xx จึงเพิ่ม 429/503 ฝั่ง server ได้โดยไม่แตะ FE |
| 4b. kill switch ฝั่ง UI | `guestbook.astro` + `index.astro` อ่าน `process.env.GUESTBOOK_ENABLED !== 'false'` ตอน SSR (runtime · ไม่ใช่ `import.meta.env`) · ปิด = ซ่อนฟอร์ม+รายการ แสดง "ตอนนี้ปิดรับข้อความชั่วคราว — …" | D10: ค่าเดียวที่ปิดคือ `"false"` · อ่าน runtime ผ่าน `process.env` | ตรง · หมายเหตุเล็ก ๆ: D10 เขียนว่าปุ่ม Guestbook บน Home "เปลี่ยนเป็นลิงก์ case study" แต่ implement จริงซ่อนปุ่มรอง (ปุ่มหลักชี้ case study อยู่แล้ว) — เป็นเรื่อง FE ไม่กระทบสัญญา API |
| 6b. UI แสดง error | ไม่แสดง `data.error` ดิบ — ทุก failure ใช้ข้อความ fix (`MSG.sendError` / `MSG.loadError`) | D11 สั่งห้ามแสดง `data.error` ดิบ | ตรง ฝั่ง UI ปลอดภัยแล้ว |

## Mismatch

| หัวข้อ | UI คาด | stub/DECISIONS | ฝั่งที่ควรแก้ | ข้อเสนอ |
|---|---|---|---|---|
| 5. `/api/contact` ปิดรับ | UI ไม่มีฟอร์ม/ไม่ยิง route เลย (D8) | stub `api/contact.ts` ตอบ 201/400/501 · D8 สั่ง **404/410** จนกว่าจะเปิดฟอร์ม | BE | Lab 05 เปลี่ยน route ให้ตอบ **410** (หรือ 404) พร้อม body ปลอดภัย · **ไม่ขัด** `tests/labs/lab05-api.test.ts` เพราะ test import `insertContact` จาก `db.ts` ตรง ๆ — ดังนั้น `insertContact` ต้อง implement จริงใน `db.ts` แม้ route จะปิด (ตรงตาม D8 ที่สั่งไว้) |
| 4c. kill switch ฝั่ง API | ปิดแล้ว GET → 200 `{ "entries": [] }` · POST → 503 | stub route ไม่มีโค้ดเช็ค `GUESTBOOK_ENABLED` เลย (GET list ตลอด · POST insert ตลอด) | BE | Lab 05 เช็ค `process.env.GUESTBOOK_ENABLED === 'false'` **ภายใน handler ทุก request** (ห้ามอ่านไว้ top-level ของ module ไม่งั้นสลับ env ตอนรันไม่มีผล) |
| 6a. error leak | ผู้ชม (รวมคนที่ curl API ตรง ๆ) ต้องไม่เห็นข้อความภายใน | stub route ส่ง `err.message` ดิบใน `{ error }` · `db.ts` throw `"NOT_IMPLEMENTED: … — Lab 05 OpenCode"` ซึ่งมีคำว่า Lab | BE | Lab 05: ข้อความที่ throw จาก `db.ts` ต้องปลอดภัยต่อผู้ชม (D11) · route map 5xx เป็นข้อความกลาง ไม่ pass-through `err.message` · 400 validation ใช้ข้อความสั้นที่บอกได้จริง (เช่น ชื่อ/ข้อความยาวเกิน) โดยไม่ leak โครงสร้างภายใน |
| 2b. validation / rate limit / honeypot ฝั่ง server | UI ตัด/ตรวจฝั่ง client แล้ว แต่ถือว่าข้ามได้ | stub ส่ง `body` เข้า `insertGuestbook` ตรง ๆ ไม่ validate · D9 สั่ง server validate + จำกัดความยาว + rate limit (best-effort) | BE | Lab 05: ตรวจ type/trim/ความยาว (name 1–80 · message 1–500) ที่ route → 400 · honeypot `website` ไม่ว่าง → silently drop (ตอบ 201 โดยไม่ insert) หรือ 400 — UI รับได้ทั้งสอง · rate limit best-effort → 429 |
| 4d. status mapping ของ stub | — | stub POST guestbook map ทุก error ที่ไม่ใช่ NOT_IMPLEMENTED เป็น 400 (รวม DB error) · หลัง implement จริง logic นี้ต้องหายไป | BE | Lab 05: แยก 400 (validation) / 429 (rate limit) / 503 (kill switch) / 500 (DB fail · ข้อความกลาง) ให้ชัด |

## Suggestion

งานที่ backend จะทำใน Lab 05 (ยังไม่ได้ทำรอบนี้):

- `src/lib/db.ts`: implement `insertContact` (validate + insert คืน row ที่มี `id`/`created_at` จริง — ให้ `lab05-api.test.ts` เขียว), `insertGuestbook`, `listGuestbook` (เรียงใหม่ก่อน · คืน `{ id, name, message, created_at }`) · ข้อความ error ที่ throw ทุกตัวต้องปลอดภัยต่อผู้ชม ไม่มีคำว่า Lab/stack/path ภายใน (D11)
- `src/pages/api/guestbook.ts`: เพิ่ม kill switch อ่าน `process.env.GUESTBOOK_ENABLED` ใน handler ทุกครั้ง — ปิด: GET → 200 `{ entries: [] }` · POST → 503 (D10) · validation 400 · honeypot `website` · rate limit best-effort 429 · 5xx ตอบข้อความกลาง ไม่ส่ง `err.message` ดิบ
- `src/pages/api/contact.ts`: เปลี่ยน POST ให้ตอบ 410 (หรือ 404) ตาม D8 — คง `insertContact` ใน `db.ts` ไว้เพื่อ test · ไม่ต้องแตะ UI หน้า contact
- ไม่แตะ `src/pages/api/interests.ts` (สัญญาเดิมจาก `loadProfile()` ยังใช้ได้ตาม D12)
- เกณฑ์ยอมรับ: `npm run test:labs` เขียว + ทดสอบ kill switch ด้วยการสลับ env แล้ว `curl` ทั้ง GET/POST ตามที่ D10 กำหนด
