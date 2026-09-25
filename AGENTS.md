# Agents — Build AI Multi-Agent Lab (V4)

กติการ่วมสำหรับ **Claude Code** และ **OpenCode** (`CLAUDE.md` ทำ `@AGENTS.md` — ไฟล์นี้ต้องพอสำหรับทั้งสอง CLI)  
สินค้า = เว็บ personal branding (Astro SSR) ใน root นี้ · ภาษาเอกสาร = ไทยปนอังกฤษ

## คำสั่ง (ตรวจแล้วจาก `package.json`)

```powershell
npm install        # Node >=22.12.0 จำเป็น · template ไม่มี node_modules
npm run dev        # Astro dev บน 127.0.0.1:4321
npm test           # vitest — tests/** เท่านั้น (ไม่รวม tests/labs)
npm run test:labs  # vitest.labs.config.ts — tests/labs/** เท่านั้น
npm run test:e2e   # Playwright — testDir ./playwright · ต้องรัน dev server ก่อน (baseURL 127.0.0.1:4321, ทับด้วย PLAYWRIGHT_BASE_URL)
npm run build && npm start   # start = node dist/server/entry.mjs — ต้อง build ก่อนเสมอ
node scripts/create-course-issues.mjs   # = npm run create-issues
```

- **`test:labs` ต้อง RED ตอนเทมเพลตสด** — stub ใน `src/lib/db.ts` (`insertContact` / guestbook) โยน `NOT_IMPLEMENTED` จงใจ รอ Lab 05 (OpenCode) implement อย่า "แก้ให้ผ่าน" นอก Lab 05
- ไม่มี lint/typecheck script แยก — verification = `npm test` + `npm run test:labs`

## สถาปัตยกรรม / gotchas

- **Astro SSR ไม่ใช่ static** — `output: 'server'` + `@astrojs/node` standalone (`astro.config.mjs`) · dev ล็อกพอร์ต 4321
- **SQLite ผ่าน `DATA_DIR`** (default `./data`) สร้างเองตอนรัน · `src/lib/db.ts` cache connection ไว้ระดับ module — แก้ `DATA_DIR` หลัง import แล้วต้องเรียก `getDb()` ให้ re-init ตามแบบ `tests/labs/lab05-api.test.ts`
- **Leak-guard test** (`tests/public-site.test.ts`): ห้ามมีคำ "Lab/แล็บ" ใน markup ที่ render (`*.astro`/`*.html` ใน `src/`) — ผู้ชมต้องเห็นเว็บส่วนตัว ไม่ใช่ scaffold คอร์ส · อ้าง Lab ได้เฉพาะคอมเมนต์โค้ด / PR / docs
- ไฟล์ config บางตัวมาเป็น **`.example`** — ต้อง copy ใน Lab 00: `.env.example → .env` · `opencode.json.example → opencode.json` · `.mcp.json.example → .mcp.json` · `docs/STATUS.md.example → docs/STATUS.md` · `docs/OPEN_LOOPS.md.example` เช่นกัน
- `package.json` มี `allowScripts` (esbuild + better-sqlite3) — native build ต้องอนุญาต อย่าลบ
- `SITE_URL` ใน `.env` กำหนด `site` ของ Astro config ด้วย

## หลัง Lab 00: `/init` แล้ว **merge** — อย่าลบ Ownership / สี่เสา / Native harness

## สี่เสาหลัก

1. **Multi-Agent** — หน้าที่และความจำแยก (`.claude/agents/`, `.opencode/agents/` + คนละ CLI)
2. **Sub-Agent** — spawn ใช้แล้วทิ้ง; สิ่งที่ต้องจำต่อ = เขียนลง `docs/` เท่านั้น
3. **การประสานงาน** — handoff ผ่าน docs / issues / PR / review สำคัญกว่าแชท
4. **Swarm** — หลายตัวได้; **เพดาน 20 turns** แล้วหยุดสรุปช่องว่าง (Lab 05b)

ใช้ skill **`public-site-safe`** (มีทั้งใน `.claude/skills/` และ `.opencode/skills/`) ทุกงาน implement / swarm / ship

## Start-of-session (≤ 8 บรรทัด)

