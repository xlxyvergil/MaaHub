import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  customMetaSchema,
  experienceMetaSchema,
  pipelineMetaSchema,
  skillMetaSchema,
} from './metaSchema';

const skills = defineCollection({
  loader: glob({ pattern: "**/maahub_meta.json", base: "../Storage/skills" }),
  schema: skillMetaSchema
});

const pipelines = defineCollection({
  loader: glob({ pattern: "**/maahub_meta.json", base: "../Storage/pipelines" }),
  schema: pipelineMetaSchema
});

const customs = defineCollection({
  loader: glob({ pattern: "**/maahub_meta.json", base: "../Storage/customs" }),
  schema: customMetaSchema
});

const experiences = defineCollection({
  loader: glob({ pattern: "**/maahub_meta.json", base: "../Storage/experiences" }),
  schema: experienceMetaSchema
});

export const collections = {
  skills,
  pipelines,
  customs,
  experiences
};
