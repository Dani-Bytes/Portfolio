const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestGet({ request, env }) {
  const user = env.GITHUB_USER || 'Dani-Bytes'
  const cache = caches.default
  const cacheKey = new Request(request.url, request)
  const cached = await cache.match(cacheKey)
  if (cached) return cached

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-site',
  }
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`

  const res = await fetch(`https://api.github.com/users/${user}`, { headers })
  if (!res.ok) {
    return Response.json({ error: 'GitHub profile fetch failed.' }, { status: 502, headers: corsHeaders })
  }

  const data = await res.json()
  const payload = {
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    htmlUrl: data.html_url,
    publicRepos: data.public_repos,
    followers: data.followers,
  }

  const response = Response.json(payload, {
    headers: {
      ...corsHeaders,
      'Cache-Control': 'public, max-age=86400',
    },
  })
  await cache.put(cacheKey, response.clone())
  return response
}
