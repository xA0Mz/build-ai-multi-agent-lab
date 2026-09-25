---
name: brand-colors-from-profile
description: สี/ธีมของเว็บต้องมาจาก docs/PROFILE.md (## Tone) ห้าม hardcode hex ในหน้า · ยังไม่มีสีเจาะจง → frontend เสนอเอง แล้วแก้ที่ :root tokens ใน BaseLayout จุดเดียว
metadata:
  type: feedback
---

สีหลักของเว็บให้เอาตาม `docs/PROFILE.md` ผู้เรียนขอให้จำไว้ (2026-09-25)

**Why:** PROFILE.md เป็น source of truth ของแบรนด์ ถ้าคิดสีหรือ hardcode hex เอง แบรนด์จะหลุดจากโปรไฟล์ และต้องไล่แก้หลายจุดเมื่อ PROFILE เปลี่ยน

**How to apply:**
- ก่อนแตะงานสีหรือธีม ให้อ่าน `## Tone` ใน `docs/PROFILE.md` ใหม่ทุกครั้ง อย่าเชื่อ snapshot ในไฟล์นี้
- สถานะ 2026-09-25 (หลัง Lab 02): มี `## Tone` แล้ว โทน "สดใส เป็นกันเอง" แต่**ยังไม่มีสีเจาะจง** PROFILE มอบให้ frontend เสนอใน Lab 04 และ Brainstorm กำหนดว่า contrast ต้องผ่าน a11y
- tokens ปัจจุบันใน `:root` ของ `src/layouts/BaseLayout.astro` เป็นโทนกรมท่ามืด ซึ่งอาจไม่ตรงกับ "สดใส" ถ้าจะเปลี่ยนให้เสนอ palette พร้อมผล contrast แล้วให้ผู้เรียนอนุมัติ (บันทึกเป็น D-id ใน DECISIONS) ก่อนแก้
- ในคอมโพเนนต์และหน้าให้ใช้ `var(--token)` เสมอ ห้ามใส่ hex ตรง ๆ · แก้สีที่ `:root` จุดเดียว
- `profile.ts` ไม่ได้ parse `## Tone` ให้อ่านจากเอกสาร ไม่ใช่จากโค้ด
- ถ้าสีใน PROFILE ขัดกับ `docs/DECISIONS.md` ให้หยุดถามผู้เรียนก่อนแก้
