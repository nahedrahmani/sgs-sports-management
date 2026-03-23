// ============================================================
// REPORT MODULE with Translation Keys
// ============================================================

function repT(key) {
  if (typeof t === 'function') return t(key);
  if (typeof TRANSLATIONS !== 'undefined') {
    const lang = localStorage.getItem('sgs-lang') || 'fr';
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;
  }
  return key;
}

(function injectReportStyles() {
  if (document.getElementById('rep-module-styles')) return;
  const s = document.createElement('style');
  s.id = 'rep-module-styles';
  s.textContent = `
    :root {
      --rep-navy:         #1A237E;
      --rep-navy-dark:    #283593;
      --rep-green:        #1B5E20;
      --rep-green-light:  #E8F5E9;
      --rep-amber:        #E65100;
      --rep-amber-light:  #FFF3E0;
      --rep-red:          #B71C1C;
      --rep-red-light:    #FFEBEE;
      --rep-blue-pale:    #E8EAF6;
      --rep-purple:       #4527A0;
      --rep-purple-light: #EDE7F6;
      --rep-cyan:         #006064;
      --rep-cyan-light:   #E0F7FA;
      --rep-surface:      #ffffff;
      --rep-surface-2:    #f8fafc;
      --rep-surface-3:    #f1f5f9;
      --rep-border:       #e2e8f0;
      --rep-text:         #1e293b;
      --rep-text-2:       #475569;
      --rep-text-3:       #94a3b8;
    }
    html.dark {
      --rep-surface:      #1e293b;
      --rep-surface-2:    #0f172a;
      --rep-surface-3:    #1a2744;
      --rep-border:       #334155;
      --rep-text:         #e2e8f0;
      --rep-text-2:       #94a3b8;
      --rep-text-3:       #64748b;
      --rep-green:        #4ade80;
      --rep-green-light:  rgba(74,222,128,.12);
      --rep-amber:        #fb923c;
      --rep-amber-light:  rgba(251,146,60,.13);
      --rep-blue-pale:    rgba(99,131,255,.18);
      --rep-purple:       #a78bfa;
      --rep-purple-light: rgba(167,139,250,.15);
      --rep-red:          #f87171;
      --rep-red-light:    rgba(248,113,113,.13);
      --rep-cyan:         #22d3ee;
      --rep-cyan-light:   rgba(34,211,238,.12);
    }

    .rep-wrap { background:var(--rep-surface); border-radius:14px; border:1px solid var(--rep-border); overflow:hidden; }
    .rep-tabs { display:flex; gap:2px; padding:16px 20px 0; background:var(--rep-surface-2); border-bottom:1px solid var(--rep-border); overflow-x:auto; }
    .rep-tab  { padding:10px 18px; border-radius:8px 8px 0 0; border:none; background:transparent; font-size:13px; font-weight:500; color:var(--rep-text-3); cursor:pointer; white-space:nowrap; transition:all .15s; border-bottom:3px solid transparent; margin-bottom:-1px; }
    .rep-tab:hover  { color:var(--rep-text-2); background:var(--rep-surface-3); }
    .rep-tab.active { color:var(--rep-navy); font-weight:700; border-bottom-color:var(--rep-navy); background:var(--rep-surface); }
    html.dark .rep-tab.active { color:#93b4ff; border-bottom-color:#93b4ff; }
    .rep-panel { display:none; padding:20px; }
    .rep-panel.active { display:block; }
    .rep-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px; }
    .rep-toolbar-left { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
    .rep-title { font-size:16px; font-weight:700; color:var(--rep-text); }
    .rep-sub { font-size:12px; color:var(--rep-text-3); margin-top:2px; }
    .rep-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; border:none; font-size:12px; font-weight:600; cursor:pointer; transition:all .15s; }
    .rep-btn-primary  { background:var(--rep-navy); color:#fff; }
    .rep-btn-primary:hover { background:var(--rep-navy-dark); }
    .rep-btn-outline  { background:transparent; color:var(--rep-text-2); border:1px solid var(--rep-border); }
    .rep-btn-outline:hover { background:var(--rep-surface-3); }
    .rep-btn-green    { background:var(--rep-green-light); color:var(--rep-green); border:1px solid var(--rep-green); }
    .rep-btn-amber    { background:var(--rep-amber-light); color:var(--rep-amber); border:1px solid var(--rep-amber); }
    .rep-btn-purple   { background:var(--rep-purple-light); color:var(--rep-purple); border:1px solid var(--rep-purple); }
    .rep-btn-sm { padding:5px 10px; font-size:11px; }
    .rep-select { padding:7px 12px; border-radius:8px; border:1px solid var(--rep-border); background:var(--rep-surface); color:var(--rep-text); font-size:12px; outline:none; }
    .rep-select:focus { border-color:var(--rep-navy); }
    .rep-kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin-bottom:20px; }
    .rep-kpi  { background:var(--rep-surface); border:1px solid var(--rep-border); border-radius:12px; padding:14px 16px; }
    .rep-kpi:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(26,35,126,.08); transition:all .18s; }
    .rep-kpi-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
    .rep-kpi-n { font-size:24px; font-weight:800; line-height:1; }
    .rep-kpi-label { font-size:11px; color:var(--rep-text-3); margin-top:3px; }
    .rep-kpi-trend { font-size:11px; margin-top:4px; display:flex; align-items:center; gap:3px; }
    .rep-chart-card { background:var(--rep-surface); border:1px solid var(--rep-border); border-radius:12px; padding:18px; }
    .rep-chart-title { font-size:13px; font-weight:700; color:var(--rep-text); margin-bottom:4px; }
    .rep-chart-sub { font-size:11px; color:var(--rep-text-3); margin-bottom:14px; }
    .rep-table-wrap { overflow-x:auto; border-radius:10px; border:1px solid var(--rep-border); }
    .rep-table { width:100%; border-collapse:collapse; font-size:13px; }
    .rep-table th { padding:10px 14px; text-align:left; background:var(--rep-surface-2); font-size:11px; font-weight:700; color:var(--rep-text-3); text-transform:uppercase; letter-spacing:.04em; border-bottom:1px solid var(--rep-border); white-space:nowrap; }
    .rep-table td { padding:10px 14px; border-bottom:1px solid var(--rep-border); color:var(--rep-text); vertical-align:middle; }
    .rep-table tr:last-child td { border-bottom:none; }
    .rep-table tr:hover td { background:var(--rep-surface-3); }
    .rep-progress-bg { width:100%; background:var(--rep-surface-3); border-radius:999px; height:6px; }
    .rep-progress-fill { height:6px; border-radius:999px; transition:width 1s cubic-bezier(.4,0,.2,1); }
    .rep-predict-card { border-radius:12px; padding:16px; border:1px solid; }
    .rep-badge { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:600; }
    .rep-export-row { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid var(--rep-border); background:var(--rep-surface); transition:background .12s; }
    .rep-export-row:last-child { border-bottom:none; }
    .rep-export-row:hover { background:var(--rep-surface-2); }
    .rep-sig-overlay { position:fixed; inset:0; background:rgba(10,15,50,.5); backdrop-filter:blur(3px); z-index:300; display:flex; align-items:center; justify-content:center; padding:20px; }
    .rep-sig-modal { background:var(--rep-surface); border-radius:16px; width:100%; max-width:500px; box-shadow:0 24px 64px rgba(10,15,50,.25); overflow:hidden; }
    .rep-sig-canvas { border:2px dashed var(--rep-border); border-radius:10px; background:var(--rep-surface-2); cursor:crosshair; display:block; width:100%; touch-action:none; }
    .rep-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(20px); background:var(--rep-navy); color:#fff; padding:10px 18px; border-radius:10px; font-size:13px; display:flex; align-items:center; gap:8px; z-index:9999; opacity:0; transition:all .3s; pointer-events:none; white-space:nowrap; }
    .rep-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
    .rep-maturity { display:flex; gap:0; border-radius:10px; overflow:hidden; border:1px solid var(--rep-border); margin-bottom:20px; }
    .rep-maturity-step { flex:1; padding:12px 10px; text-align:center; font-size:11px; font-weight:600; border-right:1px solid var(--rep-border); cursor:pointer; transition:all .15s; }
    .rep-maturity-step:last-child { border-right:none; }
    .rep-maturity-step.done   { background:var(--rep-green-light);  color:var(--rep-green); }
    .rep-maturity-step.active { background:var(--rep-blue-pale);    color:var(--rep-navy); }
    .rep-maturity-step.todo   { background:var(--rep-surface-3);    color:var(--rep-text-3); }
    html.dark .rep-maturity-step.active { color:#93b4ff; }
  `;
  document.head.appendChild(s);
})();

