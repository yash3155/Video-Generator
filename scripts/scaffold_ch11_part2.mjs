// scripts/scaffold_ch11_part2.mjs
import fs from 'fs';
import path from 'path';
import { scaffoldEpisode } from '../src/orchestrator/scaffoldingEngine.mjs';
import { normalizeAndRemedyEpisode } from './generate_episode.mjs';

function scaffoldFor(bookSlug) {
  const dir = path.join('src', 'data', 'chapters', bookSlug, 'ch11_part2');
  const factsPath = path.join(dir, 'source_facts.json');
  const factsData = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
  const courseConfigPath = path.join('src', 'courses', `${bookSlug}.json`);
  const courseConfig = JSON.parse(fs.readFileSync(courseConfigPath, 'utf8'));

  let ep = scaffoldEpisode({
    chapterKey: 'ch11_part2',
    courseSlug: bookSlug,
    chapterTitle: 'Advanced Option Strategies: Calendar Spreads, Volatility Combinations, and Straddle Traps',
    facts: factsData.facts || [],
    courseConfig
  });

  ep = normalizeAndRemedyEpisode(ep, 'ch11_part2');
  fs.writeFileSync(path.join(dir, 'episode_raw.json'), JSON.stringify(ep, null, 2), 'utf8');
  console.log(`✅ Scaffolding complete for ${bookSlug} ch11_part2`);
}

scaffoldFor('hull_derivatives');
scaffoldFor('hull_derivatives_en');

