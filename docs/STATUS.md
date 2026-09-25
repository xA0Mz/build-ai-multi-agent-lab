# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 16:40 +07:00  
Updated by: Claude

## Current goal

- Lab 07 cross-model review ของ PR #14 — 2 รอบปิดแล้ว · เหลือโพสต์ PR comment + push · แล้วเจ้าของตัดสิน merge

## Done

- Lab 00 init · Lab 01 `docs/PROFILE.md`
- Lab 02: debate 5 รอบ → `docs/DEBATE.md` · `docs/DECISIONS.md` D1–D14 · PROFILE แก้ตาม D2/D3
- Lab 03: GitHub issues #1–#7 จาก D1–D14 · #8 (gh draft) · ตาราง issue ↔ decision ใน DECISIONS (commit `e7ec61c`)
- Lab 04 UI: D12 parser + `tests/profile.test.ts` · 5 หน้าทำใหม่โดย agent `frontend` ตาม D4–D15 · palette D15 (Teal) · contract check โดย OpenCode `backend` → `docs/fe-be-contract-check.md` (ไม่มี mismatch ฝั่ง UI) · PR #13 · handoff `docs/handoffs/04-claude-to-opencode.md`
- L2: แก้ author ของ commit ที่ยังไม่ push ให้เป็น noreply ก่อน push ครั้งแรก (hash เปลี่ยนทั้งหมด · สำรองไว้ใน branch ในเครื่อง `backup/pre-author-reset`)
- Lab 05 Backend: `db.ts` implement `insertContact` / `listGuestbook` / `insertGuestbook` (validate + error code ปลอดภัยตาม D11) · `guestbook.ts` kill switch per-request + validate 400 + honeypot silent-drop 201 + rate limit 429 (5 โพสต์/10 นาที/IP in-memory) + 5xx ข้อความกลาง · `contact.ts` ตอบ 410 (D8) · ขั้นตอนลบโพสต์ `docs/guestbook-delete.md` (D10 · L5) — ปิด L5
- Lab 05 ขั้นที่ 4: agent `frontend` ตรวจการผูกฟอร์ม → `docs/be-fe-integration-check.md` · ไม่มี mismatch ของสัญญา · mismatch 5 ข้อใน `fe-be-contract-check.md` ปิดครบ · ข้อเสนอแนะ BE เรื่อง rate limit (L11)
- L11: rate limit key ใหม่ (XFF ค่าท้ายที่ proxy เติม → `clientAddress` → ไม่มีตัวตนจริง = ไม่จำกัด ไม่ล็อกทั้งเว็บ) · sweep key หมดอายุทุกครั้งที่บันทึก hit · honeypot non-string ถูก silent drop — สัญญาไม่เปลี่ยน · ตรวจด้วย curl ครบ (ดู `docs/handoffs/05-opencode-to-claude-l11.md`)
- Lab 06 QA (E2E + a11y debate) — อยู่ใน branch `lab-06-qa` (ยังไม่ push · เข้า main หลัง #14)
- Lab 07 PR #14: Claude `reviewer` → `docs/review-claude.md` (Must 1 · Should 5 · Nit 10) · OpenCode `backend` one-shot → `docs/review-opencode-rebuttal.md` + แก้ M1 runbook ลบโพสต์ (`path.join(DATA_DIR,'site.sqlite')` + `fileMustExist`) · Round 2 close: M1 accept (fixed) · ไม่เหลือ Must เปิด

## In progress

- PR #14 [Lab 05] Guestbook API — review ปิดแล้ว · รอ PR comment + merge (Closes #5 · Refs #6)

## Blocked

- —

## Next actions

1. เจ้าของ: โพสต์ PR comment Lab 07 บน #14 · merge #14 · ตัดสิน L17 (ownership `astro.config.mjs` · ship gate S1/S2/S4 · topology)
2. Claude: หลัง merge #14 → เอา `lab-06-qa` เข้า main · แก้ถ้อยคำ QA.md ข้อ 10 (`textContent` ไม่ใช่ `innerHTML`) · L8
3. OpenCode: L16 follow-up จากรีวิว (S1–S4) ก่อน Lab 08
4. เจ้าของ: อ่านทวน case study (#2 · L9) · อีเมลนามแฝง (L3)

## Files changed in latest session

- `docs/review-claude.md` · `docs/review-opencode-rebuttal.md` · `docs/guestbook-delete.md` (M1 · OpenCode) · `docs/STATUS.md` · `docs/OPEN_LOOPS.md`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- Latest D-id: **D15**
- Writer ของ STATUS/OPEN_LOOPS รอบ Lab 07 = Claude · OpenCode ถูกเรียกแบบ one-shot เขียนเฉพาะ rebuttal + runbook
- Branch: `lab-06-qa` มี STATUS/OPEN_LOOPS เวอร์ชัน Lab 06 (L14 · L15) — ตอน merge เข้า main ต้องรวมกับไฟล์นี้ด้วยมือ
- Verify รอบ L11: `npm run test:labs` เขียว (2) · `npm test` เขียว (11) · `npm run build` ผ่าน · curl (port 4460 · DATA_DIR ชั่วคราว): bucket ต่อ IP, ค่าท้าย XFF, honeypot non-string ไม่ insert, 429 ทำงาน
