import {useState} from 'react'
import {ResponsiveContainer,BarChart,Bar,XAxis,YAxis,Tooltip,CartesianGrid,Legend} from 'recharts'
import {useDB} from '../store'
import {Card,PageHeader,Sel,Table,cx} from '../ui'
import {jobStats,readiness,paidBy,byId} from '../lib'
import {STAGES} from '../data'
const grp=(list,key,f)=>Object.values(list.reduce((a,x)=>{const k=key(x);a[k]=a[k]||{name:k};f(a[k],x);return a},{}))
const R={
'Vacancies by country':(db,jobs)=>({keys:['Total','Remaining'],data:grp(jobs,j=>j.country,(o,j)=>{o.Total=(o.Total||0)+j.vacancies;o.Remaining=(o.Remaining||0)+jobStats(db,j).remaining})}),
'Vacancies by job category':(db,jobs)=>({keys:['Total','Remaining'],data:grp(jobs,j=>j.category,(o,j)=>{o.Total=(o.Total||0)+j.vacancies;o.Remaining=(o.Remaining||0)+jobStats(db,j).remaining})}),
'Candidate distribution':db=>({keys:['Candidates','Available'],data:grp(db.candidates,c=>c.category,(o,c)=>{o.Candidates=(o.Candidates||0)+1;o.Available=(o.Available||0)+(c.availability==='Available'?1:0)})}),
'Surplus & shortages':(db,jobs)=>({keys:['Vacancies Remaining','Qualified Available'],extra:['Supply'],data:jobs.map(j=>{const s=jobStats(db,j);return{name:j.title,'Vacancies Remaining':s.remaining,'Qualified Available':s.qualified,Supply:s.diff>0?`Surplus +${s.diff}`:s.diff<0?`Shortage ${s.diff}`:'Balanced'}})}),
'Document readiness':db=>({keys:['Verified','In progress','Missing / issues'],data:db.settings.docTypes.map(t=>{const st=db.candidates.map(c=>c.docs?.[t]?.status||'Missing');return{name:t,Verified:st.filter(x=>x==='Verified').length,'In progress':st.filter(x=>['Uploaded','Under Review'].includes(x)).length,'Missing / issues':st.filter(x=>['Missing','Rejected','Expired'].includes(x)).length}})}),
'Recruitment pipeline':(db,jobs)=>({keys:['Applications'],data:STAGES.map(s=>({name:s,Applications:db.applications.filter(a=>a.stage===s&&jobs.some(j=>j.id===a.jobId)).length}))}),
'Successful deployments':(db,jobs)=>({keys:['Deployed'],data:grp(jobs,j=>j.country,(o,j)=>{o.Deployed=(o.Deployed||0)+db.applications.filter(a=>a.jobId===j.id&&a.stage==='Deployed').length})}),
'Collections & outstanding':db=>({keys:['Paid','Outstanding'],data:db.candidates.map(c=>({name:c.name,Paid:paidBy(db,c.id),Outstanding:Math.max(0,c.feeAgreed-paidBy(db,c.id))})).sort((a,b)=>b.Outstanding-a.Outstanding).slice(0,10)}),
'Recruitment expenses':db=>({keys:['Amount'],data:grp(db.expenses,x=>x.category,(o,x)=>{o.Amount=(o.Amount||0)+x.amount})}),
'Broker commissions':db=>({keys:['Earned','Paid','Outstanding'],data:db.brokers.map(b=>{const c=db.commissions.filter(x=>x.brokerId===b.id),e=c.reduce((a,x)=>a+x.amount,0),p=c.reduce((a,x)=>a+x.paid,0);return{name:b.name,Earned:e,Paid:p,Outstanding:e-p}})}),
'Recruitment profitability':(db,jobs)=>({keys:['Revenue','Expenses','Commissions','Profit'],data:jobs.map(j=>{const r=db.payments.filter(x=>x.jobId===j.id).reduce((a,x)=>a+x.amount,0),e=db.expenses.filter(x=>x.jobId===j.id).reduce((a,x)=>a+x.amount,0),c=db.commissions.filter(x=>x.jobId===j.id).reduce((a,x)=>a+x.paid,0);return{name:j.title,Revenue:r,Expenses:e,Commissions:c,Profit:r-e-c}})})}
const COL=['#0f766e','#0ea5e9','#f59e0b','#8b5cf6']
export default function Reports(){const {db}=useDB(),[rep,setRep]=useState('Vacancies by country'),[co,setCo]=useState(''),[ca,setCa]=useState('')
const jobs=db.jobs.filter(j=>(!co||j.country===co)&&(!ca||j.category===ca)),{keys,data,extra=[]}=R[rep](db,jobs)
return <><PageHeader title="Reports & Analytics" sub="Operational and financial insight"><Sel className="!w-40" all="All countries" value={co} onChange={setCo} options={db.settings.countries}/><Sel className="!w-40" all="All categories" value={ca} onChange={setCa} options={db.settings.categories}/></PageHeader>
<div className="grid gap-4 lg:grid-cols-[230px_1fr]"><Card pad={false} className="h-fit"><ul className="p-1.5">{Object.keys(R).map(k=><li key={k}><button onClick={()=>setRep(k)} className={cx('w-full rounded-lg px-3 py-2 text-left text-sm',rep===k?'bg-teal-50 font-medium text-teal-800':'text-slate-600 hover:bg-slate-50')}>{k}</button></li>)}</ul></Card>
<div className="space-y-4 min-w-0"><Card title={rep}><div className="h-72"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={data.length>6?-20:0} height={data.length>6?70:30} textAnchor={data.length>6?'end':'middle'}/><YAxis fontSize={12} tickLine={false} axisLine={false}/><Tooltip/><Legend/>{keys.map((k,i)=><Bar key={k} dataKey={k} fill={COL[i%4]} radius={[3,3,0,0]}/>)}</BarChart></ResponsiveContainer></div></Card>
<Card pad={false}><Table rows={data.map((d,i)=>({id:i,...d}))} empty="No data for the selected filters" cols={[{h:'Name',r:d=>d.name},...keys.map(k=>({h:k,r:d=>typeof d[k]==='number'?d[k].toLocaleString():d[k]})),...extra.map(k=>({h:k,r:d=>d[k]}))]}/></Card></div></div></>}
