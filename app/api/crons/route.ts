import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import path from 'path';
import cronstrue from 'cronstrue';

function readJson(filePath: string) {
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function formatSchedule(schedule: any): string {
  if (!schedule) return 'Unknown';
  if (schedule.kind === 'cron') {
    try {
      return cronstrue.toString(schedule.expr, { use24HourTimeFormat: false });
    } catch {
      return schedule.expr;
    }
  }
  if (schedule.kind === 'every') {
    const ms = schedule.everyMs;
    if (ms < 60000)        return `Every ${ms / 1000} seconds`;
    if (ms < 3600000)      return `Every ${ms / 60000} minutes`;
    if (ms < 86400000)     return `Every ${ms / 3600000} hours`;
    return `Every ${ms / 86400000} days`;
  }
  if (schedule.kind === 'at') {
    const d = new Date(schedule.at);
    return `Once — ${d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`;
  }
  return 'Unknown';
}

function deriveStatus(state: any, enabled: boolean): 'ok' | 'error' | 'running' | 'disabled' {
  if (!enabled) return 'disabled';
  if (!state)   return 'ok';
  if (state.consecutiveErrors > 0) return 'error';
  return state.lastRunStatus === 'ok' ? 'ok' : (state.lastRunStatus || 'ok');
}

export async function GET() {
  try {
    const jobsPath = path.join(homedir(), '.openclaw', 'cron', 'jobs.json');
    const data = readJson(jobsPath);

    if (!data?.jobs) {
      return NextResponse.json({ jobs: [] });
    }

    const jobs = data.jobs.map((job: any) => ({
      id:               job.id,
      name:             job.name || job.id,
      enabled:          job.enabled,
      schedule:         formatSchedule(job.schedule),
      scheduleRaw:      job.schedule?.expr ?? null,
      tz:               job.schedule?.tz ?? null,
      status:           deriveStatus(job.state, job.enabled),
      lastRunAt:        job.state?.lastRunAtMs       ?? null,
      nextRunAt:        job.state?.nextRunAtMs        ?? null,
      lastDurationMs:   job.state?.lastDurationMs    ?? null,
      lastRunStatus:    job.state?.lastRunStatus      ?? null,
      consecutiveErrors: job.state?.consecutiveErrors ?? 0,
      lastDeliveryStatus: job.state?.lastDeliveryStatus ?? null,
      lastError:        job.state?.lastError            ?? null,
      payloadKind:      job.payload?.kind              ?? null,
      sessionTarget:    job.sessionTarget            ?? null,
      agentId:          job.agentId                  ?? null,
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error reading cron jobs:', error);
    return NextResponse.json({ error: 'Failed to read cron jobs' }, { status: 500 });
  }
}
