// vite.config.ts

import { defineConfig } from "vite"; // Importing the Vite configuration function
import react from "@vitejs/plugin-react-swc"; // React plugin for Vite using SWC (for faster compilation)
import path from "path"; // Node.js path module to resolve directories
import { componentTagger } from "lovable-tagger"; // Custom plugin for tagging components

// Vite configuration export
export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Set host to listen on all available network interfaces
    port: 8080, // Set server port to 8080
  },
  plugins: [
    react(), // Adds React support to Vite using the SWC plugin
    mode === "development" && componentTagger(), // Conditionally add componentTagger plugin in development mode
  ].filter(Boolean), // Filters out any falsy values (removes componentTagger in non-development modes)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Aliasing '@' to the 'src' directory for easier imports
    },
  },
}));

