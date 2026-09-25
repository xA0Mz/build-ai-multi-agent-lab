# Decisions — Personal Site

> Lab 02 · สังเคราะห์จาก `docs/DEBATE.md` (โต้ 5 รอบ: `frontend` = Brand + UX · `reviewer` = Devil's Advocate) · ไฟล์นี้เก็บเฉพาะเรื่องที่ **approved** แล้ว  
> ตัดสินโดย: เจ้าของเว็บ (xA0Mz) ตอบ 4 คำถามที่ debate ส่งมาให้ตัดสิน · ข้อที่ทั้งสองฝั่งตกลงกันแล้วใน debate facilitator สรุปตามนั้น · 2026-09-25

## สรุปการโต้วาที

ฝั่ง Brand + UX เปิดด้วยการเปลี่ยน Headline ที่ฟังเหมือนคนรอรับคำสั่ง ตั้ง HR เป็นกลุ่มหลัก และชี้ว่า parser ใน `src/lib/profile.ts` ตัดทุกหัวข้อเหลือบรรทัดแรก (Bio เหลือ 1 ย่อหน้า, Interests เหลือ 1 ข้อ) ส่วน Devil's Advocate ตรวจพบว่า repo เป็น public แล้ว และอีเมลส่วนตัวอยู่ใน commit ทุกตัว, runtime image ไม่มี `sqlite3` จึงลบโพสต์ guestbook ตามแผนเดิมไม่ได้ และถ้าลิงก์ repo นี้ ผู้ชมจะเห็น template คอร์สทันที เรื่องที่ขัดกันชัดที่สุดคือ CTA หน้าแรก (Must เดิมเลือก Guestbook แต่ HR ไม่เขียน guestbook) และข้อเสนอให้เปิดเผยว่าเว็บมาจากคอร์ส ซึ่ง frontend ถอนไปเองหลังพบว่าขัดกับ skill `public-site-safe` ครบ 5 รอบแล้วเหลือ 4 ข้อที่ต้องให้เจ้าของตัดสิน เจ้าของเลือกตามที่ทั้งสองฝั่งแนะนำทุกข้อ ได้แก่ CTA แบบ B, ยอมรับอีเมลใน history แล้วใช้ noreply, ลด Must ผลงานเหลือ case study และใช้อีเมลนามแฝงเป็นช่องทางติดต่อ

## การตัดสินใจ (ตาราง)

| ID | หัวข้อ | ตัดสินใจ | เหตุผลสั้น | ใครเสนอ (Brand/UX/Devil) |
|----|--------|----------|------------|---------------------------|
| D1 | กลุ่มเป้าหมาย v1 | **หลัก** = HR / hiring manager (รวมหัวหน้าและคนในองค์กร) · **รอง** = เพื่อน dev / ชุมชน · **พักไว้** = ลูกค้าฟรีแลนซ์ | 4 กลุ่มเยอะเกินสำหรับ v1 · หน้าบริการอยู่ใน Later อยู่แล้ว | Brand (Devil เห็นด้วย) |
| D2 | Headline | **"Programmer ที่ทำงานคู่ AI — เว็บ · automation · กำลังลงมือกับ AI agents"** (แก้ใน PROFILE แล้ว) | ใส่แกน "ทำงานคู่ AI" · "กำลังลงมือ" ไม่เคลมว่ามี agent ใช้งานจริงแล้ว และตรงกับประสบการณ์ไม่ถึง 2 ปี | Brand (F1') · Devil ค้านร่างแรกที่ overclaim |
| D3 | Bio / คำเคลม | ตัดคำเคลมที่ไม่มีหลักฐาน ("ทุกแบบที่ได้รับมอบหมาย", "ระบบภายในองค์กร", "เร็วขึ้นโดยไม่ทิ้งคุณภาพ") · ตัดประโยคที่พูดกับลูกค้าฟรีแลนซ์ · หลัก: **ทุกคำอวดต้องตรวจสอบได้** (แก้ใน PROFILE แล้ว ดูหัวข้อ "สิ่งที่แก้ใน PROFILE") | "ระบบภายในองค์กร" เสี่ยงชี้ไปหาบริษัท (Private) · คำอวดที่ไม่มีหลักฐานขัดกับ Avoid | Brand (F10') + Devil (R9) |
| D4 | CTA หน้าแรก | **แบบ B**: ปุ่มหลัก **"ดูว่าเราทำงานคู่ AI ยังไง"** ไป `/about#case-study` · ปุ่มรองที่เห็นชัด **"เขียน Guestbook ทักทายกัน"** · **เปลี่ยน Must เดิม** (เจ้าของอนุมัติ) | HR ซึ่งเป็นกลุ่มหลักไม่เขียน guestbook · case study อยู่ใน P0 ปลายทางจึงมีเนื้อหาจริง | UX (F3') + Devil · เจ้าของเลือก |
| D5 | ผลงาน | **ลด Must** เหลือ case study ของเว็บนี้ 3–4 bullet ใน About + ลิงก์ GitHub profile · โปรเจกต์ส่วนตัวอื่นย้ายไป Nice · ห้ามมี section ว่าง หรือเขียนว่า "เร็ว ๆ นี้" | ยังไม่มี repo public อื่นให้โชว์ · case study ต้องมีแค่ข้อเท็จจริงที่ตรวจได้ | Devil + UX (F12) · เจ้าของเลือก |
| D6 | เล่าที่มาของเว็บ | บนเว็บเขียนแค่ *"เว็บนี้สร้างร่วมกับ Claude Code + OpenCode แบบ multi-agent"* · **ห้ามพูดถึง Lab / คอร์ส / เวิร์กช็อป** · **ไม่ลิงก์ repo หรือ PR** ลิงก์ได้แค่ GitHub profile · ยอมรับความเสี่ยงที่ชื่อ repo ยังเห็นได้จาก profile | ข้อเสนอเดิม (F11) ขัดกับ `public-site-safe` · ลิงก์ PR ก็อยู่ห่าง `labs/` แค่คลิกเดียว | Devil (R3) · Brand ถอน F11 |
| D7 | อีเมลใน git history (R1) | **ยอมรับ ไม่ rewrite** · ตั้ง `git config user.email` เป็น GitHub noreply **ก่อน commit ถัดไป** | repo public แล้ว ข้อมูลถูก clone หรือ index ไปแล้ว · rewrite ลบข้อมูลที่หลุดไปแล้วไม่ได้ และ force push ก็มีความเสี่ยง | Devil · เจ้าของเลือก |
| D8 | Contact | **ไม่มีฟอร์มใน v1** · ช่องทางหลัก = **อีเมลนามแฝง** ที่ใช้บัญชีแยก ตั้ง display name เป็น `xA0Mz` ไม่ผูกกับบัญชีหลัก และไม่ใช้เป็นอีเมลกู้คืน · แสดงเป็น `mailto:` ที่ประกอบด้วย JS + `<noscript>` แบบ "handle [at] โดเมน" · มีลิงก์ GitHub profile ด้วย · ไม่แสดง linkedin · `/api/contact` ตอบ **404/410** จนกว่าจะเปิดฟอร์ม · `insertContact` ทำใน `db.ts` ให้ test ผ่าน | HR ต้องมีช่องทางส่วนตัว (GitHub ไม่มี DM) · ไม่เก็บอีเมลคนแปลกหน้าที่ไม่มีใครอ่าน (PDPA) · ถ้าเอาฟอร์มออกแต่ route ยังเปิด บอทก็ยังส่งได้ | Devil (R5, R7) + UX (F13, F18) · เจ้าของเลือก (a) |
| D9 | Guestbook safety | ฝั่ง client render ด้วย `textContent` ทุก field (รวม `created_at`) และเช็ค `res.ok` · ฝั่ง server validate + จำกัดความยาว (ชื่อ ≤ 80, ข้อความ ≤ 500) + rate limit (best-effort) · honeypot มี `aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"` และซ่อนด้วย CSS · label ชื่อ = "ชื่อเล่นหรือนามแฝง (แสดงต่อสาธารณะ)" · ไม่มีช่องอีเมล | ตอนนี้ต่อ `innerHTML` โดยไม่ escape · honeypot ที่ไม่ซ่อนจาก a11y/autofill จะบล็อกคนจริง · label เดิมชวนให้ใส่ชื่อจริง | UX (F9, F15) + Devil (R4, R10) |
| D10 | Kill switch | env **`GUESTBOOK_ENABLED`** ค่าเดียวที่ปิดคือ `"false"` (ไม่ตั้ง = เปิด) · ตอนปิด `GET /api/guestbook` → 200 `{ "entries": [] }` · `POST` → **503** · หน้า guestbook ซ่อนฟอร์มและรายการ แล้วแสดง "ตอนนี้ปิดรับข้อความชั่วคราว — …" · ปุ่ม Guestbook บน Home เปลี่ยนเป็นลิงก์ case study · อ่านค่า **ตอน runtime ผ่าน `process.env`** ห้ามใช้ `import.meta.env` · ต้องทดสอบด้วยการสลับค่าแล้ว `curl` ทั้ง GET และ POST · ทางลบโพสต์สำรอง = `docker exec` + `node -e` ผ่าน better-sqlite3 เขียนขั้นตอนไว้ใน docs | image ไม่มี `sqlite3` CLI · ไม่มีหน้า admin (Avoid) · ถ้าซ่อนแค่ UI ข้อมูลก็ยังออกทาง API · env ที่ฝังไว้ตอน build จะไม่เปลี่ยนตามค่าใน Coolify | Devil (R4) + UX (F17'') |
| D11 | ข้อความภายใน / error | ลบป้าย "Personal branding site", บรรทัด `Audience:`, path API และ "อัปเดตเร็ว ๆ นี้" ออกจากหน้าเว็บ · `description` default ใน `BaseLayout.astro` เปลี่ยนเป็น Headline · `FALLBACK` / title default ไม่ใช้ข้อความ scaffold · error ทุกแบบรวม 501/5xx แสดง "ตอนนี้ยังส่งไม่ได้ ลองใหม่ภายหลังนะ" **ห้ามแสดง `data.error` ดิบ** · ข้อความที่ throw จาก `db.ts` ต้องปลอดภัยต่อผู้ชม (งาน backend) | leak-guard test จับได้แค่ markup ไม่จับ frontmatter และข้อความตอน runtime | UX (F7, F8, F14) + Devil (R2) |
| D12 | Parser / ownership | owner ของ `src/lib/profile.ts` = **Frontend (Claude)** · แก้ให้อ่านได้หลายบรรทัด และ **whitelist หัวข้อ** (`## Private` / `## Brainstorm` ต้องไม่ถูก parse) · `interests: string[]` เป็นชื่อล้วนเหมือนเดิม (`/api/interests` ไม่พัง) · เพิ่ม `interestDetails: { title, description? }[]` แยกที่ `: ` ตัวแรก · เพิ่ม test: Bio ครบหลายย่อหน้า · interests ไม่มี `: ` หลุดมา · ส่วน Private/Brainstorm ไม่รั่ว | parser ตอนนี้ทิ้งข้อมูล และ smoke test ไม่จับ · ไฟล์นี้ยังไม่อยู่ในตาราง Ownership | UX (F4, R8) + Devil (R8, R11) |
| D13 | IA + microcopy | คง 5 หน้า (Home · About · Interests · Contact · Guestbook) ตามโครงใน `DEBATE.md` › UX Critic §3 · ใช้ตาราง microcopy ใน UX Critic §4 เป็นต้นฉบับ (ปรับตาม D4 / D8) · ใช้ "เรา" ทั้งเว็บ · label/ปุ่มเป็นภาษาไทย · Interests แสดงเป็นการ์ด ถ้ายังไม่มีคำอธิบายให้แสดงแค่ชื่อ | ภาษาปนกันและสรรพนามไม่ตรงกัน ทำให้เว็บดูเป็น template · ไม่เพิ่มหน้าตาม Avoid | UX + Brand |
| D14 | ลำดับงาน Lab 04 | **P0** = D12 parser + test · D11 · D9 ฝั่ง UI · D10 ฝั่ง UI · microcopy (D13) · case study (D5) · Contact ตาม D8 · **P1** = การ์ด Interests ที่มีคำอธิบาย · meta/OG | ปุ่มหลัก (D4) ต้องมีปลายทางจริง · กัน scope บวม | UX (F16') + Devil (R6) |

### สิ่งที่แก้ใน PROFILE (Lab 02)

| หัวข้อ | เดิม | ใหม่ | อ้าง |
|---|---|---|---|
| `## Headline` | Programmer ทำระบบทุกอย่างที่ได้รับมอบหมาย — เว็บ · automation · AI | Programmer ที่ทำงานคู่ AI — เว็บ · automation · กำลังลงมือกับ AI agents | D2 |
| `## Bio` ย่อหน้า 1 | …โปรแกรมเมอร์ที่รับทำระบบแทบทุกแบบที่ได้รับมอบหมาย ตั้งแต่เว็บไซต์ เว็บแอป ไปจนถึงระบบภายในองค์กร | …โปรแกรมเมอร์ที่ชอบสร้างเว็บ เว็บแอป และ automation ที่ลดงานซ้ำ ๆ | D3 · ย่อหน้าเดียวที่ขึ้นเว็บตอนนี้ (จนกว่า D12 จะเสร็จ) |
| `## Bio` ย่อหน้า 3 | …ใช้ AI เป็นเพื่อนร่วมทีม ช่วยให้ส่งงานได้เร็วขึ้นโดยไม่ทิ้งคุณภาพ | …ใช้ AI เป็นเพื่อนร่วมทีม — การตัดสินใจหลักของเว็บนี้มีบันทึกไว้ และรีวิวโดย AI อีกตัวร่วมกับตัวเราเอง | D3 · ถ้อยคำจาก Devil |
| `## Bio` ย่อหน้า 4 | มีระบบอยากให้ช่วยทำ อยากชวนร่วมงาน… | อยากชวนร่วมงาน… (ตัดประโยคที่พูดกับลูกค้าฟรีแลนซ์ออก) | D1 · D3 |

**ไม่ได้แก้:** Bio ย่อหน้า 2 (ไม่มีฝั่งไหนขอแก้) · `## Contact` ยังเป็น `demo@example.com` รอเจ้าของสร้างอีเมลนามแฝงตาม D8 (OPEN_LOOPS) · Interests ยังเป็นชื่อล้วน ถ้าจะเพิ่มคำอธิบายให้ใช้รูปแบบ `- Web development: …` หลัง D12 เสร็จ

## สิ่งที่เลื่อนออก (Out of scope v1)

- ลูกค้าฟรีแลนซ์ในฐานะกลุ่มเป้าหมาย และหน้าบริการ (D1)
- โปรเจกต์ส่วนตัวอื่นนอกจากเว็บนี้ รอจนมี repo public ที่พร้อมโชว์ (D5)
- ลิงก์ repo / PR ของเว็บนี้ และข้อความใดที่พูดถึงคอร์ส (D6) · จะ rename repo หรือทำเป็น private ก็ได้ (ไม่บังคับ)
- ฟอร์ม Contact และการเก็บข้อความลง DB (D8) ถ้าจะเปิดภายหลังต้องมีข้อความแจ้งการเก็บข้อมูลและนโยบายระยะเวลาเก็บใน DECISIONS ก่อน
- linkedin บนหน้าเว็บ
- หน้า admin / login / CMS (การลบโพสต์ใช้ kill switch + ขั้นตอนมือตาม D10)
- บล็อก / TIL · สลับภาษา TH/EN · แสดงกิจกรรม GitHub อัตโนมัติ
- rewrite git history (D7)

## เกณฑ์พร้อม Frontend (Lab 04)

- `loadProfile()` คืน Bio ครบทุกย่อหน้า · `interests` ครบ 3 ข้อเป็นชื่อล้วน · มี `interestDetails` · ไม่มีเนื้อหาจาก `## Private` / `## Brainstorm` · มี test ใหม่ตาม D12 และ `npm test` เขียว (D12)
- ตั้ง `git config user.email` เป็น GitHub noreply แล้วก่อน commit แรกของ Lab 04 (D7)
- สัญญาของ `GUESTBOOK_ENABLED` (D10) และ `/api/contact` → 404/410 (D8) อยู่ใน handoff ถึง backend แล้ว เพื่อให้ UI ที่ทำใน Lab 04 ตรงกับ API ของ Lab 05
- ข้อความบนเว็บใช้ microcopy ตาม D13 · ไม่มีข้อความภายในตามรายการ D11 (ตรวจทั้ง markup และ `description` / `FALLBACK`) · leak-guard test ผ่าน
- Home มี `xA0Mz` + Headline + ปุ่มหลักไป `/about#case-study` + ปุ่มรอง Guestbook · About มี case study 3–4 bullet ที่เป็นข้อเท็จจริงล้วน + ลิงก์ GitHub profile · ไม่มี section ว่าง (D4 · D5 · D6)

## Lab 03 — MCP vs gh

> สร้าง issue จาก DECISIONS ผ่าน GitHub MCP (#1–#7) และผ่าน `gh` CLI (#8–#12) · 2026-09-25

- **ความเร็ว:** MCP อ่าน DECISIONS แล้วสร้าง 7 issue พร้อม body ยาว (เกณฑ์ผ่าน + checklist + owner) ได้ในรอบเดียว โดยยิงพร้อมกันหลาย call · `gh` เร็วกว่าสำหรับ issue เดี่ยวที่ body สั้น (#8 ใช้คำสั่งเดียว) แต่ถ้า body ยาวต้องเตรียมไฟล์ `--body-file` ก่อน ซึ่งทาง B ต้องให้ `claude -p` ร่างแยกทีละ decision
- **สิทธิ์:** MCP ใช้ PAT จาก `.env` ผ่าน `.mcp.json` (fine-grained · repo เดียว · scope Issues) และตอนรัน headless จำกัดได้ด้วย `--allowedTools "mcp__github"` · `gh` ใช้ OAuth token ใน keyring ซึ่ง scope กว้างกว่า (`repo`, `workflow`, `gist`, `read:org`) → งานที่ให้ agent ทำเองควรใช้ MCP + PAT แคบ · ห้ามใส่ token ใน issue หรือ docs ทั้งสองทาง
- **Audit trail:** บน GitHub ทั้งสองทางแสดงผู้สร้างเป็น `xA0Mz` เหมือนกัน ดูจากหน้า issue ไม่ออกว่ามาจากทางไหน · หลักฐานว่าใช้ MCP อยู่ใน transcript ของ Claude (tool call `issue_write`) ส่วน `gh` อยู่ใน shell history · ร่องรอยที่อ่านได้ข้ามคนและข้าม CLI จึงต้องเป็นตาราง issue # ในไฟล์นี้ (ด้านล่าง)
- **ข้อผิดพลาดที่เจอ:** ไม่เจอ 401 ทั้งสองทาง · issue จาก `gh` ที่ใช้ title ตัวอย่างใน README (#9–#12) ใช้เลข D ของคอร์ส **ไม่ตรงกับ DECISIONS ของ repo นี้** (เช่น `[D2] Guestbook scope` แต่ D2 ของเราคือ Headline · `[D3] Theme color` แต่ D3 คือคำเคลมใน Bio) และซ้ำกับ #2 / #7 · ลิงก์ `docs/DECISIONS.md` ใน body ขึ้น 404 จนกว่าจะ push · repo ไม่มี label `docs` ต้องใช้ `documentation`
- **เมื่อไหร่ใช้อะไร:** MCP = แปลงเอกสารเป็นหลาย issue ที่ body มีโครงสร้าง หรือให้ agent ทำจบใน session · `gh` = ตรวจผล (`gh issue list`), issue เดี่ยวแบบเร็ว, สคริปต์ที่รันซ้ำได้ (`npm run create-issues`), ปิด duplicate · ทั้งสองทางต้อง list/search issue ก่อนสร้าง และตั้ง title จาก D-id ในไฟล์นี้ ไม่ใช่จากตัวอย่าง

### Issue ↔ Decision

| Issue # | Title (ย่อ) | มาจาก Decision | สร้างผ่าน | Owner |
|---|---|---|---|---|
| #1 | Parser profile.ts หลายบรรทัด + whitelist + interestDetails | D12 | MCP | Frontend |
| #2 | Home CTA แบบ B + case study + ที่มาของเว็บ | D4 · D5 · D6 | MCP | Frontend |
| #3 | ลบข้อความภายใน + microcopy + error ปลอดภัย | D11 · D13 | MCP | Frontend |
| #4 | Guestbook UI: render ปลอดภัย + honeypot + kill switch | D9 · D10 | MCP | Frontend |
| #5 | Guestbook API: validate + rate limit + kill switch | D9 · D10 · D11 | MCP | Backend |
| #6 | Contact v1: mailto นามแฝง + ปิด `/api/contact` | D8 | MCP | Frontend + Backend |
| #7 | เก็บงาน PROFILE + git noreply | D1 · D2 · D3 · D7 | MCP | Claude + human |
| #8 | Draft compare gh | — (ฝึกหัด ทาง A ขั้นที่ 4) | gh | เปิดไว้เป็นหลักฐาน gh |
| #9–#12 | title ตามตัวอย่างในคอร์ส (ทาง B) | เลข D ไม่ตรง · ซ้ำกับ #2 / #4 / #7 | gh | **ปิดแล้ว** (not planned) พร้อมคอมเมนต์ชี้ไป issue ที่ถูก |
