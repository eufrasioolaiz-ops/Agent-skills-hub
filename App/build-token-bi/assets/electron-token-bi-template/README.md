# Floating Token BI

本地桌面悬浮 Token 看板，用 Electron 做透明磨砂、置顶、横栏式小窗，监控：

- MiniMax 5 小时限额、周限额、套餐到期提醒
- MiMo Token Plan 套餐用量、套餐到期提醒
- DeepSeek 充值余额、本月消费

## 使用

```powershell
npm install
npm start
```

第一次启动后，分别点击各卡片或详情页里的 `登录/打开` 按钮，在弹出的本地 Electron 窗口里登录 MiniMax、MiMo、DeepSeek。登录态保存在本机 Electron 会话分区中，不需要在看板里填写账号密码。

刷新规则：

- 启动时刷新一次
- 默认每 5 分钟后台刷新一次
- 点击右上角刷新按钮可手动刷新
- 页面未登录、站点结构变化或网络失败时，看板会显示对应平台的状态

也可以生成桌面快捷方式：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\create-shortcut.ps1
```

快捷方式直接调用 Electron 图形程序，不会一直挂着 PowerShell 窗口。

## 数据采集

程序使用各平台的网页登录态读取控制台页面文本，并只把结构化结果传给前端：

- `https://platform.minimaxi.com/console/usage`
- `https://platform.xiaomimimo.com/console/plan-manage`
- `https://platform.deepseek.com/usage`

MiniMax 套餐到期时间会优先从页面中的“套餐详情/订阅”链接进入识别；如果站点路由调整，可能需要更新 `src/token-monitor.js` 里的 `PLATFORMS.minimax.urls.detail`。

## 文件

- `src/main.js`: Electron 主进程、浮窗配置、刷新调度
- `src/token-monitor.js`: 平台网页登录态、隐藏页面采集、字段解析
- `src/preload.js`: 安全 IPC 桥接
- `src/renderer.js`: 四标签数据渲染
- `src/styles.css`: 横栏玻璃科技风 UI
- `scripts/create-shortcut.ps1`: 桌面快捷方式
