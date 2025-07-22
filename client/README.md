# Local Grub (Frontend:Client) 

## Overview
This is the React frontend for the LocalGrub platform.
It allows customers to browse menus, place orders, and view order status.
The client communicates with the backend microservices via REST APIs and receives real-time updates through event-driven notifications.

## Environment Variables
This app requires a .env file for configuration.
You must copy .env.example to .env and fill in the required values before running the app.

Where to get it  
**Example**
```
Base URL for backend API:
VITE_API_URL = http://localhost:3005
Firebase Client API Key:
VITE_FIREBASE_API_KEY = Firebase Console
Firebase Auth Domain :
VITE_FIREBASE_AUTH_DOMAIN =	Firebase Console
Firebase Project ID :
VITE_FIREBASE_PROJECT_ID = Firebase Console
```

> See the main project README for more details on environment variables and how to obtain them.

## Getting Started

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

#### 1. Install dependencies
```
npm install
```
#### 2. Set up environment variables
```
cp .env.example .env
# Edit .env and fill in the required values
```
#### 3. Run the app (development)
```
npm run dev
```
The app will be available at http://localhost:4173 by default.
#### 4. Build for production
```
npm run build
```
#### 5. Preview production build
```
npm run preview
```
#### 6. With Docker (optional)
```
docker build -t localgrub-client .
docker run -p 4173:4173 localgrub-client
```

## Tech Stack
- React
- TypeScript
- Vite

# Contributing
Please see the main project README for guidelines.

# License
This project is licensed under the MIT License.
