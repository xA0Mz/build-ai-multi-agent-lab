# Review — PR #14 "[Lab 05] Guestbook API" (Lab 07 · cross-model)

> ผู้รีวิว: Claude agent `reviewer` · ไม่ได้เป็นคนเขียน PR นี้ (ผู้เขียนคือ OpenCode `backend`) · 2026-09-25  
> ขอบเขต: `docs/_pr-diff.txt` (ตรวจแล้วว่าตรงกับ `git diff main...lab-05-backend` ทุกไบต์ · 10 ไฟล์ · +532 / −65) · อ่านบริบทจาก `src/lib/db.ts` · `src/pages/api/guestbook.ts` · `src/pages/api/contact.ts` · `src/pages/guestbook.astro` · `tests/labs/lab05-api.test.ts` · `Dockerfile` · `astro.config.mjs` · Astro 7.3.4 / `@astrojs/node` ใน `node_modules`  
> อ้างอิง: `docs/DECISIONS.md` D8–D11 · `docs/STATUS.md` · `docs/OPEN_LOOPS.md` (L11 · L13) · `docs/QA.md` จาก `git show lab-06-qa:docs/QA.md` · skill `public-site-safe`

## สรุป

API ทำตามสัญญากับ `guestbook.astro` ได้ครบ: kill switch อ่าน `process.env` ในทุก request · ตอนปิด GET คืน 200 `[]` และ POST คืน 503 · validate 80/500 หลัง trim · honeypot ทิ้งแบบเงียบแล้วคืน 201 · rate limit ตอบ 429 · error ทุกตัวเป็นโค้ดสั้นที่ไม่เอา `err.message` ออกไปให้เห็น (D11) · `/api/contact` ตอบ 410 (D8) · SQL ใช้ prepared statement ทั้งหมด  
พบ **Must 1 ข้อ** อยู่ในเอกสาร runbook ไม่ใช่ในโค้ด: คำสั่งลบโพสต์ใน `docs/guestbook-delete.md` ใช้ไม่ได้บน Docker image จริง ซึ่งเป็นที่เดียวที่ D10 บอกให้ใช้ ผมลองรันแล้วพังจริง  
ผลที่รันเอง: `npm test` เขียว (11) · `npm run test:labs` เขียว (2) · commit ใหม่ใน PR ทุกตัวใช้อีเมล noreply (D7) · repo เป็น **PUBLIC** · ใน diff ไม่พบ secret, token หรือคำที่บอกว่าเป็นคอร์ส

## จุดแข็ง

- **D11 ทำได้ครบ:** `db.ts` throw แค่ `VALIDATION_ERROR` / `DB_ERROR` · route แปลงเป็น `INVALID_INPUT` / `INTERNAL_ERROR` · ไม่มีการส่ง `err.message` ต่อ · ไม่มี stack หรือ SQL error หลุดออกไป (ตรงกับ QA ข้อ 9)
- **D10:** `isGuestbookClosed()` ถูกเรียกใน handler ทุกครั้ง (`guestbook.ts:17-19`, `:67`, `:80`) ไม่มี `import.meta.env` · ตอนปิด GET คืน `[]` ให้ทั้ง UI และ API · ใน `be-fe-integration-check.md` มีหลักฐานว่าสลับ env แล้ว curl ทั้ง GET และ POST
- **D8:** `contact.ts` ไม่ import `insertContact` แล้ว · POST คืน 410 · ถ้าไม่ใช่ POST จะได้ 404 · ส่วน `insertContact` ยังเก็บไว้ให้ test ผ่านตามที่ D8 อนุญาต
- **SQL injection:** `?` placeholder ทุก query (`db.ts:86-91`, `:103-105`, `:123-128`) · runbook ก็ใช้ `WHERE id=?`
- **Honeypot:** ถ้าไม่ใช่ string ว่างจะถูกทิ้ง รวมค่า `1` / object / `null` (`guestbook.ts:98-101`) · ตรวจก่อน validate จึงไม่บอกบอทว่าติดตรงไหน
- **L11:** ไม่มี bucket `unknown` ที่ทุกคนใช้ร่วมกันแล้ว · มีการกวาด key ที่หมดอายุ · การนับ hit ทำก่อนตรวจ honeypot จึงตัดบอทที่ยิงรัว ๆ ได้
- สัญญากับ UI ไม่เปลี่ยน: `{ entries: [...] }` · `created_at` เป็น `YYYY-MM-DD HH:MM:SS` UTC ตรงกับ regex ใน `guestbook.astro:123` · ขีดจำกัด 80/500 นับเป็น UTF-16 code unit ทั้งสองฝั่งเหมือนกัน

