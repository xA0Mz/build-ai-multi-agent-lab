---
name: brand-colors-from-profile
description: Palette ของเว็บ = D15 (B Teal) ที่เจ้าของเลือกแล้ว · แก้สีที่ :root ใน BaseLayout จุดเดียว · ในหน้าใช้ var(--token) เท่านั้น ห้าม hex · ไฮไลต์เหลืองห้ามเป็นสีตัวอักษร
metadata:
  type: feedback
---

สีของเว็บต้องมาจากการตัดสินใจที่เจ้าของอนุมัติ ไม่ใช่ที่ frontend คิดเอง ผู้เรียนขอให้จำไว้ (2026-09-25)

**สถานะ 2026-09-25:** เจ้าของเลือก palette **D15 (B Teal สดชื่น)** ใน `docs/DECISIONS.md` แล้ว และ implement ที่ `:root` ของ `src/layouts/BaseLayout.astro` แล้ว (แทนโทนกรมท่ามืดของ template) · ค่าสีและผล contrast ดูใน D15 อย่าเชื่อ snapshot ในไฟล์นี้

**Why:** PROFILE `## Tone` บอกแค่ "สดใส เป็นกันเอง" ไม่ได้ระบุสี จึงต้องให้เจ้าของเลือกเป็น D-id · ถ้า hardcode hex ในหน้า แบรนด์จะหลุดและต้องไล่แก้หลายจุด

**How to apply:**
- แก้สีที่ `:root` จุดเดียว · ในหน้าและคอมโพเนนต์ใช้ `var(--token)` เสมอ (hover ใช้ `color-mix()` กับ token ได้ ไม่ต้องเพิ่ม hex)
- ไฮไลต์เหลือง (`--highlight`) ใช้ตกแต่งเท่านั้น เช่น แถบใต้ข้อความหรือเส้นขอบ ห้ามเป็นสีตัวอักษร
- ขอบช่องกรอก (input/textarea) ใช้ `--muted` ไม่ใช่ `--border` เพราะ `--border` บนพื้นขาว contrast ต่ำกว่า 3:1 (non-text contrast)
- จะเปลี่ยน palette ต้องเสนอพร้อมผล contrast แล้วให้เจ้าของอนุมัติเป็น D-id ใหม่ก่อน · ถ้า PROFILE `## Tone` ภายหลังระบุสีที่ขัดกับ D15 ให้หยุดถามก่อนแก้
