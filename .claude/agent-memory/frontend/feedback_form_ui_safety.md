---
name: form-ui-safety
description: ฟอร์มสาธารณะ (guestbook) ต้อง render ข้อมูลผู้ใช้ด้วย textContent ทุก field, เช็ค res.ok, ห้ามแสดง error ดิบ และ honeypot ต้องซ่อนจาก a11y/autofill
metadata:
  type: feedback
---

ฟอร์มที่คนแปลกหน้าเขียนได้ ต้องทำตามกฎ D9 และ D11 ใน `docs/DECISIONS.md`

**Why:** ใน Lab 02 พบว่า `guestbook.astro` ต่อ `innerHTML` จากข้อมูลผู้ใช้ (รวม `created_at`) ไม่เช็ค `res.ok` ตอน submit และแสดง `data.error` ดิบ · honeypot ที่ไม่ซ่อนจาก screen reader หรือ autofill จะบล็อกคนจริงแทนบอท

**How to apply:**
- render ข้อมูลจาก API ด้วย `textContent` หรือสร้าง element เอง ทุก field ไม่ใช่เฉพาะชื่อกับข้อความ
- เช็ค `res.ok` ทุกครั้งที่เรียก fetch และแสดงข้อความสถานะใน `role="status"` / `aria-live`
- honeypot: `aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"` และซ่อนด้วย CSS ห้ามใช้ `type=hidden`
- honeypot และ rate limit กันได้แค่ best-effort ด่านสุดท้ายคือ kill switch ตาม [[runtime-env-ssr]]
- ข้อความ label และ error ให้ใช้ตาม D9 / D11 / D13 ไม่ต้องคัดลอกมาไว้ที่นี่
- ดูกฎข้อความที่หลุดใน [[public-copy-leaks]] ด้วย
