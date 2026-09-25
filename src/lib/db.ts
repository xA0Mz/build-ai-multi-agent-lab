/**
 * SQLite helpers for contact + guestbook (D8 · D9 · D11).
 * Connection is cached at module level — change DATA_DIR, then call getDb()
 * after deleting the cache if you need a re-init (see tests/labs/lab05-api.test.ts).
 */
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dir = process.env.DATA_DIR || join(process.cwd(), 'data');
  mkdirSync(dir, { recursive: true });
  db = new Database(join(dir, 'site.sqlite'));
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

// Limits per D9 (guestbook) — contact limits are provisional until a form opens.
const GUESTBOOK_NAME_MAX = 80;
const GUESTBOOK_MESSAGE_MAX = 500;
const CONTACT_NAME_MAX = 100;
const CONTACT_EMAIL_MAX = 254;
const CONTACT_MESSAGE_MAX = 2000;

/**
 * Error messages thrown here must stay safe for a public audience (D11):
 * short codes only — no paths, no stack, no internal wording.
 */
function trimField(value: unknown): string | null {
  return typeof value === 'string' ? value.trim() : null;
}

export function insertContact(input: {
  name: string;
  email: string;
  message: string;
}): ContactMessage {
  const name = trimField(input?.name);
  const email = trimField(input?.email);
  const message = trimField(input?.message);
  if (
    !name ||
    name.length > CONTACT_NAME_MAX ||
    !email ||
    email.length > CONTACT_EMAIL_MAX ||
    !email.includes('@') ||
    !message ||
    message.length > CONTACT_MESSAGE_MAX
  ) {
    throw new Error('VALIDATION_ERROR');
  }
  try {
    const database = getDb();
    const info = database
      .prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)')
      .run(name, email, message);
    const row = database
      .prepare('SELECT id, name, email, message, created_at FROM contact_messages WHERE id = ?')
      .get(Number(info.lastInsertRowid)) as ContactMessage | undefined;
    if (!row) throw new Error('DB_ERROR');
    return row;
  } catch (err) {
    if (err instanceof Error && err.message === 'VALIDATION_ERROR') throw err;
    throw new Error('DB_ERROR');
  }
}

/** Newest first — the guestbook UI prepends new entries visually. */
export function listGuestbook(): GuestbookEntry[] {
  try {
    const rows = getDb()
      .prepare('SELECT id, name, message, created_at FROM guestbook ORDER BY id DESC')
      .all() as GuestbookEntry[];
    return rows;
  } catch {
    throw new Error('DB_ERROR');
  }
}

export function insertGuestbook(input: {
  name: string;
  message: string;
}): GuestbookEntry {
  const name = trimField(input?.name);
  const message = trimField(input?.message);
  if (!name || name.length > GUESTBOOK_NAME_MAX || !message || message.length > GUESTBOOK_MESSAGE_MAX) {
    throw new Error('VALIDATION_ERROR');
  }
  try {
    const database = getDb();
    const info = database
      .prepare('INSERT INTO guestbook (name, message) VALUES (?, ?)')
      .run(name, message);
    const row = database
      .prepare('SELECT id, name, message, created_at FROM guestbook WHERE id = ?')
      .get(Number(info.lastInsertRowid)) as GuestbookEntry | undefined;
    if (!row) throw new Error('DB_ERROR');
    return row;
  } catch (err) {
    if (err instanceof Error && err.message === 'VALIDATION_ERROR') throw err;
    throw new Error('DB_ERROR');
  }
}
