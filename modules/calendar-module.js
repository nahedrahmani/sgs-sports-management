// ============================================================
// CALENDAR MODULE 
// ============================================================

function calT(key) {
  if (typeof t === 'function') return t(key);
  if (typeof TRANSLATIONS !== 'undefined') {
    const lang = localStorage.getItem('sgs-lang') || 'fr';
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;
  }
  return key;
}

// ── Styles ───────────────────────────────────────────────────
(function injectCalStyles() {
  if (document.getElementById('cal-module-styles')) return;
  const s = document.createElement('style');
  s.id = 'cal-module-styles';
  s.textContent = `
    :root {
      --cal-navy:         #1A237E;
      --cal-navy-dark:    #283593;
      --cal-green:        #1B5E20;
      --cal-green-light:  #E8F5E9;
      --cal-amber:        #E65100;
      --cal-amber-light:  #FFF3E0;
      --cal-red:          #B71C1C;
      --cal-red-light:    #FFEBEE;
      --cal-blue-pale:    #E8EAF6;
      --cal-purple:       #4527A0;
      --cal-purple-light: #EDE7F6;
      --cal-surface:      #ffffff;
      --cal-surface-2:    #f8fafc;
      --cal-surface-3:    #f1f5f9;
      --cal-border:       #e2e8f0;
      --cal-text:         #1e293b;
      --cal-text-2:       #475569;
      --cal-text-3:       #94a3b8;
    }
    html.dark {
      --cal-surface:      #1e293b;
      --cal-surface-2:    #0f172a;
      --cal-surface-3:    #1a2744;
      --cal-border:       #334155;
      --cal-text:         #e2e8f0;
      --cal-text-2:       #94a3b8;
      --cal-text-3:       #64748b;
      --cal-green:        #4ade80;
      --cal-green-light:  rgba(74,222,128,.12);
      --cal-amber:        #fb923c;
      --cal-amber-light:  rgba(251,146,60,.13);
      --cal-blue-pale:    rgba(99,131,255,.18);
      --cal-purple:       #a78bfa;
      --cal-purple-light: rgba(167,139,250,.15);
      --cal-red:          #f87171;
      --cal-red-light:    rgba(248,113,113,.13);
    }
    html.dark [style*="color:var(--cal-navy)"] { color:var(--cal-text-2) !important; }

    /* ── Layout ── */
    .cal-wrap { display:flex; gap:0; min-height:600px; background:var(--cal-surface); border-radius:14px; border:1px solid var(--cal-border); overflow:hidden; }
    .cal-sidenav { width:160px; flex-shrink:0; background:var(--cal-surface-2); border-right:1px solid var(--cal-border); padding:12px 8px; display:flex; flex-direction:column; gap:4px; }
    .cal-sidenav-btn { display:flex; align-items:center; gap:8px; width:100%; padding:9px 12px; border-radius:8px; border:none; background:transparent; color:var(--cal-text-2); font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; text-align:left; }
    .cal-sidenav-btn:hover { background:var(--cal-surface-3); color:var(--cal-text); }
    .cal-sidenav-btn.active { background:var(--cal-blue-pale); color:var(--cal-navy); font-weight:600; }
    html.dark .cal-sidenav-btn.active { color:#93b4ff; }
    .cal-content { flex:1; overflow:hidden; }
    .cal-view { display:none; padding:20px; }
    .cal-view.cal-view-active { display:block; }

    /* ── Toast ── */
    .cal-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(20px); background:var(--cal-navy); color:#fff; padding:10px 18px; border-radius:10px; font-size:13px; display:flex; align-items:center; gap:8px; z-index:9999; opacity:0; transition:all .3s; pointer-events:none; white-space:nowrap; }
    .cal-toast.cal-toast-show { opacity:1; transform:translateX(-50%) translateY(0); }

    /* ── Toolbar ── */
    .cal-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:8px; }
    .cal-toolbar-left { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
    .cal-title { font-size:16px; font-weight:700; color:var(--cal-text); }
    .cal-sub { font-size:12px; color:var(--cal-text-3); margin-top:1px; }

    /* ── Buttons ── */
    .cal-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; border:none; font-size:12px; font-weight:600; cursor:pointer; transition:all .15s; }
    .cal-btn-primary { background:var(--cal-navy); color:#fff; }
    .cal-btn-primary:hover { background:var(--cal-navy-dark); }
    .cal-btn-outline { background:transparent; color:var(--cal-text-2); border:1px solid var(--cal-border); }
    .cal-btn-outline:hover { background:var(--cal-surface-3); }
    .cal-btn-danger { background:rgba(220,38,38,.12); color:#f87171; border:1px solid rgba(248,113,113,.35); }
    html:not(.dark) .cal-btn-danger { color:#DC2626; border-color:rgba(220,38,38,.3); }
    .cal-btn-sm { padding:5px 10px; font-size:11px; }
    .cal-btn-success { background:var(--cal-green-light); color:var(--cal-green); border:1px solid var(--cal-green); }
    .cal-btn-amber { background:var(--cal-amber-light); color:var(--cal-amber); border:1px solid var(--cal-amber); }

    /* ── Inputs ── */
    .cal-input, .cal-select { padding:8px 12px; border-radius:8px; border:1px solid var(--cal-border); background:var(--cal-surface); color:var(--cal-text); font-size:13px; outline:none; transition:border-color .15s; }
    .cal-input:focus, .cal-select:focus { border-color:var(--cal-navy); }
    .cal-label { font-size:12px; font-weight:600; color:var(--cal-text-2); margin-bottom:4px; display:block; }

    /* ── Table ── */
    .cal-table-wrap { overflow-x:auto; border-radius:10px; border:1px solid var(--cal-border); }
    .cal-table { width:100%; border-collapse:collapse; font-size:13px; }
    .cal-table th { padding:10px 14px; text-align:left; background:var(--cal-surface-2); font-size:11px; font-weight:700; color:var(--cal-text-3); text-transform:uppercase; letter-spacing:.04em; border-bottom:1px solid var(--cal-border); white-space:nowrap; }
    .cal-table td { padding:10px 14px; border-bottom:1px solid var(--cal-border); color:var(--cal-text); vertical-align:middle; }
    .cal-table tr:last-child td { border-bottom:none; }
    .cal-table tr:hover td { background:var(--cal-surface-3); }

    /* ── KPI cards ── */
    .cal-kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin-bottom:20px; }
    .cal-kpi { background:var(--cal-surface); border:1px solid var(--cal-border); border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:12px; }
    .cal-kpi:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(26,35,126,.08); transition:all .18s; }
    .cal-kpi-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .cal-kpi-n { font-size:22px; font-weight:700; color:var(--cal-text); line-height:1; }
    .cal-kpi-label { font-size:11px; color:var(--cal-text-3); margin-top:2px; }

    /* ── Badges ── */
    .cal-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:999px; font-size:11px; font-weight:600; }
    .cal-badge-dot { width:5px; height:5px; border-radius:50%; }
    .cal-badge-brouillon { background:var(--cal-surface-3); color:var(--cal-text-2); border:1px solid var(--cal-border); }
    .cal-badge-soumis    { background:var(--cal-amber-light); color:var(--cal-amber); }
    .cal-badge-valide    { background:var(--cal-green-light); color:var(--cal-green); }
    .cal-badge-rejete    { background:var(--cal-red-light); color:var(--cal-red); }
    .cal-badge-annule    { background:var(--cal-surface-3); color:var(--cal-text-3); }
    .cal-badge-conflit   { background:var(--cal-red-light); color:var(--cal-red); }
    .cal-badge-publie    { background:var(--cal-blue-pale); color:var(--cal-navy); }
    html.dark .cal-badge-publie { color:#93b4ff; }

    /* Classification badges 1-9 */
    .cal-classif { display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:6px; font-size:11px; font-weight:700; }
    .cal-classif-low  { background:var(--cal-green-light); color:var(--cal-green); }
    .cal-classif-mid  { background:var(--cal-amber-light); color:var(--cal-amber); }
    .cal-classif-high { background:var(--cal-red-light); color:var(--cal-red); }

    /* ── Modal ── */
    .cal-overlay { position:fixed; inset:0; background:rgba(10,15,50,.5); backdrop-filter:blur(3px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
    .cal-modal { background:var(--cal-surface); border-radius:16px; width:100%; max-width:660px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(10,15,50,.25); }
    .cal-modal-header { padding:20px 24px 16px; border-bottom:1px solid var(--cal-border); position:sticky; top:0; background:var(--cal-surface); z-index:1; display:flex; justify-content:space-between; align-items:center; }
    .cal-modal-body   { padding:20px 24px; background:var(--cal-surface); color:var(--cal-text); }
    .cal-modal-footer { padding:14px 24px; border-top:1px solid var(--cal-border); display:flex; justify-content:flex-end; gap:8px; position:sticky; bottom:0; background:var(--cal-surface); }
    .cal-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .cal-form-full { grid-column:1/-1; }
    .cal-form-group { display:flex; flex-direction:column; }

    /* ── Calendar grid (vue calendrier) ── */
    .cal-grid-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
    .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
    .cal-grid-day-name { font-size:11px; font-weight:600; color:var(--cal-text-3); text-align:center; padding:4px; }
    .cal-grid-cell { min-height:80px; border-radius:8px; border:1px solid var(--cal-border); padding:6px; background:var(--cal-surface-2); cursor:pointer; transition:background .12s; }
    .cal-grid-cell:hover { background:var(--cal-surface-3); }
    .cal-grid-cell.cal-today { border-color:var(--cal-navy); background:var(--cal-blue-pale); }
    .cal-grid-cell.cal-other-month { opacity:.4; }
    .cal-grid-cell.cal-has-event { border-color:var(--cal-green); }
    .cal-grid-cell.cal-has-conflit { border-color:var(--cal-red) !important; background:var(--cal-red-light) !important; }
    .cal-grid-num { font-size:12px; font-weight:600; color:var(--cal-text-2); margin-bottom:3px; }
    .cal-grid-event-dot { font-size:10px; padding:2px 5px; border-radius:4px; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; display:block; }

    /* ── Conflit alert bar ── */
    .cal-conflit-bar { background:var(--cal-red-light); border:1px solid var(--cal-red); border-radius:8px; padding:10px 14px; display:flex; align-items:center; gap:10px; margin-bottom:14px; font-size:13px; color:var(--cal-red); }

    /* ── Detail panel ── */
    .cal-detail { background:var(--cal-surface-2); border:1px solid var(--cal-border); border-radius:10px; padding:16px; margin-top:14px; }
    .cal-detail-row { display:flex; gap:8px; margin-bottom:8px; font-size:13px; }
    .cal-detail-label { font-weight:600; color:var(--cal-text-2); min-width:130px; }
    .cal-detail-value { color:var(--cal-text); }

    /* ── Tabs inside views ── */
    .cal-tabs { display:flex; gap:2px; background:var(--cal-surface-2); border-radius:10px; padding:3px; margin-bottom:16px; width:fit-content; }
    .cal-tab { padding:7px 16px; border-radius:8px; border:none; background:transparent; font-size:12px; font-weight:500; color:var(--cal-text-3); cursor:pointer; transition:all .15s; }
    .cal-tab.cal-tab-active { background:var(--cal-surface); color:var(--cal-navy); font-weight:700; box-shadow:0 1px 4px rgba(0,0,0,.08); }
    html.dark .cal-tab.cal-tab-active { color:#93b4ff; }

    /* ── Fiche technique ── */
    .cal-fiche-section { margin-bottom:16px; }
    .cal-fiche-section-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:var(--cal-text-3); margin-bottom:8px; }
    .cal-score-box { display:flex; align-items:center; justify-content:center; gap:16px; padding:14px; background:var(--cal-surface-2); border-radius:10px; border:1px solid var(--cal-border); }
    .cal-score-team { font-size:14px; font-weight:600; color:var(--cal-text); text-align:center; flex:1; }
    .cal-score-num { font-size:28px; font-weight:800; color:var(--cal-navy); min-width:40px; text-align:center; }
    html.dark .cal-score-num { color:#93b4ff; }
    .cal-score-sep { font-size:22px; color:var(--cal-text-3); }

    /* Horizontal tabs at the top */
    .cal-tabs-horizontal {
      display: flex;
      gap: 4px;
      background: var(--cal-surface-2);
      border: 1px solid var(--cal-border);
      border-radius: 12px;
      padding: 6px;
      margin-bottom: 24px;
      width: fit-content;
    }
    .cal-tab-horizontal {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      border-radius: 8px;
      border: none;
      background: transparent;
      font-size: 13px;
      font-weight: 500;
      color: var(--cal-text-2);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .cal-tab-horizontal:hover {
      background: var(--cal-surface-3);
      color: var(--cal-text);
    }
    .cal-tab-horizontal.active {
      background: var(--cal-navy);
      color: white;
      box-shadow: 0 2px 8px rgba(26, 35, 126, 0.2);
    }
    .cal-tab-horizontal.active svg {
      stroke: white;
    }
    .cal-tab-badge {
      background: var(--cal-red);
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 20px;
      margin-left: 4px;
    }
    .cal-tab-horizontal.active .cal-tab-badge {
      background: rgba(255, 255, 255, 0.25);
    }
  `;
  document.head.appendChild(s);
})();

