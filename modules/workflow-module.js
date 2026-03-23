// ============================================================
// WORKFLOW MODULE 
// ============================================================
(function(){
'use strict';

var WF_MANUAL=[
  {id:'WF-001',titre:'Autorisation voyage — Équipe Handball',type:'autorisation',desc:'Déplacement 15–18 mars · Capitale → Nord',soumis_par:'region.nord@sgs.gov',date_soumis:'2026-03-09',statut:'soumis',commentaire:''},
  {id:'WF-002',titre:'Demande budget — Tournoi régional Sfax',type:'budget',desc:'Budget 25k TND · Stade Taïeb Mhiri · Avril 2026',soumis_par:'region.sud@sgs.gov',date_soumis:'2026-03-12',statut:'soumis',commentaire:''},
  {id:'WF-003',titre:'Convention partenariat — Fédération Tennis',type:'convention',desc:'Accord cadre 2026-2028 · Formation arbitres',soumis_par:'tennis@fed.sgs.gov',date_soumis:'2026-03-05',statut:'valide',commentaire:'Approuvé par admin national'},
];
window.WF_MANUAL=WF_MANUAL;
function _nxId(){var mx=0;WF_MANUAL.forEach(function(w){var n=parseInt(w.id.replace('WF-',''));if(n>mx)mx=n;});return'WF-'+String(mx+1).padStart(3,'0');}

function _toast(m){var e=document.getElementById('wf-toast');if(e)e.remove();e=document.createElement('div');e.id='wf-toast';e.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1A237E;color:#fff;padding:10px 20px;border-radius:10px;font-size:13px;z-index:9999;display:flex;align-items:center;gap:8px';e.innerHTML='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'+m;document.body.appendChild(e);setTimeout(function(){e.style.opacity='0';e.style.transition='opacity .3s'},2400);setTimeout(function(){e.remove()},2800);}

function _sBadge(s){var _t=typeof t==='function'?t:function(k){return k};var m={soumis:'<span style="background:#FFF3E0;color:#E65100;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600">● '+_t('wf_kpi_pending')+'</span>',valide_regional:'<span style="background:#E8F5E9;color:#1B5E20;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600">✓ '+_t('wf_chain_regional')+'</span>',valide_national:'<span style="background:#E8F5E9;color:#1B5E20;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600">✓ '+_t('wf_chain_national')+'</span>',valide:'<span style="background:#E8F5E9;color:#1B5E20;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600">✓ '+_t('wf_kpi_approved')+'</span>',rejete:'<span style="background:#FFEBEE;color:#B71C1C;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600">✗ '+_t('wf_kpi_rejected')+'</span>'};return m[s]||s;}

function _typeBadge(tp){var m={match:'●',competition:'●',manifestation:'●',stage:'●',formation:'●',entrainement:'●',autorisation:'●',budget:'●',convention:'●'};return'<span style="background:#E8EAF6;color:#1A237E;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600">'+(m[tp]||'●')+' '+tp+'</span>';}

function _srcLabel(src){var _t=typeof t==='function'?t:function(k){return k};if(src==='calendar')return'<span style="background:#E8EAF6;color:#1A237E;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600">● '+_t('wf_source_calendar')+'</span>';return'<span style="background:#EDE7F6;color:#4527A0;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600">● '+_t('wf_source_manual')+'</span>';}

function _getAll(filter){
  var items=[];
  if(typeof CAL_DATA!=='undefined'&&CAL_DATA.evenements){CAL_DATA.evenements.forEach(function(e){items.push({id:'CAL-'+e.id,source:'calendar',calId:e.id,titre:e.titre,type:e.type,desc:e.date_debut+' · '+e.lieu+' · '+e.region,soumis_par:e.created_by,date_soumis:e.date_debut,statut:e.statut,classification:e.classification,conflit:e.conflit});});}
  WF_MANUAL.forEach(function(w){items.push({id:w.id,source:'manual',calId:null,titre:w.titre,type:w.type,desc:w.desc,soumis_par:w.soumis_par,date_soumis:w.date_soumis,statut:w.statut,classification:null,conflit:false});});
  items.sort(function(a,b){var pa=a.statut==='soumis'?0:1,pb=b.statut==='soumis'?0:1;return pa!==pb?pa-pb:b.date_soumis>a.date_soumis?1:-1;});
  if(filter==='pending')return items.filter(function(i){return i.statut==='soumis'});
  if(filter==='approved')return items.filter(function(i){return i.statut==='valide'||i.statut==='valide_national'||i.statut==='valide_regional'});
  if(filter==='rejected')return items.filter(function(i){return i.statut==='rejete'});
  return items;
}
var _selId=null,_curFilter='all';

window.wfApprove=function(id){var _t=typeof t==='function'?t:function(k){return k};var item=_getAll().find(function(x){return x.id===id});if(!item)return;if(item.source==='calendar'&&typeof CAL_DATA!=='undefined'){var evt=CAL_DATA.evenements.find(function(e){return e.id===item.calId});if(evt){if(evt.conflit){_toast('⚠ '+_t('wf_conflict_resolve'));return;}evt.statut='valide_national';}}else{var m=WF_MANUAL.find(function(w){return w.id===id});if(m)m.statut='valide';}_toast('✓ '+_t('wf_kpi_approved'));_selId=null;wfRefresh();if(typeof showApprovalModal==='function')showApprovalModal({title:item.titre,meta:item.desc});};

window.wfReject=function(id){var _t=typeof t==='function'?t:function(k){return k};var item=_getAll().find(function(x){return x.id===id});if(!item)return;var comment=(document.getElementById('wf-comment')||{}).value||'';if(!comment){_toast('⚠ '+_t('wf_reject_comment_required'));return;}if(item.source==='calendar'&&typeof CAL_DATA!=='undefined'){var evt=CAL_DATA.evenements.find(function(e){return e.id===item.calId});if(evt)evt.statut='rejete';}else{var m=WF_MANUAL.find(function(w){return w.id===id});if(m)m.statut='rejete';}_toast('✗ '+_t('wf_kpi_rejected'));_selId=null;wfRefresh();};

window.wfRequestChanges=function(id){var _t=typeof t==='function'?t:function(k){return k};_toast('↻ '+_t('wf_changes_sent'));};

window.wfSelectItem=function(id){_selId=id;_renderDetail();document.querySelectorAll('.wf-item-row').forEach(function(el){el.style.borderLeftColor=el.getAttribute('data-wf-id')===id?'#1A237E':'transparent';el.style.background=el.getAttribute('data-wf-id')===id?'rgba(99,131,255,.08)':'';});};

window.wfSetFilter=function(f,btn){_curFilter=f;document.querySelectorAll('.wf-filter-btn').forEach(function(b){b.classList.remove('bg-primary-600','text-white');b.classList.add('bg-slate-100','dark:bg-slate-800','text-slate-600','dark:text-slate-400');});btn.classList.remove('bg-slate-100','dark:bg-slate-800','text-slate-600','dark:text-slate-400');btn.classList.add('bg-primary-600','text-white');_renderList();};

window.wfDeleteManual=function(id){var _t=typeof t==='function'?t:function(k){return k};var w=WF_MANUAL.find(function(x){return x.id===id});if(!w||!confirm(_t('infra_delete_confirm')+' "'+w.titre+'"?'))return;WF_MANUAL.splice(WF_MANUAL.indexOf(w),1);_toast(_t('infra_deleted'));_selId=null;wfRefresh();};

window.wfOpenAddModal=function(){var _t=typeof t==='function'?t:function(k){return k};var mc=document.getElementById('wf-modal-container');if(!mc)return;mc.innerHTML='<div style="position:fixed;inset:0;background:rgba(10,15,50,.5);backdrop-filter:blur(3px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px" onclick="if(event.target===this)wfCloseModal()"><div style="background:var(--doc-surface,#fff);border-radius:16px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(10,15,50,.25)"><div style="padding:20px 24px 16px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center"><span style="font-size:15px;font-weight:700;color:var(--doc-text,#1e293b)">'+_t('wf_modal_title')+'</span><button onclick="wfCloseModal()" style="background:none;border:none;font-size:18px;cursor:pointer;color:#94a3b8">✕</button></div><div style="padding:20px 24px;display:grid;grid-template-columns:1fr 1fr;gap:14px"><div style="grid-column:span 2"><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('infra_name')+' *</label><input id="wf-add-titre" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;box-sizing:border-box;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)"></div><div><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('wf_modal_type')+'</label><select id="wf-add-type" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)"><option value="autorisation">'+_t('wf_modal_type_auth')+'</option><option value="budget">'+_t('wf_modal_type_budget')+'</option><option value="convention">'+_t('wf_modal_type_convention')+'</option></select></div><div><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('wf_modal_submitted_by')+'</label><input id="wf-add-par" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;box-sizing:border-box;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)" value="'+(localStorage.getItem('userEmail')||'')+'"></div><div style="grid-column:span 2"><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('wf_modal_description')+'</label><textarea id="wf-add-desc" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;min-height:70px;box-sizing:border-box;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)"></textarea></div></div><div style="padding:14px 24px;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:8px"><button onclick="wfCloseModal()" style="padding:8px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:transparent;color:var(--doc-text,#1e293b)">'+_t('cancel')+'</button><button onclick="wfSubmitAdd()" style="padding:8px 16px;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:#1A237E;color:#fff">'+_t('wf_modal_submit')+'</button></div></div></div>';};
window.wfCloseModal=function(){var mc=document.getElementById('wf-modal-container');if(mc)mc.innerHTML='';};
window.wfSubmitAdd=function(){var _t=typeof t==='function'?t:function(k){return k};var titre=(document.getElementById('wf-add-titre')||{}).value||'';if(!titre.trim()){_toast('⚠ '+_t('wf_title_required'));return;}WF_MANUAL.push({id:_nxId(),titre:titre,type:(document.getElementById('wf-add-type')||{}).value||'autorisation',desc:(document.getElementById('wf-add-desc')||{}).value||'',soumis_par:(document.getElementById('wf-add-par')||{}).value||'',date_soumis:new Date().toISOString().split('T')[0],statut:'soumis',commentaire:''});wfCloseModal();_toast('✓ '+_t('wf_submitted'));wfRefresh();};

function _renderList(){
  var _t=typeof t==='function'?t:function(k){return k};
  var items=_getAll(_curFilter);var c=document.getElementById('wf-items-list');if(!c)return;
  if(!items.length){c.innerHTML='<div style="text-align:center;padding:40px;color:#94a3b8"><p style="font-size:13px">'+_t('no_results')+'</p></div>';return;}
  c.innerHTML=items.map(function(item){
    return'<div class="wf-item-row" data-wf-id="'+item.id+'" onclick="wfSelectItem(\''+item.id+'\')" style="padding:14px 16px;border-bottom:1px solid #e2e8f0;border-left:3px solid transparent;cursor:pointer;transition:all .15s'+(_selId===item.id?';border-left-color:#1A237E;background:rgba(99,131,255,.08)':'')+'"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">'+_srcLabel(item.source)+_typeBadge(item.type)+(item.conflit?'<span style="background:#FFEBEE;color:#B71C1C;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600">⚠ '+_t('conflict_detected')+'</span>':'')+(item.classification?'<span style="background:#f1f5f9;color:#475569;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600">Cl.'+item.classification+'</span>':'')+'</div><p style="font-weight:600;font-size:13px;color:var(--doc-text,#1e293b);margin:0">'+item.titre+'</p><p style="font-size:12px;color:#94a3b8;margin:3px 0 0">'+item.desc+'</p><p style="font-size:11px;color:#94a3b8;margin:2px 0 0">'+_t('submitted_by')+' '+item.soumis_par+' · '+item.date_soumis+'</p></div>'+_sBadge(item.statut)+'</div></div>';
  }).join('');
}

function _renderChain(item){
  var _t=typeof t==='function'?t:function(k){return k};
  var steps;
  if(item.statut==='valide_national'||item.statut==='valide')steps=[{l:_t('wf_chain_submit'),s:'done'},{l:_t('wf_chain_regional'),s:'done'},{l:_t('wf_chain_national'),s:'done'},{l:_t('wf_chain_publish'),s:'done'}];
  else if(item.statut==='valide_regional')steps=[{l:_t('wf_chain_submit'),s:'done'},{l:_t('wf_chain_regional'),s:'done'},{l:_t('wf_chain_national'),s:'active'},{l:_t('wf_chain_publish'),s:'wait'}];
  else if(item.statut==='rejete')steps=[{l:_t('wf_chain_submit'),s:'done'},{l:_t('wf_chain_rejected'),s:'rejected'}];
  else steps=[{l:_t('wf_chain_submit'),s:'done'},{l:_t('wf_chain_regional'),s:'active'},{l:_t('wf_chain_national'),s:'wait'},{l:_t('wf_chain_publish'),s:'wait'}];
  return'<div style="display:flex;flex-direction:column;gap:0">'+steps.map(function(st){var dot=st.s==='done'?'✓':st.s==='active'?'◉':st.s==='rejected'?'✗':'○';var bg=st.s==='done'?'#E8F5E9':st.s==='active'?'#E8EAF6':st.s==='rejected'?'#FFEBEE':'#f1f5f9';var clr=st.s==='done'?'#1B5E20':st.s==='active'?'#1A237E':st.s==='rejected'?'#B71C1C':'#94a3b8';return'<div style="display:flex;gap:10px;padding:6px 0;align-items:center"><div style="width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;background:'+bg+';color:'+clr+';border:1.5px solid '+clr+';flex-shrink:0">'+dot+'</div><span style="font-size:12px;font-weight:500;color:'+clr+'">'+st.l+'</span></div>';}).join('')+'</div>';
}

function _renderDetail(){
  var _t=typeof t==='function'?t:function(k){return k};
  var panel=document.getElementById('wf-detail-panel');if(!panel)return;
  if(!_selId){panel.innerHTML='<div style="text-align:center;padding:48px 20px;color:#94a3b8"><svg style="margin:0 auto 8px" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg><p style="font-size:13px">'+_t('wf_select_item')+'</p></div>';return;}
  var item=_getAll().find(function(x){return x.id===_selId});if(!item)return;
  var isPending=item.statut==='soumis',isManual=item.source==='manual';
  panel.innerHTML='<div style="padding:16px"><div style="margin-bottom:14px"><div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">'+_srcLabel(item.source)+_typeBadge(item.type)+'</div><h3 style="font-size:15px;font-weight:700;color:var(--doc-text,#1e293b);margin:0">'+item.titre+'</h3><p style="font-size:12px;color:#94a3b8;margin:4px 0 0">'+item.desc+'</p></div>'
  +'<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #f1f5f9"><span style="color:#94a3b8">'+_t('status')+'</span>'+_sBadge(item.statut)+'</div><div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #f1f5f9"><span style="color:#94a3b8">'+_t('submitted_by')+'</span><span style="font-weight:500;color:var(--doc-text,#1e293b)">'+item.soumis_par+'</span></div><div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#94a3b8">'+_t('date')+'</span><span style="font-weight:500;font-family:monospace;color:var(--doc-text,#1e293b)">'+item.date_soumis+'</span></div>'+(item.classification?'<div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-top:1px solid #f1f5f9"><span style="color:#94a3b8">'+_t('doc_classif_label')+'</span><span style="font-weight:700;color:#1A237E">'+item.classification+'/9</span></div>':'')+'</div>'
  +'<div style="margin-bottom:14px"><p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8;margin-bottom:8px">'+_t('wf_chain_title')+'</p>'+_renderChain(item)+'</div>'
  +(isPending?'<div style="margin-bottom:12px"><label style="font-size:12px;font-weight:600;color:#475569;display:block;margin-bottom:4px">'+_t('wf_comment_label')+'</label><textarea id="wf-comment" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:13px;min-height:60px;box-sizing:border-box;background:var(--doc-surface,#fff);color:var(--doc-text,#1e293b)" placeholder="'+_t('wf_comment_placeholder')+'"></textarea></div>':'')
  +(isPending?'<div style="display:flex;gap:8px;margin-bottom:8px"><button onclick="wfApprove(\''+item.id+'\')" style="flex:1;padding:10px;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;background:#16a34a;color:#fff;display:flex;align-items:center;justify-content:center;gap:6px"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'+_t('wf_approve')+'</button><button onclick="wfReject(\''+item.id+'\')" style="flex:1;padding:10px;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;background:#dc2626;color:#fff;display:flex;align-items:center;justify-content:center;gap:6px"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'+_t('wf_reject')+'</button></div><button onclick="wfRequestChanges(\''+item.id+'\')" style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:transparent;color:var(--doc-text,#475569)">↻ '+_t('wf_request_changes')+'</button>':'')
  +(isManual&&!isPending?'<button onclick="wfDeleteManual(\''+item.id+'\')" style="width:100%;padding:8px;border:1px solid #fecaca;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:#FFF5F5;color:#dc2626;margin-top:8px">'+_t('infra_delete')+'</button>':'')
  +'</div>';
}

window.wfRefresh=function(){
  var _t=typeof t==='function'?t:function(k){return k};
  _renderList();_renderDetail();
  var all=_getAll(),pending=all.filter(function(i){return i.statut==='soumis'}).length,approved=all.filter(function(i){return i.statut==='valide'||i.statut==='valide_national'||i.statut==='valide_regional'}).length,rejected=all.filter(function(i){return i.statut==='rejete'}).length;
  var el;
  el=document.getElementById('wf-kpi-total');if(el)el.textContent=all.length;
  el=document.getElementById('wf-kpi-pending');if(el)el.textContent=pending;
  el=document.getElementById('wf-kpi-approved');if(el)el.textContent=approved;
  el=document.getElementById('wf-kpi-rejected');if(el)el.textContent=rejected;
};

if(typeof PAGES!=='undefined'){
PAGES.workflow={
  get title(){return typeof t==='function'?t('nav_workflow'):'Workflow';},
  get subtitle(){return typeof t==='function'?t('wf_connected_subtitle'):'Validation multi-niveaux';},
  get content(){
    var _t=typeof t==='function'?t:function(k){return k};
    var all=_getAll(),pending=all.filter(function(i){return i.statut==='soumis'}).length,approved=all.filter(function(i){return i.statut==='valide'||i.statut==='valide_national'||i.statut==='valide_regional'}).length,rejected=all.filter(function(i){return i.statut==='rejete'}).length;
    _selId=null;_curFilter='all';
    return'<div id="wf-modal-container"></div>'
    +'<div style="background:var(--doc-surface-2,#f8fafc);border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:16px"><h3 style="font-weight:600;font-size:14px;color:var(--doc-text,#1e293b);margin:0 0 12px">'+_t('wf_process_title')+'</h3><div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">'+[{n:1,l:_t('wf_process_step1'),s:_t('wf_process_step1_sub')},{n:2,l:_t('wf_process_step2'),s:_t('wf_process_step2_sub')},{n:3,l:_t('wf_process_step3'),s:_t('wf_process_step3_sub')},{n:4,l:_t('wf_process_step4'),s:_t('wf_process_step4_sub')}].map(function(st,i){var isA=i===2;return'<div style="display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:8px;border:'+(isA?'2px solid #f59e0b;background:#FFF3E0':'1px solid #e2e8f0;background:var(--doc-surface,#fff)')+'"><span style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;'+(isA?'background:#f59e0b;color:#fff':'background:#f1f5f9;color:#475569')+'">'+st.n+'</span><div><div style="font-size:12px;font-weight:600;color:var(--doc-text,#1e293b)">'+st.l+'</div><div style="font-size:10px;color:#94a3b8">'+st.s+'</div></div></div>'+(i<3?'<svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>':'');}).join('')+'</div></div>'
    +'<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl p-4 border text-center"><p class="text-2xl font-bold text-primary-600" id="wf-kpi-total">'+all.length+'</p><p class="text-xs text-slate-500 mt-1">'+_t('wf_kpi_total')+'</p></div>'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl p-4 border border-amber-200 text-center"><p class="text-2xl font-bold text-amber-600" id="wf-kpi-pending">'+pending+'</p><p class="text-xs text-slate-500 mt-1">'+_t('wf_kpi_pending')+'</p></div>'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl p-4 border text-center"><p class="text-2xl font-bold text-green-600" id="wf-kpi-approved">'+approved+'</p><p class="text-xs text-slate-500 mt-1">'+_t('wf_kpi_approved')+'</p></div>'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl p-4 border text-center"><p class="text-2xl font-bold text-red-600" id="wf-kpi-rejected">'+rejected+'</p><p class="text-xs text-slate-500 mt-1">'+_t('wf_kpi_rejected')+'</p></div>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:1fr 380px;gap:16px">'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl border overflow-hidden"><div style="padding:12px 16px;border-bottom:1px solid #e2e8f0;display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:space-between"><div style="display:flex;gap:4px;flex-wrap:wrap">'
    +'<button class="wf-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 text-white" onclick="wfSetFilter(\'all\',this)">'+_t('wf_filter_all')+' ('+all.length+')</button>'
    +'<button class="wf-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" onclick="wfSetFilter(\'pending\',this)">'+_t('wf_filter_pending')+' ('+pending+')</button>'
    +'<button class="wf-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" onclick="wfSetFilter(\'approved\',this)">'+_t('wf_filter_approved')+'</button>'
    +'<button class="wf-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" onclick="wfSetFilter(\'rejected\',this)">'+_t('wf_filter_rejected')+'</button>'
    +'</div><button onclick="wfOpenAddModal()" style="padding:6px 14px;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:#1A237E;color:#fff;display:flex;align-items:center;gap:6px"><svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>'+_t('wf_new_request')+'</button></div><div id="wf-items-list" style="max-height:500px;overflow-y:auto"></div></div>'
    +'<div class="bg-white dark:bg-slate-850 rounded-xl border overflow-hidden"><div style="padding:14px 16px;border-bottom:1px solid #e2e8f0"><h3 style="font-size:14px;font-weight:600;color:var(--doc-text,#1e293b);margin:0">'+_t('wf_detail_title')+'</h3></div><div id="wf-detail-panel"></div></div>'
    +'</div>'
    +'<script>setTimeout(function(){if(typeof wfRefresh==="function")wfRefresh();},50);<\/script>';
  }
};
}
})();