import * as THREE from 'three';
import { modelLoader } from '../utils/ModelLoader';

export class Desert {
  constructor() {
    this.mesh = new THREE.Group();
    this.isLoaded = false;
    this.models = {};
    this.size = 500;
    
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

      this.createTerrain();
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load desert models:', error);
    }
  }

  seededRandom(x, z, seed = 0) {
    const n = Math.sin(x * 12.9898 + z * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
  }

  createTerrain() {
    const geometry = new THREE.PlaneGeometry(this.size, this.size, 200, 200);
    const vertices = geometry.attributes.position.array;
    
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 1];
      const wave1 = Math.sin(x * 0.018) * Math.cos(z * 0.018) * 4;
      const wave2 = Math.sin(x * 0.045 + z * 0.045) * 2;
      const wave3 = Math.sin(x * 0.09) * Math.cos(z * 0.09) * 0.8;
      const ripple = Math.sin(Math.sqrt(x * x + z * z) * 0.025) * 1.2;
      vertices[i + 2] = wave1 + wave2 + wave3 + ripple;
    }
    
    geometry.computeVertexNormals();
    geometry.computeTangents();
    
    const uvs = geometry.attributes.uv.array.slice();
    geometry.setAttribute('uv2', new THREE.BufferAttribute(uvs, 2));
    
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(1024, 1024, 200, 1024, 1024, 1600);
    gradient.addColorStop(0, '#f5ead3');
    gradient.addColorStop(0.25, '#ede0b8');
    gradient.addColorStop(0.5, '#e8d4a0');
    gradient.addColorStop(0.75, '#ddc896');
    gradient.addColorStop(1, '#d4b88a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 2048);
    
    for (let i = 0; i < 20000; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const size = Math.random() * 5 + 0.5;
      const alpha = 0.02 + Math.random() * 0.1;
      const brightness = 200 + Math.random() * 40;
      ctx.fillStyle = `rgba(${brightness}, ${brightness - 20}, ${brightness - 60}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const size = Math.random() * 3;
      ctx.fillStyle = `rgba(${150 + Math.random() * 40}, ${130 + Math.random() * 35}, ${90 + Math.random() * 40}, 0.15)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const radius = 150 + Math.random() * 250;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, 'rgba(255, 240, 200, 0.4)');
      grad.addColorStop(1, 'rgba(200, 180, 140, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    texture.anisotropy = 16;
    
    const roughnessCanvas = document.createElement('canvas');
    roughnessCanvas.width = 1024;
    roughnessCanvas.height = 1024;
    const rCtx = roughnessCanvas.getContext('2d');
    rCtx.fillStyle = '#888888';
    rCtx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 4;
      const brightness = 100 + Math.random() * 100;
      rCtx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.3)`;
      rCtx.beginPath();
      rCtx.arc(x, y, size, 0, Math.PI * 2);
      rCtx.fill();
    }
    const roughnessMap = new THREE.CanvasTexture(roughnessCanvas);
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(3, 3);
    
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = 1024;
    normalCanvas.height = 1024;
    const nCtx = normalCanvas.getContext('2d');
    nCtx.fillStyle = '#8080ff';
    nCtx.fillRect(0, 0, 1024, 1024);
    
    for (let i = 0; i < 15000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 3.5;
      const r = 128 + (Math.random() - 0.5) * 60;
      const g = 128 + (Math.random() - 0.5) * 60;
      const b = 200 + Math.random() * 55;
      nCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
      nCtx.beginPath();
      nCtx.arc(x, y, size, 0, Math.PI * 2);
      nCtx.fill();
    }
    
    const normalMap = new THREE.CanvasTexture(normalCanvas);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(3, 3);
    
    const aoCanvas = document.createElement('canvas');
    aoCanvas.width = 512;
    aoCanvas.height = 512;
    const aoCtx = aoCanvas.getContext('2d');
    aoCtx.fillStyle = '#ffffff';
    aoCtx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 8 + 2;
      aoCtx.fillStyle = `rgba(0, 0, 0, ${0.05 + Math.random() * 0.15})`;
      aoCtx.beginPath();
      aoCtx.arc(x, y, size, 0, Math.PI * 2);
      aoCtx.fill();
    }
    const aoMap = new THREE.CanvasTexture(aoCanvas);
    aoMap.wrapS = THREE.RepeatWrapping;
    aoMap.wrapT = THREE.RepeatWrapping;
    aoMap.repeat.set(3, 3);
    
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughnessMap: roughnessMap,
      roughness: 0.92,
      metalness: 0,
      aoMap: aoMap,
      aoMapIntensity: 0.6,
      color: 0xfcf7ed,
      envMapIntensity: 0.4,
    });
    
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.castShadow = false;
    this.mesh.add(ground);

    const propCount = {
      rocks: 25,
      cacti: 20,
      trees: 10,
    };

    for (let i = 0; i < propCount.rocks; i++) {
      const x = (Math.random() - 0.5) * this.size;
      const z = (Math.random() - 0.5) * this.size;
      const modelIndex = Math.floor(Math.random() * this.models.rocks.length);
      const scale = (1.7 + Math.random() * 1) * 2;
      
      const rock = this.models.rocks[modelIndex].clone();
      rock.position.set(x, 0, z);
      rock.rotation.y = Math.random() * Math.PI * 2;
      rock.scale.set(scale, scale, scale);
      rock.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.mesh.add(rock);
    }

    for (let i = 0; i < propCount.cacti; i++) {
      const x = (Math.random() - 0.5) * this.size;
      const z = (Math.random() - 0.5) * this.size;
      const modelIndex = Math.floor(Math.random() * this.models.cacti.length);
      const scale = (1.2 + Math.random() * 0.8) * 2;
      
      const cactus = this.models.cacti[modelIndex].clone();
      cactus.position.set(x, 0, z);
      cactus.rotation.y = Math.random() * Math.PI * 2;
      cactus.scale.set(scale, scale, scale);
      cactus.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.mesh.add(cactus);
    }

    for (let i = 0; i < propCount.trees; i++) {
      const x = (Math.random() - 0.5) * this.size;
      const z = (Math.random() - 0.5) * this.size;
      const scale = (1 + Math.random() * 0.5) * 2;
      
      const tree = this.models.trees[0].clone();
      tree.position.set(x, 0, z);
      tree.rotation.y = Math.random() * Math.PI * 2;
      tree.scale.set(scale, scale, scale);
      tree.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.mesh.add(tree);
    }
  }
}
