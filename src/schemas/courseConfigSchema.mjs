// src/schemas/courseConfigSchema.mjs
import { z } from 'zod';

export const PersonaSchema = z.object({
  name: z.string().min(1),
  avatar: z.string().min(1),
  role: z.string().min(1),
  theme: z.string().min(1),
});

export const VisualThemeSchema = z.object({
  primaryColor: z.string().min(1),
  accentColor: z.string().min(1),
  fontFamily: z.string().optional().default('Inter, sans-serif'),
  backgroundColor: z.string().optional().default('#F7F6F2'),
  cardBackground: z.string().optional().default('#FFFFFF'),
  textColor: z.string().optional().default('#1E1E1E'),
  mutedColor: z.string().optional().default('#737373'),
});

export const UnitsAndFormatsSchema = z.object({
  defaultUnit: z.string().optional(),
  allowedUnits: z.array(z.string()).default([]),
  numberNotation: z.enum(['standard', 'indian', 'scientific']).default('standard'),
  decimalPlaces: z.number().int().nonnegative().default(2),
  formatters: z.record(z.string(), z.string()).optional(),
});

export const CourseConfigSchema = z.object({
  schemaVersion: z.literal('1.0.0').default('1.0.0'),
  courseId: z.string().min(2).regex(/^[a-z0-9_-]+$/i, 'Course ID must be alphanumeric/slug'),
  bookTitle: z.string().min(3),
  subject: z.string().min(2),
  audience: z.string().optional().default('Students & Self-Learners'),
  narrationLanguage: z.string().default('hi-IN-devanagari'),
  visualTheme: VisualThemeSchema,
  allowedTemplates: z
    .array(z.string())
    .min(1, 'At least one template must be allowed for this course'),
  domainModules: z.array(z.string()).default([]),
  terminologyGlossary: z
    .record(
      z.string(),
      z.object({
        definition: z.string(),
        phoneticHint: z.string().optional(),
      })
    )
    .optional(),
  unitsAndFormats: UnitsAndFormatsSchema.optional(),
  visualPreferences: z
    .object({
      gridDot: z.boolean().default(true),
      animationSpeed: z.enum(['standard', 'snappy']).default('standard'),
      cardRounding: z.string().default('rounded-3xl'),
    })
    .default({}),
  persona: z
    .object({
      novice: PersonaSchema.optional(),
      mentor: PersonaSchema.optional(),
      contextDescription: z.string().optional(),
    })
    .optional(),
});
