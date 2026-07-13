import TERMINAL_COMMANDS from "./TerminalCommands";

class TerminalManager {

  constructor() {
    this.cwd = "/";
  }

  async execute(command, context = {}) {

    const input = command.trim();

    if (!input) {
      return "";
    }

    const parts = input.split(" ");
    const cmd = parts[0];
    const args = parts.slice(1);

    const files = context.files ?? [];

    switch (cmd) {

      case "help":
        return Object.entries(TERMINAL_COMMANDS)
          .map(([name, item]) => `${name} - ${item.description}`)
          .join("\n");

      case "pwd":
        return this.cwd;

      case "clear":
        return "__CLEAR__";

      case "echo":
        return args.join(" ");

      case "ls":
        if (files.length === 0) {
          return "No files.";
        }

        return files
          .map((file) => file.name)
          .join("\n");

      case "cd":
        return "Directory navigation coming soon...";

      case "mkdir":
        return "Folder creation coming soon...";

      case "touch":
        return "File creation coming soon...";

      case "git":
        return "Git integration coming soon...";

      case "npm":
        return "NPM integration coming soon...";

      case "node":
        return "Node runtime coming soon...";

      default:
        return `Command not found: ${cmd}`;

    }

  }

}

export default new TerminalManager();
