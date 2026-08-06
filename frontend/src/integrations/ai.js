class AIIntegration {

  async chat(prompt, userId = "ahmed") {

    const baseURL = import.meta.env.VITE_AI_API_URL;

    const response = await fetch(
      `${baseURL}/api/think/${encodeURIComponent(prompt)}?user_id=${userId}`
    );

    return await response.json();

  }

}

export default new AIIntegration();
