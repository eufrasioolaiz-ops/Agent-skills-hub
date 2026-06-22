# Floating Performance BI

本地电脑性能监测小浮窗。启动后会显示一个横向、透明磨砂、置顶的 Electron 窗口，实时展示：

- CPU 利用率
- CPU 温度
- 内存占用率
- GPU 利用率

## 使用

```powershell
npm install
npm start
```

也可以直接双击桌面上的 `性能BI小浮窗.lnk` 启动。这个快捷方式直接调用 Electron 图形程序，不会一直挂着 PowerShell 窗口。

如果快捷方式丢失或项目路径变了，可以重新生成：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\create-shortcut.ps1
```

窗口右上角可以最小化或关闭，窗口主体区域可以拖动。

## 传感器说明

CPU 利用率和内存占用率直接由 Node.js 读取。GPU 利用率通过 Windows GPU Performance Counters 读取。

CPU 温度在 Windows 上受硬件、驱动和传感器权限影响较大。程序会优先读取 LibreHardwareMonitor/OpenHardwareMonitor 暴露的传感器，其次尝试 Windows ACPI 温区。如果系统没有开放温度传感器，小窗会显示 `--°C`。

如需提高 CPU 温度兼容性，可以在本机安装并运行 LibreHardwareMonitor 或 OpenHardwareMonitor。

## 文件

- `src/main.js`: Electron 主进程与浮窗配置
- `src/metrics.js`: 本机性能指标采样
- `src/preload.js`: 安全 IPC 桥接
- `src/renderer.js`: 指标渲染与历史曲线
- `src/styles.css`: 透明玻璃科技风 UI
- `assets/concept-floating-performance-bi.png`: 视觉概念图
