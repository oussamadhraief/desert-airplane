import * as THREE from 'three';
import { modelLoader } from '../utils/ModelLoader';

export class CanyonWalls {
  constructor() {
    this.mesh = new THREE.Group();
    this.isLoaded = false;
    this.models = {};
    this.distance = 300;
    
    this.loadModels();
  }

  async loadModels() {
    try {
      const models = await modelLoader.loadMultiple([
        '/desert/Cliff_01.gltf',
        '/desert/CliffCorner_01.gltf',
        '/desert/CliffCorner_02.gltf',
      ]);

      this.models.cliff = models[0];
      this.models.corners = models.slice(1);

      this.createWalls();
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load canyon wall models:', error);
    }
  }

  createWalls() {
    const wallScale = 18;
    const cornerScale = 16;
    const spacing = 32;
    const segments = 12;
    const groundOffset = -8;

    for (let i = 0; i < segments; i++) {
      const offset = (i - segments / 2 + 0.5) * spacing;

      const backWall = this.models.cliff.clone();
      backWall.position.set(offset, groundOffset, -this.distance);
      backWall.rotation.y = 0;
      backWall.scale.set(wallScale, wallScale, wallScale);
      this.mesh.add(backWall);

      const frontWall = this.models.cliff.clone();
      frontWall.position.set(offset, groundOffset, this.distance);
      frontWall.rotation.y = Math.PI;
      frontWall.scale.set(wallScale, wallScale, wallScale);
      this.mesh.add(frontWall);

      const leftWall = this.models.cliff.clone();
      leftWall.position.set(-this.distance, groundOffset, offset);
      leftWall.rotation.y = Math.PI / 2;
      leftWall.scale.set(wallScale, wallScale, wallScale);
      this.mesh.add(leftWall);

      const rightWall = this.models.cliff.clone();
      rightWall.position.set(this.distance, groundOffset, offset);
      rightWall.rotation.y = -Math.PI / 2;
      rightWall.scale.set(wallScale, wallScale, wallScale);
      this.mesh.add(rightWall);
    }

    const cornerPositions = [
      { x: -this.distance, z: -this.distance, rotation: Math.PI / 2 },
      { x: this.distance, z: -this.distance, rotation: 0 },
      { x: this.distance, z: this.distance, rotation: -Math.PI / 2 },
      { x: -this.distance, z: this.distance, rotation: Math.PI },
    ];

    cornerPositions.forEach((pos, index) => {
      const corner = this.models.corners[index % 2].clone();
      corner.position.set(pos.x, groundOffset, pos.z);
      corner.rotation.y = pos.rotation;
      corner.scale.set(cornerScale, cornerScale, cornerScale);
      this.mesh.add(corner);
    });

    this.mesh.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      }
    });
  }

  update(cameraPosition) {
    if (!this.isLoaded) return;
    this.mesh.position.x = cameraPosition.x;
    this.mesh.position.z = cameraPosition.z;
  }
}
