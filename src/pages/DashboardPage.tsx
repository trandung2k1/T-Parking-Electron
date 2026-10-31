type DashboardStatTone = 'accent' | 'warm' | 'success' | 'danger';

type DashboardStat = {
  label: string;
  value: string;
  hint: string;
  tone: DashboardStatTone;
};

type ParkingSessionStatus = 'active' | 'completed';

type RecentParkingSession = {
  plateNumber: string;
  slotCode: string;
  checkInTime: string;
  checkOutTime?: string;
  feeLabel: string;
  status: ParkingSessionStatus;
};

const DASHBOARD_STATS: readonly DashboardStat[] = [
  {
    label: 'Chỗ trống',
    value: '47',
    hint: 'Tổng 120 chỗ',
    tone: 'accent',
  },
  {
    label: 'Xe trong bãi',
    value: '73',
    hint: '+5 so với sáng nay',
    tone: 'warm',
  },
  {
    label: 'Doanh thu hôm nay',
    value: '12,4 tr',
    hint: 'VNĐ · cập nhật realtime',
    tone: 'success',
  },
  {
    label: 'Cảnh báo',
    value: '2',
    hint: 'Barrier B · camera C3',
    tone: 'danger',
  },
];

const RECENT_PARKING_SESSIONS: readonly RecentParkingSession[] = [
  {
    plateNumber: '51F-123.45',
    slotCode: 'A-12',
    checkInTime: '09:14',
    feeLabel: '25.000đ',
    status: 'active',
  },
  {
    plateNumber: '30A-987.65',
    slotCode: 'B-03',
    checkInTime: '08:52',
    feeLabel: '—',
    status: 'active',
  },
  {
    plateNumber: '29C-555.88',
    slotCode: 'A-07',
    checkInTime: '08:01',
    checkOutTime: '09:05',
    feeLabel: '40.000đ',
    status: 'completed',
  },
];

function formatSessionTimeRange(session: RecentParkingSession): string {
  if (session.checkOutTime) {
    return `${session.checkInTime} → ${session.checkOutTime}`;
  }
  return session.checkInTime;
}

export function DashboardPage() {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Bãi đỗ · Tầng 1–3</p>
          <h1 className="page-title">Tổng quan vận hành</h1>
        </div>
        <p className="page-meta">Cập nhật: vừa xong · dữ liệu mẫu</p>
      </header>

      <div className="stat-grid">
        {DASHBOARD_STATS.map((stat) => (
          <article
            key={stat.label}
            className={`stat-card stat-card--${stat.tone}`}
          >
            <p className="stat-card__label">{stat.label}</p>
            <p className="stat-card__value">{stat.value}</p>
            <p className="stat-card__hint">{stat.hint}</p>
          </article>
        ))}
      </div>

      <section className="panel" aria-labelledby="recent-sessions-title">
        <div className="panel__head">
          <h2 id="recent-sessions-title" className="panel__title">
            Phiên gửi xe gần đây
          </h2>
          <span className="chip">Live queue</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Biển số</th>
                <th scope="col">Vị trí</th>
                <th scope="col">Giờ vào</th>
                <th scope="col">Phí</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_PARKING_SESSIONS.map((session) => (
                <tr key={session.plateNumber}>
                  <td>
                    <strong>{session.plateNumber}</strong>
                  </td>
                  <td>{session.slotCode}</td>
                  <td>{formatSessionTimeRange(session)}</td>
                  <td>{session.feeLabel}</td>
                  <td>
                    <span
                      className={`badge ${session.status === 'completed' ? 'badge--muted' : 'badge--live'}`}
                    >
                      {session.status === 'completed' ? 'Đã ra' : 'Đang gửi'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
