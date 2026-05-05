export const defaultLang = "zh";

export const languages = {
  zh: "简体中文",
  en: "English",
};

export const ui = {
  zh: {
    "nav.skills": "技能 (Skills)",
    "nav.pipelines": "流水线 (Pipelines)",
    "nav.customs": "自定义代码 (Customs)",
    "nav.experiences": "经验 (Experiences)",
    "search.placeholder": "搜索资源...",
    "hero.badge": "MaaXYZ 出品",
    "hero.title.prefix": "开放分享式",
    "hero.title.highlight": "MaaFramework",
    "hero.title.suffix": "社区",
    "hero.desc":
      "发现、挑选并集成由社区驱动的 skill、pipeline、custom 与前辈经验，为您的 Maa 项目赋能！",
    "hero.explore": "探索市场",
    "hero.contribute": "参与贡献",
    "hero.available": "已收录",
    "category.skills.title": "技能 (Skills)",
    "category.skills.desc":
      "开箱即用的实用 Agent skill，帮助您的 AI 更好的理解 MaaFramework。",
    "category.pipelines.title": "流水线 (Pipelines)",
    "category.pipelines.desc": "常见范式、复杂场景与最佳实践。",
    "category.customs.title": "自定义代码 (Customs)",
    "category.customs.desc": "Python、Go 等多语言的自定义扩展代码。",
    "category.experiences.title": "经验 (Experiences)",
    "category.experiences.desc": "来自社区的教程、指南与最佳实践。",
    "trending.title": "热门推荐",
    "trending.desc": "本周最受欢迎的资源",
    "trending.viewAll": "查看所有热门",
    "contribute.title": "准备好贡献了吗？",
    "contribute.desc":
      "MaaHub 由社区驱动，与成千上万开发者分享您的 skill、pipeline、custom 和您宝贵的经验。",
    "contribute.docs": "阅读 PR 文档",
    "footer.built": "由 MaaXYZ 社区构建。",
    "footer.github": "",
    "footer.on": " ",
  },
  en: {
    "nav.skills": "Skills",
    "nav.pipelines": "Pipelines",
    "nav.customs": "Customs",
    "nav.experiences": "Experiences",
    "search.placeholder": "Search resources...",
    "hero.badge": "By MaaXYZ",
    "hero.title.prefix": "The Open & Shared",
    "hero.title.highlight": "MaaFramework",
    "hero.title.suffix": " Community",
    "hero.desc":
      "Discover, select, and integrate community-driven skills, pipelines, customs, and experiences to empower your Maa project!",
    "hero.explore": "Explore Market",
    "hero.contribute": "Contribute",
    "hero.available": "Available",
    "category.skills.title": "Skills",
    "category.skills.desc":
      "Ready-to-use Agent skills to help your AI better understand MaaFramework.",
    "category.pipelines.title": "Pipelines",
    "category.pipelines.desc":
      "Common paradigms, complex scenarios, and best practices.",
    "category.customs.title": "Customs",
    "category.customs.desc":
      "Custom extension code in Python, Go, and other languages.",
    "category.experiences.title": "Experiences",
    "category.experiences.desc":
      "Tutorials, guides, and best practices from the community.",
    "trending.title": "Trending Now",
    "trending.desc": "The most popular resources this week",
    "trending.viewAll": "View all trending",
    "contribute.title": "Ready to contribute?",
    "contribute.desc":
      "MaaHub is driven by the community. Share your skills, pipelines, customs, and valuable experiences with thousands of developers.",
    "contribute.docs": "Read PR Docs",
    "footer.built": "Built by the MaaXYZ community.",
    "footer.github": "",
    "footer.on": " ",
  },
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
