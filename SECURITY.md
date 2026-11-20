# Security Policy

## Reporting a vulnerability

Please report security issues privately through the repository host's private vulnerability reporting feature (for GitHub: Security > Report a vulnerability). Do not open a public issue for security problems. You will receive an acknowledgement within 7 days.

## Secrets

- API keys are read from `.env` only (see `.env.example`). `.env` is git-ignored.
- OpenLectern never stores cookies or tokens for NotebookLM; community CLIs keep their own credential store.
- No telemetry leaves your machine. Network calls are made only to the providers you configure (LLM, TTS) and to npm/Remotion downloads during installation.

## Supported versions

Only the latest release receives security fixes.
