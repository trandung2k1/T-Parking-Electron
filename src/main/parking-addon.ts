import { app, ipcMain } from 'electron';
import { createRequire } from 'node:module';
import path from 'node:path';
import { assertFiniteNumber } from '../lib/number';
import {
  PARKING_NATIVE_IPC,
  type ParkingAddonModule,
} from '../native/parking-addon.types';

const isDevelopment = !app.isPackaged;

function createAppRequire() {
  return createRequire(path.join(app.getAppPath(), 'package.json'));
}

function resolveParkingAddonPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'parking_addon.node');
  }

  return path.join(
    app.getAppPath(),
    'native',
    'build',
    'Release',
    'parking_addon.node',
  );
}

function loadParkingAddon(): ParkingAddonModule {
  const addonPath = resolveParkingAddonPath();

  try {
    if (isDevelopment) {
      console.log('[Native Addon] Loading:', addonPath);
    }

    const addon = createAppRequire()(addonPath) as ParkingAddonModule;

    if (isDevelopment) {
      console.log('[Native Addon] Loaded:', addon.getVersion());
    }

    return addon;
  } catch (error) {
    console.error('[Native Addon] Failed to load:', addonPath);
    console.error(error);
    throw error;
  }
}

/** Đăng ký handler IPC cho native addon (gọi một lần khi app ready). */
export function registerParkingNativeIpc(): void {
  const parkingAddon = loadParkingAddon();

  ipcMain.handle(PARKING_NATIVE_IPC.getVersion, () => {
    return parkingAddon.getVersion();
  });

  ipcMain.handle(
    PARKING_NATIVE_IPC.addNumbers,
    (_event, left: unknown, right: unknown) => {
      const leftNumber = assertFiniteNumber(left, 'left');
      const rightNumber = assertFiniteNumber(right, 'right');
      return parkingAddon.addNumbers(leftNumber, rightNumber);
    },
  );
}