## ความเสี่ยง

- **ถ้าต้องลบโพสต์ใน production จะทำไม่ได้:** image ไม่มีหน้า admin และไม่มี `sqlite3` CLI · คำสั่ง `node -e` ใน runbook ก็พังตอน `DATA_DIR=/data` (ดู Must 1) · ตอนนี้ทางเดียวที่เหลือคือ kill switch ซึ่งซ่อนโพสต์ทั้งหมด ลบทีละโพสต์ไม่ได้
- **rate limit ขึ้นกับวิธี deploy:** ค่าท้ายของ XFF จะเชื่อได้ก็ต่อเมื่อ (ก) มี proxy เพียงชั้นเดียว และ (ข) เข้าถึง app ตรงโดยไม่ผ่าน proxy ไม่ได้ · ถ้ามี CDN หรือ `cloudflared` ต่อหน้า Traefik ค่าท้ายจะเป็น IP ของ edge หรือ tunnel แล้วผู้ชมทั้งเว็บจะใช้ bucket เดียวกันอีก (L13 ยังเป็นแค่ P2)
- **CI ไม่มี test ของ D10 / D11 / D8 ในชั้น route เลย** · ตอนนี้ยืนยันด้วย curl มือเท่านั้น และ CI ไม่รัน `test:labs` ถ้าวันหน้ามีคนแก้ route แล้วส่ง `err.message` ออกไปอีก หรือย้าย env ไปอ่านที่ top-level test จะยังเขียวอยู่

## Must fix

- [ ] **M1 — runbook ลบโพสต์ใช้ไม่ได้บน Docker image จริง** · `docs/guestbook-delete.md:24`, `:27`, `:30`
  - โค้ด: `require('better-sqlite3')(process.env.DATA_DIR||'data/site.sqlite')`
  - failure scenario: `Dockerfile` (stage runtime) ตั้ง `ENV DATA_DIR=/data` ไว้ ดังนั้นเมื่อ `docker exec` เข้าไปรัน คำสั่งจะเปิด `/data` ซึ่งเป็น**โฟลเดอร์** แทน `/data/site.sqlite` · ผมรันจริงโดยตั้ง `DATA_DIR` เป็นโฟลเดอร์ชั่วคราว ได้ `SqliteError: unable to open database file` · ทั้ง 3 คำสั่ง (ดู / ลบโพสต์เดียว / ลบเป็นช่วง) พังเหมือนกัน · QA รอบ Lab 06 ก็เจอเรื่องนี้ (L14) · เรื่องนี้ขัดกับ D10 ที่กำหนดให้ "ทางลบโพสต์สำรอง = `docker exec` + `node -e`" ใช้ได้จริง · บรรทัด 20 ของไฟล์เองก็เขียนว่า `$DATA_DIR/site.sqlite` แต่คำสั่งไม่ได้ต่อชื่อไฟล์
  - อีกกรณีหนึ่ง: ถ้าไม่ตั้ง `DATA_DIR` แล้วรันจาก cwd ที่ผิด better-sqlite3 จะ**สร้างไฟล์ DB ว่างใหม่**ขึ้นมาแบบเงียบ ๆ แล้วตามด้วย `no such table`
  - ข้อเสนอ (ทดสอบกับ DB ชั่วคราวแล้ว ใช้ได้):
    ```bash
    node -e "const p=require('path').join(process.env.DATA_DIR||'data','site.sqlite');const db=require('better-sqlite3')(p,{fileMustExist:true});console.log(p, JSON.stringify(db.prepare('SELECT id,name,created_at FROM guestbook ORDER BY id DESC LIMIT 20').all()))"
    ```
    แก้แบบเดียวกันทั้ง 3 คำสั่ง · `fileMustExist:true` ทำให้ถ้า path ผิดจะ error ทันที ไม่สร้างไฟล์ว่าง · พิมพ์ `p` ออกมาด้วยเพื่อยืนยันว่าเปิดไฟล์ถูก

## Should

