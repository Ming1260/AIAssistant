import { Ban, Check, ChevronRight, Info, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MetricBar, SectionHeading, StageHero } from '../components/Shell.jsx'

export function BpView({ data, onSelect, busy }) {
  const selected = data.candidates.find((champion) => champion.id === data.selectedChampion)

  return (
    <div className="stage-page">
      <StageHero
        image={selected.splash}
        icon={selected.icon}
        eyebrow={`排位赛 · ${selected.role} · ${data.patch}`}
        title="选择你能执行的答案"
        description="先看熟练度，再补阵容职责，最后参考版本。推荐只使用公开阵容与自己的历史数据。"
        aside={<><span>当前优先</span><strong>{selected.name}</strong><small>{selected.score}% 适配</small></>}
      />

      <div className="content-grid bp-grid">
        <section className="content-section">
          <SectionHeading eyebrow="PICK RECOMMENDATION" title="英雄建议" action={<span className="limit-note">最多 3 项</span>} />
          <div className="candidate-grid">
            {data.candidates.map((champion) => {
              const active = champion.id === data.selectedChampion
              return (
                <article key={champion.id} className={active ? 'candidate-card active' : 'candidate-card'}>
                  <div className="candidate-portrait" style={{ backgroundImage: `url(${champion.splash})` }}>
                    <span className="fit-score">{champion.score}</span>
                    {active && <span className="selected-mark"><Check size={14} /> 已选择</span>}
                  </div>
                  <div className="candidate-body">
                    <div className="candidate-title">
                      <div><h4>{champion.name}</h4><span>{champion.role} · {champion.difficulty}</span></div>
                      <div className="tag-row">{champion.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    </div>
                    <p>{champion.reason}</p>
                    <div className="risk-line"><Info size={14} />{champion.risk}</div>
                    <button type="button" className={active ? 'secondary-button active' : 'secondary-button'} disabled={busy || active} onClick={() => onSelect(champion.id)}>
                      {active ? '已纳入阵容' : '选择并更新方案'}<ChevronRight size={16} />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          <section className="ban-section">
            <SectionHeading eyebrow="BAN ADVICE" title="Ban 位建议" action={<span className="public-note"><ShieldCheck size={14} /> 仅公开信息</span>} />
            <div className="ban-list">
              {data.bans.map((champion, index) => (
                <div className="ban-item" key={champion.id}>
                  <span className="ban-rank">0{index + 1}</span>
                  <img src={champion.icon} alt={champion.name} />
                  <div><strong>{champion.name}</strong><p>{champion.reason}</p></div>
                  <span className="ban-score"><Ban size={14} />{champion.score}</span>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="insight-rail">
          <section className="rail-section">
            <SectionHeading eyebrow="TEAM DUTY" title="阵容职责" />
            <div className="lineup-block">
              <span>己方</span>
              <div className="lineup-row">
                {data.ally.map((player) => (
                  <div className="lineup-player" key={`${player.role}-${player.name}`} title={`${player.role} · ${player.name}`}>
                    {player.icon ? <img src={player.icon} alt={player.name} /> : <span>?</span>}
                    <small>{player.role}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="lineup-block enemy">
              <span>敌方</span>
              <div className="lineup-row">
                {data.enemy.map((player) => (
                  <div className="lineup-player" key={`${player.role}-${player.name}`} title={`${player.role} · ${player.name}`}>
                    <img src={player.icon} alt={player.name} />
                    <small>{player.role}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="role-callout"><Target size={17} /><p><span>最优先补足</span>{data.roleGap}</p></div>
            <div className="metrics-stack">
              {data.composition.map((metric) => <MetricBar key={metric.label} {...metric} />)}
            </div>
          </section>

          <section className="rail-section curve-section">
            <SectionHeading eyebrow="POWER CURVE" title="阵容强势期" action={<Sparkles size={17} />} />
            <div className="chart-legend"><span className="ally-dot">己方</span><span className="enemy-dot">敌方</span></div>
            <div className="power-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.powerCurve} margin={{ top: 8, right: 8, left: -26, bottom: 0 }}>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#8f9aa4', fontSize: 11 }} />
                  <YAxis domain={[40, 100]} axisLine={false} tickLine={false} tick={{ fill: '#5e6871', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#11171b', border: '1px solid #2b353c', borderRadius: 6, fontSize: 12 }} />
                  <Line type="monotone" dataKey="ally" stroke="#25c7a5" strokeWidth={2.5} dot={{ r: 3, fill: '#25c7a5' }} />
                  <Line type="monotone" dataKey="enemy" stroke="#ed6a6d" strokeWidth={2} dot={{ r: 3, fill: '#ed6a6d' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-note">中期是己方最稳定的资源窗口；后期避免让对手先手开到双 C。</p>
          </section>
        </aside>
      </div>
    </div>
  )
}
