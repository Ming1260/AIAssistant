async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `请求失败 (${response.status})`)
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  session: () => request('/api/session'),
  stage: (stage) => request(`/api/stages/${stage}`),
  setStage: (stage) => request('/api/session/stage', { method: 'POST', body: JSON.stringify({ stage }) }),
  setProfile: (profile) => request('/api/session/profile', { method: 'POST', body: JSON.stringify({ profile }) }),
  connect: (mode) => request('/api/session/connect', { method: 'POST', body: JSON.stringify({ mode }) }),
  selectChampion: (championId) => request('/api/bp/select', { method: 'POST', body: JSON.stringify({ championId }) }),
  applyBuild: () => request('/api/loading/apply-build', { method: 'POST' }),
  addAnnotation: (payload) => request('/api/review/annotations', { method: 'POST', body: JSON.stringify(payload) }),
  removeAnnotation: (id) => request(`/api/review/annotations/${id}`, { method: 'DELETE' })
}
