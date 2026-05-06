import React, { useState } from 'react';
import { Clock, Shuffle } from 'lucide-react';
import { ui } from '../i18n/utils';

type ItemType = 'skill' | 'pipeline' | 'custom';

type Item = {
  id: string;
  title?: string;
  description?: string;
  author?: string;
  type?: ItemType;
  tags?: string[];
  updatedAt?: string;
};

type TrendingSectionProps = {
  lang?: 'zh' | 'en';
  skillsData?: Item[];
  pipelinesData?: Item[];
  customsData?: Item[];
};

const typeRoutes: Record<ItemType, string> = {
  skill: 'skills',
  pipeline: 'pipelines',
  custom: 'customs',
};

function pickRandomItem(items: Item[], type: ItemType) {
  if (items.length === 0) return null;

  const item = items[Math.floor(Math.random() * items.length)];
  return { ...item, type };
}

export function TrendingSection({ lang = 'zh', skillsData = [], pipelinesData = [], customsData = [] }: TrendingSectionProps) {
  const t = (key: keyof typeof ui['zh']) => ui[lang][key];
  const [items] = useState(() => [
    pickRandomItem(skillsData, 'skill'),
    pickRandomItem(pipelinesData, 'pipeline'),
    pickRandomItem(customsData, 'custom'),
  ].filter((item): item is Item & { type: ItemType } => item !== null));
   
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">{t('trending.title')}</h2>
            <p className="text-muted-foreground">{t('trending.desc')}</p>
          </div>
          <a href="/search" className="text-sm font-medium text-primary hover:underline hidden sm:block">
            {t('trending.viewAll')}
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <a key={`${item.type}-${item.id}`} href={`/${typeRoutes[item.type]}/${item.id}`} className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-secondary-foreground">
                    {item.type}
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <Shuffle className="h-3.5 w-3.5" />
                    <span>{t('trending.randomBadge')}</span>
                  </div>
                </div>
                 
                <h3 className="font-semibold text-lg mb-2 transition-colors hover:text-primary">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="px-6 py-4 border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {item.author?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span>{item.author || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{item.updatedAt}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
