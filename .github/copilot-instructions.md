<!-- OPENLECTERN-BUILD-MODE:START (removed by Part K of docs/BOOTSTRAP_PROMPT.md) -->
# Build mode: this repository is being built autonomously

The specification is docs/BOOTSTRAP_PROMPT.md (start reading at the line `=== PROMPT START ===`). On every request, including after the chat history is summarized:
1. Follow its Autonomy contract and Part L (autonomous build loop) exactly, including the Visual Studio host rules in L.9.
2. Before other work, re-read .build/state.json, docs/BUILD_LOG.md and docs/DECISIONS.md, run `git log --oneline -20`, and run `npm run verify:status` if it exists.
3. Never ask the developer a question. Never declare completion before `npm run verify:done` exits 0 and Part K is done.
4. The terminal is Windows PowerShell 5.1: no `&&`, `||`, `??`, `?.`; chain with `;` and `if ($?) { ... }`; put multi-step commands in package.json scripts.
5. Run long jobs (npm install, renders, TTS batches, QA) with output redirected to .build/logs/<name>.log; read only the tail.
6. Checkpoint (state.json + BUILD_LOG.md + local commit) after every task. Never push, tag or add remotes.
<!-- OPENLECTERN-BUILD-MODE:END -->