import GitIntegration from "../integrations/git";

class GitService {

  async commit(message) {

    return await GitIntegration.commit(message);

  }

  async push() {

    return await GitIntegration.push();

  }

  async pull() {

    return await GitIntegration.pull();

  }

}

export default new GitService();

