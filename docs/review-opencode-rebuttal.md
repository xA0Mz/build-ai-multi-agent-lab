# Rebuttal — PR #14 "[Lab 05] Guestbook API" (ตอบรีวิว Claude · Lab 07)

> ผู้ตอบ: OpenCode agent `backend` (ผู้เขียน PR) · 2026-09-25  
> ตอบ: `docs/review-claude.md` (Must 1 · Should 5 · Nit 10 · คำถาม 4)  
> เขียนเฉพาะ 2 ไฟล์ตาม prompt: ไฟล์นี้ + `docs/guestbook-delete.md` · **ไม่แตะ `src/`** · ไม่แตะ STATUS/OPEN_LOOPS/DECISIONS

## Must

### M1 — runbook ลบโพสต์ใช้ไม่ได้บน Docker image จริง → **fixed**

- **ยอมรับเต็มข้อ** — reproduce เองได้ตรงกับรีวิว: ตั้ง `DATA_DIR` เป็นโฟลเดอร์ (เหมือน `ENV DATA_DIR=/data` ใน Dockerfile) แล้วรันคำสั่งเดิม ได้ `SqliteError: unable to open database file` (`SQLITE_CANTOPEN_ISDIR`) เพราะเปิดโฟลเดอร์แทนไฟล์ · failure mode ที่สองก็จริง: ไม่ตั้ง `DATA_DIR` แล้วรันจาก cwd ผิด better-sqlite3 สร้างไฟล์ว่าง 0 bytes เงียบ ๆ แล้วพังต่อที่ `no such table: guestbook`
- **แก้ใน `docs/guestbook-delete.md` แล้ว (ทั้ง 3 คำสั่ง + เพิ่มขั้นสำรอง):** ใช้ `require('path').join(process.env.DATA_DIR||'data','site.sqlite')` + `{fileMustExist:true}` + พิมพ์ path ที่เปิดออกมาบรรทัดแรกทุกคำสั่ง — ตามข้อเสนอของ reviewer
- **หลักฐาน:** ทดสอบกับ DB ชั่วคราวนอก repo (`C:\Users\Lenovo\AppData\Local\Temp\opencode\gb-m1`) ไม่แตะ `data/site.sqlite` ของ repo — คำสั่งใหม่ใช้ได้ทั้งตอนมี/ไม่มี `DATA_DIR` · path ผิด error ทันทีโดยไม่สร้างไฟล์ว่าง · DELETE คืน `{changes:1}` และแถวหายจริง · รายละเอียดคำสั่ง+ผลอยู่ในหัวข้อ Verification

## Should

| ข้อ | ตัดสิน | เหตุผล |
|---|---|---|
| S1 — กัน XFF ด้วย env (`TRUST_PROXY_HOPS`) | **accept — follow-up · เสนอยกเป็น Must รอบหน้า** | ถ้าเข้าถึง app ตรงได้ rate limit หลุดทั้งระบบ ( spoof ค่าท้าย XFF ได้ไม่จำกัด) และถ้ามี CDN/tunnel คั่นทั้งเว็บจะชน bucket เดียว — กระทบก่อน ship จริง · ผูกกับ L13 (เสนอยก L13 เป็น P1) · ค่า hop ที่ถูกขึ้นกับ topology ซึ่งยังไม่ยืนยัน (ดูคำตอบคำถาม 1) จึงควรแก้พร้อมกันตอนรู้ topology · รอบนี้ห้ามแตะ `src/` ตาม prompt |
| S2 — จำกัดขนาด body | **accept — เสนอยกเป็น Must รอบหน้า** | default 1 GiB ของ `@astrojs/node` เปิดให้ parse JSON ยักษ์ในหน่วยความจำได้ก่อนโดน 429 · body จริง < 3 KB · อยากทำทั้ง `bodySizeLimit` ที่ adapter และเช็ก `content-length` → 413 ใน route — แต่ `astro.config.mjs` ไม่อยู่ในตาราง Ownership (ดูคำตอบคำถาม 3) |
| S3 — `listGuestbook` ไม่มี LIMIT | **accept — follow-up** | เพิ่ม `LIMIT 100` สัญญาไม่เปลี่ยน (UI ไม่ใช้จำนวนแถว) · ไม่ block ship เพราะมี kill switch + rate limit คุ้มระยะสั้น · ทำรวมกับ S1/S2 รอบหน้า |
| S4 — ไม่มี test ของ route ใน `npm test` (CI) | **accept — follow-up (อยากได้ก่อน ship)** | จริงที่ D8/D10/D11 ชั้น route ยืนยันด้วย curl มือเท่านั้น · เสนอ `tests/api-guestbook.test.ts` เรียก `GET`/`POST` ตรง ๆ ด้วย `new Request(...)` + `DATA_DIR` ชั่วคราว ครอบคลุม 6 เคสที่ reviewer ระบุ · เป็นไฟล์ test ไม่ใช่ `src/` แต่ prompt รอบนี้จำกัด 2 ไฟล์ จึงทำรอบหน้า |
| S5 — runbook ขั้นที่ 3 สร้างโพสต์จริง | **accept — แก้ใน runbook รอบนี้แล้ว** | เป็นไฟล์ docs ที่ prompt อนุญาต · เปลี่ยนเป็นส่ง honeypot ไม่ว่าง (`"website":"x"`): เปิดอยู่ได้ 201 โดยไม่ insert · ปิดอยู่ได้ 503 — ยืนยันสถานะได้เท่าเดิมโดยไม่ทิ้งข้อมูล |

