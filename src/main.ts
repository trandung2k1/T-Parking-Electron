import { app, BrowserWindow, Menu } from 'electron';
import startedFromSquirrelInstaller from 'electron-squirrel-startup';
import { createMainWindow } from './main/create-main-window';
import { registerParkingNativeIpc } from './main/parking-addon';
import { registerWebContentsSecurity } from './main/security';

const isDevelopment = !app.isPackaged;

if (startedFromSquirrelInstaller) {
  app.quit();
}

app.whenReady().then(() => {
  if (!isDevelopment) {
    Menu.setApplicationMenu(null);
  }

  registerWebContentsSecurity();
  registerParkingNativeIpc();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
