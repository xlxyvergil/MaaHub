import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const allowedStatuses = new Set(['stable', 'beta', 'deprecated', 'experimental']);
const allowedTypes = new Set(['skill', 'pipeline', 'custom', 'experience']);
const allowedExperienceDifficulty = new Set(['beginner', 'intermediate', 'advanced']);
const storageTypeByMetaType = {
  skill: 'skills',
  pipeline: 'pipelines',
  custom: 'customs',
  experience: 'experiences',
};

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isDateString(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function formatError(filePath, message) {
  return `${filePath}: ${message}`;
}

async function validateMetaFile(relativeFilePath) {
  const normalizedPath = relativeFilePath.replace(/\\/g, '/');
  const absoluteFilePath = path.resolve(repoRoot, relativeFilePath);
  const entryDir = path.dirname(absoluteFilePath);
  const errors = [];

  let rawContent;
  try {
    rawContent = await fs.readFile(absoluteFilePath, 'utf8');
  } catch (error) {
    return [formatError(normalizedPath, `failed to read file: ${error instanceof Error ? error.message : String(error)}`)];
  }

  let meta;
  try {
    meta = JSON.parse(rawContent);
  } catch (error) {
    return [formatError(normalizedPath, `invalid JSON: ${error instanceof Error ? error.message : String(error)}`)];
  }

  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    return [formatError(normalizedPath, 'root value must be a JSON object')];
  }

  const commonRequired = ['id', 'title', 'description', 'author', 'createdAt', 'updatedAt', 'entry', 'readme', 'type'];
  for (const key of commonRequired) {
    if (!isNonEmptyString(meta[key])) {
      errors.push(formatError(normalizedPath, `field "${key}" is required and must be a non-empty string`));
    }
  }

  if (meta.id && !/^[^/]+\/[^/]+$/.test(meta.id)) {
    errors.push(formatError(normalizedPath, 'field "id" must match the format "author/slug"'));
  }

  if (meta.tags !== undefined && !isStringArray(meta.tags)) {
    errors.push(formatError(normalizedPath, 'field "tags" must be an array of strings'));
  }

  if (meta.source !== undefined && !isNonEmptyString(meta.source)) {
    errors.push(formatError(normalizedPath, 'field "source" must be a non-empty string when present'));
  }

  if (meta.sourceGithub !== undefined) {
    if (!isNonEmptyString(meta.sourceGithub)) {
      errors.push(formatError(normalizedPath, 'field "sourceGithub" must be a non-empty string when present'));
    } else {
      try {
        const parsed = new URL(meta.sourceGithub);
        if (!(parsed.protocol === 'http:' || parsed.protocol === 'https:')) {
          errors.push(formatError(normalizedPath, 'field "sourceGithub" must be an http or https URL'));
        }
      } catch {
        errors.push(formatError(normalizedPath, 'field "sourceGithub" must be a valid URL'));
      }
    }
  }

  if (meta.createdAt !== undefined && !isDateString(meta.createdAt)) {
    errors.push(formatError(normalizedPath, 'field "createdAt" must use YYYY-MM-DD format'));
  }

  if (meta.updatedAt !== undefined && !isDateString(meta.updatedAt)) {
    errors.push(formatError(normalizedPath, 'field "updatedAt" must use YYYY-MM-DD format'));
  }

  if (meta.version !== undefined && !isNonEmptyString(meta.version)) {
    errors.push(formatError(normalizedPath, 'field "version" must be a non-empty string when present'));
  }

  if (meta.mfwVersion !== undefined && !isNonEmptyString(meta.mfwVersion)) {
    errors.push(formatError(normalizedPath, 'field "mfwVersion" must be a non-empty string when present'));
  }

  if (meta.mfw_version !== undefined) {
    errors.push(formatError(normalizedPath, 'field "mfw_version" is deprecated; use "mfwVersion" instead'));
  }

  if (meta.status !== undefined && !allowedStatuses.has(meta.status)) {
    errors.push(formatError(normalizedPath, 'field "status" must be one of stable, beta, deprecated, experimental'));
  }

  if (meta.type !== undefined && !allowedTypes.has(meta.type)) {
    errors.push(formatError(normalizedPath, 'field "type" must be one of skill, pipeline, custom, experience'));
  }

  if (meta.category !== undefined && !isNonEmptyString(meta.category)) {
    errors.push(formatError(normalizedPath, 'field "category" must be a non-empty string when present'));
  }

  if (meta.externalTools !== undefined && !isStringArray(meta.externalTools)) {
    errors.push(formatError(normalizedPath, 'field "externalTools" must be an array of strings'));
  }

  const relativeSegments = normalizedPath.split('/');
  if (relativeSegments.length >= 4 && relativeSegments[0] === 'Storage') {
    const [, storageType, authorDir, slugDir] = relativeSegments;
    if (meta.id && isNonEmptyString(meta.id)) {
      const [authorId, slugId] = meta.id.split('/');
      if (authorId !== authorDir || slugId !== slugDir) {
        errors.push(formatError(normalizedPath, `field "id" must match the directory path; expected "${authorDir}/${slugDir}"`));
      }
    }

    if (meta.author && isNonEmptyString(meta.author) && meta.author !== authorDir) {
      errors.push(formatError(normalizedPath, `field "author" should match the author directory "${authorDir}"`));
    }

    if (meta.type && allowedTypes.has(meta.type)) {
      const expectedStorageType = storageTypeByMetaType[meta.type];
      if (expectedStorageType && expectedStorageType !== storageType) {
        errors.push(formatError(normalizedPath, `field "type" is "${meta.type}" but file is under Storage/${storageType}`));
      }
    }
  }

  for (const key of ['entry', 'readme']) {
    if (isNonEmptyString(meta[key])) {
      const targetPath = path.resolve(entryDir, meta[key]);
      if (!(await fileExists(targetPath))) {
        errors.push(formatError(normalizedPath, `field "${key}" points to a missing file: ${meta[key]}`));
      }
    }
  }

  if (meta.type === 'skill') {
    if (meta.inputs !== undefined && !isStringArray(meta.inputs)) {
      errors.push(formatError(normalizedPath, 'field "inputs" must be an array of strings'));
    }
    if (meta.outputs !== undefined && !isStringArray(meta.outputs)) {
      errors.push(formatError(normalizedPath, 'field "outputs" must be an array of strings'));
    }
  }

  if (meta.type === 'custom') {
    if (meta.language !== undefined && !isNonEmptyString(meta.language)) {
      errors.push(formatError(normalizedPath, 'field "language" must be a non-empty string when present'));
    }
    if (meta.runtime !== undefined && !isNonEmptyString(meta.runtime)) {
      errors.push(formatError(normalizedPath, 'field "runtime" must be a non-empty string when present'));
    }
    if (meta.dependencies !== undefined && !isStringArray(meta.dependencies)) {
      errors.push(formatError(normalizedPath, 'field "dependencies" must be an array of strings'));
    }
  }

  if (meta.type === 'experience') {
    if (meta.chapters !== undefined) {
      if (!Array.isArray(meta.chapters)) {
        errors.push(formatError(normalizedPath, 'field "chapters" must be an array'));
      } else {
        for (const [index, chapter] of meta.chapters.entries()) {
          if (!chapter || typeof chapter !== 'object' || Array.isArray(chapter)) {
            errors.push(formatError(normalizedPath, `chapters[${index}] must be an object`));
            continue;
          }
          if (!isNonEmptyString(chapter.title)) {
            errors.push(formatError(normalizedPath, `chapters[${index}].title must be a non-empty string`));
          }
          if (!isNonEmptyString(chapter.path)) {
            errors.push(formatError(normalizedPath, `chapters[${index}].path must be a non-empty string`));
          } else {
            const chapterPath = path.resolve(entryDir, chapter.path);
            if (!(await fileExists(chapterPath))) {
              errors.push(formatError(normalizedPath, `chapters[${index}].path points to a missing file: ${chapter.path}`));
            }
          }
        }
      }
    }

    if (meta.difficulty !== undefined && !allowedExperienceDifficulty.has(meta.difficulty)) {
      errors.push(formatError(normalizedPath, 'field "difficulty" must be one of beginner, intermediate, advanced'));
    }

    if (meta.estimatedTime !== undefined && !isNonEmptyString(meta.estimatedTime)) {
      errors.push(formatError(normalizedPath, 'field "estimatedTime" must be a non-empty string when present'));
    }
  }

  return errors;
}

