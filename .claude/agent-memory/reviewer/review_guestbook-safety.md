---
name: review-guestbook-safety
description: Guestbook PR checklist — innerHTML/XSS, honeypot a11y, kill switch covering UI+API with runtime env read (D9, D10)
metadata:
  type: project
---

ทุก PR ที่แตะ guestbook (UI หรือ API) ให้ตรวจตาม D9 / D10

**Why:** เว็บไม่มีหน้า admin และ runtime image ไม่มี `sqlite3` CLI ด่านสุดท้ายจึงเป็น kill switch ถ้าทำไม่ครบ ข้อมูลที่เป็นปัญหาจะยังหลุดออกไปได้

**How to apply:**
- **XSS:** ห้ามเอาข้อมูลผู้ใช้ไปต่อเข้า `innerHTML` ทุก field รวม `created_at` ต้องใช้ `textContent` หรือสร้าง DOM node · ฝั่ง server validate และจำกัดความยาวด้วย
- **Honeypot:** ต้องมี `aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"` และซ่อนด้วย CSS (ไม่ใช้ `type=hidden`) ไม่อย่างนั้นโปรแกรมอ่านหน้าจอหรือ autofill จะกรอกช่องนี้แล้วโดนบล็อก
- **Kill switch ต้องครอบคลุมทั้ง UI และ API:** ตอนปิด GET ต้องคืนรายการว่างด้วย การซ่อนแค่ฟอร์มหรือรายการใน UI ไม่พอ · POST → 503
- **env ต้องอ่านตอน runtime** (`process.env`) — ถ้าเจอ `import.meta.env` สำหรับ flag นี้ให้ Must เพราะค่าอาจถูกฝังไว้ตอน build
- หลักฐานที่ต้องมีใน PR: สลับค่า env แล้ว `curl` ทั้ง GET และ POST
- form ห้ามมีช่องอีเมล และ label ชื่อต้องไม่ชวนให้ใส่ชื่อจริง
