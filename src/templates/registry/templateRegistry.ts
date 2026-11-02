// src/templates/registry/templateRegistry.ts
import { TemplateType, VisualKind } from '../../types';
// @ts-expect-error schema import without declaration
import { TEMPLATE_REGISTRY as RAW_REGISTRY } from '../../schemas/templateRegistrySchema.mjs';

export type DataType =
  | 'numeric'
  | 'formula'
  | 'nodes_edges'
  | 'timeline_events'
  | 'cards'
  | 'comparison_columns'
  | 'dialogue'
  | 'quiz'
  | 'steps'
  | 'domain_finance';

export interface TemplateDefinition {
  templateId: TemplateType;
  name: string;
  description: string;
  supportedKinds: VisualKind[];
  requiredDataTypes: DataType[];
  animationTargets: string[];
  fallbackTemplateId: TemplateType;
  isDomainExtension?: boolean;
  domain?: string;
}

export const TEMPLATE_REGISTRY: Record<TemplateType, TemplateDefinition> =
  RAW_REGISTRY as unknown as Record<TemplateType, TemplateDefinition>;


/**
 * Returns whether a template is allowed for a given course configuration.
 */
export function isTemplateAllowedForCourse(
  templateId: TemplateType,
  allowedTemplates: string[],
  activeDomainModules: string[] = []
): boolean {
  const def = TEMPLATE_REGISTRY[templateId];
  if (!def) return false;

  // Domain extension check
  if (def.isDomainExtension && def.domain) {
    if (!activeDomainModules.includes(def.domain)) {
      return false;
    }
  }

  return allowedTemplates.includes(templateId) || allowedTemplates.includes('*');
}

/**
 * Returns fallback template if requested template cannot be satisfied.
 */
export function getFallbackTemplate(templateId: TemplateType): TemplateType {
  const def = TEMPLATE_REGISTRY[templateId];
  return def ? def.fallbackTemplateId : 'progressive_cards';
}

