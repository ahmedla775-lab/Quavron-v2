class AIIntegration {
  async chat(prompt, userId = null) {
    const baseURL = import.meta.env.VITE_AI_API;

    if (!baseURL) {
      throw new Error("VITE_AI_API is not configured");
    }

    const user =
      JSON.parse(localStorage.getItem("user") || "{}");

    const resolvedUserId =
      userId ||
      user.id ||
      user.uid ||
      user.username ||
      user.email ||
      "guest";

    const url =
      `${baseURL}/api/think/${encodeURIComponent(prompt)}` +
      `?user_id=${encodeURIComponent(resolvedUserId)}`;

    const res = await fetch(url);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Quavron AI request failed (${res.status})${body ? `: ${body}` : ""}`
      );
    }

    return await res.json();
  }
}

export default new AIIntegration();
