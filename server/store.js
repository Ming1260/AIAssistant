import fs from 'node:fs'
import path from 'node:path'
import { initialState } from './data.js'

export function createStore(filePath = null) {
  let state = structuredClone(initialState)

  if (filePath && fs.existsSync(filePath)) {
    try {
      state = { ...state, ...JSON.parse(fs.readFileSync(filePath, 'utf8')) }
    } catch {
      state = structuredClone(initialState)
    }
  }

  const persist = () => {
    if (!filePath) return
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8')
  }

  return {
    get: () => state,
    update: (patch) => {
      state = { ...state, ...patch }
      persist()
      return state
    }
  }
}
