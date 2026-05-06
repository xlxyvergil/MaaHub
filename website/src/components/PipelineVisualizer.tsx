import React from 'react';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

type PipelineFileOption = {
  fileName: string;
  data: unknown;
};

const MPE_EMBED_URL = 'https://mpe.codax.site/stable/?embed=true&origin=maahub';
const MPE_PROTOCOL = 'mpe-embed';
const MPE_PROTOCOL_VERSION = '1.0.0';
const HANDSHAKE_TIMEOUT_MS = 12000;

type VisualizerStatus = 'loading' | 'ready' | 'loaded' | 'error';

type PipelineVisualizerProps = {
  files: PipelineFileOption[];
  initialFileName?: string;
  lang?: 'zh' | 'en';
  labels: {
    loading: string;
    ready: string;
    handshakeFailed: string;
    loadFailed: string;
    fileLabel: string;
  };
};

type MpeMessage = {
  protocol?: string;
  type?: string;
  requestId?: string;
  payload?: {
    success?: boolean;
    error?: string;
    message?: string;
    fileName?: string;
  };
};

function createRequestId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildMessage(type: string, payload: unknown, requestId?: string) {
  return {
    protocol: MPE_PROTOCOL,
    version: MPE_PROTOCOL_VERSION,
    type,
    ...(requestId ? { requestId } : {}),
    payload,
  };
}

function buildInitMessage(lang: 'zh' | 'en', requestId: string) {
  return buildMessage(
    'mpe:init',
    {
      capabilities: {
        readOnly: false,
        allowCopy: true,
        allowUndoRedo: true,
        allowAutoLayout: true,
        allowAI: false,
        allowSearch: true,
        allowCustomTemplate: false,
      },
      ui: {
        hideHeader: true,
        hideToolbar: false,
        hiddenPanels: ['local-file', 'logger', 'exploration'],
      },
      locale: lang === 'zh' ? 'zh-CN' : 'en-US',
    },
    requestId
  );
}

function buildLoadMessage(fileName: string, pipeline: unknown, requestId: string) {
  return buildMessage(
    'mpe:loadPipeline',
    {
      fileName,
      data: pipeline,
    },
    requestId
  );
}

export function PipelineVisualizer({ files, initialFileName, lang = 'zh', labels }: PipelineVisualizerProps) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = React.useRef<number | null>(null);
  const initRequestIdRef = React.useRef<string>('');
  const loadRequestIdRef = React.useRef<string>('');
  const readyRef = React.useRef(false);
  const activeFileRef = React.useRef<PipelineFileOption | undefined>(undefined);
  const loadedFileNameRef = React.useRef<string | null>(null);
  const [status, setStatus] = React.useState<VisualizerStatus>('loading');
  const [error, setError] = React.useState<string | null>(null);
  const [activeFileName, setActiveFileName] = React.useState(initialFileName ?? files[0]?.fileName ?? '');

  React.useEffect(() => {
    const fallbackFileName = initialFileName ?? files[0]?.fileName ?? '';
    if (!files.some((file) => file.fileName === activeFileName)) {
      setActiveFileName(fallbackFileName);
    }
  }, [activeFileName, files, initialFileName]);

  const activeFile = React.useMemo(
    () => files.find((file) => file.fileName === activeFileName) ?? files[0],
    [activeFileName, files]
  );

  React.useEffect(() => {
    activeFileRef.current = activeFile;
  }, [activeFile]);

  const postToEditor = React.useCallback((message: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(message, '*');
  }, []);

  const loadFile = React.useCallback((file: PipelineFileOption) => {
    loadRequestIdRef.current = createRequestId('mpe-load');
    loadedFileNameRef.current = file.fileName;
    setStatus('ready');
    setError(null);
    postToEditor(buildLoadMessage(file.fileName, file.data, loadRequestIdRef.current));
  }, [postToEditor]);

  React.useEffect(() => {
    setStatus('loading');
    setError(null);
    readyRef.current = false;
    loadedFileNameRef.current = null;

    const handleMessage = (event: MessageEvent<MpeMessage>) => {
      const message = event.data;
      if (!message || message.protocol !== MPE_PROTOCOL) {
        return;
      }

      if (message.type === 'mpe:ready') {
        if (message.requestId && message.requestId !== initRequestIdRef.current) {
          return;
        }
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        readyRef.current = true;
        if (activeFileRef.current) {
          loadFile(activeFileRef.current);
        }
        return;
      }

      if (message.type === 'mpe:loadResult') {
        if (message.requestId && message.requestId !== loadRequestIdRef.current) {
          return;
        }
        if (message.payload?.success === false) {
          setStatus('error');
          setError(message.payload.error || message.payload.message || labels.loadFailed);
          return;
        }
        setStatus('loaded');
        return;
      }

      if (message.type === 'mpe:error') {
        setStatus('error');
        setError(message.payload?.error || message.payload?.message || labels.loadFailed);
      }
    };

    window.addEventListener('message', handleMessage);
    timeoutRef.current = window.setTimeout(() => {
      setStatus('error');
      setError(labels.handshakeFailed);
    }, HANDSHAKE_TIMEOUT_MS);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [labels.handshakeFailed, labels.loadFailed, loadFile]);

  React.useEffect(() => {
    if (!readyRef.current || !activeFile || loadedFileNameRef.current === activeFile.fileName) {
      return;
    }
    loadFile(activeFile);
  }, [activeFile, loadFile]);

  const handleLoad = () => {
    initRequestIdRef.current = createRequestId('mpe-init');
    postToEditor(buildInitMessage(lang, initRequestIdRef.current));
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-950 px-4 py-3 text-slate-100">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">MaaPipelineEditor</p>
          {files.length > 1 ? (
            <label className="mt-1 flex items-center gap-2 text-sm text-slate-300">
              <span className="whitespace-nowrap">{labels.fileLabel}</span>
              <select
                value={activeFileName}
                onChange={(event) => setActiveFileName(event.target.value)}
                className="min-w-[200px] rounded-md border border-white/10 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              >
                {files.map((file) => (
                  <option key={file.fileName} value={file.fileName}>
                    {file.fileName}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="truncate text-sm text-slate-300">{activeFile?.fileName}</p>
          )}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
          {status === 'error' ? (
            <AlertTriangle className="h-3.5 w-3.5 text-red-300" />
          ) : status === 'loaded' ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
          ) : (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" />
          )}
          <span>{status === 'error' ? error : status === 'loaded' ? labels.ready : labels.loading}</span>
        </div>
      </div>

      {status === 'error' && (
        <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
          {error || labels.loadFailed}
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={MPE_EMBED_URL}
        title="MaaPipelineEditor"
        className="h-[78vh] min-h-[620px] w-full bg-background"
        onLoad={handleLoad}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
