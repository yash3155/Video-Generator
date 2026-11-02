// src/qa/reportGenerator.mjs
import fs from 'node:fs';
import path from 'node:path';

/**
 * Generates structured JSON report.
 */
export function generateJsonReport(report, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
  return outputPath;
}

/**
 * Generates self-contained HTML report.
 */
export function generateHtmlReport(report, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const { chapter, course, domain, status, metrics, summary, findings, screenshots, generatedAt } = report;

  const statusBg =
    status === 'PASS'
      ? '#10B981'
      : status === 'CONDITIONAL_PASS'
        ? '#F59E0B'
        : '#EF4444';

  const statusLabel =
    status === 'PASS'
      ? 'RELEASE GATE: PASS'
      : status === 'CONDITIONAL_PASS'
        ? 'RELEASE GATE: CONDITIONAL PASS (OVERRIDE / REVIEW)'
        : 'RELEASE GATE: FAIL (BLOCKERS DETECTED)';

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'BLOCKER':
        return '<span class="badge badge-blocker">BLOCKER</span>';
      case 'HIGH':
        return '<span class="badge badge-high">HIGH</span>';
      case 'MEDIUM':
        return '<span class="badge badge-medium">MEDIUM</span>';
      case 'LOW':
      default:
        return '<span class="badge badge-low">LOW</span>';
    }
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QA Release Gate Report — ${chapter}</title>
  <style>
    :root {
      --bg: #F8FAFC;
      --card-bg: #FFFFFF;
      --border: #E2E8F0;
      --text-main: #0F172A;
      --text-muted: #64748B;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      margin: 0;
      padding: 32px 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .header-info h1 {
      margin: 0 0 6px 0;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .header-info p {
      margin: 0;
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 500;
    }
    .status-banner {
      background-color: ${statusBg};
      color: #FFFFFF;
      padding: 14px 20px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .metric-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .metric-title {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    .metric-value {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-main);
    }
    .section-title {
      font-size: 20px;
      font-weight: 800;
      margin: 32px 0 16px 0;
    }
    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow-x: auto;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      margin-bottom: 32px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      text-align: left;
    }
    th {
      background: #F1F5F9;
      color: var(--text-muted);
      font-weight: 700;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .badge-blocker { background: #FEE2E2; color: #991B1B; }
    .badge-high { background: #FEF3C7; color: #92400E; }
    .badge-medium { background: #EFF6FF; color: #1E40AF; }
    .badge-low { background: #F3F4F6; color: #4B5563; }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .gallery-item {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }
    .gallery-item img {
      width: 100%;
      height: auto;
      display: block;
      background: #000;
    }
    .gallery-info {
      padding: 10px 14px;
      font-size: 12px;
      font-family: monospace;
      color: var(--text-muted);
      background: #FAFAFA;
      border-top: 1px solid var(--border);
    }
    .repair-box {
      font-family: monospace;
      font-size: 12px;
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      padding: 6px 10px;
      border-radius: 6px;
      margin-top: 4px;
      color: #334155;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-info">
        <h1>${chapter}</h1>
        <p>Course: <strong>${course}</strong> · Domain: <strong>${domain}</strong> · Generated: ${new Date(generatedAt).toLocaleString()}</p>
      </div>
      <div>
        <span class="badge ${status === 'PASS' ? 'badge-blocker' : 'badge-high'}" style="background: ${statusBg}; color: #fff; font-size: 14px; padding: 6px 12px;">
          ${status}
        </span>
      </div>
    </div>

    <div class="status-banner">
      <span>${statusLabel}</span>
      <span>${summary.blockerCount} Blockers · ${summary.highCount} High · ${summary.mediumCount} Medium · ${summary.lowCount} Low</span>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-title">Duration</div>
        <div class="metric-value">${(metrics.compiledDurationSec || 0).toFixed(1)}s</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">Total Frames</div>
        <div class="metric-value">${metrics.totalFrames}</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">Duration Drift</div>
        <div class="metric-value" style="color: ${Math.abs(metrics.durationDriftMs) > 500 ? '#EF4444' : '#10B981'};">
          ${metrics.durationDriftMs > 0 ? '+' : ''}${metrics.durationDriftMs}ms
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-title">Audio Files</div>
        <div class="metric-value">${metrics.audioFilesPresent} / ${metrics.totalBeats}</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">Source Facts</div>
        <div class="metric-value">${metrics.sourceFactsCount}</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">MP4 Status</div>
        <div class="metric-value" style="font-size: 16px;">
          ${metrics.hasMp4 ? `✅ ${(metrics.mp4SizeBytes / (1024 * 1024)).toFixed(1)}MB` : '⏳ Pending Render'}
        </div>
      </div>
    </div>

    <div class="section-title">Validation Findings (${findings.length})</div>
    <div class="table-container">
      ${
        findings.length === 0
          ? '<div style="padding: 24px; text-align: center; color: #10B981; font-weight: 700;">✨ Zero defects detected! Video assets, timing, and schemas comply perfectly with all release criteria.</div>'
          : `<table>
        <thead>
          <tr>
            <th>Severity</th>
            <th>Category</th>
            <th>Location</th>
            <th>Finding & Cause</th>
            <th>Suggested Repair</th>
          </tr>
        </thead>
        <tbody>
          ${findings
            .map(
              (f) => `<tr>
            <td>${getSeverityBadge(f.severity)}</td>
            <td><strong>${f.category}</strong></td>
            <td>${f.sceneIndex !== undefined ? `Scene ${f.sceneIndex}` : ''} ${f.beatId ? `Beat <code>${f.beatId}</code>` : ''}</td>
            <td>
              <div><strong>${f.message}</strong></div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Cause: ${f.cause}</div>
            </td>
            <td>
              <div class="repair-box">🔧 ${f.suggestedRepair}</div>
            </td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>`
      }
    </div>

    ${
      screenshots && screenshots.length > 0
        ? `<div class="section-title">Visual Cue Verification Screenshots (${screenshots.length})</div>
    <div class="gallery">
      ${screenshots
        .map(
          (shot) => `<div class="gallery-item">
        <img src="${shot.relativeUrl}" alt="Frame ${shot.frame} ${shot.type}" loading="lazy" />
        <div class="gallery-info">
          Scene ${shot.sceneIndex} · Beat ${shot.beatId} · Frame ${shot.frame} (${shot.timestampMs}ms)
          ${shot.cueTarget ? `<br />Target: <strong>${shot.cueTarget}</strong>` : ''}
        </div>
      </div>`
        )
        .join('')}
    </div>`
        : ''
    }
  </div>
</body>
</html>`;

  fs.writeFileSync(outputPath, html, 'utf8');
  return outputPath;
}

