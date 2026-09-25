---
name: review-unused-routes-closed
description: When UI stops using an endpoint (e.g. contact form removed), the API route must actually be closed, not just unlinked (D8)
metadata:
  type: project
---

ถ้า PR เอาฟอร์มหรือ UI ที่เรียก route ออก ต้องตรวจว่า route นั้นถูกปิดจริง (404/410) ไม่ใช่แค่ไม่มีลิงก์ไปถึง

**Why:** D8 — ฟอร์ม Contact ถูกเอาออก แต่ถ้า `/api/contact` ยังรับ POST ได้ บอทก็ยังส่งเข้ามาได้ อีเมลของคนแปลกหน้าจะถูกเก็บลงฐานข้อมูลโดยไม่มีใครอ่าน (PDPA) ส่วน Lab 05 test ทดสอบ `insertContact` ที่ชั้น `db.ts` เท่านั้น การปิด route จึงไม่ทำให้ test พัง

**How to apply:** ทุก PR ฝั่ง backend หรือ UI ที่เกี่ยวกับ contact / endpoint ใหม่ ให้ `curl` route ตรง ๆ ดู status · ถ้า route ถูกเปิดกลับมาต้องมีข้อความแจ้งการเก็บข้อมูลและนโยบายระยะเวลาเก็บใน DECISIONS ก่อน
