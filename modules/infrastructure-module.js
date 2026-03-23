// ============================================================
// INFRASTRUCTURE MODULE 
// ============================================================
(function(){
'use strict';
var _t=typeof t==='function'?t:function(k){return k};

document.addEventListener('DOMContentLoaded',function(){
  var dl=document.querySelector('[data-page="documents"]');
  if(dl&&dl.innerHTML.indexOf('<path')!==-1){
    var sp=dl.querySelector('[data-i18n="nav_documents"]');
    dl.innerHTML='<span data-i18n="nav_documents">'+(sp?sp.textContent:_t('nav_documents'))+'</span>';
  }
  ['analytics','gis'].forEach(function(p){
    var lk=document.querySelector('[data-page="'+p+'"]');
    if(lk)lk.style.display='none';
  });
});

if(typeof PAGES!=='undefined'&&PAGES.dashboard){
  var _dg=Object.getOwnPropertyDescriptor(PAGES.dashboard,'content');
  if(_dg&&_dg.get){
    var _dgGet=_dg.get;
    Object.defineProperty(PAGES.dashboard,'content',{get:function(){
      return _dgGet.call(this).replace(/document\.getElementById\('content-area'\)\.innerHTML\s*=\s*renderCalendarModule\(\);\s*initCalendarModule\(\);/g,'');
    },configurable:true});
  }
}

// == DATA ==
var D=[
  {id:1,name:'Stade Olympique de Radès',type:'Stade',region:'Ben Arous',capacity:60000,status:'active',lat:36.7444,lng:10.2833,img:'assets/campnou.jpg'},
  {id:2,name:'Centre Aquatique National',type:'Piscine',region:'Tunis',capacity:3000,status:'active',lat:36.8065,lng:10.1815,img:'assets/aquatic.jpg'},
  {id:3,name:'Salle Omnisports El Menzah',type:'Salle',region:'Tunis',capacity:6000,status:'maintenance',lat:36.8283,lng:10.1553,img:'assets/gym.jpg'},
  {id:4,name:'Complexe Sportif de Sfax',type:'Complexe',region:'Sfax',capacity:15000,status:'active',lat:34.7406,lng:10.7603,img:'assets/complexx.webp'},
  {id:5,name:'Stade Taïeb Mhiri',type:'Stade',region:'Sfax',capacity:25000,status:'active',lat:34.75,lng:10.7667,img:'assets/albayt.webp'},
  {id:6,name:'Piscine Olympique Sousse',type:'Piscine',region:'Sousse',capacity:2000,status:'inactive',lat:35.8288,lng:10.6405,img:'assets/pool.jpg'}
];
window.INFRA_DATA=D;
var REGIONS=['Tunis','Ariana','Ben Arous','Manouba','Nabeul','Bizerte','Béja','Sousse','Monastir','Sfax','Kairouan','Gabès','Médenine','Gafsa'];

function nxId(){return D.length?Math.max.apply(null,D.map(function(x){return x.id}))+1:1;}
function toast(m){var e=document.getElementById('infra-toast');if(e)e.remove();e=document.createElement('div');e.id='infra-toast';e.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1A237E;color:#fff;padding:10px 20px;border-radius:10px;font-size:13px;z-index:9999;display:flex;align-items:center;gap:8px';e.innerHTML='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'+m;document.body.appendChild(e);setTimeout(function(){e.style.opacity='0';e.style.transition='opacity .3s'},2200);setTimeout(function(){e.remove()},2600);}

function sBadge(s){
  var _t=typeof t==='function'?t:function(k){return k};
  return{active:'<span style="background:#E8F5E9;color:#1B5E20;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:600">'+_t('infra_status_active')+'</span>',maintenance:'<span style="background:#FFF3E0;color:#E65100;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:600">'+_t('infra_status_maintenance')+'</span>',inactive:'<span style="background:#FFEBEE;color:#B71C1C;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:600">'+_t('infra_status_inactive')+'</span>'}[s]||s;
}
function grad(tp){return{Stade:'from-blue-500 to-blue-600',Piscine:'from-cyan-400 to-cyan-600',Salle:'from-green-400 to-green-600',Complexe:'from-amber-400 to-amber-600'}[tp]||'from-slate-400 to-slate-500';}
function mColor(tp){return{Stade:'#3b82f6',Piscine:'#06b6d4',Salle:'#22c55e',Complexe:'#f59e0b'}[tp]||'#6b7280';}

// == RENDER CARDS ==
function cards(list){
  var _t=typeof t==='function'?t:function(k){return k};
  if(!list)list=D;
  if(!list.length)return'<div style="grid-column:span 3;text-align:center;padding:40px;color:#94a3b8">'+_t('infra_none_found')+'</div>';
  return list.map(function(c){
    return'<div class="infra-card bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden cursor-pointer" onclick="infraShowDetail('+c.id+')">'
    +'<div class="h-2 bg-gradient-to-r '+grad(c.type)+'"></div>'
    +'<div style="overflow:hidden"><img src="'+c.img+'" class="infra-img w-full h-40 object-cover" onerror="this.src=\'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=200&fit=crop\'"></div>'
    +'<div class="p-4"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px"><div><h3 class="font-semibold text-slate-800 dark:text-slate-100 text-sm">'+c.name+'</h3><p class="text-xs text-slate-500 mt-1">'+c.type+' · '+c.region+' · '+c.capacity.toLocaleString()+' places</p></div>'+sBadge(c.status)+'</div>'
    +'<div style="display:flex;gap:6px;margin-top:10px"><button onclick="event.stopPropagation();infraOpenModal(\'edit\','+c.id+')" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600">'+_t('infra_edit')+'</button><button onclick="event.stopPropagation();infraDelete('+c.id+')" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100">'+_t('infra_delete')+'</button></div>'
    +'</div></div>';
  }).join('');
}

// == CRUD ==
window.infraOpenModal=function(mode,id){
  var _t=typeof t==='function'?t:function(k){return k};
  var inf=mode==='edit'?D.find(function(x){return x.id===id}):null;
  var title=inf?_t('infra_modal_edit'):_t('infra_modal_create');
  var mc=document.getElementById('infra-modal-container');if(!mc)return;
  mc.innerHTML='<div id="infra-overlay" style="position:fixed;inset:0;background:rgba(10,15,50,.5);backdrop-filter:blur(3px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px" onclick="if(event.target===this)infraCloseModal()">'
  +'<div style="background:var(--doc-surface,#fff);border-radius:16px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(10,15,50,.25)">'
  +'<div style="padding:20px 24px 16px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center"><span style="font-size:15px;font-weight:700;color:var(--doc-text,#1e293b)">'+title+'</span><button onclick="infraCloseModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#94a3b8">✕</button></div>'
  +'<div style="padding:20px 24px;display:grid;grid-template-columns:1fr 1fr;gap:14px">'
  +'<div style="grid-column:span 2"><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('infra_name')+' *</label><input id="inf-name" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;box-sizing:border-box;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)" value="'+(inf?inf.name:'')+'"></div>'
  +'<div><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('infra_type')+' *</label><select id="inf-type" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)">'+['Stade','Piscine','Salle','Complexe'].map(function(tp){return'<option'+(inf&&inf.type===tp?' selected':'')+'>'+tp+'</option>'}).join('')+'</select></div>'
  +'<div><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('infra_region')+' *</label><select id="inf-region" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)">'+REGIONS.map(function(r){return'<option'+(inf&&inf.region===r?' selected':'')+'>'+r+'</option>'}).join('')+'</select></div>'
  +'<div><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('infra_capacity')+' *</label><input id="inf-cap" type="number" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;box-sizing:border-box;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)" value="'+(inf?inf.capacity:'')+'"></div>'
  +'<div><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('infra_status')+'</label><select id="inf-status" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)"><option value="active"'+(inf&&inf.status==='active'?' selected':'')+'>'+_t('infra_status_active')+'</option><option value="maintenance"'+(inf&&inf.status==='maintenance'?' selected':'')+'>'+_t('infra_status_maintenance')+'</option><option value="inactive"'+(inf&&inf.status==='inactive'?' selected':'')+'>'+_t('infra_status_inactive')+'</option></select></div>'
  +'<div><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('infra_latitude')+'</label><input id="inf-lat" type="number" step="0.0001" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;box-sizing:border-box;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)" value="'+(inf?inf.lat:'36.8')+'"></div>'
  +'<div><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('infra_longitude')+'</label><input id="inf-lng" type="number" step="0.0001" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;box-sizing:border-box;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)" value="'+(inf?inf.lng:'10.1')+'"></div>'
  +'</div>'
  +'<div style="padding:14px 24px;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:8px"><button onclick="infraCloseModal()" style="padding:8px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:transparent;color:var(--doc-text,#1e293b)">'+_t('cancel')+'</button><button onclick="infraSave('+(inf?inf.id:'null')+')" style="padding:8px 16px;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:#1A237E;color:#fff">'+(inf?_t('infra_save'):_t('infra_create'))+'</button></div>'
  +'</div></div>';
};
window.infraCloseModal=function(){var c=document.getElementById('infra-modal-container');if(c)c.innerHTML='';};
window.infraSave=function(eid){
  var _t=typeof t==='function'?t:function(k){return k};
  var n=(document.getElementById('inf-name')||{}).value||'';
  var tp=(document.getElementById('inf-type')||{}).value;
  var rg=(document.getElementById('inf-region')||{}).value;
  var cp=parseInt((document.getElementById('inf-cap')||{}).value)||0;
  var st=(document.getElementById('inf-status')||{}).value;
  var lt=parseFloat((document.getElementById('inf-lat')||{}).value)||36.8;
  var lg=parseFloat((document.getElementById('inf-lng')||{}).value)||10.1;
  if(!n.trim()){toast('⚠ '+_t('infra_name_required'));return;}
  if(!cp){toast('⚠ '+_t('infra_capacity_required'));return;}
  if(eid){var inf=D.find(function(x){return x.id===eid});if(inf){inf.name=n;inf.type=tp;inf.region=rg;inf.capacity=cp;inf.status=st;inf.lat=lt;inf.lng=lg;}toast('✓ "'+n+'" '+_t('infra_updated'));}
  else{D.push({id:nxId(),name:n,type:tp,region:rg,capacity:cp,status:st,lat:lt,lng:lg,img:'assets/complexx.webp'});toast('✓ "'+n+'" '+_t('infra_added'));}
  infraCloseModal();refreshPage();
};
window.infraDelete=function(id){var _t=typeof t==='function'?t:function(k){return k};var inf=D.find(function(x){return x.id===id});if(!inf||!confirm(_t('infra_delete_confirm')+' "'+inf.name+'" ?'))return;D.splice(D.indexOf(inf),1);toast(_t('infra_deleted'));refreshPage();};
window.infraShowDetail=function(id){infraOpenModal('edit',id);};
window.infraFilter=function(){
  var q=(document.getElementById('infra-search')||{}).value||'';
  var tp=(document.getElementById('infra-type-filter')||{}).value||'';
  var list=D.filter(function(c){return(!q||c.name.toLowerCase().indexOf(q.toLowerCase())!==-1||c.region.toLowerCase().indexOf(q.toLowerCase())!==-1)&&(!tp||c.type===tp);});
  var g=document.getElementById('infra-cards-grid');if(g)g.innerHTML=cards(list);
};
function refreshPage(){
  var g=document.getElementById('infra-cards-grid');if(g)g.innerHTML=cards();
  var k=document.querySelectorAll('.infra-kpi-val');
  if(k.length>=4){k[0].textContent=D.length;k[1].textContent=D.filter(function(x){return x.status==='active'}).length;k[2].textContent=D.filter(function(x){return x.status==='maintenance'}).length;k[3].textContent=D.filter(function(x){return x.status==='inactive'}).length;}
}

