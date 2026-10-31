import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { productionBuildOptions } from './vite.shared.mts';

export default defineConfig({
  // Bắt buộc với Electron file:// — tránh script/css trỏ tuyệt đối "/assets/..."
  base: './',
  plugins: [react()],
  build: productionBuildOptions('renderer'),
});
