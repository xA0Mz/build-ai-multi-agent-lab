# Handoff: Claude (frontend) → OpenCode (backend)

> Lab 05 ขั้นที่ 4 → แก้ก่อนเปิด PR Backend · อ่านคู่กับ `docs/be-fe-integration-check.md` (Suggestion ข้อ 1–2) · `docs/DECISIONS.md` D9 D11

Timestamp: 2026-09-25 15:35 +07:00  
Task: L11 — rate limit key + honeypot ที่ไม่ใช่ string (branch `lab-05-backend`)  
Status: NEEDS_REVIEW → รอ backend แก้

## What changed

- Claude agent `frontend` ตรวจการผูกฟอร์มกับ API ที่ `f50f3fc` → ไม่มี mismatch ของสัญญา · commit `dd65f8d`
- เจ้าของเลือกให้แก้ L11 **ก่อน** เปิด PR Backend ของ Lab 05

## Files

- `docs/be-fe-integration-check.md` (ใหม่) · `docs/STATUS.md` · `docs/OPEN_LOOPS.md` (+L11 · L12)

## Verification

- Unit / smoke: PASS (11) · Labs: PASS (2) — ที่ `f50f3fc`
- Manual: curl บน build จริง (ดู `## วิธีตรวจ` ใน `docs/be-fe-integration-check.md`)

## ปัญหาที่พบ (`src/pages/api/guestbook.ts`)

1. key ของ rate limit = ค่า**ตัวแรก**ของ `x-forwarded-for`
   - ไม่มี header → ทุกคนใช้ bucket `'unknown'` ร่วมกัน ทั้งเว็บโพสต์ได้แค่ 5 ครั้ง / 10 นาที (ยืนยันด้วย curl แล้ว)
   - ค่าตัวแรก client ปลอมได้ → เลี่ยง limit ได้
2. map ของ rate limit ไม่ลบ key เก่า → ส่ง header ปลอมไม่ซ้ำกันไปเรื่อย ๆ แล้ว map จะโตไม่หยุด
3. honeypot เช็คเฉพาะ `typeof website === 'string'` → `website: 1` หรือ object ไม่ถูกทิ้ง และไปถึงขั้น insert

## Assumptions to challenge

1. ข้อเสนอคือใช้ `clientAddress` ของ Astro (`@astrojs/node` standalone) เป็นหลัก และใช้ `x-forwarded-for` เฉพาะค่า**ตัวท้าย**ที่ reverse proxy (Coolify/Traefik) เติมเท่านั้น · backend ตรวจเองว่าอะไรเชื่อถือได้ตอน deploy
2. rate limit ยังเป็น in-memory best-effort ตาม D9 ได้ ไม่ต้องใช้ store กลาง

## Request to next agent

**OpenCode agent `backend` · resume session Lab 05 เดิม · แก้เฉพาะ `src/pages/api/guestbook.ts` (และ `src/lib/db.ts` ถ้าจำเป็น) — อย่าแตะ UI / tests**

1. แก้ key ของ rate limit ตามข้อ 1 · ถ้าหา IP ไม่ได้ อย่าให้ทุกคนแชร์ bucket เดียวจนเว็บทั้งเว็บถูกล็อก
2. ลบ key ที่หมดอายุแล้ว (เช่นกวาดตอนบันทึก hit) ให้ map ไม่โตเรื่อย ๆ
3. honeypot: `website` ที่มีค่าและไม่ใช่ string ว่าง (รวม non-string) → silent drop 201 เหมือนเดิม
4. สัญญาที่ UI ใช้ห้ามเปลี่ยน (status · response shape · ชื่อ field) ดู handoff 04
5. เกณฑ์เสร็จ: `npm run test:labs` + `npm test` เขียว · `npm run build` ผ่าน · curl บน `node dist/server/entry.mjs` (พอร์ตว่าง · `DATA_DIR` ชั่วคราว) ยืนยันทั้ง 3 ข้อ + 429 ยังทำงาน
6. จบงาน: ปิด L11 ใน OPEN_LOOPS · อัปเดต STATUS · commit (ยังไม่ต้อง push) · เขียน handoff ขากลับสั้น ๆ `docs/handoffs/05-opencode-to-claude-l11.md` แล้วแจ้งเจ้าของ

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md`
- [ ] `docs/DECISIONS.md` (ไม่มี decision ใหม่)

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = OpenCode (`backend`) หลังจาก commit นี้
