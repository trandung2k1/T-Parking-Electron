import { NavLink, Outlet } from 'react-router-dom';
import { APP_DISPLAY_NAME } from '../constants/app';
import { APP_NAV_ITEMS } from '../constants/routes';

export function AppLayout() {
  return (
    <div className="app-shell">
      <div className="app-backdrop" aria-hidden="true" />
      <div className="app-frame">
        <aside className="sidebar" aria-label="Điều hướng chính">
          <div className="sidebar__brand">
            <div className="brand-mark" aria-hidden="true">
              P
            </div>
            <div>
              <p className="eyebrow">Smart parking</p>
              <p className="sidebar__title">{APP_DISPLAY_NAME}</p>
            </div>
          </div>

          <nav className="sidebar__nav">
            {APP_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' nav-link--active' : ''}`
                }
              >
                <span className="nav-link__icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <footer className="sidebar__foot">
            <p className="sidebar__foot-label">Trạng thái hệ thống</p>
            <p className="sidebar__foot-value">Đang vận hành</p>
          </footer>
        </aside>

        <div className="content-column">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
