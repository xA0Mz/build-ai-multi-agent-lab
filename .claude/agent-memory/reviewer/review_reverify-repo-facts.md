---
name: review-reverify-repo-facts
description: Re-check live repo facts every review (visibility, git author email, tools in runtime image) — never trust a snapshot or memory
metadata:
  type: feedback
---

ข้อเท็จจริงของ repo และ infra ต้องตรวจใหม่ทุกครั้งที่รีวิว อย่าเชื่อจาก snapshot, memory หรือข้อความของ agent อื่น

**Why:** ใน Lab 02 ข้อสรุปสำคัญหลายข้อ (D7, D10) มาจากการตรวจจริง ไม่ใช่จากสมมุติฐาน: repo กลายเป็น public, อีเมล author ใน commit เป็นอีเมลส่วนตัว และ runtime image ไม่มี `sqlite3` ทำให้แผนลบโพสต์เดิมทำไม่ได้

**How to apply:** ก่อนสรุปรีวิวให้ตรวจเหล่านี้ใหม่
- visibility ของ repo: `gh repo view --json visibility`
- อีเมล author ของ commit ใหม่ใน PR ต้องเป็น GitHub noreply (D7) — ตอนรายงาน **ห้ามพิมพ์อีเมลจริง แม้จะ mask แล้ว** ให้บอกแค่ว่า "เป็น noreply หรือไม่"
- Dockerfile / image ที่ใช้รันจริงมีเครื่องมืออะไรบ้าง ก่อนเชื่อขั้นตอน ops ใน docs
- เวอร์ชันของ Astro และวิธีอ่าน env (runtime หรือ build time)
