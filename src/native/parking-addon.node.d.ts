declare module '*.node' {
  import type { ParkingAddonModule } from './parking-addon.types';

  const addon: ParkingAddonModule;
  export = addon;
}
