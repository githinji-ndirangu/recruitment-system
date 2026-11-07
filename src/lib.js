import {ALLOC} from './data'
export const money=(n,c='KES')=>`${c} ${Number(n||0).toLocaleString()}`
export const readiness=(c,types)=>Math.round(types.filter(t=>c.docs?.[t]?.status==='Verified').length/types.length*100)
export const score=(c,j,types)=>{let s=0
if(c.category===j.category)s+=40
s+=Math.round(20*Math.min(c.experience/5,1))
if(c.qualification)s+=10
if(c.prefCountries.includes(j.country))s+=8
if(c.prefCats.includes(j.category))s+=7
s+=Math.round(15*readiness(c,types)/100);return Math.min(100,s)}
export const jobStats=(db,j)=>{const types=db.settings.docTypes
const apps=db.applications.filter(a=>a.jobId===j.id)
const allocated=apps.filter(a=>ALLOC.includes(a.stage)).length
const remaining=Math.max(0,j.vacancies-allocated)
const busy=new Set(db.applications.filter(a=>ALLOC.includes(a.stage)).map(a=>a.candId))
const qualified=db.candidates.filter(c=>c.category===j.category&&c.availability!=='Placed'&&!busy.has(c.id)&&score(c,j,types)>=60).length
const diff=qualified-remaining
return{allocated,remaining,qualified,diff,apps:apps.length,balance:diff>0?'Surplus':diff<0?'Shortage':'Balanced'}}
export const paidBy=(db,id)=>db.payments.filter(p=>p.candId===id).reduce((a,p)=>a+p.amount,0)
export const byId=(list,id)=>list.find(x=>x.id===id)
export const fmtDate=d=>d?new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—'
