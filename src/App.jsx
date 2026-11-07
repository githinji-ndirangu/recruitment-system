import {useState} from 'react'
import {LayoutDashboard,Briefcase,Building2,Users,GitMerge,Plane,FileText,Share2,Wallet,Receipt,BarChart3,ShieldCheck,Settings as SetI,Search,Bell,ChevronsLeft,ChevronsRight,Menu,RotateCcw} from 'lucide-react'
import {useDB} from './store'
import {useHash,go,cx,Avatar,inp} from './ui'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Employers from './pages/Employers'
import Candidates from './pages/Candidates'
import Applications from './pages/Applications'
import Deployments from './pages/Deployments'
import Documents from './pages/Documents'
import Brokers from './pages/Brokers'
import Finance from './pages/Finance'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
const NAV=[['Overview',[['dashboard','Dashboard',LayoutDashboard]]],['Recruitment',[['jobs','Job Opportunities',Briefcase],['employers','Foreign Employers',Building2],['candidates','Candidates',Users],['applications','Applications & Matching',GitMerge],['deployments','Deployments',Plane]]],['Operations',[['documents','Documents',FileText],['brokers','Brokers & Referrals',Share2],['finance','Finance & Payments',Wallet],['expenses','Expenses & Commissions',Receipt]]],['Management',[['reports','Reports & Analytics',BarChart3],['users','Users & Permissions',ShieldCheck],['settings','Settings',SetI]]]]
const PAGES={dashboard:Dashboard,jobs:Jobs,employers:Employers,candidates:Candidates,applications:Applications,deployments:Deployments,documents:Documents,brokers:Brokers,finance:Finance,expenses:Expenses,reports:Reports,settings:Settings,users:Settings}
export default function App(){
const h=useHash(),[page='dashboard',id]=h.replace(/^#\/?/,'').split('/'),Page=PAGES[page]||Dashboard
const {db,setDb,reset}=useDB(),[col,setCol]=useState(false),[mob,setMob]=useState(false),[q,setQ]=useState(''),[bell,setBell]=useState(false),[prof,setProf]=useState(false)
const res=q.length<2?[]:[...db.candidates.filter(c=>(c.name+c.phone+c.id+c.idNo).toLowerCase().includes(q.toLowerCase())).slice(0,4).map(c=>['candidates/'+c.id,c.name,'Candidate · '+c.occupation]),...db.jobs.filter(j=>j.title.toLowerCase().includes(q.toLowerCase())).slice(0,3).map(j=>['jobs/'+j.id,j.title,'Job · '+j.country]),...db.employers.filter(e=>e.name.toLowerCase().includes(q.toLowerCase())).slice(0,3).map(e=>['employers/'+e.id,e.name,'Employer · '+e.country])]
const unread=db.notifications.filter(n=>!n.read).length
const Side=<aside className={cx('flex h-full flex-col border-r border-slate-200 bg-white',col?'w-16':'w-64')}>
<div className="flex h-14 items-center gap-2 border-b border-slate-100 px-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white">S</span>{!col&&<div className="leading-tight"><div className="text-sm font-semibold">Safari Global</div><div className="text-[11px] text-slate-500">Recruitment Mgmt</div></div>}</div>
<nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-4">{NAV.map(([g,items])=><div key={g}>{!col&&<div className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">{g}</div>}{items.map(([k,l,I])=>{const on=page===k;return <a key={k} href={'#/'+k} title={l} onClick={()=>setMob(false)} className={cx('mb-0.5 flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm',on?'bg-teal-50 font-medium text-teal-800':'text-slate-600 hover:bg-slate-50',col&&'justify-center')}><I size={17}/>{!col&&l}</a>})}</div>)}</nav>
<button onClick={()=>setCol(!col)} className="hidden h-11 items-center justify-center gap-2 border-t border-slate-100 text-xs text-slate-500 hover:bg-slate-50 lg:flex">{col?<ChevronsRight size={16}/>:<><ChevronsLeft size={16}/>Collapse</>}</button></aside>
return <div className="flex h-screen">
<div className="hidden lg:block">{Side}</div>
{mob&&<div className="fixed inset-0 z-40 flex bg-slate-900/40 lg:hidden" onClick={()=>setMob(false)}><div onClick={e=>e.stopPropagation()}>{Side}</div></div>}
<div className="flex min-w-0 flex-1 flex-col">
<header className="relative z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
<button className="lg:hidden" onClick={()=>setMob(true)}><Menu size={20}/></button>
<div className="relative w-full max-w-md"><Search size={15} className="absolute left-3 top-2.5 text-slate-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search candidates, jobs, employers…" className={cx(inp,'pl-9 bg-slate-50')}/>
{res.length>0&&<div className="absolute left-0 right-0 top-11 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">{res.map(r=><button key={r[0]} onClick={()=>{go(r[0]);setQ('')}} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50"><div className="font-medium">{r[1]}</div><div className="text-xs text-slate-500">{r[2]}</div></button>)}</div>}</div>
<div className="ml-auto flex items-center gap-2">
<div className="relative"><button onClick={()=>{setBell(!bell);setProf(false)}} className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"><Bell size={18}/>{unread>0&&<span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">{unread}</span>}</button>
{bell&&<div className="absolute right-0 top-11 w-80 rounded-xl border border-slate-200 bg-white shadow-lg"><div className="flex justify-between border-b border-slate-100 px-4 py-2.5 text-sm font-semibold">Notifications<button className="text-xs font-normal text-teal-700" onClick={()=>setDb(d=>({...d,notifications:d.notifications.map(n=>({...n,read:true}))}))}>Mark all read</button></div><div className="max-h-80 overflow-y-auto">{db.notifications.map(n=><div key={n.id} className={cx('border-b border-slate-50 px-4 py-2.5 text-sm',!n.read&&'bg-teal-50/50')}>{n.text}</div>)}</div></div>}</div>
<div className="relative"><button onClick={()=>{setProf(!prof);setBell(false)}} className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100"><Avatar name="Amina Njoroge"/><div className="hidden text-left leading-tight sm:block"><div className="text-sm font-medium">Amina Njoroge</div><div className="text-[11px] text-slate-500">Administrator</div></div></button>
{prof&&<div className="absolute right-0 top-12 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"><button onClick={()=>{go('settings');setProf(false)}} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-50"><SetI size={15}/>Settings</button><button onClick={()=>{reset();setProf(false)}} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"><RotateCcw size={15}/>Reset demo data</button></div>}</div></div></header>
<main className="flex-1 overflow-y-auto p-4 lg:p-6" onClick={()=>{setBell(false);setProf(false)}}><div className="mx-auto max-w-[1400px]"><Page id={id} route={page}/></div></main></div></div>}
