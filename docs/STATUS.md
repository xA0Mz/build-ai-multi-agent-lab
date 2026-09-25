# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 15:05 +07:00  
Updated by: OpenCode

## Current goal

- Lab 06 QA (Playwright) — ตาม `docs/handoffs/05-opencode-to-claude.md`

## Done

- Lab 00 init · Lab 01 `docs/PROFILE.md`
- Lab 02: debate 5 รอบ → `docs/DEBATE.md` · `docs/DECISIONS.md` D1–D14 · PROFILE แก้ตาม D2/D3
- Lab 03: GitHub issues #1–#7 จาก D1–D14 · #8 (gh draft) · ตาราง issue ↔ decision ใน DECISIONS (commit `e7ec61c`)
- Lab 04 UI: D12 parser + `tests/profile.test.ts` · 5 หน้าทำใหม่โดย agent `frontend` ตาม D4–D15 · palette D15 (Teal) · contract check โดย OpenCode `backend` → `docs/fe-be-contract-check.md` (ไม่มี mismatch ฝั่ง UI) · PR #13 · handoff `docs/handoffs/04-claude-to-opencode.md`
- L2: แก้ author ของ commit ที่ยังไม่ push ให้เป็น noreply ก่อน push ครั้งแรก (hash เปลี่ยนทั้งหมด · สำรองไว้ใน branch ในเครื่อง `backup/pre-author-reset`)
- Lab 05 Backend: `db.ts` implement `insertContact` / `listGuestbook` / `insertGuestbook` (validate + error code ปลอดภัยตาม D11) · `guestbook.ts` kill switch per-request + validate 400 + honeypot silent-drop 201 + rate limit 429 (5 โพสต์/10 นาที/IP in-memory) + 5xx ข้อความกลาง · `contact.ts` ตอบ 410 (D8) · ขั้นตอนลบโพสต์ `docs/guestbook-delete.md` (D10 · L5) — ปิด L5

## In progress

- PR #13 รอ review / merge (ตอนนี้มี UI + API ครบใน branch เดียว)

## Blocked

- —

## Next actions

1. Claude: Lab 06 QA — อัปเดต `playwright/smoke.spec.ts` ให้ตรง D8 (L8) · รัน `npm run test:e2e` กับ dev server
2. เจ้าของ: อ่านทวนถ้อยคำ case study ใน About (#2) · ตัดสินข้อตีความ D10 (ซ่อนปุ่มรองบน Home ตอนปิด) · แนบ screenshot ใน PR #13
3. เจ้าของ: สร้างอีเมลนามแฝงแล้วแทน `demo@example.com` ใน PROFILE (L3)

## Files changed in latest session

- `src/lib/db.ts` · `src/pages/api/guestbook.ts` · `src/pages/api/contact.ts` · `docs/guestbook-delete.md` · `docs/STATUS.md` · `docs/OPEN_LOOPS.md` · `docs/handoffs/05-opencode-to-claude.md`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- Latest D-id: **D15**
- Writer รอบถัดไปของ STATUS/OPEN_LOOPS = Claude (หลัง commit + handoff นี้)
- Verify ของรอบนี้: `npm run test:labs` เขียว (2) · `npm test` เขียว (11) · `npm run build` ผ่าน · curl สลับ `GUESTBOOK_ENABLED` ครบทั้ง GET/POST/410/400/429/503 (ดู handoff 05)
