// Password gate for this Storybook, run by Vercel Routing Middleware.
// DSM_PASSWORD (set in Vercel) is the password; if it isn't set, the site stays open.
// DSM_NAME sets the title on the form. The logo comes from gate-logo.js.
// The password works for 10 minutes; after that the page asks for it again.
//
// Share links: once signed in, open /__dsm_share to make a link that works
// without the password until it expires (1 to 30 days). Every link is signed with
// a key made from the password, so changing DSM_PASSWORD cancels all links and sessions.

import { LOGO } from './gate-logo.js';

export const config = { matcher: '/:path*' };

const COOKIE = 'dsm_gate';
const SHARE_COOKIE = 'dsm_share';
const SESSION = 10 * 60; // the password lets you in for 10 minutes, then it asks again
const DAY = 60 * 60 * 24;
const SHARE_DAYS = [1, 3, 7, 14, 30];

const enc = new TextEncoder();

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function equal(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// A share key looks like "<expiry in unix seconds>.<signature>".
async function shareKey(password, expires) {
  return `${expires}.${await hmac(`dsm-share:${password}`, String(expires))}`;
}

async function checkShareKey(password, value) {
  const m = /^(\d{9,11})\.([A-Za-z0-9_-]{43})$/.exec(value || '');
  if (!m) return { ok: false };
  const expires = Number(m[1]);
  const valid = equal(await shareKey(password, expires), value);
  if (!valid) return { ok: false };
  return { ok: expires > Date.now() / 1000, expired: expires <= Date.now() / 1000, expires };
}

// A session looks like "<sign-in time>.<signature>" and only counts for SESSION seconds,
// checked here on the server, so an old cookie can't keep someone in.
async function checkSession(password, value) {
  const m = /^(\d{9,11})\.([A-Za-z0-9_-]{43})$/.exec(value || '');
  if (!m) return false;
  const issued = Number(m[1]);
  const age = Date.now() / 1000 - issued;
  if (age < 0 || age > SESSION) return false;
  return equal(`${issued}.${await hmac(`dsm-session:${password}`, String(issued))}`, value);
}

function safeNext(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function cookieValue(request, name) {
  for (const part of (request.headers.get('cookie') || '').split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1);
  }
  return '';
}

const STYLE = `*{box-sizing:border-box}html,body{height:100%;margin:0}
body{display:grid;place-items:center;background:#0B0B0C;color:#F2F0EA;font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;padding:24px}
form,main{width:100%;max-width:380px;display:flex;flex-direction:column;gap:14px}
.mark{display:block;width:56px;height:56px;color:#F2F0EA;margin-bottom:6px}
.word{font-size:34px;font-weight:700;letter-spacing:-.03em;line-height:1;margin-bottom:10px}
h1{margin:0;font-size:28px;letter-spacing:-.02em}
p{margin:0;color:#9D9A92}
label{font-size:13px;color:#C9C6BE}
input,select{width:100%;height:46px;padding:0 14px;border:1px solid #2E2E30;border-radius:8px;background:#151517;color:#F2F0EA;font:inherit}
input:focus,select:focus{outline:2px solid #F5441A;outline-offset:2px;border-color:transparent}
button{height:46px;border:0;border-radius:8px;background:#F2F0EA;color:#0B0B0C;font:600 15px inherit;font-family:inherit;cursor:pointer}
button:focus-visible{outline:2px solid #F5441A;outline-offset:2px}
.err{color:#FF8A7A;font-size:13px}
.note{font-size:13px}
.link{width:100%;padding:12px 14px;border:1px solid #2E2E30;border-radius:8px;background:#151517;font:13px/1.45 ui-monospace,Menlo,monospace;word-break:break-all;user-select:all}`;

function page(title, body, status = 200) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${escapeHtml(title)}</title><style>${STYLE}</style></head>
<body>${body}</body></html>`;
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}

function gatePage(name, next, message) {
  return page(`${name} · Password required`, `<form method="post" action="/__dsm_login">
${LOGO}
<h1>${escapeHtml(name)}</h1>
<p>This design system is private. Enter the password to view it.</p>
<label for="pw">Password</label>
<input id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
<input type="hidden" name="next" value="${escapeHtml(next)}">
${message ? `<div class="err" role="alert">${escapeHtml(message)}</div>` : ''}
<button type="submit">View design system</button>
</form>`, 401);
}

function sharePage(name, link, days, expires) {
  const options = SHARE_DAYS.map((d) => `<option value="${d}"${d === days ? ' selected' : ''}>${d === 1 ? '1 day' : `${d} days`}</option>`).join('');
  const result = link
    ? `<label>Your link, works until ${escapeHtml(new Date(expires * 1000).toUTCString().replace(' GMT', ' UTC'))}</label>
<div class="link">${escapeHtml(link)}</div>`
    : '';
  return page(`${name} · Share link`, `<form method="post" action="/__dsm_share">
${LOGO}
<h1>Share ${escapeHtml(name)}</h1>
<p>Make a link that opens this design system without the password. It stops working on its own when it expires.</p>
<label for="days">Link works for</label>
<select id="days" name="days">${options}</select>
<button type="submit">Create link</button>
${result}
<p class="note">To cancel every link early, change DSM_PASSWORD in Vercel and redeploy.</p>
</form>`);
}

export default async function middleware(request) {
  const password = process.env.DSM_PASSWORD;
  if (!password) return; // not configured: leave the site open

  const name = process.env.DSM_NAME || 'Design system';
  const url = new URL(request.url);
  const owner = await checkSession(password, cookieValue(request, COOKIE));

  // Sign in with the password.
  if (url.pathname === '/__dsm_login' && request.method === 'POST') {
    const form = await request.formData();
    const next = safeNext(form.get('next'));
    if (form.get('password') === password) {
      const issued = Math.floor(Date.now() / 1000);
      const session = `${issued}.${await hmac(`dsm-session:${password}`, String(issued))}`;
      return new Response(null, {
        status: 303,
        headers: {
          location: next,
          'set-cookie': `${COOKIE}=${session}; Path=/; Max-Age=${SESSION}; HttpOnly; Secure; SameSite=Lax`,
          'cache-control': 'no-store',
        },
      });
    }
    return gatePage(name, next, 'That password didn’t work. Try again.');
  }

  // Share link maker: only for someone signed in with the password.
  if (url.pathname === '/__dsm_share') {
    if (!owner) return gatePage(name, '/__dsm_share', '');
    if (request.method === 'POST') {
      const form = await request.formData();
      const days = SHARE_DAYS.includes(Number(form.get('days'))) ? Number(form.get('days')) : 7;
      const expires = Math.floor(Date.now() / 1000) + days * DAY;
      const link = `${url.origin}/?k=${await shareKey(password, expires)}`;
      return sharePage(name, link, days, expires);
    }
    return sharePage(name, '', 7, 0);
  }

  // Someone opening a share link.
  const k = url.searchParams.get('k');
  if (k !== null) {
    const result = await checkShareKey(password, k);
    url.searchParams.delete('k');
    const clean = url.pathname + url.search;
    if (result.ok) {
      const left = Math.max(1, Math.floor(result.expires - Date.now() / 1000));
      return new Response(null, {
        status: 303,
        headers: {
          location: clean,
          'set-cookie': `${SHARE_COOKIE}=${k}; Path=/; Max-Age=${left}; HttpOnly; Secure; SameSite=Lax`,
          'cache-control': 'no-store',
        },
      });
    }
    return gatePage(name, clean, result.expired ? 'This link has expired. Ask for a new one, or enter the password.' : 'This link isn’t valid. Ask for a new one, or enter the password.');
  }

  if (owner) return; // signed in: serve the Storybook
  if ((await checkShareKey(password, cookieValue(request, SHARE_COOKIE))).ok) return; // valid share link
  return gatePage(name, url.pathname + url.search, '');
}
