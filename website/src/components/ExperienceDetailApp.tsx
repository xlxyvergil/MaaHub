import React from 'react';
import { Header } from './Header';
import { ArrowLeft, BookOpen, Star, Clock, Copy, Check, Terminal, FileCode, Tag, ArrowRight } from 'lucide-react';
import { ui } from '../i18n/utils';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

// In a real app, this data would come from the astro page props (fetched from getCollection)
export function ExperienceDetailApp({ experienceId, experienceData, lang = 'zh' }: { experienceId: string, experienceData: any, lang?: 'zh' | 'en' }) {
  const [currentLang, setCurrentLang] = React.useState(lang);
  const [isCopied1, setIsCopied1] = React.useState(false);
  const [isCopied2, setIsCopied2] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('readme');

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'en' || savedLang === 'zh') {
      setCurrentLang(savedLang);
    }
  }, []);

  if (!isClient) return <div className="min-h-screen" />;

  const toggleLang = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setCurrentLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key: keyof typeof ui['zh']) => ui[currentLang][key as keyof typeof ui['zh']] || key;

  const handleCopy1 = () => {
    navigator.clipboard.writeText(`git clone https://github.com/MaaXYZ/MaaHub.git --depth=1`);
    setIsCopied1(true);
    setTimeout(() => setIsCopied1(false), 2000);
  };

  const handleCopy2 = () => {
    navigator.clipboard.writeText(`cp -r MaaHub/Storage/experiences/${experienceData.author}/${experienceData.id.split('/')[1]} ./your_agent_experiences/`);
    setIsCopied2(true);
    setTimeout(() => setIsCopied2(false), 2000);
  };

  return (
    <>
      <Header lang={currentLang} toggleLang={toggleLang} />
      
      <main className="flex-1 bg-muted/10 pb-20">
        {/* Breadcrumb & Header Banner */}
        <div className="bg-background border-b">
          <div className="container mx-auto px-4 py-8 md:px-8">
            <a href="/experiences" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </a>
            
            <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">{experienceData.title}</h1>
                  <span className={cn(
                    "ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    experienceData.status === 'stable' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {experienceData.status}
                  </span>
                </div>
                
                <p className="text-xl text-muted-foreground mb-4 max-w-3xl">
                  {experienceData.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                      {experienceData.author.charAt(0)}
                    </div>
                    <span className="font-medium text-foreground">{experienceData.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{t('common.updated')} {experienceData.updatedAt}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>v{experienceData.version || '1.0.0'}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {experienceData.tags?.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-3 mt-4 md:mt-0">
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <h3 className="font-medium mb-3 flex items-center text-sm">
                    <Terminal className="mr-2 h-4 w-4 text-muted-foreground" />
                    {t('skill.install')}
                  </h3>
                  <div className="relative mb-2">
                    <pre className="overflow-x-auto rounded bg-muted p-3 text-xs font-mono whitespace-pre-wrap break-all pr-10">
                      <code>{`git clone https://github.com/MaaXYZ/MaaHub.git --depth=1`}</code>
                    </pre>
                    <button 
                      onClick={handleCopy1}
                      className="absolute right-2 top-2 rounded bg-background p-1.5 text-muted-foreground hover:text-foreground border shadow-sm transition-colors"
                      title="Copy clone command"
                    >
                      {isCopied1 ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="relative">
                    <pre className="overflow-x-auto rounded bg-muted p-3 text-xs font-mono whitespace-pre-wrap break-all pr-10">
                      <code>{`cp -r MaaHub/Storage/experiences/${experienceData.author}/${experienceData.id.split('/')[1]} ./your_agent_experiences/`}</code>
                    </pre>
                    <button 
                      onClick={handleCopy2}
                      className="absolute right-2 top-2 rounded bg-background p-1.5 text-muted-foreground hover:text-foreground border shadow-sm transition-colors"
                      title="Copy copy command"
                    >
                      {isCopied2 ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 py-8 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="border-b bg-muted/40 px-4 flex">
                  <button 
                    onClick={() => setActiveTab('readme')}
                    className={cn(
                      "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                      activeTab === 'readme' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t('skill.readme')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('files')}
                    className={cn(
                      "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                      activeTab === 'files' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t('skill.files')}
                  </button>
                </div>
                
                <div className="p-6">
                  {activeTab === 'readme' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
                      {/* In a real Astro app, this would be the rendered markdown content passed as children or a prop */}
                      <h1>{experienceData.title}</h1>
                      <p>{experienceData.description}</p>
                      <h2>Overview</h2>
                      <p>This is a mock readme representation. In the actual implementation, the markdown file from the storage directory would be parsed and injected here using Astro's content collection rendering capabilities.</p>
                      <pre><code>{`{
  "name": "${experienceData.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}",
  "log": {}
}`}</code></pre>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center p-2 rounded-md hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border transition-colors">
                        <FileCode className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-sm font-medium">meta.json</span>
                        <span className="ml-auto text-xs text-muted-foreground">324 B</span>
                      </div>
                      <div className="flex items-center p-2 rounded-md hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border transition-colors">
                        <FileCode className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="text-sm font-medium">README.md</span>
                        <span className="ml-auto text-xs text-muted-foreground">2.4 KB</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
