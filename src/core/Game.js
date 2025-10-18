import * as THREE from 'three';
import { SETTINGS } from '../config/settings';
import { Airplane } from '../entities/Airplane';
import { Desert } from '../entities/Desert';
import { InputManager } from '../systems/InputManager';

export class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 100, 500);
    this.isPaused = false;

    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.setupEntities();
    this.setupSystems();
    this.setupUI();

    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer(SETTINGS.renderer);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      SETTINGS.camera.fov,
      window.innerWidth / window.innerHeight,
      SETTINGS.camera.near,
      SETTINGS.camera.far
    );
    this.camera.position.set(
      SETTINGS.camera.position.x,
      SETTINGS.camera.position.y,
      SETTINGS.camera.position.z
    );
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    this.scene.add(sunLight);
  }

  setupEntities() {
    this.airplane = new Airplane();
    this.scene.add(this.airplane.mesh);

    this.desert = new Desert();
    this.scene.add(this.desert.mesh);
  }

  setupSystems() {
    this.inputManager = new InputManager();
  }

  setupUI() {
    const info = document.createElement('div');
    info.id = 'info';
    info.innerHTML = `
      <div class="controls-title">CONTROLS</div>
      <div class="control-item"><span class="key">W</span> → Pitch Down</div>
      <div class="control-item"><span class="key">S</span> → Pitch Up</div>
      <div class="control-item"><span class="key">A</span> → Turn Left</div>
      <div class="control-item"><span class="key">D</span> → Turn Right</div>
      <div class="control-item"><span class="key">P</span> → Pause</div>
    `;
    document.body.appendChild(info);

    this.pauseIndicator = document.createElement('div');
    this.pauseIndicator.id = 'pause-indicator';
    this.pauseIndicator.textContent = 'PAUSED';
    this.pauseIndicator.style.display = 'none';
    document.body.appendChild(this.pauseIndicator);
  }

  onKeyDown(e) {
    if (e.key.toLowerCase() === 'p') {
      this.togglePause();
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.pauseIndicator.style.display = this.isPaused ? 'block' : 'none';
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    if (this.isPaused) return;

    this.airplane.update(this.inputManager);
    
    const cameraOffset = new THREE.Vector3(0, 10, 30);
    cameraOffset.applyQuaternion(this.airplane.mesh.quaternion);
    this.camera.position.copy(this.airplane.mesh.position).add(cameraOffset);
    this.camera.lookAt(this.airplane.mesh.position);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.update();
    this.render();
  }

  start() {
    this.animate();
  }
}