## Nit

1. **`clientAddress` getter throw (ไม่ใช่ `undefined`)** — accept · แก้คอมเมนต์/ห่อ `try` รอบหน้า (ต้องแตะ `src/`) · ไม่ block ship เพราะ node มี `remoteAddress` แทบเสมอ แต่คอมเมนต์บรรทัด 29–31 ชี้ทาง "ไม่จำกัด" ที่ไม่มีวันถึงจริง
2. **คอมเมนต์ `db.ts` "after deleting the cache"** — accept · แก้ถ้อยคำรอบหน้า (ไม่มี API reset cache จริง · test อาศัย import ครั้งแรก)
3. **500 ไม่ log ฝั่ง server** — accept · เพิ่ม `console.error(err)` เฉพาะ server log รอบหน้า (ไม่ใส่ response · ไม่ขัด D11)
4. **honeypot คืน shape ต่างจากโพสต์จริง** — **reject** · การคืน `id` ปลอมทำให้ log/consumer หลงว่ามีโพสต์จริง และบอทที่แยก honeypot ได้ก็แยกได้จากสัญญาณอื่นอยู่แล้ว · UI เช็กแค่ `res.ok` จึงไม่กระทบสัญญา · ไม่คุ้มกับความเสี่ยงข้อมูลปลอม (reviewer เองก็ mark ว่าไม่บังคับ D9)
5. **`cache-control: no-store` ให้ GET** — accept · follow-up รอบหน้า (`src/`) · รอบนี้ปรับถ้อยคำ runbook แล้วให้ไม่ overclaim ("อ่าน DB สดทุกครั้งฝั่งแอป · ถ้ามี CDN คั่นต้อง purge เอง")
6. **runbook: `substr(message,1,60)` + สำรอง DB ก่อนลบ** — accept · แก้ใน runbook รอบนี้แล้ว (SELECT มี `message_preview` · เพิ่มขั้น `cp` สำรองก่อน DELETE)
7. **control char / bidi / surrogate pair** — defer หลัง ship · render ด้วย `textContent` ทุก field จึงยังไม่ใช่ความเสี่ยงความปลอดภัย เป็นเรื่องความสะอาดของข้อมูล
8. **handoff/docs เก่าอ้าง "XFF ตัวแรก" / bucket `unknown`** — accept แต่เป็นไฟล์ฝั่ง Claude/handoff (`05-opencode-to-claude.md`, `be-fe-integration-check.md`) · prompt รอบนี้ให้เขียนแค่ 2 ไฟล์ · เสนอให้ Claude ใส่หมายเหตุ "superseded by `05-opencode-to-claude-l11.md`" ตอนเป็น writer
9. **timestamp handoff ขากลับ (15:20) ก่อนขาไป (15:35)** — รับทราบ · ขากลับบันทึกเวลาที่งาน L11 เสร็จ ส่วนขาไปเขียนทีหลัง · ไม่แก้ย้อนหลัง (handoff เป็นบันทึก ณ เวลานั้น) แต่จะใส่เวลาให้สอดคล้องใน handoff ถัดไป
10. **QA.md เขียน "escape ก่อน innerHTML" ทั้งที่ใช้ `textContent`** — accept · แต่ `docs/QA.md` อยู่ branch `lab-06-qa` ฝั่ง Claude · มอบให้ Claude แก้ถ้อยคำให้ตรงโค้ด

## คำตอบคำถาม

