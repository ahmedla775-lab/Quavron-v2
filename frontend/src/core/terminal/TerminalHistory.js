class TerminalHistory {

  constructor() {

    this.history = [];
    this.index = -1;

  }

  add(command) {

    if (!command.trim()) return;

    this.history.push(command);

    this.index = this.history.length;

  }

  previous() {

    if (this.index > 0) {

      this.index--;

    }

    return this.history[this.index] ?? "";

  }

  next() {

    if (this.index < this.history.length) {

      this.index++;

    }

    return this.history[this.index] ?? "";

  }

  clear() {

    this.history = [];

    this.index = -1;

  }

}

export default TerminalHistory;
