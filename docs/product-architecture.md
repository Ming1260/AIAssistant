# 产品流程与架构

## 产品核心流程

```mermaid
flowchart TD
    A["启动峡谷智能搭子"] --> B{"是否检测到 League Client"}
    B -- "已连接" --> C["本地后端读取 lockfile<br/>建立只读游戏会话"]
    B -- "未连接" --> D["进入 Demo 模式<br/>使用 Mock 数据"]
    C --> E["识别当前游戏阶段"]
    D --> E

    E --> BP["BP 阶段<br/>英雄选择与禁用分析<br/>阵容缺口与克制关系<br/>个性化英雄、符文及召唤师技能建议"]
    BP --> LOAD["加载阶段<br/>对位分析<br/>双方阵容胜负条件<br/>出装路线与阶段目标"]
    LOAD --> LANE["对线期<br/>补刀与换血策略<br/>敌方打野风险<br/>推线、控线与回城窗口"]
    LANE --> MID["中期转线<br/>分路与抱团判断<br/>资源与防御塔优先级<br/>转线及视野建议"]
    MID --> LATE["后期决策<br/>单带或接团判断<br/>大龙与远古龙准备<br/>关键技能、站位和存活优先级"]

    LANE --> GATE
    MID --> GATE
    LATE --> GATE
    GATE{"建议是否满足<br/>数据合法可见、置信度足够<br/>且能够立即执行"}
    GATE -- "否" --> SILENT["保持静默<br/>记录到赛后复盘"]
    GATE -- "是" --> BUSY{"玩家是否处于<br/>高操作强度时刻"}
    BUSY -- "是" --> DELAY["延迟或取消提示"]
    BUSY -- "否" --> TIP["只展示一条<br/>简短、可执行建议"]

    TIP --> RESULT["比赛结束"]
    SILENT --> RESULT
    DELAY --> RESULT
    RESULT --> REVIEW["赛后复盘<br/>关键事件与时间轴<br/>可控决策分析<br/>录像标注与一项成长目标"]
    REVIEW --> PROFILE["更新玩家画像<br/>英雄池、打法偏好<br/>忽略的提示与成长趋势"]
    PROFILE --> NEXT["用于下一场个性化决策"]
    NEXT --> E
```

## 产品架构

```mermaid
flowchart TB
    subgraph CLIENT["外部游戏环境"]
        LC["League Client / LCU"]
        LIVE["Live Client Data API"]
        MATCH["官方比赛记录与时间轴"]
        VERSION["版本、英雄及装备数据"]
    end

    subgraph LOCAL["用户设备上的本地可信边界"]
        subgraph EXPERIENCE["体验层"]
            UI["React / Vite 主界面"]
            BPUI["BP 工作台"]
            LOADUI["加载计划"]
            OVERLAY["对局提示悬浮层"]
            REVIEWUI["赛后复盘时间轴"]
        end

        subgraph APPLICATION["应用与 API 层"]
            API["Express 本地 API"]
            SESSION["游戏会话与阶段服务"]
            PROFILE["玩家画像服务"]
            BUILD["英雄、符文及出装服务"]
            REVIEWSVC["复盘与标注服务"]
        end

        subgraph DECISION["决策引擎层"]
            NORMALIZE["上下文标准化"]
            PHASE["阶段识别"]
            ADAPT["玩家画像适配"]
            EVALUATE["置信度与风险评估"]
            SCHEDULER["提示调度与静默控制"]
            ANALYZER["赛后决策分析"]
        end

        subgraph ADAPTER["数据接入层"]
            LCUA["LCU Adapter"]
            LIVEA["Live Client Adapter"]
            MATCHA["Postgame Adapter"]
            KNOWLEDGE["版本知识库"]
            MOCK["Mock Provider"]
        end

        subgraph STORAGE["本地数据层"]
            SNAPSHOT[("对局状态快照")]
            PLAYER[("玩家成长画像")]
            HISTORY[("复盘与标注历史")]
        end
    end

    UI --> BPUI
    UI --> LOADUI
    UI --> OVERLAY
    UI --> REVIEWUI
    BPUI --> API
    LOADUI --> API
    OVERLAY --> API
    REVIEWUI --> API

    API --> SESSION
    API --> PROFILE
    API --> BUILD
    API --> REVIEWSVC

    LC -->|"已接入：阶段、召唤师"| LCUA
    LIVE -->|"已接入：游戏时间"| LIVEA
    MATCH -. "待接入：赛后时间轴" .-> MATCHA
    VERSION -. "待接入：实时版本数据" .-> KNOWLEDGE

    LCUA --> NORMALIZE
    LIVEA --> NORMALIZE
    MATCHA --> ANALYZER
    KNOWLEDGE --> BUILD
    MOCK -->|"当前核心内容兜底"| NORMALIZE

    NORMALIZE --> PHASE
    PHASE --> ADAPT
    PROFILE --> ADAPT
    ADAPT --> EVALUATE
    EVALUATE --> SCHEDULER
    SCHEDULER --> API
    ANALYZER --> REVIEWSVC

    SESSION --> SNAPSHOT
    PROFILE <--> PLAYER
    REVIEWSVC <--> HISTORY
```

## 架构说明

产品采用前端体验层、本地应用与 API 层、决策引擎层、数据接入层和本地存储层组成的分层架构。整体以用户设备本地运行为主，游戏客户端凭据和个人对局数据不需要暴露给浏览器。

体验层由 React 和 Vite 实现，负责 BP、加载、对局提示及赛后复盘等界面。前端仅通过本地 API 获取标准化后的会话状态和决策结果，不直接连接 League Client。

应用与 API 层由 Express 提供统一服务入口，管理游戏会话、玩家画像、英雄构筑和复盘标注。它同时构成安全边界：LCU 的认证信息只在本地后端内存中使用，不返回给前端。

决策引擎将游戏数据转换为适合当前阶段的行动建议。引擎先标准化上下文并识别阶段，再结合玩家画像评估建议的置信度、风险和可执行性。对局中处于高操作强度或依据不足时，提示调度器会延迟提示或保持静默，将相关问题留到赛后复盘。

数据接入层通过适配器隔离不同数据源。目前 Demo 已接入 LCU 游戏阶段、当前召唤师以及 Live Client Data 的游戏时间；BP 实时状态、完整对局事件、资源与视野信息、赛后时间轴和实时版本数据仍需继续接入。Mock Provider 在客户端不可用或适配器尚未完成时提供演示数据。

本地存储保存会话快照、玩家成长画像以及复盘标注历史。赛后分析结果会更新玩家画像，并在下一场比赛中影响提示内容和优先级，从而形成跨对局的持续成长闭环。

系统默认只读，不执行自动选人、自动禁用、自动购买、角色控制或战争迷雾信息推断。
