import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CHAMPIONS, PROFILES, STAGES } from './data.js'
import { stageContent, stageFromGameflow } from './decision-engine.js'
import { LcuProvider } from './providers/lcu.js'
import { createStore } from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createApp({ store = createStore(), lcu = new LcuProvider() } = {}) {
  const app = express()
  app.use(express.json())

  const sessionPayload = (extra = {}) => {
    const state = store.get()
    return {
      ...state,
      stages: STAGES,
      profiles: PROFILES,
      connection: {
        connected: state.mode === 'mock' || Boolean(extra.connected),
        mode: state.mode,
        provider: state.mode === 'mock' ? '演示数据' : 'League Client',
        summoner: extra.summoner || '峡谷旅人',
        region: '艾欧尼亚',
        patch: '16.15.1 · 演示数据',
        reason: extra.reason || null
      }
    }
  }

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true, service: 'rift-mate-api' })
  })

  app.get('/api/session', async (_request, response) => {
    const state = store.get()
    if (state.mode !== 'lcu') {
      response.json(sessionPayload())
      return
    }
    try {
      const snapshot = await lcu.snapshot()
      if (snapshot.connected) {
        store.update({ stage: stageFromGameflow(snapshot.phase, snapshot.gameTime) })
      }
      response.json(sessionPayload(snapshot))
    } catch (error) {
      response.json(sessionPayload({ connected: false, reason: error.message }))
    }
  })

  app.post('/api/session/connect', async (request, response) => {
    const mode = request.body?.mode
    if (!['mock', 'lcu'].includes(mode)) {
      response.status(400).json({ error: 'mode must be mock or lcu' })
      return
    }
    store.update({ mode })
    if (mode === 'mock') {
      response.json(sessionPayload())
      return
    }
    try {
      const snapshot = await lcu.snapshot()
      if (snapshot.connected) {
        store.update({ stage: stageFromGameflow(snapshot.phase, snapshot.gameTime) })
      }
      response.json(sessionPayload(snapshot))
    } catch (error) {
      response.json(sessionPayload({ connected: false, reason: error.message }))
    }
  })

  app.post('/api/session/stage', (request, response) => {
    const stage = request.body?.stage
    if (!STAGES.some((item) => item.id === stage)) {
      response.status(400).json({ error: 'unknown stage' })
      return
    }
    store.update({ stage })
    response.json(sessionPayload())
  })

  app.post('/api/session/profile', (request, response) => {
    const profile = request.body?.profile
    if (!PROFILES.some((item) => item.id === profile)) {
      response.status(400).json({ error: 'unknown profile' })
      return
    }
    store.update({ profile })
    response.json(sessionPayload())
  })

  app.get('/api/stages/:stage', (request, response) => {
    const stage = request.params.stage
    if (!STAGES.some((item) => item.id === stage)) {
      response.status(404).json({ error: 'stage not found' })
      return
    }
    response.json(stageContent(stage, store.get()))
  })

  app.post('/api/bp/select', (request, response) => {
    const championId = request.body?.championId
    if (!CHAMPIONS[championId]) {
      response.status(400).json({ error: 'unknown champion' })
      return
    }
    store.update({ selectedChampion: championId, buildApplied: false })
    response.json(stageContent('bp', store.get()))
  })

  app.post('/api/loading/apply-build', (_request, response) => {
    store.update({ buildApplied: true })
    response.json(stageContent('loading', store.get()))
  })

  app.post('/api/review/annotations', (request, response) => {
    const time = String(request.body?.time ?? '').trim()
    const text = String(request.body?.text ?? '').trim()
    if (!/^\d{1,2}:\d{2}$/.test(time) || text.length < 2 || text.length > 160) {
      response.status(400).json({ error: '请输入有效时间和 2-160 字批注' })
      return
    }
    const state = store.get()
    const annotation = { id: `a${Date.now()}`, time, text, createdAt: new Date().toISOString() }
    store.update({ annotations: [...state.annotations, annotation] })
    response.status(201).json(annotation)
  })

  app.delete('/api/review/annotations/:id', (request, response) => {
    const state = store.get()
    store.update({ annotations: state.annotations.filter((item) => item.id !== request.params.id) })
    response.status(204).end()
  })

  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('*path', (_request, response) => {
    response.sendFile(path.join(distPath, 'index.html'))
  })

  return app
}
