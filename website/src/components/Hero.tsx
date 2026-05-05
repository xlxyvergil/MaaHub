import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Puzzle, GitBranch, Code2, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { ui } from '../i18n/utils';

export function Hero({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const t = (key: keyof typeof ui['zh']) => ui[lang][key];
  
  const categories = [
    {
      title: t('category.skills.title'),
      description: t('category.skills.desc'),
      icon: Puzzle,
      href: "/skills",
      count: 124,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      title: t('category.pipelines.title'),
      description: t('category.pipelines.desc'),
      icon: GitBranch,
      href: "/pipelines",
      count: 45,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    {
      title: t('category.customs.title'),
      description: t('category.customs.desc'),
      icon: Code2,
      href: "/customs",
      count: 89,
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    },
    {
      title: t('category.experiences.title'),
      description: t('category.experiences.desc'),
      icon: BookOpen,
      href: "/experiences",
      count: 234,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    }
  ];

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="container relative mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            {t('hero.badge')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
          >
            {t('hero.title.prefix')} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              {t('hero.title.highlight')}
            </span>
            {t('hero.title.suffix') && ` ${t('hero.title.suffix')}`}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl"
          >
            {t('hero.desc')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="/skills" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8">
              {t('hero.explore')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a href="https://github.com/MaaXYZ/MaaHub" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
              {t('hero.contribute')}
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <a 
                key={category.title} 
                href={category.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className={cn("inline-flex rounded-lg p-3 border mb-4", category.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                    {category.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">{t('hero.available')}</span>
                  <span className="text-sm font-bold bg-secondary px-2 py-1 rounded-md">{category.count}</span>
                </div>
              </a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