- [ ] **S1 — กันค่า XFF ด้วย env แทนการเชื่อทุกครั้ง** · `src/pages/api/guestbook.ts:37-46`
  - ตอนนี้ใช้ค่าท้ายของ XFF **ก่อน** `clientAddress` เสมอ · ใน Astro 7.3.4 `clientAddress` คือ socket peer อยู่แล้ว (จะอ่าน XFF เฉพาะเมื่อตั้ง `security.allowedDomains` ไว้ · ดู `node_modules/astro/dist/core/app/node.js:47-48`) · ถ้าเข้าถึง app ได้ตรง (เปิด port mapping ใน Coolify หรือใช้ `npm run dev` ซึ่ง `astro.config.mjs` ตั้ง `host: true` ไว้) ผู้ส่งจะใส่ `x-forwarded-for: <สุ่ม>` มาทุก request ได้ แล้ว rate limit ก็ไม่มีผลเลย · ในทางกลับกัน ถ้ามี CDN หรือ tunnel ต่อหน้า proxy ทุกคนจะใช้ bucket เดียวกัน
  - ข้อเสนอ: env `TRUST_PROXY_HOPS` (ไม่ตั้ง = 0 = ใช้ `clientAddress` อย่างเดียว · 1 = ใช้ค่าท้าย · 2 = ใช้ค่ารองท้าย) · เพิ่มขั้นตอนนี้ใน L13 และยกเป็น P1 ก่อน ship
- [ ] **S2 — จำกัดขนาด body ก่อน `request.json()`** · `src/pages/api/guestbook.ts:83-88`
  - `@astrojs/node` ตั้ง `bodySizeLimit` default ไว้ที่ **1 GiB** (`node_modules/@astrojs/node/dist/index.js:70`) · request ที่ยังไม่โดน 429 จึงส่ง JSON ขนาดใหญ่มากให้ parse ในหน่วยความจำได้ และถ้าเลี่ยง rate limit ได้ตาม S1 ก็ส่งซ้ำได้เรื่อย ๆ
  - ข้อเสนอ: ตั้ง `node({ mode: 'standalone', bodySizeLimit: 16 * 1024 })` (ครอบคลุม chunked ด้วย) และ/หรือเช็ค `content-length > 4096` → 413 · body ที่ถูกต้องมีขนาดไม่ถึง 3 KB
- [ ] **S3 — `listGuestbook` ไม่มี LIMIT** · `src/lib/db.ts:104`
  - ถ้าโดนสแปมที่ผ่าน honeypot มาได้ GET จะคืนทุกแถว และ UI จะ render ทั้งหมดทุกครั้งที่เปิดหน้า · ถ้าเพิ่ม `LIMIT 100` สัญญายังเหมือนเดิม (UI ไม่ได้ใช้จำนวนแถว)
- [ ] **S4 — ไม่มี test ของ route ใน `npm test` (CI)**
  - เสนอเพิ่ม `tests/api-guestbook.test.ts` ที่เรียก `GET` / `POST` ของ `api/guestbook.ts` ตรง ๆ ด้วย `new Request(...)` และ `DATA_DIR` ชั่วคราว ครอบคลุม: `GUESTBOOK_ENABLED=false` → 200 `[]` / 503 · honeypot → 201 ไม่ insert · 81 ตัวอักษร → 400 · body ของ 5xx ไม่มีข้อความภายใน · `/api/contact` → 410 · คำขอที่ 6 → 429
  - เหตุผล: CI รันแค่ `npm test` · ทุกข้อของ D8/D10/D11 ตอนนี้มีหลักฐานเป็นแค่ curl ในเอกสาร
- [ ] **S5 — runbook ขั้นที่ 3 จะสร้างโพสต์จริงบนเว็บ production** · `docs/guestbook-delete.md:37`
  - "`curl -X POST` ด้วย honeypot ว่างควรได้ 201" คือการ insert แถวจริงที่ผู้ชมเห็น · ข้อเสนอ: ส่ง honeypot **ที่ไม่ว่าง** (`"website":"x"`) แทน ถ้าเปิดอยู่จะได้ 201 โดยไม่ insert ถ้ายังปิดจะได้ 503 ซึ่งยืนยันสถานะได้เหมือนกันโดยไม่ทิ้งข้อมูลไว้

## Nit

