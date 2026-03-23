// SGS - National Sports Management System - Frontend Prototype (Bilingue FR / AR)

let currentLang = localStorage.getItem('sgs-lang') || 'fr';
let lastPageId = 'dashboard';

function t(key) {
  if (typeof TRANSLATIONS === 'undefined') return key;
  const lang = TRANSLATIONS[currentLang];
  return (lang && lang[key]) || (TRANSLATIONS.fr && TRANSLATIONS.fr[key]) || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('sgs-lang', lang);
  const html = document.documentElement;

  if (lang === 'ar') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
    document.body.style.fontFamily = "'Noto Sans Arabic', 'DM Sans', system-ui, sans-serif";
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'fr');
    document.body.style.fontFamily = "'DM Sans', system-ui, sans-serif";
  }

  document.body.style.direction = '';
  document.body.style.textAlign = '';

  // sidebar visible après changement de langue
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('-translate-x-full');

  updateUITexts();
  updateLangButtons();
  translateSidebar();

  if (document.getElementById('main-app') && 
      !document.getElementById('main-app').classList.contains('hidden')) {
    navigateTo(lastPageId);
  }
}

function translateSidebar() {
  document.querySelectorAll('#sidebar [data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  const themeLabel = document.getElementById('theme-label');
  if (themeLabel) {
    themeLabel.textContent = document.documentElement.classList.contains('dark')
      ? t('theme_light') : t('theme_dark');
  }
}

function translatePageContent() {
  document.querySelectorAll('#content-area [data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('#content-area [data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });
  document.querySelectorAll('#content-area select option[data-i18n]').forEach(opt => {
    const key = opt.getAttribute('data-i18n');
    if (key) opt.textContent = t(key);
  });
}

function updateLangButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang') || (btn.id && btn.id.includes('fr') ? 'fr' : 'ar');
    if (currentLang === btnLang) {
      btn.style.background = '#1A237E';
      btn.style.color = '#fff';
      btn.classList.remove('bg-slate-200', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-400');
    } else {
      btn.style.background = '';
      btn.style.color = '';
      btn.classList.add('bg-slate-200', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-400');
    }
  });
}

function updateUITexts() {
  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && t(key)) {
      el.textContent = t(key);
    }
  });
  
  // Update all inputs with placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && t(key)) {
      el.placeholder = t(key);
    }
  });
  
  // Update all select options
  document.querySelectorAll('select option[data-i18n]').forEach(option => {
    const key = option.getAttribute('data-i18n');
    if (key && t(key)) {
      option.textContent = t(key);
    }
  });
  
  const themeLabel = document.getElementById('theme-label');
  if (themeLabel) {
    themeLabel.textContent = document.documentElement.classList.contains('dark') ? t('theme_light') : t('theme_dark');
  }
}

function getUserRole() {
    // À connecter avec votre système d'auth
    return localStorage.getItem('userRole') || 'participant';
}

function getUserRegion() {
    // Pour les utilisateurs régionaux
    return localStorage.getItem('userRegion') || 'Centre';
}

// Middleware de protection des routes
function checkAccess(requiredRoles) {
    const userRole = getUserRole();
    if (!requiredRoles.includes(userRole)) {
        alert('Accès non autorisé');
        navigateTo('dashboard');
        return false;
    }
    return true;
}

