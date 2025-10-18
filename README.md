# Desert Airplane

A Three.js flight simulation game where you control an airplane flying over a desert terrain using WASD controls.

## Tech Stack

- **Three.js** - 3D graphics library
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

## Project Structure

```
src/
├── core/           # Core game engine components
│   └── Game.js     # Main game loop and scene management
├── entities/       # Game objects
│   ├── Airplane.js # Player-controlled airplane
│   └── Desert.js   # Procedural desert terrain
├── systems/        # Game systems
│   └── InputManager.js # Keyboard input handling
├── config/         # Configuration files
│   └── settings.js # Game settings and constants
├── utils/          # Utility functions
├── main.js         # Application entry point
└── style.css       # Global styles
```

## Performance

The project is optimized for performance with:
- Vite's fast HMR and optimized builds
- Three.js instanced rendering where applicable
- Efficient shadow mapping
- Proper geometry and texture disposal

## Architecture

The codebase follows a clean entity-component pattern:
- **Entities**: Self-contained game objects with their own update logic
- **Systems**: Reusable systems that can operate on multiple entities
- **Core**: Fundamental game engine code
- **Config**: Centralized configuration for easy tuning
