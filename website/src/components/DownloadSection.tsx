import React from 'react';
import { Download, FileCode } from 'lucide-react';
import type { DownloadFile } from './FileViewer';
import { ui } from '../i18n/utils';

type DownloadSectionProps = {
  files?: DownloadFile[];
  packageName: string;
  lang: 'zh' | 'en';
};

export function DownloadSection({ files = [], packageName, lang }: DownloadSectionProps) {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadError, setDownloadError] = React.useState<string | null>(null);
  const t = (key: keyof typeof ui['zh']) => ui[lang][key as keyof typeof ui['zh']] || key;

  const hasFiles = files.length > 0;

  const handleDownload = async () => {
    if (!hasFiles) {
      setDownloadError(t('skill.download.empty'));
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();

      files.forEach((file) => {
        zip.file(`${packageName}/${file.path}`, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${packageName}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate ZIP package', error);
      setDownloadError(t('skill.download.failed'));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm p-5">
        <h3 className="font-bold mb-4">{t('skill.download.title')}</h3>
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading || !hasFiles}
          className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloading ? t('skill.download.preparing') : t('skill.download')}
        </button>
        <p className="text-xs text-muted-foreground mt-3">
          {t('skill.download.desc')}
        </p>
        {downloadError ? (
          <p className="text-xs text-red-500 mt-2">{downloadError}</p>
        ) : null}
      </div>

      {hasFiles ? (
        <div className="rounded-xl border bg-card shadow-sm p-5">
          <h3 className="font-bold mb-4">{t('skill.files')}</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.path} className="flex items-center text-sm py-2 px-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                <FileCode className="h-4 w-4 mr-3 flex-shrink-0 text-muted-foreground" />
                <span className="truncate flex-1 font-medium" title={file.path}>{file.path}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
