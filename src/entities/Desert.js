import * as THREE from 'three';
import { SETTINGS } from '../config/settings';

export class Desert {
  constructor() {
    this.createMesh();
  }

  createMesh() {
    const geometry = new THREE.PlaneGeometry(
      SETTINGS.desert.size,
      SETTINGS.desert.size,
      SETTINGS.desert.segments,
      SETTINGS.desert.segments
    );

    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      vertices[i + 2] = Math.sin(x * 0.05) * 2 + Math.cos(y * 0.05) * 2;
    }
    geometry.computeVertexNormals();

    const texture = this.createSandTexture();
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.1,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
  }

  createSandTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#e8d4a0');
    gradient.addColorStop(0.5, '#d4b896');
    gradient.addColorStop(1, '#c4a582');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = `rgba(${180 + Math.random() * 40}, ${160 + Math.random() * 40}, ${120 + Math.random() * 30}, ${0.1 + Math.random() * 0.2})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    
    return texture;
  }
}
