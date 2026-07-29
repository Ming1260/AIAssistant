import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'
import { ErrorState, LoadingState, Shell, Toast } from './components/Shell.jsx'
import { BpView } from './stages/BpView.jsx'
import { GameView } from './stages/GameView.jsx'
import { LoadingView } from './stages/LoadingView.jsx'
import { ReviewView } from './stages/ReviewView.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [stageData, setStageData] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const notify = useCallback((message) => {
    setToast(message)
    window.clearTimeout(window.__riftMateToast)
    window.__riftMateToast = window.setTimeout(() => setToast(''), 2600)
  }, [])

  const load = useCallback(async () => {
    try {
      setError('')
      const nextSession = await api.session()
      const content = await api.stage(nextSession.stage)
      setSession(nextSession)
      setStageData(content)
    } catch (requestError) {
      setError(requestError.message)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const run = async (operation, successMessage) => {
    try {
      setBusy(true)
      setError('')
      const result = await operation()
      if (successMessage) notify(successMessage)
      return result
    } catch (requestError) {
      setError(requestError.message)
      return null
    } finally {
      setBusy(false)
    }
  }

  const changeStage = async (stage) => {
    if (stage === session.stage) return
    const payload = await run(async () => {
      const nextSession = await api.setStage(stage)
      const content = await api.stage(stage)
      return { nextSession, content }
    })
    if (!payload) return
    setStageData(payload.content)
    setSession(payload.nextSession)
  }

  const changeProfile = async (profile) => {
    const nextSession = await run(() => api.setProfile(profile), '建议深度已更新')
    if (!nextSession) return
    setSession(nextSession)
    setStageData(await api.stage(nextSession.stage))
  }

  const connect = async (mode) => {
    const payload = await run(async () => {
      const nextSession = await api.connect(mode)
      const content = await api.stage(nextSession.stage)
      return { nextSession, content }
    })
    if (!payload) return
    const { nextSession } = payload
    setStageData(payload.content)
    setSession(nextSession)
    if (nextSession.connection.connected) {
      notify(mode === 'mock' ? '已切换到完整演示数据' : '已连接 League Client')
    } else {
      notify(nextSession.connection.reason || '未发现游戏客户端，演示数据仍可使用')
    }
  }

  const selectChampion = async (championId) => {
    const content = await run(() => api.selectChampion(championId), '英雄方案与加载配置已更新')
    if (content) {
      setStageData(content)
      setSession((current) => ({ ...current, selectedChampion: championId, buildApplied: false }))
    }
  }

  const applyBuild = async () => {
    const content = await run(() => api.applyBuild(), '符文、召唤师技能与装备方案已应用')
    if (content) setStageData(content)
  }

  const addAnnotation = async (payload) => {
    const annotation = await run(() => api.addAnnotation(payload), '批注已保存到本局回放')
    if (!annotation) return false
    setStageData((current) => ({ ...current, annotations: [...current.annotations, annotation] }))
    return true
  }

  const removeAnnotation = async (id) => {
    try {
      setBusy(true)
      setError('')
      await api.removeAnnotation(id)
      setStageData((current) => ({ ...current, annotations: current.annotations.filter((item) => item.id !== id) }))
      notify('批注已删除')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  if (error && !session) return <ErrorState message={error} onRetry={load} />
  if (!session || !stageData) return <LoadingState />

  const stageView = {
    bp: <BpView data={stageData} onSelect={selectChampion} busy={busy} />,
    loading: <LoadingView data={stageData} onApply={applyBuild} busy={busy} />,
    lane: <GameView data={stageData} />,
    mid: <GameView data={stageData} />,
    late: <GameView data={stageData} />,
    review: <ReviewView data={stageData} onAddAnnotation={addAnnotation} onRemoveAnnotation={removeAnnotation} onToast={notify} busy={busy} />
  }[session.stage]

  return (
    <>
      <Shell session={session} onStage={changeStage} onProfile={changeProfile} onConnect={connect} busy={busy}>
        {error && <div className="inline-error">{error}</div>}
        {stageView}
      </Shell>
      <Toast message={toast} />
    </>
  )
}
