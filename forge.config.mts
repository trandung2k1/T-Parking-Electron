import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from 'node:path';

/**
 * Vite đã bundle main/preload/renderer — asar chỉ cần:
 * package.json, assets, .vite/build, .vite/renderer.
 * Phải giữ cả thư mục cha `/.vite` để packager còn đi vào bên trong.
 * Không đóng src/, native/, node_modules.
 */
function shouldIgnorePackagedPath(filePath: string): boolean {
  if (!filePath || filePath === '/') {
    return false;
  }

  if (filePath === '/package.json') {
    return false;
  }

  if (filePath === '/assets' || filePath.startsWith('/assets/')) {
    return false;
  }

  // Giữ thư mục cha để copy được build + renderer
  if (filePath === '/.vite') {
    return false;
  }

  // Forge Vite: main/preload + renderer UI (thiếu renderer = màn hình trắng)
  if (
    filePath === '/.vite/build' ||
    filePath.startsWith('/.vite/build/') ||
    filePath === '/.vite/renderer' ||
    filePath.startsWith('/.vite/renderer/')
  ) {
    return false;
  }

  return true;
}

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    prune: true,
    ignore: shouldIgnorePackagedPath,
    icon: path.resolve(__dirname, 'assets', 'icon'),
    extraResource: ['native/build/Release/parking_addon.node'],
    // Không đóng kèm source map / PDB nếu có
    derefSymlinks: true,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl:
        'https://raw.githubusercontent.com/trandung2k1/T-Parking-Electron/refs/heads/master/assets/icon.ico',
      setupIcon: path.resolve(__dirname, 'assets', 'icon.ico'),
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main.ts',
          config: 'vite.main.config.mts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.mts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.mts',
        },
      ],
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
