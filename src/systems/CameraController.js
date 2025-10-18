export class CameraController {
  constructor() {
    this.pitch = 0;
    this.yaw = 0;
    this.distance = 30;
    this.minDistance = 10;
    this.maxDistance = 60;
    this.sensitivity = 0.003;
    this.isDragging = false;
    this.setupListeners();
  }

  setupListeners() {
    document.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        this.isDragging = true;
        document.body.style.cursor = 'grabbing';
      }
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
      document.body.style.cursor = 'default';
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.yaw -= e.movementX * this.sensitivity;
        this.pitch -= e.movementY * this.sensitivity;
        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
      }
    });

    document.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.distance += e.deltaY * 0.01;
      this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance));
    });

    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  getCameraOffset(planeQuaternion) {
    const spherical = {
      x: this.distance * Math.cos(this.pitch) * Math.sin(this.yaw),
      y: this.distance * Math.sin(this.pitch) + 10,
      z: this.distance * Math.cos(this.pitch) * Math.cos(this.yaw),
    };

    return spherical;
  }

  reset() {
    this.pitch = 0;
    this.yaw = 0;
    this.distance = 30;
  }
}
