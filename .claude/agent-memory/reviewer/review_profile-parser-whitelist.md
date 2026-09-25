---
name: review-profile-parser-whitelist
description: PROFILE.md parser must whitelist headings — Private/Brainstorm sections must never render; interests contract stays string[] (D12)
metadata:
  type: project
---

`docs/PROFILE.md` มีหัวข้อ `## Private` และ `## Brainstorm` ที่ห้ามขึ้นเว็บ parser ต้อง whitelist หัวข้อที่อ่านได้ ห้ามทำแบบ generic ที่อ่านทุกหัวข้อ

**Why:** D12 — parser เดิมตัดทุกหัวข้อเหลือบรรทัดเดียวโดยที่ smoke test ไม่จับ ถ้าตอนแก้เปลี่ยนไปอ่านทุกหัวข้อ ข้อมูล Private จะรั่ว · `/api/interests` (owner = backend) ใช้ `interests` ชุดเดียวกัน ถ้ารูปแบบเปลี่ยนจะกระทบข้ามฝั่ง

**How to apply:** PR ที่แตะ `src/lib/profile.ts` หรือเปลี่ยนรูปแบบ PROFILE ต้องมี test ว่า Bio ครบหลายย่อหน้า · `interests` เป็นชื่อล้วน (ไม่มี `: ` หลุดมา) · ไม่มีเนื้อหาจาก Private/Brainstorm · ต้องไม่มีการเพิ่มหัวข้อใหม่ใน whitelist โดยไม่มี D-id รองรับ