const PAGES = {
 
  // ─── DASHBOARD ────────────────────────────────────────────────────────────
  dashboard: {
    get title()    { return t('nav_dashboard'); },
    get subtitle() { return t('dashboard_subtitle'); },
    get content()  {
      return `
      <style>
        .dash-card{transition:all .2s}.dash-card:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(0,0,0,.08)}
        .kpi-value{font-variant-numeric:tabular-nums}
        @keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .count-anim{animation:countUp .5s ease forwards}
        .activity-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .progress-bar{transition:width 1.2s cubic-bezier(.4,0,.2,1)}
        .badge-pulse{animation:pulse2 2s infinite}
        @keyframes pulse2{0%,100%{opacity:1}50%{opacity:.4}}
        .quick-action:hover{transform:translateY(-1px)}.quick-action{transition:all .15s}
      </style>
 
      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="flex items-start justify-between mb-3">
            <div class="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">+12 ${t('this_month')}</span>
          </div>
          <p class="text-3xl font-bold text-slate-800 dark:text-slate-100 kpi-value count-anim">247</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${t('kpi_total_infra')}</p>
          <div class="mt-3 flex items-center gap-1.5 text-xs text-green-600">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            <span>+5.1%</span>
          </div>
        </div>
 
        <div class="dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="flex items-start justify-between mb-3">
            <div class="w-11 h-11 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">30 ${t('days_next')}</span>
          </div>
          <p class="text-3xl font-bold text-slate-800 dark:text-slate-100 kpi-value count-anim">89</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${t('kpi_upcoming_events')}</p>
        </div>
 
        <div class="dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-amber-200 dark:border-amber-800 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 w-1 h-full bg-amber-500 opacity-60 rounded-r-2xl"></div>
          <div class="flex items-start justify-between mb-3">
            <div class="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 badge-pulse"></span>${t('action_required')}
            </span>
          </div>
          <p class="text-3xl font-bold text-amber-600 kpi-value count-anim">23</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${t('kpi_pending_validations')}</p>
          <button class="mt-3 text-xs font-medium text-amber-600 hover:underline flex items-center gap-1" onclick="navigateTo('workflow')">
            ${t('process_now')} <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
 
        <div class="dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-red-200 dark:border-red-800 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 w-1 h-full bg-red-500 opacity-60 rounded-r-2xl"></div>
          <div class="flex items-start justify-between mb-3">
            <div class="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 badge-pulse"></span>${t('critical')}
            </span>
          </div>
          <p class="text-3xl font-bold text-red-600 kpi-value count-anim">2</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${t('kpi_security_alerts')}</p>
          <button class="mt-3 text-xs font-medium text-red-600 hover:underline flex items-center gap-1" onclick="navigateTo('security')">
            ${t('view_alerts')} <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
 
      <!-- Row 2: Chart + Quick actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div class="lg:col-span-2 dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-semibold text-slate-800 dark:text-slate-100">${t('dashboard_system_usage')}</h3>
              <p class="text-xs text-slate-500 mt-0.5">${t('active_users_7days')}</p>
            </div>
            <div class="flex gap-1.5">
              <button class="dash-period-btn active px-3 py-1 rounded-lg text-xs font-medium bg-primary-600 text-white" data-period="7j">7${t('days_short')}</button>
              <button class="dash-period-btn px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500" data-period="30j">30${t('days_short')}</button>
              <button class="dash-period-btn px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500" data-period="90j">90${t('days_short')}</button>
            </div>
          </div>
          <div class="h-52"><canvas id="chart-usage-main"></canvas></div>
          <div class="flex items-center gap-6 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-primary-500"></span><span class="text-xs text-slate-500">${t('legend_active_users')}</span></div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-accent-400/60"></span><span class="text-xs text-slate-500">${t('legend_sessions')}</span></div>
          </div>
        </div>
 
        <div class="dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-1">${t('quick_actions')}</h3>
          <p class="text-xs text-slate-500 mb-4">${t('quick_actions_sub')}</p>
          <div class="grid grid-cols-2 gap-2.5 flex-1">
            <button class="quick-action flex flex-col items-center gap-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 border border-primary-100 dark:border-primary-800 transition" onclick="navigateTo('workflow')">
              <div class="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              </div>
              <span class="text-xs font-medium text-primary-700 dark:text-primary-300 text-center leading-tight">${t('qa_validate')}</span>
            </button>
            <button class="quick-action flex flex-col items-center gap-2 p-3 rounded-xl bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 border border-accent-100 dark:border-accent-800 transition" onclick="navigateTo('calendar')">
              <div class="w-9 h-9 rounded-xl bg-accent-100 dark:bg-accent-900/50 flex items-center justify-center">
                <svg class="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <span class="text-xs font-medium text-accent-700 dark:text-accent-300 text-center leading-tight">${t('qa_new_event')}</span>
            </button>
            <button class="quick-action flex flex-col items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 border border-green-100 dark:border-green-800 transition" onclick="navigateTo('reports')">
              <div class="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <span class="text-xs font-medium text-green-700 dark:text-green-300 text-center leading-tight">${t('qa_report')}</span>
            </button>
            <button class="quick-action flex flex-col items-center gap-2 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 border border-cyan-100 dark:border-cyan-800 transition" onclick="navigateTo('gis')">
              <div class="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                <svg class="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              </div>
              <span class="text-xs font-medium text-cyan-700 dark:text-cyan-300 text-center leading-tight">${t('qa_gis')}</span>
            </button>
            <button class="quick-action flex flex-col items-center gap-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 border border-violet-100 dark:border-violet-800 transition" onclick="navigateTo('ai-infra')">
              <div class="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              </div>
              <span class="text-xs font-medium text-violet-700 dark:text-violet-300 text-center leading-tight">${t('qa_ai_eval')}</span>
            </button>
            <button class="quick-action flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 transition" onclick="navigateTo('ai-documents')">
              <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <span class="text-xs font-medium text-slate-600 dark:text-slate-400 text-center leading-tight">${t('qa_documents')}</span>
            </button>
          </div>
        </div>
      </div>
 
      <!-- Row 3: Regions + Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div class="dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-semibold text-slate-800 dark:text-slate-100">${t('compliance_by_region')}</h3>
              <p class="text-xs text-slate-500 mt-0.5">${t('compliance_sub')}</p>
            </div>
            <button class="text-xs text-primary-600 hover:underline" onclick="navigateTo('infrastructure')">${t('see_all')}</button>
          </div>
          <div class="space-y-3" id="region-bars">
            ${[
              { key:'region_south',  pct:95, from:'from-green-400',   to:'to-emerald-500', tc:'text-green-600',  dot:'bg-green-500'  },
              { key:'region_center', pct:88, from:'from-primary-400', to:'to-primary-600', tc:'text-primary-600',dot:'bg-primary-500'},
              { key:'region_east',   pct:82, from:'from-cyan-400',    to:'to-cyan-600',    tc:'text-cyan-600',   dot:'bg-cyan-500'   },
              { key:'region_west',   pct:74, from:'from-amber-400',   to:'to-amber-600',   tc:'text-amber-600',  dot:'bg-amber-500'  },
              { key:'region_north',  pct:61, from:'from-red-400',     to:'to-red-600',     tc:'text-red-600',    dot:'bg-red-500'    },
            ].map(r => `
              <div>
                <div class="flex justify-between text-sm mb-1.5">
                  <span class="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full ${r.dot}"></span>${t(r.key)}
                  </span>
                  <span class="font-mono font-bold ${r.tc}">${r.pct}%</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                  <div class="progress-bar h-2.5 rounded-full bg-gradient-to-r ${r.from} ${r.to}" style="width:0%" data-target="${r.pct}"></div>
                </div>
              </div>`).join('')}
          </div>
        </div>
 
        <div class="dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-semibold text-slate-800 dark:text-slate-100">${t('dashboard_recent_activity')}</h3>
              <p class="text-xs text-slate-500 mt-0.5">${t('last_actions')}</p>
            </div>
            <span class="text-xs text-slate-400">${t('today')}</span>
          </div>
          <div class="space-y-3 overflow-y-auto max-h-64 pr-1">
            ${[
              { dot:'bg-green-500',   title:t('act_doc_approved'),  sub:'#TA-2024-089', time:t('time_2min'),  tag:t('nav_ai_docs'),      tagC:'bg-green-100 text-green-700'    },
              { dot:'bg-primary-500', title:t('act_event_planned'), sub:t('national_championship'), time:t('time_15min'), tag:t('nav_calendar'),    tagC:'bg-primary-100 text-primary-700'},
              { dot:'bg-violet-500',  title:t('act_ai_done'),       sub:t('gym_north_score'),       time:t('time_32min'), tag:'IA',                  tagC:'bg-violet-100 text-violet-700'  },
              { dot:'bg-amber-500',   title:t('act_conflict'),      sub:t('conflict_date'),         time:t('time_1h'),   tag:t('nav_calendar'),    tagC:'bg-amber-100 text-amber-700'    },
              { dot:'bg-red-500',     title:t('act_infra_alert'),   sub:t('gym_north_maintenance'), time:t('time_2h'),   tag:t('nav_infrastructure'),tagC:'bg-red-100 text-red-700'      },
            ].map(a=>`
              <div class="flex items-start gap-3">
                <div class="activity-dot ${a.dot} mt-1.5"></div>
                <div class="flex-1"><p class="text-sm font-medium text-slate-800 dark:text-slate-100">${a.title}</p><p class="text-xs text-slate-500">${a.sub}</p><p class="text-xs text-slate-400 mt-0.5">${a.time}</p></div>
                <span class="text-xs ${a.tagC} px-1.5 py-0.5 rounded">${a.tag}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
 
      <!-- Row 4: Status système -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="dash-card bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-slate-800 dark:text-slate-100">${t('pending_validations')}</h3>
              <p class="text-xs text-slate-500 mt-0.5">${t('needs_action')}</p>
            </div>
            <button class="text-xs font-medium text-primary-600 hover:underline" onclick="navigateTo('workflow')">${t('see_all')} →</button>
          </div>
          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            ${[
              { icon:'bg-amber-100', title:t('wf_championship_football'), sub:'25–27 ${t("april")} • ${t("national_stadium")}', tag:t('national'), tagC:'bg-amber-100 text-amber-700' },
              { icon:'bg-amber-100', title:t('wf_travel_handball'),       sub:'15–18 ${t("march")} • ${t("capital_north")}',   tag:t('nav_documents'), tagC:'bg-amber-100 text-amber-700' },
            ].map(w=>`
              <div class="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer" onclick="navigateTo('workflow')">
                <div class="w-9 h-9 rounded-xl ${w.icon} dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                </div>
                <div class="flex-1 min-w-0"><p class="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">${w.title}</p></div>
                <span class="text-xs ${w.tagC} px-2 py-0.5 rounded-full flex-shrink-0">${w.tag}</span>
              </div>`).join('')}
          </div>
        </div>
 
        <div class="dash-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-semibold text-slate-800 dark:text-slate-100">${t('system_status')}</h3>
              <p class="text-xs text-slate-500 mt-0.5">${t('services_connectivity')}</p>
            </div>
            <span class="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 badge-pulse"></span>${t('operational')}
            </span>
          </div>
          <div class="space-y-3">
            ${[
              { key:'svc_api',      ms:'12ms',  ok:true  },
              { key:'svc_calendar', ms:'45ms',  ok:true  },
              { key:'svc_notif',    ms:'8ms',   ok:true  },
              { key:'svc_ai',       ms:'340ms', ok:false },
              { key:'svc_db',       ms:'3ms',   ok:true  },
            ].map(s=>`
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full ${s.ok?'bg-green-500 badge-pulse':'bg-amber-500'}"></div>
                <span class="text-sm text-slate-700 dark:text-slate-300 flex-1">${t(s.key)}</span>
                <span class="text-xs ${s.ok?'text-green-600':'text-amber-600'} font-medium">${s.ok?t('online'):t('degraded')}</span>
                <span class="text-xs text-slate-400 font-mono">${s.ms}</span>
              </div>`).join('')}
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>${t('last_sync')} : <strong class="text-slate-700 dark:text-slate-300">2 ${t('min_ago')}</strong></span>
            <button class="text-primary-600 hover:underline" onclick="navigateTo('sync')">${t('synchronize')}</button>
          </div>
        </div>
      </div>
 
      <script>
      (function() {
        const ctxMain = document.getElementById('chart-usage-main');
        if (ctxMain) {
          const isDark = document.documentElement.classList.contains('dark');
          const tc = isDark ? '#94a3b8' : '#64748b';
          const gc = isDark ? '#334155' : '#f1f5f9';
          new Chart(ctxMain.getContext('2d'), {
            type: 'line',
            data: {
              labels: ['${t("day_mon")}','${t("day_tue")}','${t("day_wed")}','${t("day_thu")}','${t("day_fri")}','${t("day_sat")}','${t("day_sun")}'],
              datasets: [
                { label: '${t("legend_active_users")}', data: [120,190,180,250,210,160,200], borderColor:'rgb(51,166,255)', backgroundColor:'rgba(51,166,255,0.08)', fill:true, tension:0.4, pointRadius:4 },
                { label: '${t("legend_sessions")}',     data: [200,310,290,380,330,240,310], borderColor:'rgba(255,123,16,0.6)', backgroundColor:'rgba(255,123,16,0.05)', fill:true, tension:0.4, borderDash:[4,3] }
              ]
            },
            options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ y:{beginAtZero:true,ticks:{color:tc},grid:{color:gc}}, x:{ticks:{color:tc},grid:{display:false}} } }
          });
        }
        setTimeout(() => {
          document.querySelectorAll('.progress-bar').forEach(b => { b.style.width = (b.dataset.target||0)+'%'; });
        }, 150);
      })();
      </script>`;
    }
  },
 
  // ─── SECURITY ─────────────────────────────────────────────────────────────
  security: {
    get title()    { return t('nav_security'); },
    get subtitle() { return t('security_subtitle'); },
    get content()  {
      return `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-2">${t('anomaly_detection')}</h3>
          <p class="text-sm text-slate-500 mb-4">${t('anomaly_ml_desc')}</p>
          <div class="space-y-2">
            <div class="flex justify-between text-sm"><span>${t('anomaly_score')}</span><span class="font-mono text-amber-500">0.23</span></div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div class="bg-amber-500 h-2 rounded-full" style="width:23%"></div></div>
            <p class="text-xs text-slate-500 mt-1">${t('anomalies_24h')}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-2">${t('ip_monitoring')}</h3>
          <p class="text-sm text-slate-500 mb-4">${t('ip_sessions')}</p>
          <div class="space-y-2 text-sm font-mono">
            <div class="flex justify-between"><span>192.168.1.45</span><span class="text-green-500">${t('active')}</span></div>
            <div class="flex justify-between"><span>10.0.0.22</span><span class="text-green-500">${t('active')}</span></div>
            <div class="flex justify-between"><span>45.67.89.12</span><span class="text-amber-500">${t('unusual')}</span></div>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-2">${t('login_audit')}</h3>
          <p class="text-sm text-slate-500 mb-4">${t('failed_success')}</p>
          <div class="flex gap-4">
            <div><p class="text-2xl font-bold text-green-500">142</p><p class="text-xs">${t('successful')}</p></div>
            <div><p class="text-2xl font-bold text-red-500">3</p><p class="text-xs">${t('failed')}</p></div>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
          <button class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">${t('users')}</button>
          <button class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm">${t('roles_rbac')}</button>
          <button class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm">${t('login_logs')}</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th class="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">${t('user')}</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">${t('role')}</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">${t('status')}</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">${t('last_login')}</th>
                <th class="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">${t('actions')}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr>
                <td class="px-6 py-4"><div class="font-medium">admin@sgs.gov</div><div class="text-xs text-slate-500">Super Admin</div></td>
                <td class="px-6 py-4">Super Admin</td>
                <td class="px-6 py-4"><span class="px-2 py-1 rounded text-xs bg-green-100 text-green-700">${t('active')}</span></td>
                <td class="px-6 py-4 text-sm">2 ${t('min_ago')}</td>
                <td class="px-6 py-4"><button class="text-primary-600 hover:underline text-sm">${t('edit')}</button></td>
              </tr>
              <tr>
                <td class="px-6 py-4"><div class="font-medium">regional@north.gov</div><div class="text-xs text-slate-500">${t('regional_manager')}</div></td>
                <td class="px-6 py-4">${t('regional_manager')}</td>
                <td class="px-6 py-4"><span class="px-2 py-1 rounded text-xs bg-green-100 text-green-700">${t('active')}</span></td>
                <td class="px-6 py-4 text-sm">15 ${t('min_ago')}</td>
                <td class="px-6 py-4"><button class="text-primary-600 hover:underline text-sm">${t('edit')}</button></td>
              </tr>
              <tr>
                <td class="px-6 py-4"><div class="font-medium">federation@football.org</div><div class="text-xs text-slate-500">${t('federation')}</div></td>
                <td class="px-6 py-4">${t('federation')}</td>
                <td class="px-6 py-4"><span class="px-2 py-1 rounded text-xs bg-slate-100 text-slate-600">${t('inactive')}</span></td>
                <td class="px-6 py-4 text-sm">2 ${t('days_ago')}</td>
                <td class="px-6 py-4"><button class="text-primary-600 hover:underline text-sm">${t('edit')}</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;
    }
  },
 
  // ─── CALENDAR ─────────────────────────────────────────────────────────────
  // calendar: {
  //   get title()    { return t('nav_calendar'); },
  //   get subtitle() { return t('calendar_subtitle'); },
  //   get content()  {
  //     return `
  //     <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
  //       <div class="flex gap-2">
  //         <button class="cal-view-btn active px-4 py-2 bg-primary-600 text-white rounded-lg text-sm" data-view="yearly">${t('cal_national')}</button>
  //         <button class="cal-view-btn px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-sm" data-view="monthly">${t('cal_regional')}</button>
  //         <button class="cal-view-btn px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-sm" data-view="weekly">${t('cal_local')}</button>
  //       </div>
  //       <div class="flex gap-2">
  //         <button class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800">
  //           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  //           ${t('google_sync')}
  //         </button>
  //         <button class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800">${t('export_ical')}</button>
  //         <button class="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600" data-modal="event-modal">+ ${t('new_event')}</button>
  //       </div>
  //     </div>
 
  //     <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 flex items-start gap-3">
  //       <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
  //       <div class="flex-1">
  //         <p class="font-medium text-amber-800 dark:text-amber-200">${t('conflict_detected')} — Mar 15</p>
  //         <p class="text-sm text-amber-700 dark:text-amber-300 mt-1">${t('conflict_desc')}</p>
  //         <button class="suggest-slots mt-2 text-sm text-primary-600 font-medium hover:underline">${t('suggest_slots')}</button>
  //       </div>
  //     </div>
 
  //     <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  //       <div class="lg:col-span-2 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
  //         <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-2">
  //           <span id="cal-month-label" class="font-semibold">${t('month_march')} 2025</span>
  //           <div class="flex gap-2">
  //             <button id="cal-prev" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">‹</button>
  //             <button id="cal-today" class="px-3 py-1.5 text-sm border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">${t('today')}</button>
  //             <button id="cal-next" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">›</button>
  //           </div>
  //         </div>
  //         <div class="p-4 grid grid-cols-7 gap-1 text-center text-sm">
  //           <div class="font-medium text-slate-500 py-2">${t('day_mon')}</div>
  //           <div class="font-medium text-slate-500 py-2">${t('day_tue')}</div>
  //           <div class="font-medium text-slate-500 py-2">${t('day_wed')}</div>
  //           <div class="font-medium text-slate-500 py-2">${t('day_thu')}</div>
  //           <div class="font-medium text-slate-500 py-2">${t('day_fri')}</div>
  //           <div class="font-medium text-slate-500 py-2">${t('day_sat')}</div>
  //           <div class="font-medium text-slate-500 py-2">${t('day_sun')}</div>
  //           ${Array.from({length:5}, ()=>'<div class="calendar-day py-2 rounded-lg min-h-[3.5rem]" data-date=""></div>').join('')}
  //           <div class="calendar-day py-2 rounded-lg min-h-[3.5rem] has-event" data-date="2025-03-01">1<div class="flex gap-0.5 mt-0.5 justify-center"><span class="event-dot bg-primary-500"></span></div></div>
  //           ${Array.from({length:9}, (_,i)=>`<div class="calendar-day py-2 rounded-lg min-h-[3.5rem]" data-date="2025-03-0${i+2}">${i+2}</div>`).join('')}
  //           <div class="calendar-day py-2 rounded-lg min-h-[3.5rem] ring-2 ring-primary-500" data-date="2025-03-11">11<div class="flex gap-0.5 mt-0.5 justify-center"><span class="event-dot bg-accent-500"></span></div></div>
  //           ${Array.from({length:2}, (_,i)=>`<div class="calendar-day py-2 rounded-lg min-h-[3.5rem]" data-date="2025-03-1${i+2}">${i+12}</div>`).join('')}
  //           <div class="calendar-day py-2 rounded-lg min-h-[3.5rem] has-event conflict" data-date="2025-03-14">14<div class="flex gap-0.5 mt-0.5 justify-center"><span class="event-dot bg-primary-500"></span><span class="event-dot bg-green-500"></span></div></div>
  //           ${Array.from({length:17}, (_,i)=>`<div class="calendar-day py-2 rounded-lg min-h-[3.5rem]" data-date="2025-03-${i+15}">${i+15}</div>`).join('')}
  //         </div>
  //         <div class="p-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-3">
  //           <span class="text-xs text-slate-500">${t('legend')} :</span>
  //           <span class="flex items-center gap-1.5 text-xs"><span class="event-dot bg-primary-500"></span>${t('sport_event')}</span>
  //           <span class="flex items-center gap-1.5 text-xs"><span class="event-dot bg-accent-500"></span>${t('training')}</span>
  //           <span class="flex items-center gap-1.5 text-xs"><span class="event-dot bg-green-500"></span>${t('meeting')}</span>
  //           <span class="flex items-center gap-1.5 text-xs"><span class="event-dot bg-violet-500"></span>${t('match')}</span>
  //         </div>
  //       </div>
  //       <div class="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
  //         <div class="p-4 border-b border-slate-200 dark:border-slate-700">
  //           <h3 class="font-semibold">${t('events_of_day')}</h3>
  //           <p id="day-events-label" class="text-sm text-slate-500">${t('select_day')}</p>
  //         </div>
  //         <div id="day-events-list" class="p-4 space-y-3">
  //           <p class="text-sm text-slate-400 italic">${t('click_day')}</p>
  //         </div>
  //       </div>
  //     </div>`;
  //   }
  // },
 
  // ─── WORKFLOW ─────────────────────────────────────────────────────────────
  // workflow: {
  //   get title()    { return t('nav_workflow'); },
  //   get subtitle() { return t('workflow_subtitle'); },
  //   get content()  {
  //     return `
  //     <div class="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
  //       <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-3">${t('validation_process')}</h3>
  //       <div class="flex flex-wrap items-center gap-2 md:gap-3 text-sm">
  //         ${[1,2,3,4].map((n,i)=>`
  //           <div class="flex items-center gap-2 px-4 py-2 rounded-lg ${i===2?'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500':'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600'}">
  //             <span class="w-8 h-8 rounded-full ${i===2?'bg-amber-500 text-white':'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200'} flex items-center justify-center text-xs font-bold">${n}</span>
  //             <span>
  //               <strong>${[t('wf_step_submit'),t('wf_step_regional'),t('wf_step_national'),t('wf_step_publish')][i]}</strong><br>
  //               <span class="text-xs ${i===2?'text-amber-600':'text-slate-500'}">${[t('wf_step_submit_sub'),t('wf_step_regional_sub'),t('wf_step_national_sub'),t('wf_step_publish_sub')][i]}</span>
  //             </span>
  //           </div>
  //           ${i<3?'<svg class="w-5 h-5 text-slate-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>':''}`).join('')}
  //       </div>
  //       <p class="text-xs text-slate-500 mt-3">${t('wf_each_level_can')}</p>
  //     </div>
 
  //     <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  //       <div class="lg:col-span-2 space-y-6">
  //         <div class="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
  //           <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
  //             <button class="wf-filter px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white">${t('wf_pending_mine')} (2)</button>
  //             <button class="wf-filter px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${t('all')}</button>
  //             <button class="wf-filter px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${t('approved')}</button>
  //             <button class="wf-filter px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${t('rejected')}</button>
  //           </div>
  //           <div class="divide-y divide-slate-200 dark:divide-slate-700">
  //             <div class="wf-item p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-l-4 border-transparent hover:border-primary-500" data-wf-id="1">
  //               <div class="flex justify-between items-start">
  //                 <div>
  //                   <p class="font-semibold text-slate-800 dark:text-slate-100">${t('wf_championship_football')}</p>
  //                   <p class="text-sm text-slate-500 mt-0.5">25–27 ${t('april')} 2025 • ${t('national_stadium')}</p>
  //                   <p class="text-xs text-slate-400 mt-1">${t('submitted_by')} : ${t('fed_football')} • 10 ${t('march')}, 9:00</p>
  //                 </div>
  //                 <span class="wf-status-badge px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs font-semibold">${t('wf_step_national')}</span>
  //               </div>
  //             </div>
  //             <div class="wf-item p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-l-4 border-transparent hover:border-primary-500" data-wf-id="2">
  //               <div class="flex justify-between items-start">
  //                 <div>
  //                   <p class="font-semibold text-slate-800 dark:text-slate-100">${t('wf_travel_handball')}</p>
  //                   <p class="text-sm text-slate-500 mt-0.5">15–18 ${t('march')} • ${t('capital_north')}</p>
  //                   <p class="text-xs text-slate-400 mt-1">${t('submitted_by')} : Regional Nord • 9 ${t('march')}, 14:30</p>
  //                 </div>
  //                 <span class="wf-status-badge px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs font-semibold">${t('wf_step_national')}</span>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
 
  //       <div class="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
  //         <div class="p-4 border-b border-slate-200 dark:border-slate-700">
  //           <h3 class="font-semibold text-slate-800 dark:text-slate-100">${t('detail_actions')}</h3>
  //           <p class="text-xs text-slate-500 mt-0.5">${t('select_item')}</p>
  //         </div>
  //         <div id="wf-detail" class="p-4">
  //           <div id="wf-detail-empty" class="text-center py-8 text-slate-400">
  //             <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
  //             <p class="text-sm">${t('select_event_detail')}</p>
  //           </div>
  //           <div id="wf-detail-content" class="hidden">
  //             <div class="space-y-4">
  //               <div>
  //                 <h4 id="wf-detail-title" class="font-semibold text-slate-800 dark:text-slate-100"></h4>
  //                 <p id="wf-detail-meta" class="text-sm text-slate-500 mt-1"></p>
  //               </div>
  //               <div class="border-t border-slate-200 dark:border-slate-700 pt-4">
  //                 <p class="text-xs font-medium text-slate-500 uppercase mb-2">${t('validation_history')}</p>
  //                 <div class="space-y-3">
  //                   <div class="workflow-step completed border-l-4 pl-3 py-2 rounded-r">
  //                     <p class="font-medium text-sm">${t('wf_step_submit')}</p>
  //                     <p class="text-xs text-slate-500">10 ${t('march')} 2025</p>
  //                   </div>
  //                   <div class="workflow-step completed border-l-4 pl-3 py-2 rounded-r">
  //                     <p class="font-medium text-sm">${t('wf_step_regional')} ✓</p>
  //                     <p class="text-xs text-slate-500">10 ${t('march')} 2025</p>
  //                   </div>
  //                   <div class="workflow-step active border-l-4 pl-3 py-2 rounded-r">
  //                     <p class="font-medium text-sm">${t('wf_step_national')}</p>
  //                     <p class="text-xs text-amber-500">${t('action_required')}</p>
  //                   </div>
  //                 </div>
  //               </div>
  //               <div class="border-t border-slate-200 dark:border-slate-700 pt-4">
  //                 <label class="block text-xs font-medium text-slate-500 mb-2">${t('comment_optional')}</label>
  //                 <textarea id="wf-comment" class="w-full px-3 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-600 text-sm" rows="2" placeholder="${t('add_comment')}"></textarea>
  //               </div>
  //               <div class="flex gap-2 pt-2">
  //                 <button class="wf-approve flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2">
  //                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
  //                   ${t('approve')}
  //                 </button>
  //                 <button class="wf-reject flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2">
  //                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
  //                   ${t('reject')}
  //                 </button>
  //               </div>
  //               <button class="wf-request-change w-full py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
  //                 ${t('request_changes')}
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>`;
  //   }
  // },
 
  // ─── INFRASTRUCTURE ───────────────────────────────────────────────────────
  infrastructure: {
    get title()    { return t('nav_infrastructure'); },
    get subtitle() { return t('infrastructure_subtitle'); },
    get content()  {
      return `
      <style>
        .infra-card{animation:cardFade .6s ease forwards;transition:all .35s ease}
        .infra-card:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 18px 35px rgba(0,0,0,.18)}
        .infra-img{transition:transform .6s ease}.infra-card:hover .infra-img{transform:scale(1.12)}
        .img-wrap{overflow:hidden}
        @keyframes cardFade{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:translateY(0)}}
      </style>
      <div class="mb-6 flex flex-wrap gap-2 items-center justify-between">
        <div class="flex gap-2">
          <button data-tab="infra-list" class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">${t('list')}</button>
          <button data-tab="infra-map" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">${t('gis_map')}</button>
        </div>
        <div class="flex gap-2 items-center">
          <input type="text" placeholder="${t('search')}..." class="px-3 py-2 rounded-lg border text-sm w-52 dark:bg-slate-900">
          <select class="px-3 py-2 rounded-lg border text-sm dark:bg-slate-900">
            <option>${t('all_types')}</option>
            <option>${t('stadium')}</option>
            <option>${t('pool')}</option>
            <option>${t('gym')}</option>
            <option>${t('complex')}</option>
          </select>
          <button class="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm">${t('add')}</button>
        </div>
      </div>
 
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        ${[
          {v:'247',label:t('total_infra'),   c:'text-primary-600'},
          {v:'198',label:t('active'),        c:'text-green-600'},
          {v:'37', label:t('maintenance'),   c:'text-amber-600'},
          {v:'12', label:t('inactive'),      c:'text-red-600'},
        ].map(s=>`
          <div class="bg-white dark:bg-slate-850 rounded-xl p-4 border text-center">
            <p class="text-2xl font-bold ${s.c}">${s.v}</p>
            <p class="text-xs text-slate-500 mt-1">${s.label}</p>
          </div>`).join('')}
      </div>
 
      <div id="infra-cards-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        ${[
          {name:t('national_stadium'),   loc:t('capital_city'),  region:t('region_center'), grad:'from-green-400 to-emerald-500',  img:'assets/campnou.jpg' },
          {name:t('aquatic_center'),     loc:t('region_center'), region:t('region_center'), grad:'from-amber-400 to-orange-500',   img:'assets/aquatic.jpg' },
          {name:t('gym_complex'),        loc:t('region_north'),  region:t('region_north'),  grad:'from-red-400 to-rose-500',       img:'assets/gym.jpg'     },
          {name:t('east_complex'),       loc:t('region_east'),   region:t('region_east'),   grad:'from-green-400 to-emerald-500',  img:'assets/complexx.webp'},
          {name:t('south_stadium'),      loc:t('region_south'),  region:t('region_south'),  grad:'from-green-400 to-teal-500',     img:'assets/albayt.webp' },
          {name:t('north_pool'),         loc:t('region_north'),  region:t('region_north'),  grad:'from-slate-400 to-slate-500',    img:'assets/pool.jpg'    },
        ].map(c=>`
          <div class="infra-card bg-white dark:bg-slate-850 rounded-2xl border shadow-sm overflow-hidden cursor-pointer">
            <div class="h-2 bg-gradient-to-r ${c.grad}"></div>
            <div class="img-wrap"><img src="${c.img}" class="infra-img w-full h-40 object-cover" onerror="this.src='https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=200&fit=crop'"></div>
            <div class="p-5">
              <h3 class="font-semibold text-slate-800 dark:text-slate-100">${c.name}</h3>
              <p class="text-xs text-slate-500">${c.loc} • ${c.region}</p>
            </div>
          </div>`).join('')}
      </div>
      <div id="infra-map-container" class="hidden h-96 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"></div>`;
    }
  },
 
  // ─── ANALYTICS ────────────────────────────────────────────────────────────
  analytics: {
    get title()    { return t('nav_analytics'); },
    get subtitle() { return t('analytics_subtitle'); },
    get content()  {
      return `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 class="font-semibold mb-4">${t('events_by_region')}</h3>
          <div class="h-56"><canvas id="chart-events-region"></canvas></div>
        </div>
        <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 class="font-semibold mb-4">${t('occupancy_rate')}</h3>
          <div class="h-56"><canvas id="chart-occupancy"></canvas></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 class="font-semibold mb-4">${t('validation_times')}</h3>
          <div class="h-56"><canvas id="chart-validation"></canvas></div>
        </div>
        <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 class="font-semibold mb-4">${t('conflict_stats')}</h3>
          <div class="h-56"><canvas id="chart-conflicts"></canvas></div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 class="font-semibold mb-2">${t('ai_models')}</h3>
        <p class="text-sm text-slate-500 mb-4">${t('ai_models_desc')}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
            <p class="text-xs font-medium text-primary-600 uppercase">${t('prediction_occupancy')}</p>
            <p class="text-2xl font-bold text-primary-600 mt-1">87%</p>
            <p class="text-xs text-slate-500 mt-1">${t('national_stadium')} — ${t('next_month')}</p>
          </div>
          <div class="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p class="text-xs font-medium text-amber-600 uppercase">${t('prediction_maintenance')}</p>
            <p class="text-2xl font-bold text-amber-600 mt-1">3</p>
            <p class="text-xs text-slate-500 mt-1">${t('interventions_30d')}</p>
          </div>
          <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-xs font-medium text-red-600 uppercase">${t('recommendation_risk')}</p>
            <p class="text-2xl font-bold text-red-600 mt-1">1</p>
            <p class="text-xs text-slate-500 mt-1">${t('gym_complex')} — ${t('structure')}</p>
          </div>
        </div>
      </div>`;
    }
  },
 
  // ─── AI INFRA ─────────────────────────────────────────────────────────────
  'ai-infra': {
    get title()    { return t('nav_ai_eval'); },
    get subtitle() { return t('ai_infra_subtitle'); },
    get content()  {
      return `
      <div class="mb-6 p-5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
        <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-2">${t('objective')}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400">${t('ai_infra_desc')}</p>
        <div class="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <p class="text-xs font-medium text-slate-500 uppercase mb-2">${t('processing_pipeline')}</p>
          <div class="flex flex-wrap items-center gap-2">
            ${[
              {label:t('pipeline_photo'),  c:'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'},
              {label:t('pipeline_yolo'),   c:'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'},
              {label:t('pipeline_defects'),c:'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'},
              {label:t('pipeline_score'),  c:'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'},
            ].map((s,i)=>`
              <span class="px-3 py-1.5 rounded-lg text-sm font-medium ${s.c}">${i+1}. ${s.label}</span>
              ${i<3?'<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>':''}`).join('')}
          </div>
        </div>
      </div>
 
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">${t('new_evaluation')}</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">${t('infra_type')}</label>
            <select class="w-full px-4 py-2 rounded-lg border dark:bg-slate-900 dark:border-slate-600">
              <option>${t('stadium')}</option>
              <option>${t('pool')}</option>
              <option>${t('gym')}</option>
              <option>${t('building')}</option>
            </select>
          </div>
          <div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center hover:border-primary-500 transition cursor-pointer" onclick="document.getElementById('upload-photo').click()">
            <svg class="w-14 h-14 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <p class="text-slate-600 dark:text-slate-400 font-medium">${t('upload_photo')}</p>
            <p class="text-xs text-slate-500 mt-1">${t('upload_formats')}</p>
            <input type="file" accept="image/*" class="hidden" id="upload-photo">
          </div>
        </div>
 
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-4">${t('evaluation_result')}</h3>
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">${t('compliance_score')}</span>
                <span class="font-mono font-bold text-lg text-amber-600">68%</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div class="bg-amber-500 h-3 rounded-full" style="width:68%"></div>
              </div>
            </div>
            <h4 class="text-sm font-medium mb-2">${t('detected_defects')}</h4>
            <div class="space-y-2">
              <div class="flex items-center gap-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span class="text-sm"><strong>${t('defect_cracks')}</strong> — ${t('defect_foundation')}</span>
              </div>
              <div class="flex items-center gap-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span class="text-sm"><strong>${t('defect_surface')}</strong> — ${t('defect_east_wall')}</span>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">${t('plan_inspection')}</button>
              <button class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800">${t('create_ticket')}</button>
              <button class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800">${t('export_report')}</button>
            </div>
          </div>
        </div>
      </div>`;
    }
  },

  //__________DOCUMENTS___________

'documents': {
    get title() {
        const role = localStorage.getItem('userRole');
        const titles = {
            'super_admin': 'Gestion documentaire centrale',
            'national_admin': 'Gestion documentaire nationale',
            'regional_manager': 'Documents régionaux',
            'federation': 'Mes documents',
            'participant': 'Mes documents personnels'
        };
        return titles[role] || 'Gestion documentaire';
    },
    get subtitle() { return 'Documents officiels à valeur juridique · Module 04'; },
    get content() {
        if (typeof renderDocumentModule === 'function') {
            return renderDocumentModule();
        }
        if (typeof initDocumentModule === 'function') {
            initDocumentModule();
            return typeof renderDocumentModule === 'function' ? renderDocumentModule() : '<div class="p-4">Chargement module...</div>';
        }
        return '<div class="p-4 text-red-500">Module documents non chargé. Vérifiez que document-module.js est inclus.</div>';
    }
},
  
  // ─── AI DOCUMENTS ─────────────────────────────────────────────────────────
  // 'ai-documents': {
  //   get title()    { return t('nav_ai_docs'); },
  //   get subtitle() { return t('ai_docs_subtitle'); },
  //   get content()  {
  //     return `
  //     <div class="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-green-50 dark:from-primary-900/20 dark:to-green-900/20 border border-primary-200 dark:border-primary-800">
  //       <div class="flex items-start gap-4">
  //         <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
  //           <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
  //         </div>
  //         <div>
  //           <h3 class="font-semibold text-slate-800 dark:text-slate-100">${t('auto_ai_gen')}</h3>
  //           <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">${t('auto_ai_gen_desc')}</p>
  //         </div>
  //       </div>
  //     </div>
 
  //     <div class="mb-6 p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
  //       <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-3">${t('automated_flow')}</h3>
  //       <div class="flex flex-wrap items-center gap-2 md:gap-4 text-sm">
  //         ${[
  //           {n:1, label:t('flow_approved'),   c:'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',   dot:'bg-green-500'},
  //           {n:2, label:t('flow_ai_trigger'), c:'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800', dot:'bg-primary-500'},
  //           {n:3, label:t('flow_gen_docs'),   c:'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',   dot:'bg-amber-500'},
  //           {n:4, label:t('flow_ready'),      c:'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600',      dot:'bg-slate-500'},
  //         ].map((s,i)=>`
  //           <div class="flex items-center gap-2 px-4 py-2 rounded-lg border ${s.c}">
  //             <span class="w-8 h-8 rounded-full ${s.dot} text-white flex items-center justify-center text-xs font-bold">${s.n}</span>
  //             <span>${s.label}</span>
  //           </div>
  //           ${i<3?'<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>':''}`).join('')}
  //       </div>
  //     </div>
 
  //     <div class="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
  //       <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-2">
  //         <h3 class="font-semibold text-slate-800 dark:text-slate-100">${t('generated_docs')}</h3>
  //       </div>
  //       <div class="overflow-x-auto">
  //         <table class="w-full">
  //           <thead class="bg-slate-50 dark:bg-slate-800/50">
  //             <tr>
  //               <th class="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">${t('source_event')}</th>
  //               <th class="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">${t('generated_doc')}</th>
  //               <th class="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">${t('status')}</th>
  //               <th class="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">${t('date')}</th>
  //               <th class="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">${t('actions')}</th>
  //             </tr>
  //           </thead>
  //           <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
  //             <tr>
  //               <td class="px-6 py-4">
  //                 <p class="font-medium text-slate-800 dark:text-slate-100">${t('championship_swimming')}</p>
  //                 <p class="text-xs text-slate-500">${t('approved_on')} 8 ${t('march')} 2025</p>
  //               </td>
  //               <td class="px-6 py-4">
  //                 <div class="flex items-center gap-2 flex-wrap">
  //                   <span class="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 text-xs">${t('travel_authorization')}</span>
  //                   <span class="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 text-xs">${t('convocation')}</span>
  //                 </div>
  //               </td>
  //               <td class="px-6 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">${t('generated')} ✓</span></td>
  //               <td class="px-6 py-4 text-sm">9 ${t('march')}</td>
  //               <td class="px-6 py-4"><button class="ai-doc-dl px-2 py-1 rounded text-xs font-medium bg-primary-600 text-white hover:bg-primary-700">PDF</button></td>
  //             </tr>
  //             <tr>
  //               <td class="px-6 py-4">
  //                 <p class="font-medium text-slate-800 dark:text-slate-100">${t('friendly_football')}</p>
  //                 <p class="text-xs text-slate-500">${t('approved_on')} 7 ${t('march')} 2025</p>
  //               </td>
  //               <td class="px-6 py-4">
  //                 <span class="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 text-xs">${t('travel_authorization')}</span>
  //               </td>
  //               <td class="px-6 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">${t('generated')} ✓</span></td>
  //               <td class="px-6 py-4 text-sm">7 ${t('march')}</td>
  //               <td class="px-6 py-4"><button class="ai-doc-dl px-2 py-1 rounded text-xs font-medium bg-primary-600 text-white hover:bg-primary-700">PDF</button></td>
  //             </tr>
  //             <tr class="bg-amber-50/30 dark:bg-amber-900/10">
  //               <td class="px-6 py-4">
  //                 <p class="font-medium text-slate-800 dark:text-slate-100">${t('wf_championship_football')}</p>
  //                 <p class="text-xs text-slate-500">${t('pending_validation')}</p>
  //               </td>
  //               <td class="px-6 py-4"><span class="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 text-xs">${t('awaiting_validation')}</span></td>
  //               <td class="px-6 py-4"><span class="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">${t('validation_required')}</span></td>
  //               <td class="px-6 py-4 text-sm text-slate-500">—</td>
  //               <td class="px-6 py-4"><span class="text-xs text-slate-400">—</span></td>
  //             </tr>
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>`;
  //   }
  // },
 
  // ─── NOTIFICATIONS ────────────────────────────────────────────────────────
notifications: {
    get title()    { return t('nav_notifications'); },
    get subtitle() { return t('notif_subtitle'); },
    get content()  {
      // Init store if not exists
      if (!window._NOTIFS) {
        window._NOTIFS = [
          {id:1,type:'critical',title:t('notif_critical_title'),desc:t('notif_critical_desc'),page:'ai-infra',read:false,time:new Date(Date.now()-300000)},
          {id:2,type:'workflow',title:t('notif_workflow_title'),desc:t('notif_workflow_desc'),page:'workflow',read:false,time:new Date(Date.now()-1800000)},
          {id:3,type:'calendar',title:t('notif_calendar_title'),desc:t('notif_calendar_desc'),page:'calendar',read:false,time:new Date(Date.now()-3600000)},
          {id:4,type:'infra',title:t('notif_infra_title'),desc:t('notif_infra_desc'),page:'infrastructure',read:false,time:new Date(Date.now()-7200000)},
          {id:5,type:'document',title:t('notif_document_title'),desc:t('notif_document_desc'),page:'documents',read:true,time:new Date(Date.now()-10800000)},
          {id:6,type:'workflow',title:t('notif_workflow2_title'),desc:t('notif_workflow2_desc'),page:'workflow',read:true,time:new Date(Date.now()-14400000)},
        ];
        window._NOTIF_FILTER = 'all';
 
        // Global notify function
        window.sgsNotify = function(type, title, desc, page) {
          var maxId = window._NOTIFS.length ? Math.max.apply(null, window._NOTIFS.map(function(n){return n.id})) : 0;
          window._NOTIFS.unshift({id:maxId+1, type:type, title:title, desc:desc, page:page||null, read:false, time:new Date()});
          // Popup
          var el = document.createElement('div');
          el.style.cssText = 'position:fixed;top:20px;right:20px;background:#1A237E;color:#fff;padding:12px 18px;border-radius:12px;font-size:13px;z-index:9999;display:flex;align-items:center;gap:10px;box-shadow:0 8px 24px rgba(26,35,126,.3);max-width:340px';
          el.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg><span>' + title + '</span>';
          document.body.appendChild(el);
          setTimeout(function(){el.style.opacity='0';el.style.transition='opacity .3s'},3000);
          setTimeout(function(){el.remove()},3400);
          // Update badge
          var badge = document.querySelector('#notif-btn .bg-red-500');
          if (badge) badge.style.display = '';
        };
      }
 
      var N = window._NOTIFS;
      var unread = N.filter(function(n){return !n.read}).length;
      var today = new Date().toDateString();
      var todayCount = N.filter(function(n){return n.time.toDateString()===today}).length;
      var counts = {};
      N.forEach(function(n){counts[n.type]=(counts[n.type]||0)+1});
 
      function timeAgo(d) {
        var s = Math.floor((new Date()-d)/1000);
        if(s<60) return t('notif_just_now');
        if(s<3600) return Math.floor(s/60)+' '+t('notif_min');
        if(s<86400) return Math.floor(s/3600)+t('notif_h');
        return Math.floor(s/86400)+t('notif_d');
      }
 
      var TCFG = {
        critical:{icon:'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',bg:'bg-red-100 dark:bg-red-900/30',ic:'text-red-600',bc:'border-l-red-500',lbl:t('notif_critical_label'),lc:'text-red-600'},
        workflow:{icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',bg:'bg-amber-100 dark:bg-amber-900/30',ic:'text-amber-600',bc:'border-l-amber-500',lbl:t('notif_workflow_label'),lc:'text-amber-600'},
        calendar:{icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',bg:'bg-blue-100 dark:bg-blue-900/30',ic:'text-blue-600',bc:'border-l-blue-500',lbl:t('notif_calendar_label'),lc:'text-blue-600'},
        infra:{icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',bg:'bg-slate-100 dark:bg-slate-800',ic:'text-slate-600',bc:'border-l-slate-400',lbl:t('notif_infra_label'),lc:'text-slate-600'},
        document:{icon:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',bg:'bg-green-100 dark:bg-green-900/30',ic:'text-green-600',bc:'border-l-green-500',lbl:t('notif_document_label'),lc:'text-green-600'},
      };
 
      function renderNotifList(filter) {
        var list = filter === 'all' ? N : N.filter(function(n){return n.type===filter});
        if (!list.length) return '<div style="text-align:center;padding:60px 20px;color:#94a3b8"><svg style="margin:0 auto 12px;opacity:.4" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg><p style="font-size:14px;font-weight:600">'+t('notif_no_notifications')+'</p></div>';
        return list.map(function(n){
          var c = TCFG[n.type] || TCFG.infra;
          return '<div style="padding:14px 16px;border-bottom:1px solid var(--doc-border,#e2e8f0);border-left:3px solid;cursor:pointer;transition:all .15s;opacity:'+(n.read?'.55':'1')+'" class="'+c.bc+' hover:bg-slate-50 dark:hover:bg-slate-800/50" onclick="window._ntfClick('+n.id+')">'
          +'<div style="display:flex;gap:12px;align-items:flex-start">'
          +'<div class="w-10 h-10 rounded-xl '+c.bg+' flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5 '+c.ic+'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="'+c.icon+'"/></svg></div>'
          +'<div style="flex:1;min-width:0">'
          +'<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px"><span class="text-xs font-bold uppercase '+c.lc+'">'+c.lbl+'</span>'+(!n.read?'<span style="width:6px;height:6px;border-radius:50%;background:#1A237E"></span>':'')+'</div>'
          +'<p style="font-weight:600;font-size:13px;color:var(--doc-text,#1e293b);margin:0">'+n.title+'</p>'
          +'<p style="font-size:12px;color:#94a3b8;margin:3px 0 0">'+n.desc+'</p>'
          +'<div style="display:flex;align-items:center;gap:8px;margin-top:6px">'
          +'<span style="font-size:11px;color:#94a3b8">'+timeAgo(n.time)+'</span>'
          +(n.page?'<span style="font-size:11px;color:#1A237E;font-weight:500">'+t('notif_view')+' →</span>':'')
          +'<span style="margin-left:auto;display:flex;gap:4px">'
          +(!n.read?'<button onclick="event.stopPropagation();window._ntfRead('+n.id+')" style="background:none;border:none;cursor:pointer;font-size:11px;color:#94a3b8;padding:2px 6px;border-radius:4px" onmouseenter="this.style.background=\'#f1f5f9\'" onmouseleave="this.style.background=\'none\'">'+t('notif_mark_read')+'</button>':'')
          +'<button onclick="event.stopPropagation();window._ntfDel('+n.id+')" style="background:none;border:none;cursor:pointer;font-size:11px;color:#94a3b8;padding:2px 6px;border-radius:4px" onmouseenter="this.style.background=\'#fef2f2\';this.style.color=\'#dc2626\'" onmouseleave="this.style.background=\'none\';this.style.color=\'#94a3b8\'">✕</button>'
          +'</span></div></div></div></div>';
        }).join('');
      }
 
      return `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-slate-850 rounded-xl p-4 border border-red-200 dark:border-red-900 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><span class="text-red-600 font-bold" id="ntf-k-unread">${unread}</span></div>
          <div><p class="text-xs text-slate-500">${t('notif_unread')}</p><p class="font-semibold text-slate-800 dark:text-slate-100">${t('notif_critical')}</p></div>
        </div>
        <div class="bg-white dark:bg-slate-850 rounded-xl p-4 border flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><span class="text-amber-600 font-bold">${counts.workflow||0}</span></div>
          <div><p class="text-xs text-slate-500">${t('notif_workflow')}</p><p class="font-semibold text-slate-800 dark:text-slate-100">${t('notif_validations')}</p></div>
        </div>
        <div class="bg-white dark:bg-slate-850 rounded-xl p-4 border flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><span class="text-green-600 font-bold" id="ntf-k-today">${todayCount}</span></div>
          <div><p class="text-xs text-slate-500">${t('notif_today')}</p><p class="font-semibold text-slate-800 dark:text-slate-100">${t('notif_received')}</p></div>
        </div>
        <div class="bg-white dark:bg-slate-850 rounded-xl p-4 border flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"><div class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div></div>
          <div><p class="text-xs text-slate-500">WebSocket</p><p class="font-semibold text-slate-800 dark:text-slate-100">${t('notif_connected')}</p></div>
        </div>
      </div>
 
      <div style="display:grid;grid-template-columns:1fr 300px;gap:16px">
        <div class="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div style="padding:12px 16px;border-bottom:1px solid #e2e8f0;display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:space-between">
            <div style="display:flex;gap:4px;flex-wrap:wrap">
              <button class="ntf-fbtn px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 text-white" onclick="window._ntfSetFilter('all',this)">${t('notif_all')} (${N.length})</button>
              <button class="ntf-fbtn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" onclick="window._ntfSetFilter('critical',this)">${t('notif_critical')} (${counts.critical||0})</button>
              <button class="ntf-fbtn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" onclick="window._ntfSetFilter('workflow',this)">${t('notif_workflow')} (${counts.workflow||0})</button>
              <button class="ntf-fbtn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" onclick="window._ntfSetFilter('calendar',this)">${t('notif_calendar')} (${counts.calendar||0})</button>
              <button class="ntf-fbtn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" onclick="window._ntfSetFilter('document',this)">${t('notif_documents')} (${counts.document||0})</button>
            </div>
            <div style="display:flex;gap:6px">
              <button onclick="window._ntfMarkAll()" style="padding:4px 10px;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;background:transparent;color:#1A237E">${t('notif_mark_all_read')}</button>
              <button onclick="window._ntfClearAll()" style="padding:4px 10px;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;background:transparent;color:#dc2626">${t('notif_clear_all')}</button>
            </div>
          </div>
          <div id="ntf-list" style="max-height:520px;overflow-y:auto">
            ${renderNotifList(window._NOTIF_FILTER || 'all')}
          </div>
        </div>
 
        <div>
          <div class="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-4">
            <div style="padding:14px 16px;border-bottom:1px solid #e2e8f0"><h3 style="font-size:14px;font-weight:600;margin:0">${t('notif_channels')}</h3></div>
            <div style="padding:12px 16px">
              ${[
                {l:t('notif_email'), s:localStorage.getItem('userEmail')||'admin@sgs.gov'},
                {l:t('notif_sms'), s:'+216 XX XXX XXX'},
                {l:t('notif_push'), s:t('notif_browser_enabled')},
                {l:t('notif_websocket'), s:t('notif_realtime_active')}
              ].map(ch=>`
                <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9">
                  <div><p style="font-size:13px;font-weight:500;margin:0">${ch.l}</p><p style="font-size:11px;color:#94a3b8;margin:2px 0 0">${ch.s}</p></div>
                  <div style="width:36px;height:20px;border-radius:10px;background:#1A237E;position:relative;cursor:pointer"><div style="width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;right:2px;top:2px"></div></div>
                </div>`).join('')}
            </div>
          </div>
          <div class="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div style="padding:14px 16px;border-bottom:1px solid #e2e8f0"><h3 style="font-size:14px;font-weight:600;margin:0">${t('notif_preferences')}</h3></div>
            <div style="padding:12px 16px">
              ${[
                {l:t('notif_critical_alerts'), s:t('notif_always_notified')},
                {l:t('notif_workflow'), s:t('notif_pending_validations')},
                {l:t('notif_calendar_conflicts'), s:t('notif_auto_detection')},
                {l:t('notif_documents'), s:t('notif_signatures_archiving')}
              ].map(p=>`
                <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9">
                  <div><p style="font-size:12px;font-weight:500;margin:0">${p.l}</p><p style="font-size:10px;color:#94a3b8;margin:1px 0 0">${p.s}</p></div>
                  <div style="width:36px;height:20px;border-radius:10px;background:#1A237E;position:relative;cursor:pointer"><div style="width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;right:2px;top:2px"></div></div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
 
      <script>
      (function(){
        // Render helper (reusable)
        function timeAgo(d){var s=Math.floor((new Date()-d)/1000);if(s<60)return '${t('notif_just_now')}';if(s<3600)return Math.floor(s/60)+' ${t('notif_min')}';if(s<86400)return Math.floor(s/3600)+'${t('notif_h')}';return Math.floor(s/86400)+'${t('notif_d')}';}
        var TCFG={
          critical:{icon:'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',bg:'bg-red-100 dark:bg-red-900/30',ic:'text-red-600',bc:'border-l-red-500',lbl:'${t('notif_critical_label')}',lc:'text-red-600'},
          workflow:{icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',bg:'bg-amber-100 dark:bg-amber-900/30',ic:'text-amber-600',bc:'border-l-amber-500',lbl:'${t('notif_workflow_label')}',lc:'text-amber-600'},
          calendar:{icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',bg:'bg-blue-100 dark:bg-blue-900/30',ic:'text-blue-600',bc:'border-l-blue-500',lbl:'${t('notif_calendar_label')}',lc:'text-blue-600'},
          infra:{icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',bg:'bg-slate-100 dark:bg-slate-800',ic:'text-slate-600',bc:'border-l-slate-400',lbl:'${t('notif_infra_label')}',lc:'text-slate-600'},
          document:{icon:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',bg:'bg-green-100 dark:bg-green-900/30',ic:'text-green-600',bc:'border-l-green-500',lbl:'${t('notif_document_label')}',lc:'text-green-600'},
        };
 
        function renderList(filter){
          var N=window._NOTIFS;
          var list=filter==='all'?N:N.filter(function(n){return n.type===filter});
          if(!list.length)return'<div style="text-align:center;padding:60px 20px;color:#94a3b8"><svg style="margin:0 auto 12px;opacity:.4" width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg><p style="font-size:14px;font-weight:600">${t('notif_no_notifications')}</p></div>';
          return list.map(function(n){var c=TCFG[n.type]||TCFG.infra;return'<div style="padding:14px 16px;border-bottom:1px solid var(--doc-border,#e2e8f0);border-left:3px solid;cursor:pointer;transition:all .15s;opacity:'+(n.read?'.55':'1')+'" class="'+c.bc+' hover:bg-slate-50 dark:hover:bg-slate-800/50" onclick="window._ntfClick('+n.id+')"><div style="display:flex;gap:12px;align-items:flex-start"><div class="w-10 h-10 rounded-xl '+c.bg+' flex items-center justify-center flex-shrink-0"><svg class="w-5 h-5 '+c.ic+'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="'+c.icon+'"/></svg></div><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px;margin-bottom:2px"><span class="text-xs font-bold uppercase '+c.lc+'">'+c.lbl+'</span>'+(!n.read?'<span style="width:6px;height:6px;border-radius:50%;background:#1A237E"></span>':'')+'</div><p style="font-weight:600;font-size:13px;color:var(--doc-text,#1e293b);margin:0">'+n.title+'</p><p style="font-size:12px;color:#94a3b8;margin:3px 0 0">'+n.desc+'</p><div style="display:flex;align-items:center;gap:8px;margin-top:6px"><span style="font-size:11px;color:#94a3b8">'+timeAgo(n.time)+'</span>'+(n.page?'<span style="font-size:11px;color:#1A237E;font-weight:500">${t('notif_view')} →</span>':'')+'<span style="margin-left:auto;display:flex;gap:4px">'+(!n.read?'<button onclick="event.stopPropagation();window._ntfRead('+n.id+')" style="background:none;border:none;cursor:pointer;font-size:11px;color:#94a3b8;padding:2px 6px;border-radius:4px">${t('notif_mark_read')}</button>':'')+'<button onclick="event.stopPropagation();window._ntfDel('+n.id+')" style="background:none;border:none;cursor:pointer;font-size:11px;color:#94a3b8;padding:2px 6px;border-radius:4px">✕</button></span></div></div></div></div>';}).join('');
        }
 
        function refresh(){
          var el=document.getElementById('ntf-list');if(el)el.innerHTML=renderList(window._NOTIF_FILTER||'all');
          var u=window._NOTIFS.filter(function(n){return!n.read}).length;
          var k=document.getElementById('ntf-k-unread');if(k)k.textContent=u;
          var badge=document.querySelector('#notif-btn .bg-red-500');if(badge)badge.style.display=u>0?'':'none';
        }
 
        window._ntfClick=function(id){var n=window._NOTIFS.find(function(x){return x.id===id});if(!n)return;n.read=true;if(n.page&&typeof navigateTo==='function')navigateTo(n.page);else refresh();};
        window._ntfRead=function(id){var n=window._NOTIFS.find(function(x){return x.id===id});if(n)n.read=true;refresh();};
        window._ntfDel=function(id){var i=window._NOTIFS.findIndex(function(x){return x.id===id});if(i!==-1)window._NOTIFS.splice(i,1);refresh();};
        window._ntfMarkAll=function(){window._NOTIFS.forEach(function(n){n.read=true});refresh();};
        window._ntfClearAll=function(){if(!confirm('${t('notif_clear_confirm')}'))return;window._NOTIFS=[];refresh();};
        window._ntfSetFilter=function(f,btn){
          window._NOTIF_FILTER=f;
          document.querySelectorAll('.ntf-fbtn').forEach(function(b){b.classList.remove('bg-primary-600','text-white');b.classList.add('bg-slate-100','dark:bg-slate-800','text-slate-600','dark:text-slate-400');});
          btn.classList.remove('bg-slate-100','dark:bg-slate-800','text-slate-600','dark:text-slate-400');btn.classList.add('bg-primary-600','text-white');
          refresh();
        };
      })();
      </script>`;
    }
  },
 
  // ─── REPORTS ──────────────────────────────────────────────────────────────
  // reports: {
  //   get title()    { return t('nav_reports'); },
  //   get subtitle() { return t('reports_subtitle'); },
  //   get content()  {
  //     return `
  //     <div class="mb-4 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 flex items-center gap-2">
  //       <svg class="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
  //       <p class="text-sm text-primary-800 dark:text-primary-200">${t('reports_signature_required')}</p>
  //     </div>
  //     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //       ${[
  //         {title:t('report_national'),    desc:t('report_national_desc'),   sign:true },
  //         {title:t('report_regional'),    desc:t('report_regional_desc'),   sign:true },
  //         {title:t('report_workflow'),    desc:t('report_workflow_desc'),   sign:false},
  //         {title:t('report_sport_stats'), desc:t('report_sport_stats_desc'),sign:true },
  //       ].map(r=>`
  //         <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition relative">
  //           ${r.sign?`<span class="absolute top-4 right-4 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">${t('signature_required')}</span>`:''}
  //           <h3 class="font-semibold mb-2">${r.title}</h3>
  //           <p class="text-sm text-slate-500 mb-4">${r.desc}</p>
  //           <div class="flex gap-2 flex-wrap">
  //             ${r.sign?`<button class="report-sign-export px-3 py-1.5 bg-primary-600 text-white rounded text-sm font-medium" data-report="${r.title}">${t('sign_and_pdf')}</button>`:''}
  //             <button class="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 rounded text-sm">Excel</button>
  //             <button class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">CSV</button>
  //           </div>
  //         </div>`).join('')}
  //     </div>
 
  //     <div id="signature-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
  //       <div class="bg-white dark:bg-slate-850 rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
  //         <h3 class="text-lg font-semibold mb-2">${t('digital_signature')}</h3>
  //         <p class="text-sm text-slate-500 mb-4">${t('sign_desc')} <span id="sign-report-name" class="font-medium text-slate-700 dark:text-slate-300"></span></p>
  //         <div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl mb-4 bg-white dark:bg-slate-900">
  //           <canvas id="signature-pad" width="400" height="180" class="w-full rounded-lg cursor-crosshair"></canvas>
  //         </div>
  //         <div class="flex justify-between items-center">
  //           <button type="button" id="signature-clear" class="text-sm text-slate-500 hover:text-slate-700">${t('clear')}</button>
  //           <div class="flex gap-2">
  //             <button class="px-4 py-2 border rounded-lg" data-close-modal="signature-modal">${t('cancel')}</button>
  //             <button id="signature-confirm" class="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">${t('sign_export_pdf')}</button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>`;
  //   }
  // },
 
  // ─── GIS ──────────────────────────────────────────────────────────────────
  gis: {
    get title()    { return t('nav_gis'); },
    get subtitle() { return t('gis_subtitle'); },
    get content()  {
      return `
      <div class="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 items-center justify-between">
          <div class="flex flex-wrap gap-2 items-center">
            <div class="relative">
              <input type="text" id="gis-search" placeholder="${t('search_infrastructure')}..." class="pl-10 pr-4 py-2 rounded-lg border dark:bg-slate-900 w-64 text-sm">
              <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <select id="gis-region" class="px-3 py-2 rounded-lg border dark:bg-slate-900 text-sm">
              <option value="">${t('all_regions')}</option>
              <option>${t('region_north')}</option>
              <option>${t('region_center')}</option>
              <option>${t('region_south')}</option>
              <option>${t('region_east')}</option>
              <option>${t('region_west')}</option>
            </select>
            <select id="gis-type" class="px-3 py-2 rounded-lg border dark:bg-slate-900 text-sm">
              <option value="">${t('all_types')}</option>
              <option>${t('stadium')}</option>
              <option>${t('pool')}</option>
              <option>${t('gym')}</option>
              <option>${t('complex')}</option>
            </select>
          </div>
          <div class="flex gap-2 items-center">
            <button id="gis-layer-street" class="gis-layer px-3 py-1.5 bg-primary-600 text-white rounded text-sm">${t('plan')}</button>
            <button id="gis-layer-satellite" class="gis-layer px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded text-sm">${t('satellite')}</button>
            <button id="gis-locate" class="px-3 py-1.5 border rounded text-sm flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              ${t('my_location')}
            </button>
          </div>
        </div>
        <div id="gis-map" class="h-[calc(100vh-280px)] min-h-[400px]"></div>
        <div class="p-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center">
          <span class="text-sm font-medium text-slate-600 dark:text-slate-400">${t('legend')} :</span>
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2"><span class="w-4 h-4 rounded-full bg-blue-500"></span><span class="text-sm">${t('stadium')}</span></div>
            <div class="flex items-center gap-2"><span class="w-4 h-4 rounded-full bg-cyan-500"></span><span class="text-sm">${t('pool')}</span></div>
            <div class="flex items-center gap-2"><span class="w-4 h-4 rounded-full bg-green-500"></span><span class="text-sm">${t('gym')}</span></div>
            <div class="flex items-center gap-2"><span class="w-4 h-4 rounded-full bg-amber-500"></span><span class="text-sm">${t('complex')}</span></div>
          </div>
          <span class="text-xs text-slate-500 ml-auto">247 ${t('geolocated_infra')}</span>
        </div>
      </div>`;
    }
  },
 
  // ─── SYNC ─────────────────────────────────────────────────────────────────
  sync: {
    get title()    { return t('nav_sync'); },
    get subtitle() { return t('sync_subtitle'); },
    get content()  {
      return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 class="font-semibold mb-4">${t('offline_sync')}</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center"><span>${t('last_sync')}</span><span class="font-mono text-sm">2 ${t('min_ago')}</span></div>
            <div class="flex justify-between items-center"><span>${t('pending_changes')}</span><span class="font-mono text-sm text-amber-500">0</span></div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div class="bg-green-500 h-2 rounded-full w-full"></div></div>
            <p class="text-xs text-green-600">${t('all_synced')}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 class="font-semibold mb-4">${t('api_connectivity')}</h3>
          <div class="space-y-3">
            ${[
              {label:t('svc_api'),      ok:true },
              {label:t('svc_calendar'), ok:true },
              {label:t('svc_notif'),    ok:true },
              {label:t('svc_ai'),       ok:false},
            ].map(s=>`
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full ${s.ok?'bg-green-500 animate-pulse':'bg-amber-500'}"></div>
                <span class="flex-1">${s.label}</span>
                <span class="${s.ok?'text-green-600':'text-amber-600'} text-sm">${s.ok?t('online'):t('degraded')}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div class="mt-6 bg-white dark:bg-slate-850 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <button class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">${t('sync_now')}</button>
      </div>`;
    }
  },
 
  // ─── RESERVATIONS ──
  reservations: {
    get title()    { return t('nav_reservations'); },
    get subtitle() { return t('reservations_subtitle'); },
    get content()  { return PAGES_RESERVATIONS_CONTENT(); }
  }
};
 
function PAGES_RESERVATIONS_CONTENT() {
  return `
      <style>
        .res-kpi-card { transition: all 0.2s ease; }
        .res-kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
        .occ-bar { height: 8px; border-radius: 4px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }
        .view-btn { transition: all 0.18s; padding: 8px 14px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .view-btn.active { background: #1A237E; color: #fff; box-shadow: 0 4px 12px rgba(51,166,255,0.3); }
        .view-btn:not(.active) { background: #f1f5f9; color: #64748b; }
        html.dark .view-btn:not(.active) { background: #1e293b; color: #94a3b8; }
        .period-tab { transition: all 0.18s; padding: 6px 16px; border-radius: 7px; font-size: 0.78rem; font-weight: 600; cursor: pointer; }
        .period-tab.active { background: #1A237E; color: #fff; }
        .period-tab:not(.active) { background: #f1f5f9; color: #64748b; }
        html.dark .period-tab:not(.active) { background: #1e293b; color: #94a3b8; }
        .badge-approved { background: rgba(51,166,255,0.13); color: #1A237E; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .badge-pending { background: rgba(245,158,11,0.13); color: #f59e0b; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .badge-closed { background: rgba(239,68,68,0.12); color: #E42125; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .res-page { display: none; }
        .res-page.active { display: block; }
        #res-planning-grid {
          display: grid;
          grid-template-columns: 60px repeat(7, 140px);
          overflow: auto;
          max-height: 580px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        html.dark #res-planning-grid { border-color: #334155; }
        .pg-header-cell { padding: 10px 8px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; background: #f8fafc; border-bottom: 2px solid #e2e8f0; position: sticky; top: 0; z-index: 10; text-align: center; }
        html.dark .pg-header-cell { background: #1e293b; border-color: #334155; }
        .pg-time-cell { padding: 6px 4px; font-size: 0.65rem; font-family: 'JetBrains Mono', monospace; color: #94a3b8; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #f1f5f9; background: #fafbfc; text-align: right; position: sticky; left: 0; z-index: 5; height: 52px; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; }
        html.dark .pg-time-cell { background: #1a2332; border-color: #263344; color: #475569; }
        .pg-cell { height: 52px; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; position: relative; transition: background 0.15s; }
        html.dark .pg-cell { border-color: #263344; }
        .pg-cell:hover { background: rgba(51,166,255,0.04); }
        .res-block { position: absolute; top: 3px; bottom: 3px; left: 3px; right: 3px; border-radius: 7px; padding: 4px 7px; font-size: 0.7rem; font-weight: 600; cursor: grab; user-select: none; display: flex; flex-direction: column; justify-content: center; overflow: hidden; transition: box-shadow 0.15s, transform 0.1s; z-index: 2; }
        .res-block:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.18); transform: scale(1.02); }
        .res-block.approved { background: #1A237E; color: #fff; }
        .res-block.pending { background: #f59e0b; color: #fff; }
        .res-block.closed { background: #E42125; color: #fff; }
        .res-card { transition: all 0.25s; border: 1px solid; }
        .res-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.1); }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fade-slide { animation: fadeSlide 0.35s ease forwards; }
      </style>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="res-kpi-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div class="flex items-start justify-between mb-3">
            <div class="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">${t('this_month')}</span>
          </div>
          <p class="text-3xl font-bold text-slate-800 dark:text-slate-100" id="res-total">142</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${t('kpi_total_res')}</p>
        </div>

        <div class="res-kpi-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div class="flex items-start justify-between mb-3">
            <div class="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-amber-600">74%</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${t('kpi_avg_occ')}</p>
          <div class="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div class="occ-bar bg-amber-500" style="width:74%"></div>
          </div>
        </div>

        <div class="res-kpi-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
          <div class="flex items-start justify-between mb-3">
            <div class="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>${t('action_required')}
            </span>
          </div>
          <p class="text-3xl font-bold text-amber-600">8</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${t('kpi_pending_res')}</p>
        </div>

        <div class="res-kpi-card bg-white dark:bg-slate-850 rounded-2xl p-5 border border-red-200 dark:border-red-900">
          <div class="flex items-start justify-between mb-3">
            <div class="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-red-600">2</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${t('kpi_conflicts_res')}</p>
        </div>
      </div>

      <!-- Occupation par stade -->
      <div class="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-5">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 class="font-semibold text-slate-800 dark:text-slate-100">${t('occ_title')}</h3>
            <p class="text-xs text-slate-500 mt-0.5">${t('occ_subtitle')}</p>
          </div>
          <div class="flex gap-1.5" id="res-period-tabs">
            <button class="period-tab active" data-period="day">${t('period_day')}</button>
            <button class="period-tab" data-period="week">${t('period_week')}</button>
            <button class="period-tab" data-period="month">${t('period_month')}</button>
            <button class="period-tab" data-period="year">${t('period_year')}</button>
          </div>
        </div>
        <div id="res-occ-rows" class="space-y-3 mb-5"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase mb-2">${t('chart_daily_occ')}</p>
            <div class="h-36"><canvas id="res-chart-occ-main"></canvas></div>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-500 uppercase mb-2">${t('chart_res_type')}</p>
            <div class="h-36"><canvas id="res-chart-type"></canvas></div>
          </div>
        </div>
      </div>

      <!-- Main section -->
      <div class="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-3 items-center justify-between">
          <div class="flex gap-2">
            <select id="res-stadium-select" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium">
              <option value="rades">${t('stadium_rades')}</option>
              <option value="moknine">${t('stadium_moknine')}</option>
              <option value="sfax">${t('stadium_sfax')}</option>
              <option value="sousse">${t('stadium_sousse')}</option>
            </select>
            <select id="res-status-filter" class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
              <option value="">${t('all_statuses')}</option>
              <option value="approved">${t('status_approved')}</option>
              <option value="pending">${t('status_pending')}</option>
              <option value="closed">${t('status_closed')}</option>
            </select>
            <select id="res-activity-filter" class="hidden md:block px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
              <option value="">${t('all_activities')}</option>
              <option value="football">${t('activity_football')}</option>
              <option value="athletics">${t('activity_athletics')}</option>
              <option value="concert">${t('activity_concert')}</option>
              <option value="training">${t('activity_training')}</option>
            </select>
          </div>
          <div class="flex gap-2 items-center">
            <div class="relative hidden md:block">
              <input type="text" id="res-search" placeholder="${t('search')}..." class="pl-8 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm w-44">
              <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <div class="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button class="view-btn active" data-view="table" onclick="if(window.resModule) resModule.switchView('table')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18M3 14h18M3 18h18"/></svg>
                ${t('view_table')}
              </button>
              <button class="view-btn" data-view="cards" onclick="if(window.resModule) resModule.switchView('cards')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                ${t('view_cards')}
              </button>
              <button class="view-btn" data-view="planning" onclick="if(window.resModule) resModule.switchView('planning')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                ${t('view_planning')}
              </button>
            </div>
            <button onclick="if(window.resModule) resModule.openModal()" class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 ml-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              ${t('new_reservation')}
            </button>
          </div>
        </div>

        <div id="res-view-table" class="res-page active"></div>
        <div id="res-view-cards" class="res-page p-5"></div>
        <div id="res-view-planning" class="res-page p-5"></div>
      </div>

      <!-- Modal nouvelle réservation -->
      <div id="res-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 hidden">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-bold mb-5 text-slate-800 dark:text-slate-100">${t('modal_title')}</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">${t('modal_stadium')}</label>
              <select id="res-modal-stadium" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option value="rades">${t('stadium_rades')}</option>
                <option value="moknine">${t('stadium_moknine')}</option>
                <option value="sfax">${t('stadium_sfax')}</option>
                <option value="sousse">${t('stadium_sousse')}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">${t('modal_applicant')}</label>
              <input type="text" id="res-modal-applicant" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">${t('modal_activity')}</label>
              <select id="res-modal-activity" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                <option value="football">${t('activity_football')}</option>
                <option value="athletics">${t('activity_athletics')}</option>
                <option value="concert">${t('activity_concert')}</option>
                <option value="training">${t('activity_training')}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1.5">${t('modal_date')}</label>
                <input type="date" id="res-modal-date" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5">${t('modal_capacity')}</label>
                <input type="number" id="res-modal-capacity" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1.5">${t('modal_start')}</label>
                <input type="time" id="res-modal-start" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5">${t('modal_end')}</label>
                <input type="time" id="res-modal-end" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">${t('modal_notes')}</label>
              <textarea id="res-modal-notes" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm h-20"></textarea>
            </div>
          </div>
          <div class="mt-5 flex gap-2 justify-end">
            <button onclick="if(window.resModule) resModule.closeModal()" class="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">${t('cancel')}</button>
            <button onclick="if(window.resModule) resModule.submitReservation()" class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold">${t('submit_request')}</button>
          </div>
        </div>
      </div>

      <!-- Modal détail -->
      <div id="res-detail-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 hidden">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
          <div class="flex items-start justify-between mb-4">
            <h3 id="res-detail-title" class="text-lg font-bold text-slate-800 dark:text-slate-100"></h3>
            <button onclick="if(window.resModule) resModule.closeDetailModal()" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">✕</button>
          </div>
          <div id="res-detail-body" class="space-y-3"></div>
          <div id="res-detail-actions" class="mt-5 flex gap-2"></div>
        </div>
      </div>

      <!-- Toast -->
      <div id="res-toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden">
        <div class="bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium">
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span id="res-toast-text"></span>
        </div>
      </div>

      <div class="fixed hidden" id="res-tooltip"></div>
      <div class="fixed hidden" id="res-drag-ghost"></div>

      <script>
        (function() {
          setTimeout(function() {
            if (typeof ReservationModule !== 'undefined') {
              window.resModule = new ReservationModule();
              resModule.init();
            }
          }, 100);
        })();
      </script>
  `;
}
// ─── Données ──────────────────────────────────────────────────────────────────

const CALENDAR_EVENTS = [
  { id: 1, title: 'Championnat national', type: 'sport', date: '2025-03-01', start: '14:00', end: '18:00', location: 'Stade national', color: 'primary' },
  { id: 2, title: 'Réunion planning', type: 'meeting', date: '2025-03-10', start: '10:00', end: '11:30', location: 'Bureau régional', color: 'green' },
  { id: 3, title: 'Entraînement Équipe A', type: 'training', date: '2025-03-11', start: '09:00', end: '11:00', location: 'Complexe nord', color: 'accent' },
  { id: 4, title: 'Session entraînement', type: 'training', date: '2025-03-14', start: '09:00', end: '11:00', location: 'Stade régional', color: 'accent' },
  { id: 5, title: 'Réunion régionale', type: 'meeting', date: '2025-03-14', start: '10:00', end: '12:00', location: 'Stade régional', color: 'green' },
  { id: 6, title: 'Entraînement', type: 'training', date: '2025-03-17', start: '16:00', end: '18:00', location: 'Piscine centrale', color: 'accent' },
  { id: 7, title: 'Match amical', type: 'match', date: '2025-03-21', start: '15:00', end: '17:00', location: 'Stade national', color: 'violet' },
];

const WF_ITEMS = [
  { id: 1, title: 'Championnat national — Football', meta: '25–27 avril 2025 • Stade national • Fed. Football', status: 'national' },
  { id: 2, title: 'Autorisation voyage — Équipe Handball', meta: 'Déplacement 15–18 mars • Capital → Région Nord', status: 'national' },
  { id: 3, title: 'Match amical — Basket', meta: '21 mars 2025 • Complexe Est', status: 'regional' },
];

const GIS_INFRASTRUCTURES = [
  { name: 'National Stadium', type: 'Stade', region: 'Centre', lat: 33.5731, lng: -7.5898, capacity: 50000 },
  { name: 'Central Aquatic Center', type: 'Piscine', region: 'Centre', lat: 33.9, lng: -6.9, capacity: 3000 },
  { name: 'Regional Gym Complex', type: 'Salle de sport', region: 'Nord', lat: 34.2, lng: -5.8, capacity: 2500 },
  { name: 'East Sports Complex', type: 'Complexe', region: 'Est', lat: 33.4, lng: -5.2, capacity: 15000 },
  { name: 'South Stadium', type: 'Stade', region: 'Sud', lat: 32.8, lng: -7.2, capacity: 25000 },
  { name: 'North Pool', type: 'Piscine', region: 'Nord', lat: 34.5, lng: -6.1, capacity: 2000 },
  { name: 'West Arena', type: 'Complexe', region: 'Ouest', lat: 33.6, lng: -8.0, capacity: 8000 },
];

// ─── Instances ────────────────────────────────────────────────────────────────

let mapInstance = null;
let gisMapInstance = null;
let gisTileLayer = null;
let gisMarkersGroup = null;
let signing = false;
let currentSignReport = '';

// ─── Auth ─────────────────────────────────────────────────────────────────────

function login() {
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('main-app').classList.add('flex');
  navigateTo('dashboard');
}

function logout() {
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('main-app').classList.remove('flex');
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function navigateTo(pageId) {
  lastPageId = pageId;
  document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
  document.getElementById('sidebar')?.classList.add('-translate-x-full');
  const link = document.querySelector(`[data-page="${pageId}"]`);
  if (link) link.classList.add('active');
  const page = PAGES[pageId];
  if (!page) return;
  const keys = typeof PAGE_TITLE_KEYS !== 'undefined' && PAGE_TITLE_KEYS[pageId];
  document.getElementById('page-title').textContent = keys ? t(keys.title) : page.title;
  document.getElementById('page-subtitle').textContent = keys ? t(keys.subtitle) : page.subtitle;
  document.getElementById('content-area').innerHTML = page.content;
  translatePageContent();
  
  // Page specific initializations
  if (pageId === 'dashboard') initChartUsage();
  if (pageId === 'analytics') initAnalyticsCharts();
  if (pageId === 'infrastructure') mapInstance = null;
  if (pageId === 'gis') initGisMap();
  if (pageId === 'calendar') initCalendar();
  if (pageId === 'workflow') initWorkflow();
  if (pageId === 'reservations') {
    setTimeout(() => {
      if (typeof ReservationModule !== 'undefined') {
        window.resModule = new ReservationModule();
        resModule.init();
      }
    }, 100);
  }
    if (pageId === 'documents') setTimeout(docInitCanvas, 200);
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.getElementById(id).classList.add('flex');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.getElementById(id).classList.remove('flex');
}

// ─── Charts ───────────────────────────────────────────────────────────────────

function initChartUsage() {
  const ctx = document.getElementById('chart-usage');
  if (!ctx) return;
  new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ label: 'Active Users', data: [120, 190, 180, 220, 250, 180, 210], borderColor: 'rgb(51, 166, 255)', fill: true, tension: 0.4 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

function initAnalyticsCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const barColors = ['rgba(51, 166, 255, 0.8)', 'rgba(255, 123, 16, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(168, 85, 247, 0.8)'];
  const opts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor } } }, scales: { y: { ticks: { color: textColor }, grid: { color: gridColor } }, x: { ticks: { color: textColor }, grid: { color: gridColor } } } };
  const er = document.getElementById('chart-events-region');
  if (er) new Chart(er.getContext('2d'), { type: 'bar', data: { labels: ['North', 'Central', 'South', 'East'], datasets: [{ label: 'Events', data: [45, 62, 38, 52], backgroundColor: barColors }] }, options: opts });
  const oc = document.getElementById('chart-occupancy');
  if (oc) new Chart(oc.getContext('2d'), { type: 'line', data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], datasets: [{ label: 'Occupancy %', data: [72, 78, 75, 82, 79], borderColor: 'rgb(255, 123, 16)', fill: true, tension: 0.4 }] }, options: opts });
  const va = document.getElementById('chart-validation');
  if (va) new Chart(va.getContext('2d'), { type: 'bar', data: { labels: ['Travel Auth', 'Minutes', 'Approvals'], datasets: [{ label: 'Days', data: [2.3, 1.8, 3.1], backgroundColor: barColors.slice(0, 3) }] }, options: opts });
  const cf = document.getElementById('chart-conflicts');
  if (cf) new Chart(cf.getContext('2d'), { type: 'doughnut', data: { labels: ['Resolved', 'Pending', 'Auto-suggested'], datasets: [{ data: [65, 12, 23], backgroundColor: ['#22c55e', '#f59e0b', '#1A237E'] }] }, options: { ...opts, cutout: '60%' } });
}

