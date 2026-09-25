# Handoff: Claude (frontend) → OpenCode (backend)

> Lab 04 → Lab 05 · อ่านคู่กับ `docs/fe-be-contract-check.md` (เขียนโดย OpenCode agent `backend`) และ `docs/DECISIONS.md` D8–D11

Timestamp: 2026-09-25 14:35 +07:00  
Task: Lab 04 Frontend pages (PR #13 · issue #1 #3 #4 · refs #2 #6)  
Status: NEEDS_REVIEW (UI เสร็จ · รอ backend Lab 05)

## What changed

- `src/lib/profile.ts` (owner = Frontend ตาม D12): อ่าน section หลายย่อหน้า · whitelist หัวข้อ · `interestDetails` · `contact { email?, github? }` · **`interests: string[]` ยังเป็นชื่อล้วน** → `/api/interests` ไม่เปลี่ยน
- หน้า Home / About / Interests / Contact / Guestbook + `BaseLayout.astro` ทำใหม่ตาม D4–D15 (ทำโดย agent `frontend`)
- Contact **ไม่มีฟอร์มแล้ว** (D8) → UI ไม่ยิง `/api/contact` อีก
- Guestbook UI อ่าน kill switch `process.env.GUESTBOOK_ENABLED` เอง (ปิดเมื่อ `"false"` เท่านั้น) · ไม่แสดง `data.error` ดิบ

## Files

- `src/lib/profile.ts` · `tests/profile.test.ts` (ใหม่)
- `src/layouts/BaseLayout.astro` · `src/pages/{index,about,interests,contact,guestbook}.astro`
- `docs/DECISIONS.md` (+D15 palette) · `docs/fe-be-contract-check.md` (OpenCode เขียน)
- **ไม่ได้แตะ** `src/lib/db.ts` · `src/pages/api/**`

## Verification

- Unit / smoke: PASS — `npm test` 3 files · 11 tests
- Labs (`npm run test:labs`): FAIL (ตามแผน — stub `NOT_IMPLEMENTED` รอ Lab 05)
- Build: PASS — `npm run build`
- Manual / localhost: 5 หน้าได้ 200 บน 127.0.0.1:4321 · grep HTML ไม่พบข้อความคอร์ส/ภายใน · kill switch ตรวจด้วย `node dist/server/entry.mjs` + curl: `GUESTBOOK_ENABLED=false` → ไม่มีฟอร์ม มีข้อความตอนปิด ปุ่มรองบน Home หาย · ไม่ตั้งค่า → กลับมาครบ (ไม่ต้อง build ใหม่)

## สัญญา API ที่ UI คาด (ต้นฉบับ = คอมเมนต์ใน frontmatter ของ `src/pages/guestbook.astro`)

- `GET /api/guestbook` → 200 `{ entries: { id, name, message, created_at }[] }` · `created_at` เป็น `YYYY-MM-DD HH:MM:SS` (UTC จาก `datetime('now')`) หรือ ISO ก็ได้ · kill switch ปิด → 200 `{ "entries": [] }`
- `POST /api/guestbook` JSON `{ name, message, website }` · name trim 1–80 · message trim 1–500 · `website` = honeypot (คนจริงส่ง `""`) → ไม่ว่างให้ทิ้งเงียบ (201 ไม่ insert) หรือ 400 ก็ได้
- 201 → UI reload รายการ · 400 / 429 / 503 (ปิด) / 5xx → UI แสดงข้อความกลางเดียวกันทั้งหมด (ดูแค่ `res.ok`)
- `POST /api/contact` → **410** (หรือ 404) ตาม D8 · แต่ `insertContact` ใน `db.ts` ต้อง implement จริงเพื่อให้ `tests/labs/lab05-api.test.ts` เขียว

## Assumptions to challenge

1. D10 บอกให้ปุ่ม Guestbook บน Home "เปลี่ยนเป็นลิงก์ case study" แต่ UI **ซ่อนปุ่มรอง** เพราะปุ่มหลักไป case study อยู่แล้ว (ไม่กระทบ API)
2. honeypot ชื่อ field `website` · UI ไม่แยกผลระหว่างทิ้งเงียบกับ 400 → backend เลือกได้
3. UI กับ API อ่าน `GUESTBOOK_ENABLED` แยกกันคนละที่ · ถ้า backend ทำ helper กลาง ให้แจ้งใน handoff ขากลับ อย่าแก้ `.astro` เอง

## Request to next agent

**OpenCode agent `backend` · Lab 05 · implement API เท่านั้น — อย่าแตะ UI (`src/pages/*.astro`, `src/layouts/`, `src/lib/profile.ts`)**

1. `src/lib/db.ts`: implement `insertContact` / `listGuestbook` (ใหม่ก่อน) / `insertGuestbook` · ข้อความที่ throw ต้องปลอดภัยต่อผู้ชม ห้ามมี Lab / path / stack (D11) · ลบข้อความ `— Lab 05 OpenCode` ออกจาก error
2. `src/pages/api/guestbook.ts`: kill switch อ่าน `process.env.GUESTBOOK_ENABLED` **ใน handler ทุก request** (D10) · validate 400 · honeypot · rate limit best-effort 429 · 5xx ตอบข้อความกลาง ไม่ pass-through `err.message`
3. `src/pages/api/contact.ts`: POST → 410 (D8)
4. เขียนขั้นตอนลบโพสต์สำรอง `docker exec` + `node -e` ผ่าน better-sqlite3 ลงใน docs (D10 · L5)
5. เกณฑ์เสร็จ: `npm run test:labs` เขียว · `npm test` ยังเขียว · สลับ `GUESTBOOK_ENABLED` แล้ว `curl` GET + POST ตาม D10 · ดูรายการ mismatch ทั้งหมดใน `docs/fe-be-contract-check.md`
6. จบงาน: อัปเดต STATUS / OPEN_LOOPS · เขียน handoff ขากลับ `docs/handoffs/05-opencode-to-claude.md` · commit ก่อนสลับ harness

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md`
- [x] `docs/DECISIONS.md` (D15 palette)
- [x] อื่น ๆ: `docs/fe-be-contract-check.md` · PR #13

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = OpenCode (`backend`) หลังจาก commit นี้
