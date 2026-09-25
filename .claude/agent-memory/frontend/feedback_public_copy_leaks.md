---
name: public-copy-leaks
description: กฎ public-site-safe ห้ามพูดถึง Lab/คอร์ส/เวิร์กช็อปในหน้าเว็บ ซึ่งกว้างกว่าที่ leak-guard test จับ · รวมจุดที่ข้อความภายในหลุดโดย test ไม่เห็น (description default, FALLBACK, data.error ตอน runtime)
metadata:
  type: feedback
---

อย่าใช้ leak-guard test เป็นเกณฑ์ว่าหน้าเว็บปลอดภัยแล้ว ให้ถือตามกฎใน skill `public-site-safe` ซึ่งห้ามเขียนถึง **Lab / คอร์ส / เวิร์กช็อป** ใน markup ที่ render ออกไป

**Why:** ใน Lab 02 debate ผมเสนอให้บอกบนเว็บว่าสร้างจากคอร์ส (F11) โดยอ้างว่า test จับแค่ "lab N" / "แล็บ" แต่ skill ห้ามคำว่า "คอร์ส" ด้วย จึงต้องถอนข้อเสนอ ผลคือ D6: บนเว็บเล่าแค่ "สร้างร่วมกับ Claude Code + OpenCode แบบ multi-agent" และไม่ลิงก์ repo หรือ PR · Devil ยังชี้ว่ามีข้อความภายในหลุดหลายทางที่ test ไม่เห็น (D11)

**How to apply:**
- ก่อนเขียนข้อความบนหน้าเว็บ ให้อ่าน `.claude/skills/public-site-safe/SKILL.md` เอง อย่าอนุมานกฎจาก regex ใน `tests/public-site.test.ts`
- จุดที่ต้องตรวจเองทุกครั้ง เพราะ test ไม่สแกน:
  - frontmatter / props default เช่น `description` และ `title` default ใน `BaseLayout.astro`
  - `FALLBACK` ใน `src/lib/profile.ts` ซึ่งขึ้นเว็บเมื่อ parse พลาด ห้ามมีข้อความ scaffold หรือข้อมูลที่ไม่จริง
  - ข้อความ error ตอน runtime (`data.error` จาก API): **ห้ามแสดงดิบ** ให้แปลงเป็นข้อความสำหรับผู้ชมเสมอ ข้อความจริงอยู่ใน D11
  - microcopy ที่มีข้อมูลสำหรับ dev เช่น path API หรือบรรทัด `Audience:`
- ห้ามลิงก์ repo หรือ PR ของเว็บนี้จากหน้าเว็บ ลิงก์ได้แค่ GitHub profile (D6)
- คำอวดบนเว็บต้องตรวจสอบได้ (D3) ถ้าไม่มีหลักฐานให้ลิงก์ ให้ตัดหรือลดความมั่นใจของประโยคลง
