import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader();
    this.cache = new Map();
  }

  async load(path) {
    if (this.cache.has(path)) {
      const cached = this.cache.get(path);
      return this.cloneWithMaterials(cached);
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (gltf) => {
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              if (child.material) {
                if (child.material.map) {
                  child.material.map.colorSpace = THREE.SRGBColorSpace;
                }
                child.material.needsUpdate = true;
              }
            }
          });
          
          this.cache.set(path, gltf.scene);
          resolve(this.cloneWithMaterials(gltf.scene));
        },
        undefined,
        (error) => {
          console.error(`Error loading model ${path}:`, error);
          reject(error);
        }
      );
    });
  }

  cloneWithMaterials(scene) {
    const cloned = scene.clone(true);
    
    const materialMap = new Map();
    scene.traverse((original) => {
      if (original.isMesh && original.material) {
        materialMap.set(original.uuid, original.material);
      }
    });

    cloned.traverse((clone) => {
      if (clone.isMesh && materialMap.has(clone.uuid)) {
        clone.material = materialMap.get(clone.uuid);
      }
    });

    return cloned;
  }

  async loadMultiple(paths) {
    return Promise.all(paths.map(path => this.load(path)));
  }
}

export const modelLoader = new ModelLoader();