// ── State ─────────────────────────────────────────────────────
const REP_STATE = {
  activeTab: 'descriptive',
  selectedReport: null,
  sigSigning: false,
  sigCtx: null,
  sigLastX: 0,
  sigLastY: 0,
};

// ── Mock data ──────────────────────────────────────────────────
const REP_DATA = {
  kpis: {
    total_events:        { n: 247,   trend: '+12%',  up: true  },
    validated_events:    { n: 189,   trend: '+8%',   up: true  },
    active_infra:        { n: 198,   trend: '-2',    up: false },
    pending_validations: { n: 23,    trend: '+5',    up: false },
    avg_occupancy:       { n: '74%', trend: '+3pts', up: true  },
    conflicts_resolved:  { n: 18,    trend: '-4',    up: true  },
  },
  regions: [
    { name: 'Tunis',    events: 62, occupancy: 88, compliance: 95, infra: 48, color: '#1A237E' },
    { name: 'Sfax',     events: 41, occupancy: 76, compliance: 88, infra: 32, color: '#1a88f5' },
    { name: 'Sousse',   events: 38, occupancy: 82, compliance: 91, infra: 29, color: '#22c55e' },
    { name: 'Bizerte',  events: 27, occupancy: 61, compliance: 74, infra: 21, color: '#f59e0b' },
    { name: 'Béja',     events: 19, occupancy: 54, compliance: 68, infra: 18, color: '#ef4444' },
    { name: 'Monastir', events: 31, occupancy: 79, compliance: 85, infra: 24, color: '#a78bfa' },
    { name: 'Gabès',    events: 15, occupancy: 48, compliance: 61, infra: 14, color: '#06b6d4' },
  ],
  federations: [
    { name: 'Football',    events: 89, docs: 312, delay_avg: 1.8, compliance: 96 },
    { name: 'Handball',    events: 43, docs: 148, delay_avg: 2.1, compliance: 91 },
    { name: 'Athlétisme',  events: 37, docs: 124, delay_avg: 1.4, compliance: 98 },
    { name: 'Natation',    events: 28, docs: 96,  delay_avg: 2.8, compliance: 87 },
    { name: 'Basket-ball', events: 31, docs: 108, delay_avg: 2.2, compliance: 89 },
    { name: 'Volleyball',  events: 19, docs: 64,  delay_avg: 3.1, compliance: 82 },
  ],
  delays: [
    { cause: 'Documents incomplets',   count: 34, pct: 38 },
    { cause: 'Conflit infrastructure', count: 22, pct: 24 },
    { cause: 'Validation tardive',     count: 18, pct: 20 },
    { cause: 'Capacité dépassée',      count: 11, pct: 12 },
    { cause: 'Autre',                  count: 5,  pct: 6  },
  ],
  predictions: [
    { label: 'Taux occupation Stade Rades',     value: 87, unit: '%',   horizon: 'Mois prochain', risk: 'high',   icon: '↑' },
    { label: 'Interventions maintenance',       value: 3,  unit: '',    horizon: '30 jours',      risk: 'medium', icon: '⚙' },
    { label: 'Conflits calendrier anticipés',   value: 7,  unit: '',    horizon: 'T2 2026',       risk: 'medium', icon: '!' },
    { label: 'Score conformité prévisionnel',   value: 91, unit: '%',   horizon: 'Fin trimestre', risk: 'low',    icon: '✓' },
    { label: 'Événements haute vigilance',      value: 12, unit: '',    horizon: 'Avril 2026',    risk: 'high',   icon: '●' },
  ],
  prescriptions: [
    { priority: 'critique', title: 'Redistribuer 3 matchs du Stade Rades', desc: 'Saturation prévue à 94% en avril. Déplacer vers Stade Hammadi Agrebi.', impact: 'Réduction 18% surcharge', tag: 'Infrastructure' },
    { priority: 'haute',    title: 'Automatiser les relances de validation', desc: 'Délai moyen validation : 2.4j. Relance automatique J+1 réduirait délai à <1.5j.', impact: '+34% vélocité workflow', tag: 'Workflow' },
    { priority: 'haute',    title: 'Former 2 directions régionales', desc: 'Béja et Gabès sous la moyenne nationale. Renforcer programmation locale.', impact: 'Potentiel +15pts occupation', tag: 'Régions' },
    { priority: 'normale',  title: 'Standardiser templates PV Football', desc: '38% retards dus à documents incomplets. Template unifié réduirait erreurs.', impact: 'Réduction 40% rejets', tag: 'Documents' },
  ],
  reports: [
    { id: 'R001', title: 'Rapport national des activités sportives Q1 2026', type: 'national',   pages: 24, sign: true,  generated: '2026-03-15' },
    { id: 'R002', title: 'Rapport régional — Tunis — Mars 2026',             type: 'regional',   pages: 12, sign: true,  generated: '2026-03-18' },
    { id: 'R003', title: 'Rapport conformité workflow — Fédérations',        type: 'workflow',   pages: 8,  sign: false, generated: '2026-03-20' },
    { id: 'R004', title: 'Statistiques sportives nationales 2025',           type: 'statistics', pages: 31, sign: true,  generated: '2026-03-10' },
    { id: 'R005', title: 'Analyse taux occupation des infrastructures',      type: 'infra',      pages: 16, sign: false, generated: '2026-03-19' },
    { id: 'R006', title: 'Rapport diagnostique conflits T1 2026',            type: 'diagnostic', pages: 9,  sign: false, generated: '2026-03-21' },
  ],
};

