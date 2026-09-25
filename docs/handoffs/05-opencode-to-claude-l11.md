# Handoff: OpenCode (backend) → Claude (frontend)

> L11 แก้แล้ว · ตอบกลับ `docs/handoffs/05-claude-to-opencode-l11.md` · อ่านคู่กับ `docs/be-fe-integration-check.md`

Timestamp: 2026-09-25 15:20 +07:00  
Task: L11 — rate limit key + sweep + honeypot non-string (branch `lab-05-backend`)  
Status: DONE (test เขียวทั้งชุด · curl ยืนยันครบ · สัญญาไม่เปลี่ยน)

## What changed — `src/pages/api/guestbook.ts` เท่านั้น

1. **rate limit key** — ลำดับใหม่: `x-forwarded-for` **ค่าท้าย** (ที่ trusted proxy เติม — ค่าก่อนหน้า client ปลอมได้) → `clientAddress` ของ Astro (socket peer ตอนรัน node ตรง ๆ) → ถ้าไม่มีทั้งคู่ = **ไม่จำกัด** (ไม่มี bucket `unknown` ร่วมอีก — ตามที่ handoff สั่ง "อย่าให้ทุกคนแชร์ bucket เดียว")
2. **sweep** — ทุกครั้งที่จะบันทึก hit จะกวาด key ที่หมดอายุ (10 นาที) ออกทั้ง map · key ที่ใช้ครั้งเดียวจน map โตไม่หยุดไม่มีแล้ว
3. **honeypot** — `website` ที่ไม่ใช่ field หาย และไม่ใช่ string ว่าง ( whitespace ล้วน = ผ่าน) → silent drop 201 ไม่ insert รวม `1` / object / `null`

## สัญญาที่ UI ใช้ — ไม่เปลี่ยน

status ทั้งหมด (200/201/400/429/503/500) · shape · ชื่อ field เหมือนเดิมทุกข้อ ตาม handoff 04

## Verification (ทำจริง · port 4460 · `DATA_DIR` ชั่วคราว ลบแล้ว)

- `npm run test:labs` เขียว (2) · `npm test` เขียว (11) · `npm run build` ผ่าน
- curl:
  - ไม่มี XFF ×5 → 201, ครั้งที่ 6 → **429** (bucket จาก `clientAddress` · 429 ยังทำงาน)
  - XFF `203.0.113.1` หลัง bucket ของ 127.0.0.1 เต็ม → **201** (ไม่มี bucket ร่วมอีก)
  - XFF `10.3.0.1` ×5 แล้วส่ง `10.3.0.99, 10.3.0.1` → **429** (เดิมข้ามได้ — ตอนนี้ใช้ค่าท้ายจึงโดน)
  - `"website": 1` และ `"website": {"a":1}` → 201 `{ok:true}` · ตรวจไฟล์ sqlite: **ไม่มีแถว** Bot/Bot2
  - ไม่มี field `website` / `"website": "   "` → 201 insert ปกติ

## หมายเหตุถึงฝั่ง deploy / QA

- ค่าท้าย XFF เชื่อถือได้**เมื่อ proxy append** (Coolify/Traefik ค่า default append) — ถ้า proxy ตั้ง `--trust-forwarded` แบบ replace ให้ตรวจตอน deploy ตาม assumption ใน handoff ที่รับมา
- ยังเป็น in-memory best-effort ต่อ instance (D9) — หลาย replica = คนละ bucket
- สำหรับ E2E: POST จากเครื่องเดียว (ไม่มี XFF) โดน 429 ตั้งแต่ครั้งที่ 6 ต่อ process · restart server หรือส่ง XFF ต่างกันเพื่อแยกชุด (เหมือนข้อเสนอเดิมใน `be-fe-integration-check.md` ยังใช้ได้)

## Request to next agent

- push `lab-05-backend` + เปิด PR Backend (Closes #5 · Refs #6) — จากนั้น Lab 06 QA (L8 · L12) ตาม `docs/handoffs/05-opencode-to-claude.md`

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md` (ปิด L11)
- [x] handoff นี้ · commit แล้ว (ยังไม่ push)

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = Claude (`frontend`)
