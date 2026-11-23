# Trains Project

Proyecto base configurado para trabajar con **HTML, CSS, JavaScript, React, Node.js (Express) y Three.js**, usando **Vite** como bundler de desarrollo y compilación.

## Estructura del proyecto

```text
trains-proyect/
├── .env.example              # Variables de entorno de ejemplo
├── .gitignore                # Archivos ignorados por Git
├── index.html                # Documento HTML principal
├── package.json              # Dependencias y scripts de npm
├── vite.config.js            # Configuración de Vite y proxy hacia /api
├── server/
│   └── index.js              # Servidor backend en Node.js + Express
└── src/
    ├── main.jsx              # Punto de entrada de React
    ├── App.jsx               # Componente principal
    ├── App.css               # Estilos de la aplicación
    ├── index.css             # Estilos globales
    └── components/
        └── ThreeScene.jsx    # Escena 3D base con Three.js
```

## Requisitos

- Node.js (v18 o superior)
- npm

## Instalación

```bash
npm install
```

Opcionalmente, copia `.env.example` a `.env` si necesitas personalizar el puerto:

```bash
cp .env.example .env
```

## Comandos disponibles

- **Modo desarrollo (React/Vite + Node.js simultáneamente):**
  ```bash
  npm run dev
  ```
  - Frontend (Vite + React + Three.js): `http://localhost:5173`
  - Backend (Node.js + Express): `http://localhost:3001`

- **Solo frontend:**
  ```bash
  npm run dev:client
  ```

- **Solo backend (con recarga automática):**
  ```bash
  npm run dev:server
  ```

- **Compilar para producción:**
  ```bash
  npm run build
  ```

- **Ejecutar en producción:**
  ```bash
  NODE_ENV=production npm start
  ```
