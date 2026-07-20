export const SOURCES = {
  YOUTUBE: "youtube",
  X: "x",
  TIKTOK: "tiktok",
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  REDDIT: "reddit",
  GITHUB: "github",
  HACKERNEWS: "hackernews",
  DEVTO: "devto",
  MEDIUM: "medium",
  RSS: "rss",
  NEWS: "news",
};

export const SOURCE_TYPES = {
  VIDEO: "video",
  SHORT: "short",
  POST: "post",
  ARTICLE: "article",
  REPOSITORY: "repository",
};

export const SOURCE_STATUS = {
  ENABLED: "enabled",
  DISABLED: "disabled",
};

export const DEFAULT_SOURCES = [
  {
    id: SOURCES.YOUTUBE,
    name: "YouTube",
    type: SOURCE_TYPES.VIDEO,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.X,
    name: "X",
    type: SOURCE_TYPES.POST,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.TIKTOK,
    name: "TikTok",
    type: SOURCE_TYPES.SHORT,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.FACEBOOK,
    name: "Facebook",
    type: SOURCE_TYPES.POST,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.INSTAGRAM,
    name: "Instagram",
    type: SOURCE_TYPES.POST,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.REDDIT,
    name: "Reddit",
    type: SOURCE_TYPES.POST,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.GITHUB,
    name: "GitHub",
    type: SOURCE_TYPES.REPOSITORY,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.HACKERNEWS,
    name: "Hacker News",
    type: SOURCE_TYPES.ARTICLE,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.DEVTO,
    name: "Dev.to",
    type: SOURCE_TYPES.ARTICLE,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.MEDIUM,
    name: "Medium",
    type: SOURCE_TYPES.ARTICLE,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.RSS,
    name: "RSS",
    type: SOURCE_TYPES.ARTICLE,
    status: SOURCE_STATUS.ENABLED,
  },
  {
    id: SOURCES.NEWS,
    name: "News",
    type: SOURCE_TYPES.ARTICLE,
    status: SOURCE_STATUS.ENABLED,
  },
];
