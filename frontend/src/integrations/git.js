class GitIntegration {

  async commit(message) {

    console.log("Commit:", message);

  }

  async push() {

    console.log("Push");

  }

  async pull() {

    console.log("Pull");

  }

}

export default new GitIntegration();

