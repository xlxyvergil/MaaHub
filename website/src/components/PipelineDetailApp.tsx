import React from 'react';
import { Header } from './Header';
import { ArrowLeft, Clock, GitMerge, Tag } from 'lucide-react';
import { ui } from '../i18n/utils';
import { cn } from '../lib/utils';
import { FileViewer, type DownloadFile } from './FileViewer';
import { DownloadSection } from './DownloadSection';
import { PipelineVisualizer } from './PipelineVisualizer';

type PipelineDetailData = {
  id: string;
  title?: string;
  description?: string;
  author?: string;
  status?: string;
  updatedAt?: string;
  version?: string;
  tags?: string[];
  entry?: string;
  downloadFiles?: DownloadFile[];
};

type ViewMode = 'files' | 'visual';

type ParsedPipelineFile = {
  fileName: string;
  data: unknown;
};

function getFileName(path: string) {
  return path.split('/').pop() ?? path;
}

function isPipelineCandidate(file: DownloadFile) {
  const fileName = getFileName(file.path).toLowerCase();
  return fileName.endsWith('.json') && fileName !== 'maahub_meta.json';
}

function sortPipelineFiles(files: ParsedPipelineFile[], entry?: string) {
  const normalizedEntry = entry?.replace(/^\.\//, '');
  return [...files].sort((a, b) => {
    const aIsEntry = normalizedEntry ? a.fileName === normalizedEntry : false;
    const bIsEntry = normalizedEntry ? b.fileName === normalizedEntry : false;
    if (aIsEntry !== bIsEntry) {
      return aIsEntry ? -1 : 1;
    }
    if (a.fileName === 'pipeline.json' && b.fileName !== 'pipeline.json') {
      return -1;
    }
    if (b.fileName === 'pipeline.json' && a.fileName !== 'pipeline.json') {
      return 1;
    }
    return a.fileName.localeCompare(b.fileName);
  });
}

function parsePipelineFiles(files?: DownloadFile[], entry?: string) {
  const candidates = (files ?? []).filter(isPipelineCandidate);
  const parsedFiles: ParsedPipelineFile[] = [];

  for (const file of candidates) {
    try {
      parsedFiles.push({
        fileName: file.path,
        data: JSON.parse(file.content) as unknown,
      });
    } catch {
      // Ignore invalid JSON files here; visual mode only needs at least one valid candidate.
    }
  }

  return sortPipelineFiles(parsedFiles, entry);
}

// In a real app, this data would come from the astro page props (fetched from getCollection)
export function PipelineDetailApp({ pipelineData, lang = 'zh' }: { pipelineId: string, pipelineData: PipelineDetailData, lang?: 'zh' | 'en' }) {
  const [currentLang, setCurrentLang] = React.useState(lang);
  const [viewMode, setViewMode] = React.useState<ViewMode>('files');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'en' || savedLang === 'zh') {
      setCurrentLang(savedLang);
    }
  }, []);

  const toggleLang = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setCurrentLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key: keyof typeof ui['zh']) => ui[currentLang][key as keyof typeof ui['zh']] || key;

  const visualPipelineFiles = React.useMemo(
    () => parsePipelineFiles(pipelineData.downloadFiles, pipelineData.entry),
    [pipelineData.downloadFiles, pipelineData.entry]
  );

  const canUseVisualMode = visualPipelineFiles.length > 0;
  const visualError = canUseVisualMode ? null : t('pipeline.visual.unavailable');

  React.useEffect(() => {
    if (viewMode === 'visual' && !canUseVisualMode) {
      setViewMode('files');
    }
  }, [canUseVisualMode, viewMode]);

  if (!isClient) return <div className="min-h-screen" />;

  const packageName = pipelineData.id.split('/')[1] || pipelineData.id;
  const visualLabels = {
    loading: t('pipeline.visual.loading'),
    ready: t('pipeline.visual.ready'),
    handshakeFailed: t('pipeline.visual.handshakeFailed'),
    loadFailed: t('pipeline.visual.loadFailed'),
    fileLabel: t('pipeline.visual.fileLabel'),
  };
  const isVisualMode = viewMode === 'visual' && canUseVisualMode;
  const initialVisualFileName = visualPipelineFiles[0]?.fileName;

  return (
    <>
      <Header lang={currentLang} toggleLang={toggleLang} />

      <main className="flex-1 bg-muted/10 pb-20">
        <div className="bg-background border-b">
          <div className={cn('container mx-auto px-4 md:px-8', isVisualMode ? 'py-5' : 'py-8')}>
            <a href="/pipelines" className={cn('inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors', isVisualMode ? 'mb-4' : 'mb-6')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </a>

            <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                    <GitMerge className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">{pipelineData.title}</h1>
                  <span
                    className={cn(
                      'ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      pipelineData.status === 'stable' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    )}
                  >
                    {pipelineData.status}
                  </span>
                </div>

                {!isVisualMode && (
                  <p className="text-xl text-muted-foreground mb-4 max-w-3xl">
                    {pipelineData.description}
                  </p>
                )}

                <div className={cn('flex flex-wrap items-center gap-4 text-sm text-muted-foreground', isVisualMode ? 'mb-0' : 'mb-6')}>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                      {pipelineData.author?.charAt(0) || '?'}
                    </div>
                    <span className="font-medium text-foreground">{pipelineData.author || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{t('common.updated')} {pipelineData.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>v{pipelineData.version || '1.0.0'}</span>
                  </div>
                </div>

                {!isVisualMode && (
                  <div className="flex flex-wrap gap-2">
                    {pipelineData.tags?.map((tag: string) => (
                      <span key={tag} className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-3 mt-4 md:mt-0">
                <div className="flex flex-col gap-3">
                  <div className="inline-flex rounded-xl border bg-muted/50 p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setViewMode('files')}
                      className={cn(
                        'w-1/2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        viewMode === 'files' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {t('pipeline.view.files')}
                    </button>
                    <button
                      type="button"
                      onClick={() => canUseVisualMode && setViewMode('visual')}
                      disabled={!canUseVisualMode}
                      className={cn(
                        'w-1/2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                        viewMode === 'visual' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {t('pipeline.view.visual')}
                    </button>
                  </div>
                  {!canUseVisualMode && (
                    <p className="text-xs text-muted-foreground text-center">{visualError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:px-8">
          {isVisualMode ? (
            <PipelineVisualizer
              files={visualPipelineFiles}
              initialFileName={initialVisualFileName}
              lang={currentLang}
              labels={visualLabels}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <FileViewer files={pipelineData.downloadFiles} emptyLabel={t('skill.files.empty')} />
              </div>

              <div className="space-y-6">
                <DownloadSection files={pipelineData.downloadFiles} packageName={packageName} lang={currentLang} />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
