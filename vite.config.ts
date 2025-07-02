import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // For Vercel deployment, the 'base' property is usually not needed
  // as Vercel serves from the root of its domain.
  // If your app works locally without it, you can remove it.
  // If you were deploying to GitHub Pages, you would use:
  // base: '/Neural-Sync/',

  plugins: [react()],

  // Configuration for dependency optimization during development
  optimizeDeps: {
    // Exclude 'lucide-react' from pre-bundling to prevent potential issues
    exclude: ['lucide-react'],
    // Explicitly include these for pre-bundling to ensure faster dev server startup
    include: ['@google/generative-ai', 'pdfjs-dist']
  },

  // Build-specific configurations for production output
  build: {
    // Rollup options for fine-grained control over the build process
    rollupOptions: {
      output: {
        // Manual chunking to split your application into smaller, more manageable bundles
        // This can improve loading performance by allowing parallel downloads
        manualChunks: {
          vendor: ['react', 'react-dom'], // Core React libraries
          router: ['react-router-dom', 'react-router-hash-link'], // React Router related
          icons: ['lucide-react'], // Icon library
          ai: ['@google/generative-ai'], // Google Generative AI library
          pdf: ['pdfjs-dist'] // PDF.js library
        }
      }
    },
    // Set a warning limit for chunk size (in KB) to help identify large bundles
    chunkSizeWarningLimit: 1000,
    // Target environment for the generated JavaScript code (e.g., 'esnext' for modern browsers)
    target: 'esnext',
    // Minify the output code using Terser for smaller file sizes
    minify: 'terser',
    // Terser options for further optimization
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements from production build
        drop_debugger: true // Remove debugger statements from production build
      }
    }
  },

  // Development server configurations
  server: {
    // Disable the HMR (Hot Module Replacement) overlay in the browser
    // Set to false if you find it intrusive during development
    hmr: {
      overlay: false
    }
  },

  // esbuild configurations (used for fast transpilation)
  esbuild: {
    // Target environment for esbuild's transpilation
    target: 'esnext'
  }
});
