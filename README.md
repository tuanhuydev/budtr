# Budtr - Budget Tracking Frontend

A React-based budget tracking application built with TypeScript and Webpack.

## Features

- React 19 with TypeScript
- Webpack for bundling
- ESLint + Prettier for code quality
- EditorConfig for consistent formatting

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd budtr

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:check
```

### Development Server

The development server runs on `http://localhost:8080` by default.

## Project Structure

```
budtr/
├── public/          # Static assets
├── src/             # Source code
│   ├── App.tsx      # Main app component
│   ├── App.css      # App styles
│   ├── index.tsx    # App entry point
│   └── types.d.ts   # Type definitions
├── .vscode/         # VS Code settings
├── eslint.config.mjs # ESLint configuration
├── .prettierrc      # Prettier configuration
├── .editorconfig    # EditorConfig settings
├── tsconfig.json    # TypeScript configuration
├── webpack.config.ts # Webpack configuration
└── package.json     # Dependencies and scripts
```

## Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **EditorConfig** for consistent editor settings

All tools are configured to work together seamlessly.

## VS Code Extensions

Recommended extensions (automatically suggested):

- ESLint
- Prettier
- EditorConfig for VS Code
- TypeScript
