import { connectDB } from '@/lib/db'
import Cv from '@/models/Cv'
import { getUserIdFromCookie } from '@/lib/auth'

function renderBasic(cv){return `
<style>:root{--c:${cv.themeColor||'#2563eb'}}body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:24px}header{display:flex;gap:16px;align-items:center;border-bottom:2px solid var(--c);padding-bottom:12px}img.avatar{width:90px;height:90px;object-fit:cover;border-radius:50%}h1{margin:0}h2{margin-top:18px;color:var(--c)}.muted{color:#475569}.chips span{display:inline-block;margin:4px 6px;padding:4px 8px;border:1px solid #e2e8f0;border-radius:9999px}a{color:var(--c)}</style>
<header>${cv.personal?.avatarUrl?`<img class="avatar" src="${cv.personal.avatarUrl}"/>`:''}<div><h1>${cv.personal?.fullName||''}</h1><div class="muted">${cv.personal?.title||''}</div><div class="muted">${cv.personal?.email||''}${cv.personal?.phone?' • '+cv.personal.phone:''}</div><div class="muted">${cv.personal?.location||''}</div></div></header>
${cv.personal?.summary?`<p>${cv.personal.summary}</p>`:''}
${cv.experiences?.length?`<h2>Expériences</h2>`:''}
${cv.experiences?.map(e=>`<div><strong>${e.title||''}</strong> — ${e.company||''} (${e.startDate||''} - ${e.endDate||''})<br/>${e.description||''}</div>`).join('')}
${cv.education?.length?`<h2>Formations</h2>`:''}
${cv.education?.map(ed=>`<div><strong>${ed.degree||''}</strong> — ${ed.school||''} (${ed.startDate||''} - ${ed.endDate||''})<br/>${ed.description||''}</div>`).join('')}
${cv.projects?.length?`<h2>Projets</h2>`:''}
${cv.projects?.map(p=>`<div><strong>${p.name||''}</strong> ${p.link?`— <a href="${p.link}">${p.link}</a>`:''}<br/>${p.description||''}</div>`).join('')}
${cv.skills?.length?`<h2>Compétences</h2><div class="chips">${cv.skills.map(s=>`<span>${s}</span>`).join('')}</div>`:''}
${cv.languages?.length?`<h2>Langues</h2><div class="chips">${cv.languages.map(l=>`<span>${l}</span>`).join('')}</div>`:''}
`}
function renderModern(cv){return `
<style>:root{--c:${cv.themeColor||'#2563eb'}}body{font-family:Inter,Arial,sans-serif;background:#f8fafc;color:#0f172a}.sheet{max-width:900px;margin:24px auto;background:#fff;border-radius:16px;box-shadow:0 10px 24px rgba(15,23,42,.08);overflow:hidden}.hero{display:flex;gap:16px;align-items:center;padding:24px 28px;background:linear-gradient(135deg,var(--c),#0ea5e9);color:#fff}img.avatar{width:96px;height:96px;object-fit:cover;border-radius:50%;border:3px solid #fff}h1{margin:0;font-size:28px}.grid{display:grid;grid-template-columns:1fr 2fr;gap:18px;padding:24px 28px}h2{margin:0 0 8px 0;border-left:4px solid var(--c);padding-left:8px}.tag{display:inline-block;margin:4px 6px;padding:4px 10px;border:1px solid #e2e8f0;border-radius:9999px}a{color:var(--c)}</style>
<div class="sheet"><div class="hero">${cv.personal?.avatarUrl?`<img class="avatar" src="${cv.personal.avatarUrl}"/>`:''}<div><h1>${cv.personal?.fullName||''}</h1><div>${cv.personal?.title||''}</div><div class="muted">${cv.personal?.email||''}${cv.personal?.phone?' • '+cv.personal.phone:''}${cv.personal?.location?' • '+cv.personal.location:''}</div></div></div><div class="grid"><div>${cv.summary?`<h2>À propos</h2><p>${cv.summary}</p>`:''}${cv.skills?.length?`<h2>Compétences</h2>${cv.skills.map(s=>`<span class="tag">${s}</span>`).join('')}`:''}${cv.languages?.length?`<h2>Langues</h2>${cv.languages.map(l=>`<span class="tag">${l}</span>`).join('')}`:''}</div><div>${cv.experiences?.length?`<h2>Expériences</h2>`:''}${cv.experiences?.map(e=>`<div><strong>${e.title||''}</strong> — ${e.company||''}<br/><small>${e.startDate||''} – ${e.endDate||''}</small><br/>${e.description||''}</div>`).join('')}${cv.education?.length?`<h2>Formations</h2>`:''}${cv.education?.map(ed=>`<div><strong>${ed.degree||''}</strong> — ${ed.school||''}<br/><small>${ed.startDate||''} – ${ed.endDate||''}</small><br/>${ed.description||''}</div>`).join('')}${cv.projects?.length?`<h2>Projets</h2>`:''}${cv.projects?.map(p=>`<div><strong>${p.name||''}</strong> ${p.link?`— <a href="${p.link}">${p.link}</a>`:''}<br/>${p.description||''}</div>`).join('')}</div></div></div>
`}
function renderClean(cv){return `
<style>:root{--c:${cv.themeColor||'#16a34a'}}body{font-family:ui-sans-serif,system-ui,Arial;margin:0;color:#111827}.wrap{max-width:820px;margin:0 auto;padding:40px}.top{display:flex;gap:20px;align-items:center}.bar{height:6px;background:var(--c);border-radius:6px;margin:18px 0}img.avatar{width:84px;height:84px;border-radius:12px;object-fit:cover}h1{margin:0}h3{margin:0;color:#374151;font-weight:500}h2{margin:18px 0 8px 0;letter-spacing:.02em;color:#065f46}.item{padding:8px 0;border-bottom:1px dashed #e5e7eb}.chip{display:inline-block;margin:4px 6px;padding:4px 10px;background:#f3f4f6;border-radius:9999px}a{color:#065f46}</style>
<div class="wrap"><div class="top">${cv.personal?.avatarUrl?`<img class="avatar" src="${cv.personal.avatarUrl}"/>`:''}<div><h1>${cv.personal?.fullName||''}</h1><h3>${cv.personal?.title||''}</h3><div>${cv.personal?.email||''}${cv.personal?.phone?' • '+cv.personal.phone:''}${cv.personal?.location?' • '+cv.personal.location:''}</div></div></div><div class="bar"></div>${cv.personal?.summary?`<p>${cv.personal.summary}</p>`:''}${cv.experiences?.length?`<h2>Expériences</h2>`:''}${cv.experiences?.map(e=>`<div class="item"><strong>${e.title||''}</strong> — ${e.company||''} (${e.startDate||''} - ${e.endDate||''})<br/>${e.description||''}</div>`).join('')}${cv.education?.length?`<h2>Formations</h2>`:''}${cv.education?.map(ed=>`<div class="item"><strong>${ed.degree||''}</strong> — ${ed.school||''} (${ed.startDate||''} - ${ed.endDate||''})<br/>${ed.description||''}</div>`).join('')}${cv.projects?.length?`<h2>Projets</h2>`:''}${cv.projects?.map(p=>`<div class="item"><strong>${p.name||''}</strong> ${p.link?`— <a href="${p.link}">${p.link}</a>`:''}<br/>${p.description||''}</div>`).join('')}${cv.skills?.length?`<h2>Compétences</h2>${cv.skills.map(s=>`<span class="chip">${s}</span>`).join('')}`:''}${cv.languages?.length?`<h2>Langues</h2>${cv.languages.map(l=>`<span class="chip">${l}</span>`).join('')}`:''}</div>
`}

function renderHTML(cv){
  const head = `<!doctype html><html><head><meta charset="utf-8"><title>${cv.personal?.fullName||'CV'}</title></head><body>`
  const body = (cv.template==='clean')?renderClean(cv):(cv.template==='basic')?renderBasic(cv):renderModern(cv)
  return head + body + `</body></html>`
}

export async function GET(_, { params }){
  await connectDB()
  const userId = getUserIdFromCookie()
  if (!userId) return new Response('Unauthorized', { status: 401 })
  const cv = await Cv.findOne({ _id: params.id, userId })
  if (!cv) return new Response('Not found', { status: 404 })
  const html = renderHTML(cv.toObject())
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
