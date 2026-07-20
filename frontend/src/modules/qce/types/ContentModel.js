export function createContentModel(data = {}) {
  return {
    id: data.id ?? "",

    source: data.source ?? "",

    type: data.type ?? "",

    externalId: data.externalId ?? "",

    title: data.title ?? "",

    content: data.content ?? "",

    description: data.description ?? "",

    thumbnail: data.thumbnail ?? "",

    media: data.media ?? "",

    url: data.url ?? "",

    author: data.author ?? "",

    authorAvatar: data.authorAvatar ?? "",

    authorUrl: data.authorUrl ?? "",

    language: data.language ?? "en",

    category: data.category ?? "",

    tags: data.tags ?? [],

    likes: data.likes ?? 0,

    comments: data.comments ?? 0,

    shares: data.shares ?? 0,

    views: data.views ?? 0,

    publishedAt: data.publishedAt ?? null,

    fetchedAt: data.fetchedAt ?? null,

    metadata: data.metadata ?? {},
  };
}
