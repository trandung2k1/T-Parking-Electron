import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { MAIN_WINDOW } from '../constants/app';

const isDevelopment = !app.isPackaged;

export function createMainWindow(): BrowserWindow {
  const size = isDevelopment ? MAIN_WINDOW.development : MAIN_WINDOW.production;

  const mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    minWidth: MAIN_WINDOW.minWidth,
    minHeight: MAIN_WINDOW.minHeight,
    icon: path.join(app.getAppPath(), 'assets', 'icon.png'),
    show: false,
    autoHideMenuBar: true,
    backgroundColor: MAIN_WINDOW.backgroundColor,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      spellcheck: false,
      devTools: isDevelopment,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on(
    'did-fail-load',
    (_event, errorCode, errorDescription, validatedURL) => {
      console.error(
        '[MainWindow] Failed to load:',
        errorCode,
        errorDescription,
        validatedURL,
      );
    },
  );

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    const rendererHtmlPath = path.join(
      __dirname,
      `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
    );
    void mainWindow.loadFile(rendererHtmlPath);
  }

  return mainWindow;
}
