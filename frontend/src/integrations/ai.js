class AIIntegration {
  async chat(prompt, userId = "guest") {
    const baseURL = import.meta.env.VITE_AI_API;

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
