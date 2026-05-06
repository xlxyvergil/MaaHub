import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Tag, ArrowRight, User, GitMerge } from 'lucide-react';
import { ui } from '../i18n/utils';
import { cn } from '../lib/utils';
import { sitePath } from '../lib/routes';

// Mock data, in a real app this would come from Astro props via getCollection
const mockPipelines = [
  {
    id: "misteo/auto-research",
    title: "Auto Research Pipeline",
    description: "Automatically researches a topic, summarizes it, and generates a report.",
    author: "misteo",
    tags: ["research", "automation"],
    status: "stable",
    updatedAt: "2026-05-05",
    version: "1.0.0",
    downloads: 450,
  }
];

export function PipelinesList({ lang = 'zh', initialPipelines = [] }: { lang?: 'zh' | 'en', initialPipelines?: any[] }) {
  const t = (key: keyof typeof ui['zh']) => ui[lang][key as keyof typeof ui['zh']] || key;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fallback to mock data if no initialPipelines provided
  const pipelinesData = initialPipelines.length > 0 ? initialPipelines : mockPipelines;

  const filteredPipelines = pipelinesData.filter(pipeline => {
    const titleMatch = pipeline.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const descMatch = pipeline.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesSearch = titleMatch || descMatch;
    const matchesStatus = activeStatus === "all" || pipeline.status === activeStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "newest") return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t('pipelines.title')}</h1>
          <p className="text-muted-foreground">{t('pipelines.desc')}</p>
        </div>
        
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('pipelines.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 sm:w-[250px]"
            />
          </div>
          
          <select 
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[150px]"
          >
            <option value="all">{t('pipelines.filter.all')}</option>
            <option value="stable">{t('pipelines.filter.stable')}</option>
            <option value="beta">{t('pipelines.filter.beta')}</option>
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[150px]"
          >
            <option value="newest">{t('pipelines.sort.newest')}</option>
          </select>
        </div>
      </div>

      {filteredPipelines.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 text-center">
          <Filter className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t('pipelines.empty')}</h3>
          <button 
            onClick={() => { setSearchQuery(""); setActiveStatus("all"); }}
            className="mt-4 text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPipelines.map((pipeline, i) => (
            <motion.a
              href={sitePath(`/pipelines/${pipeline.id}`)}
              key={pipeline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/50 hover:shadow-md h-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    pipeline.status === 'stable' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {pipeline.status}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Tag className="h-3 w-3" />
                    <span>v{pipeline.version || '1.0.0'}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1 flex items-center">
                  <GitMerge className="mr-2 h-5 w-5 text-purple-500" />
                  {pipeline.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">{pipeline.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {pipeline.tags?.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                    {pipeline.author?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-medium">{pipeline.author || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{pipeline.updatedAt}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
