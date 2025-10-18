import * as THREE from 'three';
import { SETTINGS } from '../config/settings';
import { modelLoader } from '../utils/ModelLoader';

export class Airplane {
  constructor() {
    this.mesh = new THREE.Group();
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.tilt = { x: 0, z: 0 };
    this.model = null;
    this.propeller = null;
    this.isLoaded = false;
    
    this.mesh.position.set(0, 20, 0);
    this.loadModel();
  }

  async loadModel() {
    try {
      this.model = await modelLoader.load('/desert/war_plane.glb');
      
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.model.scale.set(3, 3, 3);
      this.model.rotation.y = Math.PI;
      this.mesh.add(this.model);
      
      this.propeller = this.model.getObjectByName('Propeller');
      if (!this.propeller) {
        this.model.traverse((child) => {
          if (child.isMesh && child.name.toLowerCase().includes('prop')) {
            this.propeller = child;
          }
        });
      }

      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load airplane model:', error);
    }
  }

  update(inputManager) {
    const config = SETTINGS.airplane;
    
    if (inputManager.isPressed('w')) {
      this.tilt.x = THREE.MathUtils.lerp(this.tilt.x, -config.maxTilt, 0.1);
    } else if (inputManager.isPressed('s')) {
      this.tilt.x = THREE.MathUtils.lerp(this.tilt.x, config.maxTilt, 0.1);
    } else {
      this.tilt.x = THREE.MathUtils.lerp(this.tilt.x, 0, 0.1);
    }

    if (inputManager.isPressed('a')) {
      this.mesh.rotation.y += config.turnSpeed;
      this.tilt.z = THREE.MathUtils.lerp(this.tilt.z, config.maxTilt, 0.1);
    } else if (inputManager.isPressed('d')) {
      this.mesh.rotation.y -= config.turnSpeed;
      this.tilt.z = THREE.MathUtils.lerp(this.tilt.z, -config.maxTilt, 0.1);
    } else {
      this.tilt.z = THREE.MathUtils.lerp(this.tilt.z, 0, 0.1);
    }

    this.mesh.rotation.x = this.tilt.x;
    this.mesh.rotation.z = this.tilt.z;

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(this.mesh.quaternion);
    this.velocity.copy(forward.multiplyScalar(config.speed));
    this.mesh.position.add(this.velocity);

    this.mesh.position.y = Math.max(5, Math.min(50, this.mesh.position.y));

    if (this.propeller) {
      this.propeller.rotation.z += 0.5;
    }
  }
}