// ── State ────────────────────────────────────────────────────
const CAL_STATE = {
  view:        'evenements',  // evenements | calendriers | fiches | conflits
  activeTab:   'all',
  selectedId:  null,
  modalMode:   null,          // 'create-event' | 'edit-event' | 'create-cal' | 'edit-cal' | 'fiche'
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  calView:     'table',       // 'table' | 'grid'
};

// ── Mock data ────────────────────────────────────────────────
const CAL_DATA = {
  evenements: [
    { id:1, titre:'Match CA vs EST', type:'match', classification:7, niveau_vigilance:'sensible', date_debut:'2026-04-05', date_fin:'2026-04-05', heure_debut:'15:00', heure_fin:'17:00', lieu:'Stade Hammadi Agrebi', region:'Bizerte', federation:'Football', statut:'valide_national', conflit:false, created_by:'superadmin@sgs.gov' },
    { id:2, titre:'Stage Équipe Nationale Handball', type:'stage', classification:4, niveau_vigilance:'surveille', date_debut:'2026-04-10', date_fin:'2026-04-15', heure_debut:'09:00', heure_fin:'18:00', lieu:'Salle Omnisports Rades', region:'Ben Arous', federation:'Handball', statut:'valide_regional', conflit:false, created_by:'region.nord@sgs.gov' },
    { id:3, titre:'Formation Arbitres Football', type:'formation', classification:2, niveau_vigilance:'normal', date_debut:'2026-04-12', date_fin:'2026-04-13', heure_debut:'09:00', heure_fin:'17:00', lieu:'Centre Technique Hammam-Lif', region:'Ben Arous', federation:'Football', statut:'soumis', conflit:false, created_by:'football@fed.sgs.gov' },
    { id:4, titre:'Compétition Nationale Athlétisme', type:'competition', classification:6, niveau_vigilance:'surveille', date_debut:'2026-04-20', date_fin:'2026-04-21', heure_debut:'08:00', heure_fin:'20:00', lieu:'Stade El Menzah', region:'Tunis', federation:'Athlétisme', statut:'brouillon', conflit:true, created_by:'athletisme@fed.sgs.gov' },
    { id:5, titre:'Entraînement Quotidien Espérance', type:'entrainement', classification:1, niveau_vigilance:'normal', date_debut:'2026-04-05', date_fin:'2026-04-05', heure_debut:'17:00', heure_fin:'19:00', lieu:'Stade Hammadi Agrebi', region:'Bizerte', federation:'Football', statut:'valide_national', conflit:true, created_by:'superadmin@sgs.gov' },
    { id:6, titre:'Championnat Régional Natation', type:'competition', classification:3, niveau_vigilance:'normal', date_debut:'2026-05-03', date_fin:'2026-05-04', heure_debut:'09:00', heure_fin:'18:00', lieu:'Piscine Olympique Tunis', region:'Tunis', federation:'Natation', statut:'soumis', conflit:false, created_by:'region.centre@sgs.gov' },
    { id:7, titre:'Manifestation Sportive Sfax', type:'manifestation', classification:8, niveau_vigilance:'sensible', date_debut:'2026-05-15', date_fin:'2026-05-15', heure_debut:'10:00', heure_fin:'22:00', lieu:'Stade Taïeb Mhiri', region:'Sfax', federation:'Multi-sports', statut:'brouillon', conflit:false, created_by:'region.sud@sgs.gov' },
  ],
  calendriers: [
    { id:1, titre:'Programme Annuel Compétitions Nationales 2026', type:'annuel', niveau:'national', annee:2026, statut:'publie', created_by:'superadmin@sgs.gov', nb_evenements:42 },
    { id:2, titre:'Calendrier Mensuel Football — Avril 2026', type:'mensuel', niveau:'federation', annee:2026, mois:4, statut:'valide', created_by:'football@fed.sgs.gov', nb_evenements:12 },
    { id:3, titre:'Calendrier Régional Nord — 2026', type:'annuel', niveau:'regional', annee:2026, statut:'soumis', created_by:'region.nord@sgs.gov', nb_evenements:28 },
    { id:4, titre:'Programme Global Consolidé 2026', type:'global', niveau:'national', annee:2026, statut:'brouillon', created_by:'national.admin@sgs.gov', nb_evenements:0 },
  ],
  fiches: [
    { id:1, evenement_id:1, equipe_domicile:'Club Africain', equipe_visiteur:'Espérance Sportive', arbitre_principal:'Mohamed Ben Ali', arbitres_assistants:'Karim Mejri, Sami Trabelsi', score_domicile:2, score_visiteur:1, spectateurs:28000, incidents:'RAS', statut:'cloture' },
    { id:2, evenement_id:5, equipe_domicile:'Espérance Sportive', equipe_visiteur:'—', arbitre_principal:'—', arbitres_assistants:'—', score_domicile:null, score_visiteur:null, spectateurs:0, incidents:'', statut:'en_cours' },
  ],
  conflits: [
    { id:1, evenement_a:4, titre_a:'Compétition Nationale Athlétisme', evenement_b:5, titre_b:'Entraînement Quotidien Espérance', type:'infrastructure', lieu:'Stade El Menzah', date:'2026-04-05', statut:'ouvert', description:'Même infrastructure réservée par 2 événements sur le même créneau.' },
    { id:2, evenement_a:4, titre_a:'Compétition Nationale Athlétisme', evenement_b:5, titre_b:'Entraînement Quotidien Espérance', type:'calendrier', lieu:'Région Tunis', date:'2026-04-05', statut:'ouvert', description:'Deux événements de la même région sur la même journée dépassent la capacité de coordination.' },
  ],
};

