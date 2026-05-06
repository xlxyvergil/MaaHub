import React from 'react';
import hljs from 'highlight.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { FileCode, Check, Copy } from 'lucide-react';
import { cn } from '../lib/utils';

export type DownloadFile = {
  path: string;
  content: string;
};

type FileViewerProps = {
  files?: DownloadFile[];
  emptyLabel: string;
};

const README_CANDIDATES = new Set(['readme.md', 'readme.mdx', 'index.md', 'index.mdx']);

function sortFiles(files: DownloadFile[]) {
  return [...files].sort((a, b) => {
    const aName = a.path.split('/').pop()?.toLowerCase() ?? a.path.toLowerCase();
    const bName = b.path.split('/').pop()?.toLowerCase() ?? b.path.toLowerCase();
    const aIsReadme = README_CANDIDATES.has(aName);
    const bIsReadme = README_CANDIDATES.has(bName);

    if (aIsReadme !== bIsReadme) return aIsReadme ? -1 : 1;
    return a.path.localeCompare(b.path);
  });
}

function shouldPreviewFile(path: string) {
  const fileName = path.split('/').pop()?.toLowerCase() ?? path.toLowerCase();
  return fileName !== 'maahub_meta.json';
}

function getLanguage(path: string) {
  const extension = path.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'astro':
      return 'xml';
    case 'cjs':
    case 'mjs':
      return 'javascript';
    case 'jsonc':
      return 'json';
    case 'mdx':
      return 'markdown';
    case 'ps1':
      return 'powershell';
    case 'py':
      return 'python';
    case 'sh':
      return 'bash';
    case 'tsx':
      return 'typescript';
    default:
      return extension ?? 'plaintext';
  }
}

function isMarkdown(path: string) {
  return /\.(md|mdx)$/i.test(path);
}

export function FileViewer({ files = [], emptyLabel }: FileViewerProps) {
  const orderedFiles = React.useMemo(
    () => sortFiles(files.filter((file) => shouldPreviewFile(file.path))),
    [files]
  );
  const initialTab = orderedFiles[0]?.path ?? '';
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const codeRef = React.useRef<HTMLElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!activeFile?.content) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  React.useEffect(() => {
    if (!orderedFiles.some((file) => file.path === activeTab)) {
      setActiveTab(initialTab);
    }
  }, [activeTab, initialTab, orderedFiles]);

  if (!orderedFiles.length) {
    return (
      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
        {emptyLabel}
      </div>
    );
  }

  const activeFile = orderedFiles.find((file) => file.path === activeTab) ?? orderedFiles[0];
  const language = getLanguage(activeFile.path);

  React.useEffect(() => {
    if (isMarkdown(activeFile.path) || !codeRef.current) {
      return;
    }

    codeRef.current.removeAttribute('data-highlighted');
    hljs.highlightElement(codeRef.current);
  }, [activeFile.content, activeFile.path]);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="border-b bg-muted/40 px-4 flex overflow-x-auto">
        {orderedFiles.map((file) => (
          <button
            key={file.path}
            type="button"
            onClick={() => setActiveTab(file.path)}
            className={cn(
              'inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeFile.path === file.path
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
            title={file.path}
          >
            <FileCode className="h-4 w-4 flex-shrink-0" />
            <span>{file.path}</span>
          </button>
        ))}
      </div>

      <div className="p-6 relative group">
        {isMarkdown(activeFile.path) ? (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-pre:p-0 prose-pre:bg-transparent">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {activeFile.content}
            </ReactMarkdown>
          </div>
        ) : (
          <>
            <button
              onClick={handleCopy}
              className={cn(
                "absolute top-8 right-8 p-2 rounded-md bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-all opacity-0 group-hover:opacity-100",
                copied && "text-green-400 hover:text-green-400 opacity-100"
              )}
              title="Copy code"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            <pre className="overflow-x-auto rounded-lg bg-[#0d1117] p-4 text-sm leading-relaxed text-slate-100">
              <code ref={codeRef} className={`language-${language}`}>
                {activeFile.content}
              </code>
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
