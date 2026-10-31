import { NativeBridgePanel } from '../components/NativeBridgePanel';

export function NativePage() {
  return (
    <main className="page page--narrow">
      <header className="page-header">
        <div>
          <p className="eyebrow">N-API · IPC</p>
          <h1 className="page-title">Native bridge</h1>
        </div>
      </header>
      <NativeBridgePanel />
    </main>
  );
}
