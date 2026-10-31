import type { ParkingNativeApi } from '../native/parking-addon.types';

const NATIVE_BRIDGE_UNAVAILABLE =
  'Native bridge chưa sẵn sàng (preload / IPC).';

function getParkingNativeApi(): ParkingNativeApi | null {
  return window.parkingNative ?? null;
}

export function useParkingNative() {
  const parkingNativeApi = getParkingNativeApi();
  const isBridgeAvailable = parkingNativeApi !== null;

  async function getVersion(): Promise<string> {
    if (!parkingNativeApi) {
      throw new Error(NATIVE_BRIDGE_UNAVAILABLE);
    }
    return parkingNativeApi.getVersion();
  }

  async function addNumbers(left: number, right: number): Promise<number> {
    if (!parkingNativeApi) {
      throw new Error(NATIVE_BRIDGE_UNAVAILABLE);
    }
    return parkingNativeApi.addNumbers(left, right);
  }

  return {
    isBridgeAvailable,
    getVersion,
    addNumbers,
  };
}