// ── Helpers ──────────────────────────────────────────────────
function calToast(msg) {
  let el = document.getElementById('cal-toast-el');
  if (!el) return;
  el.querySelector('span').textContent = msg;
  clearTimeout(el._timer);
  el.classList.add('cal-toast-show');
  el._timer = setTimeout(() => el.classList.remove('cal-toast-show'), 2800);
}

function calBadge(statut) {
  const map = {
    brouillon:       `<span class="cal-badge cal-badge-brouillon">${calT('cal_status_draft')}</span>`,
    soumis:          `<span class="cal-badge cal-badge-soumis">${calT('cal_status_submitted')}</span>`,
    valide_regional: `<span class="cal-badge cal-badge-valide">${calT('cal_status_validated_reg')}</span>`,
    valide_national: `<span class="cal-badge cal-badge-valide">${calT('cal_status_validated_nat')}</span>`,
    valide:          `<span class="cal-badge cal-badge-valide">${calT('cal_status_validated')}</span>`,
    rejete:          `<span class="cal-badge cal-badge-rejete">${calT('cal_status_rejected')}</span>`,
    annule:          `<span class="cal-badge cal-badge-annule">${calT('cal_status_cancelled')}</span>`,
    publie:          `<span class="cal-badge cal-badge-publie">${calT('cal_status_published')}</span>`,
  };
  return map[statut] || statut;
}

function calClassif(n) {
  const cls = n <= 3 ? 'low' : n <= 6 ? 'mid' : 'high';
  return `<span class="cal-classif cal-classif-${cls}">${n}</span>`;
}

function calTypeIcon(type) {
  const icons = {
    match: '●', competition: '●', manifestation: '●',
    stage: '●', formation: '●', entrainement: '●',
  };
  return icons[type] || '●';
}

function _calNextId(arr) {
  return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
}

// ── Render: main shell ───────────────────────────────────────
function renderCalendarModule() {
  const conflitsCount = CAL_DATA.conflits.filter(c => c.statut === 'ouvert').length;
  
  return `
  <div id="cal-toast-el" class="cal-toast">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <span></span>
  </div>

  <!-- Horizontal tabs at the top -->
  <div class="cal-tabs-horizontal">
    <button class="cal-tab-horizontal active" id="cal-tab-evenements" onclick="calSwitchView('evenements')">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
      ${calT('cal_nav_events')}
    </button>
    <button class="cal-tab-horizontal" id="cal-tab-calendriers" onclick="calSwitchView('calendriers')">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
      ${calT('cal_nav_calendars')}
    </button>
    <button class="cal-tab-horizontal" id="cal-tab-fiches" onclick="calSwitchView('fiches')">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      ${calT('cal_nav_match_sheets')}
    </button>
    <button class="cal-tab-horizontal" id="cal-tab-conflits" onclick="calSwitchView('conflits')">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      ${calT('cal_nav_conflicts')}
      ${conflitsCount > 0 ? `<span class="cal-tab-badge">${conflitsCount}</span>` : ''}
    </button>
  </div>

  <div class="cal-content">
    <div id="cal-view-evenements"  class="cal-view cal-view-active">${renderCalEvenements()}</div>
    <div id="cal-view-calendriers" class="cal-view">${renderCalCalendriers()}</div>
    <div id="cal-view-fiches"      class="cal-view">${renderCalFiches()}</div>
    <div id="cal-view-conflits"    class="cal-view">${renderCalConflits()}</div>
  </div>

  <div id="cal-modal-overlay" style="display:none"></div>
  `;
}
// ── View: Événements ─────────────────────────────────────────
function renderCalEvenements() {
  const evts = CAL_DATA.evenements;
  const conflitsOuverts = evts.filter(e => e.conflit).length;

  return `
  ${conflitsOuverts > 0 ? `
  <div class="cal-conflit-bar">
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
    <strong>${conflitsOuverts} ${calT('cal_conflicts_detected')}</strong> — ${calT('cal_conflicts_desc')}
    <button class="cal-btn cal-btn-danger cal-btn-sm" style="margin-left:auto" onclick="calSwitchView('conflits')">${calT('cal_view_conflicts')}</button>
  </div>` : ''}

  <div class="cal-kpis">
    ${[
      { n: evts.length, label: calT('cal_kpi_total'), bg: 'var(--cal-blue-pale)', tc: 'var(--cal-navy)', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { n: evts.filter(e=>e.statut==='valide_national'||e.statut==='valide_regional').length, label: calT('cal_kpi_validated'), bg: 'var(--cal-green-light)', tc: 'var(--cal-green)', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      { n: evts.filter(e=>e.statut==='soumis').length, label: calT('cal_kpi_pending'), bg: 'var(--cal-amber-light)', tc: 'var(--cal-amber)', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
      { n: evts.filter(e=>e.conflit).length, label: calT('cal_kpi_conflicts'), bg: 'var(--cal-red-light)', tc: 'var(--cal-red)', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    ].map(k => `
      <div class="cal-kpi">
        <div class="cal-kpi-icon" style="background:${k.bg}">
          <svg width="18" height="18" fill="none" stroke="${k.tc}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${k.icon}"/></svg>
        </div>
        <div>
          <div class="cal-kpi-n" style="color:${k.tc}">${k.n}</div>
          <div class="cal-kpi-label">${k.label}</div>
        </div>
      </div>
    `).join('')}
  </div>

  <div class="cal-toolbar">
    <div class="cal-toolbar-left">
      <div>
        <div class="cal-title">${calT('cal_events_title')}</div>
        <div class="cal-sub">${calT('cal_events_subtitle')}</div>
      </div>
      <input type="text" class="cal-input" placeholder="${calT('cal_search')}..." style="width:180px" oninput="calFilterEvents(this.value)">
      <select class="cal-select" onchange="calFilterByType(this.value)" style="width:140px">
        <option value="">${calT('cal_all_types')}</option>
        <option value="match">${calT('cal_type_match')}</option>
        <option value="competition">${calT('cal_type_competition')}</option>
        <option value="manifestation">${calT('cal_type_manifestation')}</option>
        <option value="stage">${calT('cal_type_stage')}</option>
        <option value="formation">${calT('cal_type_training')}</option>
        <option value="entrainement">${calT('cal_type_practice')}</option>
      </select>
      <select class="cal-select" onchange="calFilterByStatut(this.value)" style="width:140px">
        <option value="">${calT('cal_all_status')}</option>
        <option value="brouillon">${calT('cal_status_draft')}</option>
        <option value="soumis">${calT('cal_status_submitted')}</option>
        <option value="valide_regional">${calT('cal_status_validated_reg')}</option>
        <option value="valide_national">${calT('cal_status_validated_nat')}</option>
        <option value="rejete">${calT('cal_status_rejected')}</option>
      </select>
    </div>
    <button class="cal-btn cal-btn-primary" onclick="calOpenModal('create-event')">
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      ${calT('cal_new_event')}
    </button>
  </div>

  <div class="cal-table-wrap">
    <table class="cal-table" id="cal-events-table">
      <thead>
        <tr>
          <th>${calT('cal_col_event')}</th>
          <th>${calT('cal_col_type')}</th>
          <th>${calT('cal_col_classif')}</th>
          <th>${calT('cal_col_dates')}</th>
          <th>${calT('cal_col_venue')}</th>
          <th>${calT('cal_col_federation')}</th>
          <th>${calT('cal_col_status')}</th>
          <th>${calT('cal_col_actions')}</th>
        </tr>
      </thead>
      <tbody id="cal-events-tbody">
        ${renderEventRows(CAL_DATA.evenements)}
      </tbody>
    </table>
  </div>
  `;
}

