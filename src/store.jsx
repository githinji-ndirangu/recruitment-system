import {createContext,useContext,useEffect,useRef,useState} from 'react'
import {seed,ALLOC} from './data'
import {jobStats} from './lib'
const KEY='irms.v1',Ctx=createContext()
export const useDB=()=>useContext(Ctx)
const load=()=>{try{const s=localStorage.getItem(KEY);if(s)return JSON.parse(s)}catch{}return seed()}
export function DBProvider({children}){
const [db,setDb]=useState(load),ref=useRef(db);ref.current=db
const [toasts,setToasts]=useState([])
useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}},[db])
const toast=(m,t='ok')=>{const id=Math.random();setToasts(x=>[...x,{id,m,t}]);setTimeout(()=>setToasts(x=>x.filter(y=>y.id!==id)),3200)}
const log=(text,candId)=>setDb(d=>({...d,activity:[{id:'L'+Math.random(),text,candId,at:new Date().toISOString()},...d.activity].slice(0,200)}))
const notify=text=>setDb(d=>({...d,notifications:[{id:'N'+Math.random(),text,read:false,at:new Date().toISOString()},...d.notifications]}))
const save=(coll,item,prefix,msg)=>{const list=ref.current[coll];let it=item
if(!it.id){const n=Math.max(0,...list.map(x=>+String(x.id).split('-')[1]||0))+1;it={...item,id:`${prefix}-${String(n).padStart(3,'0')}`}}
setDb(d=>({...d,[coll]:d[coll].some(x=>x.id===it.id)?d[coll].map(x=>x.id===it.id?it:x):[it,...d[coll]]}))
if(msg){toast(msg);log(msg,it.candId||(coll==='candidates'?it.id:undefined))}return it}
const remove=(coll,id,msg)=>{setDb(d=>({...d,[coll]:d[coll].filter(x=>x.id!==id)}));if(msg){toast(msg);log(msg)}}
const setSettings=p=>setDb(d=>({...d,settings:{...d.settings,...p}}))
const moveApp=(appId,stage)=>{const d=ref.current,a=d.applications.find(x=>x.id===appId),job=d.jobs.find(x=>x.id===a.jobId)
if(ALLOC.includes(stage)&&!ALLOC.includes(a.stage)){
if(jobStats(d,job).remaining<=0){toast('No remaining vacancies for this opening','err');return false}
if(d.applications.some(x=>x.candId===a.candId&&x.id!==a.id&&ALLOC.includes(x.stage))){toast('Candidate is already allocated to another opening','err');return false}}
save('applications',{...a,stage})
if(['Processing','Ready for Deployment','Deployed'].includes(stage)&&!d.deployments.some(x=>x.appId===a.id))save('deployments',{appId:a.id,candId:a.candId,jobId:a.jobId,visa:'Not Started',contract:'Pending',flight:'Not Booked',travelDate:'',status:'Preparing'},'D')
if(stage==='Deployed')setDb(s=>({...s,deployments:s.deployments.map(x=>x.appId===a.id?{...x,status:'Deployed'}:x),candidates:s.candidates.map(c=>c.id===a.candId?{...c,availability:'Placed'}:c)}))
const c=d.candidates.find(x=>x.id===a.candId);log(`${c?.name} moved to "${stage}" for ${job.title}`,a.candId);toast(`Moved to ${stage}`);return true}
const reset=()=>{localStorage.removeItem(KEY);setDb(seed());toast('Demo data reset')}
return <Ctx.Provider value={{db,save,remove,moveApp,setSettings,toast,log,notify,reset,setDb}}>{children}
<div className="fixed bottom-4 right-4 z-[100] space-y-2">{toasts.map(t=><div key={t.id} className={`rounded-lg px-4 py-2.5 text-sm text-white shadow-lg ${t.t==='err'?'bg-red-600':'bg-slate-900'}`}>{t.m}</div>)}</div></Ctx.Provider>}