// ── Helpers ────────────────────────────────────────────────────
function repToast(msg) {
  let el = document.getElementById('rep-toast');
  if (!el) return;
  el.querySelector('span').textContent = msg;
  clearTimeout(el._t);
  el.classList.add('show');
  el._t = setTimeout(() => el.classList.remove('show'), 2600);
}

function repRiskBadge(risk) {
  const map = {
    high:   `<span class="rep-badge" style="background:var(--rep-red-light);color:var(--rep-red)">${repT('rep_risk_high')}</span>`,
    medium: `<span class="rep-badge" style="background:var(--rep-amber-light);color:var(--rep-amber)">${repT('rep_risk_medium')}</span>`,
    low:    `<span class="rep-badge" style="background:var(--rep-green-light);color:var(--rep-green)">${repT('rep_risk_low')}</span>`,
  };
  return map[risk] || risk;
}

function repPriorityBadge(p) {
  const map = {
    critique: `<span class="rep-badge" style="background:var(--rep-red-light);color:var(--rep-red)">● ${repT('rep_priority_critical')}</span>`,
    haute:    `<span class="rep-badge" style="background:var(--rep-amber-light);color:var(--rep-amber)">● ${repT('rep_priority_high')}</span>`,
    normale:  `<span class="rep-badge" style="background:var(--rep-blue-pale);color:var(--rep-navy)">● ${repT('rep_priority_normal')}</span>`,
  };
  return map[p] || p;
}

function repTypeBadge(type) {
  const map = {
    national:   `<span class="rep-badge" style="background:var(--rep-blue-pale);color:var(--rep-navy)">${repT('rep_type_national')}</span>`,
    regional:   `<span class="rep-badge" style="background:var(--rep-green-light);color:var(--rep-green)">${repT('rep_type_regional')}</span>`,
    workflow:   `<span class="rep-badge" style="background:var(--rep-amber-light);color:var(--rep-amber)">${repT('rep_type_workflow')}</span>`,
    statistics: `<span class="rep-badge" style="background:var(--rep-purple-light);color:var(--rep-purple)">${repT('rep_type_statistics')}</span>`,
    infra:      `<span class="rep-badge" style="background:var(--rep-cyan-light);color:var(--rep-cyan)">${repT('rep_type_infra')}</span>`,
    diagnostic: `<span class="rep-badge" style="background:var(--rep-red-light);color:var(--rep-red)">${repT('rep_type_diagnostic')}</span>`,
  };
  return map[type] || type;
}

function _repRole()       { return localStorage.getItem('userRole')       || 'participant'; }
function _repRegion()     { return localStorage.getItem('userRegion')     || ''; }
function _repFederation() { return localStorage.getItem('userFederation') || ''; }
function _repCanGenerate(){ return ['super_admin','national_admin','regional_manager'].includes(_repRole()); }
function _repCanDelete()  { return ['super_admin','national_admin'].includes(_repRole()); }
function _repCanSign()    { return ['super_admin','national_admin','regional_manager'].includes(_repRole()); }
function _repCanDownload(){ return _repRole() !== 'participant'; }

function _repVisibleReports() {
  const role = _repRole();
  if (['super_admin','national_admin'].includes(role)) return REP_DATA.reports;
  if (role === 'regional_manager') return REP_DATA.reports.filter(r => ['regional','national','statistics'].includes(r.type));
  if (role === 'federation')       return REP_DATA.reports.filter(r => ['statistics','workflow'].includes(r.type));
  return [];
}

// ── Main render ────────────────────────────────────────────────
function renderReportModule() {
  const role = _repRole();

  if (role === 'participant') {
    return `
    <div id="rep-toast" class="rep-toast"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span></span></div>
    <div style="text-align:center;padding:80px 20px;background:var(--rep-surface);border-radius:14px;border:1px solid var(--rep-border)">
      <div style="width:56px;height:56px;border-radius:14px;background:var(--rep-red-light);display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
        <svg width="24" height="24" fill="none" stroke="var(--rep-red)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
      </div>
      <div style="font-size:15px;font-weight:700;color:var(--rep-text)">${repT('rep_access_denied')}</div>
      <div style="font-size:12px;color:var(--rep-text-3);margin-top:6px">${repT('rep_access_denied_desc')}</div>
    </div>`;
  }

  const fedOnly = role === 'federation';
  return `
  <div id="rep-toast" class="rep-toast">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <span></span>
  </div>

  <div class="rep-wrap">
    <nav class="rep-tabs">
      ${!fedOnly ? `
      <button class="rep-tab active" onclick="repSwitchTab('descriptive',this)">${repT('rep_tab_descriptive')}</button>
      <button class="rep-tab" onclick="repSwitchTab('diagnostic',this)">${repT('rep_tab_diagnostic')}</button>
      <button class="rep-tab" onclick="repSwitchTab('predictive',this)">${repT('rep_tab_predictive')}</button>
      <button class="rep-tab" onclick="repSwitchTab('prescriptive',this)">${repT('rep_tab_prescriptive')}</button>
      ` : ``}
      <button class="rep-tab ${fedOnly ? 'active' : ''}" onclick="repSwitchTab('export',this)">${repT('rep_tab_export')}</button>
    </nav>

    ${!fedOnly ? `
    <div id="rep-panel-descriptive"  class="rep-panel active">${renderDescriptive()}</div>
    <div id="rep-panel-diagnostic"   class="rep-panel">${renderDiagnostic()}</div>
    <div id="rep-panel-predictive"   class="rep-panel">${renderPredictive()}</div>
    <div id="rep-panel-prescriptive" class="rep-panel">${renderPrescriptive()}</div>
    ` : ``}
    <div id="rep-panel-export" class="rep-panel ${fedOnly ? 'active' : ''}">${renderExport()}</div>
  </div>

  <div id="rep-sig-container"></div>
  `;
}

