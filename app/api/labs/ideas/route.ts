import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const IDEAS_FILE = path.join(process.cwd(), 'data', 'labs-ideas.json');

export async function GET() {
  try {
    const raw = await fs.readFile(IDEAS_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    const required = ['id', 'kind', 'title', 'subtitle', 'description', 'status', 'tags'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const raw = await fs.readFile(IDEAS_FILE, 'utf-8').catch(() => '[]');
    const ideas = JSON.parse(raw);

    // Prevent duplicate IDs
    if (ideas.find((i: { id: string }) => i.id === body.id)) {
      return NextResponse.json({ error: 'Duplicate id' }, { status: 409 });
    }

    const newCard = {
      ...body,
      sandboxPath: body.sandboxPath ?? '/sandbox/idea-placeholder/index.html',
      createdAt: body.createdAt ?? new Date().toISOString(),
      source: 'revan-nightly',
    };

    ideas.unshift(newCard); // newest first
    await fs.writeFile(IDEAS_FILE, JSON.stringify(ideas, null, 2), 'utf-8');

    return NextResponse.json(newCard, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const raw = await fs.readFile(IDEAS_FILE, 'utf-8');
    const ideas = JSON.parse(raw);
    const idx = ideas.findIndex((i: { id: string }) => i.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    ideas[idx] = { ...ideas[idx], status };
    await fs.writeFile(IDEAS_FILE, JSON.stringify(ideas, null, 2), 'utf-8');

    return NextResponse.json(ideas[idx]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
