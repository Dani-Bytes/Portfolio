const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const sanitize = (value) => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

const parseRss = (xml, source) => {
  const items = []
  const matches = xml.match(/<item>[\s\S]*?<\/item>/g) || []
  for (const item of matches) {
    const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)
    const link = item.match(/<link>(.*?)<\/link>/)
    const date = item.match(/<pubDate>(.*?)<\/pubDate>/)
    const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/)

    items.push({
      title: sanitize(title ? title[1] || title[2] || '' : ''),
      url: link ? link[1] : '',
      date: date ? date[1] : '',
      description: sanitize(desc ? desc[1] || desc[2] || '' : ''),
      source,
    })
  }
  return items
}

export function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestGet({ request }) {
  const cache = caches.default
  const cacheKey = new Request(request.url, request)
  const cached = await cache.match(cacheKey)
  if (cached) return cached

  const [devRes, fccRes] = await Promise.all([
    fetch('https://dev.to/api/articles?top=7&per_page=4'),
    fetch('https://www.freecodecamp.org/news/rss/'),
  ])

  const items = []
  if (devRes.ok) {
    const devPosts = await devRes.json()
    items.push(
      ...devPosts.map((post) => ({
        title: post.title,
        url: post.url,
        date: post.published_at,
        description: post.description || post.title,
        source: 'dev.to',
      }))
    )
  }

  if (fccRes.ok) {
    const rss = await fccRes.text()
    items.push(...parseRss(rss, 'freeCodeCamp'))
  }

  const normalized = items
    .filter((item) => item.title && item.url)
    .map((item) => ({
      ...item,
      date: item.date ? new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '',
      description: item.description.slice(0, 140),
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  const response = Response.json({ items: normalized }, {
    headers: {
      ...corsHeaders,
      'Cache-Control': 'public, max-age=86400',
    },
  })

  await cache.put(cacheKey, response.clone())
  return response
}
