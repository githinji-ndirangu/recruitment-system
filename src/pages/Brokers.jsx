import {useState} from 'react'
import {Plus,Pencil,Trash2} from 'lucide-react'
import {useDB} from '../store'
import {Btn,Card,PageHeader,Badge,Table,FormModal,Modal,Confirm,Stat,go} from '../ui'
import {byId,money} from '../lib'
import {ALLOC} from '../data'
export const brokerStats=(db,b)=>{const refs=db.candidates.filter(c=>c.brokerId===b.id),cm=db.commissions.filter(x=>x.brokerId===b.id),earned=cm.reduce((a,x)=>a+x.amount,0),paid=cm.reduce((a,x)=>a+x.paid,0)
return{refs,placed:db.applications.filter(a=>ALLOC.includes(a.stage)&&refs.some(c=>c.id===a.candId)).length,earned,paid,out:earned-paid}}
export default function Brokers(){const {db,save,remove}=useDB(),[m,setM]=useState(null),[sel,setSel]=useState(null),[del,setDel]=useState(null)
const f=[{k:'name',l:'Full name',req:1},{k:'phone',l:'Phone',req:1},{k:'email',l:'Email',t:'email'},{k:'county',l:'County'},{k:'commType',l:'Commission type',t:'select',opts:['Fixed','Percentage'],req:1},{k:'commValue',l:'Value (KES or %)',t:'number',req:1},{k:'status',l:'Status',t:'select',opts:['Active','Inactive'],req:1}]
const b=sel&&byId(db.brokers,sel),bs=b&&brokerStats(db,b)
return <><PageHeader title="Brokers & Referrals" sub="Agents who refer candidates and their commission arrangements"><Btn icon={Plus} onClick={()=>setM({commType:'Fixed',status:'Active'})}>Add broker</Btn></PageHeader>
<Card pad={false}><Table rows={db.brokers} onRow={r=>setSel(r.id)} cols={[{h:'Broker',r:r=><><div className="font-medium text-slate-900">{r.name}</div><div className="text-xs text-slate-500">{r.phone}</div></>},{h:'Referred',r:r=>brokerStats(db,r).refs.length},{h:'Placements',r:r=>brokerStats(db,r).placed},{h:'Arrangement',r:r=>r.commType==='Fixed'?money(r.commValue)+' per placement':r.commValue+'% of fees'},{h:'Earned',r:r=>money(brokerStats(db,r).earned)},{h:'Paid',r:r=>money(brokerStats(db,r).paid)},{h:'Outstanding',r:r=><b>{money(brokerStats(db,r).out)}</b>},{h:'Status',r:r=><Badge>{r.status}</Badge>},{h:'',r:r=><div className="flex" onClick={e=>e.stopPropagation()}><Btn v="ghost" icon={Pencil} onClick={()=>setM(r)}/><Btn v="ghost" icon={Trash2} onClick={()=>setDel(r)}/></div>}]}/></Card>
{b&&<Modal drawer title={b.name} onClose={()=>setSel(null)}><div className="mb-5 grid grid-cols-3 gap-3"><Stat label="Earned" value={money(bs.earned)}/><Stat label="Paid" value={money(bs.paid)}/><Stat label="Outstanding" value={money(bs.out)}/></div>
<h4 className="mb-2 text-sm font-semibold">Referred candidates ({bs.refs.length})</h4><ul className="mb-5 divide-y rounded-lg border">{bs.refs.map(c=><li key={c.id} className="flex cursor-pointer justify-between px-3 py-2 text-sm hover:bg-slate-50" onClick={()=>{setSel(null);go('candidates/'+c.id)}}>{c.name}<Badge>{c.availability}</Badge></li>)}</ul>
<h4 className="mb-2 text-sm font-semibold">Commissions</h4><ul className="divide-y rounded-lg border">{db.commissions.filter(x=>x.brokerId===b.id).map(x=><li key={x.id} className="flex justify-between px-3 py-2 text-sm"><span>{byId(db.candidates,x.candId)?.name}</span><span>{money(x.paid)} / {money(x.amount)} <Badge>{x.status}</Badge></span></li>)}</ul></Modal>}
{m&&<FormModal wide={false} title={m.id?'Edit broker':'Add broker'} fields={f} initial={m} onClose={()=>setM(null)} validate={v=>v.commType==='Percentage'&&+v.commValue>100?{commValue:'Max 100%'}:{}} onSave={v=>save('brokers',{...v,commValue:+v.commValue},'B',`Broker ${v.name} saved`)}/>}
{del&&<Confirm msg={`Delete ${del.name}?`} onClose={()=>setDel(null)} onYes={()=>remove('brokers',del.id,'Broker deleted')}/>}</>}
