// ============================================================
// RBAC UI 
// ============================================================
(function () {
  'use strict';

  var ROLE_CONFIG = {
    super_admin:      { label: { fr: 'Super Administrateur', ar: 'المشرف العام' },  color: '#1A237E', pages: null },
    national_admin:   { label: { fr: 'Admin National', ar: 'المشرف الوطني' },       color: '#1558b6', pages: null },
    regional_manager: { label: { fr: 'Direction Régionale', ar: 'الإدارة الجهوية' }, color: '#1B5E20', pages: ['dashboard','calendar','workflow','documents','reservations','reports','infrastructure','gis','notifications','sync'] },
    federation:       { label: { fr: 'Fédération', ar: 'الاتحاد' },                 color: '#E65100', pages: ['dashboard','calendar','workflow','documents','reservations','reports','notifications','sync'] },
    participant:      { label: { fr: 'Participant', ar: 'المشارك' },                 color: '#6b7280', pages: ['dashboard','calendar','documents','notifications'] }
  };

  function _role()       { return localStorage.getItem('userRole')       || 'participant'; }
  function _email()      { return localStorage.getItem('userEmail')      || ''; }
  function _userName()   { return localStorage.getItem('userName')       || 'Utilisateur'; }
  function _region()     { return localStorage.getItem('userRegion')     || ''; }
  function _federation() { return localStorage.getItem('userFederation') || ''; }
  function _lang()       { return localStorage.getItem('sgs-lang')       || 'fr'; }

  function _initials(name) {
    if (!name) return 'U';
    var p = name.trim().split(/\s+/);
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  function _roleLabel(role) {
    var c = ROLE_CONFIG[role]; if (!c) return role;
    return c.label[_lang()] || c.label['fr'] || role;
  }

  function _roleSubtitle() {
    var r = _role(), l = _roleLabel(r);
    if (r === 'regional_manager' && _region())    return l + ' — ' + _region();
    if (r === 'federation'       && _federation()) return l + ' — ' + _federation();
    return l;
  }

  function _updateTopbar() {
    var n = _userName(), r = _role(), c = ROLE_CONFIG[r], el;
    el = document.getElementById('topbar-user-name');  if (el) el.textContent = n;
    el = document.getElementById('topbar-user-email'); if (el) el.textContent = _roleSubtitle();
    el = document.getElementById('topbar-avatar');     if (el) { el.textContent = _initials(n); el.style.background = c ? c.color : '#6b7280'; }
    el = document.getElementById('topbar-user-info');  if (el) el.title = _email();
  }

  function _updateSidebar() {
    var c = ROLE_CONFIG[_role()], allowed = c ? c.pages : ['dashboard'];
    var links = document.querySelectorAll('#sidebar .sidebar-link[data-page]');
    for (var i = 0; i < links.length; i++) {
      var pid = links[i].getAttribute('data-page');
      links[i].style.display = (allowed === null || allowed.indexOf(pid) !== -1) ? '' : 'none';
    }
  }

  window.updateUserInterface = function () { _updateTopbar(); _updateSidebar(); };

  window.login = function () {
    var emailInput = document.getElementById('login-email');
    var email = emailInput ? emailInput.value : '';
    if (!email) { email = 'superadmin@sgs.gov'; }

    // Detect role
    var role = 'participant';
    if (email.indexOf('superadmin') !== -1)                                    role = 'super_admin';
    else if (email.indexOf('national') !== -1 || email.indexOf('admin') !== -1) role = 'national_admin';
    else if (email.indexOf('region') !== -1) {
      role = 'regional_manager';
      localStorage.setItem('userRegion', email.split('@')[0].split('.')[1] || 'Centre');
    } else if (email.indexOf('fed') !== -1) {
      role = 'federation';
      localStorage.setItem('userFederation', email.split('@')[0]);
    }

    // Format name
    var parts = email.split('@')[0].split('.');
    var userName = parts.length > 1
      ? parts.map(function (p) { return p.charAt(0).toUpperCase() + p.slice(1); }).join(' ')
      : email.split('@')[0];

    // Save
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', userName);

    // Init doc module
    if (typeof initDocumentModule === 'function') try { initDocumentModule(); } catch (e) { }

    // Welcome message
    var msgs = {
      super_admin:      'Bienvenue Super Admin — Accès complet',
      national_admin:   'Bienvenue Admin National',
      regional_manager: 'Bienvenue — Région ' + (localStorage.getItem('userRegion') || ''),
      federation:       'Bienvenue — ' + (localStorage.getItem('userFederation') || 'Fédération'),
      participant:      'Bienvenue dans votre espace'
    };
    if (typeof showSuccessModal === 'function') showSuccessModal(msgs[role] || 'Connexion réussie!');

    // Show app after 1.5s
    setTimeout(function () {
      var lp = document.getElementById('login-page');
      var ma = document.getElementById('main-app');
      if (lp) lp.classList.add('hidden');
      if (ma) { ma.classList.remove('hidden'); ma.classList.add('flex'); }

      // THE KEY CALL 
      window.updateUserInterface();

      if (typeof navigateTo === 'function') navigateTo('dashboard');
    }, 1500);
  };

  // Hook setLanguage
  var _origSetLang = window.setLanguage;
  if (typeof _origSetLang === 'function') {
    window.setLanguage = function (lang) { _origSetLang(lang); setTimeout(_updateTopbar, 80); };
  }

  // Auto-run if already logged in
  document.addEventListener('DOMContentLoaded', function () {
    var ma = document.getElementById('main-app');
    if (ma && !ma.classList.contains('hidden')) window.updateUserInterface();
  });
})();