const BaseConnector = require("../BaseConnector");
const axios = require("axios");

class GitHubConnector extends BaseConnector {
  constructor() {
    super("github");
  }

  async fetchFeed(options = {}) {
    try {
      const response = await axios.get(
        "https://api.github.com/search/repositories",
        {
          params: {
            q: options.q || "javascript",
            sort: "stars",
            order: "desc",
            per_page: 10
          },
          headers: {
            Accept: "application/vnd.github+json"
          }
        }
      );

      return response.data.items.map(repo => ({
        id: `github-${repo.id}`,
        source: "github",
        type: "repository",
        title: repo.full_name,
        description: repo.description || "",
        author: repo.owner.login,
        url: repo.html_url,
        metadata: {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language
        },
        createdAt: repo.created_at
      }));

    } catch (error) {
      console.error(
        "[GitHubConnector]",
        error.message
      );

      return [];
    }
  }

  async fetchTrending(options = {}) {
    return this.fetchFeed(options);
  }
}

module.exports = GitHubConnector;
