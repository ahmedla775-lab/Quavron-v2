import AIIntegration from "../integrations/ai";

class AIService {

  async ask(prompt) {

    return await AIIntegration.chat(prompt);

  }

}

export default new AIService();

