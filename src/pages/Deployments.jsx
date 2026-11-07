import {useState} from 'react'
import {Pencil,Trash2} from 'lucide-react'
import {useDB} from '../store'
import {Btn,Card,PageHeader,Badge,Table,Sel,FormModal,Stat,go} from '../ui'
import {byId,fmtDate} from '../lib'
export default function Deployments(){const {db,save,remove,setDb}=useDB(),[st,setSt]=useState(''),[m,setM]=useState(null)
const rows=db.deployments.filter(d=>!st||d.status===st)
const f=[{k:'visa',l:'Visa status',t:'select',opts:['Not Started','Applied','Issued','Rejected'],req:1},{k:'contract',l:'Contract status',t:'select',opts:['Pending','Signed'],req:1},{k:'flight',l:'Flight arrangement',t:'select',opts:['Not Booked','Booked'],req:1},{k:'travelDate',l:'Travel date',t:'date'},{k:'status',l:'Deployment status',t:'select',opts:['Preparing','Ready to Fly','Deployed'],req:1}]
return <><PageHeader title="Deployments" sub="Visa, contract and travel tracking through to final deployment"/>
<div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat label="Total records" value={db.deployments.length}/>{['Preparing','Ready to Fly','Deployed'].map(s=><Stat key={s} label={s} value={db.deployments.filter(d=>d.status===s).length}/>)}</div>
<Card pad={false}><div className="border-b border-slate-100 p-3"><Sel className="!w-44" all="All statuses" value={st} onChange={setSt} options={['Preparing','Ready to Fly','Deployed']}/></div>
<Table rows={rows} cols={[{h:'Candidate',r:d=><button className="font-medium hover:text-teal-700" onClick={()=>go('candidates/'+d.candId)}>{byId(db.candidates,d.candId)?.name}</button>},{h:'Position',r:d=>byId(db.jobs,d.jobId)?.title},{h:'Destination',r:d=>{const j=byId(db.jobs,d.jobId);return `${j?.city}, ${j?.country}`}},{h:'Visa',r:d=><Badge>{d.visa}</Badge>},{h:'Contract',r:d=><Badge>{d.contract}</Badge>},{h:'Flight',r:d=><Badge>{d.flight}</Badge>},{h:'Travel date',r:d=>fmtDate(d.travelDate)},{h:'Status',r:d=><Badge>{d.status}</Badge>},{h:'',r:d=><div className="flex"><Btn v="ghost" icon={Pencil} onClick={()=>setM(d)}/><Btn v="ghost" icon={Trash2} onClick={()=>remove('deployments',d.id,'Deployment record removed')}/></div>}]}/></Card>
{m&&<FormModal wide={false} title="Update deployment" fields={f} initial={m} onClose={()=>setM(null)} onSave={v=>{save('deployments',v,'D','Deployment updated');if(v.status==='Deployed'){setDb(s=>({...s,applications:s.applications.map(a=>a.id===v.appId?{...a,stage:'Deployed'}:a),candidates:s.candidates.map(c=>c.id===v.candId?{...c,availability:'Placed'}:c)}))}}}/>}</>}
