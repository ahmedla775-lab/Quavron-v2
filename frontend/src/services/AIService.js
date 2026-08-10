import AIIntegration from "../integrations/ai";

class AIService {
  async ask(prompt, userId = null) {
    return await AIIntegration.chat(prompt, userId);
  }
}

export default new AIService();