1. อ่าน `docs/STATUS.md` + `docs/OPEN_LOOPS.md` (ยังไม่มี = copy จาก `.example`)
2. มี handoff ล่าสุดใน `docs/handoffs/` ที่ส่งถึงคุณ — อ่านด้วย (template: `docs/handoffs/TEMPLATE.md`)
3. สรุป: Current goal · Latest D-id · Open loops · Blockers — ไม่เกิน 8 บรรทัด
4. ข้อมูลขัดแย้งระหว่างไฟล์ — หยุดวิเคราะห์ก่อนแก้โค้ด
5. **ห้าม**สมมุติสิ่งที่เกิดในแชทอีกฝั่ง ถ้าไม่มีเขียนใน `docs/`

จบงานที่เปลี่ยนสถานะ → อัปเดต STATUS / OPEN_LOOPS · สลับ harness → เขียน handoff

## Single-writer + Ownership

- `docs/STATUS.md` / `docs/OPEN_LOOPS.md` — **writer คนเดียวต่อรอบ** สลับ Claude ↔ OpenCode หลัง commit หรือหลังเขียน handoff
- `DEBATE.md` = proposed (ยังไม่ปิด) · `DECISIONS.md` = approved เท่านั้น
- reviewer อ่านอย่างเดียวจนกว่า handoff จะโอนงานชัด

| Artifact | Owner |
|---|---|
| UI (`src/pages/*.astro`, `src/layouts/`) | Claude · agent `frontend` |
| API + SQLite (`src/lib/db.ts`, `src/pages/api/*`) | OpenCode · agent `backend` |
| E2E / a11y (`docs/QA.md`) | Playwright MCP + either CLI |
| Profile / debate docs | Claude (Lab 01–02 · subagents) |
| Hot state (STATUS / OPEN_LOOPS) | ผู้ถืองานรอบนั้น |
| Handoffs | ผู้ส่งงานก่อนสลับ harness |
| Review / Ship (`docs/SHIP.md`) | Lab 07 / Lab 08 |

## Harness persistent memory

| Harness | ใช้อะไร |
|---|---|
| Claude Code | `memory: project` → `.claude/agent-memory/<name>/` · auto memory ผ่าน `/memory` |
| OpenCode | `AGENTS.md` + agent file + **resume session** |

- ความจำร่วม = `docs/` — สิ่งที่ต้องข้ามคน/CLI ให้เขียนลง docs ไม่ใช่ agent-local memory
- Adapter (`AGENTS.md` / `CLAUDE.md`) ชี้ไปไฟล์กลางเท่านั้น — **ไม่คัดลอก**เนื้อหา STATUS/DECISIONS ซ้ำ

## Call ข้าม harness

- ฝั่ง OpenCode เรียก `claude -p` · ฝั่ง Claude เรียก `opencode run` (headless one-shot · ท่อ = ไฟล์ใน `docs/`)
- ฝั่งที่ถูกเรียกเขียนได้**เฉพาะไฟล์รายงาน**ที่ prompt ระบุ (เช่น `docs/review-*.md`) — ห้ามแตะไฟล์ ownership ของผู้เรียก
- อย่าให้สอง harness เขียน working tree พร้อมกัน — commit ก่อน
- **ห้าม**สร้างท่อส่งงาน/daemon เอง (JSON bus, loop ถาวร) · MCP = งานผลิต ไม่ใช่ท่อระหว่าง CLI
- Plugins project scope: superpowers (oh-my-openagent ยังไม่รองรับ OpenCode v2 — ใช้ native agents)

## Workflow

```text
00 Init → 01 Interview → 02 Debate → 03 Issues → 04 FE → 05 BE → 05b Swarm(≤20) → 06 QA → 07 Review → 08 Ship
```

## ห้าม

- Commit `.env`, PAT, Coolify webhook, `node_modules` — `.env` จริงมี PAT อยู่ข้างในแล้ว ระวังเป็นพิเศษ
- เคลม deploy สำเร็จโดยไม่มี URL 200 จริง
- บังคับ tmux บน Windows (Agent Teams ใช้ in-process)
- PR เข้า `Onto-IQ/*` — เข้า learner repo เท่านั้น
- ปล่อย swarm เกิน 20 turns โดยไม่สรุปหยุด

## Labs

[`SETUP.md`](./SETUP.md) → [`labs/lab-00-project-init`](./labs/lab-00-project-init/README.md) → [`labs/README.md`](./labs/README.md)
