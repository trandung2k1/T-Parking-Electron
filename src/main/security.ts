import { app, type Input, type WebContents } from 'electron';

const isDevelopment = !app.isPackaged;

function isAllowedNavigationUrl(targetUrl: string): boolean {
  if (
    typeof MAIN_WINDOW_VITE_DEV_SERVER_URL === 'string' &&
    MAIN_WINDOW_VITE_DEV_SERVER_URL.length > 0 &&
    targetUrl.startsWith(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  ) {
    return true;
  }

  try {
    return new URL(targetUrl).protocol === 'file:';
  } catch {
    return false;
  }
}

function isDevToolsShortcut(input: Input): boolean {
  const key = input.key.toUpperCase();
  const modifierPressed = input.control || input.meta;

  if (key === 'F12') {
    return true;
  }

  if (
    modifierPressed &&
    input.shift &&
    (key === 'I' || key === 'J' || key === 'C')
  ) {
    return true;
  }

  // Ctrl/Cmd+U — View Source (một số môi trường dùng Shift+U)
  if (modifierPressed && !input.alt && key === 'U') {
    return true;
  }

  return false;
}

function hardenContent(webContents: WebContents): void {
  webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  webContents.on('will-navigate', (event, targetUrl) => {
    if (!isAllowedNavigationUrl(targetUrl)) {
      event.preventDefault();
    }
  });

  if (!isDevelopment) {
    webContents.on('before-input-event', (event, input) => {
      if (isDevToolsShortcut(input)) {
        event.preventDefault();
      }
    });
  }
}

/** Chặn popup, điều hướng lạ và phím mở DevTools (bản production). */
export function registerWebContentsSecurity(): void {
  app.on('web-contents-created', (_event, webContents) => {
    hardenContent(webContents);
  });
}
