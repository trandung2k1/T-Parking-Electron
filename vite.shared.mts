import type { UserConfig } from 'vite';

/** Electron 45 ≈ Chromium 136 */
export const electronChromeTarget = 'chrome136';

export function productionBuildOptions(
  role: 'main' | 'preload' | 'renderer',
): NonNullable<UserConfig['build']> {
  const base: NonNullable<UserConfig['build']> = {
    target: electronChromeTarget,
    minify: true,
    sourcemap: false,
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
    assetsInlineLimit: 4096,
  };

  if (role !== 'renderer') {
    return base;
  }

  return {
    ...base,
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules\\react\\')
          ) {
            return 'react';
          }
          return undefined;
        },
      },
    },
  };
}
