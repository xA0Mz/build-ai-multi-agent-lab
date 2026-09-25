# Debate — Personal Site

> Lab 02 — บันทึกจาก Subagents (facilitator = Claude หลัก)
> Input: `docs/PROFILE.md` ต้นฉบับ Lab 01 (commit `eeb54bc`) · สถานะทั้งไฟล์: **proposed** เรื่องที่ปิดแล้วอยู่ใน `DECISIONS.md` เท่านั้น

**วิธีโต้:** subagent 2 ตัวผลัดกันพูด **5 รอบ** (10 turns) โดย facilitator เป็นคนส่งข้อความระหว่างกัน ไม่มีตัวไหนอ่าน debate รอบก่อน
- `frontend` สวม 2 หมวก **Brand Strategist + UX Critic** เป็นฝั่งเสนอ ตั้งเลขข้อเสนอ F1…F18
- `reviewer` สวมหมวก **Devil's Advocate** เป็นฝั่งท้าทาย ตั้งเลขความเสี่ยง R1…R11
- ทั้งสองตรวจข้อเท็จจริงจากโค้ด/git แบบอ่านอย่างเดียว ไม่ได้แก้ไฟล์

| รอบ | frontend (Brand + UX) | reviewer (Devil) |
|---|---|---|
| 1 | เปิด F1–F9: headline ใหม่ · กลุ่มหลัก HR · CTA = Guestbook · parser ทำข้อมูลหาย · ข้อความคอร์สหลุด | ค้าน CTA (F3) · เพิ่ม R1–R6: อีเมลใน git · error "Lab 05" หลุด · repo เปิดเผย template · guestbook ลบไม่ได้ |
| 2 | F1' headline ไม่ overclaim · F3' CTA ไป case study · F11 เปิดเผยว่ามาจากคอร์ส · F13 Contact ไม่มีฟอร์ม | ตรวจพบว่า repo **public** และ image **ไม่มี `sqlite3`** · F11 ขัดกับ skill `public-site-safe` · เสนอ kill switch |
| 3 | ถอน F11 → F11' (ไม่พูดถึงคอร์ส ไม่ลิงก์ repo) · F17 UI ของ kill switch · case study ขึ้น P0 | kill switch ต้องครอบคลุม `GET` ด้วย · env ต้องอ่านตอน runtime · `/api/contact` ยังเปิดอยู่ |
| 4 | ยอมรับ F17'' / F18 · สรุปข้อเสนอสุดท้าย (IA + microcopy) | R7 HR ไม่มีช่องทางส่วนตัว · R8 `profile.ts` ไม่มี owner · สรุปตารางความเสี่ยง |
| 5 | ยอมรับ R7–R10 · R8 = Frontend + `interestDetails` · บอกจุดยืนต่อ 4 คำถาม | เห็นด้วยแบบมีเงื่อนไขทั้ง 4 ข้อ · เพิ่ม R11 test ไม่จับบั๊ก parse |

---

## Brand Strategist

> ผู้พูด: `frontend` (หมวก Brand) · มุม positioning · audience · โทน/ข้อความ

### 1. Positioning — Headline

Headline ตอนนี้ *"Programmer ทำระบบทุกอย่างที่ได้รับมอบหมาย — เว็บ · automation · AI"* ฟังเหมือนคนรอรับคำสั่ง ไม่มีจุดต่าง และยังไม่ได้บอกแกนที่ Brainstorm ตั้งไว้คือ "ทำงานคู่ AI"

