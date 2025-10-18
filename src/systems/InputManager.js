export class InputManager {
  constructor() {
    this.keys = new Map();
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys.set(e.key.toLowerCase(), true);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.key.toLowerCase(), false);
    });
  }

  isPressed(key) {
    return this.keys.get(key.toLowerCase()) || false;
  }
}
