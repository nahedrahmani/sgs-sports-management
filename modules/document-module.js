// ============================================================
// DOCUMENT MODULE 
// ============================================================
function docT(key) {
  if (typeof t === 'function') return t(key);
  if (typeof TRANSLATIONS !== 'undefined') {
    const lang = localStorage.getItem('sgs-lang') || 'fr';
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['fr']?.[key] || key;
  }
  return key;
}

// ── Styles ───────────────────────────────────
(function injectDocStyles() {
  if (document.getElementById('doc-module-styles')) return;
  const s = document.createElement('style');
  s.id = 'doc-module-styles';
  s.textContent = `
    :root {
      /* Brand */
      --doc-navy:         #1A237E;
      --doc-navy-dark:    #283593;
      --doc-red:          #E42125;
      /* Semantic — light mode */
      --doc-green:        #1B5E20;
      --doc-green-light:  #E8F5E9;
      --doc-amber:        #E65100;
      --doc-amber-light:  #FFF3E0;
      --doc-blue-pale:    #E8EAF6;
      --doc-purple:       #4527A0;
      --doc-purple-light: #EDE7F6;
      /* Surface — light */
      --doc-surface:   #ffffff;
      --doc-surface-2: #f8fafc;
      --doc-surface-3: #f1f5f9;
      --doc-border:    #e2e8f0;
      --doc-border-2:  #f1f5f9;
      --doc-text:      #1e293b;
      --doc-text-2:    #475569;
      --doc-text-3:    #94a3b8;
      /* Hash / mono color — light */
      --doc-mono-color: #1A237E;
    }
    html.dark {
      /* Surface — dark */
      --doc-surface:   #1e293b;
      --doc-surface-2: #0f172a;
      --doc-surface-3: #1a2744;
      --doc-border:    #334155;
      --doc-border-2:  #263348;
      --doc-text:      #e2e8f0;
      --doc-text-2:    #94a3b8;
      --doc-text-3:    #64748b;
      /* Semantic fills — dark: enough opacity to be visible, not so much they burn */
      --doc-green:        #4ade80;
      --doc-green-light:  rgba(74,222,128,.12);
      --doc-amber:        #fb923c;
      --doc-amber-light:  rgba(251,146,60,.13);
      --doc-blue-pale:    rgba(99,131,255,.18);
      --doc-purple:       #a78bfa;
      --doc-purple-light: rgba(167,139,250,.15);
      /* Hash / mono — dark: readable cyan-ish */
      --doc-mono-color: #7dd3fc;
    }

    /* ── KPI Cards ── */
    .doc-kpi { transition:transform .18s,box-shadow .18s; background:var(--doc-surface); border:1px solid var(--doc-border); border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:12px; }
    .doc-kpi:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(26,35,126,.1); }

    /* ── Table rows ── */
    .doc-tr { transition:background .12s; cursor:pointer; }
    .doc-tr:hover td { background:var(--doc-surface-3) !important; }

    /* ── Status badges ── */
    .doc-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:999px; font-size:11px; font-weight:600; }
    .doc-badge-dot { width:5px; height:5px; border-radius:50%; }
    .doc-badge-valid   { background:var(--doc-green-light); color:var(--doc-green); }
    .doc-badge-valid .doc-badge-dot { background:var(--doc-green); }
    .doc-badge-pending { background:var(--doc-amber-light); color:var(--doc-amber); }
    .doc-badge-pending .doc-badge-dot { background:var(--doc-amber); }
    .doc-badge-draft   { background:var(--doc-surface-3); color:var(--doc-text-2); border:1px solid var(--doc-border); }
    .doc-badge-draft .doc-badge-dot { background:var(--doc-text-3); }
    .doc-badge-signed  { background:var(--doc-blue-pale); color:var(--doc-navy); }
    .doc-badge-signed .doc-badge-dot { background:var(--doc-navy); }
    html.dark .doc-badge-signed  { color:#93b4ff; }
    html.dark .doc-badge-signed .doc-badge-dot { background:#93b4ff; }
    .doc-badge-ai      { background:var(--doc-purple-light); color:var(--doc-purple); }

    /* ── Modal overlay ── */
    .doc-overlay { position:fixed; inset:0; background:rgba(10,15,50,.5); backdrop-filter:blur(3px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
    .doc-modal { background:var(--doc-surface); border-radius:16px; width:100%; max-width:640px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 64px rgba(10,15,50,.25); }
    .doc-modal-header { padding:20px 24px 16px; border-bottom:1px solid var(--doc-border); position:sticky; top:0; background:var(--doc-surface); z-index:1; display:flex; justify-content:space-between; align-items:center; }
    .doc-modal-body   { padding:20px 24px; background:var(--doc-surface); color:var(--doc-text); }
    .doc-modal-footer { padding:14px 24px; border-top:1px solid var(--doc-border); display:flex; justify-content:flex-end; gap:8px; position:sticky; bottom:0; background:var(--doc-surface); }

    /* ── Signature canvas ── */
    .doc-sig-canvas { border:2px dashed var(--doc-border); border-radius:10px; background:var(--doc-surface-2); cursor:crosshair; display:block; width:100%; touch-action:none; }

    /* ── Hash block ── */
    .doc-hash { background:var(--doc-surface-2); border:1px solid var(--doc-border); border-radius:8px; padding:10px 12px; font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--doc-mono-color); word-break:break-all; }

    /* ── Chain steps ── */
    .doc-chain { display:flex; flex-direction:column; gap:0; }
    .doc-chain-step { display:flex; gap:10px; padding:8px 0; align-items:flex-start; position:relative; }
    .doc-chain-step:not(:last-child)::after { content:''; position:absolute; left:10px; top:26px; bottom:0; width:1px; background:var(--doc-border); }
    .doc-chain-dot { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; flex-shrink:0; z-index:1; }
    .doc-chain-done   { background:var(--doc-green-light); color:var(--doc-green); border:1.5px solid var(--doc-green); }
    .doc-chain-active { background:var(--doc-blue-pale); color:var(--doc-navy); border:1.5px solid var(--doc-navy); }
    .doc-chain-wait   { background:var(--doc-surface-3); color:var(--doc-text-3); border:1.5px solid var(--doc-border); }

    /* ── AI Chat ── */
    .doc-chat-bubble-bot  { background:var(--doc-surface-3); border:1px solid var(--doc-border); border-radius:12px 12px 12px 0; padding:10px 14px; font-size:12px; line-height:1.6; max-width:85%; color:var(--doc-text); }
    .doc-chat-bubble-user { background:var(--doc-navy); color:#fff; border-radius:12px 12px 0 12px; padding:10px 14px; font-size:12px; line-height:1.6; max-width:85%; }

    /* ── Step indicator ── */
    .doc-step-bar { display:flex; border:1px solid var(--doc-border); border-radius:8px; overflow:hidden; margin-bottom:18px; }
    .doc-step { flex:1; padding:8px 10px; font-size:11px; font-weight:500; text-align:center; background:var(--doc-surface-3); border-right:1px solid var(--doc-border); color:var(--doc-text-2); }
    .doc-step:last-child { border-right:none; }
    .doc-step.doc-step-done   { background:var(--doc-green-light); color:var(--doc-green); }
    .doc-step.doc-step-active { background:rgba(99,131,255,.28); color:var(--doc-navy); }
    html.dark .doc-step.doc-step-active { color:#93b4ff; }

    /* ── Tabs ── */
    .doc-tab-bar { display:flex; gap:2px; background:var(--doc-surface-3); border:1px solid var(--doc-border); border-radius:10px; padding:3px; width:fit-content; }
    .doc-tab { padding:6px 14px; border-radius:7px; font-size:12px; font-weight:500; cursor:pointer; color:var(--doc-text-2); transition:all .14s; border:none; background:transparent; }
    .doc-tab:hover { background:rgba(26,35,126,.07); color:var(--doc-navy); }
    .doc-tab.doc-tab-active { background:var(--doc-navy); color:#fff; }

    /* ── Buttons ── */
    .doc-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; font-size:12px; font-weight:500; cursor:pointer; border:none; transition:all .14s; font-family:inherit; }
    .doc-btn-primary { background:var(--doc-navy); color:#fff; }
    .doc-btn-primary:hover { background:var(--doc-navy-dark); }
    .doc-btn-outline { background:transparent; border:1px solid var(--doc-border); color:var(--doc-text-2); }
    .doc-btn-outline:hover { background:var(--doc-surface-2); }
    .doc-btn-ghost { background:transparent; color:var(--doc-text-3); }
    .doc-btn-ghost:hover { background:var(--doc-surface-3); }
    .doc-btn-danger { background:rgba(220,38,38,.12); color:#f87171; border:1px solid rgba(248,113,113,.35); }
    html:not(.dark) .doc-btn-danger { color:#DC2626; border-color:rgba(220,38,38,.3); }
    .doc-btn-success { background:var(--doc-green-light); color:var(--doc-green); border:1px solid var(--doc-green); }
    .doc-btn-ai { background:var(--doc-purple-light); color:var(--doc-purple); border:1px solid var(--doc-purple); }
    .doc-btn-sm { padding:4px 10px; font-size:11px; }
    .doc-btn-icon { padding:6px; border-radius:6px; }

    /* ── Form ── */
    .doc-input { height:36px; padding:0 12px; border:1px solid var(--doc-border); border-radius:8px; font-size:13px; font-family:inherit; outline:none; width:100%; transition:border-color .14s; background:var(--doc-surface); color:var(--doc-text); }
    .doc-input:focus { border-color:var(--doc-navy); }
    .doc-textarea { padding:10px 12px; border:1px solid var(--doc-border); border-radius:8px; font-size:13px; font-family:inherit; outline:none; resize:vertical; min-height:80px; width:100%; transition:border-color .14s; background:var(--doc-surface); color:var(--doc-text); }
    .doc-textarea:focus { border-color:var(--doc-navy); }
    .doc-label { font-size:11px; font-weight:600; color:var(--doc-text-2); display:block; margin-bottom:5px; }

    /* ── Toast ── */
    .doc-toast { position:fixed; bottom:20px; right:20px; background:var(--doc-navy); color:#fff; padding:10px 18px; border-radius:10px; font-size:12px; font-weight:500; display:flex; align-items:center; gap:8px; transform:translateY(80px); opacity:0; transition:all .3s cubic-bezier(.34,1.56,.64,1); z-index:999; pointer-events:none; }
    .doc-toast.doc-toast-show { transform:translateY(0); opacity:1; }

    /* ── Animations ── */
    @keyframes docFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    .doc-fade { animation:docFadeIn .3s ease forwards; }
    @keyframes docPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    .doc-pulse { animation:docPulse 2s infinite; }

    /* ── Split layout ── */
    .doc-split { display:grid; grid-template-columns:1fr 360px; gap:16px; }
    @media(max-width:900px) { .doc-split { grid-template-columns:1fr; } }

    /* ── Detail panel ── */
    .doc-detail { background:var(--doc-surface); border:1px solid var(--doc-border); border-radius:12px; height:fit-content; position:sticky; top:0; overflow:hidden; }
    .doc-detail-header { padding:14px 16px; border-bottom:1px solid var(--doc-border); }
    .doc-detail-body   { padding:14px 16px; }
    .doc-detail-footer { padding:12px 16px; border-top:1px solid var(--doc-border); display:flex; gap:8px; flex-wrap:wrap; }
    .doc-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--doc-border-2); font-size:12px; }
    .doc-row:last-child { border-bottom:none; }
    .doc-key { color:var(--doc-text-3); flex-shrink:0; width:110px; }
    .doc-val { font-weight:500; text-align:right; font-size:11px; color:var(--doc-text); }

    /* ── Gen box ── */
    .doc-gen-box { background:var(--doc-blue-pale); border:1px solid var(--doc-border); border-radius:10px; padding:14px; margin-bottom:16px; color:var(--doc-text); }
    html.dark .doc-gen-box { color:var(--doc-text-2); }
    /* info boxes that use inline color:var(--doc-navy) */
    html.dark [style*="color:var(--doc-navy)"] { color:var(--doc-text-2) !important; }

    /* ── Archive item ── */
    .doc-archive-item { display:flex; gap:10px; padding:10px 0; border-bottom:1px solid var(--doc-border-2); align-items:flex-start; }
    .doc-archive-item:last-child { border-bottom:none; }

    /* ── View tabs ── */
    .doc-view { display:none; }
    .doc-view.doc-view-active { display:block; }

    /* ── Sidenav ── */
    .doc-sidenav { display:flex; gap:6px; margin-bottom:16px; flex-wrap:wrap; }
    .doc-sidenav-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:9px; font-size:12px; font-weight:500; cursor:pointer; border:1px solid var(--doc-border); background:var(--doc-surface); color:var(--doc-text-2); transition:all .14s; }
    .doc-sidenav-btn:hover { background:var(--doc-surface-2); border-color:var(--doc-navy); color:var(--doc-navy); }
    .doc-sidenav-btn.active { background:var(--doc-navy); color:#fff; border-color:var(--doc-navy); }

    /* ── Signature pending items ── */
    .doc-sig-item { background:var(--doc-surface); border:1px solid var(--doc-border); border-radius:10px; padding:12px 14px; cursor:pointer; transition:all .14s; }
    .doc-sig-item.doc-sig-item--active { background:var(--doc-blue-pale); border:1.5px solid var(--doc-navy); }
    .doc-sig-item:hover { background:var(--doc-surface-2); }
  `;
  document.head.appendChild(s);
})();

