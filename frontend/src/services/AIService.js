import AIIntegration from "../integrations/ai";

class AIService {
  async ask(prompt, userId = "guest") {
    return await AIIntegration.chat(prompt, userId);
  }
}

export default new AIService();
