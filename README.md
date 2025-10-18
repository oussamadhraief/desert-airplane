# Desert Airplane

A Three.js flight simulation game where you control a war airplane flying over an infinite low-poly desert with WASD controls.

## Tech Stack

- **Three.js** - 3D graphics library with GLTF model loading
- **Vite** - Build tool for optimal performance
- **pnpm** - Fast, disk space efficient package manager

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Controls

- **W** - Pitch down
- **S** - Pitch up
- **A** - Turn left
- **D** - Turn right
- **P** - Pause/Unpause

## Project Structure

```
src/
├── core/              # Core game engine components
│   └── Game.js        # Main game loop and scene management
├── entities/          # Game objects
│   ├── Airplane.js    # War plane with GLTF model
│   ├── Desert.js      # Infinite chunk-based terrain
│   └── CanyonWalls.js # Surrounding canyon walls
├── systems/           # Game systems
│   └── InputManager.js # Keyboard input handling
├── config/            # Configuration files
│   └── settings.js    # Game settings and constants
├── utils/             # Utility functions
│   └── ModelLoader.js # GLTF/GLB model loader with caching
├── main.js            # Application entry point
└── style.css          # Global styles
```

## Features

### Infinite Terrain
- **Chunk-based system**: 50x50 unit chunks load/unload dynamically
- **3-chunk render distance** for optimal performance
- **Seeded random generation** ensures consistent prop placement
- Fly infinitely in any direction

### Low-Poly Desert Assets
- **War plane model** (war_plane.glb)
- **5 rock variants** for terrain detail
- **3 cactus types** for desert vegetation
- **Trees** for visual variety
- **Ground tiles** with low-poly aesthetic
- **Canyon walls** surrounding the play area

### Performance Optimizations
- Model caching to prevent redundant loading
- Efficient chunk culling system
- Proper memory management with geometry/material disposal
- Warm desert atmosphere with fog
- Shadow mapping for realistic lighting

## Architecture

The codebase follows a clean entity-component pattern:
- **Entities**: Self-contained game objects with their own update logic
- **Systems**: Reusable systems that can operate on multiple entities
- **Core**: Fundamental game engine code
- **Utils**: Shared utilities like model loading
- **Config**: Centralized configuration for easy tuning
