import { defineConfig } from 'vite';
import { productionBuildOptions } from './vite.shared.mts';

export default defineConfig({
  build: productionBuildOptions('main'),
});