// ── Tab 1 — Descriptive ────────────────────────────────────────
function renderDescriptive() {
  const k = REP_DATA.kpis;
  return `
  <div class="rep-toolbar">
    <div>
      <div class="rep-title">${repT('rep_descriptive_title')}</div>
      <div class="rep-sub">${repT('rep_descriptive_sub')}</div>
    </div>
    <div style="display:flex;gap:8px">
      <select class="rep-select" onchange="repFilterPeriod(this.value)">
        <option value="q1">${repT('rep_period_q1')}</option>
        <option value="q4">${repT('rep_period_q4')}</option>
        <option value="year">${repT('rep_period_year')}</option>
      </select>
      <button class="rep-btn rep-btn-outline rep-btn-sm" onclick="repExportQuick('descriptive')">
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        ${repT('rep_export')}
      </button>
    </div>
  </div>

  <div class="rep-maturity">
    <div class="rep-maturity-step done"   onclick="repSwitchTab('descriptive',document.querySelector('.rep-tab'))">1 · ${repT('rep_maturity_desc')} ✓</div>
    <div class="rep-maturity-step done"   onclick="repSwitchTab('diagnostic',document.querySelectorAll('.rep-tab')[1])">2 · ${repT('rep_maturity_diag')} ✓</div>
    <div class="rep-maturity-step active" onclick="repSwitchTab('predictive',document.querySelectorAll('.rep-tab')[2])">3 · ${repT('rep_maturity_pred')} ●</div>
    <div class="rep-maturity-step todo"   onclick="repSwitchTab('prescriptive',document.querySelectorAll('.rep-tab')[3])">4 · ${repT('rep_maturity_pres')}</div>
  </div>

  <div class="rep-kpis">
    ${[
      { n: k.total_events.n,        label: repT('rep_kpi_total_events'),        bg: 'var(--rep-blue-pale)',   tc: 'var(--rep-navy)',   trend: k.total_events.trend,        up: k.total_events.up,        icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { n: k.validated_events.n,    label: repT('rep_kpi_validated_events'),    bg: 'var(--rep-green-light)', tc: 'var(--rep-green)',  trend: k.validated_events.trend,    up: k.validated_events.up,    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      { n: k.active_infra.n,        label: repT('rep_kpi_active_infra'),        bg: 'var(--rep-cyan-light)',  tc: 'var(--rep-cyan)',   trend: k.active_infra.trend,        up: k.active_infra.up,        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1' },
      { n: k.pending_validations.n, label: repT('rep_kpi_pending_validations'), bg: 'var(--rep-amber-light)', tc: 'var(--rep-amber)',  trend: k.pending_validations.trend, up: k.pending_validations.up, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
      { n: k.avg_occupancy.n,       label: repT('rep_kpi_avg_occupancy'),       bg: 'var(--rep-purple-light)',tc: 'var(--rep-purple)', trend: k.avg_occupancy.trend,       up: k.avg_occupancy.up,       icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14' },
      { n: k.conflicts_resolved.n,  label: repT('rep_kpi_conflicts_resolved'),  bg: 'var(--rep-red-light)',   tc: 'var(--rep-red)',    trend: k.conflicts_resolved.trend,  up: k.conflicts_resolved.up,  icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    ].map(k => `
      <div class="rep-kpi">
        <div class="rep-kpi-icon" style="background:${k.bg}">
          <svg width="18" height="18" fill="none" stroke="${k.tc}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${k.icon}"/></svg>
        </div>
        <div class="rep-kpi-n" style="color:${k.tc}">${k.n}</div>
        <div class="rep-kpi-label">${k.label}</div>
        <div class="rep-kpi-trend" style="color:${k.up?'var(--rep-green)':'var(--rep-red)'}">
          ${k.up ? '▲' : '▼'} ${k.trend}
        </div>
      </div>
    `).join('')}
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
    <div class="rep-chart-card">
      <div class="rep-chart-title">${repT('rep_chart_events_by_region')}</div>
      <div class="rep-chart-sub">${repT('rep_chart_events_by_region_sub')}</div>
      <div style="height:200px"><canvas id="rep-chart-region"></canvas></div>
    </div>
    <div class="rep-chart-card">
      <div class="rep-chart-title">${repT('rep_chart_occupancy')}</div>
      <div class="rep-chart-sub">${repT('rep_chart_occupancy_sub')}</div>
      <div style="height:200px"><canvas id="rep-chart-occ"></canvas></div>
    </div>
  </div>

  <div class="rep-chart-card">
    <div class="rep-chart-title" style="margin-bottom:14px">${repT('rep_compliance_by_region')}</div>
    <div class="rep-table-wrap">
      <table class="rep-table">
        <thead><tr><th>${repT('rep_region')}</th><th>${repT('rep_events')}</th><th>${repT('rep_occupancy_rate')}</th><th>${repT('rep_compliance')}</th><th>${repT('rep_infrastructure')}</th></tr></thead>
        <tbody>
          ${REP_DATA.regions.map(r => `
            <tr>
              <td><div style="display:flex;align-items:center;gap:8px"><span style="width:10px;height:10px;border-radius:50%;background:${r.color};flex-shrink:0"></span><span style="font-weight:600">${r.name}</span></div></td>
              <td style="font-weight:700;color:var(--rep-navy)">${r.events}</td>
              <td><div style="display:flex;align-items:center;gap:8px"><div class="rep-progress-bg" style="width:80px"><div class="rep-progress-fill" style="width:${r.occupancy}%;background:${r.occupancy>=80?'var(--rep-green)':r.occupancy>=60?'var(--rep-amber)':'var(--rep-red)'}"></div></div><span style="font-size:12px;font-weight:600">${r.occupancy}%</span></div></td>
              <td><div style="display:flex;align-items:center;gap:8px"><div class="rep-progress-bg" style="width:80px"><div class="rep-progress-fill" style="width:${r.compliance}%;background:${r.compliance>=85?'var(--rep-green)':r.compliance>=70?'var(--rep-amber)':'var(--rep-red)'}"></div></div><span style="font-size:12px;font-weight:600">${r.compliance}%</span></div></td>
              <td style="font-size:12px;color:var(--rep-text-2)">${r.infra}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `;
}

// ── Tab 2 — Diagnostic ─────────────────────────────────────────
function renderDiagnostic() {
  return `
  <div class="rep-toolbar">
    <div>
      <div class="rep-title">${repT('rep_diagnostic_title')}</div>
      <div class="rep-sub">${repT('rep_diagnostic_sub')}</div>
    </div>
    <button class="rep-btn rep-btn-outline rep-btn-sm" onclick="repExportQuick('diagnostic')">
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
      ${repT('rep_export')}
    </button>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
    <div class="rep-chart-card">
      <div class="rep-chart-title">${repT('rep_delay_causes')}</div>
      <div class="rep-chart-sub">${repT('rep_delay_causes_sub')}</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
        ${REP_DATA.delays.map((d, i) => {
          const colors = ['var(--rep-red)','var(--rep-amber)','var(--rep-purple)','var(--rep-cyan)','var(--rep-text-3)'];
          return `
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px">
              <span style="color:var(--rep-text-2)">${repT('rep_cause_' + d.cause.replace(/ /g, '_').toLowerCase()) || d.cause}</span>
              <span style="font-weight:700;color:${colors[i]}">${d.pct}% (${d.count})</span>
            </div>
            <div class="rep-progress-bg"><div class="rep-progress-fill" style="width:${d.pct}%;background:${colors[i]}"></div></div>
          </div>`;
        }).join('')}
      </div>
    </div>
    <div class="rep-chart-card">
      <div class="rep-chart-title">${repT('rep_validation_delay_by_fed')}</div>
      <div class="rep-chart-sub">${repT('rep_validation_delay_sub')}</div>
      <div style="height:200px"><canvas id="rep-chart-delay"></canvas></div>
    </div>
  </div>

  <div class="rep-chart-card">
    <div class="rep-chart-title" style="margin-bottom:14px">${repT('rep_performance_by_federation')}</div>
    <div class="rep-table-wrap">
      <table class="rep-table">
        <thead><tr><th>${repT('rep_federation')}</th><th>${repT('rep_events')}</th><th>${repT('rep_documents_generated')}</th><th>${repT('rep_avg_delay')}</th><th>${repT('rep_compliance')}</th><th>${repT('rep_diagnostic')}</th></tr></thead>
        <tbody>
          ${REP_DATA.federations.map(f => {
            const diagColor = f.compliance >= 90 ? 'var(--rep-green)' : f.compliance >= 80 ? 'var(--rep-amber)' : 'var(--rep-red)';
            const diagLabel = f.compliance >= 90 ? repT('rep_compliant') : f.compliance >= 80 ? repT('rep_partial') : repT('rep_to_improve');
            return `<tr><td style="font-weight:600">${f.name}</td><td style="font-weight:700;color:var(--rep-navy)">${f.events}</td><td style="color:var(--rep-text-2)">${f.docs}</td><td><span style="font-weight:700;color:${f.delay_avg <= 2 ? 'var(--rep-green)' : f.delay_avg <= 3 ? 'var(--rep-amber)' : 'var(--rep-red)'}">${f.delay_avg}j</span></td><td><div style="display:flex;align-items:center;gap:6px"><div class="rep-progress-bg" style="width:60px"><div class="rep-progress-fill" style="width:${f.compliance}%;background:${f.compliance>=90?'var(--rep-green)':f.compliance>=80?'var(--rep-amber)':'var(--rep-red)'}"></div></div><span style="font-size:11px;font-weight:600">${f.compliance}%</span></div></td><td><span style="font-size:11px;font-weight:600;color:${diagColor}">${diagLabel}</span></td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>
  `;
}

// ── Tab 3 — Predictive ─────────────────────────────────────────
function renderPredictive() {
  return `
  <div class="rep-toolbar">
    <div>
      <div class="rep-title">${repT('rep_predictive_title')}</div>
      <div class="rep-sub">${repT('rep_predictive_sub')}</div>
    </div>
  </div>

  <div style="background:var(--rep-purple-light);border:1px solid var(--rep-purple);border-radius:10px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:12px">
    <svg width="20" height="20" fill="none" stroke="var(--rep-purple)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
    <div>
      <div style="font-size:13px;font-weight:700;color:var(--rep-purple)">${repT('rep_active_models')}</div>
      <div style="font-size:11px;color:var(--rep-text-2)">${repT('rep_model_desc')}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:20px">
    ${REP_DATA.predictions.map(p => {
      const riskColors = { high: { bg: 'var(--rep-red-light)', border: 'var(--rep-red)', tc: 'var(--rep-red)' }, medium: { bg: 'var(--rep-amber-light)', border: 'var(--rep-amber)', tc: 'var(--rep-amber)' }, low: { bg: 'var(--rep-green-light)', border: 'var(--rep-green)', tc: 'var(--rep-green)' } };
      const c = riskColors[p.risk];
      return `<div class="rep-predict-card" style="background:${c.bg};border-color:${c.border}"><div style="font-size:22px;margin-bottom:8px">${p.icon}</div><div style="font-size:11px;color:var(--rep-text-3);margin-bottom:4px">${repT('rep_horizon_' + p.horizon.replace(/ /g, '_').toLowerCase()) || p.horizon}</div><div style="font-size:26px;font-weight:800;color:${c.tc};line-height:1">${p.value}${p.unit}</div><div style="font-size:12px;font-weight:600;color:var(--rep-text);margin-top:6px">${repT('rep_pred_' + p.label.replace(/ /g, '_').toLowerCase()) || p.label}</div><div style="margin-top:8px">${repRiskBadge(p.risk)}</div></div>`;
    }).join('')}
  </div>

  <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px">
    <div class="rep-chart-card">
      <div class="rep-chart-title">${repT('rep_forecast_6months')}</div>
      <div class="rep-chart-sub">${repT('rep_forecast_sub')}</div>
      <div style="height:220px"><canvas id="rep-chart-predict"></canvas></div>
    </div>
    <div class="rep-chart-card">
      <div class="rep-chart-title">${repT('rep_risk_distribution')}</div>
      <div class="rep-chart-sub">${repT('rep_risk_distribution_sub')}</div>
      <div style="height:220px"><canvas id="rep-chart-risk"></canvas></div>
    </div>
  </div>
  `;
}

// ── Tab 4 — Prescriptive ───────────────────────────────────────
function renderPrescriptive() {
  return `
  <div class="rep-toolbar">
    <div>
      <div class="rep-title">${repT('rep_prescriptive_title')}</div>
      <div class="rep-sub">${repT('rep_prescriptive_sub')}</div>
    </div>
    <button class="rep-btn rep-btn-outline rep-btn-sm" onclick="repExportQuick('prescriptive')">
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
      ${repT('rep_export')}
    </button>
  </div>

  <div style="display:flex;flex-direction:column;gap:12px">
    ${REP_DATA.prescriptions.map((p, i) => `
    <div style="background:var(--rep-surface-2);border:1px solid var(--rep-border);border-left:4px solid ${p.priority==='critique'?'var(--rep-red)':p.priority==='haute'?'var(--rep-amber)':'var(--rep-navy)'};border-radius:10px;padding:16px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:18px;font-weight:800;color:var(--rep-text-3);min-width:24px">${i+1}</span>
          <div>
            <div style="font-weight:700;color:var(--rep-text);font-size:14px">${repT('rep_rec_' + p.title.replace(/ /g, '_').toLowerCase()) || p.title}</div>
            <div style="font-size:12px;color:var(--rep-text-3);margin-top:2px">${repT('rec_desc_' + p.title.replace(/ /g, '_').toLowerCase()) || p.desc}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
          ${repPriorityBadge(p.priority)}
          <span class="rep-badge" style="background:var(--rep-surface-3);color:var(--rep-text-2)">${repT('rec_tag_' + p.tag.toLowerCase()) || p.tag}</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--rep-border)">
        <div style="font-size:12px;color:var(--rep-green);font-weight:600">↑ ${repT('rec_impact_' + p.impact.replace(/ /g, '_').toLowerCase()) || p.impact}</div>
        <div style="display:flex;gap:6px">
          <button class="rep-btn rep-btn-green rep-btn-sm" onclick="repPrescriptionApply(${i})">${repT('rep_apply')}</button>
          <button class="rep-btn rep-btn-outline rep-btn-sm" onclick="repPrescriptionDefer(${i})">${repT('rep_defer')}</button>
        </div>
      </div>
    </div>
    `).join('')}
  </div>
  `;
}

// ── Tab 5 — Export & Signature ─────────────────────────────────
function renderExport() {
  const reports = _repVisibleReports();
  const roleLabel = {
    super_admin:      repT('rep_role_super_admin'),
    national_admin:   repT('rep_role_national_admin'),
    regional_manager: repT('rep_role_regional_manager') + ' — ' + (_repRegion() || repT('rep_your_region')),
    federation:       (_repFederation() || repT('rep_federation')) + ' — ' + repT('rep_consultation_only'),
  }[_repRole()] || _repRole();

  return `
  <div id="rep-new-report-modal-container"></div>
  <div class="rep-toolbar">
    <div>
      <div class="rep-title">${repT('rep_export_title')}</div>
      <div class="rep-sub">${repT('rep_export_sub')}</div>
    </div>
    ${_repCanGenerate() ? `<button class="rep-btn rep-btn-primary" onclick="repOpenGenerateModal()">
      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      ${repT('rep_generate_report')}
    </button>` : ''}
  </div>

  ${reports.length === 0 ? `
  <div style="text-align:center;padding:48px;color:var(--rep-text-3)">
    <div style="font-size:13px">${repT('rep_no_reports')}</div>
  </div>` : `
  <div style="background:var(--rep-surface);border:1px solid var(--rep-border);border-radius:12px;overflow:hidden">
    ${reports.map(r => `
    <div class="rep-export-row">
      <div style="display:flex;align-items:center;gap:14px;flex:1;min-width:0">
        <div style="width:40px;height:40px;border-radius:10px;background:var(--rep-blue-pale);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="18" height="18" fill="none" stroke="var(--rep-navy)" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div style="min-width:0">
          <div style="font-weight:600;color:var(--rep-text);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.title}</div>
          <div style="font-size:11px;color:var(--rep-text-3);margin-top:2px">${r.generated} · ${r.pages} ${repT('rep_pages')}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;margin-left:12px">
        ${repTypeBadge(r.type)}
        ${_repCanDownload() ? `<button class="rep-btn rep-btn-outline rep-btn-sm" onclick="repDownload('${r.id}','pdf')">PDF</button>
        <button class="rep-btn rep-btn-outline rep-btn-sm" onclick="repDownload('${r.id}','excel')">Excel</button>
        <button class="rep-btn rep-btn-outline rep-btn-sm" onclick="repDownload('${r.id}','csv')">CSV</button>` : ''}
        ${r.sign && _repCanSign() ? `<button class="rep-btn rep-btn-green rep-btn-sm" onclick="repOpenSignature('${r.id}','${r.title}')">
          <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          ${repT('rep_sign')}
        </button>` : ''}
        <button class="rep-btn rep-btn-outline rep-btn-sm" onclick="repEditReport('${r.id}')" title="${repT('rep_edit')}">
          <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
        </button>
        ${_repCanDelete() ? `<button class="rep-btn rep-btn-sm" style="background:var(--rep-red-light);color:var(--rep-red);border:1px solid var(--rep-red)" onclick="repDeleteReport('${r.id}')" title="${repT('rep_delete')}">
          <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>` : ''}
      </div>
    </div>
    `).join('')}
  </div>`}
  `;
}

// ── CRUD: Reports ─────────────────────────────────────────────
function _repCloseReportModal() {
  const c = document.getElementById('rep-new-report-modal-container');
  if (c) c.innerHTML = '';
}

function repOpenGenerateModal() {
  const role = _repRole();
  const region = _repRegion();
  const typeOptions = {
    super_admin:      ['national','regional','workflow','statistics','infra','diagnostic'],
    national_admin:   ['national','regional','workflow','statistics','infra','diagnostic'],
    regional_manager: ['regional','workflow','statistics'],
  }[role] || [];
  
  const typeLabels = {
    national: repT('rep_type_national'), regional: repT('rep_type_regional'), 
    workflow: repT('rep_type_workflow'), statistics: repT('rep_type_statistics'),
    infra: repT('rep_type_infra'), diagnostic: repT('rep_type_diagnostic')
  };
  
  const container = document.getElementById('rep-new-report-modal-container');
  if (!container) return;
  
  container.innerHTML = `
  <div class="rep-sig-overlay" onclick="if(event.target===this)_repCloseReportModal()">
    <div class="rep-sig-modal" style="max-width:520px">
      <div style="padding:20px 24px 16px;border-bottom:1px solid var(--rep-border);display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:15px;font-weight:700;color:var(--rep-text)">${repT('rep_generate_modal_title')}</div>
        <button class="rep-btn rep-btn-outline rep-btn-sm" onclick="_repCloseReportModal()">✕</button>
      </div>
      <div style="padding:20px 24px;display:flex;flex-direction:column;gap:14px">
        <div>
          <label style="font-size:12px;font-weight:600;color:var(--rep-text-2);display:block;margin-bottom:4px">${repT('rep_report_type')} *</label>
          <select id="rep-gen-type" class="rep-select" style="width:100%">
            ${typeOptions.map(t => `<option value="${t}">${typeLabels[t]||t}</option>`).join('')}
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <label style="font-size:12px;font-weight:600;color:var(--rep-text-2);display:block;margin-bottom:4px">${repT('rep_period')} *</label>
            <select id="rep-gen-period" class="rep-select" style="width:100%">
              <option>${repT('rep_period_q1')}</option><option>${repT('rep_period_q4')}</option><option>${repT('rep_period_year')}</option><option>${repT('rep_period_march')}</option>
            </select>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;color:var(--rep-text-2);display:block;margin-bottom:4px">${repT('rep_format')}</label>
            <select id="rep-gen-format" class="rep-select" style="width:100%">
              <option value="pdf">PDF/A</option><option value="excel">Excel</option><option value="pdf+excel">PDF + Excel</option>
            </select>
          </div>
        </div>
        ${role === 'regional_manager' ? `
        <div style="background:var(--rep-surface-2);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--rep-text-2)">
          ${repT('rep_scope_regional')} : <strong>${region || repT('rep_your_region')}</strong>
        </div>` : `
        <div>
          <label style="font-size:12px;font-weight:600;color:var(--rep-text-2);display:block;margin-bottom:4px">${repT('rep_scope')}</label>
          <select id="rep-gen-scope" class="rep-select" style="width:100%">
            <option value="national">${repT('rep_scope_national')}</option>
            <option value="Tunis">${repT('rep_region_tunis')}</option><option value="Sfax">${repT('rep_region_sfax')}</option>
            <option value="Football">${repT('rep_fed_football')}</option><option value="Handball">${repT('rep_fed_handball')}</option>
          </select>
        </div>`}
      </div>
      <div style="padding:14px 24px;border-top:1px solid var(--rep-border);display:flex;justify-content:flex-end;gap:8px">
        <button class="rep-btn rep-btn-outline" onclick="_repCloseReportModal()">${repT('rep_cancel')}</button>
        <button class="rep-btn rep-btn-primary" onclick="_repGenerateReport()">
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          ${repT('rep_generate')}
        </button>
      </div>
    </div>
  </div>`;
}

function _repGenerateReport() {
  const type = document.getElementById('rep-gen-type')?.value;
  const period = document.getElementById('rep-gen-period')?.value;
  const scope = document.getElementById('rep-gen-scope')?.value || _repRegion() || repT('rep_national');
  const typeLabels = {
    national: repT('rep_national_activities'), regional: repT('rep_regional'), 
    workflow: repT('rep_workflow_compliance'), statistics: repT('rep_sport_statistics'),
    infra: repT('rep_infra_occupancy'), diagnostic: repT('rep_diagnostic_report')
  };
  const title = `${repT('rep_report')} ${typeLabels[type] || type} — ${scope !== 'national' ? scope + ' — ' : ''}${period}`;
  _repCloseReportModal();
  repToast(repT('rep_generating'));
  setTimeout(() => {
    const newId = 'R' + String(REP_DATA.reports.length + 1).padStart(3, '0');
    REP_DATA.reports.unshift({ 
      id: newId, title, type, 
      sign: ['national', 'regional', 'statistics'].includes(type), 
      pages: Math.floor(Math.random() * 20) + 8, 
      generated: new Date().toISOString().split('T')[0] 
    });
    repSwitchTab('export', null);
    repToast(`✓ "${title.substring(0, 40)}…" ${repT('rep_generated')}`);
  }, 1200);
}

function repEditReport(id) {
  repToast(`${repT('rep_edit')} ${id} — ${repT('rep_coming_soon')}`);
}

function repDeleteReport(id) {
  const r = REP_DATA.reports.find(x => x.id === id);
  if (!r) return;
  if (!confirm(`${repT('rep_delete_confirm')} "${r.title.substring(0, 50)}" ?`)) return;
  REP_DATA.reports = REP_DATA.reports.filter(x => x.id !== id);
  repSwitchTab('export', null);
  repToast(repT('rep_deleted'));
}

// ── Signature modal ────────────────────────────────────────────
function repOpenSignature(id, title) {
  const container = document.getElementById('rep-sig-container');
  if (!container) return;
  container.innerHTML = `
  <div class="rep-sig-overlay" id="rep-sig-overlay" onclick="if(event.target===this)repCloseSignature()">
    <div class="rep-sig-modal">
      <div style="padding:20px 24px 16px;border-bottom:1px solid var(--rep-border);display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--rep-text)">${repT('rep_sign_modal_title')}</div>
          <div style="font-size:11px;color:var(--rep-text-3);margin-top:2px">${title}</div>
        </div>
        <button class="rep-btn rep-btn-outline rep-btn-sm" onclick="repCloseSignature()">✕</button>
      </div>
      <div style="padding:20px 24px">
        <div style="font-size:12px;color:var(--rep-text-2);margin-bottom:10px">${repT('rep_sign_instruction')}</div>
        <canvas id="rep-sig-pad" class="rep-sig-canvas" width="440" height="160"></canvas>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
          <button class="rep-btn rep-btn-outline rep-btn-sm" onclick="repClearSig()">${repT('rep_clear')}</button>
          <div style="font-size:11px;color:var(--rep-text-3)">${repT('rep_signed_by')} : ${localStorage.getItem('userEmail') || 'admin@sgs.gov'}</div>
        </div>
      </div>
      <div style="padding:14px 24px;border-top:1px solid var(--rep-border);display:flex;justify-content:flex-end;gap:8px">
        <button class="rep-btn rep-btn-outline" onclick="repCloseSignature()">${repT('rep_cancel')}</button>
        <button class="rep-btn rep-btn-primary" onclick="repConfirmSignature('${id}')">
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          ${repT('rep_sign_export')}
        </button>
      </div>
    </div>
  </div>`;

  setTimeout(() => {
    const canvas = document.getElementById('rep-sig-pad');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--rep-surface-2').trim() || '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--rep-text').trim() || '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    REP_STATE.sigCtx = ctx;
    REP_STATE.sigSigning = false;

    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      const src = e.touches ? e.touches[0] : e;
      return { x: src.clientX - r.left, y: src.clientY - r.top };
    };

    canvas.onmousedown = canvas.ontouchstart = (e) => { e.preventDefault(); const p = getPos(e); REP_STATE.sigSigning = true; REP_STATE.sigLastX = p.x; REP_STATE.sigLastY = p.y; };
    canvas.onmousemove = canvas.ontouchmove = (e) => { e.preventDefault(); if (!REP_STATE.sigSigning) return; const p = getPos(e); ctx.beginPath(); ctx.moveTo(REP_STATE.sigLastX, REP_STATE.sigLastY); ctx.lineTo(p.x, p.y); ctx.stroke(); REP_STATE.sigLastX = p.x; REP_STATE.sigLastY = p.y; };
    canvas.onmouseup = canvas.ontouchend = () => { REP_STATE.sigSigning = false; };
    canvas.onmouseleave = () => { REP_STATE.sigSigning = false; };
  }, 50);
}

function repClearSig() {
  const canvas = document.getElementById('rep-sig-pad');
  if (!canvas || !REP_STATE.sigCtx) return;
  REP_STATE.sigCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--rep-surface-2').trim() || '#f8fafc';
  REP_STATE.sigCtx.fillRect(0, 0, canvas.width, canvas.height);
}

function repCloseSignature() {
  const c = document.getElementById('rep-sig-container');
  if (c) c.innerHTML = '';
  REP_STATE.sigSigning = false;
  REP_STATE.sigCtx = null;
}

function repConfirmSignature(id) {
  repCloseSignature();
  const report = REP_DATA.reports.find(r => r.id === id);
  repToast(`✓ "${report?.title?.substring(0, 40)}…" ${repT('rep_signed_exported')}`);
}

// ── Chart initializers ────────────────────────────────────────────
function _repChartColors() {
  const isDark = document.documentElement.classList.contains('dark');
  return { isDark, tc: isDark ? '#94a3b8' : '#64748b', gc: isDark ? '#334155' : '#f1f5f9', border: isDark ? '#1e293b' : '#fff' };
}

function repInitDescriptiveCharts() {
  const { tc, gc, border } = _repChartColors();
  const d = REP_DATA.regions;
  const c1 = document.getElementById('rep-chart-region');
  if (c1) {
    if (c1._chart) c1._chart.destroy();
    c1._chart = new Chart(c1.getContext('2d'), {
      type: 'bar',
      data: { labels: d.map(r => r.name), datasets: [{ label: repT('rep_events'), data: d.map(r => r.events), backgroundColor: d.map(r => r.color + 'cc'), borderRadius: 6 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: tc }, grid: { color: gc } }, x: { ticks: { color: tc }, grid: { display: false } } } }
    });
  }
  const c2 = document.getElementById('rep-chart-occ');
  if (c2) {
    if (c2._chart) c2._chart.destroy();
    c2._chart = new Chart(c2.getContext('2d'), {
      type: 'doughnut',
      data: { labels: d.map(r => r.name), datasets: [{ data: d.map(r => r.occupancy), backgroundColor: d.map(r => r.color), borderWidth: 2, borderColor: border }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { color: tc, font: { size: 11 }, boxWidth: 12 } } } }
    });
  }
}

