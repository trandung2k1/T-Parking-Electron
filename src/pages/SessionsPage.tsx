type GateLaneStatus = 'open' | 'processing' | 'paused';

type GateLane = {
  id: string;
  label: string;
  status: GateLaneStatus;
  throughputLabel: string;
};

const GATE_LANE_STATUS_LABEL: Record<GateLaneStatus, string> = {
  open: 'Mở',
  processing: 'Đang xử lý',
  paused: 'Tạm dừng',
};

const GATE_LANES: readonly GateLane[] = [
  {
    id: 'IN-1',
    label: 'Cổng vào 1',
    status: 'open',
    throughputLabel: '3 xe / phút',
  },
  {
    id: 'IN-2',
    label: 'Cổng vào 2',
    status: 'open',
    throughputLabel: '2 xe / phút',
  },
  {
    id: 'OUT-1',
    label: 'Cổng ra 1',
    status: 'processing',
    throughputLabel: '5 xe / phút',
  },
  {
    id: 'OUT-2',
    label: 'Cổng ra 2',
    status: 'paused',
    throughputLabel: '—',
  },
];

export function SessionsPage() {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Vận hành · Làn xe</p>
          <h1 className="page-title">Phiên gửi xe</h1>
        </div>
        <button type="button" className="btn btn--primary" disabled>
          + Mở phiên thủ công
        </button>
      </header>

      <div className="lane-grid">
        {GATE_LANES.map((lane) => (
          <article key={lane.id} className="lane-card">
            <p className="lane-card__id">{lane.id}</p>
            <h2 className="lane-card__title">{lane.label}</h2>
            <dl className="lane-card__meta">
              <div>
                <dt>Trạng thái</dt>
                <dd>{GATE_LANE_STATUS_LABEL[lane.status]}</dd>
              </div>
              <div>
                <dt>Lưu lượng</dt>
                <dd>{lane.throughputLabel}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <section className="panel panel--muted">
        <h2 className="panel__title">Tiếp theo</h2>
        <p className="panel__text">
          Kết nối native addon để đọc barrier, camera ANPR và đồng bộ phiên gửi
          xe thật. Giao diện này là khung layout sẵn sàng cho API backend.
        </p>
      </section>
    </main>
  );
}
