import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './app.js'
import { createStore } from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT || 8787)
const store = createStore(path.join(__dirname, '..', 'data', 'demo-state.json'))
const app = createApp({ store })

app.listen(port, '127.0.0.1', () => {
  console.log(`Rift Mate API listening on http://127.0.0.1:${port}`)
})
