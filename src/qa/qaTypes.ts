// src/qa/qaTypes.ts

export type QASeverity = 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW';

export type QACategory =
  | 'source_traceability'
  | 'schema_validity'
  | 'audio_timing'
  | 'subtitle_alignment'
  | 'duration_drift'
  | 'media_integrity'
  | 'visual_layout'
  | 'domain_rules';

export interface QAFinding {
  id: string;
  category: QACategory;
  severity: QASeverity;
  message: string;
  sceneIndex?: number;
  beatId?: string;
  target?: string;
  cause: string;
  suggestedRepair: string;
}

export interface QAMetrics {
  totalScenes: number;
  totalBeats: number;
  totalFrames: number;
  totalAudioDurationSec: number;
  compiledDurationSec: number;
  durationDriftMs: number;
  audioFilesPresent: number;
  audioFilesMissing: number;
  sourceFactsCount: number;
  hasMp4: boolean;
  mp4Path?: string;
  mp4SizeBytes?: number;
  mp4DurationSec?: number;
  videoCodec?: string;
  audioCodec?: string;
  resolution?: string;
  fps?: number;
}

export interface QASummary {
  blockerCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalFindings: number;
  status: 'PASS' | 'CONDITIONAL_PASS' | 'FAIL';
}

export interface QAScreenshot {
  sceneIndex: number;
  beatId: string;
  type: 'beat_start' | 'cue_trigger' | 'scene_end';
  frame: number;
  timestampMs: number;
  cueTarget?: string;
  filePath: string;
  relativeUrl: string;
}

export interface QAReport {
  chapter: string;
  course: string;
  domain: string;
  workspaceDir: string;
  generatedAt: string;
  status: 'PASS' | 'CONDITIONAL_PASS' | 'FAIL';
  metrics: QAMetrics;
  summary: QASummary;
  findings: QAFinding[];
  screenshots: QAScreenshot[];
}

export interface DomainValidationContext {
  workspaceDir: string;
  domain: string;
  course: string;
  domainModules: string[];
  rawEpisode: any;
  compiledEpisode?: any;
  sourceFacts?: any;
  contentAudit?: any;
}

export interface DomainValidator {
  domain: string;
  validate(context: DomainValidationContext): QAFinding[];
}

