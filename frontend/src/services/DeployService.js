import VercelIntegration from "../integrations/vercel";

class DeployService {

  async deploy(project) {

    return await VercelIntegration.deploy(project);

  }

}

export default new DeployService();

