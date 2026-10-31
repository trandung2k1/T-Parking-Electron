import { APP_DISPLAY_NAME } from '../constants/app';

type SettingsRow = {
  label: string;
  hint: string;
  value: string;
};

const GENERAL_SETTINGS: readonly SettingsRow[] = [
  {
    label: 'Tên bãi',
    hint: 'Hiển thị trên vé và màn hình',
    value: `${APP_DISPLAY_NAME} Demo`,
  },
  {
    label: 'Chế độ cửa sổ',
    hint: 'Cửa sổ có khung Windows (thu nhỏ / phóng to / đóng)',
    value: 'Có title bar',
  },
  {
    label: 'DevTools',
    hint: 'Tắt ở bản phát hành (F12 / Ctrl+Shift+I bị chặn)',
    value: 'Chỉ khi phát triển',
  },
  {
    label: 'Đóng gói',
    hint: 'ASAR + minify · không kèm thư mục src · integrity fuse',
    value: 'Production hardened',
  },
];

export function SettingsPage() {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Hệ thống</p>
          <h1 className="page-title">Cài đặt</h1>
        </div>
      </header>

      <section className="panel">
        <h2 className="panel__title">Chung</h2>
        <ul className="settings-list">
          {GENERAL_SETTINGS.map((setting) => (
            <li key={setting.label} className="settings-row">
              <div>
                <p className="settings-row__label">{setting.label}</p>
                <p className="settings-row__hint">{setting.hint}</p>
              </div>
              <span className="settings-row__value">{setting.value}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
