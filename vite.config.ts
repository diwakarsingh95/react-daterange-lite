import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command, mode }) => {
  // Preview/Dev mode - serve the demo app
  if (command === 'serve') {
    return {
      plugins: [react()],
      root: '.',
      server: {
        port: 3000,
        open: true,
      },
    };
  }

  // Build mode for demo app (GitHub Pages)
  if (mode === 'demo') {
    return {
      plugins: [react()],
      root: '.',
      base: '/react-daterange-lite/',
      build: {
        outDir: 'dist-demo',
        target: 'es2022',
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
          input: {
            main: './index.html',
          },
        },
      },
    };
  }

  // Build mode - build the library
  return {
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
        rollupTypes: true,
        exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      }),
    ],
    build: {
      target: 'es2022',
      lib: {
        entry: 'src/index.ts',
        name: 'ReactDateRangePicker',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime', 'dayjs'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime',
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css' || assetInfo.name?.endsWith('.css')) {
              return 'styles.css';
            }
            return assetInfo.name || 'asset';
          },
          // Preserve module structure for better tree-shaking
          preserveModules: false,
          // Compact output for smaller bundles
          compact: true,
        },
        // Tree-shaking optimization
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      // Generate separate source maps for production
      sourcemap: true,
      // Aggressive minification with esbuild
      minify: 'esbuild',
      minifySyntax: true,
      minifyWhitespace: true,
      minifyIdentifiers: true,
      // CSS optimization
      cssCodeSplit: false,
      cssMinify: true,
      // Don't copy public directory for libraries
      copyPublicDir: false,
      // Report compressed size
      reportCompressedSize: true,
      // Chunk size warning limit (500KB)
      chunkSizeWarningLimit: 500,
    },
  };
});
