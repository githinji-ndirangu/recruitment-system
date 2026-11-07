export const COUNTRIES=['Oman','Qatar','UAE','Saudi Arabia','Kuwait','Bahrain']
export const CUR={Oman:'OMR',Qatar:'QAR',UAE:'AED','Saudi Arabia':'SAR',Kuwait:'KWD',Bahrain:'BHD'}
export const CATS=['Nursing','Security','Cleaning','Driving','Construction','Hospitality']
export const DOC_TYPES=['National ID','Passport','Medical Certificate','Police Clearance','Academic Certificates','Professional Certificates','Attestation','Work Experience Letter']
export const DOC_STATUS=['Missing','Uploaded','Under Review','Verified','Rejected','Expired']
export const STAGES=['Matched','Applied','Shortlisted','Interview','Employer Approved','Processing','Ready for Deployment','Deployed','Rejected/Withdrawn']
export const ALLOC=['Employer Approved','Processing','Ready for Deployment','Deployed']
export const FEE_CATS=['Registration Fee','Medical Fee','Processing Fee','Visa Fee','Training Fee']
export const EXP_CATS=['Medical','Attestation','Transport','Document Processing','Accommodation','Other']
export const MODULES=['Dashboard','Job Opportunities','Foreign Employers','Candidates','Applications & Matching','Deployments','Documents','Brokers & Referrals','Finance & Payments','Expenses & Commissions','Reports & Analytics','Users & Permissions','Settings']
const OCC={Nursing:'Registered Nurse',Security:'Security Guard',Cleaning:'Cleaner',Driving:'Driver',Construction:'Mason',Hospitality:'Waiter'}
const QUAL={Nursing:'Diploma in Nursing (KRCHN)',Security:'KCSE + Security Training Cert.',Cleaning:'KCSE + Housekeeping Cert.',Driving:'Class BCE Licence + NTSA Cert.',Construction:'Trade Test Grade II',Hospitality:'Certificate in Food & Beverage'}
const SKILLS={Nursing:'Patient care, IV therapy, Triage',Security:'Patrol, CCTV, Access control',Cleaning:'Deep cleaning, Laundry, Equipment use',Driving:'Defensive driving, Route planning',Construction:'Masonry, Plastering, Site safety',Hospitality:'Customer service, POS, Food safety'}
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const pad=(n)=>String(n).padStart(3,'0')
export function seed(){
const r=rng(7),pick=a=>a[Math.floor(r()*a.length)],int=(a,b)=>a+Math.floor(r()*(b-a+1))
const date=b=>new Date(Date.now()-b*864e5).toISOString().slice(0,10)
const emp=[['Al Noor Healthcare','Oman','Muscat'],['Gulf Star Security','Qatar','Doha'],['Emirates Facility Services','UAE','Dubai'],['Riyadh Build Co','Saudi Arabia','Riyadh'],['Pearl Hospitality Group','Qatar','Doha'],['Desert Logistics LLC','UAE','Abu Dhabi'],['Muscat Clean Co','Oman','Muscat']]
const contacts=['Khalid Al-Harthy','Fatima Al-Thani','Omar Haddad','Saleh Al-Qahtani','Layla Mansour','Rashid Al-Maktoum','Aisha Al-Balushi']
const employers=emp.map((e,i)=>({id:'E-'+pad(i+1),name:e[0],country:e[1],city:e[2],contact:contacts[i],email:`hr@${e[0].toLowerCase().replace(/[^a-z]/g,'')}.com`,phone:`+${['968','974','971','966','974','971','968'][i]} ${int(1000,9999)} ${int(1000,9999)}`,agreementStatus:i===6?'Pending':'Active',agreementDate:date(int(60,400)),notes:'Standard recruitment agreement; employer covers flight tickets and visa.'}))
const J=[['Registered Nurse – ICU','Nursing',0,4,380,'Open'],['Staff Nurse – General Ward','Nursing',0,8,320,'Open'],['Security Guard','Security',1,8,1800,'Open'],['Control Room Operator','Security',1,2,2400,'In Progress'],['Office Cleaner','Cleaning',2,4,1100,'Open'],['Housekeeping Attendant','Cleaning',6,3,160,'In Progress'],['Light Vehicle Driver','Driving',5,4,1500,'Open'],['Heavy Truck Driver','Driving',5,3,2000,'Open'],['Mason','Construction',3,12,1300,'Open'],['Steel Fixer','Construction',3,3,1250,'In Progress'],['Waiter / Waitress','Hospitality',4,3,2000,'Open'],['Hotel Receptionist','Hospitality',4,2,2600,'Filled']]
const jobs=J.map((j,i)=>{const e=employers[j[2]];return{id:'J-'+pad(i+1),title:j[0],category:j[1],employerId:e.id,country:e.country,city:e.city,vacancies:j[3],salary:j[4],currency:CUR[e.country],contract:'2 years, renewable',benefits:'Free accommodation, transport, medical insurance, annual return ticket',requirements:`Min. 2 years experience as ${j[0]}. Good conduct. Basic English.`,docs:['National ID','Passport','Medical Certificate','Police Clearance','Academic Certificates'],deadline:date(-int(10,60)),status:j[5]}})
const fn=['Wanjiku','Otieno','Achieng','Kamau','Mwangi','Njeri','Kiprop','Chebet','Mutiso','Akinyi','Barasa','Naliaka','Omondi','Wairimu','Kariuki','Atieno','Hassan','Fatuma','Juma','Mwende','Cheruiyot','Nyambura','Ouma','Jepkosgei']
const ln=['Kamau','Otieno','Mwangi','Odhiambo','Njoroge','Wekesa','Koech','Mutua','Kimani','Ochieng','Abdi','Wafula','Rotich','Karanja']
const female=['Wanjiku','Achieng','Njeri','Chebet','Akinyi','Naliaka','Wairimu','Atieno','Fatuma','Mwende','Nyambura','Jepkosgei']
const counties=['Nairobi','Mombasa','Kisumu','Nakuru','Kiambu','Machakos','Uasin Gishu','Kakamega','Kisii','Nyeri']
const brokers=[['Peter Mutua','Fixed',5000],['Grace Wambui','Percentage',10],['Hassan Abdalla','Fixed',4000],['Mercy Jepkoech','Percentage',8],['Samuel Odera','Fixed',6000]].map((b,i)=>({id:'B-'+pad(i+1),name:b[0],phone:`+254 7${int(10,99)} ${int(100,999)} ${int(100,999)}`,email:b[0].toLowerCase().replace(' ','.')+'@gmail.com',county:pick(counties),commType:b[1],commValue:b[2],status:'Active'}))
const catList=[...Array(6).fill('Nursing'),...Array(6).fill('Security'),...Array(5).fill('Cleaning'),...Array(5).fill('Driving'),...Array(6).fill('Construction'),...Array(4).fill('Hospitality')]
const candidates=catList.map((cat,i)=>{const f=pick(fn),l=pick(ln),lvl=r()*.9+.1
const docs={};DOC_TYPES.forEach(t=>{const st=r()<lvl?'Verified':pick(['Under Review','Uploaded','Missing','Missing','Rejected','Expired']);docs[t]={status:st,file:st==='Missing'?'':t.replace(/ /g,'_')+'.pdf',date:date(int(1,60))}})
return{id:'C-'+pad(i+1),name:`${f} ${l}`,gender:female.includes(f)?'Female':'Male',dob:`${int(1985,2002)}-0${int(1,9)}-1${int(0,9)}`,phone:`+254 7${int(10,99)} ${int(100,999)} ${int(100,999)}`,email:`${f}.${l}${int(1,99)}@gmail.com`.toLowerCase(),idNo:String(int(20000000,39999999)),county:pick(counties),category:cat,occupation:OCC[cat],skills:SKILLS[cat],qualification:QUAL[cat],experience:int(0,9),prefCountries:[...new Set([pick(COUNTRIES),pick(COUNTRIES.slice(0,4))])],prefCats:[cat],availability:pick(['Available','Available','Available','Available in 30 days']),brokerId:r()<.75?pick(brokers).id:'',feeAgreed:pick([35000,45000,50000,60000]),photo:'',docs,created:date(int(1,120))}})
const applications=[],allocated=new Set();let an=1
jobs.forEach(j=>{const el=candidates.filter(c=>c.category===j.category).sort(()=>r()-.5).slice(0,int(2,6));let cnt=0
el.forEach(c=>{let st=pick(['Matched','Applied','Applied','Shortlisted','Interview','Employer Approved','Processing','Ready for Deployment','Deployed','Rejected/Withdrawn'])
if(ALLOC.includes(st)&&(cnt>=j.vacancies||allocated.has(c.id)))st='Shortlisted';if(ALLOC.includes(st)){cnt++;allocated.add(c.id)}
applications.push({id:'A-'+pad(an++),candId:c.id,jobId:j.id,stage:st,date:date(int(1,150))})})})
candidates.forEach(c=>{if(applications.some(a=>a.candId===c.id&&a.stage==='Deployed'))c.availability='Placed'})
const payments=[];let pn=1
candidates.forEach(c=>{const ap=applications.find(a=>a.candId===c.id&&!['Matched','Rejected/Withdrawn'].includes(a.stage));if(!ap)return;let paid=0
for(let k=0;k<int(1,3);k++){const amt=pick([3000,5000,8000,10000,15000]);if(paid+amt>c.feeAgreed)break;paid+=amt;const m=pick(['M-Pesa','M-Pesa','Bank Transfer','Cash'])
payments.push({id:'P-'+pad(pn++),candId:c.id,jobId:ap.jobId,type:FEE_CATS[k],amount:amt,method:m,ref:m==='M-Pesa'?'SH'+int(1e5,9e5)+'X':m==='Cash'?'RCPT-'+int(1000,9999):'TRF'+int(1e6,9e6),date:date(int(1,90))})}})
const expenses=[];const withApp=applications.filter(a=>!['Matched','Rejected/Withdrawn'].includes(a.stage))
for(let k=0;k<16;k++){const a=withApp[k%withApp.length];const cat=pick(EXP_CATS);expenses.push({id:'X-'+pad(k+1),category:cat,desc:`${cat} – ${candidates.find(c=>c.id===a.candId).name}`,amount:pick([1500,2500,4000,6000,9000,12000]),date:date(int(1,90)),candId:a.candId,jobId:a.jobId})}
const commissions=[];let cn=1
applications.filter(a=>ALLOC.includes(a.stage)).forEach(a=>{const c=candidates.find(x=>x.id===a.candId),b=brokers.find(x=>x.id===c.brokerId);if(!b)return
const amount=b.commType==='Fixed'?b.commValue:Math.round(c.feeAgreed*b.commValue/100),st=pick(['Pending','Approved','Partially Paid','Paid'])
commissions.push({id:'M-'+pad(cn++),brokerId:b.id,candId:c.id,jobId:a.jobId,amount,paid:st==='Paid'?amount:st==='Partially Paid'?Math.round(amount/2):0,status:st,date:date(int(1,60))})})
const deployments=[];let dn=1
applications.filter(a=>['Processing','Ready for Deployment','Deployed'].includes(a.stage)).forEach(a=>{const dep=a.stage==='Deployed'
deployments.push({id:'D-'+pad(dn++),appId:a.id,candId:a.candId,jobId:a.jobId,visa:dep?'Issued':pick(['Not Started','Applied','Issued']),contract:dep?'Signed':pick(['Pending','Signed']),flight:dep?'Booked':pick(['Not Booked','Booked']),travelDate:date(dep?int(1,40):-int(5,40)),status:dep?'Deployed':a.stage==='Ready for Deployment'?'Ready to Fly':'Preparing'})})
const now=new Date().toISOString()
return{employers,jobs,candidates,brokers,applications,payments,expenses,commissions,deployments,
notifications:[{id:'N1',text:'Passport for '+candidates[0].name+' expires in 45 days',read:false,at:now},{id:'N2',text:'Gulf Star Security submitted a new job order',read:false,at:now},{id:'N3',text:'3 medical certificates awaiting review',read:false,at:now},{id:'N4',text:'Commission payment pending approval',read:true,at:now}],
activity:[{id:'L1',text:'Job opening "Mason" created for Riyadh Build Co',at:now},{id:'L2',text:'Payment of KES 8,000 recorded (M-Pesa)',candId:candidates[2].id,at:now},{id:'L3',text:'Candidate '+candidates[5].name+' registered',candId:candidates[5].id,at:now},{id:'L4',text:'Medical certificate verified',candId:candidates[1].id,at:now}],
settings:{users:[['Amina Njoroge','admin@safariglobal.co.ke','Admin'],['Brian Kiptoo','brian@safariglobal.co.ke','Operations Officer'],['Lucy Wangari','lucy@safariglobal.co.ke','Finance Officer'],['Dennis Oduor','dennis@safariglobal.co.ke','Recruiter']].map((u,i)=>({id:'U-'+pad(i+1),name:u[0],email:u[1],role:u[2],status:'Active'})),
roles:{Admin:[...MODULES],'Operations Officer':MODULES.slice(0,9),'Finance Officer':['Dashboard','Finance & Payments','Expenses & Commissions','Reports & Analytics','Brokers & Referrals'],Recruiter:['Dashboard','Job Opportunities','Candidates','Applications & Matching','Documents']},
countries:[...COUNTRIES],categories:[...CATS],docTypes:[...DOC_TYPES],feeCats:[...FEE_CATS],
rules:[{id:'R-001',name:'Standard fixed',type:'Fixed',value:5000},{id:'R-002',name:'Standard percentage',type:'Percentage',value:10},{id:'R-003',name:'Nursing premium',type:'Fixed',value:8000}]}}}
