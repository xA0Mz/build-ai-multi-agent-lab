---
name: profile-ts-ownership
description: Frontend (Claude) เป็น owner ของ src/lib/profile.ts (D12) · ต้องคง interests เป็น string[] ชื่อล้วน เพราะ /api/interests ของ backend คืนค่านี้ตรง ๆ · ห้ามให้ ## Private / ## Brainstorm ขึ้นเว็บ
metadata:
  type: project
---

`src/lib/profile.ts` เป็นของ Frontend ตาม D12 ใน `docs/DECISIONS.md` (ตัดสิน 2026-09-25 หลัง Lab 02)

**Why:** ไฟล์นี้ไม่อยู่ในตาราง Ownership ของ AGENTS.md / CLAUDE.md และเป็นตัวแปลงเนื้อหาสำหรับ UI ส่วน backend เป็นแค่ผู้ใช้ผ่าน `src/pages/api/interests.ts` ซึ่งคืน `profile.interests` ตรง ๆ ถ้าเปลี่ยนรูปแบบ field นี้ API ของ backend จะเปลี่ยนตามโดยที่ backend ไม่รู้

**How to apply:**
- `interests: string[]` ต้องเป็นชื่อล้วนเสมอ ข้อมูลใหม่ให้เพิ่มเป็น field แยก เช่น `interestDetails` ตาม D12 ห้ามเปลี่ยน type เดิม
- parser ต้อง whitelist หัวข้อ ห้ามให้ `## Private` / `## Brainstorm` ถูก parse ขึ้นเว็บ
- ถ้าจะเปลี่ยนสัญญาที่ backend ใช้อยู่ ให้เขียน handoff ใน `docs/handoffs/` และบันทึก D-id ก่อน อย่าแก้ `src/pages/api/**` เอง
- เกณฑ์ว่าเสร็จและ test ที่ต้องเพิ่ม ดูที่ D12 และหัวข้อ "เกณฑ์พร้อม Frontend" ใน DECISIONS ไม่ต้องคัดลอกมาไว้ที่นี่
- ถ้า smoke test ผ่าน ยังไม่ได้แปลว่า parser ถูก ใน Lab 02 test ผ่านทั้งที่ Bio เหลือ 1 ย่อหน้าและ Interests เหลือ 1 ข้อ ให้ตรวจผลที่ parse ได้จาก PROFILE จริงด้วย
