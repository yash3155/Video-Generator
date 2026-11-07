// src/orchestrator/executionLedger.mjs
/**
 * Execution Ledger and Telemetry for Token-Efficient Microkernel
 * Records exact token metrics, engine provenance, cache hits,
 * and tracks quantifiable token savings.
 */

import fs from 'node:fs';
import path from 'node:path';

const TELEMETRY_DIR = path.resolve(process.cwd(), 'reports', 'telemetry');
const LEDGER_FILE = path.join(TELEMETRY_DIR, 'execution_ledger.jsonl');

/**
 * Appends a structured telemetry record to the execution ledger.
 * @param {object} entry
 */
export function recordExecution(entry) {
  try {
    fs.mkdirSync(TELEMETRY_DIR, { recursive: true });
    const record = {
      timestamp: new Date().toISOString(),
      runId: entry.runId || `run_${Date.now()}`,
      chapterKey: entry.chapterKey || 'general',
      taskId: entry.taskId || `task_${Date.now()}`,
      category: entry.category,
      engine: entry.engine,
      model: entry.model || 'none',
      inputTokens: entry.inputTokens || 0,
      outputTokens: entry.outputTokens || 0,
      totalTokens: (entry.inputTokens || 0) + (entry.outputTokens || 0),
      durationMs: entry.durationMs || 0,
      costUsd: entry.costUsd || 0,
      status: entry.status || 'SUCCESS',
      cacheHit: Boolean(entry.cacheHit),
      avoidableLlmCall: Boolean(entry.avoidableLlmCall),
      savingsVsLegacyTokens: entry.savingsVsLegacyTokens || 0
    };

    fs.appendFileSync(LEDGER_FILE, JSON.stringify(record) + '\n', 'utf8');
    return record;
  } catch (err) {
    console.warn(`⚠️ [LEDGER] Failed to write telemetry record: ${err.message}`);
    return null;
  }
}

/**
 * Computes live summary metrics from the execution ledger.
 */
export function getTelemetrySummary() {
  if (!fs.existsSync(LEDGER_FILE)) {
    return {
      totalRecords: 0,
      totalTokensUsed: 0,
      totalTokensSaved: 0,
      deterministicTaskCount: 0,
      clineTaskCount: 0,
      argonTaskCount: 0,
      flashTaskCount: 0,
      cacheHitCount: 0
    };
  }

  const lines = fs.readFileSync(LEDGER_FILE, 'utf8').trim().split('\n').filter(Boolean);
  let totalTokensUsed = 0;
  let totalTokensSaved = 0;
  let deterministicTaskCount = 0;
  let clineTaskCount = 0;
  let argonTaskCount = 0;
  let flashTaskCount = 0;
  let cacheHitCount = 0;

  lines.forEach((line) => {
    try {
      const rec = JSON.parse(line);
      totalTokensUsed += rec.totalTokens || 0;
      totalTokensSaved += rec.savingsVsLegacyTokens || 0;
      if (rec.cacheHit) cacheHitCount++;
      if (rec.engine === 'deterministic') deterministicTaskCount++;
      else if (rec.engine === 'cline') clineTaskCount++;
      else if (rec.engine?.includes('argon')) argonTaskCount++;
      else if (rec.engine?.includes('flash')) flashTaskCount++;
    } catch {}
  });

  return {
    totalRecords: lines.length,
    totalTokensUsed,
    totalTokensSaved,
    deterministicTaskCount,
    clineTaskCount,
    argonTaskCount,
    flashTaskCount,
    cacheHitCount
  };
}

