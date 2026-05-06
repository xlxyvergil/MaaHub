import { readdir, readFile } from 'node:fs/promises';
import type { Dirent } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { getCollection } from 'astro:content';

export type SkillRecord = {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  entry: string;
  readme: string;
  type: 'skill';
  tags?: string[];
  status?: string;
  version?: string;
  skillName: string;
  whenToUse?: string[];
  allowedTools?: string[];
  argumentHint?: string;
  arguments?: unknown;
  disableModelInvocation?: boolean;
  userInvocable?: boolean;
  paths?: string[];
  model?: string;
  effort?: string;
  context?: string[];
  agent?: string;
  hooks?: unknown;
  shell?: string;
};

type SkillMetaRecord = {
  id: string;
  title: string;
  description: string;
  author: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  version?: string;
  mfwVersion?: string;
  entry: string;
  readme: string;
  status?: string;
  type: 'skill';
  category?: string;
  inputs?: string[];
  outputs?: string[];
};

type SkillFrontmatter = {
  name?: unknown;
  description?: unknown;
  when_to_use?: unknown;
  'allowed-tools'?: unknown;
  'argument-hint'?: unknown;
  arguments?: unknown;
  'disable-model-invocation'?: unknown;
  'user-invocable'?: unknown;
  paths?: unknown;
  model?: unknown;
  effort?: unknown;
  context?: unknown;
  agent?: unknown;
  hooks?: unknown;
  shell?: unknown;
  tags?: unknown;
  status?: unknown;
  version?: unknown;
};

const SKILLS_ROOT = fileURLToPath(new URL('../../../Storage/skills', import.meta.url));
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/;

function toTrimmedString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function toStringArray(value: unknown) {
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : undefined))
    .filter((item): item is string => Boolean(item));

  return normalized.length > 0 ? normalized : undefined;
}

function toBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

function parseFrontmatter(content: string) {
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) {
    return null;
  }

  const frontmatter = parseYaml(match[1]) as SkillFrontmatter | null;
  if (!frontmatter || typeof frontmatter !== 'object') {
    return null;
  }

  return frontmatter;
}

async function walkSkillMarkdownFiles(dirPath: string): Promise<string[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry: Dirent) => {
      const entryPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return walkSkillMarkdownFiles(entryPath);
      }

      return entry.name === 'SKILL.md' ? [entryPath] : [];
    })
  );

  return files.flat();
}

function toSkillId(filePath: string) {
  const relativePath = path.relative(SKILLS_ROOT, filePath);
  const segments = relativePath.split(path.sep);
  if (segments.length !== 3 || segments[2] !== 'SKILL.md') {
    return null;
  }

  const [author, skillSlug] = segments;
  if (!author || !skillSlug) {
    return null;
  }

  return {
    author,
    skillSlug,
    id: `${author}/${skillSlug}`,
  };
}

export async function getAllSkills(): Promise<SkillRecord[]> {
  const skills = await getCollection('skills');
  const metaById = new Map<string, SkillMetaRecord>(
    skills.map((skill) => [skill.data.id, skill.data as SkillMetaRecord])
  );
  const skillFiles = await walkSkillMarkdownFiles(SKILLS_ROOT);
  const frontmatterById = new Map<string, SkillFrontmatter>();

  await Promise.all(
    skillFiles.map(async (filePath) => {
      const skillId = toSkillId(filePath);
      if (!skillId) {
        return;
      }

      const content = await readFile(filePath, 'utf-8');
      const frontmatter = parseFrontmatter(content);
      if (frontmatter) {
        frontmatterById.set(skillId.id, frontmatter);
      }
    })
  );

  return [...metaById.values()]
    .map((meta) => {
      const frontmatter = frontmatterById.get(meta.id);
      const allowedTools = frontmatter ? toStringArray(frontmatter['allowed-tools']) : undefined;

      return {
        ...meta,
        skillName: frontmatter ? (toTrimmedString(frontmatter.name) ?? meta.id.split('/')[1] ?? meta.title) : meta.id.split('/')[1] ?? meta.title,
        whenToUse: frontmatter ? toStringArray(frontmatter.when_to_use) : undefined,
        allowedTools,
        argumentHint: frontmatter ? toTrimmedString(frontmatter['argument-hint']) : undefined,
        arguments: frontmatter?.arguments,
        disableModelInvocation: frontmatter ? toBoolean(frontmatter['disable-model-invocation']) : undefined,
        userInvocable: frontmatter ? toBoolean(frontmatter['user-invocable']) : undefined,
        paths: frontmatter ? toStringArray(frontmatter.paths) : undefined,
        model: frontmatter ? toTrimmedString(frontmatter.model) : undefined,
        effort: frontmatter ? toTrimmedString(frontmatter.effort) : undefined,
        context: frontmatter ? toStringArray(frontmatter.context) : undefined,
        agent: frontmatter ? toTrimmedString(frontmatter.agent) : undefined,
        hooks: frontmatter?.hooks,
        shell: frontmatter ? toTrimmedString(frontmatter.shell) : undefined,
        tags: meta.tags?.length ? meta.tags : allowedTools?.slice(0, 4),
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
