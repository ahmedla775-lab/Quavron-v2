class VercelIntegration {

  async deploy(project) {

    console.log("Deploying project...");

    return {
      success: true,
      project,
    };

  }

  async deployments() {

    return [];

  }

}

export default new VercelIntegration();

