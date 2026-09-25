# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 17:00 +07:00  
Updated by: Claude

## Current goal

- เตรียม Lab 08 Ship — main มี Lab 04–07 ครบ · ยังมี gate ก่อน ship ค้าง (ดู Blocked)

## Done

- Lab 00 init · Lab 01 `docs/PROFILE.md`
- Lab 02: debate 5 รอบ → `docs/DEBATE.md` · `docs/DECISIONS.md` D1–D14 · PROFILE แก้ตาม D2/D3
- Lab 03: GitHub issues #1–#7 จาก D1–D14 · #8 (gh draft) · ตาราง issue ↔ decision ใน DECISIONS (commit `e7ec61c`)
- Lab 04 UI: D12 parser + `tests/profile.test.ts` · 5 หน้าทำใหม่โดย agent `frontend` ตาม D4–D15 · palette D15 (Teal) · contract check โดย OpenCode `backend` → `docs/fe-be-contract-check.md` (ไม่มี mismatch ฝั่ง UI) · PR #13 · handoff `docs/handoffs/04-claude-to-opencode.md`
- L2: แก้ author ของ commit ที่ยังไม่ push ให้เป็น noreply ก่อน push ครั้งแรก (hash เปลี่ยนทั้งหมด · สำรองไว้ใน branch ในเครื่อง `backup/pre-author-reset`)
- Lab 05 Backend: `db.ts` implement `insertContact` / `listGuestbook` / `insertGuestbook` (validate + error code ปลอดภัยตาม D11) · `guestbook.ts` kill switch per-request + validate 400 + honeypot silent-drop 201 + rate limit 429 (5 โพสต์/10 นาที/IP in-memory) + 5xx ข้อความกลาง · `contact.ts` ตอบ 410 (D8) · ขั้นตอนลบโพสต์ `docs/guestbook-delete.md` (D10 · L5) — ปิด L5
- Lab 05 ขั้นที่ 4: agent `frontend` ตรวจการผูกฟอร์ม → `docs/be-fe-integration-check.md` · ไม่มี mismatch ของสัญญา · mismatch 5 ข้อใน `fe-be-contract-check.md` ปิดครบ · ข้อเสนอแนะ BE เรื่อง rate limit (L11)
- L11: rate limit key ใหม่ (XFF ค่าท้ายที่ proxy เติม → `clientAddress` → ไม่มีตัวตนจริง = ไม่จำกัด ไม่ล็อกทั้งเว็บ) · sweep key หมดอายุทุกครั้งที่บันทึก hit · honeypot non-string ถูก silent drop — สัญญาไม่เปลี่ยน · ตรวจด้วย curl ครบ (ดู `docs/handoffs/05-opencode-to-claude-l11.md`)
- Lab 06 QA: E2E Playwright MCP + a11y debate → `docs/QA.md` + `docs/screenshots/` (6 ภาพ) · เข้า main ผ่าน PR ของ branch `lab-06-qa`
- Lab 07 PR #14: Claude `reviewer` → `docs/review-claude.md` (Must 1 · Should 5 · Nit 10) · OpenCode `backend` one-shot → `docs/review-opencode-rebuttal.md` + แก้ M1 runbook ลบโพสต์ (`path.join(DATA_DIR,'site.sqlite')` + `fileMustExist`) · Round 2 close: M1 accept (fixed) · ไม่เหลือ Must เปิด · PR comment บน #14 · **PR #14 merged** (`5585706` · ปิด #5)

## In progress

- —

## Blocked (gate ก่อน Lab 08)

- L3 (P0 · human): อีเมลนามแฝงแทน `demo@example.com` ใน PROFILE — หน้า Contact production จะโชว์ demo address
- L17 (human): ตัดสิน ship gate S1/S2/S4 · ownership `astro.config.mjs` · topology deploy → ถ้ารับเป็น gate ต้องรอ L16 (OpenCode)
- ข้อมูลจากวิทยากร: `STUDENT_SLUG` / DNS / Coolify project

## Next actions

1. เจ้าของ: ตัดสิน L17 · ทำ L3 · อ่านทวน case study (#2 · L9)
2. OpenCode: L16 (S1–S4) ถ้ารับเป็น gate — แยก branch จาก main
3. Claude: Lab 08 — ร่าง `docs/SHIP.md` + ลิสต์ชื่อ env (ไม่ใส่ค่า) · L8 · L12 (ไม่บังคับ)

## Files changed in latest session

- `docs/QA.md` (ข้อ 10 แก้ถ้อยคำ: render ด้วย `textContent`) · `docs/STATUS.md` · `docs/OPEN_LOOPS.md` (merge Lab 06 ↔ Lab 07)

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- Latest D-id: **D15**
- Writer ของ STATUS/OPEN_LOOPS รอบ Lab 07 = Claude · OpenCode ถูกเรียกแบบ one-shot เขียนเฉพาะ rebuttal + runbook
- Verify รอบ L11: `npm run test:labs` เขียว (2) · `npm test` เขียว (11) · `npm run build` ผ่าน · curl (port 4460 · DATA_DIR ชั่วคราว): bucket ต่อ IP, ค่าท้าย XFF, honeypot non-string ไม่ insert, 429 ทำงาน
