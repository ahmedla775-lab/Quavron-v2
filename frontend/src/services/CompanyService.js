const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

class CompanyService {
  async getFeed() {
    const response = await fetch(
      `${API}/api/company/feed`
    );

    const json = await response.json();

    if (!json.success) {
      throw new Error("Failed to load company feed");
    }

    return json.data;
  }
}

export default new CompanyService();
