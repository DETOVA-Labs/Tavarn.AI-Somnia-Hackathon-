# Tavarn.AI - AI-Powered Gaming Marketplace

This is the frontend for Tavarn.AI, an AI-powered gaming marketplace where prices evolve with demand. This project was built for the Somnia Hackathon.

## Features

- **Dynamic Pricing:** Item prices are adjusted by an AI based on market demand.
- **Blacklist System:** A community-driven blacklist system to report and identify scammers.
- **User Dashboard:** A comprehensive dashboard for users to manage their assets, view sales history, and track their performance.
- **Modern UI:** A sleek and modern user interface built with Next.js, Tailwind CSS, and Radix UI.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15 (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** Custom components built with [Radix UI](https://www.radix-ui.com/)
- **Package Manager:** [npm](https://www.npmjs.com/)
- **Linting:** [ESLint](https://eslint.org/)
- **Database:** [Firestore](https://firebase.google.com/docs/firestore)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or later)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Tavarn.AI-Somnia-Hackathon-.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up your environment variables by creating a `.env.local` file in the root of the project and adding your Firebase credentials.

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode.
- `npm run build`: Builds the app for production to the `.next` folder.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs the ESLint linter to check for code quality issues.

## Project Structure

```
/
├── app/                  # Application pages and layouts
│   ├── api/              # API routes
│   └── ...               # Other pages and routes
├── components/           # Reusable React components
│   └── ui/               # UI components (buttons, dialogs, etc.)
├── lib/                  # Utility functions and hooks
├── public/               # Static assets (images, fonts, etc.)
├── .gitignore            # Git ignore file
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
└── ...
```