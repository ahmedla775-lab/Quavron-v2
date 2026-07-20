class ContentModel {
  constructor(data = {}) {
    this.id = data.id || "";
    this.source = data.source || "";
    this.type = data.type || "post";

    // المعرف الحقيقي داخل المنصة
    this.externalId = data.externalId || data.id || "";

    this.title = data.title || "";
    this.content = data.content || data.description || "";

    this.author = data.author || "";
    this.authorAvatar = data.authorAvatar || "";
    this.authorUrl = data.authorUrl || "";

    this.url = data.url || "";

    this.thumbnail = data.thumbnail || "";
    this.media = data.media || "";

    this.likes = data.likes || 0;
    this.comments = data.comments || 0;
    this.views = data.views || 0;

    this.tags = data.tags || [];
    this.language = data.language || "en";

    this.publishedAt =
      data.publishedAt ||
      data.createdAt ||
      new Date().toISOString();
  }
}

module.exports = ContentModel;