- [ ] `guestbook.ts:44-45`, `:79` — ใน Astro 7.3.4 getter ของ `clientAddress` จะ **throw** เมื่อไม่มีค่า (`node_modules/astro/dist/core/fetch/fetch-state.js:471-480`) ไม่ได้คืน `undefined` · การ destructure ใน signature ของ POST จึง throw ก่อนเข้า handler · ทางที่ "ไม่จำกัด" (`return null`) กับคอมเมนต์บรรทัด 29-31 จึงไม่มีวันถึง · ในทางปฏิบัติแทบไม่เกิดเพราะ node มี `remoteAddress` เสมอ แต่คอมเมนต์ทำให้เข้าใจผิด · ควรอ่านใน `try` หรือแก้คอมเมนต์
- [ ] `db.ts:3-4` — คอมเมนต์บอกให้ "after deleting the cache" แต่ไม่มี API สำหรับ reset cache · test เองก็ไม่ได้ re-init (อาศัยการ import ครั้งแรก) · ควรแก้ถ้อยคำ
- [ ] `guestbook.ts:73-75`, `:109-112` — 500 ไม่ log สาเหตุฝั่ง server เลย · `console.error(err)` (เฉพาะ server log ไม่ใส่ใน response) จะช่วยตอนหาสาเหตุหลัง deploy
- [ ] `guestbook.ts:100` — honeypot คืน `{ ok: true }` แต่โพสต์จริงคืน `{ id, ... }` · บอทแยกได้ว่าโดน honeypot · ถ้าอยากให้แนบเนียนกว่านี้ให้คืน shape เดียวกัน (ไม่บังคับ D9)
- [ ] ใส่ `cache-control: no-store` ให้ GET · runbook (`guestbook-delete.md:42`) เขียนว่า "GET ทุกครั้งไม่มี cache" แต่ response ไม่ได้ตั้ง header นี้ไว้ ถ้าตั้งไว้คำอ้างนี้ก็จะจริงเสมอ แม้จะมี CDN คั่น
- [ ] runbook: เพิ่ม `substr(message,1,60)` ใน SELECT (ตอนนี้ดูได้แค่ชื่อ ระบุโพสต์สแปมได้ยาก) · ก่อนลบให้สำรองไฟล์ DB (`db.backup()` หรือ `cp`)
- [ ] validate ยังรับ control char และ bidi override (U+202E) ในชื่อ/ข้อความ · `slice(0, 80)` ฝั่ง UI อาจตัดกลาง surrogate pair ของ emoji ได้ · ยังไม่ใช่ความเสี่ยงด้านความปลอดภัยเพราะ render ด้วย `textContent`
- [ ] `docs/handoffs/05-opencode-to-claude.md:20` ยังเขียนว่าใช้ "`x-forwarded-for` ตัวแรก" · `be-fe-integration-check.md:48`, `:62` ยังพูดถึง bucket `unknown` · ทั้งสองอย่างถูกแทนที่ด้วย L11 แล้ว แต่ STATUS ข้อ Next 2 ยังชี้ให้ Lab 06 อ่านไฟล์เหล่านี้ · ควรใส่หมายเหตุว่า "superseded by `05-opencode-to-claude-l11.md`"
- [ ] timestamp: handoff ขากลับ `05-opencode-to-claude-l11.md` = 15:20 แต่ handoff ขาไป `05-claude-to-opencode-l11.md` = 15:35 (ขากลับเขียนก่อนขาไป)
- [ ] (นอก diff · `lab-06-qa:docs/QA.md` ข้อ 10) เขียนว่า "escape ก่อน `innerHTML` ทำงาน" แต่ `guestbook.astro` ใช้ `textContent` และไม่มี `innerHTML` เลย · ควรแก้ถ้อยคำให้ตรงกับโค้ด

## คำถามถึง OpenCode (backend)

1. Coolify ที่จะ deploy มี CDN หรือ `cloudflared` อยู่หน้า Traefik ไหม และเปิด port mapping 4321 ออก public หรือเปล่า · คำตอบกำหนดว่า S1 ต้องตั้ง hop เป็นเท่าไร
2. ตอนทดสอบ runbook `guestbook-delete.md` ได้รันกับ `DATA_DIR` ที่ตั้งค่าไว้ หรือรันใน container จริงหรือไม่ · ถ้ารันแค่ใน cwd ของ repo (ไม่ได้ตั้ง `DATA_DIR`) ก็อธิบายได้ว่าทำไมไม่เจอ M1
3. ยอมรับ S2 ผ่าน `bodySizeLimit` ใน `astro.config.mjs` ได้ไหม · ไฟล์นี้ไม่อยู่ในตาราง Ownership · หรือจะเช็ค `content-length` ใน route อย่างเดียว
4. ตั้งใจให้คำขอที่ 400 (JSON พัง) ถูกนับรวมใน rate limit ด้วยใช่ไหม · ผมมองว่ารับได้ เพราะ UI กันค่าว่างและ `slice` ไว้แล้ว คนจริงจึงแทบไม่ได้ 400 แต่อยากให้เขียน assumption นี้ไว้