function repInitDiagnosticCharts() {
  const { tc, gc } = _repChartColors();
  const fed = REP_DATA.federations;
  const c = document.getElementById('rep-chart-delay');
  if (c) {
    if (c._chart) c._chart.destroy();
    c._chart = new Chart(c.getContext('2d'), {
      type: 'bar',
      data: {
        labels: fed.map(f => f.name),
        datasets: [
          { label: repT('rep_avg_delay_days'), data: fed.map(f => f.delay_avg), backgroundColor: fed.map(f => f.delay_avg <= 2 ? 'rgba(34,197,94,.7)' : f.delay_avg <= 3 ? 'rgba(245,158,11,.7)' : 'rgba(239,68,68,.7)'), borderRadius: 6 },
          { label: repT('rep_target'), data: fed.map(() => 2), type: 'line', borderColor: '#1A237E', borderDash: [4, 3], borderWidth: 2, pointRadius: 0, fill: false }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: tc, font: { size: 10 } } } }, scales: { y: { beginAtZero: true, ticks: { color: tc }, grid: { color: gc } }, x: { ticks: { color: tc, font: { size: 10 } }, grid: { display: false } } } }
    });
  }
}

function repInitPredictiveCharts() {
  const { tc, gc, border } = _repChartColors();
  const c1 = document.getElementById('rep-chart-predict');
  if (c1) {
    if (c1._chart) c1._chart.destroy();
    c1._chart = new Chart(c1.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr*', 'Mai*', 'Jun*'],
        datasets: [
          { label: repT('rep_historical'), data: [38, 42, 35, 45, 48, 52, null, null, null], borderColor: '#1A237E', backgroundColor: 'rgba(26,35,126,.08)', fill: true, tension: 0.4, pointRadius: 4 },
          { label: repT('rep_forecast'), data: [null, null, null, null, null, 52, 58, 55, 61], borderColor: '#a78bfa', borderDash: [5, 4], backgroundColor: 'rgba(167,139,250,.07)', fill: true, tension: 0.4, pointRadius: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: tc, font: { size: 11 } } } }, scales: { y: { ticks: { color: tc }, grid: { color: gc } }, x: { ticks: { color: tc }, grid: { display: false } } } }
    });
  }
  const c2 = document.getElementById('rep-chart-risk');
  if (c2) {
    if (c2._chart) c2._chart.destroy();
    c2._chart = new Chart(c2.getContext('2d'), {
      type: 'doughnut',
      data: { labels: [repT('rep_risk_low'), repT('rep_risk_medium'), repT('rep_risk_high')], datasets: [{ data: [142, 78, 27], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'], borderWidth: 2, borderColor: border }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'bottom', labels: { color: tc, font: { size: 10 }, boxWidth: 12 } } } }
    });
  }
}

// ── Actions ────────────────────────────────────────────────────
function repSwitchTab(tabId, btn) {
  document.querySelectorAll('.rep-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.rep-panel').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else {
    const tabs = document.querySelectorAll('.rep-tab');
    const idx = { descriptive: 0, diagnostic: 1, predictive: 2, prescriptive: 3, export: 4 }[tabId];
    if (tabs[idx]) tabs[idx].classList.add('active');
  }
  const panel = document.getElementById(`rep-panel-${tabId}`);
  if (panel) panel.classList.add('active');
  const chartInits = { descriptive: repInitDescriptiveCharts, diagnostic: repInitDiagnosticCharts, predictive: repInitPredictiveCharts };
  if (chartInits[tabId]) setTimeout(chartInits[tabId], 0);
}

function repFilterPeriod(val) {
  repToast(`${repT('rep_period_selected')} : ${val}`);
}

function repExportQuick(type) {
  repToast(`✓ ${repT('rep_report')} ${type} ${repT('rep_exported_pdf')}`);
}

function repDownload(id, format) {
  const report = REP_DATA.reports.find(r => r.id === id);
  repToast(`✓ ${repT('rep_download')} ${format.toUpperCase()} — ${report?.title?.substring(0, 30)}…`);
}

function repPrescriptionApply(idx) {
  const p = REP_DATA.prescriptions[idx];
  repToast(`✓ ${repT('rep_action_applied')} "${p.title.substring(0, 30)}…"`);
}

function repPrescriptionDefer(idx) {
  repToast(repT('rep_action_deferred'));
}

// ── Init ──────────────────────────────────────────────────────
function initReportModule() {
  window.reportModule = {
    role: localStorage.getItem('userRole') || 'super_admin',
    region: localStorage.getItem('userRegion'),
  };
  const role = _repRole();
  if (!['participant', 'federation'].includes(role)) {
    setTimeout(repInitDescriptiveCharts, 0);
  }
  return window.reportModule;
}

// ── Global exports ────────────────────────────────────────────
window.initReportModule = initReportModule;
window.repInitDescriptiveCharts = repInitDescriptiveCharts;
window.repInitDiagnosticCharts = repInitDiagnosticCharts;
window.repInitPredictiveCharts = repInitPredictiveCharts;
window.renderReportModule = renderReportModule;
window.repSwitchTab = repSwitchTab;
window.repFilterPeriod = repFilterPeriod;
window.repExportQuick = repExportQuick;
window.repDownload = repDownload;
window.repOpenSignature = repOpenSignature;
window.repClearSig = repClearSig;
window.repCloseSignature = repCloseSignature;
window.repConfirmSignature = repConfirmSignature;
window.repPrescriptionApply = repPrescriptionApply;
window.repPrescriptionDefer = repPrescriptionDefer;
window.repOpenGenerateModal = repOpenGenerateModal;
window.repDeleteReport = repDeleteReport;
window.repEditReport = repEditReport;
window._repCloseReportModal = _repCloseReportModal;
window._repGenerateReport = _repGenerateReport;
window.repToast = repToast;