async function collectAllMetaFiles() {
  const storageDirs = ['Storage/skills', 'Storage/pipelines', 'Storage/customs', 'Storage/experiences'];
  const metaFiles = [];

  for (const storageDir of storageDirs) {
    const absoluteStorageDir = path.resolve(repoRoot, storageDir);
    if (!(await fileExists(absoluteStorageDir))) {
      continue;
    }
    await walkForMetaFiles(absoluteStorageDir, metaFiles);
  }

  return metaFiles.map((filePath) => path.relative(repoRoot, filePath));
}

async function walkForMetaFiles(dirPath, metaFiles) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await walkForMetaFiles(absolutePath, metaFiles);
      continue;
    }
    if (entry.isFile() && entry.name === 'maahub_meta.json') {
      metaFiles.push(absolutePath);
    }
  }
}

async function main() {
  const inputFiles = process.argv.slice(2);
  const targetFiles = inputFiles.length > 0 ? inputFiles : await collectAllMetaFiles();
  const metaFiles = [...new Set(targetFiles.map((filePath) => filePath.replace(/\\/g, '/')))]
    .filter((filePath) => filePath.endsWith('maahub_meta.json'));

  if (metaFiles.length === 0) {
    console.log('No maahub_meta.json files to validate.');
    return;
  }

  const allErrors = [];
  for (const filePath of metaFiles) {
    const errors = await validateMetaFile(filePath);
    allErrors.push(...errors);
  }

  if (allErrors.length > 0) {
    console.error('MaaHub meta validation failed:\n');
    for (const error of allErrors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Validated ${metaFiles.length} maahub_meta.json file(s) successfully.`);
}

await main();
