import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { TrendingSection } from './Trending';
import { ui } from '../i18n/utils';

type AppProps = {
  skillsData?: any[];
  pipelinesData?: any[];
  customsData?: any[];
};

export function App({ skillsData = [], pipelinesData = [], customsData = [] }: AppProps) {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'en' || savedLang === 'zh') {
      setLang(savedLang);
    } else {
      // documentElement.lang was set by astro layout script
      const docLang = document.documentElement.lang;
      if (docLang === 'en' || docLang === 'zh') {
         setLang(docLang);
      }
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key: keyof typeof ui['zh']) => ui[lang][key];

  if (!isClient) {
    return <div className="min-h-screen" />; // Use a minimal placeholder instead of null
  }

  return (
    <>
      <Header lang={lang} toggleLang={toggleLang} />
      
      <main className="flex-1">
        <Hero lang={lang} />
        <TrendingSection lang={lang} skillsData={skillsData} pipelinesData={pipelinesData} customsData={customsData} />
        
        <section className="py-20 border-t">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">{t('contribute.title')}</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('contribute.desc')}
            </p>
            <div className="flex justify-center gap-4">
              <a href="https://github.com/MaaXYZ/MaaHub/blob/main/docs/zh/contributing.md" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8">
                {t('contribute.docs')}
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-8">
          <p className="text-sm text-muted-foreground leading-loose text-center md:text-left">
            {t('footer.built')}<a href="https://github.com/MaaXYZ/MaaHub" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">{t('footer.github')}</a>{t('footer.on')}
          </p>
        </div>
      </footer>
    </>
  );
}
