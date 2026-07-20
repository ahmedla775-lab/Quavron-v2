const ContentModel = require("../types/ContentModel");

class ContentNormalizer {
  normalize(item) {
    return new ContentModel(item);
  }

  normalizeMany(items = []) {
    return items.map((item) => this.normalize(item));
  }
}

module.exports = new ContentNormalizer();
