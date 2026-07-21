class FeedService {
  async getFeed() {
    const API =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000";

    const response = await fetch(`${API}/api/qce/feed`);

    if (!response.ok) {
      throw new Error("Failed to load Social Hub.");
    }

    const result = await response.json();

    return result.data || [];
  }
}

export default new FeedService();
