import { describe, expect, it } from 'vitest'
import { stageContent, stageFromGameflow } from '../server/decision-engine.js'
import { initialState } from '../server/data.js'

describe('stageFromGameflow', () => {
  it('maps live game time into lane, mid and late stages', () => {
    expect(stageFromGameflow('InProgress', 8 * 60)).toBe('lane')
    expect(stageFromGameflow('InProgress', 18 * 60)).toBe('mid')
    expect(stageFromGameflow('InProgress', 31 * 60)).toBe('late')
  })

  it('maps client phases into BP, loading and review', () => {
    expect(stageFromGameflow('ChampSelect')).toBe('bp')
    expect(stageFromGameflow('LoadingScreen')).toBe('loading')
    expect(stageFromGameflow('EndOfGame')).toBe('review')
  })
})

describe('stageContent', () => {
  it('changes the in-game action to match the player profile', () => {
    const novice = stageContent('lane', { ...initialState, profile: 'new' })
    const expert = stageContent('lane', { ...initialState, profile: 'expert' })

    expect(novice.hint.action).toBe('先吃完这一波兵，再回城')
    expect(expert.hint.reason).toContain('62 金币')
  })

  it('keeps BP recommendations within the documented limit', () => {
    const bp = stageContent('bp', initialState)
    expect(bp.candidates).toHaveLength(3)
    expect(bp.bans).toHaveLength(3)
  })
})
