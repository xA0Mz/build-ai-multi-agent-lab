# Handoff: OpenCode (backend) → Claude (frontend)

> Lab 05 → Lab 06 · อ่านคู่กับ `docs/fe-be-contract-check.md` · `docs/DECISIONS.md` D8–D11 · ขั้นตอนลบโพสต์ `docs/guestbook-delete.md`

Timestamp: 2026-09-25 15:05 +07:00  
Task: Lab 05 Backend API (issue #5 #6 · ปิด L5)  
Status: DONE (test เขียวทั้งชุด · kill switch ทดสอบด้วย curl แล้ว)

## What changed

- `src/lib/db.ts` — implement จริงทั้งสาม:
  - `insertContact`: validate (name ≤100 · email ≤254 มี `@` · message ≤2000) → insert → คืน row จริง `{ id, name, email, message, created_at }` (ตอบ `lab05-api.test.ts`)
  - `insertGuestbook`: trim + name 1–80 / message 1–500 (D9) → insert → คืน row
  - `listGuestbook`: `ORDER BY id DESC` (ใหม่ก่อน)
  - Error ที่ throw เป็นโค้ดสั้น (`VALIDATION_ERROR` / `DB_ERROR`) — คำ "Lab 05 OpenCode" หายไปแล้ว (D11)
- `src/pages/api/guestbook.ts` — ตามสัญญาใน `guestbook.astro` ทุกข้อ:
  - kill switch อ่าน `process.env.GUESTBOOK_ENABLED === 'false'` **ใน handler ทุก request** (D10 · ไม่อ่าน top-level จึงสลับ env ได้ไม่ต้อง rebuild)
  - ปิด: GET → `200 { "entries": [] }` · POST → `503`
  - POST: JSON parse พัง/ไม่ใช่ object → 400 · `name`/`message` ไม่ใช่ string → 400 · validate ซ้ำที่ db → 400 · honeypot `website` ไม่ว่าง → **silent drop 201 ไม่ insert** (คืน `{ ok: true }` — UI อ่านแค่ `res.ok`)
  - rate limit best-effort: in-memory per-IP (`x-forwarded-for` ตัวแรก) **5 โพสต์ / 10 นาที** → 429 · รีเซ็ตตอน restart · ไม่ share ข้าม replica (best-effort ตาม D9)
  - ทุก 5xx ตอบ `{ error: "INTERNAL_ERROR" }` — ไม่มี pass-through `err.message`
- `src/pages/api/contact.ts` — POST → **410** `{ error: "GONE" }` (D8) · ไม่ import `insertContact` (route ปิด · function ยังอยู่ใน `db.ts` เพื่อ test)
- **ไม่ได้แตะ** `src/pages/*.astro` · `src/layouts/` · `src/lib/profile.ts` · `/api/interests`

## Verification (ทำจริงทั้งหมด)

- `npm run test:labs` — เขียว (2 tests · `data/vitest-lab`)
- `npm test` — เขียว (3 files · 11 tests)
- `npm run build` — ผ่าน
- curl บน `node dist/server/entry.mjs`:
  - `GUESTBOOK_ENABLED=false` → GET `200 {"entries":[]}` · POST `503` · `/api/contact` `410`
  - ไม่ตั้งค่า → POST valid (มี space รอบชื่อ) `201 {id:1, name:"Bob", created_at:"2026-09-25 07:49:34"}` (trim + UTC `datetime('now')`) · GET คืนรายการใหม่ก่อน · message >500 → 400 · honeypot ไม่ว่าง → 201 (ไม่มีแถวใน DB) · JSON พัง → 400 · โพสต์ที่ 6 ใน 10 นาที → 429
  - ลบข้อมูลทดสอบออกจาก `data/site.sqlite` แล้ว (ตาราง guestbook ว่าง)

## Assumptions I made (challenge ได้)

1. honeypot เลือก **silent drop + 201** (ไม่ใช่ 400) — สัญญาอนุญาตทั้งคู่ · UI ไม่ต่าง
2. rate limit เป็น in-memory map ระดับ process — ถ้า deploy หลาย replica จะกันได้เฉพาะต่อ instance (ยอมรับได้ตาม "best-effort" ของ D9) · ถ้าอยากได้จริงขึ้นต้องเป็น store กลาง ไม่ทำใน v1
3. 429 นับทุก POST รวมที่โดน honeypot (นับก่อนเช็ค honeypot) — บอทยิงรัวจะโดนตัดก่อน
4. ยังไม่มี endpoint ลบโพสต์ — ใช้ขั้นตอนมือใน `docs/guestbook-delete.md` ตาม D10

## Request to next agent

**Claude agent `frontend` · Lab 06 QA**

1. อัปเดต `playwright/smoke.spec.ts` — ตอนนี้ Contact **ไม่มีฟอร์ม** (D8) และ `/api/contact` ตอบ 410 (L8)
2. รัน `npm run test:e2e` กับ dev server (ต้อง `npm run dev` ก่อน · port 4321)
3. E2E guestbook ถ้าเขียน: ใช้ `GUESTBOOK_ENABLED` ไม่ตั้งค่า · อย่า assert ข้อความ error ดิบ (D11)
4. จบงาน: อัปเดต `docs/QA.md` · STATUS / OPEN_LOOPS (writer ถัดไปคือคุณ) · handoff ก่อนสลับกลับ

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md` (ปิด L5)
- [x] อื่น ๆ: `docs/guestbook-delete.md` (ใหม่)

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = Claude (`frontend`) หลังจาก commit นี้
