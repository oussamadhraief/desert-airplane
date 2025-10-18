import * as THREE from 'three';
import { SETTINGS } from '../config/settings';

export class Airplane {
  constructor() {
    this.mesh = new THREE.Group();
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.tilt = { x: 0, z: 0 };
    
    this.createMesh();
    this.mesh.position.set(0, 20, 0);
  }

  createMesh() {
    const bodyGeometry = new THREE.BoxGeometry(2, 1, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xe8e8e8 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    this.mesh.add(body);

    const cockpitGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const cockpitMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.7
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.set(0, 0.5, 0.5);
    cockpit.scale.set(1, 0.7, 1.2);
    cockpit.castShadow = true;
    this.mesh.add(cockpit);

    const wingGeometry = new THREE.BoxGeometry(12, 0.2, 3);
    const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xd0d0d0 });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.set(0, 0, 0);
    wings.castShadow = true;
    this.mesh.add(wings);

    const tailGeometry = new THREE.BoxGeometry(0.3, 2, 2);
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xe8e8e8 });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(0, 1, -2.5);
    tail.castShadow = true;
    this.mesh.add(tail);

    const propellerGeometry = new THREE.BoxGeometry(0.2, 3, 0.3);
    const propellerMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    this.propeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
    this.propeller.position.set(0, 0, 2.2);
    this.mesh.add(this.propeller);
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

    this.propeller.rotation.z += 0.5;
  }
}
