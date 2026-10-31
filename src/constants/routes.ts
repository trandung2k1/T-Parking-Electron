export const APP_ROUTES = {
  dashboard: '/',
  sessions: '/sessions',
  native: '/native',
  settings: '/settings',
} as const;

/** Segment cho `<Route path>` (không có `/` đầu). */
export const APP_ROUTE_SEGMENTS = {
  sessions: 'sessions',
  native: 'native',
  settings: 'settings',
} as const;

export type AppRoutePath = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];

export type AppNavItem = {
  path: AppRoutePath;
  label: string;
  end: boolean;
  icon: string;
};

export const APP_NAV_ITEMS: readonly AppNavItem[] = [
  { path: APP_ROUTES.dashboard, label: 'Tổng quan', end: true, icon: '◫' },
  { path: APP_ROUTES.sessions, label: 'Phiên gửi xe', end: false, icon: '⏱' },
  { path: APP_ROUTES.native, label: 'Native', end: false, icon: '⚙' },
  { path: APP_ROUTES.settings, label: 'Cài đặt', end: false, icon: '☰' },
] as const;
