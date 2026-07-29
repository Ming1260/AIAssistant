import {
  Activity,
  BarChart3,
  CheckCircle2,
  Crown,
  Crosshair,
  LoaderCircle,
  PanelLeftClose,
  PlugZap,
  Radar,
  Route,
  ShieldBan,
  Swords,
  Wifi,
  WifiOff
} from 'lucide-react'

const stageIcons = {
  bp: ShieldBan,
  loading: LoaderCircle,
  lane: Crosshair,
  mid: Route,
  late: Crown,
  review: BarChart3
}

export function Shell({ session, children, onStage, onProfile, onConnect, busy }) {
  const currentIndex = session.stages.findIndex((stage) => stage.id === session.stage)
  const connection = session.connection

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Radar size={22} strokeWidth={1.8} /></div>
          <div>
            <strong>RIFT MATE</strong>
            <span>峡谷决策台</span>
          </div>
        </div>

        <nav className="stage-nav" aria-label="对局阶段">
          {session.stages.map((stage, index) => {
            const Icon = stageIcons[stage.id]
            return (
              <button
                type="button"
                key={stage.id}
                className={stage.id === session.stage ? 'stage-link active' : 'stage-link'}
                onClick={() => onStage(stage.id)}
                title={stage.label}
              >
                <span className="stage-number">{String(index + 1).padStart(2, '0')}</span>
                <Icon size={18} />
                <span>{stage.label}</span>
                {index < currentIndex && <CheckCircle2 className="stage-done" size={15} />}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-meta">
          <div className="connection-line">
            {connection.connected ? <Wifi size={16} /> : <WifiOff size={16} />}
            <div>
              <span>{connection.connected ? '数据通道已连接' : '等待游戏客户端'}</span>
              <small>{connection.provider}</small>
            </div>
          </div>
          <button type="button" className="text-button" onClick={() => onConnect(connection.mode === 'mock' ? 'lcu' : 'mock')}>
            <PlugZap size={15} />
            {connection.mode === 'mock' ? '尝试连接客户端' : '切回演示数据'}
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="stage-context">
            <span className="eyebrow">SESSION 24-0729 · {currentIndex + 1}/{session.stages.length}</span>
            <h1>{session.stages[currentIndex]?.label}阶段</h1>
          </div>
          <div className="topbar-actions">
            <div className="live-status"><Activity size={15} /> 实时同步</div>
            <label className="profile-control">
              <span>建议深度</span>
              <select value={session.profile} onChange={(event) => onProfile(event.target.value)} disabled={busy}>
                {session.profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>{profile.label} · {profile.caption}</option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}

export function Toast({ message }) {
  if (!message) return null
  return <div className="toast" role="status"><CheckCircle2 size={18} />{message}</div>
}

export function LoadingState() {
  return (
    <div className="loading-state">
      <LoaderCircle className="spin" size={28} />
      <span>正在同步对局状态</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <PanelLeftClose size={28} />
      <h2>数据暂时不可用</h2>
      <p>{message}</p>
      <button className="primary-button" type="button" onClick={onRetry}>重新连接</button>
    </div>
  )
}

export function StageHero({ image, icon, eyebrow, title, description, aside }) {
  return (
    <section className="stage-hero" style={{ '--hero-image': `url(${image})` }}>
      <div className="hero-content">
        {icon && <img src={icon} alt="" className="hero-avatar" />}
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {aside && <div className="hero-aside">{aside}</div>}
    </section>
  )
}

export function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h3>{title}</h3>
      </div>
      {action}
    </div>
  )
}

export function MetricBar({ label, value, tone = 'teal' }) {
  return (
    <div className="metric-bar">
      <div><span>{label}</span><strong>{value}</strong></div>
      <div className="meter-track"><span className={`meter-fill ${tone}`} style={{ width: `${value}%` }} /></div>
    </div>
  )
}
