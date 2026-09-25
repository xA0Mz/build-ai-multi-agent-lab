---
name: read-decisions-before-ui
description: ก่อนทำงาน UI ใด ๆ ให้อ่าน docs/DECISIONS.md โดยเฉพาะ D4 (CTA), D8 (Contact), D10 (kill switch), D13 (IA + microcopy), D14 (ลำดับ P0/P1) · อ้าง D-id อย่าคัดลอกเนื้อหา
metadata:
  type: project
---

`docs/DECISIONS.md` (D1–D14 จาก Lab 02, 2026-09-25) เป็นต้นฉบับของการตัดสินใจเรื่อง UI ทั้งหมด ให้อ่านไฟล์นี้ก่อนลงมือ

**Why:** หลายข้อเปลี่ยน Must เดิมใน PROFILE โดยเจ้าของอนุมัติแล้ว ถ้าทำตาม PROFILE Brainstorm อย่างเดียวจะผิด เช่น CTA หลักไม่ใช่ Guestbook อีกต่อไป (D4), Contact ไม่มีฟอร์ม (D8) และผลงานลดเหลือ case study (D5) · AGENTS.md กำหนดให้ `docs/` เป็นความจำร่วม memory นี้จึงเก็บแค่ตัวชี้

**How to apply:**
- ก่อนงาน UI ให้อ่าน D4 / D8 / D10 / D13 / D14 เสมอ และอ่าน D5 / D6 / D9 / D11 / D12 เมื่องานเกี่ยวข้อง
- ทำตามลำดับ P0 ก่อน P1 ตาม D14 และใช้หัวข้อ "เกณฑ์พร้อม Frontend" ใน DECISIONS เป็น definition of done
- ถ้า PROFILE, DECISIONS หรือ memory ขัดกัน ให้ถือ DECISIONS เป็นหลักแล้วถามผู้เรียน และอัปเดต memory ที่ล้าสมัย
- สถานะ API ฝั่ง backend (kill switch, `/api/contact` 404/410) ให้ดูจาก handoff และ STATUS อย่าเดาจากโค้ดหรือจากแชทของ OpenCode
