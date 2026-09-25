# Guestbook — ขั้นตอนลบโพสต์ด้วยมือ (สำรอง)

> ตาม D10: ไม่มีหน้า admin — การลบโพสต์ใช้ kill switch ปิดรับชั่วคราว + ลบที่ DB ด้วยมือ  
> image ที่ deploy ไม่มี `sqlite3` CLI จึงต้องใช้ `node -e` ผ่าน `better-sqlite3` ที่ติดมากับแอป  
> คำสั่งในหัวข้อ 2 ทดสอบกับ DB ชั่วคราวแล้ว 2026-09-25 (หลักฐาน: `docs/review-opencode-rebuttal.md` › Verification)

## 0. ปิดรับก่อน (กันโพสต์ใหม่ระหว่างลบ)

ตั้ง env `GUESTBOOK_ENABLED=false` ใน Coolify (หรือที่รัน process) แล้ว restart  
ตรวจว่าปิดจริง: `curl -s https://<site>/api/guestbook` ต้องได้ `{"entries":[]}` (HTTP 200)

## 1. หา container แล้ว exec เข้าไป

```bash
docker ps                                # หา container ของเว็บ
docker exec -it <container> sh
```

## 2. ลบผ่าน better-sqlite3 (node -e)

ตำแหน่งไฟล์ DB = `$DATA_DIR/site.sqlite` (default `./data/site.sqlite` เทียบ working dir ของ process)

**สำคัญ:** `DATA_DIR` เป็น**โฟลเดอร์** (Dockerfile ตั้ง `ENV DATA_DIR=/data`) ไม่ใช่ path ไฟล์ — ทุกคำสั่งจึงต่อชื่อไฟล์ด้วย `path.join(process.env.DATA_DIR||'data','site.sqlite')` และใช้ `fileMustExist:true` เพื่อให้ path ผิดแล้ว error ทันที แทนที่จะสร้างไฟล์ DB ว่างขึ้นมาเงียบ ๆ · คำสั่งพิมพ์ path ที่เปิดออกมาบรรทัดแรกเสมอ ให้เช็กว่าตรงที่คาดก่อนเชื่อผลลัพธ์

```bash
# ดูโพสต์ล่าสุดก่อน (ยืนยัน id ที่จะลบ · เห็นข้อความย่อ 60 ตัวอักษรแรกด้วย)
node -e "const p=require('path').join(process.env.DATA_DIR||'data','site.sqlite');const db=require('better-sqlite3')(p,{fileMustExist:true});console.log(p, JSON.stringify(db.prepare('SELECT id,name,substr(message,1,60) AS message_preview,created_at FROM guestbook ORDER BY id DESC LIMIT 20').all()))"

# สำรองไฟล์ DB ก่อนลบ (ใน container: DATA_DIR=/data อยู่แล้ว)
cp "${DATA_DIR:-data}/site.sqlite" "${DATA_DIR:-data}/site.sqlite.bak"

# ลบโพสต์เดียว
node -e "const p=require('path').join(process.env.DATA_DIR||'data','site.sqlite');const db=require('better-sqlite3')(p,{fileMustExist:true});console.log(p, JSON.stringify(db.prepare('DELETE FROM guestbook WHERE id=?').run(<ID>)))"

# ลบหลายโพสต์ติดกัน (เช่น spam id 12–18)
node -e "const p=require('path').join(process.env.DATA_DIR||'data','site.sqlite');const db=require('better-sqlite3')(p,{fileMustExist:true});console.log(p, JSON.stringify(db.prepare('DELETE FROM guestbook WHERE id BETWEEN ? AND ?').run(12,18)))"
```

`run()` คืน `{ changes }` — `changes: 1` = ลบแล้ว 1 แถว · ถ้า `changes: 0` แปลว่าไม่มี id นั้น (เช็ก path ที่พิมพ์ออกมาและ id อีกครั้ง)

## 3. เปิดรับคืน

เอา `GUESTBOOK_ENABLED=false` ออก (หรือตั้งค่าอื่น) แล้ว restart · ตรวจสถานะโดย**ไม่สร้างโพสต์จริง**: ส่ง honeypot ที่ไม่ว่าง

```bash
curl -s -X POST https://<site>/api/guestbook -H 'content-type: application/json' \
  -d '{"name":"probe","message":"probe","website":"x"}'
```

ถ้าเปิดอยู่จะได้ **201** (honeypot ถูกทิ้งเงียบ ๆ ไม่ insert) · ถ้ายังปิดอยู่จะได้ **503** — ยืนยันสถานะได้เหมือนกันโดยไม่ทิ้งข้อมูลบนเว็บ

## หมายเหตุ

- ไม่ต้อง rebuild — kill switch อ่าน `process.env` ตอน runtime ทุก request (D10)
- ฝั่งเซิร์ฟเวอร์ GET อ่านจาก DB สดทุกครั้ง (ไม่มี cache ในแอป) — ถ้าหน้าเว็บยังเห็นของเก่าให้ reload ที่ list ใหม่ของ UI · ถ้ามี CDN คั่นหน้าอาจต้อง purge เอง (การตั้ง `cache-control: no-store` ที่ response เป็น follow-up ของรีวิว PR #14)
- `contact_messages` ไม่มีทางเข้าจากสาธารณะ (`/api/contact` ตอบ 410 ตาม D8) — ลบได้ด้วย pattern เดียวกันถ้าจำเป็น
