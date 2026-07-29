import { BP_DATA, BUILDS, CHAMPIONS, GAME_DATA, PROFILE_COPY, REVIEW_DATA } from './data.js'

export function stageContent(stage, state) {
  const champion = CHAMPIONS[state.selectedChampion] ?? CHAMPIONS.ahri
  const profileCopy = PROFILE_COPY[state.profile] ?? PROFILE_COPY.active

  if (stage === 'bp') {
    return {
      ...BP_DATA,
      ally: BP_DATA.ally.map((player) => player.role === '中路'
        ? { ...player, name: champion.name, icon: champion.icon }
        : player),
      selectedChampion: champion.id
    }
  }

  if (stage === 'loading') {
    return {
      champion,
      build: BUILDS[champion.id],
      buildApplied: state.buildApplied,
      laneTask: profileCopy.loading,
      phasePlan: [
        { phase: '对线期', title: '稳住线权', detail: '三级前避免无收益换血；河道无视野时让线回推。' },
        { phase: '中期', title: '跟蔚找先手', detail: '资源刷新前推线回城，优先控制中路与河道入口。' },
        { phase: '团战', title: '拉扯后排', detail: '用魅惑补充先手，第二轮技能保护金克丝输出。' }
      ],
      matchup: {
        enemy: '维克托', enemyIcon: '/assets/viktor.png',
        levelWindow: '三级前以补刀为主，六级后可寻找短换血。',
        firstBack: BUILDS[champion.id].firstBack,
        risk: '李青可能三级变奏；2:45-3:20 避免无视野压线。'
      },
      powerCurve: BP_DATA.powerCurve
    }
  }

  if (['lane', 'mid', 'late'].includes(stage)) {
    return {
      ...GAME_DATA[stage],
      champion,
      hint: profileCopy[stage],
      stage,
      explanationSuppressed: stage === 'lane'
    }
  }

  return {
    ...REVIEW_DATA,
    annotations: state.annotations,
    selectedChampion: champion
  }
}

export function stageFromGameflow(phase, gameTime = 0) {
  if (phase === 'ChampSelect') return 'bp'
  if (phase === 'LoadingScreen') return 'loading'
  if (['PreEndOfGame', 'EndOfGame', 'WaitingForStats'].includes(phase)) return 'review'
  if (phase === 'InProgress') {
    if (gameTime < 14 * 60) return 'lane'
    if (gameTime < 28 * 60) return 'mid'
    return 'late'
  }
  return 'bp'
}
