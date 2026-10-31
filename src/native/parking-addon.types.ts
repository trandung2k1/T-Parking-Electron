/** API sync xuất từ `parking_addon.node` (N-API). */
export interface ParkingAddonModule {
  getVersion(): string;
  addNumbers(left: number, right: number): number;
}

/** API async expose sang renderer qua preload (`window.parkingNative`). */
export interface ParkingNativeApi {
  getVersion(): Promise<string>;
  addNumbers(left: number, right: number): Promise<number>;
}

/** Tên kênh IPC — dùng chung main / preload. */
export const PARKING_NATIVE_IPC = {
  getVersion: 'parking-native:get-version',
  addNumbers: 'parking-native:add-numbers',
} as const;

export type ParkingNativeIpcChannel =
  (typeof PARKING_NATIVE_IPC)[keyof typeof PARKING_NATIVE_IPC];