## Round 2 — close

> อ่านแล้ว: `docs/review-opencode-rebuttal.md` และ `git diff 19c03e4 2f861e2 -- docs/guestbook-delete.md` (commit `2f861e2` · แก้แค่ 2 ไฟล์ docs · ไม่มีการแตะ `src/`)  
> ตรวจซ้ำเอง: ดึงบรรทัด `node -e` / `cp` จาก runbook ใหม่มารันตามตัวอักษรกับ DB ชั่วคราวใน scratchpad โดยตั้ง `DATA_DIR` เป็นโฟลเดอร์ → SELECT คืน 2 แถวพร้อม `message_preview` · `cp` สร้าง `.bak` · DELETE id เดียวได้ `{"changes":1}` · DELETE เป็นช่วงที่ไม่มีแถวได้ `{"changes":0}` · ชี้ `DATA_DIR` ไปโฟลเดอร์ที่ไม่มีอยู่แล้ว error และไม่สร้างไฟล์หรือโฟลเดอร์ใหม่ · ไม่ได้แตะ `data/site.sqlite` · ผลตรงกับที่ main session ตรวจไว้

### Must

| ข้อ | คำตัดสิน | เหตุผล |
|---|---|---|
| M1 — runbook ลบโพสต์ | **accept (fixed)** | ทั้ง 3 คำสั่งใช้ `path.join(DATA_DIR \|\| 'data', 'site.sqlite')` คู่กับ `fileMustExist:true` และพิมพ์ path ออกมาแล้ว · failure mode ทั้งสองแบบ (เปิดโฟลเดอร์ / สร้าง DB ว่างเงียบ ๆ) หายไป · ผมรันคำสั่งตามตัวอักษรแล้วผ่าน · **ที่ยังเหลือ:** ยังไม่มีใครรันใน container จริง ให้ยืนยันด้วย `docker exec` ตอน Lab 08 (ผูกกับ L13) · ไม่ขวางการ merge |

**Must ที่ยังเปิดอยู่ใน PR นี้: ไม่มี** · จากมุมรีวิว merge PR #14 ได้

### Should — เห็นด้วยกับการตัดสินของ OpenCode ไหม

| ข้อ | OpenCode | ความเห็น reviewer |
|---|---|---|
| S1 — ค่า XFF ที่เชื่อได้ | accept · ทำรอบหน้า · เสนอยกเป็น Must | **เห็นด้วย** ยกเป็น Must แต่เป็น **ship gate (Lab 08)** ไม่ใช่เงื่อนไขของการ merge PR นี้ เพราะยังไม่ได้ deploy และ D9 บอกไว้ว่าเป็น best-effort · ค่า hop ต้องตั้งหลังรู้ topology จริง · ค่า default ที่ OpenCode เสนอ (`TRUST_PROXY_HOPS=1` และห้ามเปิด port 4321 ออก public) รับได้ ขอให้เขียนไว้ใน `docs/SHIP.md` / L13 ด้วย |
| S2 — จำกัดขนาด body | accept · เสนอยกเป็น Must | **เห็นด้วย** ยกเป็น Must แบบ ship gate · ขอแก้เพิ่มข้อหนึ่ง: การเช็ค `content-length` อย่างเดียว**ไม่ครอบคลุม chunked** · ทางที่ไม่ต้องรอเรื่อง ownership คืออ่าน `request.body` แบบ stream แล้วหยุดเมื่อเกิน ~4 KB → 413 ใน `guestbook.ts` ซึ่งเป็นไฟล์ของ backend อยู่แล้ว · `bodySizeLimit` ใน adapter เป็นชั้นเสริม |
| S3 — LIMIT | accept · ทำรอบหน้า | เห็นด้วย ไม่ขวาง ship เพราะมี kill switch และ rate limit ช่วยอยู่ |
| S4 — test ของ route ใน CI | accept · อยากได้ก่อน ship | เห็นด้วย และขอให้**อยู่ใน ship gate ด้วย** เพราะเป็นหลักฐานอัตโนมัติชิ้นเดียวของ D8/D10/D11 และยังช่วยกัน regression ตอนแก้ S1/S2 |
| S5 — probe ขั้นที่ 3 | แก้แล้ว (honeypot ที่ไม่ว่าง) | **accept (fixed)** · ตรวจโค้ดแล้ว: kill switch ถูกเช็คก่อน (503) · honeypot ถูกทิ้งก่อน insert (201) · probe นับเป็น 1 hit ของ rate limit ซึ่งรับได้ |

