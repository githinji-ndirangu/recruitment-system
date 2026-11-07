import {Users,Briefcase,Layers,Loader,PlaneTakeoff,Wallet} from 'lucide-react'
import {ResponsiveContainer,AreaChart,Area,XAxis,YAxis,Tooltip,CartesianGrid,BarChart,Bar,PieChart,Pie,Cell,Legend} from 'recharts'
import {useDB} from '../store'
import {Stat,Card,PageHeader,Badge,Avatar,go} from '../ui'
import {jobStats,money,byId,fmtDate} from '../lib'
import {STAGES} from '../data'
const COL=['#0f766e','#0ea5e9','#f59e0b','#8b5cf6','#ef4444','#64748b']
export default function Dashboard(){
const {db}=useDB(),active=db.jobs.filter(j=>['Open','In Progress'].includes(j.status))
const avail=active.reduce((a,j)=>a+jobStats(db,j).remaining,0)
const proc=db.applications.filter(a=>['Employer Approved','Processing','Ready for Deployment'].includes(a.stage)).length
const dep=db.applications.filter(a=>a.stage==='Deployed').length
const months=[...Array(6)].map((_,i)=>{const d=new Date();d.setMonth(d.getMonth()-5+i);return{k:d.toISOString().slice(0,7),name:d.toLocaleString('en',{month:'short'})}})
const act=months.map(m=>({name:m.name,Applications:db.applications.filter(a=>a.date.startsWith(m.k)).length,Registrations:db.candidates.filter(c=>c.created.startsWith(m.k)).length}))
const byC=Object.entries(db.candidates.reduce((a,c)=>{const k=c.prefCountries[0];a[k]=(a[k]||0)+1;return a},{})).map(([name,Candidates])=>({name,Candidates}))
const byCat=Object.entries(db.jobs.reduce((a,j)=>{a[j.category]=(a[j.category]||0)+j.vacancies;return a},{})).map(([name,value])=>({name,value}))
const pipe=STAGES.map(s=>({name:s.replace('Ready for Deployment','Ready').replace('Employer Approved','Approved').replace('Rejected/Withdrawn','Rejected'),Count:db.applications.filter(a=>a.stage===s).length}))
return <>
<PageHeader title="Dashboard" sub="Overview of your international recruitment business"/>
<div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
<Stat label="Total candidates" value={db.candidates.length} icon={Users} sub={`${db.candidates.filter(c=>c.availability==='Available').length} available`}/>
<Stat label="Active job openings" value={active.length} icon={Briefcase} sub={`${db.jobs.length} total orders`}/>
<Stat label="Available vacancies" value={avail} icon={Layers} sub="Unallocated positions"/>
<Stat label="In processing" value={proc} icon={Loader} sub="Approved → ready"/>
<Stat label="Deployments" value={dep} icon={PlaneTakeoff} sub="Successfully placed"/>
<Stat label="Total collections" value={money(db.payments.reduce((a,p)=>a+p.amount,0))} icon={Wallet} sub={`${db.payments.length} payments`}/></div>
<div className="mt-4 grid gap-4 lg:grid-cols-3">
<Card title="Recruitment activity" className="lg:col-span-2"><div className="h-64"><ResponsiveContainer><AreaChart data={act}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false}/><YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/><Tooltip/><Legend/><Area type="monotone" dataKey="Applications" stroke="#0f766e" fill="#0f766e22"/><Area type="monotone" dataKey="Registrations" stroke="#0ea5e9" fill="#0ea5e922"/></AreaChart></ResponsiveContainer></div></Card>
<Card title="Vacancies by category"><div className="h-64"><ResponsiveContainer><PieChart><Pie data={byCat} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>{byCat.map((_,i)=><Cell key={i} fill={COL[i%6]}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div></Card>
<Card title="Candidates by preferred country"><div className="h-56"><ResponsiveContainer><BarChart data={byC}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false}/><YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/><Tooltip/><Bar dataKey="Candidates" fill="#0f766e" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></Card>
<Card title="Recruitment pipeline" className="lg:col-span-2"><div className="h-56"><ResponsiveContainer><BarChart data={pipe}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} interval={0}/><YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/><Tooltip/><Bar dataKey="Count" fill="#0ea5e9" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></Card></div>
<div className="mt-4 grid gap-4 lg:grid-cols-3">
<Card title="Recent job openings" action={<button className="text-xs text-teal-700" onClick={()=>go('jobs')}>View all</button>}><ul className="space-y-3">{[...db.jobs].reverse().slice(0,5).map(j=>{const s=jobStats(db,j);return <li key={j.id} className="flex cursor-pointer items-center justify-between text-sm" onClick={()=>go('jobs/'+j.id)}><div><div className="font-medium">{j.title}</div><div className="text-xs text-slate-500">{j.country} · {s.remaining}/{j.vacancies} open</div></div><Badge>{j.status}</Badge></li>})}</ul></Card>
<Card title="Recent candidates" action={<button className="text-xs text-teal-700" onClick={()=>go('candidates')}>View all</button>}><ul className="space-y-3">{[...db.candidates].sort((a,b)=>b.created.localeCompare(a.created)).slice(0,5).map(c=><li key={c.id} className="flex cursor-pointer items-center gap-3 text-sm" onClick={()=>go('candidates/'+c.id)}><Avatar name={c.name} photo={c.photo}/><div className="flex-1"><div className="font-medium">{c.name}</div><div className="text-xs text-slate-500">{c.occupation}</div></div><span className="text-xs text-slate-400">{fmtDate(c.created)}</span></li>)}</ul></Card>
<Card title="Recent activity"><ul className="space-y-3">{db.activity.slice(0,6).map(a=><li key={a.id} className="flex gap-2 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600"/><div><div>{a.text}</div><div className="text-xs text-slate-400">{fmtDate(a.at)}</div></div></li>)}</ul></Card></div></>}
