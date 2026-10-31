import { Suspense, lazy, type ComponentType } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { APP_ROUTES, APP_ROUTE_SEGMENTS } from './constants/routes';
import { AppLayout } from './layout/AppLayout';

function lazyNamedPage<TModule extends Record<string, unknown>>(
  loader: () => Promise<TModule>,
  exportName: keyof TModule & string,
) {
  return lazy(async () => {
    const module = await loader();
    return {
      default: module[exportName] as ComponentType,
    };
  });
}

const DashboardPage = lazyNamedPage(
  () => import('./pages/DashboardPage'),
  'DashboardPage',
);
const SessionsPage = lazyNamedPage(
  () => import('./pages/SessionsPage'),
  'SessionsPage',
);
const NativePage = lazyNamedPage(
  () => import('./pages/NativePage'),
  'NativePage',
);
const SettingsPage = lazyNamedPage(
  () => import('./pages/SettingsPage'),
  'SettingsPage',
);

function PageLoadingFallback() {
  return (
    <main className="page">
      <p className="page-meta">Đang tải…</p>
    </main>
  );
}

export function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route
              path={APP_ROUTE_SEGMENTS.sessions}
              element={<SessionsPage />}
            />
            <Route path={APP_ROUTE_SEGMENTS.native} element={<NativePage />} />
            <Route
              path={APP_ROUTE_SEGMENTS.settings}
              element={<SettingsPage />}
            />
            <Route
              path="*"
              element={<Navigate to={APP_ROUTES.dashboard} replace />}
            />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