// == GIS MAP ==
var _map=null,_markers=null;
window.infraInitMap=function(){
  var c=document.getElementById('infra-gis-map');if(!c)return;
  if(_map){_map.remove();_map=null;}
  _map=L.map('infra-gis-map').setView([35.8,10.1],7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(_map);
  _markers=L.layerGroup().addTo(_map);
  D.forEach(function(inf){
    var ic=L.divIcon({html:'<div style="width:14px;height:14px;border-radius:50%;background:'+mColor(inf.type)+';border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>',className:'',iconSize:[14,14]});
    L.marker([inf.lat,inf.lng],{icon:ic}).addTo(_markers).bindPopup('<strong>'+inf.name+'</strong><br>'+inf.type+' · '+inf.region+'<br>'+_t('infra_capacity')+': '+inf.capacity.toLocaleString()+'<br>'+sBadge(inf.status));
  });
};
window.infraSwitchTab=function(tab,btn){
  document.querySelectorAll('.infra-view-tab').forEach(function(b){b.classList.remove('bg-primary-600','text-white');b.classList.add('bg-slate-100','dark:bg-slate-800','text-slate-600');});
  btn.classList.remove('bg-slate-100','dark:bg-slate-800','text-slate-600');btn.classList.add('bg-primary-600','text-white');
  document.getElementById('infra-tab-cards').style.display=tab==='cards'?'':'none';
  document.getElementById('infra-tab-map').style.display=tab==='map'?'':'none';
  document.getElementById('infra-tab-predict').style.display=tab==='predict'?'':'none';
  if(tab==='map')setTimeout(infraInitMap,100);
  if(tab==='predict')setTimeout(infraInitPredictChart,100);
};
window.infraInitPredictChart=function(){
  var _t=typeof t==='function'?t:function(k){return k};
  var ctx=document.getElementById('infra-predict-chart');if(!ctx)return;
  var dk=document.documentElement.classList.contains('dark'),tc=dk?'#94a3b8':'#64748b',gc=dk?'#334155':'#f1f5f9';
  new Chart(ctx.getContext('2d'),{type:'line',data:{labels:['Oct','Nov','Déc','Jan','Fév','Mar','Avr*','Mai*','Jun*'],datasets:[
    {label:'Stade Radès',data:[72,78,65,80,85,82,87,84,89],borderColor:'#1A237E',backgroundColor:'rgba(26,35,126,.06)',fill:true,tension:.4,pointRadius:3},
    {label:'Sfax',data:[55,60,50,62,68,65,70,68,72],borderColor:'#f59e0b',tension:.4,pointRadius:3,borderDash:[5,3]},
    {label:'Sousse',data:[40,45,38,50,52,48,55,53,58],borderColor:'#22c55e',tension:.4,pointRadius:3,borderDash:[5,3]}
  ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:tc,font:{size:11}}}},scales:{y:{min:0,max:100,ticks:{color:tc,callback:function(v){return v+'%'}},grid:{color:gc}},x:{ticks:{color:tc},grid:{display:false}}}}});
};

