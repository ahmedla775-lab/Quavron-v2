class AIIntegration {
  async chat(prompt, userId = null) {
    const baseURL = import.meta.env.VITE_AI_API;

    if (!baseURL) {
      throw new Error("VITE_AI_API is not configured");
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const resolvedUserId =
      userId ||
      user.id ||
      user.uid ||
      user.username ||
      user.email ||
      "guest";

    const res = await fetch(`${baseURL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: resolvedUserId,
        message: prompt,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");

      throw new Error(
        `Quavron AI request failed (${res.status})${
          body ? `: ${body}` : ""
        }`
      );
    }

    return await res.json();
  }
}

export default new AIIntegration();
