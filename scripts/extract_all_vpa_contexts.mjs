// scripts/extract_all_vpa_contexts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const notebookId = '37f192bf-8225-4ea5-a8d0-3b3a19c18fd9'; // Murphy technical analysis notebook
const sourceId = '10a71777-9b52-4752-a6c1-9ea4c73509d0';   // A Complete Guide To Volume Price Analysis 2013.pdf

const curriculumPath = path.join(rootDir, 'volume analysis_Video_Master_Curriculum.txt');
if (!fs.existsSync(curriculumPath)) {
  console.error('❌ Missing curriculum file:', curriculumPath);
  process.exit(1);
}

const lines = fs.readFileSync(curriculumPath, 'utf8')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0);

const chapters = [];
for (const line of lines) {
  const match = line.match(/^\d+\.\s*out\/(vpa_[a-z0-9_]+)\.mp4:\s*["']?(.*?)["']?$/i);
  if (match) {
    chapters.push({
      key: match[1],
      directive: match[2].replace(/^Create a video\s+vpa_[a-z0-9_]+\.mp4\s+covering\s+/i, '')
    });
  }
}

console.log(`Found ${chapters.length} VPA chapters to extract from NotebookLM:\n`);

async function extractOne(item, index) {
  const { key, directive } = item;
  const hiDir = path.join(rootDir, 'src', 'data', 'chapters', 'coulling_vpa', key);
  const enDir = path.join(rootDir, 'src', 'data', 'chapters', 'coulling_vpa_en', key);

  fs.mkdirSync(hiDir, { recursive: true });
  fs.mkdirSync(enDir, { recursive: true });

  const hiContextPath = path.join(hiDir, 'notebook_context.txt');
  const enContextPath = path.join(enDir, 'notebook_context.txt');

  if (fs.existsSync(hiContextPath) && fs.statSync(hiContextPath).size > 200) {
    console.log(`[${index + 1}/${chapters.length}] ⏩ Existing context found for ${key} (${fs.statSync(hiContextPath).size} bytes)`);
    if (!fs.existsSync(enContextPath)) {
      fs.copyFileSync(hiContextPath, enContextPath);
    }
    return;
  }

  console.log(`[${index + 1}/${chapters.length}] 📖 Querying NotebookLM for ${key}...`);
  console.log(`   Directive: ${directive}`);

  const queryPrompt = `Extract from Anna Coulling's A Complete Guide to Volume Price Analysis: all core concepts, definitions, formulas, real-world case studies, author analogies, and key rules for: ${directive}`;
  const queryCmd = `nlm query notebook ${notebookId} "${queryPrompt.replace(/"/g, '\\"')}" --source-ids ${sourceId} --new-conversation --json`;

  try {
    const rawOut = execSync(queryCmd, {
      encoding: 'utf8',
      maxBuffer: 15 * 1024 * 1024,
      timeout: 180000
    });

    let contextText = '';
    try {
      const parsed = JSON.parse(rawOut);
      contextText = parsed.answer || rawOut;
      if (parsed.references && Array.isArray(parsed.references)) {
        contextText += '\n\n### Direct Citations from Book Sources:\n';
        for (const ref of parsed.references) {
          if (ref.cited_text) {
            contextText += `- "${ref.cited_text}"\n`;
          }
        }
      }
    } catch {
      contextText = rawOut;
    }

    fs.writeFileSync(hiContextPath, contextText, 'utf8');
    fs.writeFileSync(enContextPath, contextText, 'utf8');
    console.log(`   ✅ Saved ${contextText.length} chars to ${key}/notebook_context.txt\n`);
  } catch (err) {
    console.error(`   ❌ Failed to query NotebookLM for ${key}:`, err.message);
  }
}

async function run() {
  for (let i = 0; i < chapters.length; i++) {
    await extractOne(chapters[i], i);
  }
  console.log('\n🎉 ALL 25 VPA NOTEBOOK CONTEXTS PROCESSED!');
}

run();

