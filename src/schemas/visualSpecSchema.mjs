// src/schemas/visualSpecSchema.mjs
import { z } from 'zod';

// ===================================================================
// 1. Visual Semantics
// ===================================================================
export const VisualSemanticsSchema = z.object({
  teachingObjective: z.string().min(5),
  sourceFactIds: z.array(z.string()).default([]),
  importantValues: z.array(z.string()).optional(),
  relationships: z.array(z.string()).optional(),
});

// ===================================================================
// 2. Generic Chart Specification
// ===================================================================
export const ChartAxisSchema = z.object({
  label: z.string().optional(),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  categories: z.array(z.string()).optional(),
  formatter: z.string().optional(),
});

export const ChartDataPointSchema = z.object({
  x: z.union([z.number(), z.string()]),
  y: z.number(),
  open: z.number().optional(),
  high: z.number().optional(),
  low: z.number().optional(),
  close: z.number().optional(),
  label: z.string().optional(),
});

export const ChartSeriesSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['line', 'bar', 'area', 'scatter', 'candlestick']).default('line'),
  color: z.string().optional(),
  data: z.array(ChartDataPointSchema),
});

export const ChartAnnotationSchema = z.object({
  type: z.enum(['label', 'callout', 'highlight', 'threshold', 'arrow', 'pill']).default('callout'),
  text: z.string(),
  x: z.union([z.number(), z.string()]).optional(),
  y: z.number().optional(),
  color: z.string().optional(),
});

export const ChartSpecSchema = z.object({
  chartType: z.enum(['line', 'bar', 'area', 'scatter', 'candlestick', 'histogram', 'timeline', 'custom']),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  xAxis: ChartAxisSchema.optional(),
  yAxis: ChartAxisSchema.optional(),
  series: z.array(ChartSeriesSchema),
  annotations: z.array(ChartAnnotationSchema).default([]),
  accessibilityText: z.string().optional(),
  domainExtension: z.record(z.string(), z.unknown()).optional(),
});

// ===================================================================
// 3. Generic Formula Specification
// ===================================================================
export const FormulaVariableSchema = z.object({
  symbol: z.string(),
  label: z.string(),
  value: z.union([z.string(), z.number()]).optional(),
  unit: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const FormulaStepSchema = z.object({
  stepIndex: z.number(),
  label: z.string(),
  equation: z.string(),
  substitutions: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  note: z.string().optional(),
});

export const FormulaSpecSchema = z.object({
  title: z.string(),
  badge: z.string().optional(),
  subtitle: z.string().optional(),
  expression: z.string(),
  variables: z.array(FormulaVariableSchema),
  steps: z.array(FormulaStepSchema).optional(),
  activeStepIndex: z.number().optional(),
});

// ===================================================================
// 4. Generic Diagram Specification
// ===================================================================
export const DiagramNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  subtitle: z.string().optional(),
  state: z.enum(['default', 'active', 'success', 'warning', 'error', 'muted']).default('default'),
  icon: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  group: z.string().optional(),
});

export const DiagramEdgeSchema = z.object({
  id: z.string().optional(),
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
  directional: z.boolean().default(true),
  style: z.enum(['solid', 'dashed']).default('solid'),
  active: z.boolean().default(false),
});

export const DiagramSpecSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  badge: z.string().optional(),
  layout: z.enum(['linear_horizontal', 'linear_vertical', 'grid', 'timeline', 'cyclic']).default('linear_horizontal'),
  nodes: z.array(DiagramNodeSchema),
  edges: z.array(DiagramEdgeSchema).default([]),
  activeNodeIds: z.array(z.string()).default([]),
  activeEdgeIds: z.array(z.string()).default([]) ,
  highlights: z.array(z.string()).optional(),
});

// ===================================================================
// 5. Root Visual Specification
// ===================================================================
export const VisualKindEnum = z.enum([
  'chart',
  'formula',
  'diagram',
  'comparison',
  'timeline',
  'process',
  'cards',
  'conversation',
  'quiz',
  'summary',
]);

export const VisualSpecSchema = z.object({
  kind: VisualKindEnum,
  data: z.unknown(),
  semantics: VisualSemanticsSchema,
});
