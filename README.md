# Rift Mate Demo

LOL 峡谷智能搭子的全栈交互 Demo，范围严格对应 PRD 中的核心功能：BP、加载、对线期、中期转线、后期决策和赛后复盘。

## 启动

```powershell
pnpm install
pnpm dev
```

- 前端：http://127.0.0.1:5173
- 后端：http://127.0.0.1:8787

## 游戏客户端接入

默认使用完整模拟数据，便于无游戏环境时体验全部阶段。点击左下角“尝试连接客户端”后，后端会只读检查 League Client 的 `lockfile`，并读取：

- `/lol-gameflow/v1/gameflow-phase`：识别 BP、加载、对局中和结算阶段。
- `/lol-summoner/v1/current-summoner`：识别当前玩家。
- `https://127.0.0.1:2999/liveclientdata/gamestats`：根据合法的游戏时间区分对线、中期和后期。

非默认安装目录可通过 `LCU_LOCKFILE` 或 `LOL_INSTALL_DIR` 指定。认证信息仅在后端内存中使用，不会返回前端。Demo 不调用自动选人、自动 Ban、移动、购买或其他代操作接口。

## API

- `GET /api/session`：连接状态、玩家画像和当前阶段。
- `POST /api/session/connect`：切换模拟/LCU 数据源。
- `POST /api/session/stage`：演示模式切换阶段。
- `POST /api/session/profile`：切换建议深度。
- `GET /api/stages/:stage`：获取当前阶段的决策内容。
- `POST /api/bp/select`：选择英雄并更新后续方案。
- `POST /api/loading/apply-build`：模拟应用构筑。
- `POST/DELETE /api/review/annotations`：保存或删除回放批注。

## 验证

```powershell
pnpm test
pnpm build
```
