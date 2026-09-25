# Open Loops

> คัดลอกเป็น `docs/OPEN_LOOPS.md` ใน Lab 00 · งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 15:05 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L3 | สร้างอีเมลนามแฝงบัญชีแยก (display name `xA0Mz`) · ทดสอบส่งหาตัวเอง · ใส่แทน `demo@example.com` ใน PROFILE | human | P0 | ก่อน ship | D8 · #6 · หน้า Contact อ่านจาก PROFILE อัตโนมัติ · ตอนนี้แสดง `demo@example.com` (เจ้าของสั่ง) |
| L8 | `playwright/smoke.spec.ts` ยังคาดฟอร์ม Contact (Name/Email/Message) → ขัดกับ D8 | Claude | P1 | Lab 06 QA | พบใน Lab 04 · ไม่อยู่ใน `npm test` |
| L9 | อ่านทวนถ้อยคำ case study 4 bullet ใน About · ตัดสินข้อตีความ D10 (ซ่อนปุ่มรองบน Home ตอนปิด) | human | P1 | ก่อน merge PR #13 | D3 · D5 · D10 · #2 |
| L6 | เพิ่ม `src/lib/profile.ts` ในตาราง Ownership (`AGENTS.md` / `CLAUDE.md`) = Claude frontend | human | P2 | — | D12 |
| L7 | (ไม่บังคับ) rename repo หรือทำเป็น private เพื่อลดร่องรอยว่ามาจาก template | human | P2 | ก่อน ship | D6 |
| L10 | ลบ branch ในเครื่อง `backup/pre-author-reset` (มี commit ที่ใช้อีเมลส่วนตัว · ห้าม push) | human | P2 | เมื่อมั่นใจว่า history ใหม่ถูกต้อง | L2 |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-25 |
| L2 | git noreply + แก้ author ของ commit ที่ยังไม่ push ก่อน push ครั้งแรก | 2026-09-25 |
| L4 | D12 parser + test | 2026-09-25 (PR #13) |
| L5 | Guestbook API + `/api/contact` 410 + error ปลอดภัย + rate limit + ขั้นตอนลบโพสต์ | 2026-09-25 (Lab 05 · `docs/guestbook-delete.md`) |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