| รอบ | ข้อเสนอ | ผลจาก Devil |
|---|---|---|
| 1 (F1) | "Programmer ที่ทำงานคู่ AI สร้างเว็บ, automation และ AI agents ที่ใช้งานได้จริง" | ถูกค้าน: "AI agents ที่ใช้งานได้จริง" เคลมเกินหลักฐานเพราะยังไม่มี repo ให้ลิงก์ |
| 2 (F1') | **"Programmer ที่ทำงานคู่ AI — เว็บ · automation · กำลังลงมือกับ AI agents"** | **ยอมรับ** "กำลังลงมือ" ตรงกับประสบการณ์ไม่ถึง 2 ปี |

### 2. Audience

- **กลุ่มหลัก** = HR / hiring manager (รวมหัวหน้าและคนในองค์กรที่อยากเห็นผลงาน) · **กลุ่มรอง** = เพื่อน dev / ชุมชน · **พักไว้** = ลูกค้าฟรีแลนซ์ เพราะหน้าบริการอยู่ใน Later (F2 — Devil เห็นด้วย)
- ต้องเอาบรรทัด `Audience:` ออกจากหน้า Home เพราะเป็นโน้ตภายใน ไม่ใช่ข้อความสำหรับผู้ชม

### 3. โทน / ข้อความใน Bio (F10 → ปรับตาม Devil)

| ย่อหน้า | ปัญหา | ข้อเสนอสุดท้าย |
|---|---|---|
| 1 | "ทำระบบแทบทุกแบบที่ได้รับมอบหมาย" · "ระบบภายในองค์กร" ไม่มีหลักฐาน และเสี่ยงชี้ไปหาบริษัท/ลูกค้า (Private) | "ชอบสร้างเว็บ เว็บแอป และ automation ที่ลดงานซ้ำ ๆ" |
| 3 | "ช่วยให้ส่งงานได้เร็วขึ้นโดยไม่ทิ้งคุณภาพ" เคลมโดยไม่มีหลักฐาน (R9) | "เรียนรู้เร็ว ไม่กลัวงานที่ไม่เคยทำ และใช้ AI เป็นเพื่อนร่วมทีม" + "การตัดสินใจหลักของเว็บนี้มีบันทึกไว้ และรีวิวโดย AI อีกตัวร่วมกับตัวเราเอง" (F10' ใช้ถ้อยคำของ Devil แทน "ทุกการตัดสินใจ…ผ่านรีวิว") |
| 4 | "มีระบบอยากให้ช่วยทำ" พูดกับลูกค้าฟรีแลนซ์ที่พักไว้แล้ว | "อยากชวนร่วมงาน หรือคุยเรื่อง AI agents — …" (ช่องทางท้ายประโยคขึ้นอยู่กับ R7) |

### 4. การเล่าว่าเว็บนี้สร้างยังไง (F11 → F11')

- **รอบ 2 (F11):** เสนอให้เปิดเผยตรง ๆ ว่าสร้างจากโครงคอร์ส multi-agent เพราะนั่นคือแบรนด์ "ทำงานคู่ AI" อยู่แล้ว และให้ลิงก์ไป PR / DECISIONS
- **รอบ 3 (F11'):** **ถอน** หลังอ่าน `.claude/skills/public-site-safe/SKILL.md` ที่ห้ามพูดถึง "Lab / คอร์ส / เวิร์กช็อป" ใน markup → ข้อความบนเว็บเหลือแค่ *"เว็บนี้สร้างร่วมกับ Claude Code + OpenCode แบบ multi-agent"* ไม่ลิงก์ repo หรือ PR ลิงก์ได้แค่ GitHub profile

### 5. จุดยืนสุดท้าย (รอบ 5)

CTA = **B** (ปุ่มหลักไป case study) · อีเมลใน commit เก่า = **ยอมรับ + ใช้ noreply** · ลด Must "ผลงาน" = **อนุมัติ** · ช่องทางติดต่อ HR = **(a) อีเมลนามแฝง** ถ้าไม่มีให้ใช้ (b)

---

## UX Critic

> ผู้พูด: `frontend` (หมวก UX) · มุม IA · ความพร้อมของข้อมูล · microcopy · จุดที่ผู้เยี่ยมสับสน

### 1. ข้อมูลใน PROFILE ยังไม่พร้อมสำหรับ 5 หน้า (F4, F5)

ตรวจแล้วด้วยการรัน regex เดียวกับ `src/lib/profile.ts` กับ PROFILE จริง: lookahead `(?=^##\s|$)` ใช้คู่กับ flag `m` ทำให้ `$` จับที่ท้าย**บรรทัดแรก**

| ข้อมูล | ใน PROFILE | ที่ผู้ชมเห็นจริง |
|---|---|---|
| Bio | 4 ย่อหน้า | ย่อหน้า 1 เท่านั้น (เรื่อง "ไม่ถึง 2 ปี", "AI เป็นเพื่อนร่วมทีม", "ทักมาได้เลย" หายหมด) |
| Interests | 3 ข้อ | `['Web development']` ข้อเดียว |
| Contact / Tone | มี | ไม่ถูก parse เลย (ไม่มีใน type `Profile`) |
| ผลงาน (Must) | ไม่มีรายการ | — |
| Contact | `demo@example.com` · linkedin `—` | placeholder · ช่องที่เป็น `—` ควรซ่อน ไม่ใช่แสดงขีด |

**R8 → ข้อเสนอรอบ 5:** owner ของ `src/lib/profile.ts` = **Frontend (Claude)** เพราะเป็นตัว parse เนื้อหาให้ UI · `interests: string[]` คงเป็นชื่อล้วนเหมือนเดิม `/api/interests` (ของ backend) กับ smoke test จึงไม่พัง · เพิ่ม field `interestDetails: { title, description? }[]` แยกที่ `: ` ตัวแรก (รูปแบบใน PROFILE `- Web development: …`)

### 2. จุดที่ผู้ชมจะสับสน (F7, F8, F9)

1. ป้าย "Personal branding site" และบรรทัด `Audience:` บน Home ดูเป็น scaffold
2. `description` default ใน `BaseLayout.astro` มีข้อความ "…for the multi-agent course" ซึ่งรั่วไปใน meta ของทุกหน้าที่ไม่ส่ง description มา (About / Interests / Contact / Guestbook) · leak-guard test จับไม่ได้เพราะอยู่ใน frontmatter
3. path API (`POST /api/contact`, `/api/guestbook`) โชว์บนหน้าเว็บ
4. label/ปุ่มเป็นอังกฤษ · สรรพนามไม่ตรงกัน (Bio ใช้ "เรา" แต่การ์ดบน Home ใช้ "ฉัน")
5. ข้อความ "อัปเดตเร็ว ๆ นี้" ใน About / Interests
6. Guestbook ต่อ HTML ด้วย `innerHTML` โดยไม่ escape (รวม `created_at`) และเงียบไปเลยเมื่อส่งไม่สำเร็จ (ไม่เช็ก `res.ok`)

### 3. IA — ข้อเสนอสุดท้าย (คง 5 หน้าตาม Avoid scope)

```text
Home      xA0Mz · Headline · Bio ย่อหน้า 1 · CTA (A/B รอผู้เรียน) · การ์ดลิงก์ไป 4 หน้า
About     Bio เต็ม + section "ทำงานคู่ AI" (#case-study) 3–4 bullet:
          สร้างอะไร · Claude Code กับ OpenCode แบ่งงานกันยังไง · การตัดสินใจถูกบันทึกและรีวิว · เรียนรู้อะไร
          + ลิงก์ GitHub profile (ไม่ลิงก์ repo)
Interests การ์ด 3 ใบ ชื่อ + 1 ประโยค · ถ้ายังไม่มีคำอธิบายให้แสดงแค่ชื่อ ห้ามใส่ placeholder
Contact   ไม่มีฟอร์ม · ไม่แสดง linkedin · ช่องทางตาม R7
Guestbook ฟอร์ม + honeypot + รายการ (textContent) + สถานะตอน kill switch ปิด
```

**CTA (F3 → F3'):** รอบ 1 เสนอปุ่มหลัก "เขียน Guestbook ทักทายกัน" ตาม Must · รอบ 2 เปลี่ยนเป็นปุ่มหลัก *"ดูว่าเราทำงานคู่ AI ยังไง"* ไป `/about#case-study` ส่วน Guestbook เป็นปุ่มรองที่เห็นชัด (= **ทางเลือก B**) เพราะ HR ไม่เขียน guestbook และยังไม่มีผลงานอื่นให้ดู

**ลำดับงาน Lab 04 (F16'):** P0 = parser + whitelist · ข้อความคอร์สหลุด (F8) · escape + error กลาง ๆ (F9/F14) · microcopy (F7) · UI ของ kill switch (F17) · case study ใน About · P1 = การ์ด Interests, OG

### 4. Microcopy (เดิม → ใหม่)

| จุด | เดิม | ใหม่ |
|---|---|---|
| ป้ายบน Home | Personal branding site | *(ลบ)* |
| Home | Audience: … | *(ลบ)* |
| meta description default | …for the multi-agent course | ใช้ Headline |
| การ์ด Contact บน Home | ส่งข้อความถึงฉัน | ทักทางไหนได้บ้าง |
| คำโปรย Guestbook | …อ่าน/เขียนผ่าน /api/guestbook | ฝากคำทักทายได้เลย · ไม่ต้องใส่อีเมล · ไม่เกิน 500 ตัวอักษร |
| label / ปุ่ม Guestbook | Name / Message / Sign | ชื่อเล่นหรือนามแฝง (แสดงต่อสาธารณะ) / ข้อความ / ลงชื่อ |
| Guestbook ยังว่าง | No entries yet. | ยังไม่มีใครเขียนเลย — เป็นคนแรกไหม? |
| error (รวม 501 / 5xx) | `data.error` ดิบ | ตอนนี้ยังส่งไม่ได้ ลองใหม่ภายหลังนะ |
| Guestbook ตอนปิด | *(ไม่มี)* | ตอนนี้ปิดรับข้อความชั่วคราว — … (ช่องทางตาม R7) |
| Contact | ฟอร์มนี้โพสต์ไปที่ POST /api/contact + ฟอร์ม | ข้อความตามช่องทางที่เลือกใน R7 |
| About / Interests | …อัปเดตเร็ว ๆ นี้ | *(ลบ)* |

ถ้าเลือก R7 แบบ (b) ต้องเปลี่ยนคำว่า "ทักทาง GitHub" เป็น "ดูผลงานบน GitHub" ทุกจุด (Contact · Guestbook ตอนปิด · Bio ย่อหน้า 4)

---

## Devil's Advocate

> ผู้พูด: `reviewer` · มุม privacy · credibility · scope creep · ทุกข้อตรวจจากไฟล์/git จริง

### 1. ความเสี่ยงและสถานะหลังโต้ครบ 5 รอบ

| # | ความเสี่ยง | ระดับ | หลักฐาน | สถานะสุดท้าย |
|---|---|---|---|---|
| R1 | commit ทุกตัวใช้อีเมล gmail ส่วนตัวที่ดูเหมือนมีชื่อจริงอยู่ข้างหน้า @ และ **repo เป็น public แล้ว** ข้อมูลจึงเปิดเผยไปแล้ว การ rewrite + force push ลบข้อมูลที่ถูก clone/index ไปแล้วไม่ได้ | Must | `git log --format=%ae` · `gh repo view` | รอผู้เรียน · ทั้งสองฝั่งเสนอให้ยอมรับ + ตั้ง noreply ก่อน commit ถัดไป |
| R2 | stub ใน `db.ts` throw ข้อความ "— Lab 05 OpenCode" แล้ว `guestbook.astro` / `contact.astro` แสดง `data.error` ดิบ · leak-guard ไม่จับกรณี runtime | Must | `src/lib/db.ts` · `guestbook.astro:26` · `contact.astro:36` | ปิดฝั่ง UI (F14) · รอ backend แก้ข้อความ |
| R3 | ลิงก์ GitHub → repo `build-ai-multi-agent-lab` ที่มี `labs/`, `.github/course-issues/` · "ใช้เว็บนี้เป็นหลักฐาน" จึงกลายเป็นหลักฐานว่าทำตามคอร์ส | Must | โครง repo | ยอมรับความเสี่ยง (F11'): ไม่ลิงก์ repo แต่ชื่อ repo ยังเห็นได้จาก profile · จะ rename หรือทำเป็น private ก็ได้ (Nit) |
| R4 | guestbook ไม่มี rate limit / honeypot / ทางลบ แต่ Avoid ห้ามทำ admin · image `node:22-bookworm-slim` **ไม่มี `sqlite3` CLI** · rate limit ต่อ IP หลัง proxy ปลอม `X-Forwarded-For` ได้ | Must | `Dockerfile` | ปิด: kill switch `GUESTBOOK_ENABLED` ครอบคลุม GET + POST · honeypot/rate limit เป็น best-effort · คำสั่งลบผ่าน `docker exec` + `node -e` เขียนไว้ใน docs |
| R5 | Contact เก็บอีเมลคนแปลกหน้าลง DB ไม่มีใครอ่าน ไม่มีนโยบายระยะเวลาเก็บ (PDPA) · ถ้าเอาฟอร์มออกแต่ route ยังเปิด บอทก็ยัง POST ได้ | Must | `contact.astro` · lab05 test ทดสอบแค่ชั้น `db.ts` | ปิด (F18): route ตอบ 404/410 จนกว่าจะเปิดฟอร์ม · `insertContact` ทำใน `db.ts` ให้ test ผ่าน |
| R6 | scope Lab 04 บวม (parser + leak + การ์ด + OG + ผลงาน) | Should | — | ปิด (F16' แยก P0/P1) |
| R7 | Contact มีแค่ GitHub → HR ไม่มีช่องทางส่วนตัว (GitHub ไม่มี DM ต้องเปิด issue สาธารณะ) · คำว่า "ทักทาง GitHub" เกินความจริง | Must | — | รอผู้เรียน · (a) อีเมลนามแฝง ต้องใช้บัญชีแยก ตั้ง display name เป็น handle ห้ามผูกกับบัญชีหลัก และต้องมี `<noscript>` หรือ (b) GitHub อย่างเดียว + เปลี่ยนคำ |
| R8 | `src/lib/profile.ts` ไม่มี owner ในตาราง Ownership · รูปแบบ Interests ใหม่กระทบ `/api/interests` | Must | `src/pages/api/interests.ts` | ปิด: Frontend เป็น owner · `interests: string[]` คงเดิม + `interestDetails` |
| R9 | Bio "ช่วยให้ส่งงานได้เร็วขึ้น" / "ไม่ทิ้งคุณภาพ" / "ระบบภายในองค์กร" ไม่มีหลักฐาน | Should | PROFILE | ปิด (ตัดตาม F10') |
| R10 | label "ชื่อที่อยากให้แสดง" ชวนให้ใส่ชื่อจริง · honeypot ที่ไม่มี `aria-hidden` / `tabindex="-1"` / `autocomplete="off"` จะบล็อกคนจริง | Nit | — | ปิด (ยอมรับทั้งคู่) |
| R11 | `tests/smoke.test.ts` เช็กแค่ว่า headline มีค่าและ interests เป็น array จึงไม่จับบั๊กตัดบรรทัด | Should | `tests/smoke.test.ts` | Frontend เพิ่ม test: Bio ครบหลายย่อหน้า · `interests` ไม่มี `: ` หลุดมา · `## Private` / `## Brainstorm` ไม่ถูก parse |

**ข้อท้วงเพิ่มระหว่างทาง:** parser ต้อง **whitelist หัวข้อ** ห้ามให้ `## Private` / `## Brainstorm` ขึ้นหน้าเว็บ · `FALLBACK` ใน `profile.ts` ("Your Name", interest "Teaching" ที่ไม่จริง) และ title default "Personal Site" จะโผล่ถ้า parse พลาด · kill switch ต้องอ่าน env ตอน runtime (`process.env`) ห้ามใช้ `import.meta.env` ที่อาจถูกฝังไว้ตอน build และทดสอบด้วยการสลับค่าแล้ว `curl` ทั้ง GET และ POST จริง

### 2. ข้อโต้แย้งที่เปลี่ยนข้อเสนอของฝั่ง Brand + UX

- **F3 CTA = Guestbook** → HR ไม่เขียน guestbook → frontend เปลี่ยนเป็น B (รอผู้เรียนเลือก เพราะขัดกับ Must ที่ผู้เรียนเขียนเอง)
- **F11 เปิดเผยว่ามาจากคอร์ส** → ขัดกับ `public-site-safe` · ลิงก์ PR ก็อยู่ห่าง `labs/` แค่คลิกเดียว → frontend ถอน
- **F16 case study อยู่ P1 แต่ปุ่มหลักชี้ไปที่นั่น** → ย้ายขึ้น P0
- **F15 "ลบด้วย SQLite CLI"** → image ไม่มี CLI → ใช้ kill switch เป็นด่านสุดท้าย
- **F17 ซ่อนรายการแค่ที่ UI** → `GET /api/guestbook` ยังคืนข้อมูลอยู่ → สัญญา env ต้องครอบคลุม API
- **F13 Contact = GitHub** → HR ไม่มีช่องทางส่วนตัว → R7

### 3. สิ่งที่ควรตัด / ลดจาก Must

| Must เดิม | ข้อเสนอ |
|---|---|
| ปุ่มหลัก "เขียน Guestbook ทักทายกัน" | ตัดสินใหม่ตามกลุ่มหลัก (A/B) |
| ผลงาน = โปรเจกต์ส่วนตัว + เว็บนี้ พร้อมลิงก์ GitHub | ลดเหลือ case study ของเว็บนี้ + GitHub profile · โปรเจกต์อื่นย้ายไป Nice จนกว่าจะมี repo public จริง · ห้ามมี section ว่าง |
| (Nice) ฟอร์ม Contact | คงเป็น Nice · v1 ไม่มีฟอร์ม และปิด route |

### 4. จุดยืนสุดท้าย (รอบ 5)

1. CTA B — เห็นด้วย ถ้า `#case-study` อยู่ใน P0 จริง และปุ่ม Guestbook ยังเห็นชัด
2. อีเมลใน history — เห็นด้วยให้ยอมรับ ถ้าตั้ง `user.email` เป็น noreply ก่อน commit ถัดไป
3. ลด Must "ผลงาน" — เห็นด้วย ถ้า case study มีแค่ข้อเท็จจริงที่ตรวจได้ และไม่มี section ว่าง
4. ติดต่อ HR (a) — เห็นด้วยแบบมีเงื่อนไขตาม R7 ถ้าทำไม่ได้ให้ใช้ (b)

---

## คำถามถึงผู้เรียน (ส่งให้รอบตัดสินใจ)

1. CTA หน้าแรก: **A** Guestbook ตาม Must เดิม หรือ **B** ปุ่มหลักไป case study + Guestbook เป็นปุ่มรอง
2. อีเมลส่วนตัวใน commit history: ยอมรับ + ใช้ noreply ต่อจากนี้ หรือ rewrite history
3. อนุมัติให้ลด Must "ผลงาน" เหลือ case study ของเว็บนี้ + GitHub profile ไหม
4. ช่องทางติดต่อส่วนตัวของ HR: **(a)** อีเมลนามแฝง หรือ **(b)** GitHub อย่างเดียวแล้วแก้ถ้อยคำ
