# Budtr Backend

A Go backend API for the Budtr application built with Gin framework.

## Getting Started

### Prerequisites

- Go 1.24 or higher
- Air (for hot reloading during development)

### Installation

1. Install dependencies:
   ```bash
   go mod download
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Install Air for hot reloading (optional):
   ```bash
   go install github.com/air-verse/air@latest
   ```

## Development

### Using Nx Commands

From the workspace root:

```bash
# Start development server with hot reloading
nx dev backend

# Start server without hot reloading
nx serve backend

# Build the application
nx build backend

# Run tests
nx test backend

# Format code
nx format backend

# Tidy modules
nx tidy backend
```

### Direct Go Commands

From the backend directory:

```bash
# Run the server
go run main.go

# Build the application
go build -o dist/backend main.go

# Run tests
go test ./...

# Format code
go fmt ./...

# Tidy modules
go mod tidy
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/v1/` - API welcome endpoint

## Configuration

Environment variables can be set in the `.env` file. See `.env.example` for available options.

## Project Structure

```
backend/
├── main.go              # Application entry point
├── go.mod              # Go module file
├── .air.toml           # Air configuration for hot reloading
├── .env.example        # Environment variables example
├── .gitignore          # Git ignore file
├── project.json        # Nx project configuration
└── README.md           # This file
```

## Adding Features

This is a basic setup. You can extend it by adding:

- Database integration (PostgreSQL, MongoDB, etc.)
- Authentication & authorization
- Middleware
- Additional API routes
- Database migrations
- Tests
- Docker configuration
