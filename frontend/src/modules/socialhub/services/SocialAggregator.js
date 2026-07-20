import { DEFAULT_SOURCES, SOURCE_STATUS } from "../constants/sources";

class SocialAggregator {
  constructor() {
    this.services = new Map();
    this.sources = [...DEFAULT_SOURCES];
  }

  register(sourceId, service) {
    this.services.set(sourceId, service);
  }

  unregister(sourceId) {
    this.services.delete(sourceId);
  }

  getRegisteredSources() {
    return [...this.services.keys()];
  }

  getAvailableSources() {
    return this.sources.filter(
      (source) => source.status === SOURCE_STATUS.ENABLED
    );
  }

  async fetchAll(options = {}) {
    const results = [];

    for (const source of this.getAvailableSources()) {
      const service = this.services.get(source.id);

      if (!service || typeof service.fetch !== "function") {
        continue;
      }

      try {
        const items = await service.fetch(options);

        if (Array.isArray(items)) {
          results.push(...items);
        }
      } catch (error) {
        console.error(
          `[SocialHub] Failed to fetch from ${source.id}`,
          error
        );
      }
    }

    return this.normalize(results);
  }

  normalize(items) {
    return items
      .filter(Boolean)
      .map((item) => ({
        id: item.id,
        source: item.source,
        type: item.type,
        externalId: item.externalId ?? null,
        title: item.title ?? "",
        content: item.content ?? "",
        thumbnail: item.thumbnail ?? "",
        media: item.media ?? "",
        author: item.author ?? "",
        authorAvatar: item.authorAvatar ?? "",
        authorUrl: item.authorUrl ?? "",
        url: item.url ?? "",
        tags: item.tags ?? [],
        language: item.language ?? "en",
        likes: item.likes ?? 0,
        comments: item.comments ?? 0,
        views: item.views ?? 0,
        publishedAt: item.publishedAt ?? null,
        fetchedAt: new Date().toISOString(),
      }));
  }
}

export default new SocialAggregator();