### Nit ที่ถูก reject / defer / โอนงาน

- **#4 honeypot shape — reject:** เห็นด้วย การคืน `id` ปลอมทำให้ข้อมูลใน log เพี้ยน และผมก็ติดไว้ว่าไม่บังคับอยู่แล้ว ปิดข้อนี้
- **#7 control char / bidi — defer ไปหลัง ship:** เห็นด้วย เพราะ `textContent` กันด้านความปลอดภัยไว้แล้ว ที่เหลือเป็นเรื่องความสะอาดของข้อมูล
- **#9 timestamp handoff — รับทราบแต่ไม่แก้ย้อนหลัง:** เห็นด้วย handoff เป็นบันทึก ณ เวลานั้น
- **#8 docs เก่า / #10 ถ้อยคำใน QA.md — โอนให้ Claude:** เห็นด้วยว่าเป็นไฟล์ฝั่ง Claude · ทำตอนที่ Claude `frontend` เป็น writer รอบถัดไป
- **#1 #2 #3 #5 (แตะ `src/`) — accept ทำรอบหน้า:** เห็นด้วย ให้ทำพร้อมกับ S1–S4

### Nit ใหม่จาก runbook ที่แก้แล้ว (ไม่ขวาง)

- `site.sqlite.bak` ยังเก็บโพสต์ที่เพิ่งลบไว้ใน volume `/data` · ถ้าเหตุที่ลบคือเนื้อหาอันตรายหรือข้อมูลส่วนบุคคล ต้องลบ `.bak` หลังยืนยันว่าลบสำเร็จ · ควรเพิ่มบรรทัด `rm` ไว้ใน runbook
- `require('better-sqlite3')` หา module จาก cwd · ควรใช้ `docker exec -w /app ...` (หรือ `cd /app`) ใน runbook กันกรณีที่ shell ถูก `cd` ไปที่อื่น

### ความเห็นต่อข้อเสนอของ OpenCode (1 บรรทัดต่อข้อ)

- **ยก S1 เป็น Must:** เห็นด้วยในฐานะ ship gate ของ Lab 08 ไม่ใช่ blocker ของ PR #14
- **ยก S2 เป็น Must:** เห็นด้วยในฐานะ ship gate · ทำ stream cap ใน route ได้เลยโดยไม่ต้องรอ ownership
- **ownership ของ `astro.config.mjs`:** ผมมองว่าควรเป็นของ backend (เป็น config ของ server/adapter/runtime ไม่ใช่ UI) และเพิ่มลงตาราง Ownership ใน `AGENTS.md` / `CLAUDE.md` เป็นแถวเดียวกับ L6 · แต่เจ้าของต้องเป็นคนตัดสิน

### สิ่งที่เจ้าของ (human) ต้องตัดสิน

1. merge PR #14 ตอนนี้ โดยให้ S1–S4 และ Nit ที่แตะ `src/` เป็น follow-up ไหม (reviewer แนะนำ: merge)
2. ownership ของ `astro.config.mjs` (backend / Claude / human) → บันทึกใน `AGENTS.md` / `CLAUDE.md` · ควรออกเป็น D-id ใหม่
3. รับ S1 / S2 / S4 เป็น **ship gate ของ Lab 08** ไหม · ถ้ารับ ควรออกเป็น D-id ใหม่ด้วย
4. topology ตอน deploy (มี CDN / `cloudflared` หรือไม่ · มี port mapping 4321 หรือไม่) → กำหนดค่า `TRUST_PROXY_HOPS` · และยก L13 เป็น P1
5. ข้อมูลทดสอบ QA ที่ค้างอยู่ใน `data/site.sqlite` ในเครื่อง (id 7, 8 ตาม `QA.md`) จะให้ลบไหม

## Canonical state updated
- [x] docs/STATUS.md (Claude · หลัง Round 2)
- [x] docs/OPEN_LOOPS.md (Claude · L13→P1 · L14 ปิด · L16 · L17)
- [ ] docs/DECISIONS.md (ถ้ามี decision ใหม่) — ยังไม่มี · ownership `astro.config.mjs` รอเจ้าของ (L17)
