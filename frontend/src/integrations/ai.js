class AIIntegration {

  async chat(prompt) {

    return {
      role: "assistant",
      message: "AI integration is ready.",
    };

  }

}

export default new AIIntegration();

