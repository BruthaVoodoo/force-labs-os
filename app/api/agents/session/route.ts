import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

function readJson(filePath: string) {
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function translatePath(filePath: string, base: string): string {
  const hostPrefix = /^(\/Users\/[^/]+|\/home\/[^/]+)(\/\.openclaw\/)/;
  return filePath.replace(hostPrefix, `${base}/`);
}

function extractText(content: any[]): string {
  if (!Array.isArray(content)) return '';
  return content
    .filter((c: any) => c.type === 'text')
    .map((c: any) => c.text || '')
    .join('');
}

function parseSessionMessages(sessionFile: string, base: string, limit = 40) {
  const resolved = translatePath(sessionFile, base);
  try {
    if (!existsSync(resolved)) return [];
    const raw = readFileSync(resolved, 'utf-8');
    const lines = raw.trim().split('\n').filter(Boolean);

    const messages: any[] = [];
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.type !== 'message') continue;
        const msg = entry.message;
        if (!msg?.role) continue;

        const text = extractText(Array.isArray(msg.content) ? msg.content : []);
        const hasToolCalls = Array.isArray(msg.content) &&
          msg.content.some((c: any) => c.type === 'toolCall' || c.type === 'toolResult');

        // Skip messages with no text content (pure tool calls)
        if (!text && !hasToolCalls) continue;

        messages.push({
          id: entry.id,
          role: msg.role,
          text: text || (hasToolCalls ? '[Tool calls]' : ''),
          hasToolCalls,
          usage: msg.usage ?? null,
          timestamp: entry.timestamp ?? null,
        });
      } catch {
        continue;
      }
    }

    // Return last N messages
    return messages.slice(-limit);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('agentId');

  if (!agentId) {
    return NextResponse.json({ error: 'agentId is required' }, { status: 400 });
  }

  try {
    const base = path.join(homedir(), '.openclaw');
    const sessionsPath = path.join(base, 'agents', agentId, 'sessions', 'sessions.json');
    const sessions = readJson(sessionsPath);
    const mainSession = sessions?.[`agent:${agentId}:main`];

    if (!mainSession) {
      return NextResponse.json({ error: 'No session found' }, { status: 404 });
    }

    const messages = mainSession.sessionFile
      ? parseSessionMessages(mainSession.sessionFile, base)
      : [];

    return NextResponse.json({
      sessionKey: `agent:${agentId}:main`,
      model: mainSession.model ?? null,
      channel: mainSession.lastChannel ?? mainSession.deliveryContext?.channel ?? null,
      updatedAt: mainSession.updatedAt ?? null,
      compactionCount: mainSession.compactionCount ?? 0,
      messages,
    });
  } catch (error) {
    console.error('Error reading session:', error);
    return NextResponse.json({ error: 'Failed to read session' }, { status: 500 });
  }
}
