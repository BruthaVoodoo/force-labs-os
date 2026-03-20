import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

const MODEL_METADATA: Record<string, { display: string; provider: string; contextWindow: number }> = {
  'claude-haiku-4-5':              { display: 'Claude Haiku 4.5',  provider: 'Anthropic', contextWindow: 200000 },
  'claude-sonnet-4-6':             { display: 'Claude Sonnet 4.6', provider: 'Anthropic', contextWindow: 200000 },
  'claude-opus-4':                 { display: 'Claude Opus 4',     provider: 'Anthropic', contextWindow: 200000 },
  'gpt-5.4':                       { display: 'GPT-5.4',           provider: 'OpenAI',    contextWindow: 128000 },
  'gpt-4o':                        { display: 'GPT-4o',            provider: 'OpenAI',    contextWindow: 128000 },
  'gemini-3-flash':                { display: 'Gemini 3 Flash',    provider: 'Google',    contextWindow: 1048576 },
  'gemini-3.1-pro-preview':        { display: 'Gemini 3.1 Pro',    provider: 'Google',    contextWindow: 1048576 },
  'opencode/claude-haiku-4-5':     { display: 'Claude Haiku 4.5',  provider: 'Anthropic', contextWindow: 200000 },
  'opencode/claude-sonnet-4-6':    { display: 'Claude Sonnet 4.6', provider: 'Anthropic', contextWindow: 200000 },
  'opencode/gpt-5.4':              { display: 'GPT-5.4',           provider: 'OpenAI',    contextWindow: 128000 },
  'google/gemini-3-flash':         { display: 'Gemini 3 Flash',    provider: 'Google',    contextWindow: 1048576 },
  'google/gemini-3.1-pro-preview': { display: 'Gemini 3.1 Pro',    provider: 'Google',    contextWindow: 1048576 },
  'ollama/llama3.2:3b':            { display: 'Llama 3.2 3B',      provider: 'Ollama',    contextWindow: 128000 },
};

function getModelMeta(modelKey: string) {
  if (MODEL_METADATA[modelKey]) return MODEL_METADATA[modelKey];
  const match = Object.keys(MODEL_METADATA).find(k =>
    modelKey.endsWith(k.replace(/^[^/]+\//, ''))
  );
  if (match) return MODEL_METADATA[match];
  const provider = modelKey.split('/')[0] || 'Unknown';
  const name = modelKey.split('/').pop() || modelKey;
  return { display: name, provider, contextWindow: 0 };
}

function readJson(filePath: string) {
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

// Parse agent display name from IDENTITY.md in the workspace
function getAgentDisplayName(workspacePath: string): string | null {
  try {
    const identityPath = path.join(workspacePath, 'IDENTITY.md');
    if (!existsSync(identityPath)) return null;
    const content = readFileSync(identityPath, 'utf-8');
    const match = content.match(/\*\*Name:\*\*\s*(.+)/);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

// Translate absolute paths from the host to the container's mount point
function translatePath(filePath: string, base: string): string {
  // The sessionFile stored in JSON is an absolute host path like /Users/openclaw/.openclaw/...
  // Inside Docker it's mounted at /root/.openclaw/... so we rewrite the prefix
  const hostPrefix = /^(\/Users\/[^/]+|\/home\/[^/]+)(\/\.openclaw\/)/;
  return filePath.replace(hostPrefix, `${base}/`);
}

// Read the last usage entry from the session JSONL file
function getSessionUsage(sessionFile: string, base: string): number {
  const resolvedPath = translatePath(sessionFile, base);
  try {
    if (!existsSync(resolvedPath)) return 0;
    const content = readFileSync(resolvedPath, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    // Scan from the end to find the last usage entry
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const entry = JSON.parse(lines[i]);
        const usage = entry.usage ?? entry.message?.usage;
        if (usage?.totalTokens) {
          return usage.totalTokens;
        }
      } catch {
        continue;
      }
    }
    return 0;
  } catch {
    return 0;
  }
}

const ACTIVE_THRESHOLD_MS  = 60 * 1000;       // < 1 min  → active
const IDLE_THRESHOLD_MS    = 30 * 60 * 1000;  // < 30 min → idle, else sleeping

function deriveStatus(updatedAt: number): 'active' | 'idle' | 'sleeping' {
  const ageMs = Date.now() - updatedAt;
  if (ageMs < ACTIVE_THRESHOLD_MS) return 'active';
  if (ageMs < IDLE_THRESHOLD_MS)   return 'idle';
  return 'sleeping';
}

export async function GET() {
  try {
    const base = path.join(homedir(), '.openclaw');
    const config = readJson(path.join(base, 'openclaw.json'));
    if (!config) throw new Error('Cannot read OpenClaw config');

    const agentsCfg = config.agents || {};
    const defaultModelKey = agentsCfg?.defaults?.model?.primary || 'opencode/claude-haiku-4-5';
    const agentList: any[] = agentsCfg?.list || [];

    const agentIds = ['main', ...agentList.filter((a: any) => a.id !== 'main').map((a: any) => a.id)];

    const agents = agentIds.map((agentId) => {
      const cfg = agentList.find((a: any) => a.id === agentId);
      const configModelKey = cfg?.model || defaultModelKey;

      const sessionsPath = path.join(base, 'agents', agentId, 'sessions', 'sessions.json');
      const sessions = readJson(sessionsPath);
      const mainSession = sessions?.[`agent:${agentId}:main`];

      const activeModelKey = mainSession?.model
        ? `opencode/${mainSession.model}`
        : configModelKey;

      const meta = getModelMeta(activeModelKey);
      // Resolve display name: IDENTITY.md > config name > agentId
      const workspace = cfg?.workspace
        ?? (agentId === 'main' ? path.join(homedir(), 'ai-workspace') : null);
      const identityName = workspace ? getAgentDisplayName(workspace) : null;
      const configName = cfg?.name
        ? cfg.name.charAt(0).toUpperCase() + cfg.name.slice(1)
        : null;
      const name = identityName ?? configName ?? agentId.charAt(0).toUpperCase() + agentId.slice(1);

      const tokenCount = mainSession?.sessionFile
        ? getSessionUsage(mainSession.sessionFile, base)
        : 0;

      const status = mainSession?.updatedAt
        ? deriveStatus(mainSession.updatedAt)
        : 'sleeping';

      return {
        agentId,
        name,
        sessions: [
          {
            key: `agent:${agentId}:main`,
            status,
            model: meta.display,
            provider: meta.provider,
            contextWindow: meta.contextWindow,
            tokenCount,
          },
        ],
      };
    });

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Error reading agent data:', error);
    return NextResponse.json({ error: 'Failed to read agent data' }, { status: 500 });
  }
}
