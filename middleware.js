// Password gate for this Storybook, run by Vercel Routing Middleware.
// The password lives in the DSM_PASSWORD environment variable (set in Vercel);
// if it isn't set, the site stays open. DSM_NAME sets the title on the form.

export const config = { matcher: '/:path*' };

const COOKIE = 'dsm_gate';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeNext(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function gatePage(name, next, wrong) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${escapeHtml(name)} · Password required</title>
<style>
*{box-sizing:border-box}html,body{height:100%;margin:0}
body{display:grid;place-items:center;background:#0B0B0C;color:#F2F0EA;font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;padding:24px}
form{width:100%;max-width:360px;display:flex;flex-direction:column;gap:14px}
h1{margin:0;font-size:28px;letter-spacing:-.02em}
p{margin:0;color:#9D9A92}
label{font-size:13px;color:#C9C6BE}
input{width:100%;height:46px;padding:0 14px;border:1px solid #2E2E30;border-radius:8px;background:#151517;color:#F2F0EA;font:inherit}
input:focus{outline:2px solid #F5441A;outline-offset:2px;border-color:transparent}
button{height:46px;border:0;border-radius:8px;background:#F2F0EA;color:#0B0B0C;font:600 15px inherit;font-family:inherit;cursor:pointer}
button:focus-visible{outline:2px solid #F5441A;outline-offset:2px}
.err{color:#FF8A7A;font-size:13px}
</style></head>
<body><form method="post" action="/__dsm_login">
<h1>${escapeHtml(name)}</h1>
<p>This design system is private. Enter the password to view it.</p>
<label for="pw">Password</label>
<input id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
<input type="hidden" name="next" value="${escapeHtml(next)}">
${wrong ? '<div class="err" role="alert">That password didn’t work. Try again.</div>' : ''}
<button type="submit">View design system</button>
</form></body></html>`;
  return new Response(html, {
    status: 401,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}

export default async function middleware(request) {
  const password = process.env.DSM_PASSWORD;
  if (!password) return; // not configured: leave the site open

  const name = process.env.DSM_NAME || 'Design system';
  const token = await sha256(`dsm-gate:${password}`);
  const url = new URL(request.url);

  if (url.pathname === '/__dsm_login' && request.method === 'POST') {
    const form = await request.formData();
    const next = safeNext(form.get('next'));
    if (form.get('password') === password) {
      return new Response(null, {
        status: 303,
        headers: {
          location: next,
          'set-cookie': `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          'cache-control': 'no-store',
        },
      });
    }
    return gatePage(name, next, true);
  }

  const cookies = (request.headers.get('cookie') || '').split(/;\s*/);
  if (cookies.includes(`${COOKIE}=${token}`)) return; // signed in: serve the Storybook

  return gatePage(name, url.pathname + url.search, false);
}
