import { useState } from 'react'
import { BookmarkPlus, CheckCircle2, ChevronRight, Play, Plus, Target, Trash2, Trophy } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SectionHeading } from '../components/Shell.jsx'

export function ReviewView({ data, onAddAnnotation, onRemoveAnnotation, onToast, busy }) {
  const [time, setTime] = useState('18:00')
  const [text, setText] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    const ok = await onAddAnnotation({ time, text })
    if (ok) setText('')
  }

  return (
    <div className="stage-page review-page">
      <section className="review-summary">
        <div className="result-mark"><Trophy size={26} /><span>{data.match.result}</span></div>
        <div className="review-title">
          <span className="eyebrow">2 MIN REVIEW · {data.match.duration}</span>
          <h2>{data.conclusion}</h2>
          <p>只分析你能改变的决策，不评价队友，不用单一 KDA 替代结论。</p>
        </div>
        <div className="match-score"><span>{data.match.champion}</span><strong>{data.match.score}</strong><small>评级 {data.match.grade}</small></div>
      </section>

      <section className="review-metrics">
        {data.metrics.map((metric) => (
          <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.delta}</small></div>
        ))}
      </section>

      <div className="review-layout">
        <div className="review-main">
          <section className="goal-band">
            <Target size={22} />
            <div><span>下一局唯一主目标</span><strong>{data.primaryGoal}</strong><small>补充：{data.secondaryGoal}</small></div>
            <CheckCircle2 size={20} />
          </section>

          <section className="content-section curve-review">
            <SectionHeading eyebrow="EVIDENCE" title="优势变化证据" action={<span className="limit-note">相对对位差</span>} />
            <div className="review-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.curves} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#222b30" strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="minute" unit="′" axisLine={false} tickLine={false} tick={{ fill: '#87929b', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#65717a', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#11171b', border: '1px solid #2b353c', borderRadius: 6, fontSize: 12 }} />
                  <Legend iconType="line" wrapperStyle={{ fontSize: 11, color: '#9aa4ac' }} />
                  <Line type="monotone" dataKey="gold" name="经济" stroke="#e0aa4f" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="cs" name="补刀" stroke="#25c7a5" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="xp" name="经验" stroke="#579cf2" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="decision-review-section">
            <SectionHeading eyebrow="DECISION TIMELINE" title="关键决策节点" action={<span className="limit-note">仅保留 {data.decisions.length} 项</span>} />
            <div className="review-timeline">
              {data.decisions.map((decision) => (
                <article className="review-node" key={decision.id}>
                  <div className="node-time"><span>{decision.time}</span><small>{decision.impact}影响</small></div>
                  <div className="node-body">
                    <div className="node-title"><h4>{decision.title}</h4><button type="button" className="icon-button" title="跳转到回放" onClick={() => onToast(`已定位回放 ${decision.time}`)}><Play size={16} /></button></div>
                    <dl>
                      <div><dt>当时可见</dt><dd>{decision.visible}</dd></div>
                      <div><dt>你的选择</dt><dd>{decision.choice}</dd></div>
                      <div><dt>更稳方案</dt><dd>{decision.alternative}</dd></div>
                      <div className="gain-row"><dt>预期收益</dt><dd>{decision.gain}</dd></div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="annotation-rail">
          <SectionHeading eyebrow="REPLAY NOTES" title="回放批注" action={<BookmarkPlus size={17} />} />
          <form className="annotation-form" onSubmit={submit}>
            <label><span>时间点</span><input value={time} onChange={(event) => setTime(event.target.value)} placeholder="18:00" /></label>
            <label><span>你的判断</span><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="记录当时为什么这样选择……" maxLength={160} /></label>
            <button type="submit" className="primary-button" disabled={busy || text.trim().length < 2}><Plus size={17} />添加批注</button>
          </form>
          <div className="annotation-list">
            {data.annotations.map((annotation) => (
              <div className="annotation-item" key={annotation.id}>
                <button type="button" className="time-jump" onClick={() => onToast(`已定位回放 ${annotation.time}`)}>{annotation.time}<ChevronRight size={14} /></button>
                <p>{annotation.text}</p>
                <button type="button" className="icon-button danger" title="删除批注" onClick={() => onRemoveAnnotation(annotation.id)}><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
