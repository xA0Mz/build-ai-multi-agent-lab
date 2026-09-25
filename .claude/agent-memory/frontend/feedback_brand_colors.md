---
name: brand-colors-from-profile
description: สีหลัก/โทนแบรนด์ของเว็บต้องเอามาจาก docs/PROFILE.md ห้าม hardcode เอง ถ้า PROFILE ยังไม่ระบุให้ใช้ CSS tokens ใน :root ของ BaseLayout.astro
metadata:
  type: feedback
---

สีหลักของเว็บให้เอาตาม `docs/PROFILE.md` ผู้เรียนขอให้จำไว้เมื่อ 2026-09-25

**Why:** PROFILE.md เป็น source of truth ของแบรนด์ (Claude เป็น owner ช่วง Lab 01–02) ถ้าคิดสีหรือ hardcode hex เอง แบรนด์จะหลุดจากโปรไฟล์ แล้วต้องมาไล่แก้หลายจุดตอน PROFILE เปลี่ยน

**How to apply:**
- ก่อนแตะงาน UI ที่เกี่ยวกับสีหรือธีม ให้อ่าน `docs/PROFILE.md` ทุกครั้ง อย่าเชื่อ snapshot ในไฟล์นี้
- สถานะตอน 2026-09-25: PROFILE.md **ยังไม่ระบุโทนสี/แบรนด์** (มีแค่ Name, Headline, Bio, Audience, Interests และยังเป็น placeholder รอ Lab 01 interview)
- ระหว่างที่ PROFILE ยังไม่มีสี ให้ใช้ CSS tokens ใน `:root` ของ `src/layouts/BaseLayout.astro` (`--bg`, `--card`, `--text`, `--muted`, `--accent`, `--border`) เป็นค่า fallback ไปก่อน
- ในคอมโพเนนต์/หน้าให้อ้าง `var(--token)` เสมอ ห้ามใส่ hex ตรง ๆ
- เมื่อ PROFILE ระบุสีแล้ว ให้แก้ที่ tokens ใน `:root` จุดเดียว แล้วอัปเดตสถานะในไฟล์นี้
- ถ้าสีใน PROFILE ขัดกับ `docs/DECISIONS.md` ให้หยุดถามผู้เรียนก่อนแก้