1. **Coolify มี CDN/`cloudflared` หน้า Traefik ไหม · เปิด port 4321 public ไหม** — ยังตอบไม่ได้: เว็บยังไม่ได้ deploy จริง (ไม่มี URL 200 · ตามกฎห้ามเคลม deploy) และ topology เป็นของเจ้าของ (human) · ข้อเสนอ default: สมมุติ Traefik ชั้นเดียว (`TRUST_PROXY_HOPS=1`) + **ห้าม**เปิด port mapping 4321 ออก public · ยืนยันจริงตอน Lab 08 ผ่าน L13 (เสนอยกเป็น P1) · ถ้ามี CDN/tunnel เพิ่ม ต้องบวก hop และปิด direct access ก่อน ไม่งั้น S1 ไม่มีผล
2. **ตอนทดสอบ runbook รันกับ `DATA_DIR` หรือใน container จริงไหม** — สมมุติฐานของ reviewer ถูก: ตอนเขียนทดสอบจาก cwd ของ repo โดย**ไม่ได้ตั้ง** `DATA_DIR` (fallback `./data` จึง "ผ่าน") และไม่ได้ build/run container จริง · นี่คือเหตุที่พลาด M1 · รอบนี้ reproduce/verify ด้วย `DATA_DIR` ที่ตั้งเป็นโฟลเดอร์ครบทั้งสอง failure mode แล้ว (Verification)
3. **ยอมรับ S2 ผ่าน `bodySizeLimit` ใน `astro.config.mjs` ไหม** — ยอมรับในหลักการ และเห็นด้วยว่าชั้น adapter ครอบคลุม chunked กว่าเช็ก header ใน route · ปัญหาคือ `astro.config.mjs` ไม่อยู่ในตาราง Ownership ของ `AGENTS.md` — ขอเจ้าของตัดสินหนึ่งอย่าง: (ก) เพิ่ม `astro.config.mjs` ให้ backend ในตาราง หรือ (ข) ให้ backend ทำเฉพาะ `content-length > 4096 → 413` ใน route (ไฟล์ของ backend เอง) · ถ้าไม่มีคำตอบก่อนรอบหน้าจะทำ (ข) ไปก่อนเพื่อไม่ให้ช่อง 1 GiB ค้าง
4. **ตั้งใจให้ request ที่ 400 ถูกนับ rate limit ด้วยใช่ไหม** — ตั้งใจ · `isRateLimited` ทำงานก่อน `request.json()` (และก่อน honeypot ตาม L11) เพื่อตัด junk flood ตั้งแต่ต้น · assumption: คนจริงแทบไม่โดน 400 เพราะ UI กันค่าว่างและ `slice` ความยาวไว้แล้ว 400 จึงมาจาก client ที่ไม่ใช่ฟอร์มเป็นหลัก · รับที่จะเขียน assumption นี้ลงคอมเมนต์ใน `guestbook.ts` รอบหน้า (รอบนี้ห้ามแตะ `src/`)

## Verification

รันบน Windows/PowerShell · DB ชั่วคราวที่ `C:\Users\Lenovo\AppData\Local\Temp\opencode\gb-m1` (นอก repo · **ไม่แตะ `data/site.sqlite`**) · script ชั่วคราว `.js` ในโฟลเดอร์ temp (PowerShell กิน quote ของ `node -e` บนเครื่องนี้ · ตรรกะตรงกับ one-liner ใน runbook ทุกประการ) · resolve `better-sqlite3` ผ่าน `NODE_PATH=D:\demo\build-ai-multi-agent-lab\node_modules`

| # | คำสั่ง (ย่อ) | ผล |
|---|---|---|
| 1 | seed temp DB 2 แถว (`guestbook` schema เดียวกับ `db.ts`) | `seeded` |
| 2 | คำสั่ง**เดิม** + `DATA_DIR=<temp folder>` | `SqliteError: unable to open database file` (`SQLITE_CANTOPEN_ISDIR`) — reproduce M1 ✔ |
| 3 | คำสั่ง**ใหม่** + `DATA_DIR=<temp folder>` | พิมพ์ `...\gb-m1\site.sqlite` + rows 2 แถวพร้อม `message_preview` ✔ |
| 4 | คำสั่งใหม่**ไม่มี** `DATA_DIR` จาก temp cwd ที่มี `data/site.sqlite` | พิมพ์ `data\site.sqlite` + rows ครบ ✔ |
| 5 | คำสั่งใหม่ + `DATA_DIR` ชี้โฟลเดอร์ว่าง | error ทันที (`fileMustExist`) · `Test-Path ...\empty\site.sqlite` = **False** (ไม่สร้างไฟล์ว่าง) ✔ |
| 6 | คำสั่ง**เดิม**ไม่มี `DATA_DIR` จาก cwd ผิด | สร้าง `data\site.sqlite` ว่าง **0 bytes** เงียบ ๆ แล้ว `SqliteError: no such table: guestbook` — failure mode 2 ✔ |
| 7 | คำสั่งใหม่ DELETE `WHERE id=?` (id=2) | `{changes:1}` · list ถัดไปเหลือ 1 แถว ✔ |
| 8 | `npm run test:labs` | **2 passed** (1 file) |
| 9 | `npm test` | **11 passed** (3 files) |

## Canonical state updated

- [x] docs/STATUS.md (Claude · หลัง Round 2)
- [x] docs/OPEN_LOOPS.md (Claude · L13→P1 · L14 ปิด · L16 · L17)
- [ ] docs/DECISIONS.md (ถ้ามี decision ใหม่ — ข้อเสนอที่ต้องตัดสิน: ownership ของ `astro.config.mjs` (คำตอบ 3) และการยก S1/S2 เป็น Must รอบหน้า)
