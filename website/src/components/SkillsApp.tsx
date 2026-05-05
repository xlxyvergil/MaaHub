import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { SkillsList } from './SkillsList';

export function SkillsApp({ skillsData = [] }: { skillsData?: any[] }) {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'en' || savedLang === 'zh') {
      setLang(savedLang);
    } else {
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

  if (!isClient) return <div className="min-h-screen" />;

  return (
    <>
      <Header lang={lang} toggleLang={toggleLang} />
      <main className="flex-1">
        <SkillsList lang={lang} initialSkills={skillsData} />
      </main>
    </>
  );
}