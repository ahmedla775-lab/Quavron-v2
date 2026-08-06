class AIIntegration {

  async chat(prompt) {

    const response = await fetch(
      `http://100.115.48.157:8000/api/think/${encodeURIComponent(prompt)}`
    );

    return await response.json();

  }

}

export default new AIIntegration();
