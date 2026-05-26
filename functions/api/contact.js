const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function onRequestOptions() {
  return new Response(null, { headers: corsHeaders })
}

export async function onRequestPost({ request, env }) {
  try {
    const { from, message } = await request.json()

    if (!from || !message) {
      return Response.json({ ok: false, error: 'Missing fields.' }, { status: 400, headers: corsHeaders })
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
      return Response.json(
        { ok: false, error: 'Server email is not configured.' },
        { status: 500, headers: corsHeaders }
      )
    }

    const payload = {
      from: env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev',
      to: [env.CONTACT_TO_EMAIL],
      subject: `Portfolio message from ${from}`,
      reply_to: from,
      text: message,
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const detail = await res.text()
      return Response.json(
        { ok: false, error: 'Email send failed.', detail },
        { status: 502, headers: corsHeaders }
      )
    }

    return Response.json({ ok: true }, { headers: corsHeaders })
  } catch (err) {
    return Response.json(
      { ok: false, error: 'Invalid request.' },
      { status: 400, headers: corsHeaders }
    )
  }
}
