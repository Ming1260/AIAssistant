import { Check, ChevronRight, CircleDot, Clock3, Download, ShieldCheck, Sparkles, Swords } from 'lucide-react'
import { SectionHeading, StageHero } from '../components/Shell.jsx'

export function LoadingView({ data, onApply, busy }) {
  return (
    <div className="stage-page">
      <StageHero
        image={data.champion.splash}
        icon={data.champion.icon}
        eyebrow={`${data.champion.role} · ${data.champion.name} VS ${data.matchup.enemy}`}
        title="开局前，只记住三件事"
        description="构筑、对线目标和团队职责已经按当前玩家画像压缩。详细信息可展开，进入游戏后自动收起。"
        aside={<><span>本局训练目标</span><strong>{data.champion.objective}</strong></>}
      />

      <div className="loading-layout">
        <section className="content-section build-section">
          <SectionHeading eyebrow="LOADOUT" title="首选构筑" action={<span className="public-note"><ShieldCheck size={14} /> 官方版本数据</span>} />
          <div className="loadout-row">
            <div className="rune-block">
              <span className="rune-orb"><Sparkles size={22} /></span>
              <div><small>基石符文</small><strong>{data.build.rune}</strong><span>{data.build.secondary}</span></div>
            </div>
            <div className="spell-block">
              {data.build.spells.map((spell) => <span key={spell}><CircleDot size={18} />{spell}</span>)}
            </div>
            <div className="item-route">
              {data.build.items.map((item, index) => (
                <div className="item-step" key={item.name}>
                  <img src={item.icon} alt={item.name} />
                  <small>{item.name}</small>
                  {index < data.build.items.length - 1 && <ChevronRight size={15} />}
                </div>
              ))}
            </div>
          </div>
          <div className="loadout-notes">
            <span><Clock3 size={16} />首次回城：{data.matchup.firstBack}</span>
            <span><Swords size={16} />备选条件：{data.build.alternate}</span>
          </div>
          <button type="button" className={data.buildApplied ? 'primary-button applied' : 'primary-button'} onClick={onApply} disabled={busy || data.buildApplied}>
            {data.buildApplied ? <Check size={18} /> : <Download size={18} />}
            {data.buildApplied ? '构筑已应用' : '一键应用构筑'}
          </button>
        </section>

        <div className="loading-columns">
          <section className="content-section mission-section">
            <SectionHeading eyebrow="LANE MISSION" title="对线任务" />
            <div className="mission-quote"><span>01</span><p>{data.laneTask}</p></div>
            <dl className="matchup-list">
              <div><dt>关键等级</dt><dd>{data.matchup.levelWindow}</dd></div>
              <div><dt>被抓风险</dt><dd>{data.matchup.risk}</dd></div>
            </dl>
          </section>

          <section className="content-section phase-plan-section">
            <SectionHeading eyebrow="GAME PLAN" title="三阶段职责" />
            <div className="phase-timeline">
              {data.phasePlan.map((item, index) => (
                <div className="phase-step" key={item.phase}>
                  <span className="phase-index">0{index + 1}</span>
                  <div><small>{item.phase}</small><strong>{item.title}</strong><p>{item.detail}</p></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
