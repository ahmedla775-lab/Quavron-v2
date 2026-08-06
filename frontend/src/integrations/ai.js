class AIIntegration {
  async chat(prompt) {
    const baseURL = import.meta.env.VITE_AI_API;

    const user =
      JSON.parse(localStorage.getItem("user") || "{}");

    const userId =
      user.id ||
      user.uid ||
      user.username ||
      user.email ||
      "guest";

    const res = await fetch(
      `${baseURL}/api/think/${encodeURIComponent(prompt)}?user_id=${encodeURIComponent(userId)}`
    );

    if (!res.ok) {
      throw new Error("AI request failed");
    }

    return await res.json();
  }
}

export default new AIIntegration();
