const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const allowedRepos = [
  'Code_Carnival',
  'Asian-Antique-Store',
  'Nova-Site',
  'FYP_Management',
  'CyberBank',
]

export function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const repo = url.searchParams.get('repo')
  const user = env.GITHUB_USER || 'Dani-Bytes'
  if (!repo || !allowedRepos.includes(repo)) {
    return Response.json({ error: 'Repo not allowed.' }, { status: 400, headers: corsHeaders })
  }

  const cache = caches.default
  const cacheKey = new Request(request.url, request)
  const cached = await cache.match(cacheKey)
  if (cached) return cached

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-site',
  }
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`

  const res = await fetch(`https://api.github.com/repos/${user}/${repo}/readme`, { headers })
  if (!res.ok) {
    return Response.json({ error: 'README fetch failed.' }, { status: 502, headers: corsHeaders })
  }

  const data = await res.json()
  const content = data.content ? atob(data.content.replace(/\n/g, '')) : ''
  const response = Response.json({ content }, {
    headers: {
      ...corsHeaders,
      'Cache-Control': 'public, max-age=86400',
    },
  })
  await cache.put(cacheKey, response.clone())
  return response
}
