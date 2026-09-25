---
name: review-course-leak-beyond-test
description: Every PR — check for course/scaffold text reaching visitors via paths the leak-guard test does not scan (frontmatter, FALLBACK, runtime data.error, words like คอร์ส/เวิร์กช็อป)
metadata:
  type: project
---

leak-guard test (`tests/public-site.test.ts`) ตรวจแค่ markup ของ `.astro`/`.html` หลังตัด frontmatter ออก และ regex จับแค่ `lab N` / `แล็บ` เท่านั้น การที่ test เขียวจึงยังไม่ใช่หลักฐานว่าไม่มีข้อความหลุด

**Why:** ใน Lab 02 debate พบว่าข้อความหลุดได้อย่างน้อย 4 ทางที่ test ไม่จับ (ดู D6, D11 ใน `docs/DECISIONS.md`)

**How to apply:** ทุก PR ที่แตะ UI / API / `src/lib/` ให้ grep diff หาสิ่งเหล่านี้เอง
- props default ใน frontmatter (`description`, `title` ใน layout)
- `FALLBACK` ใน parser และข้อความ scaffold ("Personal branding site", "Your Name", "เร็ว ๆ นี้")
- ข้อความที่ throw จาก `db.ts` / API แล้วไหลผ่าน `data.error` ขึ้นหน้าเว็บ (UI ห้ามแสดง `data.error` ดิบ · D11)
- คำว่า "คอร์ส", "เวิร์กช็อป", "course", "workshop" ซึ่ง `public-site-safe` ห้ามไว้แต่ regex ไม่จับ
- ลิงก์ไป repo / PR ของเว็บนี้ (D6 อนุญาตแค่ GitHub profile)

ดูเพิ่ม [[review-verifiable-claims]]
