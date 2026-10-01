# TitanCode Frontend

A React + TypeScript + Vite frontend for the TitanCode platform, built to support a multi-role workforce and client experience.

This application includes public marketing pages, onboarding and authentication flows, role-based dashboards, project and team management views, client request workflows, and settings screens.

## Tech Stack

- React 19
- TypeScript
- Vite
- Lucide React
- Oxlint

## Features

- Public marketing pages for company information, services, FAQs, testimonials, and career applications
- Sign in / sign up flow with qualification and onboarding flow
- Role-based access across multiple dashboards:
  - CEO Dashboard
  - Manager Dashboard
  - HR Dashboard
  - Client Dashboard
  - Applicant Dashboard
  - Team dashboard
- Client and project management views
- Tasks, meetings, users, departments, financials, and system settings screens
- Password and profile settings
- Error and access denial states for restricted access

## Project Structure

```bash
src/
├── App.tsx
├── App.css
├── components/
├── services/
├── types/
├── views/
├── utils/
├── main.tsx
└── index.css
```

## Prerequisites

Make sure you have the following installed:

- Node.js 18+
- npm or pnpm or yarn

## Installation

```bash
npm install
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the app for production.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run lint
```

Runs the linter using Oxlint.

## Development

From the project root:

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production Build

```bash
npm run build
```

The production files are generated in the `dist/` directory.

## Notes

This project is a front-end application and relies on app state and service-layer logic for navigation, auth/session behavior, and view rendering. If you are integrating with a backend, ensure the corresponding API contracts match the existing service structure in `src/services`.

## License

This project is currently unlicensed unless otherwise specified by the repository owner.