// ─── Modal approbation stylisée ───────────────────────────────────────────────

function showApprovalModal(wf) {
  document.getElementById('approval-success-modal')?.remove();

  const title = wf ? wf.title : 'Événement';
  const meta  = wf ? wf.meta  : '';
  const now   = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const modal = document.createElement('div');
  modal.id = 'approval-success-modal';
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-850 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
      <!-- Header vert -->
      <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
        <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
          <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold">Événement approuvé !</h3>
        <p class="text-green-100 text-sm mt-1">Validation nationale effectuée</p>
      </div>

      <!-- Corps -->
      <div class="p-6 space-y-4">
        <!-- Détails événement -->
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p class="text-xs font-medium text-slate-500 uppercase mb-2">Événement</p>
          <p class="font-semibold text-slate-800 dark:text-slate-100">${title}</p>
          ${meta ? `<p class="text-sm text-slate-500 mt-1">${meta}</p>` : ''}
        </div>

        <!-- Statut -->
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p class="text-xs font-medium text-slate-500 uppercase mb-3">Actions effectuées</p>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </span>
              <span class="text-slate-700 dark:text-slate-300">Publié dans le calendrier officiel</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </span>
              <span class="text-slate-700 dark:text-slate-300">Documents générés automatiquement par l'IA</span>
            </div>
          </div>
        </div>

        <p class="text-xs text-slate-400 text-center">${now}</p>
      </div>

      <!-- Footer -->
      <div class="px-6 pb-6 flex gap-3">
        <button onclick="document.getElementById('approval-success-modal').remove()"
          class="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          Fermer
        </button>
        <button onclick="document.getElementById('approval-success-modal').remove(); navigateTo('ai-documents')"
          class="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition">
          Voir les documents
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// ─── Workflow ─────────────────────────────────────────────────────────────────

function initWorkflow() {
  const content = document.getElementById('content-area');
  content?.addEventListener('click', (e) => {
    const item = e.target.closest('.wf-item');
    if (item?.dataset?.wfId) {
      document.querySelectorAll('.wf-item').forEach(i => i.classList.remove('border-l-primary-500', 'bg-primary-50', 'dark:bg-primary-900/10'));
      item.classList.add('border-l-primary-500', 'bg-primary-50', 'dark:bg-primary-900/10');
      const wf = WF_ITEMS.find(w => w.id == item.dataset.wfId);
      if (wf) {
        document.getElementById('wf-detail-empty')?.classList.add('hidden');
        document.getElementById('wf-detail-content')?.classList.remove('hidden');
        document.getElementById('wf-detail-title').textContent = wf.title;
        document.getElementById('wf-detail-meta').textContent = wf.meta;
      }
    }
    if (e.target.closest('.wf-approve')) {
      const wfId = document.querySelector('.wf-item.border-l-primary-500')?.dataset?.wfId;
      const wf = WF_ITEMS.find(w => w.id == wfId);
      showApprovalModal(wf);
    }
    if (e.target.closest('.wf-reject')) {
      const comment = document.getElementById('wf-comment')?.value;
      alert(comment ? 'Événement rejeté. Motif enregistré.' : 'Événement rejeté. (Ajoutez un commentaire pour justifier le rejet.)');
    }
    if (e.target.closest('.wf-request-change')) {
      alert('Demande de modifications envoyée au soumissionnaire. Il recevra une notification.');
    }
    const filter = e.target.closest('.wf-filter');
    if (filter && !filter.classList.contains('active')) {
      document.querySelectorAll('.wf-filter').forEach(f => { f.classList.remove('bg-primary-600', 'text-white'); f.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400'); });
      filter.classList.add('bg-primary-600', 'text-white');
      filter.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
    }
  });
}

// ─── Calendrier ───────────────────────────────────────────────────────────────

function initCalendar() {
  const content = document.getElementById('content-area');
  content?.addEventListener('click', (e) => {
    const day = e.target.closest('.calendar-day[data-date]');
    if (day?.dataset?.date) {
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
      day.classList.add('selected');
      showDayEvents(day.dataset.date);
    }
    if (e.target.closest('.suggest-slots')) openModal('slots-modal');
    if (e.target.closest('.slot-select')) { closeModal('slots-modal'); alert('Créneau sélectionné. L\'événement a été déplacé.'); }
  });
  document.getElementById('event-create-btn')?.addEventListener('click', () => {
    const title = document.getElementById('event-title')?.value;
    if (title) alert(`Événement "${title}" créé avec succès.`);
    closeModal('event-modal');
  });
  document.getElementById('cal-prev')?.addEventListener('click', () => alert('Mars 2025 affiché (prototype)'));
  document.getElementById('cal-next')?.addEventListener('click', () => alert('Avril 2025 (prototype)'));
  document.getElementById('cal-today')?.addEventListener('click', () => {
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    const today = document.querySelector('.calendar-day[data-date="2025-03-10"]');
    today?.classList.add('selected');
    showDayEvents('2025-03-10');
  });
}

function showDayEvents(dateStr) {
  const label = document.getElementById('day-events-label');
  const list  = document.getElementById('day-events-list');
  if (!label || !list) return;
  const events = CALENDAR_EVENTS.filter(e => e.date === dateStr);
  const d = new Date(dateStr);
  label.textContent = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  if (events.length === 0) {
    list.innerHTML = '<p class="text-sm text-slate-400 italic">Aucun événement ce jour.</p>';
  } else {
    const colors = { primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800', accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-800', green: 'bg-green-100 dark:bg-green-900/30 text-green-800', violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-800' };
    list.innerHTML = events.map(ev => `
      <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 ${colors[ev.color] || 'bg-slate-50 dark:bg-slate-800'}">
        <p class="font-medium text-sm">${ev.title}</p>
        <p class="text-xs mt-1 opacity-80">${ev.start} - ${ev.end} • ${ev.location}</p>
      </div>
    `).join('');
  }
}

// ─── Carte infra  ───────────────────────────────────────────────────

function initMap() {
  const container = document.getElementById('map');
  if (!container || mapInstance) return;
  mapInstance = L.map('map').setView([33.5731, -7.5898], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(mapInstance);
  L.marker([33.5731, -7.5898]).addTo(mapInstance).bindPopup('National Stadium');
  L.marker([33.9, -6.9]).addTo(mapInstance).bindPopup('Central Aquatic Center');
  L.marker([34.2, -5.8]).addTo(mapInstance).bindPopup('Regional Gym');
}

// ─── GIS ──────────────────────────────────────────────────────────────────────

function getMarkerColor(type) {
  const colors = { 'Stade': '#3b82f6', 'Piscine': '#06b6d4', 'Salle de sport': '#22c55e', 'Complexe': '#f59e0b' };
  return colors[type] || '#6b7280';
}

function addGisMarkers(infras) {
  if (!gisMarkersGroup || !gisMapInstance) return;
  gisMarkersGroup.clearLayers();
  (infras || GIS_INFRASTRUCTURES).forEach(infra => {
    const icon = L.divIcon({ html: `<div style="width:16px;height:16px;border-radius:50%;background:${getMarkerColor(infra.type)};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`, className: '', iconSize: [16, 16] });
    L.marker([infra.lat, infra.lng], { icon }).addTo(gisMarkersGroup).bindPopup(
      `<strong>${infra.name}</strong><br>${infra.type} • ${infra.region}<br>Capacité: ${infra.capacity.toLocaleString()}`
    );
  });
}

function initGisMap() {
  const container = document.getElementById('gis-map');
  if (!container) return;
  if (gisMapInstance) { gisMapInstance.remove(); gisMapInstance = null; gisMarkersGroup = null; }
  gisMapInstance = L.map('gis-map').setView([33.5731, -7.5898], 6);
  gisTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(gisMapInstance);
  gisMarkersGroup = L.layerGroup().addTo(gisMapInstance);
  addGisMarkers();
  document.getElementById('gis-layer-satellite')?.addEventListener('click', () => {
    gisMapInstance.removeLayer(gisTileLayer);
    gisTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri' }).addTo(gisMapInstance);
    document.getElementById('gis-layer-satellite').classList.add('bg-primary-600', 'text-white'); document.getElementById('gis-layer-satellite').classList.remove('bg-slate-100', 'dark:bg-slate-800');
    document.getElementById('gis-layer-street').classList.remove('bg-primary-600', 'text-white'); document.getElementById('gis-layer-street').classList.add('bg-slate-100', 'dark:bg-slate-800');
  });
  document.getElementById('gis-layer-street')?.addEventListener('click', () => {
    gisMapInstance.removeLayer(gisTileLayer);
    gisTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(gisMapInstance);
    document.getElementById('gis-layer-street').classList.add('bg-primary-600', 'text-white'); document.getElementById('gis-layer-street').classList.remove('bg-slate-100', 'dark:bg-slate-800');
    document.getElementById('gis-layer-satellite').classList.remove('bg-primary-600', 'text-white'); document.getElementById('gis-layer-satellite').classList.add('bg-slate-100', 'dark:bg-slate-800');
  });
  document.getElementById('gis-locate')?.addEventListener('click', () => {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => gisMapInstance.setView([p.coords.latitude, p.coords.longitude], 12), () => alert('Géolocalisation non disponible'));
  });
  document.getElementById('gis-region')?.addEventListener('change', () => filterGisMarkers());
  document.getElementById('gis-type')?.addEventListener('change',   () => filterGisMarkers());
}

function filterGisMarkers() {
  const region = document.getElementById('gis-region')?.value || '';
  const type   = document.getElementById('gis-type')?.value   || '';
  addGisMarkers(GIS_INFRASTRUCTURES.filter(i => (!region || i.region === region) && (!type || i.type === type)));
}

// ─── Signature ────────────────────────────────────────────────────────────────

function openSignatureModal(reportName) {
  currentSignReport = reportName;
  document.getElementById('sign-report-name').textContent = reportName;
  openModal('signature-modal');
  setTimeout(initSignaturePad, 50);
}

function initSignaturePad() {
  const canvas = document.getElementById('signature-pad');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  let lastX = 0, lastY = 0;
  const draw = (e) => {
    if (!signing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke();
    lastX = x; lastY = y;
  };
  canvas.onmousedown  = (e) => { signing = true; const r = canvas.getBoundingClientRect(); lastX = e.clientX - r.left; lastY = e.clientY - r.top; };
  canvas.onmousemove  = draw;
  canvas.onmouseup    = canvas.onmouseleave = () => { signing = false; };
  canvas.ontouchstart = (e) => { signing = true; const r = canvas.getBoundingClientRect(); lastX = e.touches[0].clientX - r.left; lastY = e.touches[0].clientY - r.top; };
  canvas.ontouchmove  = draw;
  canvas.ontouchend   = () => { signing = false; };
  document.getElementById('signature-clear').onclick   = () => { ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height); };
  document.getElementById('signature-confirm').onclick = () => { closeModal('signature-modal'); alert(`Rapport "${currentSignReport}" signé et exporté en PDF.`); };
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────

function toggleChatbot() {
  const panel = document.getElementById('chatbot-panel');
  const fab   = document.getElementById('chatbot-fab');
  if (panel.classList.contains('hidden')) { panel.classList.remove('hidden'); fab.classList.add('hidden'); }
  else { panel.classList.add('hidden'); fab.classList.remove('hidden'); }
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg   = input.value.trim();
  if (!msg) return;
  const container = document.getElementById('chat-messages');
  const userDiv   = document.createElement('div');
  userDiv.className = 'chat-message flex justify-end';
  userDiv.innerHTML = `<div class="bg-primary-600 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-[85%]"><p class="text-sm">${msg}</p></div>`;
  container.appendChild(userDiv);
  input.value = '';
  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.className = 'chat-message flex justify-start';
    botDiv.innerHTML = `<div class="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-md px-4 py-2 max-w-[85%]"><p class="text-sm">This is a prototype. In production, I would search regulations, calendars, and infrastructure data to answer your question.</p></div>`;
    container.appendChild(botDiv);
    container.scrollTop = container.scrollHeight;
  }, 800);
}

// ─── Reservation Module ───────────────────────────────────────────────────────

class ReservationModule {
  constructor() {
    this.data = {
      stadiums: {
        rades: { name: 'Stade de Radès', capacity: 60000, region: 'Grand Tunis' },
        moknine: { name: 'Stade de Moknine', capacity: 8000, region: 'Monastir' },
        sfax: { name: 'Stade de Sfax', capacity: 22000, region: 'Sfax' },
        sousse: { name: 'Stade Olympique de Sousse', capacity: 45000, region: 'Sousse' }
      },
      reservations: [
        { id: 'R-001', stadium: 'rades', applicant: 'Fédération Football', activity: 'football', date: '2025-03-17', start: '14:00', end: '17:00', capacity: 45000, status: 'approved', notes: 'Finale championnat' },
        { id: 'R-002', stadium: 'rades', applicant: 'Fédération Athlétisme', activity: 'athletics', date: '2025-03-18', start: '09:00', end: '13:00', capacity: 12000, status: 'approved', notes: 'Meeting national' },
        { id: 'R-003', stadium: 'rades', applicant: 'Organisateur ABC', activity: 'concert', date: '2025-03-19', start: '19:00', end: '23:00', capacity: 55000, status: 'pending', notes: 'Concert grande scène' },
        { id: 'R-004', stadium: 'rades', applicant: 'Équipe Nationale U23', activity: 'training', date: '2025-03-20', start: '10:00', end: '12:00', capacity: 500, status: 'approved', notes: 'Stage préparation' },
        { id: 'R-005', stadium: 'rades', applicant: 'Fédération Handball', activity: 'football', date: '2025-03-21', start: '15:00', end: '17:00', capacity: 8000, status: 'pending', notes: 'Match amical' },
        { id: 'R-006', stadium: 'rades', applicant: 'Club Espérance', activity: 'football', date: '2025-03-22', start: '20:00', end: '22:00', capacity: 50000, status: 'closed', notes: 'Maintenance terrain' },
        { id: 'R-007', stadium: 'moknine', applicant: 'Club local Moknine', activity: 'football', date: '2025-03-17', start: '10:00', end: '12:00', capacity: 4000, status: 'approved', notes: '' },
        { id: 'R-008', stadium: 'sfax', applicant: 'CSS Sfax', activity: 'football', date: '2025-03-18', start: '16:00', end: '18:00', capacity: 18000, status: 'approved', notes: 'Match coupe' },
        { id: 'R-009', stadium: 'rades', applicant: 'Fédération Rugby', activity: 'training', date: '2025-03-23', start: '08:00', end: '10:00', capacity: 300, status: 'pending', notes: '' },
        { id: 'R-010', stadium: 'rades', applicant: 'Event Corp', activity: 'concert', date: '2025-03-24', start: '17:00', end: '23:00', capacity: 58000, status: 'pending', notes: 'Festival culturel' }
      ],
      occupancyData: {
        rades: { day: 78, week: 74, month: 81, year: 72 },
        moknine: { day: 45, week: 52, month: 48, year: 44 },
        sfax: { day: 63, week: 68, month: 70, year: 65 },
        sousse: { day: 85, week: 82, month: 79, year: 77 }
      },
      hours: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
    };

    this.state = {
      currentView: 'table',
      currentStadium: 'rades',
      planWeekOffset: 0,
      draggingId: null
    };

    this.charts = {
      occ: null,
      type: null
    };
  }

  init() {
    this.renderOccupancy();
    this.renderTable();
    this.attachEvents();
  }

  t(key) {
    if (typeof window.t === 'function') {
      return window.t(key);
    }
    return key;
  }

  getFilteredReservations() {
    const stadium = this.state.currentStadium;
    const status = document.getElementById('res-status-filter')?.value || '';
    const activity = document.getElementById('res-activity-filter')?.value || '';
    const search = (document.getElementById('res-search')?.value || '').toLowerCase();

    return this.data.reservations.filter(r => {
      if (r.stadium !== stadium) return false;
      if (status && r.status !== status) return false;
      if (activity && r.activity !== activity) return false;
      if (search && !r.applicant.toLowerCase().includes(search) && 
          !r.activity.toLowerCase().includes(search)) return false;
      return true;
    });
  }

  badgeHtml(status) {
    const map = {
      approved: `<span class="badge-approved px-2.5 py-1 rounded-full text-xs font-semibold">${this.t('status_approved')}</span>`,
      pending: `<span class="badge-pending px-2.5 py-1 rounded-full text-xs font-semibold">${this.t('status_pending')}</span>`,
      closed: `<span class="badge-closed px-2.5 py-1 rounded-full text-xs font-semibold">${this.t('status_closed')}</span>`
    };
    return map[status] || status;
  }

  getActivityIcon(activity) {
    const icons = {
      football: '',
      athletics: '',
      concert: '',
      training: ''
    };
    return icons[activity] || '';
  }

  renderOccupancy() {
    const period = document.querySelector('#res-period-tabs .period-tab.active')?.dataset.period || 'day';
    const rows = document.getElementById('res-occ-rows');
    if (!rows) return;

    rows.innerHTML = Object.entries(this.data.stadiums).map(([key, st]) => {
      const occ = this.data.occupancyData[key][period];
      const color = occ >= 80 ? 'bg-green-500' : occ >= 60 ? 'bg-amber-500' : 'bg-red-500';
      const tc = occ >= 80 ? 'text-green-600' : occ >= 60 ? 'text-amber-600' : 'text-red-600';

      return `
        <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer" onclick="if(window.resModule) resModule.selectStadium('${key}')">
          <div class="w-32 shrink-0">
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">${this.t('stadium_' + key)}</p>
            <p class="text-xs text-slate-400">${st.region}</p>
          </div>
          <div class="flex-1">
            <div class="flex justify-between text-xs mb-1.5">
              <span class="text-slate-500">${this.t('kpi_avg_occ')}</span>
              <span class="font-bold font-mono ${tc}">${occ}%</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
              <div class="occ-bar ${color}" style="width:0%" data-target="${occ}"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    setTimeout(() => {
      document.querySelectorAll('#res-occ-rows .occ-bar[data-target]').forEach(b => {
        b.style.width = b.dataset.target + '%';
      });
    }, 100);

    this.renderOccCharts(period);
  }

  renderOccCharts(period) {
    const isDark = document.documentElement.classList.contains('dark');
    const tc = isDark ? '#94a3b8' : '#64748b';
    const gc = isDark ? '#334155' : '#f1f5f9';

    const labels = {
      day: ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h'],
      week: this.t('days'),
      month: Array.from({ length: 30 }, (_, i) => i + 1 + ''),
      year: this.t('months')
    };

    const dataMap = {
      day: [10, 35, 55, 80, 90, 75, 95, 100, 88, 70, 60, 45, 85, 78],
      week: [72, 85, 60, 90, 78, 55, 40],
      month: Array.from({ length: 30 }, () => Math.round(40 + Math.random() * 55)),
      year: [60, 55, 70, 78, 82, 90, 85, 72, 80, 75, 65, 58]
    };

    if (this.charts.occ) this.charts.occ.destroy();
    const ctx1 = document.getElementById('res-chart-occ-main');
    if (ctx1) {
      this.charts.occ = new Chart(ctx1.getContext('2d'), {
        type: 'line',
        data: {
          labels: labels[period],
          datasets: [{
            label: 'Occupation %',
            data: dataMap[period],
            borderColor: '#1A237E',
            backgroundColor: 'rgba(51,166,255,.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 0, max: 100, ticks: { color: tc, callback: v => v + '%' }, grid: { color: gc } },
            x: { ticks: { color: tc, maxTicksLimit: 8 }, grid: { display: false } }
          }
        }
      });
    }

    if (this.charts.type) this.charts.type.destroy();
    const ctx2 = document.getElementById('res-chart-type');
    if (ctx2) {
      this.charts.type = new Chart(ctx2.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: [this.t('activity_football'), this.t('activity_athletics'), this.t('activity_concert'), this.t('activity_training')],
          datasets: [{ data: [45, 20, 15, 20], backgroundColor: ['#1A237E', '#22c55e', '#f59e0b', '#a78bfa'], borderWidth: 0, hoverOffset: 4 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'right',
              labels: { color: tc, font: { size: 11 }, boxWidth: 12 }
            }
          }
        }
      });
    }
  }

  renderTable() {
    const data = this.getFilteredReservations();
    const container = document.getElementById('res-view-table');
    if (!container) return;

    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              <th class="text-left px-5 py-3 text-slate-500 dark:text-slate-400">#</th>
              <th class="text-left px-5 py-3 text-slate-500 dark:text-slate-400" data-i18n="applicant">Demandeur</th>
              <th class="text-left px-5 py-3 text-slate-500 dark:text-slate-400" data-i18n="activity">Activité</th>
              <th class="text-left px-5 py-3 text-slate-500 dark:text-slate-400" data-i18n="date">Date</th>
              <th class="text-left px-5 py-3 text-slate-500 dark:text-slate-400" data-i18n="time_slot">Créneau</th>
              <th class="text-left px-5 py-3 text-slate-500 dark:text-slate-400" data-i18n="capacity">Capacité</th>
              <th class="text-left px-5 py-3 text-slate-500 dark:text-slate-400" data-i18n="th_status">Statut</th>
              <th class="text-left px-5 py-3 text-slate-500 dark:text-slate-400" data-i18n="actions">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            ${data.map(r => `
              <tr class="fade-slide">
                <td class="px-5 py-3.5 font-mono text-xs text-slate-400">${r.id}</td>
                <td class="px-5 py-3.5">
                  <div class="font-semibold text-slate-800 dark:text-slate-100 text-sm">${r.applicant}</div>
                  ${r.notes ? `<div class="text-xs text-slate-400 mt-0.5">${r.notes}</div>` : ''}
                </td>
                <td class="px-5 py-3.5 text-sm">${this.getActivityIcon(r.activity)} ${this.t('activity_' + r.activity)}</td>
                <td class="px-5 py-3.5 text-sm font-mono">${r.date}</td>
                <td class="px-5 py-3.5 text-sm font-mono">${r.start}–${r.end}</td>
                <td class="px-5 py-3.5 text-sm">${r.capacity.toLocaleString()}</td>
                <td class="px-5 py-3.5">${this.badgeHtml(r.status)}</td>
                <td class="px-5 py-3.5">
                  <div class="flex gap-1.5 flex-wrap">
                    <button onclick="if(window.resModule) resModule.openDetail('${r.id}')" class="px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition">👁</button>
                    ${r.status === 'pending' ? `
                      <button onclick="if(window.resModule) resModule.approveReservation('${r.id}')" class="px-2.5 py-1.5 text-xs rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 hover:bg-green-200 font-medium transition">${this.t('approve')}</button>
                      <button onclick="if(window.resModule) resModule.rejectReservation('${r.id}')" class="px-2.5 py-1.5 text-xs rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 hover:bg-red-200 font-medium transition">${this.t('reject')}</button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${data.length === 0 ? `
          <div class="text-center py-16 text-slate-400">
            <svg class="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="text-sm" data-i18n="no_results">Aucun résultat</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderCards() {
    const data = this.getFilteredReservations();
    const container = document.getElementById('res-view-cards');
    if (!container) return;

    if (data.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 text-slate-400">
          <svg class="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"/>
          </svg>
          <p class="text-sm" data-i18n="no_results">Aucun résultat</p>
        </div>
      `;
      return;
    }

    const borderMap = {
      approved: 'border-primary-300 dark:border-primary-800',
      pending: 'border-amber-300 dark:border-amber-800',
      closed: 'border-red-300 dark:border-red-900'
    };
    const dotMap = {
      approved: 'bg-primary-500',
      pending: 'bg-amber-500',
      closed: 'bg-red-500'
    };

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        ${data.map(r => `
          <div class="res-card fade-slide bg-white dark:bg-slate-900 rounded-2xl p-5 ${borderMap[r.status]} hover:shadow-md cursor-pointer" onclick="if(window.resModule) resModule.openDetail('${r.id}')">
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="text-xs font-bold text-slate-400 font-mono">${r.id}</p>
                <p class="font-bold text-slate-800 dark:text-slate-100 mt-0.5">${r.applicant}</p>
              </div>
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${r.status === 'approved' ? 'badge-approved' : r.status === 'pending' ? 'badge-pending' : 'badge-closed'}">
                <span class="w-1.5 h-1.5 rounded-full ${dotMap[r.status]}"></span>
                ${this.t('status_' + r.status)}
              </div>
            </div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xl">${this.getActivityIcon(r.activity)}</span>
              <span class="text-sm font-medium text-slate-600 dark:text-slate-400">${this.t('activity_' + r.activity)}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                ${r.date}
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                ${r.start}–${r.end}
              </div>
              <div class="flex items-center gap-1.5 col-span-2">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
                </svg>
                ${r.capacity.toLocaleString()} personnes
              </div>
            </div>
            ${r.notes ? `<p class="text-xs text-slate-400 italic truncate">${r.notes}</p>` : ''}
            ${r.status === 'pending' ? `
              <div class="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button onclick="event.stopPropagation();if(window.resModule) resModule.approveReservation('${r.id}')" class="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 hover:bg-green-200 transition">${this.t('approve')}</button>
                <button onclick="event.stopPropagation();if(window.resModule) resModule.rejectReservation('${r.id}')" class="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 hover:bg-red-200 transition">${this.t('reject')}</button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  getWeekDates(offset = 0) {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  dateStr(d) {
    return d.toISOString().slice(0, 10);
  }

  renderPlanning() {
    const grid = document.getElementById('res-view-planning');
    if (!grid) return;

    const dates = this.getWeekDates(this.state.planWeekOffset);
    const days = this.t('days');

    const start = dates[0], end = dates[6];
    const months = this.t('months');
    const planLabel = `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;

    let html = `
      <div class="flex flex-wrap gap-3 items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <button id="res-plan-prev" class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm">${planLabel}</h3>
          <button id="res-plan-next" class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
          <button id="res-plan-today" class="px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800" data-i18n="today">Aujourd'hui</button>
        </div>
        <div class="flex flex-wrap gap-3">
          <span class="flex items-center gap-1.5 text-xs"><span class="w-3 h-3 rounded" style="background:#1A237E"></span><span data-i18n="status_approved">Approuvé</span></span>
          <span class="flex items-center gap-1.5 text-xs"><span class="w-3 h-3 rounded" style="background:#f59e0b"></span><span data-i18n="status_pending">En attente</span></span>
          <span class="flex items-center gap-1.5 text-xs"><span class="w-3 h-3 rounded" style="background:#ef4444"></span><span data-i18n="status_closed">Fermé</span></span>
          <span class="flex items-center gap-1.5 text-xs"><span class="w-3 h-3 rounded" style="background:#22c55e"></span><span data-i18n="status_free">Libre</span></span>
        </div>
      </div>
      <div class="mb-3 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 flex items-center gap-2 text-xs text-primary-700 dark:text-primary-300">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/>
        </svg>
        <span data-i18n="drag_hint">Glissez-déposez une réservation pour la déplacer</span>
      </div>
    `;

    html += '<div id="res-planning-grid" style="display:grid;grid-template-columns:60px repeat(7,140px);overflow:auto;max-height:580px;border-radius:12px;border:1px solid #e2e8f0;">';

    html += '<div class="pg-header-cell" style="grid-column:1;grid-row:1"></div>';
    dates.forEach((d, i) => {
      const isToday = this.dateStr(d) === new Date().toISOString().slice(0, 10);
      html += `<div class="pg-header-cell ${isToday ? 'text-primary-600' : ''}" style="grid-column:${i + 2};grid-row:1">
        <div>${days[i]}</div>
        <div class="font-bold text-base ${isToday ? 'text-primary-600' : 'text-slate-700 dark:text-slate-200'}">${d.getDate()}</div>
        ${isToday ? '<div class="w-1.5 h-1.5 rounded-full bg-primary-500 mx-auto mt-1"></div>' : ''}
      </div>`;
    });

    this.data.hours.forEach((hour, hi) => {
      html += `<div class="pg-time-cell" style="grid-column:1;grid-row:${hi + 2}">${hour}</div>`;
      dates.forEach((d, di) => {
        const ds = this.dateStr(d);
        const res = this.data.reservations.filter(r => 
          r.stadium === this.state.currentStadium && r.date === ds && r.start === hour
        );
        const isFreeSlot = !this.data.reservations.some(r => 
          r.stadium === this.state.currentStadium && r.date === ds && r.start === hour
        );

        html += `<div class="pg-cell ${isFreeSlot ? 'free-bg' : ''}" 
                 data-date="${ds}" data-hour="${hour}" 
                 style="grid-column:${di + 2};grid-row:${hi + 2}"
                 ondragover="if(window.resModule) resModule.onCellDragOver(event)" 
                 ondragleave="if(window.resModule) resModule.onCellDragLeave(event)" 
                 ondrop="if(window.resModule) resModule.onCellDrop(event, this)">
                 ${res.map(r => `
                   <div class="res-block ${r.status}" 
                        draggable="true"
                        data-id="${r.id}"
                        ondragstart="if(window.resModule) resModule.onDragStart(event, '${r.id}')"
                        ondragend="if(window.resModule) resModule.onDragEnd(event)"
                        onmouseenter="if(window.resModule) resModule.showTooltip(event, '${r.id}')"
                        onmouseleave="if(window.resModule) resModule.hideTooltip()"
                        onclick="event.stopPropagation();if(window.resModule) resModule.openDetail('${r.id}')">
                     <span class="truncate">${r.applicant}</span>
                     <span class="opacity-75 text-[0.65rem]">${r.start}–${r.end}</span>
                   </div>
                 `).join('')}
               </div>`;
      });
    });

    html += '</div>';
    grid.innerHTML = html;

    document.getElementById('res-plan-prev')?.addEventListener('click', () => {
      this.state.planWeekOffset--;
      this.renderPlanning();
    });
    document.getElementById('res-plan-next')?.addEventListener('click', () => {
      this.state.planWeekOffset++;
      this.renderPlanning();
    });
    document.getElementById('res-plan-today')?.addEventListener('click', () => {
      this.state.planWeekOffset = 0;
      this.renderPlanning();
    });
  }

  updateKPI() {
    const total = this.data.reservations.length;
    const pending = this.data.reservations.filter(r => r.status === 'pending').length;
    const conflicts = this.detectConflicts();
    
    document.getElementById('res-total').textContent = total;
    document.getElementById('res-pending').textContent = pending;
    document.getElementById('res-conflicts').textContent = conflicts;
    
    const avgOcc = this.calculateAvgOccupancy();
    document.getElementById('res-avg-occ').textContent = Math.round(avgOcc) + '%';
    document.getElementById('occ-bar-main').style.width = avgOcc + '%';
  }

  detectConflicts() {
    let conflicts = 0;
    const reservations = this.data.reservations.filter(r => r.stadium === this.state.currentStadium);
    
    for (let i = 0; i < reservations.length; i++) {
      for (let j = i + 1; j < reservations.length; j++) {
        if (reservations[i].date === reservations[j].date) {
          if (this.timeOverlaps(reservations[i].start, reservations[i].end, 
                               reservations[j].start, reservations[j].end)) {
            conflicts++;
          }
        }
      }
    }
    return conflicts;
  }

  timeOverlaps(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
  }

  calculateAvgOccupancy() {
    const stadium = this.data.stadiums[this.state.currentStadium];
    const totalCapacity = this.data.reservations
      .filter(r => r.stadium === this.state.currentStadium)
      .reduce((sum, r) => sum + r.capacity, 0);
    return (totalCapacity / (stadium.capacity * this.data.reservations.length)) * 100 || 0;
  }

  onDragStart(e, id) {
    this.state.draggingId = id;
    const r = this.data.reservations.find(x => x.id === id);
    const ghost = document.getElementById('res-drag-ghost');
    if (ghost) {
      ghost.textContent = r ? r.applicant : '...';
      ghost.classList.remove('hidden');
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
    e.target.classList.add('dragging');
  }

  onDragEnd(e) {
    document.getElementById('res-drag-ghost')?.classList.add('hidden');
    e.target.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    this.state.draggingId = null;
  }

  onCellDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  }

  onCellDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
  }

  onCellDrop(e, cell) {
    e.preventDefault();
    cell.classList.remove('drag-over');
    if (!this.state.draggingId) return;

    const newDate = cell.dataset.date;
    const newHour = cell.dataset.hour;
    const r = this.data.reservations.find(x => x.id === this.state.draggingId);

    if (!r || !newDate || !newHour) return;

    const conflict = this.data.reservations.find(x => 
      x.id !== this.state.draggingId && 
      x.stadium === r.stadium && 
      x.date === newDate && 
      x.start === newHour
    );

    if (conflict) {
      this.showToast('⚠️ Créneau déjà occupé !');
      return;
    }

    const startH = parseInt(newHour);
    const duration = parseInt(r.end) - parseInt(r.start.split(':')[0]);
    r.date = newDate;
    r.start = newHour;
    r.end = (startH + duration).toString().padStart(2, '0') + ':00';

    this.state.draggingId = null;
    this.renderPlanning();
    this.renderAll();
    this.showToast('✓ Réservation déplacée');
  }

  showTooltip(e, id) {
    const r = this.data.reservations.find(x => x.id === id);
    if (!r) return;

    const tooltip = document.getElementById('res-tooltip');
    tooltip.innerHTML = `
      <div class="font-bold mb-1">${r.applicant}</div>
      <div class="opacity-70">${r.date} · ${r.start}–${r.end}</div>
      <div class="opacity-70">${this.t('activity_' + r.activity)} · ${r.capacity.toLocaleString()}</div>
      <div class="mt-1.5">${this.badgeHtml(r.status)}</div>
      ${r.notes ? `<div class="mt-1 opacity-60 text-[0.68rem] italic">${r.notes}</div>` : ''}
    `;
    tooltip.classList.remove('hidden');
    tooltip.style.left = e.clientX + 14 + 'px';
    tooltip.style.top = e.clientY + 14 + 'px';
  }

  hideTooltip() {
    document.getElementById('res-tooltip')?.classList.add('hidden');
  }

  openDetail(id) {
    const r = this.data.reservations.find(x => x.id === id);
    if (!r) return;

    document.getElementById('res-detail-title').textContent = `${r.applicant} — ${r.id}`;
    document.getElementById('res-detail-body').innerHTML = `
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-400 mb-1">${this.t('activity')}</p>
          <p class="font-semibold text-sm">${this.getActivityIcon(r.activity)} ${this.t('activity_' + r.activity)}</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-400 mb-1">${this.t('th_status')}</p>
          <p>${this.badgeHtml(r.status)}</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-400 mb-1">${this.t('date')}</p>
          <p class="font-semibold text-sm font-mono">${r.date}</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-400 mb-1">${this.t('time_slot')}</p>
          <p class="font-semibold text-sm font-mono">${r.start} – ${r.end}</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 col-span-2">
          <p class="text-xs text-slate-400 mb-1">${this.t('capacity')}</p>
          <div class="flex items-center gap-3">
            <p class="font-bold text-lg">${r.capacity.toLocaleString()}</p>
            <div class="flex-1">
              <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div class="occ-bar bg-primary-500" style="width:${Math.round(r.capacity / this.data.stadiums[r.stadium].capacity * 100)}%"></div>
              </div>
              <p class="text-xs text-slate-400 mt-1">${Math.round(r.capacity / this.data.stadiums[r.stadium].capacity * 100)}% de la capacité totale</p>
            </div>
          </div>
        </div>
        ${r.notes ? `
          <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 col-span-2">
            <p class="text-xs text-slate-400 mb-1">Notes</p>
            <p class="text-sm">${r.notes}</p>
          </div>
        ` : ''}
      </div>
    `;

    const actions = document.getElementById('res-detail-actions');
    actions.innerHTML = r.status === 'pending' ? `
      <button onclick="if(window.resModule) { resModule.approveReservation('${r.id}'); resModule.closeDetailModal(); }" class="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition">${this.t('approve')}</button>
      <button onclick="if(window.resModule) { resModule.rejectReservation('${r.id}'); resModule.closeDetailModal(); }" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition">${this.t('reject')}</button>
    ` : `
      <button onclick="if(window.resModule) resModule.closeDetailModal()" class="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800">${this.t('cancel')}</button>
    `;

    document.getElementById('res-detail-modal').classList.remove('hidden');
  }

  closeDetailModal() {
    document.getElementById('res-detail-modal').classList.add('hidden');
  }

  approveReservation(id) {
    const r = this.data.reservations.find(x => x.id === id);
    if (r) {
      r.status = 'approved';
      this.renderAll();
      this.showToast('✅ ' + this.t('status_approved'));
    }
  }

  rejectReservation(id) {
    const r = this.data.reservations.find(x => x.id === id);
    if (r) {
      r.status = 'closed';
      this.renderAll();
      this.showToast('❌ ' + this.t('status_closed'));
    }
  }

  showToast(msg) {
    const toast = document.getElementById('res-toast');
    document.getElementById('res-toast-text').textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2800);
  }

  switchView(view) {
    this.state.currentView = view;
    ['table', 'cards', 'planning'].forEach(v => {
      const el = document.getElementById(`res-view-${v}`);
      const btn = document.querySelector(`[data-view="${v}"]`);
      if (el) el.classList.remove('active');
      if (btn) btn.classList.remove('active');
    });
    document.getElementById(`res-view-${view}`).classList.add('active');
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    if (view === 'table') this.renderTable();
    if (view === 'cards') this.renderCards();
    if (view === 'planning') this.renderPlanning();
  }

  openModal() {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('res-modal-date').value = today;
    document.getElementById('res-modal').classList.remove('hidden');
  }

  closeModal() {
    document.getElementById('res-modal').classList.add('hidden');
  }

  submitReservation() {
    const stadium = document.getElementById('res-modal-stadium').value;
    const applicant = document.getElementById('res-modal-applicant').value;
    const activity = document.getElementById('res-modal-activity').value;
    const date = document.getElementById('res-modal-date').value;
    const capacity = parseInt(document.getElementById('res-modal-capacity').value);
    const start = document.getElementById('res-modal-start').value;
    const end = document.getElementById('res-modal-end').value;
    const notes = document.getElementById('res-modal-notes').value;

    if (!applicant || !date || !start || !end || !capacity) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newId = 'R-' + String(this.data.reservations.length + 1).padStart(3, '0');
    this.data.reservations.push({
      id: newId,
      stadium,
      applicant,
      activity,
      date,
      start,
      end,
      capacity,
      status: 'pending',
      notes
    });

    this.closeModal();
    this.renderAll();
    this.showToast('📋 Demande de réservation soumise');
  }

  selectStadium(stadiumKey) {
    document.getElementById('res-stadium-select').value = stadiumKey;
    this.state.currentStadium = stadiumKey;
    this.renderOccupancy();
    this.renderAll();
  }

  renderAll() {
    if (this.state.currentView === 'table') this.renderTable();
    if (this.state.currentView === 'cards') this.renderCards();
    if (this.state.currentView === 'planning') this.renderPlanning();
    this.updateKPI();
  }

  attachEvents() {
    document.getElementById('res-period-tabs')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.period-tab');
      if (!tab) return;
      document.querySelectorAll('#res-period-tabs .period-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      this.renderOccupancy();
    });

    document.getElementById('res-stadium-select')?.addEventListener('change', (e) => {
      this.state.currentStadium = e.target.value;
      this.renderOccupancy();
      this.renderAll();
    });

    ['res-status-filter', 'res-activity-filter', 'res-search'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        this.renderAll();
      });
    });

    document.getElementById('res-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });
    document.getElementById('res-detail-modal')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeDetailModal();
    });

    document.addEventListener('dragover', (e) => {
      const ghost = document.getElementById('res-drag-ghost');
      if (ghost && !ghost.classList.contains('hidden')) {
        ghost.style.left = e.clientX + 14 + 'px';
        ghost.style.top = e.clientY + 14 + 'px';
      }
    });

    document.addEventListener('mousemove', (e) => {
      const tooltip = document.getElementById('res-tooltip');
      if (tooltip && !tooltip.classList.contains('hidden')) {
        tooltip.style.left = e.clientX + 14 + 'px';
        tooltip.style.top = e.clientY + 14 + 'px';
      }
    });
  }
}

// ─── DOMContentLoaded ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => { e.preventDefault(); navigateTo(link.dataset.page); });
  });
  
  document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    
    if (sidebar.classList.contains('-translate-x-full')) {
      sidebar.classList.remove('-translate-x-full');
    } else {
      sidebar.classList.add('-translate-x-full');
    }
  });
    
  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('icon-sun').classList.toggle('hidden', !isDark);
    document.getElementById('icon-moon').classList.toggle('hidden', isDark);
    document.getElementById('theme-label').textContent = isDark ? t('theme_light') : t('theme_dark');
  });
  
  // Language buttons - ADD THIS (was missing)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang') || (this.id && this.id.includes('fr') ? 'fr' : 'ar');
      setLanguage(lang);
    });
  });
  
  // Initialize UI
  updateLangButtons();
  updateUITexts();

  document.getElementById('chat-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChat(); });
  
  document.querySelectorAll('.suggested-q').forEach(btn => {
    btn.addEventListener('click', () => { document.getElementById('chat-input').value = btn.textContent; });
  });

  document.getElementById('content-area').addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (!tab?.dataset.tab) return;
    const area = document.getElementById('content-area');
    const grid = document.getElementById('infra-cards-grid');
    const mapCont = document.getElementById('infra-map-container');
    if (!grid) return;
    const listBtn = area?.querySelector('[data-tab="infra-list"]');
    const mapBtn = area?.querySelector('[data-tab="infra-map"]');
    
    if (tab.dataset.tab === 'infra-map') {
      grid?.classList.add('hidden');
      mapCont?.classList.remove('hidden');
      setTimeout(initMap, 100);
      mapBtn?.classList.add('bg-primary-600', 'text-white');
      mapBtn?.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
      listBtn?.classList.remove('bg-primary-600', 'text-white');
      listBtn?.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
    } else if (tab.dataset.tab === 'infra-list') {
      grid?.classList.remove('hidden');
      mapCont?.classList.add('hidden');
      listBtn?.classList.add('bg-primary-600', 'text-white');
      listBtn?.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
      mapBtn?.classList.remove('bg-primary-600', 'text-white');
      mapBtn?.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
    }
  });

  document.getElementById('content-area').addEventListener('click', (e) => {
    const m = e.target.closest('[data-modal]');
    if (m) { const id = m.dataset.modal; if (id) openModal(id); }
  });

  document.getElementById('content-area').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-close-modal]');
    if (btn?.dataset?.closeModal) closeModal(btn.dataset.closeModal);
  });

  document.getElementById('content-area').addEventListener('click', (e) => {
    const btn = e.target.closest('.report-sign-export');
    if (btn?.dataset?.report) openSignatureModal(btn.dataset.report);
  });

  document.getElementById('content-area').addEventListener('click', (e) => {
    if (e.target.closest('.ai-doc-dl')) { e.preventDefault(); alert('Téléchargement du document PDF…'); }
    const navLink = e.target.closest('a[data-page]');
    if (navLink?.dataset?.page) { e.preventDefault(); navigateTo(navLink.dataset.page); }
  });

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');

  document.addEventListener('click', (e) => {
    const modal = e.target.closest('.fixed.inset-0');
    if (modal?.id?.endsWith('-modal') && e.target === modal) closeModal(modal.id);
  });
});