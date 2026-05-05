import React from 'react';
import { Star, Download, Clock } from 'lucide-react';
import { ui } from '../i18n/utils';

const mockItems = [
  {
    id: "misteo/json-processor",
    title: "JSON Processor Pro",
    description: "Advanced JSON parsing, transformation, and validation with auto-schema detection.",
    author: "misteo",
    type: "skill",
    stars: 128,
    downloads: "4.2k",
    updated: "2 days ago",
    tags: ["json", "data", "utility"]
  },
  {
    id: "alice/data-etl-flow",
    title: "Data ETL Flow",
    description: "Complete ETL pipeline for extracting data from APIs, transforming it, and loading to databases.",
    author: "alice",
    type: "pipeline",
    stars: 85,
    downloads: "1.5k",
    updated: "1 week ago",
    tags: ["etl", "pipeline", "database"]
  },
  {
    id: "bob/python-web-scraper",
    title: "Advanced Web Scraper",
    description: "Custom Python code for robust web scraping with proxy rotation and dynamic JS rendering support.",
    author: "bob",
    type: "custom",
    stars: 256,
    downloads: "8.9k",
    updated: "3 days ago",
    tags: ["python", "scraping", "web"]
  }
];

export function TrendingSection({ lang = 'zh' }: { lang?: 'zh' | 'en' }) {
  const t = (key: keyof typeof ui['zh']) => ui[lang][key];
  
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
          {mockItems.map((item) => (
            <div key={item.id} className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-secondary-foreground">
                    {item.type}
                  </span>
                  <div className="flex gap-2 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {item.stars}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors cursor-pointer">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="px-6 py-4 border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {item.author[0].toUpperCase()}
                  </div>
                  <span>{item.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{item.updated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
