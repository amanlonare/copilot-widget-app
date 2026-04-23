# Changelog

All notable changes to the Copilot Widget project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.4] - 2026-04-22
### Phase 4: Streaming & UX Polish
### Added
- **Real-time SSE Streaming**: Transitioned from JSON polling to Server-Sent Events (SSE) for near-instant assistant responses.
- **Incremental Content Rendering**: Responses now render chunk-by-chunk in real-time.
- **Smart Auto-Scroll**: Implemented intelligent scroll tracking that stays anchored to the bottom during streaming but respects manual user scrolling.
- **Request Lifecycle Management**: Added `AbortController` to gracefully cancel pending requests on component unmount or interaction overrides.
- **SSR Safety**: Fixed `window is not defined` errors for seamless Next.js integration.

## [0.0.3] - 2026-04-22
### Phase 3: Embeddable Architecture
### Added
- **Global Bundle Generation**: Configured `tsup` to produce a single, self-contained `widget.global.js` for third-party site embedding.
- **Style Isolation**: Implemented Shadow DOM encapsulation to prevent website CSS from leaking into the widget.
- **Dynamic CSS Injection**: Automated the injection of Tailwind-generated styles directly into the Shadow Root.

## [0.0.2] - 2026-04-21
### Phase 2: Backend Integration
### Added
- **Core API Client**: Created a robust `ApiClient` with support for standardized request/response contracts.
- **Orchestrator Connectivity**: Wired the widget to the live Python orchestrator backend.
- **Error Boundaries**: Implemented graceful 500/Network error handling in the UI.
- **State Machine**: Refined `useWidgetState` to handle loading, typing, and idle states correctly.

## [0.0.1] - 2026-04-21
### Phase 1: Foundation & Widget UI
### Added
- **Project Scaffolding**: Initialized Next.js App Router project with Tailwind CSS and Shadcn/UI.
- **Component Library**: Built the core UI components: `WidgetShell`, `WidgetHeader`, `MessageList`, `MessageBubble`, and `ChatInput`.
- **Mock Infrastructure**: Developed a simulated chat service for local-first development and testing.
