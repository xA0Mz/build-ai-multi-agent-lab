# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 14:40 +07:00  
Updated by: Claude

## Current goal

- Lab 05 Backend (OpenCode agent `backend`): guestbook API + `/api/contact` 410 ตาม `docs/handoffs/04-claude-to-opencode.md`

## Done

- Lab 00 init · Lab 01 `docs/PROFILE.md`
- Lab 02: debate 5 รอบ → `docs/DEBATE.md` · `docs/DECISIONS.md` D1–D14 · PROFILE แก้ตาม D2/D3
- Lab 03: GitHub issues #1–#7 จาก D1–D14 · #8 (gh draft) · ตาราง issue ↔ decision ใน DECISIONS (commit `e7ec61c`)
- Lab 04 UI: D12 parser + `tests/profile.test.ts` · 5 หน้าทำใหม่โดย agent `frontend` ตาม D4–D15 · palette D15 (Teal) · contract check โดย OpenCode `backend` → `docs/fe-be-contract-check.md` (ไม่มี mismatch ฝั่ง UI) · PR #13 · handoff `docs/handoffs/04-claude-to-opencode.md`
- L2: แก้ author ของ commit ที่ยังไม่ push ให้เป็น noreply ก่อน push ครั้งแรก (hash เปลี่ยนทั้งหมด · สำรองไว้ใน branch ในเครื่อง `backup/pre-author-reset`)

## In progress

- PR #13 รอ review / merge

## Blocked

- —

## Next actions

1. OpenCode `backend`: Lab 05 ตาม handoff 04 · `npm run test:labs` ต้องเขียว
2. เจ้าของ: อ่านทวนถ้อยคำ case study ใน About (#2) · ตัดสินข้อตีความ D10 (ซ่อนปุ่มรองบน Home ตอนปิด) · แนบ screenshot ใน PR #13
3. เจ้าของ: สร้างอีเมลนามแฝงแล้วแทน `demo@example.com` ใน PROFILE (L3)

## Files changed in latest session

- `src/lib/profile.ts` · `tests/profile.test.ts` · `src/layouts/BaseLayout.astro` · `src/pages/*.astro` · `docs/DECISIONS.md` (D15) · `docs/fe-be-contract-check.md` · `docs/handoffs/04-claude-to-opencode.md` · `.claude/agent-memory/frontend/*`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- Latest D-id: **D15**
- Writer รอบถัดไปของ STATUS/OPEN_LOOPS = OpenCode (`backend`)
