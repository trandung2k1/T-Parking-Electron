import { contextBridge, ipcRenderer } from 'electron';
import { assertFiniteNumber } from './lib/number';
import {
  PARKING_NATIVE_IPC,
  type ParkingNativeApi,
} from './native/parking-addon.types';

const parkingNativeApi: ParkingNativeApi = {
  getVersion: () => ipcRenderer.invoke(PARKING_NATIVE_IPC.getVersion),
  addNumbers: (left, right) => {
    const leftNumber = assertFiniteNumber(left, 'left');
    const rightNumber = assertFiniteNumber(right, 'right');
    return ipcRenderer.invoke(
      PARKING_NATIVE_IPC.addNumbers,
      leftNumber,
      rightNumber,
    );
  },
};

contextBridge.exposeInMainWorld('parkingNative', parkingNativeApi);