// ── Data ────────────────────────────────────────────────────
const DOC_DATA = {
  docs: [
    { id:'AUT-2024-001', type:'aut', title:'Équipe Nationale Football', dest:'France — Paris', date:'2024-03-12', signer:'national.admin@sgs.gov', status:'signed',  origin:'auto',   classif:3, hash:'a3f7b2c1d4e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3' },
    { id:'AUT-2024-002', type:'aut', title:'Espérance Handball',        dest:'Sousse',        date:'2024-03-14', signer:null,                    status:'pending', origin:'manual', classif:2, hash:null },
    { id:'AUT-2024-003', type:'aut', title:'Club Africain',             dest:'Tunis',         date:'2024-03-15', signer:null,                    status:'draft',   origin:'manual', classif:1, hash:null },
    { id:'PV-2024-045',  type:'pv',  title:'Réunion préparation championnat', dest:'Ministère', date:'2024-03-15', signer:'national.admin@sgs.gov', status:'signed', origin:'ai', classif:2, hash:'b4e8c3d2f1a9e7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0' },
    { id:'PV-2024-046',  type:'pv',  title:'Réunion régionale Nord',   dest:'Gouvernorat',   date:'2024-03-16', signer:null,                    status:'pending', origin:'ai',     classif:1, hash:null },
    { id:'RAP-2024-089', type:'rap', title:'Championnat National Football', dest:'Rapport final', date:'2024-03-01', signer:'national.admin@sgs.gov', status:'signed', origin:'manual', classif:3, hash:'c5f9d4e3f2b1a0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4' },
  ],
  events: [
    { id:'EVT-001', title:'Championnat National Football', date:'2024-03-25', region:'Centre', classif:3 },
    { id:'EVT-002', title:'Meeting Athlétisme Régional',   date:'2024-03-28', region:'Nord',   classif:1 },
    { id:'EVT-003', title:'Stage Équipe Handball',         date:'2024-04-01', region:'Centre', classif:2 },
  ],
  ragResponses: {
    'autorisation': 'Pour rédiger une autorisation de déplacement, incluez obligatoirement :\n\n• Identification complète de l\'équipe et discipline\n• Destination précise (ville + pays)\n• Dates de départ et retour\n• Nature de l\'activité (match, stage, compétition)\n• Autorité délivrante + circuit de signatures\n\nSelon la classification 1-9, le nombre de signatures requis varie.\n\n📄 Source : Circulaire n°2023-045 du Ministère',
    'signature': 'Circuit de signature par classification :\n\n• Classification 1-3 : 1 signature (niveau régional)\n• Classification 4-6 : 2 signatures (régional + national)\n• Classification 7-9 : 3 signatures + transmission aux autorités sécuritaires\n\nAlgorithme utilisé : RSA-2048 SHA256\nArchivage : AES-256 · Conservation légale 10 ans\n\n📄 Source : Charte juridique CJ-2024-001',
    'pv': 'Un procès-verbal officiel doit comporter :\n\n• Titre, date et lieu de la réunion\n• Liste des participants avec qualités\n• Ordre du jour\n• Délibérations et décisions prises\n• Prochaines actions\n• Signatures des parties\n\nLe module IA génère automatiquement le PV depuis vos notes brutes via Mistral fine-tuné.\n\n📄 Source : Règlement RT-2024-008',
    'archivage': 'L\'archivage sécurisé fonctionne ainsi :\n\n• Chiffrement AES-256 à la sauvegarde\n• Stockage dans MinIO (coffre numérique)\n• Hash SHA-256 pour vérification d\'intégrité\n• QR code de vérification publique sur chaque document\n• Versionnement : chaque réédition conserve l\'original\n• Conservation légale : 10 ans minimum\n\n📄 Source : Procédure ARCH-2024-003',
    'default': 'Je suis l\'assistant RAG du SGS. Je peux vous aider sur :\n\n• La rédaction des documents officiels\n• Les procédures de signature et validation\n• Les règlements et circulaires internes\n• L\'archivage et la traçabilité\n\nPosez une question spécifique ou utilisez les suggestions ci-dessus.'
  },
  pvTemplate: `PROCÈS-VERBAL DE RÉUNION

Date : {date}
Lieu : Ministère de la Jeunesse et des Sports — Salle de conférence B

PRÉSENTS :
{participants}

ORDRE DU JOUR : {titre}

DÉLIBÉRATIONS ET DÉCISIONS :

{decisions}

La présente délibération est arrêtée et close à l'issue des échanges.

Pour validation et signature officielle.`
};

