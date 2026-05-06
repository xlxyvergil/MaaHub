import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const skills = defineCollection({
  loader: glob({ pattern: "**/maahub_meta.json", base: "../Storage/skills" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.string().optional(),
    framework: z.string().optional(),
    entry: z.string().optional(),
    readme: z.string().optional(),
    status: z.enum(['stable', 'beta', 'deprecated', 'experimental']).optional(),
    type: z.literal('skill'),
    category: z.string().optional(),
    inputs: z.array(z.string()).optional(),
    outputs: z.array(z.string()).optional(),
  })
});

const pipelines = defineCollection({
  loader: glob({ pattern: "**/maahub_meta.json", base: "../Storage/pipelines" }),
  schema: z.any()
});

const customs = defineCollection({
  loader: glob({ pattern: "**/maahub_meta.json", base: "../Storage/customs" }),
  schema: z.any()
});

const experiences = defineCollection({
  loader: glob({ pattern: "**/maahub_meta.json", base: "../Storage/experiences" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.string().optional(),
    entry: z.string().optional(),
    readme: z.string().optional(),
    chapters: z.array(z.object({
      title: z.string(),
      path: z.string(),
    })).optional(),
    status: z.enum(['stable', 'beta', 'deprecated', 'experimental']).optional(),
    type: z.literal('experience'),
    category: z.string().optional(),
    difficulty: z.string().optional(),
    estimatedTime: z.string().optional(),
  })
});

export const collections = {
  skills,
  pipelines,
  customs,
  experiences
};