// == OVERRIDE PAGES.infrastructure ==
if(typeof PAGES!=='undefined'){
PAGES.infrastructure={
  get title(){return typeof t==='function'?t('nav_infrastructure'):'Infrastructures';},
  get subtitle(){return typeof t==='function'?t('infra_crud_subtitle'):'CRUD · Cartographie GIS · Évaluation IA';},
  get content(){
    var _t=typeof t==='function'?t:function(k){return k};
    var total=D.length,active=D.filter(function(x){return x.status==='active'}).length,maint=D.filter(function(x){return x.status==='maintenance'}).length,inact=D.filter(function(x){return x.status==='inactive'}).length;
    return'<style>.infra-card{animation:cardFade .6s ease forwards;transition:all .35s ease}.infra-card:hover{transform:translateY(-6px);box-shadow:0 16px 32px rgba(0,0,0,.15)}.infra-img{transition:transform .6s ease}.infra-card:hover .infra-img{transform:scale(1.1)}@keyframes cardFade{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}</style>'
    +'<div id="infra-modal-container"></div>'
    +'<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl p-4 border text-center"><p class="text-2xl font-bold text-primary-600 infra-kpi-val">'+total+'</p><p class="text-xs text-slate-500 mt-1">'+_t('infra_kpi_total')+'</p></div>'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl p-4 border text-center"><p class="text-2xl font-bold text-green-600 infra-kpi-val">'+active+'</p><p class="text-xs text-slate-500 mt-1">'+_t('infra_kpi_active')+'</p></div>'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl p-4 border text-center"><p class="text-2xl font-bold text-amber-600 infra-kpi-val">'+maint+'</p><p class="text-xs text-slate-500 mt-1">'+_t('infra_kpi_maintenance')+'</p></div>'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl p-4 border text-center"><p class="text-2xl font-bold text-red-600 infra-kpi-val">'+inact+'</p><p class="text-xs text-slate-500 mt-1">'+_t('infra_kpi_inactive')+'</p></div>'
    +'</div>'
    +'<div class="mb-5 flex flex-wrap items-center justify-between gap-3">'
    +'<div class="flex gap-2">'
    +'<button class="infra-view-tab px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium" onclick="infraSwitchTab(\'cards\',this)">'+_t('infra_tab_list')+'</button>'
    +'<button class="infra-view-tab px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-sm" onclick="infraSwitchTab(\'map\',this)">'+_t('infra_tab_gis')+'</button>'
    +'<button class="infra-view-tab px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-sm" onclick="infraSwitchTab(\'predict\',this)">'+_t('infra_tab_predict')+'</button>'
    +'</div>'
    +'<div class="flex gap-2 items-center">'
    +'<input id="infra-search" type="text" placeholder="'+_t('search')+'..." class="px-3 py-2 rounded-lg border text-sm w-48 dark:bg-slate-900" oninput="infraFilter()">'
    +'<select id="infra-type-filter" class="px-3 py-2 rounded-lg border text-sm dark:bg-slate-900" onchange="infraFilter()"><option value="">'+_t('all_types')+'</option><option value="Stade">'+_t('stadium')+'</option><option value="Piscine">'+_t('pool')+'</option><option value="Salle">'+_t('gym')+'</option><option value="Complexe">'+_t('complex')+'</option></select>'
    +'<button onclick="infraOpenModal(\'create\')" class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>'+_t('infra_add')+'</button>'
    +'</div></div>'
    +'<div id="infra-tab-cards"><div id="infra-cards-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">'+cards()+'</div></div>'
    +'<div id="infra-tab-map" style="display:none"><div class="bg-white dark:bg-slate-850 rounded-xl border overflow-hidden"><div id="infra-gis-map" style="height:500px"></div>'
    +'<div class="p-4 border-t flex flex-wrap gap-4 items-center"><span class="text-sm font-medium text-slate-600">'+_t('infra_gis_legend')+' :</span>'
    +'<span class="flex items-center gap-2 text-sm"><span style="width:12px;height:12px;border-radius:50%;background:#3b82f6;display:inline-block"></span>'+_t('stadium')+'</span>'
    +'<span class="flex items-center gap-2 text-sm"><span style="width:12px;height:12px;border-radius:50%;background:#06b6d4;display:inline-block"></span>'+_t('pool')+'</span>'
    +'<span class="flex items-center gap-2 text-sm"><span style="width:12px;height:12px;border-radius:50%;background:#22c55e;display:inline-block"></span>'+_t('gym')+'</span>'
    +'<span class="flex items-center gap-2 text-sm"><span style="width:12px;height:12px;border-radius:50%;background:#f59e0b;display:inline-block"></span>'+_t('complex')+'</span>'
    +'<span class="text-xs text-slate-500 ml-auto">'+D.length+' '+_t('infra_gis_count')+'</span>'
    +'</div></div></div>'
    +'<div id="infra-tab-predict" style="display:none">'
    +'<div style="background:linear-gradient(135deg,#4527A0,#7c3aed);border-radius:12px;padding:16px 20px;margin-bottom:16px;color:#fff;display:flex;align-items:center;gap:12px"><svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg><div><div style="font-size:14px;font-weight:700">'+_t('infra_predict_title')+'</div><div style="font-size:12px;opacity:.8">'+_t('infra_predict_desc')+'</div></div></div>'
    +'<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">'
    +'<div class="p-5 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200"><p class="text-xs font-medium text-primary-600 uppercase">'+_t('infra_predict_occupation')+'</p><p class="text-3xl font-bold text-primary-600 mt-2">87%</p><p class="text-xs text-slate-500 mt-1">Stade Radès — '+_t('next_month')+'</p><div style="margin-top:8px;height:4px;background:#e2e8f0;border-radius:4px"><div style="height:4px;width:87%;background:#1A237E;border-radius:4px"></div></div></div>'
    +'<div class="p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200"><p class="text-xs font-medium text-amber-600 uppercase">'+_t('infra_predict_maintenance')+'</p><p class="text-3xl font-bold text-amber-600 mt-2">3</p><p class="text-xs text-slate-500 mt-1">'+_t('infra_predict_interventions')+'</p><div style="margin-top:8px;display:flex;gap:4px"><span style="background:#FFF3E0;color:#E65100;padding:2px 8px;border-radius:4px;font-size:10px">El Menzah</span><span style="background:#FFF3E0;color:#E65100;padding:2px 8px;border-radius:4px;font-size:10px">Sousse</span><span style="background:#FFF3E0;color:#E65100;padding:2px 8px;border-radius:4px;font-size:10px">Sfax</span></div></div>'
    +'<div class="p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200"><p class="text-xs font-medium text-red-600 uppercase">'+_t('infra_predict_risk')+'</p><p class="text-3xl font-bold text-red-600 mt-2">1</p><p class="text-xs text-slate-500 mt-1">El Menzah — '+_t('infra_predict_urgent')+'</p><button onclick="navigateTo(\'ai-infra\')" class="mt-2 text-xs text-red-600 font-medium hover:underline">'+_t('infra_see_ai_eval')+'</button></div>'
    +'</div>'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl p-5 border"><h3 class="font-semibold mb-1">'+_t('infra_predict_chart_title')+'</h3><p class="text-xs text-slate-500 mb-4">'+_t('infra_predict_chart_sub')+'</p><div style="height:220px"><canvas id="infra-predict-chart"></canvas></div></div>'
    +'</div>';
  }
};

// == ENRICH DASHBOARD ==
var _dd=Object.getOwnPropertyDescriptor(PAGES.dashboard,'content');
if(_dd&&_dd.get){
  var _ddGet=_dd.get;
  Object.defineProperty(PAGES.dashboard,'content',{get:function(){
    var _t=typeof t==='function'?t:function(k){return k};
    var html=_ddGet.call(this);
    var extra=''
    +'<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">'
    +'<div class="dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm"><h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-1">'+_t('dash_events_by_region')+'</h3><p class="text-xs text-slate-500 mb-3">'+_t('dash_events_sub')+'</p><div class="h-48"><canvas id="dash-chart-regions"></canvas></div></div>'
    +'<div class="dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm"><h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-1">'+_t('dash_occupancy')+'</h3><p class="text-xs text-slate-500 mb-3">'+_t('dash_occupancy_sub')+'</p><div class="h-48"><canvas id="dash-chart-occupancy"></canvas></div></div>'
    +'</div>'
    +'<script>(function(){var dk=document.documentElement.classList.contains("dark"),tc=dk?"#94a3b8":"#64748b",gc=dk?"#334155":"#f1f5f9";'
    +'var r=document.getElementById("dash-chart-regions");if(r)new Chart(r.getContext("2d"),{type:"bar",data:{labels:["Tunis","Sfax","Sousse","Bizerte","Béja"],datasets:[{label:"'+_t('events_by_region')+'",data:[62,41,38,27,19],backgroundColor:["#1A237E","#1a88f5","#22c55e","#f59e0b","#ef4444"],borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{ticks:{color:tc},grid:{color:gc}},x:{ticks:{color:tc},grid:{display:false}}}}});'
    +'var o=document.getElementById("dash-chart-occupancy");if(o)new Chart(o.getContext("2d"),{type:"line",data:{labels:["Jan","Fév","Mar","Avr","Mai","Jun"],datasets:[{label:"'+_t('occupancy_rate')+'",data:[72,78,75,82,79,74],borderColor:"#f59e0b",backgroundColor:"rgba(245,158,11,.08)",fill:true,tension:.4,pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{color:tc},grid:{color:gc}},x:{ticks:{color:tc},grid:{display:false}}}}});'
    +'})();<\/script>';
    var idx=html.lastIndexOf('</script>');
    return idx!==-1?html.substring(0,idx+9)+extra:html+extra;
  },configurable:true});
}
}
})();