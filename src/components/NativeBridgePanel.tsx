import { useCallback, useEffect, useState } from 'react';
import { useParkingNative } from '../hooks/useParkingNative';
import { formatErrorMessage } from '../lib/format-error';
import { parseFiniteNumber } from '../lib/number';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

type VersionResult = {
  status: RequestStatus;
  value: string | null;
  errorMessage: string | null;
};

type SumResult = {
  status: RequestStatus;
  value: number | null;
  errorMessage: string | null;
};

const INITIAL_VERSION_RESULT: VersionResult = {
  status: 'idle',
  value: null,
  errorMessage: null,
};

const INITIAL_SUM_RESULT: SumResult = {
  status: 'idle',
  value: null,
  errorMessage: null,
};

export function NativeBridgePanel() {
  const { isBridgeAvailable, getVersion, addNumbers } = useParkingNative();

  const [versionResult, setVersionResult] = useState<VersionResult>(
    INITIAL_VERSION_RESULT,
  );
  const [leftOperandInput, setLeftOperandInput] = useState('12');
  const [rightOperandInput, setRightOperandInput] = useState('30');
  const [sumResult, setSumResult] = useState<SumResult>(INITIAL_SUM_RESULT);

  const refreshAddonVersion = useCallback(async () => {
    setVersionResult({
      status: 'loading',
      value: null,
      errorMessage: null,
    });

    try {
      const version = await getVersion();
      setVersionResult({
        status: 'success',
        value: version,
        errorMessage: null,
      });
    } catch (error) {
      setVersionResult({
        status: 'error',
        value: null,
        errorMessage: formatErrorMessage(error),
      });
    }
  }, [getVersion]);

  useEffect(() => {
    if (isBridgeAvailable) {
      void refreshAddonVersion();
    }
  }, [isBridgeAvailable, refreshAddonVersion]);

  async function handleAddNumbers(): Promise<void> {
    const leftOperand = parseFiniteNumber(leftOperandInput);
    const rightOperand = parseFiniteNumber(rightOperandInput);

    if (leftOperand === null || rightOperand === null) {
      setSumResult({
        status: 'error',
        value: null,
        errorMessage: 'Vui lòng nhập hai số hợp lệ.',
      });
      return;
    }

    setSumResult({
      status: 'loading',
      value: null,
      errorMessage: null,
    });

    try {
      const sum = await addNumbers(leftOperand, rightOperand);
      setSumResult({
        status: 'success',
        value: sum,
        errorMessage: null,
      });
    } catch (error) {
      setSumResult({
        status: 'error',
        value: null,
        errorMessage: formatErrorMessage(error),
      });
    }
  }

  const isVersionLoading = versionResult.status === 'loading';
  const isSumLoading = sumResult.status === 'loading';

  return (
    <section className="native-panel" aria-labelledby="native-panel-title">
      <div className="panel-head">
        <div>
          <h2 id="native-panel-title" className="panel-title">
            Native Addon
          </h2>
          <p className="panel-subtitle">
            Gọi hàm C++ qua N-API · IPC · contextBridge
          </p>
        </div>
        <span
          className={`status-pill ${isBridgeAvailable ? 'status-pill--ok' : 'status-pill--warn'}`}
        >
          <span className="status-dot" aria-hidden="true" />
          {isBridgeAvailable ? 'Bridge hoạt động' : 'Bridge không khả dụng'}
        </span>
      </div>

      <div className="native-grid">
        <article className="native-card">
          <div
            className="native-card__icon native-card__icon--version"
            aria-hidden="true"
          >
            v
          </div>
          <div className="native-card__body">
            <h3 className="native-card__title">getVersion()</h3>
            <p className="native-card__desc">
              Trả về chuỗi phiên bản addon được biên dịch từ native.
            </p>
            <div className="native-result" role="status" aria-live="polite">
              {isVersionLoading && (
                <span className="native-result__muted">Đang tải…</span>
              )}
              {versionResult.status === 'success' && versionResult.value && (
                <code className="native-result__value">
                  {versionResult.value}
                </code>
              )}
              {versionResult.status === 'error' && (
                <span className="native-result__error">
                  {versionResult.errorMessage}
                </span>
              )}
              {versionResult.status === 'idle' && !isBridgeAvailable && (
                <span className="native-result__muted">
                  Chưa kết nối preload.
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => void refreshAddonVersion()}
            disabled={!isBridgeAvailable || isVersionLoading}
          >
            Làm mới
          </button>
        </article>

        <article className="native-card native-card--wide">
          <div
            className="native-card__icon native-card__icon--math"
            aria-hidden="true"
          >
            +
          </div>
          <div className="native-card__body">
            <h3 className="native-card__title">addNumbers(left, right)</h3>
            <p className="native-card__desc">
              Cộng hai số thực trong native addon và trả kết quả về renderer.
            </p>

            <div className="calc-row">
              <label className="field">
                <span className="field__label">left</span>
                <input
                  className="field__input"
                  type="number"
                  inputMode="decimal"
                  value={leftOperandInput}
                  onChange={(event) => setLeftOperandInput(event.target.value)}
                  disabled={!isBridgeAvailable}
                />
              </label>
              <span className="calc-op" aria-hidden="true">
                +
              </span>
              <label className="field">
                <span className="field__label">right</span>
                <input
                  className="field__input"
                  type="number"
                  inputMode="decimal"
                  value={rightOperandInput}
                  onChange={(event) => setRightOperandInput(event.target.value)}
                  disabled={!isBridgeAvailable}
                />
              </label>
              <span className="calc-op" aria-hidden="true">
                =
              </span>
              <div className="calc-output" aria-live="polite">
                {isSumLoading && (
                  <span className="native-result__muted">…</span>
                )}
                {sumResult.status === 'success' && sumResult.value !== null && (
                  <strong className="calc-output__value">
                    {sumResult.value}
                  </strong>
                )}
                {(sumResult.status === 'idle' ||
                  sumResult.status === 'error') &&
                  sumResult.value === null && (
                    <span className="native-result__muted">—</span>
                  )}
              </div>
            </div>

            {sumResult.status === 'error' && sumResult.errorMessage && (
              <p className="native-inline-error" role="alert">
                {sumResult.errorMessage}
              </p>
            )}
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => void handleAddNumbers()}
            disabled={!isBridgeAvailable || isSumLoading}
          >
            Gọi native
          </button>
        </article>
      </div>

      <footer className="panel-foot">
        <p>
          API: <code>window.parkingNative.getVersion()</code>,{' '}
          <code>window.parkingNative.addNumbers(left, right)</code>
        </p>
      </footer>
    </section>
  );
}
