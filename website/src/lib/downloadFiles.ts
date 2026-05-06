import { readdir, readFile } from 'node:fs/promises';
import type { Dirent } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type DownloadFile = {
  path: string;
  content: string;
};

const STORAGE_ROOT = fileURLToPath(new URL('../../../Storage', import.meta.url));

export async function collectDownloadFiles(dirPath: string, relativePath = ''): Promise<DownloadFile[]> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry: Dirent) => {
    const entryPath = path.join(dirPath, entry.name);
    const entryRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      return collectDownloadFiles(entryPath, entryRelativePath);
    }

    const content = await readFile(entryPath, 'utf-8');
    return [{ path: entryRelativePath, content }];
  }));

  return files.flat().sort((a: DownloadFile, b: DownloadFile) => a.path.localeCompare(b.path));
}

export async function withDownloadFiles<T extends { id: string }>(item: T, storageType: string) {
  const [author, itemSlug] = item.id.split('/');
  const itemDir = path.join(STORAGE_ROOT, storageType, author, itemSlug);

  return {
    ...item,
    downloadFiles: await collectDownloadFiles(itemDir),
  };
}
