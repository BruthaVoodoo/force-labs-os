import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const BRIEFS_FILE = path.join(process.cwd(), 'data', 'brain-briefs.json');

export async function GET() {
  try {
    const raw = await fs.readFile(BRIEFS_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const required = ['id', 'date', 'title', 'content'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const raw = await fs.readFile(BRIEFS_FILE, 'utf-8').catch(() => '[]');
    const briefs = JSON.parse(raw);

    if (briefs.find((b: { id: string }) => b.id === body.id)) {
      return NextResponse.json({ error: 'Duplicate id' }, { status: 409 });
    }

    briefs.unshift(body); // newest first
    await fs.writeFile(BRIEFS_FILE, JSON.stringify(briefs, null, 2), 'utf-8');

    return NextResponse.json(body, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
