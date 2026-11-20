# Adding a Book to OpenLectern

This guide walks you through adding a new book to OpenLectern and generating educational video lessons.

## Legal Prerequisite

You must own or have legal rights to transform the source book for educational or personal transformation. OpenLectern does not distribute copyrighted book texts.

## Step 1: Run the Interactive Wizard

The easiest way to initialize a book is the CLI wizard:

```powershell
npm start
```

Or for non-interactive / scripted setups:

```powershell
node bin/openlectern.mjs start --non-interactive `
  --book my-book `
  --title "Understanding Machine Learning" `
  --author "Jane Doe" `
  --domain "computer science" `
  --lang en,hi `
  --audience intermediate `
  --confirmed-rights
```

This creates `workspace/books/<book_id>/book.config.json`.

## Step 2: Book Configuration (`book.config.json`)

Key fields in `book.config.json`:

```json
{
  "schemaVersion": 1,
  "id": "my-book",
  "title": "Understanding Machine Learning",
  "author": "Jane Doe",
  "domain": "computer science",
  "domainPresets": ["cs"],
  "rights": {
    "confirmed": true,
    "statement": "Owned textbook purchased for personal study.",
    "confirmedAt": "2026-11-21T00:00:00Z"
  },
  "audience": "intermediate",
  "narrationLanguages": ["en", "hi"],
  "displayLanguage": "en",
  "personas": {
    "en": {
      "novice": { "name": "Alex", "voice": "en-US-AriaNeural" },
      "mentor": { "name": "Dr. Rivera", "voice": "en-US-ChristopherNeural" }
    },
    "hi": {
      "novice": { "name": "Raju", "voice": "hi-IN-MadhurNeural" },
      "mentor": { "name": "Sharma ji", "voice": "hi-IN-SwaraNeural" }
    }
  },
  "chapters": [
    { "id": "ch01", "number": 1, "title": "Linear Regression and Cost Functions" },
    { "id": "ch02", "number": 2, "title": "Gradient Descent Optimization" }
  ],
  "targetMinutes": { "min": 8, "max": 14 },
  "research": { "mode": "local-file", "connector": "manual" },
  "llm": { "provider": "agent-handoff" },
  "tts": { "provider": "edge", "rate": "+0%" },
  "deliverables": { "orientation": true, "chapters": "all", "synthesis": true },
  "theme": "dark-classroom"
}
```

## Step 3: Provide Research Material

### Option A: Google NotebookLM
1. If using `nlm` CLI: OpenLectern queries the notebook automatically.
2. If using manual research: OpenLectern generates `workspace/books/<book_id>/chapters/<ch>/<part>/research/PASTE_INTO_NOTEBOOKLM.md`.
3. Paste the prompt into NotebookLM and paste the output into `notebook_context.md`.

### Option B: Local File Extraction (Offline)
Place your PDF, EPUB, or TXT book in a local directory and configure:
```json
"research": { "mode": "local-file", "path": "path/to/book.pdf" }
```
OpenLectern will parse text and split it into chapter contexts automatically.

## Step 4: Run the Pipeline

To generate the first chapter:

```powershell
node bin/openlectern.mjs make --book my-book --chapter ch01 --part p1
```

To generate the entire book (all chapters, orientation, synthesis):

```powershell
node bin/openlectern.mjs make --book my-book --all
```

Released MP4s, subtitles, and QA reports will land in `out/<book_id>/`.
