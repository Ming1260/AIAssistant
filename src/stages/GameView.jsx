import { AlertTriangle, ArrowRight, Clock3, EyeOff, Radio, ShieldAlert, Sparkles, TimerReset, Volume2 } from 'lucide-react'
import { SectionHeading, StageHero } from '../components/Shell.jsx'

const phaseDescriptions = {
  lane: '稳定获得经济和经验，识别对拼、回城和被抓窗口。',
  mid: '先处理兵线，再把个人优势转化为塔、视野和地图资源。',
  late: '围绕大龙、远古龙和兵线，降低一次掉点结束比赛的风险。'
}

export function GameView({ data }) {
  return (
    <div className="stage-page game-page">
      <StageHero
        image={data.champion.splash}
        icon={data.champion.icon}
        eyebrow={`LIVE · ${data.clock} · ${data.phaseLabel}`}
        title={data.hint.action}
        description={phaseDescriptions[data.stage]}
        aside={<><span>建议置信度</span><strong>{data.confidence}%</strong><small>仅基于合法视野</small></>}
      />

      <section className="live-stat-strip" aria-label="实时对局数据">
        {data.stats.map((stat) => (
          <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.delta}</small></div>
        ))}
      </section>

      <div className="game-layout">
        <section className="decision-panel">
          <div className="decision-header">
            <div className="decision-pulse"><Radio size={19} /></div>
            <div><span className="eyebrow">NOW · ONE ACTION</span><h3>{data.hint.action}</h3></div>
            <button type="button" className="icon-button" title="播报当前建议"><Volume2 size={18} /></button>
          </div>
          <p className="decision-reason">{data.hint.reason}</p>
          <div className="decision-meta">
            <span><ShieldAlert size={15} />风险已验证</span>
            <span><Sparkles size={15} />适配当前建议深度</span>
            <span><TimerReset size={15} />8 秒后重新判断</span>
          </div>
          {data.explanationSuppressed && (
            <div className="suppression-note"><EyeOff size={16} />检测到补刀操作，长解释已自动收起。</div>
          )}
        </section>

        <aside className="objective-panel">
          <SectionHeading eyebrow="OBJECTIVE CLOCK" title="关键窗口" />
          <div className="objective-list">
            {data.objectives.map((objective) => (
              <div key={objective.name} className={`objective-item ${objective.status}`}>
                <Clock3 size={17} />
                <span>{objective.name}</span>
                <strong>{objective.time}</strong>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="signal-section">
        <SectionHeading eyebrow="VISIBLE SIGNALS" title="判断依据" action={<span className="public-note"><EyeOff size={14} /> 不读取战争迷雾</span>} />
        <div className="signal-list">
          {data.signals.map((signal) => (
            <div className={`signal-item ${signal.tone}`} key={`${signal.time}-${signal.label}`}>
              <span>{signal.time}</span>
              {signal.tone === 'danger' ? <AlertTriangle size={16} /> : <ArrowRight size={16} />}
              <p>{signal.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
