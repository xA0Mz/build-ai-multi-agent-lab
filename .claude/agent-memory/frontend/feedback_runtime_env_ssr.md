---
name: runtime-env-ssr
description: env ที่ต้องสลับค่าได้หลัง deploy (เช่น GUESTBOOK_ENABLED) ต้องอ่านผ่าน process.env ในหน้า SSR ห้ามใช้ import.meta.env · ตรวจโดยสลับค่าแล้ว curl จริง
metadata:
  type: feedback
---

ถ้าค่า env ต้องเปลี่ยนได้โดยไม่ build ใหม่ ให้อ่านผ่าน `process.env` ใน frontmatter ของหน้า SSR (`prerender = false`) **ห้ามใช้ `import.meta.env`**

**Why:** `import.meta.env` อาจถูกฝังค่าไว้ตั้งแต่ตอน build ถ้าเจ้าของเปลี่ยนค่าใน Coolify เพื่อปิด guestbook ฉุกเฉิน หน้าเว็บจะไม่เปลี่ยนตาม kill switch จึงใช้ไม่ได้จริง (Devil ชี้ใน Lab 02 และบันทึกเป็น D10)

**How to apply:**
- ใช้กับ kill switch `GUESTBOOK_ENABLED` (ค่าที่ปิดคือ `"false"` เท่านั้น) และ env อื่นที่ตั้งใจให้สลับค่าได้ตอน runtime
- ซ่อนแค่ UI ยังไม่พอ ต้องให้ API ปิดด้วย ฝั่ง API เป็นงาน backend ตามสัญญาใน D10
- ถือว่าเสร็จเมื่อสลับค่า env แล้ว `curl` ทั้งหน้าเว็บและ API จริง ไม่ใช่แค่ดูโค้ด
- dev server ที่ 4321 เป็นของผู้เรียน ห้ามรัน `npm run dev` เอง · วิธีที่ใช้ได้: `npm run build` ครั้งเดียว แล้วรัน `node dist/server/entry.mjs` บนพอร์ตอื่น (`HOST=127.0.0.1 PORT=4399`) สลับ `GUESTBOOK_ENABLED` โดยไม่ build ใหม่ · และ grep `dist/server/chunks` ว่ายังเหลือ `process.env.GUESTBOOK_ENABLED` (ไม่ถูกแทนเป็นค่าคงที่)
