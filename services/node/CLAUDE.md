# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PixelFix is a full-stack image processing application built with:
- **Frontend**: Next.js 15 with TypeScript, Mantine UI components, and Tailwind CSS
- **Backend**: Symfony 7.3 PHP API with Doctrine ORM and JWT authentication
- **Processing**: Python backend for image transformations using YOLO models

## Architecture

The project follows a microservices architecture with three main services:

### Frontend (Next.js - `/services/node/`)
- Uses App Router pattern with TypeScript
- Mantine components for UI with custom CSS modules
- Authentication via JWT tokens stored in browser
- API communication through `PixelFixClient` class
- Key pages: login, create-order, settings

### Backend API (Symfony - `/services/php/`)
- RESTful API endpoints under `/api/` prefix
- JWT authentication with Lexik bundle
- Doctrine entities: User, Order, Image
- Controllers: ImageController (upload), OrderController (CRUD), UserController
- File uploads stored in `storage/images/`

### Image Processing (Python - `/services/python/`)
- YOLO model integration for object detection/segmentation
- Transformations in `/transformations/` directory
- Processing pipeline for image analysis

## Development Commands

### Frontend (Node.js)
```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run analyze         # Bundle analysis

# Testing & Quality
npm run test            # Run all tests (prettier, lint, typecheck, jest)
npm run typecheck       # TypeScript validation
npm run lint            # ESLint + Stylelint
npm run jest            # Run Jest tests
npm run jest:watch      # Jest watch mode
npm run prettier:write  # Format code
```

### Backend (PHP/Symfony)
```bash
# Symfony commands (run from /services/php/)
php bin/console cache:clear
php bin/console doctrine:migrations:migrate
php bin/console lexik:jwt:generate-keypair

# Development server
symfony serve -d
```

## Key Configuration

### API Integration
- Backend API runs on `http://127.0.0.1:8000`
- Frontend configured in `PixelFixClient.ts` with hardcoded endpoint
- JWT tokens required for authenticated endpoints
- CORS configured for cross-origin requests

### Authentication Flow
1. Login via `/api/login_check` endpoint
2. JWT token stored in browser storage
3. Token passed in Authorization header for API calls
4. User context available in Symfony controllers via `#[CurrentUser]`

### Database Schema
- **Orders**: Processing requests with status tracking and options
- **Images**: File uploads linked to orders
- **Users**: Customer accounts with order relationships

## Code Conventions

### TypeScript/React
- Functional components with hooks
- CSS Modules for component styling
- Custom exception handling via `PixelFixApiException`
- Strict TypeScript configuration

### PHP/Symfony
- Controller classes use constructor dependency injection
- Entity classes with Doctrine ORM annotations
- API responses use JSON format with serialization groups
- Route attributes on controller methods

## Testing

The frontend includes comprehensive testing setup:
- Jest with React Testing Library
- Test utilities in `/test-utils/`
- Configuration in `jest.config.cjs` and `jest.setup.cjs`

Always run `npm run test` before committing changes to ensure code quality and type safety.