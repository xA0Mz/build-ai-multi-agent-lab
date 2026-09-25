# Guestbook — ขั้นตอนลบโพสต์ด้วยมือ (สำรอง)

> ตาม D10: ไม่มีหน้า admin — การลบโพสต์ใช้ kill switch ปิดรับชั่วคราว + ลบที่ DB ด้วยมือ  
> image ที่ deploy ไม่มี `sqlite3` CLI จึงต้องใช้ `node -e` ผ่าน `better-sqlite3` ที่ติดมากับแอป

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

```bash
# ดูโพสต์ล่าสุดก่อน (ยืนยัน id ที่จะลบ)
node -e "const db=require('better-sqlite3')(process.env.DATA_DIR||'data/site.sqlite');console.log(JSON.stringify(db.prepare('SELECT id,name,created_at FROM guestbook ORDER BY id DESC LIMIT 20').all()))"

# ลบโพสต์เดียว
node -e "const db=require('better-sqlite3')(process.env.DATA_DIR||'data/site.sqlite');console.log(db.prepare('DELETE FROM guestbook WHERE id=?').run(<ID>))"

# ลบหลายโพสต์ติดกัน (เช่น spam id 12–18)
node -e "const db=require('better-sqlite3')(process.env.DATA_DIR||'data/site.sqlite');console.log(db.prepare('DELETE FROM guestbook WHERE id BETWEEN ? AND ?').run(12,18))"
```

`run()` คืน `{ changes }` — `changes: 1` = ลบแล้ว 1 แถว

## 3. เปิดรับคืน

เอา `GUESTBOOK_ENABLED=false` ออก (หรือตั้งค่าอื่น) แล้ว restart · ตรวจ: `curl -s -X POST ... /api/guestbook` ด้วย honeypot ว่างควรได้ 201

## หมายเหตุ

- ไม่ต้อง rebuild — kill switch อ่าน `process.env` ตอน runtime ทุก request (D10)
- ถ้าลบแล้วหน้าเว็บยังเห็นของเก่า กด reload ที่ list ใหม่ของ UI (GET ทุกครั้งไม่มี cache)
- `contact_messages` ไม่มีทางเข้าจากสาธารณะ (`/api/contact` ตอบ 410 ตาม D8) — ลบได้ด้วย pattern เดียวกันถ้าจำเป็น
