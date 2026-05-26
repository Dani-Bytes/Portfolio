const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const levelColors = ['#0a150a', '#0d3d15', '#14662a', '#1a9940', '#22cc55']

export function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestGet({ request, env }) {
  const user = env.GITHUB_USER || 'Dani-Bytes'
  const cache = caches.default
  const cacheKey = new Request(request.url, request)
  const cached = await cache.match(cacheKey)
  if (cached) return cached

  const res = await fetch(`https://github.com/users/${user}/contributions`)
  if (!res.ok) {
    return Response.json({ error: 'Contributions fetch failed.' }, { status: 502, headers: corsHeaders })
  }

  const html = await res.text()
  const days = []
  const regex = /data-date="([^"]+)"[^>]*data-level="([^"]+)"[^>]*data-count="([^"]+)"/g
  let match
  while ((match = regex.exec(html)) !== null) {
    const date = match[1]
    const level = Number.parseInt(match[2], 10)
    const count = Number.parseInt(match[3], 10)
    const color = levelColors[level] || levelColors[0]
    days.push({ date, level, count, color })
  }

  const response = Response.json({ days }, {
    headers: {
      ...corsHeaders,
      'Cache-Control': 'public, max-age=86400',
    },
  })
  await cache.put(cacheKey, response.clone())
  return response
}
