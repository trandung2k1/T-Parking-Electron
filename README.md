# T-Parking

Hệ thống quản lý bãi đỗ xe thông minh — ứng dụng desktop **Electron** với giao diện **React**, tích hợp **Native Addon (N-API / C++)** cho phần xử lý hiệu năng cao.

| | |
|---|---|
| **Phiên bản** | 1.0.0 |
| **License** | MIT |
| **Nền tảng chính** | Windows x64 (Linux / macOS có maker tương ứng) |
| **Tác giả** | trandung2k1 |

---

## Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ](#công-nghệ)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt](#cài-đặt)
- [Chạy phát triển](#chạy-phát-triển)
- [Native Addon](#native-addon)
- [Scripts](#scripts)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Kiến trúc ứng dụng](#kiến-trúc-ứng-dụng)
- [Đóng gói & cài đặt](#đóng-gói--cài-đặt)
- [Bảo mật & tối ưu bản phát hành](#bảo-mật--tối-ưu-bản-phát-hành)
- [Kiểm tra chất lượng](#kiểm-tra-chất-lượng)
- [Xử lý sự cố](#xử-lý-sự-cố)
- [License](#license)

---

## Tính năng

- Giao diện quản lý bãi đỗ (dashboard, phiên gửi xe, cài đặt) với routing React
- Bridge gọi **Native Addon** qua IPC an toàn (`contextBridge` + preload)
- Demo API native: `getVersion()`, `addNumbers(left, right)`
- Cửa sổ Windows chuẩn (thu nhỏ / phóng to / đóng)
- Bản phát hành: ASAR minify, không kèm `src/`, tắt DevTools, Electron Fuses

> Một số màn hình hiện dùng **dữ liệu mẫu** — sẵn sàng gắn API / native thật (barrier, ANPR, …).

---

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Desktop shell | Electron **45.1.0** |
| Build / đóng gói | Electron Forge 8 + Vite Plugin |
| UI | React 19, React Router 7 |
| Ngôn ngữ | TypeScript |
| Bundler | Vite 8 |
| Native | node-gyp, **node-addon-api** (N-API) |
| Lint / format | oxlint, oxfmt |

---

## Yêu cầu môi trường

- **Node.js** ≥ 22.12 (theo engine của Electron 45)
- **npm** (đã kiểm thử với npm 11)
- **Windows x64** để build native / Squirrel installer
- Toolchain native (Windows):
  - [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (workload **Desktop development with C++**)
  - Python (node-gyp)

---

## Cài đặt

```bash
git clone <repository-url>
cd T-Parking
npm install
```

Build native addon (bắt buộc trước lần chạy đầu hoặc sau khi đổi Electron):

```bash
npm run build:native
```

File output:

```text
native/build/Release/parking_addon.node
```

> Script `build:native` dùng `--target=45.1.0` khớp Electron hiện tại. Khi nâng Electron, cập nhật target trong `package.json` cho đúng phiên bản.

---

## Chạy phát triển

```bash
npm start
```

- Hot reload renderer qua Vite
- DevTools **chỉ bật ở chế độ phát triển** (không mở tự động)
- Native addon load từ `native/build/Release/parking_addon.node`

---

## Native Addon

### API hiện có

| Hàm | Mô tả |
|---|---|
| `getVersion()` | Chuỗi phiên bản addon (vd. `t-parking-native-1.0.0`) |
| `addNumbers(left, right)` | Cộng hai số hữu hạn ở tầng C++ |

### Luồng gọi

```text
Renderer (React)
  → window.parkingNative.*          (preload / contextBridge)
    → ipcRenderer.invoke(...)
      → ipcMain.handle(...)         (main process)
        → parking_addon.node        (N-API)
```

### TypeScript

- Kiểu module: `src/native/parking-addon.types.ts`
- Global `window.parkingNative`: `src/native/parking-addon.global.d.ts`
- Tham số IPC được validate ở **preload** và **main** (`assertFiniteNumber`)

### Build / clean

```bash
npm run build:native
npm run clean:native
```

Bản đóng gói copy addon vào `resources/parking_addon.node` (`extraResource` trong Forge).

---

## Scripts

| Script | Mô tả |
|---|---|
| `npm start` | Chạy app (Electron Forge + Vite) |
| `npm run package` | Đóng gói thư mục chạy được (`out/`) |
| `npm run make` | Tạo installer (Windows: Squirrel Setup) |
| `npm run release` | Publish (Forge release) |
| `npm run build:native` | Build `parking_addon.node` cho Electron |
| `npm run clean:native` | Xóa artifact native |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | oxlint + kiểm tra format |
| `npm run lint:fix` | Tự sửa lint / format |

---

## Cấu trúc dự án

```text
T-Parking/
├── assets/                 # Icon app
├── native/
│   ├── binding.gyp
│   └── src/parking_addon.cpp
├── src/
│   ├── main.ts             # Entry main process
│   ├── main/               # Window, IPC native, security
│   ├── preload.ts          # contextBridge API
│   ├── renderer.tsx        # Entry React
│   ├── App.tsx             # Router + lazy pages
│   ├── layout/             # App shell / sidebar
│   ├── pages/              # Dashboard, Sessions, Native, Settings
│   ├── components/         # UI (vd. NativeBridgePanel)
│   ├── hooks/              # useParkingNative
│   ├── constants/          # Routes, window sizes
│   ├── lib/                # Helpers (number, format-error)
│   └── native/             # Types / ambient cho addon
├── forge.config.mts        # Packager, makers, fuses, ignore asar
├── vite.*.config.mts       # Vite main / preload / renderer
├── vite.shared.mts         # Build options dùng chung
├── index.html
└── package.json
```

---

## Kiến trúc ứng dụng

### Process model

| Process | Vai trò |
|---|---|
| **Main** | Cửa sổ, IPC, load native `.node`, hardening |
| **Preload** | Expose `window.parkingNative` — không lộ Node đầy đủ |
| **Renderer** | React UI, `nodeIntegration: false`, `sandbox: true` |

### Routes (HashRouter)

| Path | Màn hình |
|---|---|
| `#/` | Tổng quan vận hành |
| `#/sessions` | Phiên gửi xe / làn cổng |
| `#/native` | Demo Native bridge |
| `#/settings` | Cài đặt hệ thống |

HashRouter phù hợp Electron (`file://`) khi chạy bản đóng gói.

---

## Đóng gói & cài đặt

### Package (thư mục portable)

```bash
npm run build:native   # nếu chưa có .node
npm run package
```

Kết quả (Windows x64):

```text
out/T-Parking-win32-x64/T-Parking.exe
```

### Make (installer)

```bash
npm run make
```

Windows: Squirrel Setup trong `out/make/...`.

**Lưu ý:** đóng hết process `T-Parking.exe` trước khi `package` / `make` — Windows có thể khóa `app.asar` (`EBUSY`).

### Nội dung asar (bản phát hành)

Chỉ đóng gói:

- `package.json`
- `assets/`
- `.vite/build/` (main + preload)
- `.vite/renderer/` (UI)

Không đóng: `src/`, `native/` source, `node_modules` (đã bundle bằng Vite).  
Native binary nằm ngoài asar: `resources/parking_addon.node`.

### Vite renderer

`base: './'` — bắt buộc để script/CSS load đúng trên protocol `file://`.

---

## Bảo mật & tối ưu bản phát hành

| Hạng mục | Chi tiết |
|---|---|
| Context isolation | Bật |
| Node ở renderer | Tắt (`nodeIntegration: false`) |
| Sandbox | Bật |
| DevTools | Chỉ khi `!app.isPackaged` |
| Phím tắt DevTools | Chặn F12 / Ctrl+Shift+I|J|C ở production |
| Navigation / popup | Chặn URL lạ, `window.open` deny |
| IPC | Validate kiểu số trước khi gọi native |
| ASAR | Minify, không sourcemap, không kèm `src/` |
| Electron Fuses | `OnlyLoadAppFromAsar`, integrity validation, tắt `RunAsNode`, … |

> Electron/JS không mã hóa tuyệt đối. Logic nhạy cảm nên đặt trong **native addon** và code-sign bản cài khi phát hành chính thức.

---

## Kiểm tra chất lượng

```bash
npm run typecheck
npm run lint
# hoặc
npm run lint:fix
```

---

## Xử lý sự cố

### App mở nhưng màn hình trắng (bản Setup)

- Đảm bảo asar có `.vite/renderer/main_window/index.html`
- `vite.renderer.config.mts` phải có `base: './'`
- Không ignore nhầm `.vite/renderer` trong `forge.config.mts`
- Đóng app cũ → `npm run make` lại

### Lỗi load `parking_addon.node`

```bash
npm run build:native
```

Kiểm tra Electron target trong script khớp `electron` trong `package.json`.

### `EBUSY` khi package/make

Đóng `T-Parking.exe` (và process liên quan), xóa/đợi unlock thư mục `out/`, chạy lại.

### Cảnh báo Vite `configLoader: 'native'`

Config phải là `.mts` và import có đuôi file, ví dụ:

```ts
import { productionBuildOptions } from './vite.shared.mts';
```

---

## License

MIT © trandung2k1
