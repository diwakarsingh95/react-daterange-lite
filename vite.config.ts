import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
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

  // Build mode - build the library
  return {
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
        rollupTypes: true,
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'ReactDateRangePicker',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
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
        },
      },
      sourcemap: true,
      minify: 'esbuild',
      cssCodeSplit: false,
      copyPublicDir: false,
    },
  };
});

