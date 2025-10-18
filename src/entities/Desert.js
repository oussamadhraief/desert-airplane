import * as THREE from 'three';
import { modelLoader } from '../utils/ModelLoader';

export class Desert {
  constructor() {
    this.mesh = new THREE.Group();
    this.chunks = new Map();
    this.chunkSize = 50;
    this.renderDistance = 3;
    this.isLoaded = false;
    this.models = {};
    
    this.loadModels();
  }

  async loadModels() {
    try {
      const [ground, ...props] = await modelLoader.loadMultiple([
        '/desert/Ground_01.gltf',
        '/desert/Rock_01.gltf',
        '/desert/Rock_02.gltf',
        '/desert/Rock_03.gltf',
        '/desert/Rock_04.gltf',
        '/desert/Rock_05.gltf',
        '/desert/Cactus_01.gltf',
        '/desert/Cactus_02.gltf',
        '/desert/Cactus_03.gltf',
        '/desert/Tree_01.gltf',
      ]);

      this.models.ground = ground;
      this.models.rocks = props.slice(0, 5);
      this.models.cacti = props.slice(5, 8);
      this.models.trees = props.slice(8, 9);

      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load desert models:', error);
    }
  }

  seededRandom(x, z, seed = 0) {
    const n = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
  }

  getChunkKey(chunkX, chunkZ) {
    return `${chunkX},${chunkZ}`;
  }

  getChunkCoords(x, z) {
    return {
      chunkX: Math.floor(x / this.chunkSize),
      chunkZ: Math.floor(z / this.chunkSize),
    };
  }

  createChunk(chunkX, chunkZ) {
    if (!this.isLoaded) return null;

    const group = new THREE.Group();
    const offsetX = chunkX * this.chunkSize;
    const offsetZ = chunkZ * this.chunkSize;

    const ground = this.models.ground.clone();
    ground.position.set(offsetX, 0, offsetZ);
    ground.scale.set(11, 1, 11);
    ground.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = false;
      }
    });
    group.add(ground);

    const propCount = {
      rocks: 10,
      cacti: 4,
      trees: 2,
    };

    for (let i = 0; i < propCount.rocks; i++) {
      const x = this.seededRandom(chunkX, chunkZ, i * 10) * this.chunkSize - this.chunkSize / 2;
      const z = this.seededRandom(chunkX, chunkZ, i * 10 + 1) * this.chunkSize - this.chunkSize / 2;
      const modelIndex = Math.floor(this.seededRandom(chunkX, chunkZ, i * 10 + 2) * this.models.rocks.length);
      const scale = (1.5 + this.seededRandom(chunkX, chunkZ, i * 10 + 3) * 1) * 1.1;
      
      const rock = this.models.rocks[modelIndex].clone();
      rock.position.set(offsetX + x, 0, offsetZ + z);
      rock.rotation.y = this.seededRandom(chunkX, chunkZ, i * 10 + 4) * Math.PI * 2;
      rock.scale.set(scale, scale, scale);
      rock.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      group.add(rock);
    }

    for (let i = 0; i < propCount.cacti; i++) {
      const x = this.seededRandom(chunkX, chunkZ, i * 100) * this.chunkSize - this.chunkSize / 2;
      const z = this.seededRandom(chunkX, chunkZ, i * 100 + 1) * this.chunkSize - this.chunkSize / 2;
      const modelIndex = Math.floor(this.seededRandom(chunkX, chunkZ, i * 100 + 2) * this.models.cacti.length);
      const scale = (1.2 + this.seededRandom(chunkX, chunkZ, i * 100 + 3) * 0.8) * 1.1;
      
      const cactus = this.models.cacti[modelIndex].clone();
      cactus.position.set(offsetX + x, 0, offsetZ + z);
      cactus.rotation.y = this.seededRandom(chunkX, chunkZ, i * 100 + 4) * Math.PI * 2;
      cactus.scale.set(scale, scale, scale);
      cactus.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      group.add(cactus);
    }

    for (let i = 0; i < propCount.trees; i++) {
      const x = this.seededRandom(chunkX, chunkZ, i * 200) * this.chunkSize - this.chunkSize / 2;
      const z = this.seededRandom(chunkX, chunkZ, i * 200 + 1) * this.chunkSize - this.chunkSize / 2;
      const scale = (1 + this.seededRandom(chunkX, chunkZ, i * 200 + 2) * 0.5) * 1.1;
      
      const tree = this.models.trees[0].clone();
      tree.position.set(offsetX + x, 0, offsetZ + z);
      tree.rotation.y = this.seededRandom(chunkX, chunkZ, i * 200 + 3) * Math.PI * 2;
      tree.scale.set(scale, scale, scale);
      tree.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      group.add(tree);
    }

    return group;
  }

  update(playerPosition) {
    if (!this.isLoaded) return;

    const { chunkX, chunkZ } = this.getChunkCoords(playerPosition.x, playerPosition.z);
    const chunksToKeep = new Set();

    for (let x = chunkX - this.renderDistance; x <= chunkX + this.renderDistance; x++) {
      for (let z = chunkZ - this.renderDistance; z <= chunkZ + this.renderDistance; z++) {
        const key = this.getChunkKey(x, z);
        chunksToKeep.add(key);

        if (!this.chunks.has(key)) {
          const chunk = this.createChunk(x, z);
          if (chunk) {
            this.chunks.set(key, chunk);
            this.mesh.add(chunk);
          }
        }
      }
    }

    for (const [key, chunk] of this.chunks.entries()) {
      if (!chunksToKeep.has(key)) {
        this.mesh.remove(chunk);
        chunk.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else if (child.material.dispose) {
              child.material.dispose();
            }
          }
        });
        this.chunks.delete(key);
      }
    }
  }
}