function renderEventRows(evts) {
  if (!evts.length) return `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--cal-text-3)">${calT('cal_no_events')}</td></tr>`;
  return evts.map(e => `
    <tr style="cursor:pointer" onclick="calSelectEvent(${e.id})">
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">${calTypeIcon(e.type)}</span>
          <div>
            <div style="font-weight:600;color:var(--cal-text);font-size:13px">${e.titre}</div>
            <div style="font-size:11px;color:var(--cal-text-3)">${e.created_by}</div>
          </div>
          ${e.conflit ? `<svg width="14" height="14" fill="none" stroke="var(--cal-red)" viewBox="0 0 24 24" title="${calT('cal_conflict_detected')}"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>` : ''}
        </div>
      </td>
      <td><span style="font-size:12px;text-transform:capitalize">${e.type}</span></td>
      <td style="text-align:center">${calClassif(e.classification)}</td>
      <td>
        <div style="font-size:12px;font-weight:600;color:var(--cal-text)">${e.date_debut}</div>
        ${e.date_fin !== e.date_debut ? `<div style="font-size:11px;color:var(--cal-text-3)">→ ${e.date_fin}</div>` : ''}
        <div style="font-size:11px;color:var(--cal-text-3)">${e.heure_debut} – ${e.heure_fin}</div>
      </td>
      <td>
        <div style="font-size:12px;color:var(--cal-text)">${e.lieu}</div>
        <div style="font-size:11px;color:var(--cal-text-3)">${e.region}</div>
      </td>
      <td style="font-size:12px;color:var(--cal-text)">${e.federation}</td>
      <td>${calBadge(e.statut)}</td>
      <td onclick="event.stopPropagation()">
        <div style="display:flex;gap:4px">
          <button class="cal-btn cal-btn-outline cal-btn-sm" onclick="calOpenModal('edit-event',${e.id})" title="${calT('cal_edit')}">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          ${e.statut === 'brouillon' || e.statut === 'rejete' ? `
          <button class="cal-btn cal-btn-success cal-btn-sm" onclick="calSubmitEvent(${e.id})" title="${calT('cal_submit')}">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </button>` : ''}
          <button class="cal-btn cal-btn-danger cal-btn-sm" onclick="calDeleteEvent(${e.id})" title="${calT('cal_delete')}">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── View: Calendriers ────────────────────────────────────────
function renderCalCalendriers() {
  const cals = CAL_DATA.calendriers;
  return `
  <div class="cal-toolbar">
    <div class="cal-toolbar-left">
      <div>
        <div class="cal-title">${calT('cal_calendars_title')}</div>
        <div class="cal-sub">${calT('cal_calendars_subtitle')}</div>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <div class="cal-tabs">
        <button class="cal-tab cal-tab-active" data-cal-view="table" onclick="calToggleCalView('table',this)">${calT('cal_view_list')}</button>
        <button class="cal-tab" data-cal-view="grid" onclick="calToggleCalView('grid',this)">${calT('cal_view_monthly')}</button>
      </div>
      <button class="cal-btn cal-btn-primary" onclick="calOpenModal('create-cal')">
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        ${calT('cal_new_calendar')}
      </button>
    </div>
  </div>

  <div id="cal-calendriers-table-view">
    <div class="cal-table-wrap">
      <table class="cal-table">
        <thead>
          <tr>
            <th>${calT('cal_col_title')}</th>
            <th>${calT('cal_col_type')}</th>
            <th>${calT('cal_col_level')}</th>
            <th>${calT('cal_col_period')}</th>
            <th>${calT('cal_col_events_count')}</th>
            <th>${calT('cal_col_status')}</th>
            <th>${calT('cal_col_actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${cals.map(c => `
            <tr>
              <td style="font-weight:600;color:var(--cal-text)">${c.titre}</td>
              <td style="text-transform:capitalize;font-size:12px">${c.type}</td>
              <td>
                <span style="background:var(--cal-blue-pale);color:var(--cal-navy);padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600">${c.niveau}</span>
              </td>
              <td style="font-size:12px;color:var(--cal-text-2)">${c.annee}${c.mois ? ` · ${calT('cal_month')} ${c.mois}` : ''}</td>
              <td style="text-align:center;font-weight:600;color:var(--cal-navy)">${c.nb_evenements}</td>
              <td>${calBadge(c.statut)}</td>
              <td>
                <div style="display:flex;gap:4px">
                  <button class="cal-btn cal-btn-outline cal-btn-sm" onclick="calOpenModal('edit-cal',${c.id})">
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    ${calT('cal_edit')}
                  </button>
                  ${c.statut === 'valide' ? `
                  <button class="cal-btn cal-btn-success cal-btn-sm" onclick="calPublishCal(${c.id})">${calT('cal_publish')}</button>` : ''}
                  <button class="cal-btn cal-btn-danger cal-btn-sm" onclick="calDeleteCal(${c.id})">
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div id="cal-calendriers-grid-view" style="display:none">
    ${renderMonthGrid()}
  </div>
  `;
}

function renderMonthGrid() {
  const year  = CAL_STATE.currentYear;
  const month = CAL_STATE.currentMonth;
  const monthNames = [calT('cal_jan'), calT('cal_feb'), calT('cal_mar'), calT('cal_apr'), calT('cal_may'), calT('cal_jun'), calT('cal_jul'), calT('cal_aug'), calT('cal_sep'), calT('cal_oct'), calT('cal_nov'), calT('cal_dec')];
  const dayNames   = [calT('cal_mon'), calT('cal_tue'), calT('cal_wed'), calT('cal_thu'), calT('cal_fri'), calT('cal_sat'), calT('cal_sun')];
  const today = new Date();

  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  let startDow = (firstDay.getDay() + 6) % 7;

  const days = [];
  for (let i = 0; i < startDow; i++) {
    const d = new Date(year, month, -startDow + 1 + i);
    days.push({ date: d, thisMonth: false });
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), thisMonth: true });
  }
  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, days.length - lastDay.getDate() - startDow + 1);
    days.push({ date: d, thisMonth: false });
  }

  const evtsThisMonth = CAL_DATA.evenements.filter(e => {
    const d = new Date(e.date_debut);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  return `
  <div class="cal-grid-header">
    <button class="cal-btn cal-btn-outline" onclick="calPrevMonth()">‹</button>
    <div style="font-size:15px;font-weight:700;color:var(--cal-text)">${monthNames[month]} ${year}</div>
    <button class="cal-btn cal-btn-outline" onclick="calNextMonth()">›</button>
  </div>
  <div class="cal-grid">
    ${dayNames.map(d => `<div class="cal-grid-day-name">${d}</div>`).join('')}
    ${days.map(({ date, thisMonth }) => {
      const iso = date.toISOString().split('T')[0];
      const isToday = date.toDateString() === today.toDateString();
      const dayEvts = evtsThisMonth.filter(e => e.date_debut <= iso && e.date_fin >= iso);
      const hasConflit = dayEvts.some(e => e.conflit);
      return `
        <div class="cal-grid-cell ${isToday?'cal-today':''} ${!thisMonth?'cal-other-month':''} ${dayEvts.length?'cal-has-event':''} ${hasConflit?'cal-has-conflit':''}">
          <div class="cal-grid-num">${date.getDate()}</div>
          ${dayEvts.slice(0,2).map(e => `
            <span class="cal-grid-event-dot" style="background:${e.conflit?'var(--cal-red-light)':'var(--cal-green-light)'};color:${e.conflit?'var(--cal-red)':'var(--cal-green)'}">
              ${calTypeIcon(e.type)} ${e.titre.substring(0,14)}...
            </span>
          `).join('')}
          ${dayEvts.length > 2 ? `<span style="font-size:10px;color:var(--cal-text-3)">+${dayEvts.length-2} ${calT('cal_others')}</span>` : ''}
        </div>
      `;
    }).join('')}
  </div>
  `;
}

// ── View: Fiches techniques ──────────────────────────────────
function renderCalFiches() {
  const fiches = CAL_DATA.fiches;
  return `
  <div class="cal-toolbar">
    <div>
      <div class="cal-title">${calT('cal_match_sheets_title')}</div>
      <div class="cal-sub">${calT('cal_match_sheets_subtitle')}</div>
    </div>
    <button class="cal-btn cal-btn-primary" onclick="calOpenModal('fiche')">
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      ${calT('cal_new_sheet')}
    </button>
  </div>

  <div style="display:flex;flex-direction:column;gap:12px" id="cal-fiches-list">
    ${fiches.map(f => {
      const evt = CAL_DATA.evenements.find(e => e.id === f.evenement_id);
      return `
      <div class="cal-detail" style="border-left:3px solid var(--cal-navy)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
          <div>
            <div style="font-weight:700;color:var(--cal-text);font-size:14px">${evt?.titre || calT('cal_event_deleted')}</div>
            <div style="font-size:12px;color:var(--cal-text-3)">${evt?.date_debut || ''} · ${evt?.lieu || ''}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="cal-badge ${f.statut==='cloture'?'cal-badge-valide':'cal-badge-soumis'}">${f.statut==='cloture'?calT('cal_closed'):calT('cal_in_progress')}</span>
            <button class="cal-btn cal-btn-outline cal-btn-sm" onclick="calOpenModal('edit-fiche',${f.id})">${calT('cal_edit')}</button>
            <button class="cal-btn cal-btn-danger cal-btn-sm" onclick="calDeleteFiche(${f.id})">${calT('cal_delete')}</button>
          </div>
        </div>

        ${f.score_domicile !== null ? `
        <div class="cal-score-box" style="margin-bottom:12px">
          <div class="cal-score-team">${f.equipe_domicile}</div>
          <div class="cal-score-num">${f.score_domicile}</div>
          <div class="cal-score-sep">—</div>
          <div class="cal-score-num">${f.score_visiteur}</div>
          <div class="cal-score-team">${f.equipe_visiteur}</div>
        </div>` : `
        <div style="text-align:center;padding:10px;color:var(--cal-text-3);font-size:12px;margin-bottom:12px">${calT('cal_score_not_entered')}</div>`}

        <div class="cal-fiche-section">
          <div class="cal-fiche-section-title">${calT('cal_refereeing')}</div>
          <div style="font-size:12px;color:var(--cal-text)">
            <div>${calT('cal_main_referee')} : <strong>${f.arbitre_principal}</strong></div>
            <div style="color:var(--cal-text-3)">${calT('cal_assistant_referees')} : ${f.arbitres_assistants}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px">
          <div><span style="color:var(--cal-text-3)">${calT('cal_spectators')} : </span><strong>${f.spectateurs.toLocaleString()}</strong></div>
          <div><span style="color:var(--cal-text-3)">${calT('cal_incidents')} : </span><strong>${f.incidents || calT('cal_no_incidents')}</strong></div>
        </div>
      </div>
      `;
    }).join('')}
    ${fiches.length === 0 ? `<div style="text-align:center;padding:40px;color:var(--cal-text-3)">${calT('cal_no_sheets')}</div>` : ''}
  </div>
  `;
}

// ── View: Conflits ───────────────────────────────────────────
function renderCalConflits() {
  const conflits = CAL_DATA.conflits;
  const ouverts  = conflits.filter(c => c.statut === 'ouvert');
  return `
  <div class="cal-toolbar">
    <div>
      <div class="cal-title">${calT('cal_conflicts_title')}</div>
      <div class="cal-sub">${calT('cal_conflicts_subtitle')}</div>
    </div>
  </div>

  ${ouverts.length > 0 ? `
  <div class="cal-conflit-bar" style="margin-bottom:16px">
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
    <strong>${ouverts.length} ${calT('cal_open_conflicts')}</strong> ${calT('cal_conflicts_action_needed')}
  </div>` : `
  <div style="background:var(--cal-green-light);border:1px solid var(--cal-green);border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;margin-bottom:16px;font-size:13px;color:var(--cal-green)">
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    ${calT('cal_no_conflicts')}
  </div>`}

  <div style="display:flex;flex-direction:column;gap:10px">
    ${conflits.map(c => `
    <div style="background:var(--cal-surface-2);border:1px solid ${c.statut==='ouvert'?'var(--cal-red)':'var(--cal-border)'};border-left:3px solid ${c.statut==='ouvert'?'var(--cal-red)':'var(--cal-green)'};border-radius:10px;padding:14px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
        <div>
          <span class="cal-badge ${c.statut==='ouvert'?'cal-badge-rejete':'cal-badge-valide'}" style="margin-bottom:6px;display:inline-flex">${c.statut==='ouvert'?'! '+calT('cal_open'):'✓ '+calT('cal_resolved')}</span>
          <div style="font-weight:600;color:var(--cal-text);font-size:13px">${calT('cal_conflict')} ${c.type} — ${c.date}</div>
          <div style="font-size:12px;color:var(--cal-text-3);margin-top:2px">${c.lieu}</div>
        </div>
        ${c.statut === 'ouvert' ? `
        <div style="display:flex;gap:6px">
          <button class="cal-btn cal-btn-success cal-btn-sm" onclick="calResoudreConflit(${c.id})">${calT('cal_resolve')}</button>
          <button class="cal-btn cal-btn-outline cal-btn-sm" onclick="calIgnorerConflit(${c.id})">${calT('cal_ignore')}</button>
        </div>` : ''}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
        <div style="background:var(--cal-red-light);border-radius:8px;padding:8px">
          <div style="font-size:10px;font-weight:700;color:var(--cal-red);margin-bottom:4px">${calT('cal_event_a')}</div>
          <div style="color:var(--cal-text);font-weight:600">${c.titre_a}</div>
        </div>
        <div style="background:var(--cal-red-light);border-radius:8px;padding:8px">
          <div style="font-size:10px;font-weight:700;color:var(--cal-red);margin-bottom:4px">${calT('cal_event_b')}</div>
          <div style="color:var(--cal-text);font-weight:600">${c.titre_b}</div>
        </div>
      </div>
      <div style="margin-top:8px;font-size:12px;color:var(--cal-text-2);background:var(--cal-surface);border-radius:6px;padding:8px">
        ${c.description}
      </div>
    </div>
    `).join('')}
  </div>
  `;
}

// ── Modals ───────────────────────────────────────────────────
function calOpenModal(mode, id = null) {
  CAL_STATE.modalMode = mode;
  CAL_STATE.selectedId = id;
  const overlay = document.getElementById('cal-modal-overlay');
  overlay.style.display = 'flex';
  overlay.className = 'cal-overlay';
  overlay.innerHTML = _calModalContent(mode, id);
}

function calCloseModal() {
  const overlay = document.getElementById('cal-modal-overlay');
  if (overlay) { overlay.style.display = 'none'; overlay.innerHTML = ''; }
}

function _calModalContent(mode, id) {
  if (mode === 'create-event' || mode === 'edit-event') {
    const evt = mode === 'edit-event' ? CAL_DATA.evenements.find(e => e.id === id) : null;
    const title = evt ? calT('cal_edit_event') : calT('cal_new_event');
    return `
    <div class="cal-modal" onclick="event.stopPropagation()">
      <div class="cal-modal-header">
        <div style="font-size:15px;font-weight:700;color:var(--cal-text)">${title}</div>
        <button class="cal-btn cal-btn-outline cal-btn-sm" onclick="calCloseModal()">✕</button>
      </div>
      <div class="cal-modal-body">
        <div class="cal-form-grid">
          <div class="cal-form-group cal-form-full">
            <label class="cal-label">${calT('cal_title')} *</label>
            <input id="cal-f-titre" class="cal-input" value="${evt?.titre||''}" placeholder="${calT('cal_event_title_placeholder')}" style="width:100%;box-sizing:border-box">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_type')} *</label>
            <select id="cal-f-type" class="cal-select">
              ${['match','competition','manifestation','stage','formation','entrainement'].map(t =>
                `<option value="${t}" ${evt?.type===t?'selected':''}>${calT('cal_type_'+t)||t.charAt(0).toUpperCase()+t.slice(1)}</option>`
              ).join('')}
            </select>
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_classification')} (1-9) * <span style="font-size:10px;color:var(--cal-text-3)">${calT('cal_classification_hint')}</span></label>
            <select id="cal-f-classif" class="cal-select">
              ${Array.from({length:9},(_,i)=>i+1).map(n =>
                `<option value="${n}" ${evt?.classification===n?'selected':''}>${n}</option>`
              ).join('')}
            </select>
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_vigilance_level')}</label>
            <select id="cal-f-vigilance" class="cal-select">
              ${['normal','surveille','sensible'].map(v =>
                `<option value="${v}" ${evt?.niveau_vigilance===v?'selected':''}>${calT('cal_vigilance_'+v)}</option>`
              ).join('')}
            </select>
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_start_date')} *</label>
            <input id="cal-f-date-debut" type="date" class="cal-input" value="${evt?.date_debut||''}">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_end_date')} *</label>
            <input id="cal-f-date-fin" type="date" class="cal-input" value="${evt?.date_fin||''}">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_start_time')}</label>
            <input id="cal-f-heure-debut" type="time" class="cal-input" value="${evt?.heure_debut||''}">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_end_time')}</label>
            <input id="cal-f-heure-fin" type="time" class="cal-input" value="${evt?.heure_fin||''}">
          </div>
          <div class="cal-form-group cal-form-full">
            <label class="cal-label">${calT('cal_venue')}</label>
            <input id="cal-f-lieu" class="cal-input" value="${evt?.lieu||''}" placeholder="${calT('cal_venue_placeholder')}" style="width:100%;box-sizing:border-box">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_region')}</label>
            <select id="cal-f-region" class="cal-select">
              <option value="">— ${calT('cal_choose')} —</option>
              ${['Tunis','Ariana','Ben Arous','Manouba','Nabeul','Zaghouan','Bizerte','Béja','Jendouba','Kef','Siliana','Sousse','Monastir','Mahdia','Sfax','Kairouan','Kasserine','Sidi Bouzid','Gabès','Médenine','Tataouine','Gafsa','Tozeur','Kebili'].map(r =>
                `<option value="${r}" ${evt?.region===r?'selected':''}>${r}</option>`
              ).join('')}
            </select>
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_federation')}</label>
            <select id="cal-f-fed" class="cal-select">
              <option value="">— ${calT('cal_choose')} —</option>
              ${['Football','Handball','Basket-ball','Volleyball','Athlétisme','Natation','Tennis','Boxe','Judo','Multi-sports'].map(f =>
                `<option value="${f}" ${evt?.federation===f?'selected':''}>${f}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="cal-modal-footer">
        <button class="cal-btn cal-btn-outline" onclick="calCloseModal()">${calT('cal_cancel')}</button>
        <button class="cal-btn cal-btn-primary" onclick="${evt?`calUpdateEvent(${id})`:'calCreateEvent()'}">
          ${evt ? calT('cal_save') : calT('cal_create_event')}
        </button>
      </div>
    </div>`;
  }

  if (mode === 'create-cal' || mode === 'edit-cal') {
    const cal = mode === 'edit-cal' ? CAL_DATA.calendriers.find(c => c.id === id) : null;
    return `
    <div class="cal-modal" onclick="event.stopPropagation()">
      <div class="cal-modal-header">
        <div style="font-size:15px;font-weight:700;color:var(--cal-text)">${cal?calT('cal_edit_calendar'):calT('cal_new_calendar')}</div>
        <button class="cal-btn cal-btn-outline cal-btn-sm" onclick="calCloseModal()">✕</button>
      </div>
      <div class="cal-modal-body">
        <div class="cal-form-grid">
          <div class="cal-form-group cal-form-full">
            <label class="cal-label">${calT('cal_title')} *</label>
            <input id="cal-c-titre" class="cal-input" value="${cal?.titre||''}" placeholder="${calT('cal_calendar_title_placeholder')}" style="width:100%;box-sizing:border-box">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_type')}</label>
            <select id="cal-c-type" class="cal-select">
              ${['annuel','mensuel','hebdomadaire','global'].map(t =>
                `<option value="${t}" ${cal?.type===t?'selected':''}>${calT('cal_calendar_type_'+t)}</option>`
              ).join('')}
            </select>
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_level')}</label>
            <select id="cal-c-niveau" class="cal-select">
              ${['national','regional','federation','local'].map(n =>
                `<option value="${n}" ${cal?.niveau===n?'selected':''}>${calT('cal_level_'+n)}</option>`
              ).join('')}
            </select>
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_year')}</label>
            <input id="cal-c-annee" type="number" class="cal-input" value="${cal?.annee||new Date().getFullYear()}" min="2024" max="2030">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_month_if_monthly')}</label>
            <select id="cal-c-mois" class="cal-select">
              <option value="">—</option>
              ${[calT('cal_jan'), calT('cal_feb'), calT('cal_mar'), calT('cal_apr'), calT('cal_may'), calT('cal_jun'), calT('cal_jul'), calT('cal_aug'), calT('cal_sep'), calT('cal_oct'), calT('cal_nov'), calT('cal_dec')].map((m,i) =>
                `<option value="${i+1}" ${cal?.mois===i+1?'selected':''}>${m}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="cal-modal-footer">
        <button class="cal-btn cal-btn-outline" onclick="calCloseModal()">${calT('cal_cancel')}</button>
        <button class="cal-btn cal-btn-primary" onclick="${cal?`calUpdateCal(${id})`:'calCreateCal()'}">
          ${cal ? calT('cal_save') : calT('cal_create')}
        </button>
      </div>
    </div>`;
  }

  if (mode === 'fiche' || mode === 'edit-fiche') {
    const fiche = mode === 'edit-fiche' ? CAL_DATA.fiches.find(f => f.id === id) : null;
    return `
    <div class="cal-modal" onclick="event.stopPropagation()">
      <div class="cal-modal-header">
        <div style="font-size:15px;font-weight:700;color:var(--cal-text)">${fiche?calT('cal_edit_sheet'):calT('cal_new_sheet')}</div>
        <button class="cal-btn cal-btn-outline cal-btn-sm" onclick="calCloseModal()">✕</button>
      </div>
      <div class="cal-modal-body">
        <div class="cal-form-grid">
          <div class="cal-form-group cal-form-full">
            <label class="cal-label">${calT('cal_linked_event')} *</label>
            <select id="cal-fi-evt" class="cal-select">
              ${CAL_DATA.evenements.filter(e=>e.type==='match'||e.type==='competition').map(e =>
                `<option value="${e.id}" ${fiche?.evenement_id===e.id?'selected':''}>${e.titre} — ${e.date_debut}</option>`
              ).join('')}
            </select>
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_home_team')}</label>
            <input id="cal-fi-dom" class="cal-input" value="${fiche?.equipe_domicile||''}" placeholder="${calT('cal_team_name')}">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_away_team')}</label>
            <input id="cal-fi-vis" class="cal-input" value="${fiche?.equipe_visiteur||''}" placeholder="${calT('cal_team_name')}">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_home_score')}</label>
            <input id="cal-fi-sd" type="number" class="cal-input" value="${fiche?.score_domicile??''}" min="0">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_away_score')}</label>
            <input id="cal-fi-sv" type="number" class="cal-input" value="${fiche?.score_visiteur??''}" min="0">
          </div>
          <div class="cal-form-group cal-form-full">
            <label class="cal-label">${calT('cal_main_referee')}</label>
            <input id="cal-fi-arb" class="cal-input" value="${fiche?.arbitre_principal||''}" placeholder="${calT('cal_full_name')}" style="width:100%;box-sizing:border-box">
          </div>
          <div class="cal-form-group cal-form-full">
            <label class="cal-label">${calT('cal_assistant_referees')}</label>
            <input id="cal-fi-arb2" class="cal-input" value="${fiche?.arbitres_assistants||''}" placeholder="${calT('cal_separate_by_comma')}" style="width:100%;box-sizing:border-box">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_spectators')}</label>
            <input id="cal-fi-spec" type="number" class="cal-input" value="${fiche?.spectateurs||0}" min="0">
          </div>
          <div class="cal-form-group">
            <label class="cal-label">${calT('cal_status')}</label>
            <select id="cal-fi-statut" class="cal-select">
              <option value="en_cours" ${fiche?.statut==='en_cours'?'selected':''}>${calT('cal_in_progress')}</option>
              <option value="cloture" ${fiche?.statut==='cloture'?'selected':''}>${calT('cal_closed')}</option>
            </select>
          </div>
          <div class="cal-form-group cal-form-full">
            <label class="cal-label">${calT('cal_incidents')}</label>
            <input id="cal-fi-inc" class="cal-input" value="${fiche?.incidents||''}" placeholder="${calT('cal_no_incidents')}" style="width:100%;box-sizing:border-box">
          </div>
        </div>
      </div>
      <div class="cal-modal-footer">
        <button class="cal-btn cal-btn-outline" onclick="calCloseModal()">${calT('cal_cancel')}</button>
        <button class="cal-btn cal-btn-primary" onclick="${fiche?`calUpdateFiche(${id})`:'calCreateFiche()'}">
          ${fiche ? calT('cal_save') : calT('cal_create_sheet')}
        </button>
      </div>
    </div>`;
  }
  return '';
}

// ── CRUD: Événements ─────────────────────────────────────────
function calCreateEvent() {
  const titre = document.getElementById('cal-f-titre').value.trim();
  if (!titre) { calToast('⚠ ' + calT('cal_title_required')); return; }

  const newEvt = {
    id:               _calNextId(CAL_DATA.evenements),
    titre,
    type:             document.getElementById('cal-f-type').value,
    classification:   parseInt(document.getElementById('cal-f-classif').value),
    niveau_vigilance: document.getElementById('cal-f-vigilance').value,
    date_debut:       document.getElementById('cal-f-date-debut').value,
    date_fin:         document.getElementById('cal-f-date-fin').value,
    heure_debut:      document.getElementById('cal-f-heure-debut').value,
    heure_fin:        document.getElementById('cal-f-heure-fin').value,
    lieu:             document.getElementById('cal-f-lieu').value,
    region:           document.getElementById('cal-f-region').value,
    federation:       document.getElementById('cal-f-fed').value,
    statut:           'brouillon',
    conflit:          false,
    created_by:       localStorage.getItem('userEmail') || 'admin@sgs.gov',
  };

  const conflict = CAL_DATA.evenements.find(e =>
    e.lieu === newEvt.lieu && e.lieu &&
    e.date_debut <= newEvt.date_fin &&
    e.date_fin   >= newEvt.date_debut &&
    e.id !== newEvt.id
  );
  if (conflict) {
    newEvt.conflit = true;
    CAL_DATA.conflits.push({
      id: _calNextId(CAL_DATA.conflits),
      evenement_a: conflict.id, titre_a: conflict.titre,
      evenement_b: newEvt.id,  titre_b: newEvt.titre,
      type: 'infrastructure', lieu: newEvt.lieu,
      date: newEvt.date_debut, statut: 'ouvert',
      description: `${calT('cal_conflict_desc_1')} "${newEvt.lieu}" ${calT('cal_conflict_desc_2')}`,
    });
    conflict.conflit = true;
  }

  CAL_DATA.evenements.push(newEvt);
  calCloseModal();
  calSwitchView('evenements');
  calToast(`✓ ${calT('cal_event_created')} "${titre}"${conflict ? ' — ⚠ ' + calT('cal_conflict_detected') : ''}`);
}

function calUpdateEvent(id) {
  const evt = CAL_DATA.evenements.find(e => e.id === id);
  if (!evt) return;
  const titre = document.getElementById('cal-f-titre').value.trim();
  if (!titre) { calToast('⚠ ' + calT('cal_title_required')); return; }

  evt.titre           = titre;
  evt.type            = document.getElementById('cal-f-type').value;
  evt.classification  = parseInt(document.getElementById('cal-f-classif').value);
  evt.niveau_vigilance= document.getElementById('cal-f-vigilance').value;
  evt.date_debut      = document.getElementById('cal-f-date-debut').value;
  evt.date_fin        = document.getElementById('cal-f-date-fin').value;
  evt.heure_debut     = document.getElementById('cal-f-heure-debut').value;
  evt.heure_fin       = document.getElementById('cal-f-heure-fin').value;
  evt.lieu            = document.getElementById('cal-f-lieu').value;
  evt.region          = document.getElementById('cal-f-region').value;
  evt.federation      = document.getElementById('cal-f-fed').value;

  calCloseModal();
  calSwitchView('evenements');
  calToast(`✓ ${calT('cal_event_updated')} "${titre}"`);
}

function calDeleteEvent(id) {
  if (!confirm(calT('cal_confirm_delete_event'))) return;
  const idx = CAL_DATA.evenements.findIndex(e => e.id === id);
  if (idx !== -1) CAL_DATA.evenements.splice(idx, 1);
  CAL_DATA.conflits = CAL_DATA.conflits.filter(c => c.evenement_a !== id && c.evenement_b !== id);
  const tbody = document.getElementById('cal-events-tbody');
  if (tbody) tbody.innerHTML = renderEventRows(CAL_DATA.evenements);
  calToast(calT('cal_event_deleted'));
}

function calSubmitEvent(id) {
  const evt = CAL_DATA.evenements.find(e => e.id === id);
  if (!evt) return;
  if (evt.conflit) { calToast('⚠ ' + calT('cal_resolve_conflict_first')); return; }
  evt.statut = 'soumis';
  const tbody = document.getElementById('cal-events-tbody');
  if (tbody) tbody.innerHTML = renderEventRows(CAL_DATA.evenements);
  calToast(`✓ "${evt.titre}" ${calT('cal_submitted_for_validation')}`);
}

function calSelectEvent(id) {
  CAL_STATE.selectedId = id;
}

function calFilterEvents(q) {
  const tbody = document.getElementById('cal-events-tbody');
  if (!tbody) return;
  const filtered = CAL_DATA.evenements.filter(e =>
    e.titre.toLowerCase().includes(q.toLowerCase()) ||
    e.lieu.toLowerCase().includes(q.toLowerCase()) ||
    e.region.toLowerCase().includes(q.toLowerCase())
  );
  tbody.innerHTML = renderEventRows(filtered);
}

function calFilterByType(type) {
  const tbody = document.getElementById('cal-events-tbody');
  if (!tbody) return;
  tbody.innerHTML = renderEventRows(type ? CAL_DATA.evenements.filter(e => e.type === type) : CAL_DATA.evenements);
}

function calFilterByStatut(statut) {
  const tbody = document.getElementById('cal-events-tbody');
  if (!tbody) return;
  tbody.innerHTML = renderEventRows(statut ? CAL_DATA.evenements.filter(e => e.statut === statut) : CAL_DATA.evenements);
}

// ── CRUD: Calendriers ────────────────────────────────────────
function calCreateCal() {
  const titre = document.getElementById('cal-c-titre').value.trim();
  if (!titre) { calToast('⚠ ' + calT('cal_title_required')); return; }
  CAL_DATA.calendriers.push({
    id:    _calNextId(CAL_DATA.calendriers),
    titre,
    type:  document.getElementById('cal-c-type').value,
    niveau:document.getElementById('cal-c-niveau').value,
    annee: parseInt(document.getElementById('cal-c-annee').value),
    mois:  parseInt(document.getElementById('cal-c-mois').value) || null,
    statut:'brouillon',
    created_by: localStorage.getItem('userEmail') || 'admin@sgs.gov',
    nb_evenements: 0,
  });
  calCloseModal();
  calSwitchView('calendriers');
  calToast(`✓ ${calT('cal_calendar_created')} "${titre}"`);
}

function calUpdateCal(id) {
  const cal = CAL_DATA.calendriers.find(c => c.id === id);
  if (!cal) return;
  cal.titre  = document.getElementById('cal-c-titre').value.trim();
  cal.type   = document.getElementById('cal-c-type').value;
  cal.niveau = document.getElementById('cal-c-niveau').value;
  cal.annee  = parseInt(document.getElementById('cal-c-annee').value);
  cal.mois   = parseInt(document.getElementById('cal-c-mois').value) || null;
  calCloseModal();
  calSwitchView('calendriers');
  calToast(`✓ ${calT('cal_calendar_updated')}`);
}

function calDeleteCal(id) {
  if (!confirm(calT('cal_confirm_delete_calendar'))) return;
  const idx = CAL_DATA.calendriers.findIndex(c => c.id === id);
  if (idx !== -1) CAL_DATA.calendriers.splice(idx, 1);
  calSwitchView('calendriers');
  calToast(calT('cal_calendar_deleted'));
}

function calPublishCal(id) {
  const cal = CAL_DATA.calendriers.find(c => c.id === id);
  if (!cal) return;
  cal.statut = 'publie';
  calSwitchView('calendriers');
  calToast(`✓ "${cal.titre}" ${calT('cal_published_and_distributed')}`);
}

// ── CRUD: Fiches ─────────────────────────────────────────────
function calCreateFiche() {
  const evtId = parseInt(document.getElementById('cal-fi-evt').value);
  if (!evtId) { calToast('⚠ ' + calT('cal_select_event_first')); return; }
  CAL_DATA.fiches.push({
    id:                 _calNextId(CAL_DATA.fiches),
    evenement_id:       evtId,
    equipe_domicile:    document.getElementById('cal-fi-dom').value,
    equipe_visiteur:    document.getElementById('cal-fi-vis').value,
    score_domicile:     document.getElementById('cal-fi-sd').value !== '' ? parseInt(document.getElementById('cal-fi-sd').value) : null,
    score_visiteur:     document.getElementById('cal-fi-sv').value !== '' ? parseInt(document.getElementById('cal-fi-sv').value) : null,
    arbitre_principal:  document.getElementById('cal-fi-arb').value,
    arbitres_assistants:document.getElementById('cal-fi-arb2').value,
    spectateurs:        parseInt(document.getElementById('cal-fi-spec').value) || 0,
    incidents:          document.getElementById('cal-fi-inc').value || 'RAS',
    statut:             document.getElementById('cal-fi-statut').value,
  });
  calCloseModal();
  calSwitchView('fiches');
  calToast('✓ ' + calT('cal_sheet_created'));
}

function calUpdateFiche(id) {
  const f = CAL_DATA.fiches.find(x => x.id === id);
  if (!f) return;
  f.equipe_domicile     = document.getElementById('cal-fi-dom').value;
  f.equipe_visiteur     = document.getElementById('cal-fi-vis').value;
  f.score_domicile      = document.getElementById('cal-fi-sd').value !== '' ? parseInt(document.getElementById('cal-fi-sd').value) : null;
  f.score_visiteur      = document.getElementById('cal-fi-sv').value !== '' ? parseInt(document.getElementById('cal-fi-sv').value) : null;
  f.arbitre_principal   = document.getElementById('cal-fi-arb').value;
  f.arbitres_assistants = document.getElementById('cal-fi-arb2').value;
  f.spectateurs         = parseInt(document.getElementById('cal-fi-spec').value) || 0;
  f.incidents           = document.getElementById('cal-fi-inc').value || 'RAS';
  f.statut              = document.getElementById('cal-fi-statut').value;
  calCloseModal();
  calSwitchView('fiches');
  calToast('✓ ' + calT('cal_sheet_updated'));
}

function calDeleteFiche(id) {
  if (!confirm(calT('cal_confirm_delete_sheet'))) return;
  CAL_DATA.fiches = CAL_DATA.fiches.filter(f => f.id !== id);
  calSwitchView('fiches');
  calToast(calT('cal_sheet_deleted'));
}

// ── CRUD: Conflits ───────────────────────────────────────────
function calResoudreConflit(id) {
  const c = CAL_DATA.conflits.find(x => x.id === id);
  if (!c) return;
  c.statut = 'resolu';
  [c.evenement_a, c.evenement_b].forEach(eid => {
    const evt = CAL_DATA.evenements.find(e => e.id === eid);
    if (evt) {
      const stillConflicted = CAL_DATA.conflits.some(x =>
        x.statut === 'ouvert' && (x.evenement_a === eid || x.evenement_b === eid)
      );
      if (!stillConflicted) evt.conflit = false;
    }
  });
  calSwitchView('conflits');
  calToast('✓ ' + calT('cal_conflict_marked_resolved'));
}

function calIgnorerConflit(id) {
  const c = CAL_DATA.conflits.find(x => x.id === id);
  if (!c) return;
  c.statut = 'ignore';
  calSwitchView('conflits');
  calToast(calT('cal_conflict_ignored'));
}

// ── Navigation ───────────────────────────────────────────────
function calSwitchView(view) {
  CAL_STATE.view = view;
  
  // Update view visibility
  ['evenements', 'calendriers', 'fiches', 'conflits'].forEach(v => {
    const el = document.getElementById(`cal-view-${v}`);
    if (el) el.classList.toggle('cal-view-active', v === view);
  });
  
  // Update tab active states
  ['evenements', 'calendriers', 'fiches', 'conflits'].forEach(v => {
    const tab = document.getElementById(`cal-tab-${v}`);
    if (tab) tab.classList.toggle('active', v === view);
  });
  
  // Re-render the active view
  const el = document.getElementById(`cal-view-${view}`);
  if (!el) return;
  
  const renders = {
    evenements: renderCalEvenements,
    calendriers: renderCalCalendriers,
    fiches: renderCalFiches,
    conflits: renderCalConflits,
  };
  
  if (renders[view]) el.innerHTML = renders[view]();
}

function calToggleCalView(mode, btn) {
  document.querySelectorAll('[data-cal-view]').forEach(b => b.classList.remove('cal-tab-active'));
  btn.classList.add('cal-tab-active');
  document.getElementById('cal-calendriers-table-view').style.display = mode === 'table' ? '' : 'none';
  document.getElementById('cal-calendriers-grid-view').style.display  = mode === 'grid'  ? '' : 'none';
  if (mode === 'grid') {
    document.getElementById('cal-calendriers-grid-view').innerHTML = renderMonthGrid();
  }
}

function calPrevMonth() {
  CAL_STATE.currentMonth--;
  if (CAL_STATE.currentMonth < 0) { CAL_STATE.currentMonth = 11; CAL_STATE.currentYear--; }
  document.getElementById('cal-calendriers-grid-view').innerHTML = renderMonthGrid();
}

function calNextMonth() {
  CAL_STATE.currentMonth++;
  if (CAL_STATE.currentMonth > 11) { CAL_STATE.currentMonth = 0; CAL_STATE.currentYear++; }
  document.getElementById('cal-calendriers-grid-view').innerHTML = renderMonthGrid();
}

// ── Init ─────────────────────────────────────────────────────
function initCalendarModule() {
  window.calendarModule = {
    role:       localStorage.getItem('userRole') || 'super_admin',
    region:     localStorage.getItem('userRegion'),
    federation: localStorage.getItem('userFederation'),
  };
  return window.calendarModule;
}

// ── Global exports ───────────────────────────────────────────
window.initCalendarModule   = initCalendarModule;
window.renderCalendarModule = renderCalendarModule;
window.calSwitchView        = calSwitchView;
window.calToggleCalView     = calToggleCalView;
window.calPrevMonth         = calPrevMonth;
window.calNextMonth         = calNextMonth;
window.calOpenModal         = calOpenModal;
window.calCloseModal        = calCloseModal;
window.calCreateEvent       = calCreateEvent;
window.calUpdateEvent       = calUpdateEvent;
window.calDeleteEvent       = calDeleteEvent;
window.calSubmitEvent       = calSubmitEvent;
window.calSelectEvent       = calSelectEvent;
window.calFilterEvents      = calFilterEvents;
window.calFilterByType      = calFilterByType;
window.calFilterByStatut    = calFilterByStatut;
window.calCreateCal         = calCreateCal;
window.calUpdateCal         = calUpdateCal;
window.calDeleteCal         = calDeleteCal;
window.calPublishCal        = calPublishCal;
window.calCreateFiche       = calCreateFiche;
window.calUpdateFiche       = calUpdateFiche;
window.calDeleteFiche       = calDeleteFiche;
window.calResoudreConflit   = calResoudreConflit;
window.calIgnorerConflit    = calIgnorerConflit;
window.calToast             = calToast;