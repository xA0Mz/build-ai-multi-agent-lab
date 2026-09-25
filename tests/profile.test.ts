import { describe, it, expect } from 'vitest';
import { loadProfile, parseProfile, paragraphs } from '../src/lib/profile';

// D12: parser must keep multi-line sections and whitelist headings.
const FIXTURE = `# PROFILE

## Name
tester

## Headline
Line one headline

## Bio
First paragraph.

Second paragraph
continues here.

Third paragraph.

## Audience
Someone

## Interests
- Web development: building sites
- Automation
- AI agents / multi-agent: agents working together

## Contact
- email: user@example.org
- github: https://github.com/tester
- linkedin: —

## Private (ไม่แสดงบนเว็บ)
- SECRET_PRIVATE_SENTINEL

## Brainstorm
- Must: SECRET_BRAINSTORM_SENTINEL
`;

describe('parseProfile (D12)', () => {
  const p = parseProfile(FIXTURE);

  it('keeps every Bio paragraph', () => {
    expect(paragraphs(p.bio)).toEqual([
      'First paragraph.',
      'Second paragraph\ncontinues here.',
      'Third paragraph.',
    ]);
  });

  it('interests are names only (nothing after ": ")', () => {
    expect(p.interests).toEqual(['Web development', 'Automation', 'AI agents / multi-agent']);
    for (const i of p.interests) expect(i).not.toContain(': ');
  });

  it('interestDetails split on the first ": "', () => {
    expect(p.interestDetails).toEqual([
      { title: 'Web development', description: 'building sites' },
      { title: 'Automation' },
      { title: 'AI agents / multi-agent', description: 'agents working together' },
    ]);
  });

  it('contact keeps email + github only and drops empty values', () => {
    expect(p.contact).toEqual({ email: 'user@example.org', github: 'https://github.com/tester' });
  });

  it('does not leak Private / Brainstorm sections', () => {
    const json = JSON.stringify(p);
    expect(json).not.toContain('SECRET_PRIVATE_SENTINEL');
    expect(json).not.toContain('SECRET_BRAINSTORM_SENTINEL');
  });

  it('does not treat ### subheadings as section breaks', () => {
    const q = parseProfile('## Bio\nIntro\n\n### Sub\nMore\n\n## Name\nx');
    expect(q.bio).toContain('More');
    expect(q.name).toBe('x');
  });
});

describe('loadProfile against docs/PROFILE.md', () => {
  const p = loadProfile();

  it('returns the full Bio and all three interests', () => {
    expect(paragraphs(p.bio).length).toBeGreaterThan(1);
    expect(p.interests).toHaveLength(3);
    expect(p.interestDetails).toHaveLength(3);
  });

  it('does not contain Private / Brainstorm content', () => {
    const json = JSON.stringify(p);
    expect(json).not.toContain('Must:');
    expect(json).not.toContain('Avoid:');
    expect(json).not.toContain('ชื่อจริง');
  });
});
