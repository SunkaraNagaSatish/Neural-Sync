// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG5cbiAgLy8gQ29uZmlndXJhdGlvbiBmb3IgZGVwZW5kZW5jeSBvcHRpbWl6YXRpb24gZHVyaW5nIGRldmVsb3BtZW50XG4gIG9wdGltaXplRGVwczoge1xuICAgIC8vIEV4Y2x1ZGUgJ2x1Y2lkZS1yZWFjdCcgZnJvbSBwcmUtYnVuZGxpbmcgdG8gcHJldmVudCBwb3RlbnRpYWwgaXNzdWVzXG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAvLyBFeHBsaWNpdGx5IGluY2x1ZGUgdGhlc2UgZm9yIHByZS1idW5kbGluZyB0byBlbnN1cmUgZmFzdGVyIGRldiBzZXJ2ZXIgc3RhcnR1cFxuICAgIGluY2x1ZGU6IFsnQGdvb2dsZS9nZW5lcmF0aXZlLWFpJywgJ3BkZmpzLWRpc3QnXVxuICB9LFxuXG4gIC8vIEJ1aWxkLXNwZWNpZmljIGNvbmZpZ3VyYXRpb25zIGZvciBwcm9kdWN0aW9uIG91dHB1dFxuICBidWlsZDoge1xuICAgIC8vIFJvbGx1cCBvcHRpb25zIGZvciBmaW5lLWdyYWluZWQgY29udHJvbCBvdmVyIHRoZSBidWlsZCBwcm9jZXNzXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIE1hbnVhbCBjaHVua2luZyB0byBzcGxpdCB5b3VyIGFwcGxpY2F0aW9uIGludG8gc21hbGxlciwgbW9yZSBtYW5hZ2VhYmxlIGJ1bmRsZXNcbiAgICAgICAgLy8gVGhpcyBjYW4gaW1wcm92ZSBsb2FkaW5nIHBlcmZvcm1hbmNlIGJ5IGFsbG93aW5nIHBhcmFsbGVsIGRvd25sb2Fkc1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJ10sIC8vIENvcmUgUmVhY3QgbGlicmFyaWVzXG4gICAgICAgICAgcm91dGVyOiBbJ3JlYWN0LXJvdXRlci1kb20nLCAncmVhY3Qtcm91dGVyLWhhc2gtbGluayddLCAvLyBSZWFjdCBSb3V0ZXIgcmVsYXRlZFxuICAgICAgICAgIGljb25zOiBbJ2x1Y2lkZS1yZWFjdCddLCAvLyBJY29uIGxpYnJhcnlcbiAgICAgICAgICBhaTogWydAZ29vZ2xlL2dlbmVyYXRpdmUtYWknXSwgLy8gR29vZ2xlIEdlbmVyYXRpdmUgQUkgbGlicmFyeVxuICAgICAgICAgIHBkZjogWydwZGZqcy1kaXN0J10gLy8gUERGLmpzIGxpYnJhcnlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gU2V0IGEgd2FybmluZyBsaW1pdCBmb3IgY2h1bmsgc2l6ZSAoaW4gS0IpIHRvIGhlbHAgaWRlbnRpZnkgbGFyZ2UgYnVuZGxlc1xuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcbiAgICAvLyBUYXJnZXQgZW52aXJvbm1lbnQgZm9yIHRoZSBnZW5lcmF0ZWQgSmF2YVNjcmlwdCBjb2RlIChlLmcuLCAnZXNuZXh0JyBmb3IgbW9kZXJuIGJyb3dzZXJzKVxuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgLy8gTWluaWZ5IHRoZSBvdXRwdXQgY29kZSB1c2luZyBUZXJzZXIgZm9yIHNtYWxsZXIgZmlsZSBzaXplc1xuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgLy8gVGVyc2VyIG9wdGlvbnMgZm9yIGZ1cnRoZXIgb3B0aW1pemF0aW9uXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLCAvLyBSZW1vdmUgY29uc29sZS5sb2cgc3RhdGVtZW50cyBmcm9tIHByb2R1Y3Rpb24gYnVpbGRcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSAvLyBSZW1vdmUgZGVidWdnZXIgc3RhdGVtZW50cyBmcm9tIHByb2R1Y3Rpb24gYnVpbGRcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLy8gRGV2ZWxvcG1lbnQgc2VydmVyIGNvbmZpZ3VyYXRpb25zXG4gIHNlcnZlcjoge1xuICAgIC8vIERpc2FibGUgdGhlIEhNUiAoSG90IE1vZHVsZSBSZXBsYWNlbWVudCkgb3ZlcmxheSBpbiB0aGUgYnJvd3NlclxuICAgIC8vIFNldCB0byBmYWxzZSBpZiB5b3UgZmluZCBpdCBpbnRydXNpdmUgZHVyaW5nIGRldmVsb3BtZW50XG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiBmYWxzZVxuICAgIH1cbiAgfSxcblxuICAvLyBlc2J1aWxkIGNvbmZpZ3VyYXRpb25zICh1c2VkIGZvciBmYXN0IHRyYW5zcGlsYXRpb24pXG4gIGVzYnVpbGQ6IHtcbiAgICAvLyBUYXJnZXQgZW52aXJvbm1lbnQgZm9yIGVzYnVpbGQncyB0cmFuc3BpbGF0aW9uXG4gICAgdGFyZ2V0OiAnZXNuZXh0J1xuICB9XG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUE7QUFBQSxFQUdqQixjQUFjO0FBQUE7QUFBQSxJQUVaLFNBQVMsQ0FBQyxjQUFjO0FBQUE7QUFBQSxJQUV4QixTQUFTLENBQUMseUJBQXlCLFlBQVk7QUFBQSxFQUNqRDtBQUFBO0FBQUEsRUFHQSxPQUFPO0FBQUE7QUFBQSxJQUVMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBO0FBQUEsUUFHTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUE7QUFBQSxVQUM3QixRQUFRLENBQUMsb0JBQW9CLHdCQUF3QjtBQUFBO0FBQUEsVUFDckQsT0FBTyxDQUFDLGNBQWM7QUFBQTtBQUFBLFVBQ3RCLElBQUksQ0FBQyx1QkFBdUI7QUFBQTtBQUFBLFVBQzVCLEtBQUssQ0FBQyxZQUFZO0FBQUE7QUFBQSxRQUNwQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLHVCQUF1QjtBQUFBO0FBQUEsSUFFdkIsUUFBUTtBQUFBO0FBQUEsSUFFUixRQUFRO0FBQUE7QUFBQSxJQUVSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBQ2QsZUFBZTtBQUFBO0FBQUEsTUFDakI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHQSxRQUFRO0FBQUE7QUFBQTtBQUFBLElBR04sS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLFNBQVM7QUFBQTtBQUFBLElBRVAsUUFBUTtBQUFBLEVBQ1Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
