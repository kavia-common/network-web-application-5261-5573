# Network Device Management - Frontend

React application for managing network devices. It communicates with the backend API defined at http://localhost:5000/api.

## Quick Start

1. Install dependencies
   - In this template we use Create React App (CRA). From this folder:
     - npm install
2. Configure environment (optional)
   - Copy `.env.example` to `.env` and adjust values.
3. Start the app
   - npm start
   - Open http://localhost:3000

## Environment Variables

- REACT_APP_API_BASE_URL
  - Default: http://localhost:5000/api
  - Description: Base URL for backend API.
- REACT_APP_STATUS_MONITORING_ENABLED
  - Default: true
  - Description: When false, status badges and ping actions are hidden/disabled.

See `.env.example` for a template.

## Features

- Device dashboard listing with filtering, sorting, search, and pagination.
- Add/edit/delete devices with accessible, validated forms.
- Optional device details page with last ping time and status.
- Manual ping action with global toast notifications.
- Global error handling with accessible alerts.
- Responsive layout and keyboard-accessible controls.

## API Endpoints Used

- GET /devices?filter=&sort=&page=&page_size=
- POST /devices
- GET /devices/{id}
- PUT /devices/{id}
- DELETE /devices/{id}
- POST /ping

Error responses are handled according to the `Error` schema in the OpenAPI spec (error_code, message, details).

## Accessibility

- Semantic roles, labels, and aria attributes.
- Keyboard focus and navigation supported.
- Non-blocking UI with live region toasts.

## Notes

- Routing is implemented using a minimal hash-based router to avoid extra dependencies. URLs:
  - #/ -> list
  - #/devices/{id} -> details

