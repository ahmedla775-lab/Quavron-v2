class RankingEngine {

  score(content, preferences = {}) {

    let score = 0;

    // Popularity
    score += (content.views || 0) * 0.01;
    score += (content.likes || 0) * 2;
    score += (content.comments || 0) * 3;

    // Freshness
    if (content.publishedAt) {

      const age =
        Date.now() - new Date(content.publishedAt).getTime();

      const hours =
        age / (1000 * 60 * 60);

      score += Math.max(0, 50 - hours);
    }

    // User interests
    if (preferences.interests?.length) {

      const text =
        `${content.title} ${content.content}`
        .toLowerCase();

      preferences.interests.forEach(tag => {

        if (text.includes(tag.toLowerCase())) {
          score += 20;
        }

      });
    }

    return score;
  }


  rank(contents = [], preferences = {}) {

    return contents
      .map(item => ({
        ...item,
        rankingScore: this.score(item, preferences)
      }))
      .sort(
        (a, b) =>
          b.rankingScore - a.rankingScore
      );
  }

}

module.exports = new RankingEngine();
