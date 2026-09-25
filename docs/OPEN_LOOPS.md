# Open Loops

> คัดลอกเป็น `docs/OPEN_LOOPS.md` ใน Lab 00 · งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 17:00 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L3 | สร้างอีเมลนามแฝงบัญชีแยก (display name `xA0Mz`) · ทดสอบส่งหาตัวเอง · ใส่แทน `demo@example.com` ใน PROFILE | human | P0 | ก่อน ship | D8 · #6 · หน้า Contact อ่านจาก PROFILE อัตโนมัติ · ตอนนี้แสดง `demo@example.com` (เจ้าของสั่ง) |
| L8 | `playwright/smoke.spec.ts` ยังคาดฟอร์ม Contact (Name/Email/Message) → ขัดกับ D8 | Claude | P1 | Lab 06 QA | พบใน Lab 04 · ไม่อยู่ใน `npm test` |
| L12 | หน้า `src/pages/404.astro` ภาษาไทยตามโทนเว็บ (ตอนนี้ขึ้น 404 default ของ Astro) | Claude | P2 | Lab 06 | D11 · D13 |
| L13 | ตอน deploy ตรวจว่า proxy (Coolify/Traefik) **append** `x-forwarded-for` และ app เข้าถึงตรงโดยไม่ผ่าน proxy ไม่ได้ — ไม่งั้นค่าท้ายปลอมได้ rate limit เลี่ยงได้ | human | P1 | Lab 08 | D9 · L11 · `docs/handoffs/05-opencode-to-claude-l11.md` · ยกเป็น P1 ตามรีวิว Lab 07 (S1) |
| L16 | follow-up รีวิว PR #14: S1 เลือกเชื่อ XFF ผ่าน env (`TRUST_PROXY_HOPS`) · S2 จำกัด body ~4 KB → 413 (อ่านแบบ stream ใน `guestbook.ts` · กัน chunked) · S3 `LIMIT` ใน `listGuestbook` · S4 route test ใน `npm test` · + Nit ฝั่ง `src/` | OpenCode | P1 | ก่อน Lab 08 | `docs/review-claude.md` Round 2 · `docs/review-opencode-rebuttal.md` · S1/S2/S4 เสนอเป็น ship gate (รอ L17) |
| L17 | เจ้าของตัดสิน: (1) ownership `astro.config.mjs` (reviewer เสนอ = backend · ออก D-id ใหม่) (2) รับ S1/S2/S4 เป็น ship gate Lab 08 ไหม (3) topology deploy: มี CDN/`cloudflared` ไหม · เปิด port 4321 ตรงไหม → ค่า `TRUST_PROXY_HOPS` | human | P1 | ก่อน Lab 08 | ผูก L13 · L16 |
| L15 | ลบแถวทดสอบ QA id 7–8 ใน `data/site.sqlite` ของเครื่อง (สิทธิ์ถูกปฏิเสธตอนรัน) — ใช้คำสั่งใน `docs/guestbook-delete.md` | human | P2 | ก่อน demo | Lab 06 · `docs/QA.md` ข้อสังเกต · ไม่กระทบ production (`data/` ถูก gitignore) |
| L9 | อ่านทวนถ้อยคำ case study 4 bullet ใน About · ตัดสินข้อตีความ D10 (ซ่อนปุ่มรองบน Home ตอนปิด) | human | P1 | ก่อน ship | D3 · D5 · D10 · #2 |
| L6 | เพิ่ม `src/lib/profile.ts` ในตาราง Ownership (`AGENTS.md` / `CLAUDE.md`) = Claude frontend | human | P2 | — | D12 |
| L7 | (ไม่บังคับ) rename repo หรือทำเป็น private เพื่อลดร่องรอยว่ามาจาก template | human | P2 | ก่อน ship | D6 |
| L10 | ลบ branch ในเครื่อง `backup/pre-author-reset` (มี commit ที่ใช้อีเมลส่วนตัว · ห้าม push) | human | P2 | เมื่อมั่นใจว่า history ใหม่ถูกต้อง | L2 |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-25 |
| L2 | git noreply + แก้ author ของ commit ที่ยังไม่ push ก่อน push ครั้งแรก | 2026-09-25 |
| L4 | D12 parser + test | 2026-09-25 (PR #13) |
| L5 | Guestbook API + `/api/contact` 410 + error ปลอดภัย + rate limit + ขั้นตอนลบโพสต์ | 2026-09-25 (Lab 05 · `docs/guestbook-delete.md`) |
| L11 | rate limit key (XFF ค่าท้าย / `clientAddress` · ไม่มี bucket ร่วม) + sweep key หมดอายุ + honeypot non-string | 2026-09-25 (`docs/handoffs/05-opencode-to-claude-l11.md`) |
| L14 | runbook ลบโพสต์เปิดโฟลเดอร์แทน `site.sqlite` เมื่อตั้ง `DATA_DIR` (เปิดใน `lab-06-qa`) | 2026-09-25 (Lab 07 M1 · commit `2f861e2`) |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
