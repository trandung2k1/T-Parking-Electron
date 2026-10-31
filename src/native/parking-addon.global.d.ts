declare global {
  interface Window {
    parkingNative: import('./parking-addon.types').ParkingNativeApi;
  }
}

export {};
