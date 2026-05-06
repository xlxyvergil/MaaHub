import { z } from 'astro:content';

export const metaStatusSchema = z.enum(['stable', 'beta', 'deprecated', 'experimental']);

export const commonMetaSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  author: z.string(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.string().optional(),
  mfwVersion: z.string().optional(),
  entry: z.string(),
  readme: z.string(),
  status: metaStatusSchema.optional(),
  category: z.string().optional(),
  externalTools: z.array(z.string()).optional(),
});

export const skillMetaSchema = commonMetaSchema.extend({
  type: z.literal('skill'),
  inputs: z.array(z.string()).optional(),
  outputs: z.array(z.string()).optional(),
});

export const pipelineMetaSchema = commonMetaSchema.extend({
  type: z.literal('pipeline'),
});

export const customMetaSchema = commonMetaSchema.extend({
  type: z.literal('custom'),
  language: z.string().optional(),
  runtime: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

export const experienceChapterSchema = z.object({
  title: z.string(),
  path: z.string(),
});

export const experienceMetaSchema = commonMetaSchema.extend({
  type: z.literal('experience'),
  chapters: z.array(experienceChapterSchema).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  estimatedTime: z.string().optional(),
});