// ── State ────────────────────────────────────────────────────
const DOC_STATE = {
  activeTab:    'aut',
  selectedId:   null,
  sigDocId:     null,   // which doc is selected in the signature pad
  view:         'list',
  _sigData:     null,   // holds { drawing, lastX, lastY, tsInterval }
  pvGenerating: false,
};

// ── Helpers ──────────────────────────────────────────────────
function docBadge(status, origin) {
  const dot = '<span class="doc-badge-dot"></span>';
  const map = {
    signed:  `<span class="doc-badge doc-badge-signed">${dot}${docT('doc_status_signed')}</span>`,
    pending: `<span class="doc-badge doc-badge-pending">${dot}${docT('doc_status_pending')}</span>`,
    draft:   `<span class="doc-badge doc-badge-draft">${dot}${docT('doc_status_draft')}</span>`,
  };
  let extra = '';
  if (origin === 'ai')   extra = `<span class="doc-badge doc-badge-ai" style="margin-left:4px">${docT('doc_origin_ai')}</span>`;
  if (origin === 'auto') extra = `<span class="doc-badge doc-badge-valid" style="margin-left:4px">${docT('doc_origin_auto')}</span>`;
  return (map[status] || status) + extra;
}

function docToast(msg) {
  let el = document.getElementById('doc-toast-el');
  if (!el) {
    el = document.createElement('div');
    el.id = 'doc-toast-el';
    el.className = 'doc-toast';
    el.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span id="doc-toast-msg"></span>';
    document.body.appendChild(el);
  }
  document.getElementById('doc-toast-msg').textContent = msg;
  el.classList.add('doc-toast-show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('doc-toast-show'), 2800);
}

function docOpenModal(id)  { const el = document.getElementById(id); if (el) el.style.display = 'flex'; }
function docCloseModal(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }

// ── Signature canvas  ─────────────────────────────────

function _docSigDestroy() {
  // Clear the timestamp interval from any previous canvas session
  if (DOC_STATE._sigData && DOC_STATE._sigData.tsInterval) {
    clearInterval(DOC_STATE._sigData.tsInterval);
  }
  DOC_STATE._sigData = null;
}

function docInitCanvas() {
  _docSigDestroy(); // always clean up first

  const canvas = document.getElementById('doc-sig-canvas');
  if (!canvas) return;

  // Determine canvas stroke color from CSS variable (dark-mode safe)
  const strokeColor = getComputedStyle(document.documentElement).getPropertyValue('--doc-navy').trim() || '#1A237E';

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth   = 2;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';

  // Local state object — avoids polluting DOC_STATE with primitive flags
  const sig = { drawing: false, lastX: 0, lastY: 0, hasSigned: false, tsInterval: null };
  DOC_STATE._sigData = sig;

  const getXY = (e) => {
    const r   = canvas.getBoundingClientRect();
    const scx = canvas.width  / r.width;
    const scy = canvas.height / r.height;
    const src = e.touches ? e.touches[0] : e;
    return [(src.clientX - r.left) * scx, (src.clientY - r.top) * scy];
  };

  const onDown = (e) => {
    e.preventDefault();
    sig.drawing = true;
    [sig.lastX, sig.lastY] = getXY(e);
  };
  const onMove = (e) => {
    e.preventDefault();
    if (!sig.drawing) return;
    const [x, y] = getXY(e);
    ctx.beginPath();
    ctx.moveTo(sig.lastX, sig.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    sig.lastX   = x;
    sig.lastY   = y;
    sig.hasSigned = true;
    const hint = document.getElementById('doc-sig-hint');
    if (hint) hint.style.display = 'none';
  };
  const onUp = () => { sig.drawing = false; };

  canvas.addEventListener('mousedown',  onDown);
  canvas.addEventListener('mousemove',  onMove);
  canvas.addEventListener('mouseup',    onUp);
  canvas.addEventListener('mouseleave', onUp);
  canvas.addEventListener('touchstart', onDown, { passive: false });
  canvas.addEventListener('touchmove',  onMove, { passive: false });
  canvas.addEventListener('touchend',   onUp);

  // Live timestamp
  const tsEl = document.getElementById('sig-timestamp');
  const tick  = () => { if (tsEl) tsEl.textContent = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'; };
  tick();
  sig.tsInterval = setInterval(tick, 1000);
}

function docClearCanvas() {
  const canvas = document.getElementById('doc-sig-canvas');
  if (!canvas) return;
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  if (DOC_STATE._sigData) DOC_STATE._sigData.hasSigned = false;
  const hint = document.getElementById('doc-sig-hint');
  if (hint) hint.style.display = 'block';
}

function docSelectForSign(id) {
  DOC_STATE.sigDocId = id;
  const label = document.getElementById('sig-doc-label');
  if (label) label.textContent = id;
  document.querySelectorAll('.doc-sig-item').forEach(el => {
    el.classList.toggle('doc-sig-item--active', el.dataset.sigId === id);
  });
}

function docSign() {
  if (!DOC_STATE._sigData || !DOC_STATE._sigData.hasSigned) {
    docToast('⚠️ ' + docT('doc_toast_sign_required'));
    return;
  }
  if (!DOC_STATE.sigDocId) {
    docToast('⚠️ ' + docT('doc_toast_select_doc'));
    return;
  }
  // Mutate the data model
  const doc = DOC_DATA.docs.find(d => d.id === DOC_STATE.sigDocId);
  if (doc) {
    doc.status = 'signed';
    doc.signer = localStorage.getItem('userEmail') || 'superadmin@sgs.gov';
    doc.hash   = Array.from({length:64}, () =>
      '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
  }

  docToast('✓ ' + docT('doc_toast_signed'));
  docClearCanvas();
  DOC_STATE.sigDocId = null;

  // Refresh the signature pending list in place
  const sigView = document.getElementById('doc-view-signature');
  if (sigView) sigView.innerHTML = renderDocSignature();
  // Re-init canvas since we just replaced the DOM
  setTimeout(docInitCanvas, 80);

  // After 1.5s navigate to list and refresh it
  setTimeout(() => {
    // Refresh list tbody if visible
    const tbody = document.getElementById('doc-tbody');
    if (tbody) tbody.innerHTML = renderDocRows(
      DOC_DATA.docs.filter(d => d.type === DOC_STATE.activeTab)
    );
    docSwitchView('list');
  }, 1500);
}

// ── View switching ────────────────────────────────────────────
function docSwitchView(view) {
  // Clean up signature interval whenever we leave the signature view
  if (DOC_STATE.view === 'signature' && view !== 'signature') {
    _docSigDestroy();
  }
  // Reset pv generation lock when leaving AI view
  if (DOC_STATE.view === 'ai' && view !== 'ai') DOC_STATE.pvGenerating = false;
  DOC_STATE.view = view;
  ['list', 'ai', 'archive', 'signature'].forEach(v => {
    const el  = document.getElementById(`doc-view-${v}`);
    const btn = document.getElementById(`doc-nav-${v}`);
    if (el)  el.classList.toggle('doc-view-active', v === view);
    if (btn) btn.classList.toggle('active', v === view);
  });
  // Refresh the list view tbody when switching to it (data may have changed)
  if (view === 'list') {
    const tbody = document.getElementById('doc-tbody');
    if (tbody) tbody.innerHTML = renderDocRows(
      DOC_DATA.docs.filter(d => d.type === DOC_STATE.activeTab)
    );
  }
  if (view === 'signature') setTimeout(docInitCanvas, 80);
}

// ── Tab switching ─────────────────────────────────────────────
// Uses data-tab attribute instead of fragile text matching
function docSwitchTab(tab) {
  DOC_STATE.activeTab = tab;
  const filtered = DOC_DATA.docs.filter(d => d.type === tab);
  const tbody = document.getElementById('doc-tbody');
  if (tbody) tbody.innerHTML = renderDocRows(filtered);
  document.querySelectorAll('.doc-tab[data-tab]').forEach(btn => {
    btn.classList.toggle('doc-tab-active', btn.dataset.tab === tab);
  });
}

function docFilterTable(q) {
  const filtered = DOC_DATA.docs.filter(d =>
    d.type === DOC_STATE.activeTab &&
    (d.id.toLowerCase().includes(q.toLowerCase()) ||
     d.title.toLowerCase().includes(q.toLowerCase()))
  );
  const tbody = document.getElementById('doc-tbody');
  if (tbody) tbody.innerHTML = renderDocRows(filtered);
}

// ── Row selection / detail panel ──────────────────────────────
function docSelectRow(id) {
  DOC_STATE.selectedId = id;
  const doc = DOC_DATA.docs.find(d => d.id === id);
  if (!doc) return;
  const dp = el => document.getElementById(el);
  if (dp('dp-id'))    dp('dp-id').textContent    = doc.id;
  if (dp('dp-title')) dp('dp-title').textContent = doc.title;
  if (dp('dp-badge')) dp('dp-badge').innerHTML   = docBadge(doc.status, doc.origin);
  if (dp('dp-hash'))  dp('dp-hash').textContent  = doc.hash || '— pas encore signé';
}

function docShowDetail(id) {
  const doc = DOC_DATA.docs.find(d => d.id === id);
  if (!doc) return;
  document.getElementById('doc-detail-id').textContent   = doc.id;
  document.getElementById('doc-detail-title').textContent = doc.title;
  document.getElementById('doc-detail-badge').innerHTML   = docBadge(doc.status, doc.origin);
  document.getElementById('doc-detail-hash').textContent  = doc.hash || '— Document non signé, hash non calculé';

  const rows = [
    { k:'Destination',   v: doc.dest },
    { k:'Date',          v: doc.date },
    { k:'Classification',v: `${doc.classif} — ${doc.classif<=3?docT('doc_sig_1'):doc.classif<=6?docT('doc_sig_2'):docT('doc_sig_3_short')}` },
    { k:'Signataire',    v: doc.signer || '—' },
    { k:'Origine',       v: doc.origin==='ai'?'IA Mistral':doc.origin==='auto'?'Auto (workflow)':'Manuel' },
  ];
  document.getElementById('doc-detail-rows').innerHTML = rows.map(r =>
    `<div class="doc-row"><span class="doc-key">${r.k}</span><span class="doc-val">${r.v}</span></div>`
  ).join('');

  const cs  = doc.status==='signed'  ? ['done','done','done','done'] :
              doc.status==='pending' ? ['done','done','active','wait'] :
                                       ['done','active','wait','wait'];
  const cl  = [docT('doc_chain_submit'),docT('doc_chain_regional'),docT('doc_chain_national'),docT('doc_chain_archive')];
  const cm  = [docT('doc_chain_submitter'),docT('doc_chain_manager'), doc.signer||'En attente', doc.status==='signed'?doc.date:'—'];
  document.getElementById('doc-detail-chain').innerHTML = cl.map((l,i) => `
    <div class="doc-chain-step">
      <div class="doc-chain-dot doc-chain-${cs[i]}">${cs[i]==='done'?'✓':cs[i]==='active'?'◉':'○'}</div>
      <div>
        <div style="font-size:12px;font-weight:500;color:var(--doc-text)">${l}</div>
        <div style="font-size:11px;color:var(--doc-text-3);margin-top:1px">${cm[i]}</div>
      </div>
    </div>`).join('');

  const signBtn = document.getElementById('doc-detail-sign-btn');
  if (signBtn) signBtn.style.display = doc.status==='pending' ? '' : 'none';
  docOpenModal('doc-modal-detail');
}

function docDeleteDoc(id) {
  if (!confirm(docT('doc_confirm_delete').replace('{id}', id))) return;
  const i = DOC_DATA.docs.findIndex(d => d.id === id);
  if (i !== -1) DOC_DATA.docs.splice(i, 1);
  if (DOC_STATE.selectedId === id) DOC_STATE.selectedId = null;
  if (DOC_STATE.sigDocId  === id) DOC_STATE.sigDocId  = null;
  docToast(docT('doc_toast_deleted').replace('{id}', id));
  const tbody = document.getElementById('doc-tbody');
  if (tbody) tbody.innerHTML = renderDocRows(DOC_DATA.docs.filter(d => d.type === DOC_STATE.activeTab));
}

// ── Main render ───────────────────────────────────────────────
function renderDocumentModule() {
  return `
  <div id="doc-toast-el" class="doc-toast">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <span id="doc-toast-msg"></span>
  </div>

  <div class="doc-sidenav">
    <button class="doc-sidenav-btn active" onclick="docSwitchView('list')" id="doc-nav-list">
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      ${docT('doc_nav_docs')}
    </button>
    <button class="doc-sidenav-btn" onclick="docSwitchView('ai')" id="doc-nav-ai">
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      ${docT('doc_nav_ai')}
    </button>
    <button class="doc-sidenav-btn" onclick="docSwitchView('archive')" id="doc-nav-archive">
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
      ${docT('doc_nav_archive')}
    </button>
    <button class="doc-sidenav-btn" onclick="docSwitchView('signature')" id="doc-nav-signature">
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
      ${docT('doc_nav_sig')}
    </button>
  </div>

  <div id="doc-view-list"      class="doc-view doc-view-active">${renderDocList()}</div>
  <div id="doc-view-ai"        class="doc-view">${renderDocAI()}</div>
  <div id="doc-view-archive"   class="doc-view">${renderDocArchive()}</div>
  <div id="doc-view-signature" class="doc-view">${renderDocSignature()}</div>

  <!-- MODAL: Créer manuel -->
  <div id="doc-modal-create" class="doc-overlay" style="display:none" onclick="if(event.target===this)docCloseModal('doc-modal-create')">
    <div class="doc-modal doc-fade">
      <div class="doc-modal-header">
        <div>
          <div style="font-size:15px;font-weight:600;color:var(--doc-text)">${docT('doc_modal_new_title')}</div>
          <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px">${docT('doc_modal_new_sub')}</div>
        </div>
        <button class="doc-btn doc-btn-ghost doc-btn-icon" onclick="docCloseModal('doc-modal-create')">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="doc-modal-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div style="grid-column:span 2">
            <label class="doc-label">${docT('doc_field_type')}</label>
            <select class="doc-input" id="create-type">
              <option value="aut">${docT('doc_type_aut')}</option>
              <option value="pv">${docT('doc_type_pv')}</option>
              <option value="rap">${docT('doc_type_rap')}</option>
            </select>
          </div>
          <div>
            <label class="doc-label">${docT('doc_field_team')}</label>
            <input class="doc-input" id="create-title" placeholder="Nom de l'équipe">
          </div>
          <div>
            <label class="doc-label">${docT('doc_field_sport')}</label>
            <input class="doc-input" id="create-disc" placeholder="Football, Handball…">
          </div>
          <div>
            <label class="doc-label">${docT('doc_field_dest')}</label>
            <input class="doc-input" id="create-dest" placeholder="Ville, Pays">
          </div>
          <div>
            <label class="doc-label">${docT('doc_field_classif')}</label>
            <select class="doc-input" id="create-classif">
              ${Array.from({length:9},(_,i)=>`<option value="${i+1}">${i+1} — ${i<3?docT('doc_sig_1'):i<6?docT('doc_sig_2'):docT('doc_sig_3')}</option>`).join('')}
            </select>
          </div>
          <div><label class="doc-label">${docT('doc_field_depart')}</label><input type="date" class="doc-input" id="create-depart"></div>
          <div><label class="doc-label">${docT('doc_field_retour')}</label><input type="date" class="doc-input" id="create-retour"></div>
          <div style="grid-column:span 2">
            <label class="doc-label">${docT('doc_field_notes')}</label>
            <textarea class="doc-textarea" id="create-notes" placeholder="${docT('doc_field_notes_ph')}"></textarea>
          </div>
        </div>
        <div style="background:var(--doc-surface-2);border:1px solid var(--doc-border);border-radius:8px;padding:10px 12px;margin-top:12px;font-size:11px;color:var(--doc-text-2);display:flex;gap:16px;flex-wrap:wrap">
          <span>${docT('doc_hint_uuid')}</span><span>${docT('doc_hint_ntp')}</span><span>${docT('doc_hint_hash')}</span><span>${docT('doc_hint_formats')}</span>
        </div>
      </div>
      <div class="doc-modal-footer">
        <button class="doc-btn doc-btn-outline" onclick="docCloseModal('doc-modal-create')">${docT('doc_btn_cancel')}</button>
        <button class="doc-btn doc-btn-outline" onclick="docCloseModal('doc-modal-create');docToast('Brouillon sauvegardé')">${docT('doc_btn_draft')}</button>
        <button class="doc-btn doc-btn-primary" onclick="docSubmitCreate()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          ${docT('doc_btn_create_send')}
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: Générer auto -->
  <div id="doc-modal-generate" class="doc-overlay" style="display:none" onclick="if(event.target===this)docCloseModal('doc-modal-generate')">
    <div class="doc-modal doc-fade">
      <div class="doc-modal-header">
        <div>
          <div style="font-size:15px;font-weight:600;color:var(--doc-text)">${docT('doc_modal_gen_title')}</div>
          <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px">${docT('doc_modal_gen_sub')}</div>
        </div>
        <button class="doc-btn doc-btn-ghost doc-btn-icon" onclick="docCloseModal('doc-modal-generate')">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="doc-modal-body">
        <div class="doc-gen-box">
          <div style="font-size:12px;font-weight:600;color:var(--doc-navy);margin-bottom:6px">⚡ Le système récupère toutes les données automatiquement</div>
          <div style="font-size:11px;color:var(--doc-text-2);margin-bottom:10px">${docT('doc_gen_hint')}</div>
          <select class="doc-input" id="gen-event">
            ${DOC_DATA.events.map(e=>`<option value="${e.id}">${e.title} · Validé ${e.date} · Classification ${e.classif}</option>`).join('')}
          </select>
        </div>
        <div style="font-size:12px;font-weight:600;margin-bottom:10px;color:var(--doc-text)">${docT('doc_gen_list_title')}</div>
        <div style="display:flex;flex-direction:column;gap:8px;color:var(--doc-text)">
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer"><input type="checkbox" checked id="gen-aut">${docT('doc_gen_check_aut')}</label>
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer"><input type="checkbox" checked id="gen-conv">${docT('doc_gen_check_conv')}</label>
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer"><input type="checkbox" id="gen-pv">${docT('doc_gen_check_pv')}</label>
        </div>
        <div style="background:var(--doc-blue-pale);border:1px solid var(--doc-border);border-radius:8px;padding:10px 12px;margin-top:14px;font-size:11px;color:var(--doc-navy);display:flex;gap:8px">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14" style="flex-shrink:0;margin-top:1px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          ${docT('doc_gen_circuit_hint')}
        </div>
      </div>
      <div class="doc-modal-footer">
        <button class="doc-btn doc-btn-outline" onclick="docCloseModal('doc-modal-generate')">${docT('doc_btn_cancel')}</button>
        <button class="doc-btn doc-btn-primary" onclick="docSubmitGenerate()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          ${docT('doc_btn_generate')}
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: Détail document -->
  <div id="doc-modal-detail" class="doc-overlay" style="display:none" onclick="if(event.target===this)docCloseModal('doc-modal-detail')">
    <div class="doc-modal doc-fade">
      <div class="doc-modal-header">
        <div>
          <div id="doc-detail-id" style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--doc-navy);font-weight:600"></div>
          <div id="doc-detail-title" style="font-size:15px;font-weight:600;margin-top:3px;color:var(--doc-text)"></div>
          <div id="doc-detail-badge" style="margin-top:6px"></div>
        </div>
        <button class="doc-btn doc-btn-ghost doc-btn-icon" onclick="docCloseModal('doc-modal-detail')">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="doc-modal-body">
        <div style="margin-bottom:14px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--doc-text-3);margin-bottom:4px">${docT('doc_section_hash')}</div>
          <div class="doc-hash" id="doc-detail-hash">—</div>
        </div>
        <div style="margin-bottom:14px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--doc-text-3);margin-bottom:8px">${docT('doc_section_info')}</div>
          <div id="doc-detail-rows"></div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--doc-text-3);margin-bottom:8px">${docT('doc_section_circuit')}</div>
          <div id="doc-detail-chain" class="doc-chain"></div>
        </div>
      </div>
      <div class="doc-modal-footer">
        <button class="doc-btn doc-btn-outline doc-btn-sm" onclick="docToast('PDF téléchargé ✓')">${docT('doc_btn_pdf')}</button>
        <button class="doc-btn doc-btn-outline doc-btn-sm" onclick="docToast('Word téléchargé ✓')">${docT('doc_btn_word')}</button>
        <button class="doc-btn doc-btn-success doc-btn-sm" onclick="docToast('Intégrité vérifiée ✓ — Hash correspondant')">${docT('doc_btn_verify')}</button>
        <button class="doc-btn doc-btn-primary doc-btn-sm" id="doc-detail-sign-btn" onclick="docCloseModal('doc-modal-detail');docSwitchView('signature')">${docT('doc_btn_sign')}</button>
      </div>
    </div>
  </div>
  `;
}

// ── Render: liste ─────────────────────────────────────────────
function renderDocList() {
  const tabs = [
    { id:'aut', label:docT('doc_tab_aut'), count: DOC_DATA.docs.filter(d=>d.type==='aut').length },
    { id:'pv',  label:docT('doc_tab_pv'),            count: DOC_DATA.docs.filter(d=>d.type==='pv').length  },
    { id:'rap', label:docT('doc_tab_rap'),      count: DOC_DATA.docs.filter(d=>d.type==='rap').length },
  ];
  const filtered = DOC_DATA.docs.filter(d => d.type === DOC_STATE.activeTab);

  return `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">
    ${[
      { n:DOC_DATA.docs.length, label:docT('doc_kpi_total'),     bg:'var(--doc-blue-pale)',    tc:'var(--doc-navy)',   icon:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { n:DOC_DATA.docs.filter(d=>d.status==='pending').length, label:docT('doc_kpi_pending_sig'), bg:'var(--doc-amber-light)',   tc:'var(--doc-amber)', icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
      { n:DOC_DATA.docs.filter(d=>d.status==='signed').length, label:docT('doc_kpi_signed'),   bg:'var(--doc-green-light)',   tc:'var(--doc-green)', icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      { n:DOC_DATA.docs.filter(d=>d.origin==='ai').length, label:docT('doc_kpi_ai'),     bg:'var(--doc-purple-light)',  tc:'var(--doc-purple)', icon:'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    ].map(k => `
      <div class="doc-kpi">
        <div style="width:36px;height:36px;border-radius:8px;background:${k.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg fill="none" stroke="${k.tc}" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${k.icon}"/></svg>
        </div>
        <div>
          <div style="font-size:22px;font-weight:600;color:${k.tc};line-height:1">${k.n}</div>
          <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px">${k.label}</div>
        </div>
      </div>`).join('')}
  </div>

  <div class="doc-split">
    <!-- Table -->
    <div>
      <div style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <div class="doc-tab-bar">
          ${tabs.map(tab => `
            <button class="doc-tab ${DOC_STATE.activeTab===tab.id?'doc-tab-active':''}"
                    data-tab="${tab.id}"
                    onclick="docSwitchTab('${tab.id}')">
              ${tab.label}
              <span style="background:${DOC_STATE.activeTab===tab.id?'rgba(255,255,255,.25)':'var(--doc-blue-pale)'};color:${DOC_STATE.activeTab===tab.id?'#fff':'var(--doc-navy)'};padding:1px 6px;border-radius:999px;font-size:10px;margin-left:4px">${tab.count}</span>
            </button>`).join('')}
        </div>
      </div>

      <div style="background:var(--doc-surface);border:1px solid var(--doc-border);border-radius:12px;overflow:hidden">
        <div style="padding:12px 16px;border-bottom:1px solid var(--doc-border);display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;background:var(--doc-surface)">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="position:relative">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--doc-text-3)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" class="doc-input" placeholder="${docT('doc_search')}" style="padding-left:30px;width:200px" oninput="docFilterTable(this.value)">
            </div>
            <select class="doc-input" style="width:130px">
              <option>${docT('doc_all_status')}</option>
              <option>${docT('doc_status_draft')}</option>
              <option>${docT('doc_status_pending')}</option>
              <option>${docT('doc_status_signed')}</option>
            </select>
          </div>
          <div style="display:flex;gap:8px">
            <button class="doc-btn doc-btn-outline doc-btn-sm" onclick="docOpenModal('doc-modal-generate')">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              ${docT('doc_generate_auto')}
            </button>
            <button class="doc-btn doc-btn-primary doc-btn-sm" onclick="docOpenModal('doc-modal-create')">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              ${docT('doc_new')}
            </button>
          </div>
        </div>

        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;color:var(--doc-text)" id="doc-main-table">
            <thead>
              <tr style="border-bottom:1px solid var(--doc-border)">
                ${[docT('doc_col_id'),docT('doc_col_object'),docT('doc_col_date'),docT('doc_col_status'),docT('doc_col_actions')].map(h =>
                  `<th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--doc-text-3);white-space:nowrap">${h}</th>`
                ).join('')}
              </tr>
            </thead>
            <tbody id="doc-tbody">${renderDocRows(filtered)}</tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail panel -->
    <div class="doc-detail" id="doc-detail-panel">
      <div class="doc-detail-header">
        <div style="font-size:12px;font-weight:600;font-family:'JetBrains Mono',monospace;color:var(--doc-navy)" id="dp-id">AUT-2024-001</div>
        <div style="font-size:13px;font-weight:600;margin-top:3px;color:var(--doc-text)" id="dp-title"></div>
        <div style="margin-top:6px" id="dp-badge">${docBadge('signed','auto')}</div>
      </div>
      <div class="doc-detail-body">
        <div style="margin-bottom:12px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--doc-text-3);margin-bottom:4px">${docT('doc_section_hash')}</div>
          <div class="doc-hash" id="dp-hash">a3f7b2c1d4e8f9a0b1c2d3e4f5a6b7c8…</div>
        </div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--doc-text-3);margin-bottom:8px">${docT('doc_section_circuit')}</div>
        <div class="doc-chain">
          ${[docT('doc_chain_step_1'),docT('doc_chain_step_2'),docT('doc_chain_step_3'),docT('doc_chain_step_4')]
            .map((l,i) => `<div class="doc-chain-step">
              <div class="doc-chain-dot doc-chain-done">✓</div>
              <div>
                <div style="font-size:12px;font-weight:500;color:var(--doc-text)">${l}</div>
                <div style="font-size:11px;color:var(--doc-text-3);margin-top:1px">${docT('doc_chain_date_example')}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
      <div class="doc-detail-footer">
        <button class="doc-btn doc-btn-outline doc-btn-sm" onclick="docToast('PDF téléchargé ✓')">${docT('doc_btn_pdf')}</button>
        <button class="doc-btn doc-btn-outline doc-btn-sm" onclick="docToast('Word téléchargé ✓')">${docT('doc_btn_word')}</button>
        <button class="doc-btn doc-btn-primary doc-btn-sm" onclick="docSwitchView('signature')">${docT('doc_btn_sign')}</button>
      </div>
    </div>
  </div>
  `;
}

function renderDocRows(docs) {
  if (!docs.length) return `<tr><td colspan="5" style="padding:40px;text-align:center;color:var(--doc-text-3);font-size:13px">${docT('doc_empty')}</td></tr>`;
  return docs.map(d => `
    <tr class="doc-tr" onclick="docSelectRow('${d.id}')">
      <td style="padding:12px 16px;border-bottom:1px solid var(--doc-border-2)">
        <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--doc-navy);font-weight:600">${d.id}</span>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid var(--doc-border-2)">
        <div style="font-weight:500;font-size:13px;color:var(--doc-text)">${d.title}</div>
        <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px">${d.dest}</div>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid var(--doc-border-2);font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--doc-text-3);white-space:nowrap">${d.date}</td>
      <td style="padding:12px 16px;border-bottom:1px solid var(--doc-border-2)">${docBadge(d.status, d.origin)}</td>
      <td style="padding:12px 16px;border-bottom:1px solid var(--doc-border-2)">
        <div style="display:flex;gap:4px;align-items:center">
          <button class="doc-btn doc-btn-ghost doc-btn-icon doc-btn-sm" title="${docT('doc_title_view')}" onclick="event.stopPropagation();docShowDetail('${d.id}')">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
          ${d.status==='pending' ? `
          <button class="doc-btn doc-btn-success doc-btn-icon doc-btn-sm" title="${docT('doc_btn_sign')}" onclick="event.stopPropagation();docSwitchView('signature')">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>` : ''}
          <button class="doc-btn doc-btn-ghost doc-btn-icon doc-btn-sm" title="${docT('doc_title_download')}" onclick="event.stopPropagation();docToast('PDF téléchargé ✓')">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          </button>
          <button class="doc-btn doc-btn-danger doc-btn-icon doc-btn-sm" title="${docT('doc_title_delete')}" onclick="event.stopPropagation();docDeleteDoc('${d.id}')">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

// ── Render: IA & RAG ─────────────────────────────────────────
function renderDocAI() {
  return `
  <div style="display:grid;grid-template-columns:1fr 360px;gap:16px">
    <div>
      <!-- PV Generator -->
      <div style="background:var(--doc-surface);border:1px solid var(--doc-border);border-radius:12px;overflow:hidden;margin-bottom:16px">
        <div style="padding:14px 16px;border-bottom:1px solid var(--doc-border)">
          <div style="font-size:13px;font-weight:600;color:var(--doc-text)">${docT('doc_ai_pv_title')}</div>
          <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px">${docT('doc_ai_pv_sub')}</div>
        </div>
        <div style="padding:16px;background:var(--doc-surface)">
          <div class="doc-step-bar">
            <div class="doc-step doc-step-done"><span style="font-size:9px;display:block;opacity:.7">1</span>${docT('doc_step_input')}</div>
            <div class="doc-step doc-step-active" id="pv-step-gen"><span style="font-size:9px;display:block;opacity:.7">2</span>${docT('doc_step_generate')}</div>
            <div class="doc-step" id="pv-step-val"><span style="font-size:9px;display:block;opacity:.7">3</span>${docT('doc_step_validate')}</div>
            <div class="doc-step" id="pv-step-sign"><span style="font-size:9px;display:block;opacity:.7">4</span>${docT('doc_step_sign')}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
            <div><label class="doc-label">${docT('doc_pv_title_label')}</label><input class="doc-input" id="pv-titre" value="Réunion préparation Championnat National"></div>
            <div><label class="doc-label">Date</label><input type="date" class="doc-input" id="pv-date" value="2024-04-10"></div>
            <div style="grid-column:span 2"><label class="doc-label">${docT('doc_pv_participants')}</label><input class="doc-input" id="pv-participants" value="Direction Technique, Fédération Football, Sécurité Nationale"></div>
            <div style="grid-column:span 2">
              <label class="doc-label">${docT('doc_pv_decisions')}</label>
              <textarea class="doc-textarea" id="pv-decisions" style="min-height:80px">- Calendrier validé pour mars-avril
- Plan sécurité approuvé pour stade Radès
- Budget alloué 50k TND
- Prochaine réunion le 20 avril</textarea>
            </div>
          </div>
          <button class="doc-btn doc-btn-primary" style="width:100%;justify-content:center" onclick="docGeneratePV(this)">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Générer avec IA (Mistral fine-tuné)
          </button>
          <div id="pv-result" style="display:none;margin-top:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--doc-text-3)">PV Généré</span>
              <div style="display:flex;gap:6px">
                <span style="font-size:10px;background:var(--doc-purple-light);color:var(--doc-purple);padding:2px 8px;border-radius:999px;font-weight:600">${docT('doc_badge_mistral')}</span>
                <span style="font-size:10px;background:var(--doc-green-light);color:var(--doc-green);padding:2px 8px;border-radius:999px;font-weight:600">ROUGE-L: 0.87</span>
              </div>
            </div>
            <textarea id="pv-output" class="doc-textarea" style="min-height:220px;font-size:12px;line-height:1.7;font-family:'JetBrains Mono',monospace"></textarea>
            <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
              <button class="doc-btn doc-btn-outline doc-btn-sm" onclick="docToast('PV copié ✓')">${docT('doc_btn_copy')}</button>
              <button class="doc-btn doc-btn-success doc-btn-sm" onclick="docToast('Brouillon sauvegardé ✓');docMarkStep('pv-step-val')">${docT('doc_btn_save_draft')}</button>
              <button class="doc-btn doc-btn-primary doc-btn-sm" onclick="docToast('Envoyé en signature ✓');docSwitchView('signature');docMarkStep('pv-step-sign')">${docT('doc_btn_send_sig')}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Anomaly detection -->
      <div style="background:var(--doc-surface);border:1px solid var(--doc-border);border-radius:12px;overflow:hidden">
        <div style="padding:14px 16px;border-bottom:1px solid var(--doc-border)">
          <div style="font-size:13px;font-weight:600;color:var(--doc-text)">${docT('doc_ai_anomaly_title')}</div>
          <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px">${docT('doc_ai_anomaly_sub')}</div>
        </div>
        <div style="padding:16px">
          <div style="border:1.5px dashed var(--doc-border);border-radius:8px;padding:20px;text-align:center;cursor:pointer;color:var(--doc-text-3);font-size:12px;transition:border-color .14s"
               onmouseenter="this.style.borderColor='var(--doc-navy)'" onmouseleave="this.style.borderColor=''"
               onclick="docToast('Analyse en cours… Score anomalie: 0.12 — Normal ✓')">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" style="margin:0 auto 6px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            Uploader un document à analyser (PDF/Word)
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px">
            ${[
              { score:'0.08', label:docT('doc_anomaly_normal'),  bg:'var(--doc-green-light)',  tc:'var(--doc-green)' },
              { score:'0.54', label:docT('doc_anomaly_suspect'), bg:'var(--doc-amber-light)',  tc:'var(--doc-amber)' },
              { score:'0.91', label:docT('doc_anomaly_high'),    bg:'rgba(220,38,38,.1)',       tc:'var(--doc-red)' },
            ].map(a => `
              <div style="background:${a.bg};border-radius:8px;padding:10px;text-align:center">
                <div style="font-size:18px;font-weight:600;color:${a.tc}">${a.score}</div>
                <div style="font-size:10px;color:${a.tc};margin-top:2px">${a.label}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- RAG Chatbot -->
    <div>
      <div style="background:var(--doc-surface);border:1px solid var(--doc-border);border-radius:12px;display:flex;flex-direction:column;height:560px;overflow:hidden">
        <div style="padding:12px 16px;border-bottom:1px solid var(--doc-border);display:flex;align-items:center;gap:8px;background:var(--doc-surface)">
          <div style="width:8px;height:8px;border-radius:50%;background:var(--doc-green)" class="doc-pulse"></div>
          <span style="font-size:12px;font-weight:600;color:var(--doc-text)">${docT('doc_ai_rag_title')}</span>
          <span style="margin-left:auto;font-size:10px;color:var(--doc-text-3)">${docT('doc_ai_rag_tech')}</span>
        </div>
        <div style="padding:8px 12px 6px;display:flex;flex-wrap:wrap;gap:5px;border-bottom:1px solid var(--doc-border-2);background:var(--doc-surface)">
          ${['Rédiger une autorisation','Procédure signature','Délais validation','Archivage sécurisé'].map(q => `
            <button onclick="docAskRAG('${q}')"
                    style="padding:3px 10px;border:1px solid var(--doc-border);border-radius:999px;font-size:11px;cursor:pointer;color:var(--doc-text-2);background:var(--doc-surface);transition:all .12s"
                    onmouseenter="this.style.borderColor='var(--doc-navy)';this.style.color='var(--doc-navy)';this.style.background='var(--doc-blue-pale)'"
                    onmouseleave="this.style.borderColor='';this.style.color='';this.style.background=''">${q}</button>`).join('')}
        </div>
        <div id="doc-chat-msgs" style="flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px;background:var(--doc-surface)">
          <div style="display:flex;gap:8px;align-items:flex-start">
            <div style="width:26px;height:26px;border-radius:6px;background:var(--doc-blue-pale);color:var(--doc-navy);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0">🤖</div>
            <div class="doc-chat-bubble-bot">
              Bonjour ! Je suis l'assistant RAG du SGS. Posez-moi vos questions sur les règlements, procédures et rédaction de documents officiels.
              <div style="margin-top:5px;font-size:10px;color:var(--doc-text-3)">${docT('doc_rag_sources')}</div>
            </div>
          </div>
        </div>
        <div style="padding:10px 12px;border-top:1px solid var(--doc-border);display:flex;gap:6px;background:var(--doc-surface)">
          <input type="text" id="doc-chat-input" class="doc-input" placeholder="Posez votre question…" style="flex:1" onkeypress="if(event.key==='Enter')docSendChat()">
          <button class="doc-btn doc-btn-primary doc-btn-icon" onclick="docSendChat()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Render: Archives ─────────────────────────────────────────
function renderDocArchive() {
  return `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
    ${[
      { n:DOC_DATA.docs.filter(d=>d.status==='signed').length, label:docT('doc_kpi_total_archive'), tc:'var(--doc-navy)' },
      { n:'100%',label:docT('doc_kpi_integrity'), tc:'var(--doc-green)' },
    ].map(k => `
      <div class="doc-kpi">
        <div>
          <div style="font-size:22px;font-weight:600;color:${k.tc}">${k.n}</div>
          <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px">${k.label}</div>
        </div>
      </div>`).join('')}
  </div>

  <div style="display:grid;grid-template-columns:1fr 300px;gap:16px">
    <div style="background:var(--doc-surface);border:1px solid var(--doc-border);border-radius:12px;overflow:hidden">
      <div style="padding:12px 16px;border-bottom:1px solid var(--doc-border);display:flex;align-items:center;justify-content:space-between;background:var(--doc-surface)">
        <div style="position:relative">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--doc-text-3)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input class="doc-input" placeholder="Recherche full-text…" style="padding-left:30px;width:280px">
        </div>
        <select class="doc-input" style="width:130px">
          <option>${docT('doc_all_types')}</option><option>${docT('doc_tab_aut')}</option><option>PV</option><option>${docT('doc_tab_rap')}</option>
        </select>
      </div>
      <div style="padding:8px 16px;background:var(--doc-surface)">
        ${DOC_DATA.docs.filter(d=>d.status==='signed').map(d=>`
          <div class="doc-archive-item">
            <div style="width:28px;height:28px;border-radius:6px;background:var(--doc-blue-pale);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <svg fill="none" stroke="var(--doc-navy)" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div style="flex:1">
              <div style="font-size:12px;font-weight:500;color:var(--doc-text)">${d.id} — ${d.title}</div>
              <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px">${docT('doc_archived_on')} ${d.date}</div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--doc-text-3);margin-top:2px">${d.hash||'—'}</div>
            </div>
            <div style="display:flex;gap:4px">
              <button class="doc-btn doc-btn-ghost doc-btn-icon doc-btn-sm" title="${docT('doc_title_verify')}" onclick="docToast('Intégrité vérifiée ✓')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </button>
              <button class="doc-btn doc-btn-ghost doc-btn-icon doc-btn-sm" onclick="docToast('PDF/A téléchargé')">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="13" height="13"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <div>
      <div style="background:var(--doc-surface);border:1px solid var(--doc-border);border-radius:12px;overflow:hidden;margin-bottom:12px">
        <div style="padding:12px 14px;border-bottom:1px solid var(--doc-border);font-size:12px;font-weight:600;color:var(--doc-text)">${docT('doc_archive_reissue')}</div>
        <div style="padding:12px 14px">
          <div style="background:var(--doc-blue-pale);border:1px solid var(--doc-border);border-radius:8px;padding:10px 12px;font-size:11px;color:var(--doc-navy);display:flex;gap:8px;margin-bottom:10px">
            ${docT('doc_reissue_hint')}
          </div>
          ${[
            { ver:'v1.0', date:docT('doc_ver_date_1'), tag:docT('doc_ver_original'), tagBg:'var(--doc-blue-pale)',  tagC:'var(--doc-navy)' },
            { ver:'v2.0', date:docT('doc_ver_date_2'), tag:docT('doc_ver_current'),   tagBg:'var(--doc-green-light)',tagC:'var(--doc-green)' },
          ].map(v => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:var(--doc-surface-2);border-radius:6px;font-size:11px;margin-bottom:4px">
              <span style="font-family:'JetBrains Mono',monospace;color:var(--doc-text)">${v.ver}</span>
              <span style="color:var(--doc-text-3)">${v.date}</span>
              <span style="background:${v.tagBg};color:${v.tagC};padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600">${v.tag}</span>
            </div>`).join('')}
          <button class="doc-btn doc-btn-outline doc-btn-sm" style="width:100%;justify-content:center;margin-top:8px" onclick="docToast('Nouvelle version créée : v3.0')">${docT('doc_archive_new_version')}</button>
        </div>
      </div>

      <div style="background:var(--doc-surface);border:1px solid var(--doc-border);border-radius:12px;overflow:hidden">
        <div style="padding:12px 14px;border-bottom:1px solid var(--doc-border);font-size:12px;font-weight:600;color:var(--doc-text)">${docT('doc_archive_qr')}</div>
        <div style="padding:14px;text-align:center">
          <div style="width:80px;height:80px;background:var(--doc-navy);border-radius:8px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px">
            <svg fill="white" viewBox="0 0 24 24" width="40" height="40"><path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zm8-2h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 13h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zm8 0h2v2h-2v-2zm2 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-2h2v2h-2v-2zm-4 4h2v2h-2v-2zm4-2h2v2h-2v-2zm-2 2h2v2h-2v-2z"/></svg>
          </div>
          <div style="font-size:11px;color:var(--doc-text-3);margin-bottom:6px">${docT('doc_qr_hint')}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--doc-text-3);word-break:break-all">sgs.gov.tn/verify/f4a7c2b1-9e3d-4f5a</div>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Render: Signature ─────────────────────────────────────────
function renderDocSignature() {
  const pending = DOC_DATA.docs.filter(d => d.status === 'pending');
  return `
  <div style="display:grid;grid-template-columns:1fr 320px;gap:16px">
    <!-- Pending list -->
    <div style="background:var(--doc-surface);border:1px solid var(--doc-border);border-radius:12px;overflow:hidden">
      <div style="padding:14px 16px;border-bottom:1px solid var(--doc-border)">
        <div style="font-size:13px;font-weight:600;color:var(--doc-text)">${docT('doc_sig_pending_title')}</div>
        <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px">${pending.length} ${docT('doc_sig_pending_sub')}</div>
      </div>
      <div style="padding:12px 16px;display:flex;flex-direction:column;gap:8px;background:var(--doc-surface)">
        ${pending.map((d, i) => `
          <div class="doc-sig-item ${i===0?'doc-sig-item--active':''}"
               data-sig-id="${d.id}"
               onclick="docSelectForSign('${d.id}')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--doc-navy);font-weight:600">${d.id}</div>
                <div style="font-size:13px;font-weight:600;margin-top:2px;color:var(--doc-text)">${d.title}</div>
                <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px">${docT('doc_submitted_on')} ${d.date}</div>
              </div>
              ${docBadge('pending','')}
            </div>
            <div style="margin-top:8px;display:flex;gap:6px">
              <span style="background:var(--doc-blue-pale);color:var(--doc-navy);padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600">${docT('doc_classif_label')} ${d.classif}</span>
              <span style="background:var(--doc-blue-pale);color:var(--doc-navy);padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600">${d.classif<=3?docT('doc_sig_1'):d.classif<=6?docT('doc_sig_2'):docT('doc_sig_3_short')}</span>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Signature pad -->
    <div>
      <div style="background:var(--doc-surface);border:1px solid var(--doc-border);border-radius:12px;overflow:hidden">
        <div style="padding:14px 16px;border-bottom:1px solid var(--doc-border)">
          <div style="font-size:13px;font-weight:600;color:var(--doc-text)">${docT('doc_sig_pad_title')}</div>
          <div style="font-size:11px;color:var(--doc-text-3);margin-top:2px" id="sig-doc-label">${pending[0]?.id || docT('doc_sig_select')}</div>
        </div>
        <div style="padding:14px 16px">
          <div style="background:var(--doc-blue-pale);border:1px solid var(--doc-border);border-radius:8px;padding:10px 12px;font-size:11px;color:var(--doc-navy);display:flex;gap:8px;margin-bottom:12px">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14" style="flex-shrink:0"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            ${docT('doc_sig_pki_note')}
          </div>

          <div style="position:relative">
            <canvas id="doc-sig-canvas" class="doc-sig-canvas" width="288" height="130"></canvas>
            <div id="doc-sig-hint" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;font-size:12px;color:var(--doc-text-3);pointer-events:none">✍️ ${docT('doc_sig_hint')}</div>
          </div>

          <div style="display:flex;gap:6px;margin:10px 0 12px">
            <button class="doc-btn doc-btn-outline doc-btn-sm" onclick="docClearCanvas()">${docT('doc_btn_clear')}</button>
            <button class="doc-btn doc-btn-outline doc-btn-sm" style="margin-left:auto" onclick="docToast('Prévisualisation PDF chargée')">${docT('doc_btn_preview')}</button>
          </div>

          <div style="height:1px;background:var(--doc-border);margin-bottom:12px"></div>

          ${[
            { key:docT('doc_row_signer'), val:'superadmin@sgs.gov' },
            { key:docT('doc_row_role'),   val:'Super Administrateur' },
            { key:docT('doc_row_algo'),   val:'RSA-2048 SHA256' },
          ].map(r => `
            <div class="doc-row">
              <span class="doc-key">${r.key}</span>
              <span class="doc-val" style="font-family:'JetBrains Mono',monospace;font-size:10px">${r.val}</span>
            </div>`).join('')}
          <div class="doc-row">
            <span class="doc-key">${docT('doc_row_timestamp')}</span>
            <span class="doc-val" style="font-family:'JetBrains Mono',monospace;font-size:10px" id="sig-timestamp">—</span>
          </div>

          <div style="height:1px;background:var(--doc-border);margin:12px 0"></div>

          <button class="doc-btn doc-btn-primary" style="width:100%;justify-content:center" onclick="docSign()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            ${docT('doc_btn_sign_archive')}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

// ── CRUD actions ──────────────────────────────────────────────
function docSubmitCreate() {
  const title = document.getElementById('create-title')?.value;
  if (!title) { docToast('⚠️ Remplissez les champs obligatoires'); return; }
  const newDoc = {
    id:     _docNextId('AUT'),
    type:   document.getElementById('create-type')?.value || 'aut',
    title,
    dest:   document.getElementById('create-dest')?.value || '—',
    date:   new Date().toISOString().slice(0,10),
    signer: null, status:'pending', origin:'manual',
    classif: parseInt(document.getElementById('create-classif')?.value || 1),
    hash:   null,
  };
  DOC_DATA.docs.unshift(newDoc);
  docCloseModal('doc-modal-create');
  docToast(`✓ Document ${newDoc.id} créé et envoyé en signature`);
  const tbody = document.getElementById('doc-tbody');
  if (tbody) tbody.innerHTML = renderDocRows(DOC_DATA.docs.filter(d => d.type === DOC_STATE.activeTab));
}

function docSubmitGenerate() {
  docCloseModal('doc-modal-generate');
  docToast('✓ 2 documents générés et envoyés en signature');
  DOC_DATA.docs.unshift({
    id: _docNextId('AUT'),
    type:'aut', title:'Génération automatique', dest:'Auto',
    date: new Date().toISOString().slice(0,10),
    signer:null, status:'pending', origin:'auto', classif:2, hash:null,
  });
  const tbody = document.getElementById('doc-tbody');
  if (tbody) tbody.innerHTML = renderDocRows(DOC_DATA.docs.filter(d => d.type === DOC_STATE.activeTab));
}

// ── IA / RAG ─────────────────────────────────────────────────
function docGeneratePV(btn) {
  if (DOC_STATE.pvGenerating) return;
  DOC_STATE.pvGenerating = true;
  const orig = btn.innerHTML;
  btn.innerHTML = '⏳ Génération en cours…';
  btn.disabled  = true;

  const titre = document.getElementById('pv-titre')?.value || 'Réunion';
  const date  = document.getElementById('pv-date')?.value  || new Date().toISOString().slice(0,10);
  const parts = document.getElementById('pv-participants')?.value || '';
  const decs  = document.getElementById('pv-decisions')?.value || '';

  const result = DOC_DATA.pvTemplate
    .replace('{titre}', titre)
    .replace('{date}',  date)
    .replace('{participants}', parts.split(',').map(p=>`- ${p.trim()}`).join('\n'))
    .replace('{decisions}',   decs.split('\n').filter(Boolean).map((d,i)=>`${i+1}. ${d.replace(/^-\s*/,'').trim()}`).join('\n\n'));

  setTimeout(() => {
    const res = document.getElementById('pv-result');
    if (res) res.style.display = 'block';
    const out = document.getElementById('pv-output');
    if (out) {
      out.value = '';
      let i = 0;
      const iv = setInterval(() => {
        if (i < result.length) {
          out.value += result[i++];
          out.scrollTop = out.scrollHeight;
        } else {
          clearInterval(iv);
          DOC_STATE.pvGenerating = false;
          btn.disabled  = false;
          btn.innerHTML = orig;
        }
      }, 6);
    }
  }, 1200);
}

function docAskRAG(question) {
  const input = document.getElementById('doc-chat-input');
  if (input) input.value = question;
  docSendChat();
}

function docSendChat() {
  const input = document.getElementById('doc-chat-input');
  const q     = input?.value?.trim();
  if (!q) return;
  const msgs  = document.getElementById('doc-chat-msgs');
  if (!msgs) return;

  msgs.innerHTML += `
    <div style="display:flex;gap:8px;align-items:flex-start;flex-direction:row-reverse" class="doc-fade">
      <div style="width:26px;height:26px;border-radius:6px;background:var(--doc-navy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;flex-shrink:0">A</div>
      <div class="doc-chat-bubble-user">${q}</div>
    </div>`;
  if (input) input.value = '';
  msgs.scrollTop = msgs.scrollHeight;

  setTimeout(() => {
    const key  = Object.keys(DOC_DATA.ragResponses).find(k => q.toLowerCase().includes(k)) || 'default';
    const resp = DOC_DATA.ragResponses[key];
    msgs.innerHTML += `
      <div style="display:flex;gap:8px;align-items:flex-start" class="doc-fade">
        <div style="width:26px;height:26px;border-radius:6px;background:var(--doc-blue-pale);color:var(--doc-navy);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0">🤖</div>
        <div class="doc-chat-bubble-bot" style="white-space:pre-line">${resp}
          <div style="margin-top:6px;font-size:10px;color:var(--doc-text-3)">${docT('doc_rag_based_on').replace('{n}', Math.floor(Math.random()*5)+2)}</div>
        </div>
      </div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }, 600);
}

function docMarkStep(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('doc-step-active'); el.classList.add('doc-step-done'); }
}


// ── ID generation helper ─────────────────────────────────────
// Uses max of existing numeric suffixes to avoid collisions after deletions
function _docNextId(prefix) {
  const year = new Date().getFullYear();
  const pat  = new RegExp(`^${prefix}-${year}-(\\d+)$`);
  const max  = DOC_DATA.docs.reduce((m, d) => {
    const match = d.id.match(pat);
    return match ? Math.max(m, parseInt(match[1], 10)) : m;
  }, 0);
  return `${prefix}-${year}-${String(max + 1).padStart(3, '0')}`;
}

// ── Init ─────────────────────────────────────────────────────
function initDocumentModule() {
  window.documentModule = {
    role:       localStorage.getItem('userRole') || 'super_admin',
    region:     localStorage.getItem('userRegion'),
    federation: localStorage.getItem('userFederation'),
  };
  return window.documentModule;
}

// ── Global exports ────────────────────────────────────────────
window.initDocumentModule  = initDocumentModule;
window.renderDocumentModule = renderDocumentModule;
window.docSwitchView       = docSwitchView;
window.docSwitchTab        = docSwitchTab;
window.docFilterTable      = docFilterTable;
window.docSelectRow        = docSelectRow;
window.docShowDetail       = docShowDetail;
window.docDeleteDoc        = docDeleteDoc;
window.docOpenModal        = docOpenModal;
window.docCloseModal       = docCloseModal;
window.docSubmitCreate     = docSubmitCreate;
window.docSubmitGenerate   = docSubmitGenerate;
window.docGeneratePV       = docGeneratePV;
window.docAskRAG           = docAskRAG;
window.docSendChat         = docSendChat;
window.docInitCanvas       = docInitCanvas;
window.docClearCanvas      = docClearCanvas;
window.docSelectForSign    = docSelectForSign;
window.docSign             = docSign;
window.docMarkStep         = docMarkStep;
window.docToast            = docToast;