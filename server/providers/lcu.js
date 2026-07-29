import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'

const COMMON_LOCKFILES = [
  'C:\\Riot Games\\League of Legends\\lockfile',
  'D:\\Riot Games\\League of Legends\\lockfile',
  'E:\\Riot Games\\League of Legends\\lockfile'
]

function httpsJson({ hostname = '127.0.0.1', port, pathname, headers = {} }) {
  return new Promise((resolve, reject) => {
    const request = https.request({
      hostname,
      port,
      path: pathname,
      method: 'GET',
      headers,
      rejectUnauthorized: false,
      timeout: 1200
    }, (response) => {
      let body = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => { body += chunk })
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`LCU request failed with ${response.statusCode}`))
          return
        }
        try {
          resolve(JSON.parse(body))
        } catch {
          resolve(body)
        }
      })
    })
    request.on('timeout', () => request.destroy(new Error('LCU request timed out')))
    request.on('error', reject)
    request.end()
  })
}

export class LcuProvider {
  constructor(env = process.env) {
    this.env = env
  }

  findLockfile() {
    const candidates = [
      this.env.LCU_LOCKFILE,
      this.env.LOL_INSTALL_DIR ? path.join(this.env.LOL_INSTALL_DIR, 'lockfile') : null,
      ...COMMON_LOCKFILES
    ].filter(Boolean)
    return candidates.find((candidate) => fs.existsSync(candidate)) ?? null
  }

  credentials() {
    const lockfile = this.findLockfile()
    if (!lockfile) return null
    const [name, pid, port, password, protocol] = fs.readFileSync(lockfile, 'utf8').trim().split(':')
    if (!name || !pid || !port || !password || !protocol) return null
    return { name, pid: Number(pid), port: Number(port), password, protocol, lockfile }
  }

  async snapshot() {
    const credentials = this.credentials()
    if (!credentials) {
      return { connected: false, reason: '未发现 League Client lockfile' }
    }
    const authorization = `Basic ${Buffer.from(`riot:${credentials.password}`).toString('base64')}`
    const [phase, summoner] = await Promise.all([
      httpsJson({ port: credentials.port, pathname: '/lol-gameflow/v1/gameflow-phase', headers: { Authorization: authorization } }),
      httpsJson({ port: credentials.port, pathname: '/lol-summoner/v1/current-summoner', headers: { Authorization: authorization } })
    ])

    let gameTime = 0
    if (phase === 'InProgress') {
      try {
        const live = await httpsJson({ port: 2999, pathname: '/liveclientdata/gamestats' })
        gameTime = Number(live.gameTime ?? 0)
      } catch {
        gameTime = 0
      }
    }

    return {
      connected: true,
      phase,
      gameTime,
      summoner: summoner.displayName || summoner.gameName || '已连接玩家'
    }
  }
}
