// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  // For Vercel deployment, the 'base' property is usually not needed
  // as Vercel serves from the root of its domain.
  // If your app works locally without it, you can remove it.
  // If you were deploying to GitHub Pages, you would use:
  // base: '/Neural-Sync/',
  plugins: [react()],
  // Configuration for dependency optimization during development
  optimizeDeps: {
    // Exclude 'lucide-react' from pre-bundling to prevent potential issues
    exclude: ["lucide-react"],
    // Explicitly include these for pre-bundling to ensure faster dev server startup
    include: ["@google/generative-ai", "pdfjs-dist"]
  },
  // Build-specific configurations for production output
  build: {
    // Rollup options for fine-grained control over the build process
    rollupOptions: {
      output: {
        // Manual chunking to split your application into smaller, more manageable bundles
        // This can improve loading performance by allowing parallel downloads
        manualChunks: {
          vendor: ["react", "react-dom"],
          // Core React libraries
          router: ["react-router-dom", "react-router-hash-link"],
          // React Router related
          icons: ["lucide-react"],
          // Icon library
          ai: ["@google/generative-ai"],
          // Google Generative AI library
          pdf: ["pdfjs-dist"]
          // PDF.js library
        }
      }
    },
    // Set a warning limit for chunk size (in KB) to help identify large bundles
    chunkSizeWarningLimit: 1e3,
    // Target environment for the generated JavaScript code (e.g., 'esnext' for modern browsers)
    target: "esnext",
    // Minify the output code using Terser for smaller file sizes
    minify: "terser",
    // Terser options for further optimization
    terserOptions: {
      compress: {
        drop_console: true,
        // Remove console.log statements from production build
        drop_debugger: true
        // Remove debugger statements from production build
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
    target: "esnext"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvLyBGb3IgVmVyY2VsIGRlcGxveW1lbnQsIHRoZSAnYmFzZScgcHJvcGVydHkgaXMgdXN1YWxseSBub3QgbmVlZGVkXG4gIC8vIGFzIFZlcmNlbCBzZXJ2ZXMgZnJvbSB0aGUgcm9vdCBvZiBpdHMgZG9tYWluLlxuICAvLyBJZiB5b3VyIGFwcCB3b3JrcyBsb2NhbGx5IHdpdGhvdXQgaXQsIHlvdSBjYW4gcmVtb3ZlIGl0LlxuICAvLyBJZiB5b3Ugd2VyZSBkZXBsb3lpbmcgdG8gR2l0SHViIFBhZ2VzLCB5b3Ugd291bGQgdXNlOlxuICAvLyBiYXNlOiAnL05ldXJhbC1TeW5jLycsXG5cbiAgcGx1Z2luczogW3JlYWN0KCldLFxuXG4gIC8vIENvbmZpZ3VyYXRpb24gZm9yIGRlcGVuZGVuY3kgb3B0aW1pemF0aW9uIGR1cmluZyBkZXZlbG9wbWVudFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICAvLyBFeGNsdWRlICdsdWNpZGUtcmVhY3QnIGZyb20gcHJlLWJ1bmRsaW5nIHRvIHByZXZlbnQgcG90ZW50aWFsIGlzc3Vlc1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgLy8gRXhwbGljaXRseSBpbmNsdWRlIHRoZXNlIGZvciBwcmUtYnVuZGxpbmcgdG8gZW5zdXJlIGZhc3RlciBkZXYgc2VydmVyIHN0YXJ0dXBcbiAgICBpbmNsdWRlOiBbJ0Bnb29nbGUvZ2VuZXJhdGl2ZS1haScsICdwZGZqcy1kaXN0J11cbiAgfSxcblxuICAvLyBCdWlsZC1zcGVjaWZpYyBjb25maWd1cmF0aW9ucyBmb3IgcHJvZHVjdGlvbiBvdXRwdXRcbiAgYnVpbGQ6IHtcbiAgICAvLyBSb2xsdXAgb3B0aW9ucyBmb3IgZmluZS1ncmFpbmVkIGNvbnRyb2wgb3ZlciB0aGUgYnVpbGQgcHJvY2Vzc1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBNYW51YWwgY2h1bmtpbmcgdG8gc3BsaXQgeW91ciBhcHBsaWNhdGlvbiBpbnRvIHNtYWxsZXIsIG1vcmUgbWFuYWdlYWJsZSBidW5kbGVzXG4gICAgICAgIC8vIFRoaXMgY2FuIGltcHJvdmUgbG9hZGluZyBwZXJmb3JtYW5jZSBieSBhbGxvd2luZyBwYXJhbGxlbCBkb3dubG9hZHNcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLCAvLyBDb3JlIFJlYWN0IGxpYnJhcmllc1xuICAgICAgICAgIHJvdXRlcjogWydyZWFjdC1yb3V0ZXItZG9tJywgJ3JlYWN0LXJvdXRlci1oYXNoLWxpbmsnXSwgLy8gUmVhY3QgUm91dGVyIHJlbGF0ZWRcbiAgICAgICAgICBpY29uczogWydsdWNpZGUtcmVhY3QnXSwgLy8gSWNvbiBsaWJyYXJ5XG4gICAgICAgICAgYWk6IFsnQGdvb2dsZS9nZW5lcmF0aXZlLWFpJ10sIC8vIEdvb2dsZSBHZW5lcmF0aXZlIEFJIGxpYnJhcnlcbiAgICAgICAgICBwZGY6IFsncGRmanMtZGlzdCddIC8vIFBERi5qcyBsaWJyYXJ5XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIFNldCBhIHdhcm5pbmcgbGltaXQgZm9yIGNodW5rIHNpemUgKGluIEtCKSB0byBoZWxwIGlkZW50aWZ5IGxhcmdlIGJ1bmRsZXNcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gICAgLy8gVGFyZ2V0IGVudmlyb25tZW50IGZvciB0aGUgZ2VuZXJhdGVkIEphdmFTY3JpcHQgY29kZSAoZS5nLiwgJ2VzbmV4dCcgZm9yIG1vZGVybiBicm93c2VycylcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgIC8vIE1pbmlmeSB0aGUgb3V0cHV0IGNvZGUgdXNpbmcgVGVyc2VyIGZvciBzbWFsbGVyIGZpbGUgc2l6ZXNcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIC8vIFRlcnNlciBvcHRpb25zIGZvciBmdXJ0aGVyIG9wdGltaXphdGlvblxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSwgLy8gUmVtb3ZlIGNvbnNvbGUubG9nIHN0YXRlbWVudHMgZnJvbSBwcm9kdWN0aW9uIGJ1aWxkXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUgLy8gUmVtb3ZlIGRlYnVnZ2VyIHN0YXRlbWVudHMgZnJvbSBwcm9kdWN0aW9uIGJ1aWxkXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8vIERldmVsb3BtZW50IHNlcnZlciBjb25maWd1cmF0aW9uc1xuICBzZXJ2ZXI6IHtcbiAgICAvLyBEaXNhYmxlIHRoZSBITVIgKEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQpIG92ZXJsYXkgaW4gdGhlIGJyb3dzZXJcbiAgICAvLyBTZXQgdG8gZmFsc2UgaWYgeW91IGZpbmQgaXQgaW50cnVzaXZlIGR1cmluZyBkZXZlbG9wbWVudFxuICAgIGhtcjoge1xuICAgICAgb3ZlcmxheTogZmFsc2VcbiAgICB9XG4gIH0sXG5cbiAgLy8gZXNidWlsZCBjb25maWd1cmF0aW9ucyAodXNlZCBmb3IgZmFzdCB0cmFuc3BpbGF0aW9uKVxuICBlc2J1aWxkOiB7XG4gICAgLy8gVGFyZ2V0IGVudmlyb25tZW50IGZvciBlc2J1aWxkJ3MgdHJhbnNwaWxhdGlvblxuICAgIHRhcmdldDogJ2VzbmV4dCdcbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFPMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBO0FBQUEsRUFHakIsY0FBYztBQUFBO0FBQUEsSUFFWixTQUFTLENBQUMsY0FBYztBQUFBO0FBQUEsSUFFeEIsU0FBUyxDQUFDLHlCQUF5QixZQUFZO0FBQUEsRUFDakQ7QUFBQTtBQUFBLEVBR0EsT0FBTztBQUFBO0FBQUEsSUFFTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQTtBQUFBLFFBR04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBO0FBQUEsVUFDN0IsUUFBUSxDQUFDLG9CQUFvQix3QkFBd0I7QUFBQTtBQUFBLFVBQ3JELE9BQU8sQ0FBQyxjQUFjO0FBQUE7QUFBQSxVQUN0QixJQUFJLENBQUMsdUJBQXVCO0FBQUE7QUFBQSxVQUM1QixLQUFLLENBQUMsWUFBWTtBQUFBO0FBQUEsUUFDcEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSx1QkFBdUI7QUFBQTtBQUFBLElBRXZCLFFBQVE7QUFBQTtBQUFBLElBRVIsUUFBUTtBQUFBO0FBQUEsSUFFUixlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixjQUFjO0FBQUE7QUFBQSxRQUNkLGVBQWU7QUFBQTtBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR0EsUUFBUTtBQUFBO0FBQUE7QUFBQSxJQUdOLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHQSxTQUFTO0FBQUE7QUFBQSxJQUVQLFFBQVE7QUFBQSxFQUNWO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
