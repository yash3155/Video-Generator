// src/schemas/templateRegistrySchema.mjs
import { z } from 'zod';
import { VisualKindEnum } from './visualSpecSchema.mjs';

export const DataTypeEnum = z.enum([
  'numeric',
  'formula',
  'nodes_edges',
  'timeline_events',
  'cards',
  'comparison_columns',
  'dialogue',
  'quiz',
  'steps',
  'domain_finance',
]);

export const TemplateDefinitionSchema = z.object({
  templateId: z.string(),
  name: z.string(),
  description: z.string(),
  supportedKinds: z.array(VisualKindEnum),
  requiredDataTypes: z.array(DataTypeEnum),
  animationTargets: z.array(z.string()),
  fallbackTemplateId: z.string(),
  isDomainExtension: z.boolean().optional(),
  domain: z.string().optional(),
});
