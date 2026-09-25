# Open Loops

> คัดลอกเป็น `docs/OPEN_LOOPS.md` ใน Lab 00 · งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 13:00 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L2 | ตั้ง `git config user.email` เป็น GitHub noreply | human | P0 | ก่อน push | D7 · #7 · ตั้ง noreply (repo-local) แล้ว · เหลือตัดสินว่าจะแก้ author ของ commit ที่ยังไม่ push หรือไม่ |
| L3 | สร้างอีเมลนามแฝงบัญชีแยก (display name `xA0Mz` ไม่ผูกกับบัญชีหลัก) · ทดสอบส่งหาตัวเอง · ใส่แทน `demo@example.com` ใน PROFILE | human | P0 | ก่อนทำหน้า Contact ใน Lab 04 | D8 · #6 · ถ้าทำไม่ได้ ต้องกลับมาตัดสินใหม่ (GitHub อย่างเดียว) |
| L4 | แก้ `src/lib/profile.ts`: อ่านหลายบรรทัด · whitelist หัวข้อ · `interestDetails` · test ใหม่ | Claude | P0 | ต้นงาน Lab 04 | D12 · #1 |
| L5 | handoff ถึง backend: `GUESTBOOK_ENABLED` (GET `[]` / POST 503 / `process.env`) · `/api/contact` 404/410 · ข้อความ error ใน `db.ts` ปลอดภัยต่อผู้ชม · rate limit · ขั้นตอนลบโพสต์ผ่าน `docker exec` + `node -e` | Claude → OpenCode | P1 | ก่อน Lab 05 | D8 · D10 · D11 · #5 #6 |
| L6 | เพิ่ม `src/lib/profile.ts` ในตาราง Ownership (`AGENTS.md` / `CLAUDE.md`) = Claude frontend | human | P2 | Lab 03 | D12 |
| L7 | (ไม่บังคับ) rename repo หรือทำเป็น private เพื่อลดร่องรอยว่ามาจาก template | human | P2 | ก่อน ship | D6 |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-25 |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
