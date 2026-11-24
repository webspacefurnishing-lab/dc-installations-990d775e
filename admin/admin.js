(function(){
'use strict';
var SECTORS=[
 {key:'commercial',name:'Commercial',color:'#ff9900',icon:'building'},
 {key:'industrial',name:'Industrial',color:'#161616',icon:'factory'},
 {key:'ev',name:'EV Chargers',color:'#c67600',icon:'ev'},
 {key:'residential',name:'Residential',color:'#7a7a7a',icon:'home'},
 {key:'data',name:'Data & Networks',color:'#f07018',icon:'net'}
];
var MONTHS=['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10','2026-11'];
// revenue per month per sector [commercial, industrial, ev, residential, data]; Nov 2026 is month to date
var REV=[[14200,9800,5400,7600,4100],[11800,8900,4800,6200,3600],[12600,9400,5200,6900,3900],[15400,11200,6800,8100,4700],[16100,10800,7400,8600,5200],[17300,12400,8100,9200,5600],[18200,13100,8900,8800,6100],[16900,12700,9600,8400,5800],[15200,11800,9200,7900,5300],[18800,13600,10400,9100,6400],[19600,14200,11300,9700,6900],[17400,12900,10800,8900,6200]];
var JOBS=[[6,3,5,11,3],[5,3,4,9,3],[5,3,5,10,3],[6,4,6,11,4],[7,4,7,12,4],[7,4,7,13,4],[8,5,8,12,5],[7,4,9,12,4],[6,4,8,11,4],[8,5,9,13,5],[8,5,10,13,5],[7,4,9,12,5]];
var monthly=MONTHS.map(function(m,i){var o={month:m,total:0,jobs:0,sectors:{},sectorJobs:{}};SECTORS.forEach(function(s,j){o.sectors[s.key]=REV[i][j];o.sectorJobs[s.key]=JOBS[i][j];o.total+=REV[i][j];o.jobs+=JOBS[i][j];});return o;});

// Service catalogue: services listed on the website, grouped by sector, with rate card starting prices
var services=[
 {group:'commercial',name:'Electrical installations',price:1850,unit:'from',duration:'2-5 days',ytd:61200,jobs:22},
 {group:'commercial',name:'Lighting design',price:950,unit:'from',duration:'1-3 days',ytd:38400,jobs:24},
 {group:'commercial',name:'Power distribution',price:2400,unit:'from',duration:'2-4 days',ytd:42100,jobs:13},
 {group:'commercial',name:'System upgrades',price:780,unit:'from',duration:'1-2 days',ytd:24600,jobs:19},
 {group:'commercial',name:'Ongoing maintenance',price:420,unit:'per visit',duration:'Half day',ytd:21100,jobs:41},
 {group:'industrial',name:'Machinery wiring',price:1600,unit:'from',duration:'1-3 days',ytd:34800,jobs:16},
 {group:'industrial',name:'Control panel installations',price:2900,unit:'from',duration:'2-5 days',ytd:37900,jobs:10},
 {group:'industrial',name:'Control systems',price:2200,unit:'from',duration:'2-4 days',ytd:18600,jobs:7},
 {group:'industrial',name:'Power distribution systems',price:3400,unit:'from',duration:'3-6 days',ytd:27200,jobs:6},
 {group:'industrial',name:'Industrial lighting',price:1250,unit:'from',duration:'1-3 days',ytd:13400,jobs:9},
 {group:'industrial',name:'Maintenance & upgrades',price:480,unit:'per visit',duration:'Half day',ytd:8100,jobs:14},
 {group:'ev',name:'Home EV charging',price:899,unit:'fitted from',duration:'Half day',ytd:52400,jobs:58},
 {group:'ev',name:'Business EV charging',price:2450,unit:'per point from',duration:'1-2 days',ytd:29600,jobs:12},
 {group:'ev',name:'Public sector',price:3200,unit:'per point from',duration:'2-3 days',ytd:9800,jobs:3},
 {group:'ev',name:'System setup & testing',price:180,unit:'fixed',duration:'2 hours',ytd:5900,jobs:24},
 {group:'residential',name:'Wiring',price:3200,unit:'full rewire from',duration:'4-6 days',ytd:28800,jobs:9},
 {group:'residential',name:'Lighting installations',price:240,unit:'from',duration:'Half day',ytd:16600,jobs:44},
 {group:'residential',name:'Fuse board / consumer unit upgrades',price:595,unit:'fitted from',duration:'1 day',ytd:30900,jobs:47},
 {group:'residential',name:'Smart home systems',price:1150,unit:'from',duration:'1-2 days',ytd:12000,jobs:9},
 {group:'residential',name:'EICR testing',price:165,unit:'fixed',duration:'3 hours',ytd:4300,jobs:26},
 {group:'data',name:'Cat5e cabling',price:85,unit:'per point',duration:'Varies',ytd:4200,jobs:6},
 {group:'data',name:'Cat6 cabling',price:95,unit:'per point',duration:'Varies',ytd:21400,jobs:17},
 {group:'data',name:'Cat6a cabling',price:120,unit:'per point',duration:'Varies',ytd:15800,jobs:9},
 {group:'data',name:'Cat7 cabling',price:145,unit:'per point',duration:'Varies',ytd:5300,jobs:3},
 {group:'data',name:'Fibre termination',price:65,unit:'per core',duration:'Varies',ytd:8700,jobs:8},
 {group:'data',name:'Testing & certification',price:350,unit:'from',duration:'1 day',ytd:3300,jobs:9},
 {group:'data',name:'Network upgrades',price:1400,unit:'from',duration:'1-3 days',ytd:2000,jobs:2}
];

// Site visit bookings (options mirror the website booking form)
function B(id,date,win,time,svc,job,prop,cust,site,pc,area,status,value,detail){return{id:id,date:date,window:win,time:time,service:svc,jobType:job,property:prop,customer:cust,site:site,postcode:pc,area:area,status:status,value:value,details:detail};}
var bookings=[
 B('DC-261005-K4TM','2026-10-05','morning','08:00','commercial','installation','business','Harbourne Dental Group','Harborne High Street','B17 9NS','Birmingham','completed',4650,'Surgery refit: new circuits and lighting for two treatment rooms'),
 B('DC-261008-P2QA','2026-10-08','afternoon','13:00','ev','installation','home','Priya Raman','Oakfield Road','WV6 8EP','Wolverhampton','completed',899,'7kW home charger on driveway'),
 B('DC-261013-W8RJ','2026-10-13','morning','08:30','industrial','installation','industrial','Tettenhall Precision Ltd','Steelhouse Lane Unit 4','WV2 2AS','Wolverhampton','completed',6200,'Control panel for new CNC line'),
 B('DC-261016-H1LZ','2026-10-16','morning','09:00','data','installation','business','Moseley Print Co','Alcester Road','B13 8EE','Birmingham','completed',2380,'24 Cat6 points and cabinet'),
 B('DC-261021-C7NB','2026-10-21','afternoon','12:30','residential','upgrade','home','Gareth Lloyd','Penn Road','WV3 0EE','Wolverhampton','completed',595,'Consumer unit upgrade'),
 B('DC-261027-M3YD','2026-10-27','flexible','10:00','commercial','maintenance','business','Brindley Place Lettings','Brindleyplace Office 3','B1 2JB','Birmingham','completed',420,'Quarterly maintenance visit'),
 B('DC-261029-S9VF','2026-10-29','morning','08:00','ev','installation','business','Bilston Van Hire','Mount Pleasant Depot','WV14 7LS','Wolverhampton','completed',7350,'Three business charge points'),
 B('DC-261102-A5GE','2026-11-02','morning','08:00','commercial','installation','business','Jewellery Quarter Studios','Vyse Street','B18 6LE','Birmingham','completed',3900,'Studio power and track lighting'),
 B('DC-261103-R6UK','2026-11-03','afternoon','13:30','residential','testing','home','Helen Okafor','Moor Green Lane','B13 8NE','Birmingham','completed',165,'EICR for landlord certificate'),
 B('DC-261105-T2HX','2026-11-05','morning','08:30','industrial','maintenance','industrial','Black Country Castings','Planetary Road','WV13 3XA','Wolverhampton','completed',960,'Machinery isolator checks'),
 B('DC-261109-N4EQ','2026-11-09','morning','09:00','ev','installation','home','Tom Whitfield','Codsall Road','WV6 9QL','Wolverhampton','completed',899,'Tethered home charger'),
 B('DC-261110-L8BW','2026-11-10','afternoon','12:00','data','upgrade','business','Edgbaston Accountancy','Calthorpe Road','B15 1QT','Birmingham','completed',1850,'Cat6a upgrade and patch panel'),
 B('DC-261112-F3JP','2026-11-12','morning','08:00','residential','installation','home','Aisha Mahmood','Wake Green Road','B13 9PZ','Birmingham','completed',1240,'Kitchen lighting and smart switches'),
 B('DC-261116-D7CS','2026-11-16','morning','08:00','industrial','installation','industrial','Fallings Park Logistics','Bushbury Lane','WV10 9TT','Wolverhampton','completed',4800,'LED high-bay industrial lighting'),
 B('DC-261118-Y1MO','2026-11-18','flexible','11:00','commercial','survey-quote','business','Kings Heath Gym','York Road','B14 7SA','Birmingham','completed',0,'Survey for power distribution upgrade'),
 B('DC-261119-V5RT','2026-11-19','afternoon','13:00','ev','installation','home','Daniel Brookes','Compton Road','WV3 9PN','Wolverhampton','completed',899,'7kW home charger'),
 B('DC-261120-G9ZL','2026-11-20','morning','08:30','residential','upgrade','home','Sophie Castell','Bournville Lane','B30 2LN','Birmingham','completed',595,'Consumer unit upgrade'),
 B('DC-261123-E2KW','2026-11-23','morning','08:00','data','installation','public','Ladywood Community Centre','Ladywood Middleway','B16 8HA','Birmingham','completed',2640,'Fibre termination and Cat6'),
 B('DC-261124-J6PD','2026-11-24','morning','08:00','commercial','maintenance','business','Brindley Place Lettings','Brindleyplace Office 1','B1 2JB','Birmingham','confirmed',420,'Emergency lighting test'),
 B('DC-261124-U3NA','2026-11-24','afternoon','13:30','ev','survey-quote','business','Wednesfield Motors','Graiseley Lane','WV11 1PH','Wolverhampton','confirmed',0,'Survey for four forecourt chargers'),
 B('DC-261125-Q8HF','2026-11-25','morning','08:00','industrial','installation','industrial','Tettenhall Precision Ltd','Steelhouse Lane Unit 4','WV2 2AS','Wolverhampton','confirmed',3400,'Machinery wiring for second line'),
 B('DC-261126-B4XS','2026-11-26','afternoon','12:30','residential','installation','home','Marcus Bennett','Finchfield Hill','WV3 9EP','Wolverhampton','confirmed',1150,'Smart home lighting system'),
 B('DC-261127-K1YV','2026-11-27','morning','09:00','commercial','upgrade','business','Digbeth Coffee Roasters','Fazeley Street','B5 5RS','Birmingham','pending',2400,'Three-phase supply for roaster'),
 B('DC-261130-Z7GM','2026-11-30','flexible','10:00','data','testing','business','Moseley Print Co','Alcester Road','B13 8EE','Birmingham','pending',350,'Cable testing and certification'),
 B('DC-261201-W2TC','2026-12-01','morning','08:00','ev','installation','home','Lucy Harrington','Tettenhall Road','WV6 0BT','Wolverhampton','confirmed',899,'Home charger with load management'),
 B('DC-261203-H5RE','2026-12-03','morning','08:00','residential','installation','home','Imran Siddiqui','Stratford Road','B11 4EA','Birmingham','pending',3200,'Full rewire, three-bed terrace'),
 B('DC-261207-N8FA','2026-12-07','afternoon','13:00','industrial','maintenance','industrial','Black Country Castings','Planetary Road','WV13 3XA','Wolverhampton','pending',480,'Control system service'),
 B('DC-261210-C3LU','2026-12-10','morning','08:30','commercial','installation','business','Kings Heath Gym','York Road','B14 7SA','Birmingham','pending',5200,'Power distribution upgrade'),
 B('DC-261111-X4OC','2026-11-11','morning','09:00','residential','upgrade','home','Rachel Dunmore','Goldthorn Hill','WV2 3HU','Wolverhampton','cancelled',595,'Customer rescheduling into the new year')
];

// Customer accounts (lifetime figures)
var customers=[
 ['Harbourne Dental Group','commercial','business','Birmingham',4,11240,'2026-10-05'],
 ['Priya Raman','ev','home','Wolverhampton',1,899,'2026-10-08'],
 ['Tettenhall Precision Ltd','industrial','industrial','Wolverhampton',6,21850,'2026-11-25'],
 ['Moseley Print Co','data','business','Birmingham',3,4910,'2026-11-30'],
 ['Gareth Lloyd','residential','home','Wolverhampton',2,835,'2026-10-21'],
 ['Brindley Place Lettings','commercial','business','Birmingham',11,9640,'2026-11-24'],
 ['Bilston Van Hire','ev','business','Wolverhampton',2,7710,'2026-10-29'],
 ['Jewellery Quarter Studios','commercial','business','Birmingham',2,5220,'2026-11-02'],
 ['Helen Okafor','residential','home','Birmingham',3,1925,'2026-11-03'],
 ['Black Country Castings','industrial','industrial','Wolverhampton',8,14320,'2026-12-07'],
 ['Tom Whitfield','ev','home','Wolverhampton',1,899,'2026-11-09'],
 ['Edgbaston Accountancy','data','business','Birmingham',2,3260,'2026-11-10'],
 ['Aisha Mahmood','residential','home','Birmingham',2,1835,'2026-11-12'],
 ['Fallings Park Logistics','industrial','industrial','Wolverhampton',3,9650,'2026-11-16'],
 ['Kings Heath Gym','commercial','business','Birmingham',2,5200,'2026-12-10'],
 ['Daniel Brookes','ev','home','Wolverhampton',1,899,'2026-11-19'],
 ['Sophie Castell','residential','home','Birmingham',1,595,'2026-11-20'],
 ['Ladywood Community Centre','data','public','Birmingham',2,4120,'2026-11-23'],
 ['Wednesfield Motors','ev','business','Wolverhampton',1,0,'2026-11-24'],
 ['Marcus Bennett','residential','home','Wolverhampton',2,1390,'2026-11-26'],
 ['Digbeth Coffee Roasters','commercial','business','Birmingham',1,2400,'2026-11-27'],
 ['Lucy Harrington','ev','home','Wolverhampton',1,899,'2026-12-01'],
 ['Imran Siddiqui','residential','home','Birmingham',1,3200,'2026-12-03'],
 ['Rachel Dunmore','residential','home','Wolverhampton',1,0,'2026-11-11']
].map(function(c,i){return{id:'C'+String(1040+i),name:c[0],sector:c[1],property:c[2],area:c[3],jobs:c[4],spend:c[5],lastVisit:c[6]};});

// Breakdowns for the last 12 months (sum to the 12-month total)
var total12=monthly.reduce(function(a,m){return a+m.total;},0);
var areaSplit={Birmingham:Math.round(total12*0.56)};areaSplit.Wolverhampton=total12-areaSplit.Birmingham;
var propSplit={home:Math.round(total12*0.27),business:Math.round(total12*0.41),industrial:Math.round(total12*0.25)};propSplit.public=total12-propSplit.home-propSplit.business-propSplit.industrial;
var jobSplit={installation:Math.round(total12*0.58),upgrade:Math.round(total12*0.21),maintenance:Math.round(total12*0.12)};jobSplit.testing=total12-jobSplit.installation-jobSplit.upgrade-jobSplit.maintenance;

var activity=[
 {at:'2026-11-24 07:42',text:'Visit DC-261124-J6PD confirmed - Brindley Place Lettings'},
 {at:'2026-11-23 16:10',text:'Invoice paid - Ladywood Community Centre, £2,640.00'},
 {at:'2026-11-23 11:25',text:'New booking request DC-261130-Z7GM - Moseley Print Co'},
 {at:'2026-11-22 09:05',text:'New booking request DC-261127-K1YV - Digbeth Coffee Roasters'},
 {at:'2026-11-20 15:30',text:'Job completed - Sophie Castell, consumer unit upgrade'},
 {at:'2026-11-19 17:00',text:'Quote accepted - Kings Heath Gym, £5,200.00'}
];

window.ADMIN_DATA={today:'2026-11-24',currency:'GBP',sectors:SECTORS,monthly:monthly,services:services,bookings:bookings,customers:customers,activity:activity,
 breakdown:{area:areaSplit,property:propSplit,jobType:jobSplit},
 labels:{window:{morning:'Morning',afternoon:'Afternoon',flexible:'Flexible'},jobType:{'survey-quote':'Site survey and quote',installation:'New installation',upgrade:'Upgrade',maintenance:'Maintenance',testing:'Testing',other:'Other'},property:{home:'Home',business:'Business premises',industrial:'Industrial site',public:'Public sector site'},status:{pending:'Awaiting confirmation',confirmed:'Confirmed',completed:'Completed',cancelled:'Cancelled'}}};

// Helpers
var ICONS={dash:'<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',chart:'<path d="M3 3v18h18M7 15l4-4 3 3 6-6"/>',tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/><circle cx="9" cy="7" r="4"/>',ext:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',plus:'<path d="M12 5v14M5 12h14"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>',left:'<path d="M15 18l-6-6 6-6"/>',right:'<path d="M9 18l6-6-6-6"/>',up:'<path d="M12 19V5M5 12l7-7 7 7"/>',down:'<path d="M12 5v14M19 12l-7 7-7-7"/>',building:'<path d="M4 21V5l8-3v19M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2M2 21h20"/>',factory:'<path d="M2 21V10l6 4v-4l6 4V5h4l3 16H2zM6 18h2M11 18h2"/>',ev:'<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0V7zM12 17v5"/>',home:'<path d="M3 11 12 3l9 8M5 9.5V21h14V9.5M10 21v-6h4v6"/>',net:'<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-5h14v5"/>',edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'};
function icon(n,cls){return '<svg class="adm-ico'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+(ICONS[n]||'')+'</svg>';}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function money(n,dp){var d=dp==null?0:dp;return '£'+Number(n||0).toLocaleString('en-GB',{minimumFractionDigits:d,maximumFractionDigits:d});}
function parse(iso){var p=String(iso).split('-');return new Date(+p[0],+p[1]-1,+(p[2]||1));}
function fmtDate(iso,opt){return parse(iso).toLocaleDateString('en-GB',opt||{weekday:'short',day:'numeric',month:'short',year:'numeric'});}
function fmtMonth(ym,long){return parse(ym+'-01').toLocaleDateString('en-GB',{month:long?'long':'short',year:long?'numeric':'2-digit'});}
function pct(a,b){if(!b)return 0;return (a-b)/b*100;}
function change(a,b){var p=pct(a,b);var up=p>=0;return '<span class="'+(up?'adm-up':'adm-down')+'">'+icon(up?'up':'down')+' '+Math.abs(p).toFixed(1)+'%</span>';}
function sector(k){for(var i=0;i<SECTORS.length;i++)if(SECTORS[i].key===k)return SECTORS[i];return{key:k,name:k,color:'#999',icon:'bolt'};}
function sectorTag(k){var s=sector(k);return '<span class="adm-sector"><span class="adm-dot" style="background:'+s.color+'"></span>'+esc(s.name)+'</span>';}
function badge(st){return '<span class="adm-badge adm-badge-'+esc(st)+'">'+esc(window.ADMIN_DATA.labels.status[st]||st)+'</span>';}
function flash(el,text,isErr){if(typeof el==='string')el=document.getElementById(el);if(!el)return;el.className='adm-msg'+(isErr?' adm-msg-error':'');el.textContent=text;clearTimeout(el._t);el._t=setTimeout(function(){el.textContent='';},5000);}

var PAGES=[['index.html','Dashboard','dash'],['bookings.html','Site Visits','cal'],['revenue.html','Revenue Analysis','chart'],['services.html','Services & Rates','tag'],['customers.html','Customers','users']];
function renderNav(target){
 var el=typeof target==='string'?document.getElementById(target):(target||document.getElementById('adm-side'));
 if(!el)return;
 var here=location.pathname.split('/').pop()||'index.html';
 el.innerHTML='<div class="adm-side-top"><a class="adm-brand" href="index.html"><img src="../source-website/assets/image-2.jpg" alt="DC INSTALLATIONS admin, dashboard" width="500" height="200"><span class="adm-brand-sub">// owner admin</span></a>'+
 '<button type="button" class="adm-menu-btn" aria-expanded="false" aria-controls="adm-navwrap">'+icon('menu')+'Menu</button></div>'+
 '<div class="adm-navwrap" id="adm-navwrap"><nav aria-label="Admin"><ul class="adm-nav">'+PAGES.map(function(p){return '<li><a href="'+p[0]+'"'+(p[0]===here?' aria-current="page"':'')+'>'+icon(p[2])+esc(p[1])+'</a></li>';}).join('')+'</ul></nav>'+
 '<div class="adm-side-foot"><a href="../index.html">'+icon('ext')+'View website</a></div></div>';
 var btn=el.querySelector('.adm-menu-btn'),wrap=el.querySelector('.adm-navwrap');
 btn.addEventListener('click',function(){var o=wrap.classList.toggle('adm-open');btn.setAttribute('aria-expanded',o?'true':'false');});
}

/* Shared catalogue manager with Add service behaviour.
 opts: {container, addButton, items, groups:[{key,name,icon}], msg, saveButton, resetButton, addLabel} */
function catalogue(opts){
 var box=typeof opts.container==='string'?document.getElementById(opts.container):opts.container;
 var msg=opts.msg;
 var original=JSON.parse(JSON.stringify(opts.items));
 var items=JSON.parse(JSON.stringify(opts.items));
 var groups=opts.groups||SECTORS;
 var uid=0;items.forEach(function(it){it._id='s'+(uid++);});
 function render(newId){
 box.innerHTML=groups.map(function(g){
 var rows=items.filter(function(i){return i.group===g.key;});
 return '<section class="adm-group" aria-labelledby="adm-g-'+g.key+'"><div class="adm-group-head">'+icon(g.icon)+'<h2 id="adm-g-'+g.key+'">'+esc(g.name)+'</h2><span class="adm-muted" style="color:#bdbdbd;margin-left:auto">'+rows.length+' services</span></div><div class="adm-card"><div class="adm-table-wrap"><table class="adm-table"><thead><tr><th scope="col">Service</th><th scope="col">Price</th><th scope="col">Basis</th><th scope="col">Duration</th><th scope="col"><span class="adm-sr">Actions</span></th></tr></thead><tbody>'+
 rows.map(function(r){var lid='adm-p-'+r._id;return '<tr data-id="'+r._id+'"'+(r._id===newId?' class="adm-new"':'')+'><td><label for="'+lid+'n" class="sr-only">Service name</label><input class="adm-input" id="'+lid+'n" data-f="name" value="'+esc(r.name)+'"></td><td><div class="adm-price"><span aria-hidden="true">£</span><label for="'+lid+'" class="sr-only">Price for '+esc(r.name)+' in pounds</label><input class="adm-input" id="'+lid+'" data-f="price" type="number" min="0" step="1" inputmode="decimal" value="'+r.price+'"></div></td><td><label for="'+lid+'u" class="sr-only">Price basis</label><input class="adm-input" id="'+lid+'u" data-f="unit" value="'+esc(r.unit||'')+'"></td><td><div class="adm-dur"><label for="'+lid+'d" class="sr-only">Duration</label><input class="adm-input" id="'+lid+'d" data-f="duration" value="'+esc(r.duration||'')+'"></div></td><td class="adm-num"><button type="button" class="adm-btn adm-btn-danger adm-btn-sm" data-remove="'+r._id+'" aria-label="Remove '+esc(r.name)+'">'+icon('x')+'Remove</button></td></tr>';}).join('')+
 '</tbody></table></div></div></section>';
 }).join('');
 }
 box.addEventListener('input',function(e){var f=e.target.getAttribute('data-f');if(!f)return;var id=e.target.closest('tr').getAttribute('data-id');items.forEach(function(i){if(i._id===id)i[f]=f==='price'?parseFloat(e.target.value)||0:e.target.value;});});
 box.addEventListener('click',function(e){var b=e.target.closest('[data-remove]');if(!b)return;var id=b.getAttribute('data-remove');var it=items.filter(function(i){return i._id===id;})[0];items=items.filter(function(i){return i._id!==id;});render();flash(msg,'Removed '+(it?it.name:'service')+'. Save changes to update the rate card.');});
 // Add panel
 var addBtn=typeof opts.addButton==='string'?document.getElementById(opts.addButton):opts.addButton;
 var panel=document.createElement('form');panel.className='adm-panel';panel.hidden=true;panel.noValidate=true;panel.setAttribute('aria-labelledby','adm-add-title');
 panel.innerHTML='<h2 id="adm-add-title">'+esc(opts.addLabel||'Add service')+'</h2><div class="adm-form-grid">'+
 '<div class="adm-field"><label for="adm-add-name">Service name *</label><input class="adm-input" id="adm-add-name" required></div>'+
 '<div class="adm-field"><label for="adm-add-group">Sector *</label><select class="adm-select" id="adm-add-group" required><option value="">Select...</option>'+groups.map(function(g){return '<option value="'+g.key+'">'+esc(g.name)+'</option>';}).join('')+'</select></div>'+
 '<div class="adm-field"><label for="adm-add-price">Price (£) *</label><input class="adm-input" id="adm-add-price" type="number" min="0" step="1" required></div>'+
 '<div class="adm-field"><label for="adm-add-unit">Price basis</label><input class="adm-input" id="adm-add-unit" placeholder="from"></div>'+
 '<div class="adm-field"><label for="adm-add-dur">Duration</label><input class="adm-input" id="adm-add-dur" placeholder="1 day"></div>'+
 '<div class="adm-field adm-form-wide"><label for="adm-add-desc">Description</label><textarea class="adm-textarea" id="adm-add-desc"></textarea></div></div>'+
 '<div class="adm-actions" style="margin-top:12px"><button type="submit" class="adm-btn">'+icon('plus')+'Save service</button><button type="button" class="adm-btn adm-btn-ghost" data-cancel>Cancel</button></div><div class="adm-msg" role="status" aria-live="polite"></div>';
 box.parentNode.insertBefore(panel,box);
 if(addBtn){addBtn.setAttribute('aria-expanded','false');addBtn.addEventListener('click',function(){panel.hidden=!panel.hidden;addBtn.setAttribute('aria-expanded',panel.hidden?'false':'true');if(!panel.hidden)panel.querySelector('#adm-add-name').focus();});}
 panel.querySelector('[data-cancel]').addEventListener('click',function(){panel.reset();panel.hidden=true;if(addBtn){addBtn.setAttribute('aria-expanded','false');addBtn.focus();}});
 panel.addEventListener('submit',function(e){e.preventDefault();
 var n=panel.querySelector('#adm-add-name'),g=panel.querySelector('#adm-add-group'),p=panel.querySelector('#adm-add-price');var bad=null;
 [n,g,p].forEach(function(el){var v=el.value.trim();var b=!v||(el===p&&(isNaN(parseFloat(v))||parseFloat(v)<0));el.setAttribute('aria-invalid',b?'true':'false');if(b&&!bad)bad=el;});
 var pm=panel.querySelector('.adm-msg');
 if(bad){flash(pm,'Please complete the name, sector and price.',true);bad.focus();return;}
 var it={_id:'s'+(uid++),group:g.value,name:n.value.trim(),price:parseFloat(p.value),unit:panel.querySelector('#adm-add-unit').value.trim()||'from',duration:panel.querySelector('#adm-add-dur').value.trim(),description:panel.querySelector('#adm-add-desc').value.trim(),ytd:0,jobs:0};
 items.push(it);render(it._id);panel.reset();panel.hidden=true;if(addBtn)addBtn.setAttribute('aria-expanded','false');
 flash(msg,'Added '+it.name+' to '+sector(it.group).name+'.');
 var row=box.querySelector('tr[data-id="'+it._id+'"] input');if(row)row.focus();
 });
 var save=typeof opts.saveButton==='string'?document.getElementById(opts.saveButton):opts.saveButton;
 var reset=typeof opts.resetButton==='string'?document.getElementById(opts.resetButton):opts.resetButton;
 if(save)save.addEventListener('click',function(){var bad=items.filter(function(i){return !String(i.name).trim()||!(i.price>=0);});if(bad.length){flash(msg,'Check names and prices before saving.',true);return;}flash(msg,'Rate card saved - '+items.length+' services.');});
 if(reset)reset.addEventListener('click',function(){items=JSON.parse(JSON.stringify(original));uid=0;items.forEach(function(it){it._id='s'+(uid++);});render();flash(msg,'Rate card reset to the current prices.');});
 render();
 return{items:function(){return items;}};
}

window.ADM={icon:icon,esc:esc,money:money,parse:parse,fmtDate:fmtDate,fmtMonth:fmtMonth,pct:pct,change:change,sector:sector,sectorTag:sectorTag,badge:badge,flash:flash,renderNav:renderNav,catalogue:catalogue,pages:PAGES};
document.addEventListener('DOMContentLoaded',function(){if(document.getElementById('adm-side'))renderNav('adm-side');});
})();
