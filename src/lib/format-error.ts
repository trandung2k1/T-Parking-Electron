/** Chuẩn hóa lỗi không xác định thành chuỗi hiển thị được. */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
