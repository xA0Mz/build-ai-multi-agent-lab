/**
 * Profile helpers. Learners fill docs/PROFILE.md in Lab 01.
 * Owner = Frontend (Claude) per D12 in docs/DECISIONS.md.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export type InterestDetail = { title: string; description?: string };

export type Contact = { email?: string; github?: string };

export type Profile = {
  name: string;
  headline: string;
  bio: string;
  audience: string;
  /** Names only — /api/interests returns this as-is, keep it string[]. */
  interests: string[];
  interestDetails: InterestDetail[];
  contact: Contact;
};

/**
 * FALLBACK renders publicly when docs/PROFILE.md is missing or a section is
 * empty — keep it course-free and true (no scaffold text, no lab references);
 * learner hints belong in comments and docs, not in rendered fallback text.
 */
const FALLBACK: Profile = {
  name: 'xA0Mz',
  headline: 'Programmer ที่ทำงานคู่ AI',
  bio: 'สวัสดี! เราคือ xA0Mz โปรแกรมเมอร์ที่ชอบสร้างเว็บ เว็บแอป และ automation',
  audience: '',
  interests: ['Web development', 'Automation', 'AI agents'],
  interestDetails: [{ title: 'Web development' }, { title: 'Automation' }, { title: 'AI agents' }],
  contact: {},
};

/**
 * Only these `## ` headings are parsed. Anything else (`## Private`,
 * `## Brainstorm`, `## Tone`, …) never reaches the site.
 */
const SECTIONS = ['Name', 'Headline', 'Bio', 'Audience', 'Interests', 'Contact'] as const;
type Section = (typeof SECTIONS)[number];

const CONTACT_KEYS = ['email', 'github'] as const;

/** Values like `—` or `-` in PROFILE mean "not set". */
const isEmptyValue = (v: string) => !v || /^[-–—]+$/.test(v);

function splitSections(raw: string): Partial<Record<Section, string>> {
  const out: Partial<Record<Section, string>> = {};
  let current: Section | null = null;
  let buf: string[] = [];
  const flush = () => {
    if (current && !(current in out)) out[current] = buf.join('\n').trim();
  };
  for (const line of raw.split('\n')) {
    const heading = line.match(/^##(?!#)\s*(.+?)\s*$/);
    if (heading) {
      flush();
      current = (SECTIONS as readonly string[]).includes(heading[1]) ? (heading[1] as Section) : null;
      buf = [];
    } else if (current) {
      buf.push(line);
    }
  }
  flush();
  return out;
}

const bullets = (text = '') =>
  text
    .split('\n')
    .map((l) => l.replace(/^\s*[-*]\s*/, '').trim())
    .filter(Boolean);

/** Split a section into paragraphs on blank lines. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function parseProfile(raw: string): Profile {
  const s = splitSections(raw.replace(/\r\n/g, '\n'));

  const interestDetails: InterestDetail[] = bullets(s.Interests).map((item) => {
    const i = item.indexOf(': ');
    if (i === -1) return { title: item };
    const description = item.slice(i + 2).trim();
    return description ? { title: item.slice(0, i).trim(), description } : { title: item.slice(0, i).trim() };
  });

  const contact: Contact = {};
  for (const item of bullets(s.Contact)) {
    const m = item.match(/^(\w+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase() as (typeof CONTACT_KEYS)[number];
    const value = m[2].trim();
    if ((CONTACT_KEYS as readonly string[]).includes(key) && !isEmptyValue(value)) contact[key] = value;
  }

  const hasInterests = interestDetails.length > 0;
  return {
    name: s.Name || FALLBACK.name,
    headline: s.Headline || FALLBACK.headline,
    bio: s.Bio || FALLBACK.bio,
    audience: s.Audience || FALLBACK.audience,
    interests: hasInterests ? interestDetails.map((d) => d.title) : FALLBACK.interests,
    interestDetails: hasInterests ? interestDetails : FALLBACK.interestDetails,
    contact,
  };
}

function profilePath(): string {
  const candidates = [
    join(process.cwd(), 'docs', 'PROFILE.md'),
    join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs', 'PROFILE.md'),
  ];
  return candidates.find((p) => existsSync(p)) || candidates[0];
}

export function loadProfile(): Profile {
  const path = profilePath();
  if (!existsSync(path)) return FALLBACK;
  return parseProfile(readFileSync(path, 'utf8'));
}
