import {useState} from 'react'
import {useDB} from '../store'
import {Btn,Card,PageHeader,Badge,Sel,SearchBox,Modal,FileBtn,go,Stat,Avatar,Progress,Lbl} from '../ui'
import {readiness} from '../lib'
import {DOC_STATUS} from '../data'
export function DocModal({cand,type,onClose}){const {save}=useDB(),cur=cand.docs?.[type]||{status:'Missing',file:''},[st,setSt]=useState(cur.status),[file,setFile]=useState(cur.file)
return <Modal title={`${type} · ${cand.name}`} onClose={onClose} footer={<><Btn v="outline" onClick={onClose}>Cancel</Btn><Btn onClick={()=>{save('candidates',{...cand,docs:{...cand.docs,[type]:{status:st,file,date:new Date().toISOString().slice(0,10)}}},'C',`${type} set to ${st}`);onClose()}}>Save</Btn></>}>
<div className="space-y-4"><div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 p-4"><FileBtn onFile={n=>{setFile(n);if(st==='Missing')setSt('Uploaded')}}>Choose file</FileBtn><span className="text-sm text-slate-500">{file||'No file uploaded (simulated)'}</span></div>
<Lbl l="Status"><Sel value={st} onChange={setSt} options={DOC_STATUS}/></Lbl></div></Modal>}
export default function Documents(){const {db}=useDB(),types=db.settings.docTypes,[q,setQ]=useState(''),[st,setSt]=useState(''),[m,setM]=useState(null)
const rows=db.candidates.filter(c=>(!q||c.name.toLowerCase().includes(q.toLowerCase()))&&(!st||types.some(t=>(c.docs?.[t]?.status||'Missing')===st)))
const cnt=s=>db.candidates.reduce((a,c)=>a+types.filter(t=>(c.docs?.[t]?.status||'Missing')===s).length,0)
return <><PageHeader title="Documents" sub="Document status matrix across all candidates"/>
<div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-6">{DOC_STATUS.map(s=><Stat key={s} label={s} value={cnt(s)}/>)}</div>
<Card pad={false}><div className="flex flex-wrap gap-2 border-b border-slate-100 p-3"><SearchBox value={q} onChange={setQ} placeholder="Search candidate"/><Sel className="!w-44" all="Any status" value={st} onChange={setSt} options={DOC_STATUS}/><span className="self-center text-xs text-slate-400">Click a status to upload or update a document</span></div>
<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b bg-slate-50/70 text-xs uppercase text-slate-500"><th className="sticky left-0 bg-slate-50 px-4 py-2.5 text-left font-medium">Candidate</th><th className="px-3">Ready</th>{types.map(t=><th key={t} className="min-w-[110px] px-3 py-2.5 text-left font-medium">{t}</th>)}</tr></thead>
<tbody className="divide-y divide-slate-100">{rows.map(c=><tr key={c.id}><td className="sticky left-0 bg-white px-4 py-2.5"><button className="flex items-center gap-2 whitespace-nowrap font-medium hover:text-teal-700" onClick={()=>go('candidates/'+c.id)}><Avatar name={c.name} photo={c.photo} size={26}/>{c.name}</button></td><td className="px-3"><div className="w-16"><Progress value={readiness(c,types)}/></div></td>
{types.map(t=><td key={t} className="px-3 py-2.5"><button onClick={()=>setM({c,t})}><Badge>{c.docs?.[t]?.status||'Missing'}</Badge></button></td>)}</tr>)}</tbody></table></div></Card>
{m&&<DocModal cand={m.c} type={m.t} onClose={()=>setM(null)}/>}</>}
