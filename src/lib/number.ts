/** Parse chuỗi input thành số hữu hạn, hoặc `null` nếu không hợp lệ. */
export function parseFiniteNumber(rawValue: string): number | null {
  const value = Number.parseFloat(rawValue);
  return Number.isFinite(value) ? value : null;
}

/**
 * Đảm bảo giá trị IPC là số hữu hạn.
 * Ném lỗi nếu renderer gửi kiểu sai (chống invoke tùy ý).
 */
export function assertFiniteNumber(
  value: unknown,
  argumentName: string,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`"${argumentName}" phải là số hữu hạn.`);
  }
  return value;
}
