import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
// This configuration sets up Vite to use React and proxies API requests to the backend server running on port 5000.
// It allows the frontend to make requests to `/api` without worrying about CORS issues, as Vite will forward these requests to the backend server.
// The `changeOrigin` option is set to `true` to ensure that the origin of the host header is changed to the target URL.
//// The `secure` option is set to `false` to allow self-signed certificates, which is useful during development when using HTTPS with a self-signed certificate.
// This configuration is essential for development environments where the frontend and backend are running on different ports.
// It ensures that API requests from the frontend are correctly routed to the backend server without CORS issues.
// The `react` plugin is included to enable React support in the Vite build process.
// This setup is typical for modern React applications that require a backend API for data fetching and other operations.
// It allows developers to focus on building the frontend without worrying about CORS configurations during development.
// The proxy configuration is only applied in the development environment and does not affect the production build.
// In production, you would typically serve the frontend and backend from the same domain or use a different method to handle API requests, such as a reverse proxy server like Nginx or Apache.
// This Vite configuration file is essential for setting up a smooth development experience when working with a React frontend and a Node.js backend.
// It allows for easy API integration and ensures that the frontend can communicate with the backend without running into CORS issues during development.
// The configuration is straightforward and can be easily modified to suit specific project requirements, such as changing the backend server URL or adding additional plugins for other features.
// Overall, this Vite configuration provides a solid foundation for building modern web applications with React and a Node.js backend.
