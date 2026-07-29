import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../server/app.js'
import { createStore } from '../server/store.js'

function testApp() {
  return createApp({
    store: createStore(),
    lcu: { snapshot: async () => ({ connected: false, reason: 'test' }) }
  })
}

describe('Rift Mate API', () => {
  it('returns a complete mock session', async () => {
    const response = await request(testApp()).get('/api/session').expect(200)
    expect(response.body.stage).toBe('bp')
    expect(response.body.connection.connected).toBe(true)
    expect(response.body.stages).toHaveLength(6)
  })

  it('updates the player profile and serves personalized game content', async () => {
    const app = testApp()
    await request(app).post('/api/session/profile').send({ profile: 'expert' }).expect(200)
    const response = await request(app).get('/api/stages/mid').expect(200)
    expect(response.body.hint.action).toContain('提前 11 秒')
  })

  it('persists review annotations through the API store', async () => {
    const app = testApp()
    const created = await request(app)
      .post('/api/review/annotations')
      .send({ time: '12:34', text: '先清线再进河道。' })
      .expect(201)
    const review = await request(app).get('/api/stages/review').expect(200)
    expect(review.body.annotations.some((item) => item.id === created.body.id)).toBe(true)
  })
})
