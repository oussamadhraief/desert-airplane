export const SETTINGS = {
  renderer: {
    antialias: true,
    powerPreference: 'high-performance',
    pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1, // Cap at 2x to avoid extreme GPU load
    shadowMapType: 'PCFSoftShadowMap',
    outputColorSpace: 'srgb',
  },
  camera: {
    fov: 75,
    near: 0.1,
    far: 2000,
    position: { x: 0, y: 10, z: 30 },
  },
  airplane: {
    speed: 0.5,
    turnSpeed: 0.03,
    maxTilt: 0.3,
  },
  desert: {
    size: 500,
    segments: 200, // ↑ for smoother terrain
    anisotropy: 16,
  },
  shadows: {
    mapSize: 4096,
    camera: {
      near: 1,
      far: 1200,
      left: -600,
      right: 600,
      top: 600,
      bottom: -600,
    },
  },
};