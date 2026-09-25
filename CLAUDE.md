# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

# Claude Code — seed คอร์ส (อย่าลบตอน /init)

หลัง Lab 00 ให้ `/init` **merge** — เก็บกฎด้านล่างไว้เสมอ

## สี่เสา (ย่อ)

1. Multi-Agent แยกหน้าที่/ความจำ · 2. Sub-Agent ใช้แล้วทิ้ง · 3. ประสานผ่าน docs/PR · 4. Swarm เพดาน **20 turns**

## Ownership (บังคับ)

| Artifact | Owner |
|---|---|
| UI — `src/pages/*.astro`, `src/layouts/` | **Frontend = Claude** · `.claude/agents/frontend.md` |
| API + SQLite — `src/pages/api/*.ts`, `src/lib/db.ts` | **Backend = OpenCode** · `.opencode/agents/backend.md` |
| docs PROFILE / DEBATE / DECISIONS | Claude (Lab 01–02) |
| Hot state STATUS / OPEN_LOOPS | ผู้ถืองานรอบนั้น (single-writer) |

`src/pages/api/` อยู่ใต้ `src/pages/` แต่เป็นของ Backend — Claude แก้ได้แค่ `.astro` ข้าง ๆ

## Canonical context (อ่านก่อน · อย่าคัดลอกซ้ำในไฟล์นี้)

ก่อนลงมือ:

1. `docs/STATUS.md`
2. `docs/OPEN_LOOPS.md`
3. handoff ล่าสุดใน `docs/handoffs/` (ถ้ามี)
4. ตามงาน: `docs/PROFILE.md` · `docs/DECISIONS.md`

สรุป Goal / Latest D-id / Open loops / Blockers **ไม่เกิน 8 บรรทัด**  
ห้ามสมมุติจากแชท OpenCode ถ้าไม่มีใน `docs/`  
จบงานที่เปลี่ยนสถานะ → อัปเดต STATUS / OPEN_LOOPS · สลับ harness → เขียน handoff จาก [`docs/handoffs/TEMPLATE.md`](docs/handoffs/TEMPLATE.md)

## กฎสั้น

- Root เท่านั้น · plugin **project scope**
- Skill **`public-site-safe`**
- Agent ถาวรใช้ `memory: project` (harness) — ตรวจใน Lab 00 · ห้ามสร้าง memory bus เอง
- **ห้ามใช้ MCP เป็นท่อส่งงาน** Claude ↔ OpenCode · Cross-CLI เฉพาะ Lab 07 (skill `opencode` → `opencode run` headless · ท่อ = ไฟล์ใน `docs/`)
- **ห้าม commit `.env`** (ไฟล์จริงอยู่ใน root แล้ว) · PR เข้า learner repo เท่านั้น
- Swarm: หยุดเมื่อ done หรือครบ 20 turns
- STATUS/OPEN_LOOPS = single-writer · commit ก่อนสลับ harness

## Labs

ดู [`labs/README.md`](labs/README.md) · เริ่ม [`lab-00-project-init`](labs/lab-00-project-init/README.md)

---

## Commands (จาก /init — ส่วนที่ AGENTS.md ไม่มี)

- Test ไฟล์เดียว / เคสเดียว: `npx vitest run tests/smoke.test.ts -t "loads a profile"`  
  Lab test: `npx vitest run --config vitest.labs.config.ts tests/labs/lab05-api.test.ts`
- `npm run test:e2e` ไม่มี `webServer` ใน `playwright.config.ts` — ต้องรัน `npm run dev` (หรือ `npm start`) แยกไว้ก่อน
- CI (`.github/workflows/ci.yml`, Node 22): `npm ci` → `npm test` → `npm run build` — **ไม่**รัน `test:labs`
- `scripts/preflight.ps1` เช็คเครื่องมือ (node, git, gh, claude, opencode, bun)
- `npm run create-issues` สร้าง issue จาก `.github/course-issues/*.md` ผ่าน `gh` — ต้อง `gh repo set-default` ชี้ learner repo ก่อน
- ไฟล์ `.example` ที่ต้องคัดลอกใน Lab 00 มี `.claude/settings.json.example` เพิ่มจากรายการใน AGENTS.md

## Architecture

- **Astro SSR ทั้งเว็บ:** `output: 'server'` + `@astrojs/node` standalone · API routes ใน `src/pages/api/` ตั้ง `prerender = false` · layout เดียว `src/layouts/BaseLayout.astro` (nav + global CSS tokens ใน `:root`)
- **เนื้อหามาจาก `docs/PROFILE.md` ตอน runtime:** `src/lib/profile.ts` parse ตามหัวข้อ `## Name` / `## Headline` / `## Bio` / `## Audience` / `## Interests` (Interests = bullet list) — เปลี่ยนชื่อหัวข้อ = เว็บตกไปใช้ `FALLBACK` · Dockerfile จึง `COPY docs` เข้า runtime image · `/api/interests` อ่านจากที่เดียวกัน
- **SQLite (`src/lib/db.ts`, owner = OpenCode):** `getDb()` เป็น lazy singleton เปิด `$DATA_DIR/site.sqlite` (default `./data`, Docker = `/data` volume) และสร้างตาราง `contact_messages` / `guestbook` · `insertContact` / `listGuestbook` / `insertGuestbook` เป็น stub ที่ throw `NOT_IMPLEMENTED: ...`
- **สัญญา error ของ API:** route แปลง message ขึ้นต้น `NOT_IMPLEMENTED` → **501** · error อื่น → 400 (POST) / 500 (GET) · body = `{ error: err.message }` และ `contact.astro` / `guestbook.astro` แสดง `data.error` ให้ผู้ชมเห็นตรง ๆ
- **ข้อความคอร์สหลุดได้ 2 ทาง:** (1) markup — `tests/public-site.test.ts` สแกน `.astro`/`.html` ใต้ `src/` (ตัด frontmatter + HTML comment) หา `lab 0x` / `แล็บ`; (2) runtime — message ของ stub (`... — Lab 05 OpenCode`) ไหลผ่าน `data.error` ขึ้นหน้าเว็บ ซึ่ง test **ไม่จับ** → message ที่ throw จาก `db.ts` ต้องปลอดภัยต่อผู้ชม
- **Guestbook client** (`src/pages/guestbook.astro`) ต่อ HTML จากข้อมูล API ด้วย `innerHTML` — escape ก่อนถ้าแตะส่วนนี้
- **Native dependency:** `better-sqlite3@13` ไม่มี prebuilt binary → `npm install` compile ด้วย node-gyp · Windows ต้องมี VS Build Tools (workload "Desktop development with C++") + Python ที่ node-gyp หาเจอ (ตั้ง env `PYTHON` ได้) · Docker image ติดตั้ง `python3 make g++` ไว้แล้ว
