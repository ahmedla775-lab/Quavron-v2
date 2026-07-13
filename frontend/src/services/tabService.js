class TabService {
  constructor() {
    this.tabs = [];
  }

  getTabs() {
    return this.tabs;
  }

  openTab(file) {
    const exists = this.tabs.find(
      (tab) => tab.id === file.id
    );

    if (!exists) {
      this.tabs.push(file);
    }

    return this.tabs;
  }

  closeTab(id) {
    this.tabs = this.tabs.filter(
      (tab) => tab.id !== id
    );

    return this.tabs;
  }
}

export default new TabService();

