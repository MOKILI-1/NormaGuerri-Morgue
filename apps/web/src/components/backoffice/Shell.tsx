import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Layers,
  BarChart3,
  ShieldCheck,
  Scale,
  ArrowUpDown,
  Menu,
  X,
  Sun,
  Moon,
  ArrowLeftRight,
  LogOut
} from 'lucide-react';
import { useBackoffice } from '../../context/BackofficeContext';

export const Shell: React.FC = () => {
  const {
    currentUser,
    currentPole,
    caisseSession,
    logout,
    resetPoleSelection,
    theme,
    toggleTheme
  } = useBackoffice();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDark = theme === 'dark';
  const isSuperAdminPage = location.pathname.startsWith('/backoffice/super-admin') || currentPole === 'SUPER_ADMIN';

  // Navigation dynamique : Pôle Métier Standard vs Espace Super Admin Consolidé
  const regularNavItems = [
    {
      name: "Vue d'ensemble",
      path: '/backoffice/dashboard',
      icon: LayoutDashboard,
      description: 'Indicateurs & registres'
    },
    {
      name: 'Opérations & Dossiers',
      path: '/backoffice/ops',
      icon: FileText,
      description: 'Facturation & parcours'
    },
    {
      name: 'Caisse & Règlements',
      path: '/backoffice/payments',
      icon: CreditCard,
      description: 'Transactions & sessions'
    },
    {
      name: 'Catalogue Prestations',
      path: '/backoffice/catalog',
      icon: Layers,
      description: 'Services, prix & taxes'
    },
    {
      name: 'Rapports Financiers',
      path: '/backoffice/reports',
      icon: BarChart3,
      description: 'Comptabilité & trésorerie'
    }
  ];

  const superAdminNavItems = [
    {
      name: "Vue d'ensemble Consolidée",
      path: '/backoffice/super-admin?tab=dashboard',
      tabKey: 'dashboard',
      icon: LayoutDashboard,
      description: 'KPIs, registres & graphiques'
    },
    {
      name: 'Services & Catalogue Comparatif',
      path: '/backoffice/super-admin?tab=services',
      tabKey: 'services',
      icon: Scale,
      description: '20 prestations & grille tarifaire'
    },
    {
      name: 'Opérations & Traçabilité Flux',
      path: '/backoffice/super-admin?tab=flux',
      tabKey: 'flux',
      icon: ArrowUpDown,
      description: 'Entrées/sorties & journal audit'
    },
    {
      name: 'Caisse & Finances Multi-Pôles',
      path: '/backoffice/super-admin?tab=finance',
      tabKey: 'finance',
      icon: CreditCard,
      description: 'Trésorerie bidevise USD / CDF'
    },
    {
      name: 'Gestion des Accès & RBAC',
      path: '/backoffice/super-admin?tab=rbac',
      tabKey: 'rbac',
      icon: ShieldCheck,
      description: 'Comptes, mots de passe & pôles'
    }
  ];

  const navigationItems = isSuperAdminPage ? superAdminNavItems : regularNavItems;
  const currentTabParam = new URLSearchParams(location.search).get('tab') || 'dashboard';

  const checkIsActive = (item: any) => {
    if (isSuperAdminPage) {
      return (item.tabKey && currentTabParam === item.tabKey) || (!location.search && item.tabKey === 'dashboard');
    }
    return location.pathname.startsWith(item.path);
  };

  const handleSwitchPole = () => {
    resetPoleSelection();
    navigate('/backoffice');
  };

  const handleLogout = () => {
    logout();
    navigate('/backoffice');
  };

  const hasSuperAdminAccess =
    currentUser?.role === 'DIRECTION' ||
    currentUser?.role === 'ADMINISTRATEUR' ||
    currentUser?.niveauAccreditation === 5 ||
    isSuperAdminPage;

  return (
    <div
      className={`h-screen w-full overflow-hidden flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#0B132B] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER APP BAR CORPORATE — STRICTEMENT IMMOBILE                    */}
      {/* ========================================================================= */}
      <header
        className={`h-16 shrink-0 border-b flex items-center justify-between px-3 sm:px-6 z-30 transition-colors select-none ${
          isDark
            ? 'bg-[#0F172A] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Bouton Hamburger Mobile (visibilité < lg) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Menu de navigation"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo et Identité H+ */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <img
              src="/logo-hospital-nomargueri.jpg"
              alt="Hospital Nomargueri"
              className="w-8 h-8 rounded-full border border-sky-400/80 shadow-sm object-cover bg-white shrink-0"
            />
            <div className="min-w-0">
              <span className="font-bold text-xs uppercase tracking-wide block truncate">
                HOSPITAL NOMARGUERI
              </span>
              <span
                className={`text-[10px] hidden sm:block leading-tight ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Plateforme Clinique & Espace Métier
              </span>
            </div>
          </div>
        </div>

        {/* PÔLE ACTIF, SWITCHER, STATUTS CAISSE, TOGGLE THÈME & DÉCONNEXION */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Badge Pôle Actif & Bouton Changer de Pôle */}
          <div
            className={`flex items-center px-2 sm:px-2.5 py-1 rounded-xl border gap-1.5 sm:gap-2 ${
              isDark
                ? 'bg-[#0B132B] border-slate-800 text-slate-300'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span className="text-[11px] hidden md:inline opacity-80">Pôle :</span>
            <span
              className={`text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded ${
                isSuperAdminPage
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : currentPole === 'MORGUE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-700 text-white'
              }`}
            >
              {isSuperAdminPage ? 'Super Admin' : currentPole === 'MORGUE' ? 'Morgue' : 'Funérarium'}
            </span>
            <button
              onClick={handleSwitchPole}
              className={`text-[11px] hover:underline font-medium transition-colors flex items-center gap-1 ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Retourner à la sélection des pôles"
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span className="hidden sm:inline">Changer</span>
            </button>
          </div>

          {/* Statut Caisse */}
          <div
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <span className="text-[11px]">Caisse :</span>
            {caisseSession.estOuverte ? (
              <span className="text-emerald-500 font-semibold text-[11px]">Ouverte</span>
            ) : (
              <span className="text-slate-400 font-medium text-[11px]">Clôturée</span>
            )}
          </div>

          {/* Toggle Thème Light / Dark */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-xl border text-xs font-medium transition-colors ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
            title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            )}
            <span className="hidden md:inline text-[11px]">{isDark ? 'Clair' : 'Sombre'}</span>
          </button>

          {/* Bouton Super Admin (uniquement présent lorsqu'on est sur l'espace Super Admin) */}
          {isSuperAdminPage && (
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-bold ${
                isDark
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Direction</span>
            </div>
          )}

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className={`text-xs p-1.5 sm:px-2.5 sm:py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
              isDark
                ? 'text-slate-400 hover:text-red-300 border-slate-800 hover:border-red-900/60'
                : 'text-slate-600 hover:text-red-600 border-slate-200 hover:border-red-300 bg-white'
            }`}
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY CONTAINER : CONTENEUR FIXE À HAUTEUR 100% SANS SCROLL GLOBAL      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ======================================================================= */}
        {/* SIDEBAR DESKTOP FIXE & STRICTEMENT IMMOBILE AU SCROLL                   */}
        {/* Seul son sous-contenu défile si la hauteur d'écran est très faible      */}
        {/* ======================================================================= */}
        <aside
          className={`hidden lg:flex w-64 shrink-0 flex-col justify-between border-r h-full overflow-hidden select-none z-20 transition-colors ${
            isDark
              ? 'bg-[#0B132B] border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Menu Haut déroulant uniquement en interne */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            {/* Rappel du Pôle actif */}
            <div
              className={`p-3 rounded-xl border text-xs transition-colors ${
                isSuperAdminPage
                  ? isDark
                    ? 'bg-amber-950/40 border-amber-800/70 text-amber-200'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                  : currentPole === 'MORGUE'
                  ? isDark
                    ? 'bg-blue-950/40 border-blue-900/60 text-blue-200'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                  : isDark
                  ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-200'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-wider">
                <span>Espace en cours</span>
                <span className="font-mono font-bold">
                  {isSuperAdminPage ? 'SUPER ADMIN' : currentPole}
                </span>
              </div>
              <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isSuperAdminPage
                  ? 'Supervision transverse & RBAC'
                  : currentPole === 'MORGUE'
                  ? 'Corps, chambres froides & soins'
                  : 'Salons de veillée & prestations'}
              </p>
            </div>

            {/* Liens de navigation */}
            <div className="space-y-1">
              <span
                className={`text-[10px] uppercase font-semibold tracking-wider px-3 block ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Menu de gestion
              </span>

              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = checkIsActive(item);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? isSuperAdminPage
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                          : currentPole === 'MORGUE'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-emerald-700 text-white shadow-sm'
                        : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive && isSuperAdminPage ? 'text-slate-950 opacity-100' : 'opacity-80'}`} />
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-semibold">{item.name}</span>
                      <span
                        className={`text-[10px] block truncate font-normal ${
                          isActive
                            ? isSuperAdminPage
                              ? 'text-slate-900/80 font-medium'
                              : 'text-slate-100 opacity-80'
                            : isDark
                            ? 'text-slate-500'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Bas de Sidebar : Profil Agent */}
          <div
            className={`p-3.5 border-t shrink-0 ${
              isDark ? 'border-slate-800 bg-[#0A1024]' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {currentUser && (
              <div className="space-y-1 text-xs">
                <span className={`font-semibold block truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  {currentUser.prenom} {currentUser.nom}
                </span>
                <span className={`text-[10px] block truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {currentUser.role.replace(/_/g, ' ')}
                </span>
                <span className={`text-[10px] font-mono block truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {currentUser.directionRattachee}
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* ======================================================================= */}
        {/* TIROIR MOBILE LATÉRAL (DRAWER EN OVERLAY POUR SMARTPHONES ET TABLETTES) */}
        {/* ======================================================================= */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
            isDark
              ? 'bg-[#0B132B] border-r border-slate-800 text-slate-100'
              : 'bg-white border-r border-slate-200 text-slate-900'
          } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Header du Tiroir Mobile */}
          <div
            className={`p-4 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-[#0F172A]' : 'border-slate-200 bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <img
                src="/logo-hospital-nomargueri.jpg"
                alt="Hospital Nomargueri"
                className="w-8 h-8 rounded-full border border-sky-400 object-cover bg-white shrink-0"
              />
              <div>
                <span className="font-bold text-xs uppercase tracking-wide block">
                  HOSPITAL NOMARGUERI
                </span>
                <span className={`text-[10px] block leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Navigation Métier
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corps défilable du Tiroir */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            {/* Rappel Pôle & Switcher rapide */}
            <div
              className={`p-3 rounded-xl border text-xs ${
                isSuperAdminPage
                  ? isDark
                    ? 'bg-amber-950/40 border-amber-800/70 text-amber-200'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                  : currentPole === 'MORGUE'
                  ? isDark
                    ? 'bg-blue-950/40 border-blue-900/60 text-blue-200'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                  : isDark
                  ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-200'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] uppercase font-semibold">
                <span>Pôle en cours</span>
                <span className="font-mono font-bold">
                  {isSuperAdminPage ? 'SUPER ADMIN' : currentPole}
                </span>
              </div>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleSwitchPole();
                }}
                className="mt-2 w-full py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Changer de Pôle</span>
              </button>
            </div>

            {/* Liens de navigation */}
            <div className="space-y-1">
              <span
                className={`text-[10px] uppercase font-semibold tracking-wider px-3 block ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Menu de gestion
              </span>

              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = checkIsActive(item);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? isSuperAdminPage
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                          : currentPole === 'MORGUE'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-emerald-700 text-white shadow-sm'
                        : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive && isSuperAdminPage ? 'text-slate-950 opacity-100' : 'opacity-80'}`} />
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-semibold">{item.name}</span>
                      <span
                        className={`text-[10px] block truncate font-normal ${
                          isActive
                            ? isSuperAdminPage
                              ? 'text-slate-900/80 font-medium'
                              : 'text-slate-100 opacity-80'
                            : isDark
                            ? 'text-slate-500'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Bas du Tiroir Mobile : Profil & Déconnexion */}
          <div
            className={`p-3.5 border-t shrink-0 ${
              isDark ? 'border-slate-800 bg-[#0A1024]' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {currentUser && (
              <div className="space-y-2">
                <div className="text-xs">
                  <span className={`font-semibold block truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {currentUser.prenom} {currentUser.nom}
                  </span>
                  <span className={`text-[10px] block truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {currentUser.role.replace(/_/g, ' ')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ======================================================================= */}
        {/* ZONE PRINCIPALE DE CONTENU — SEUL CE CONTENU DÉFILE VERTICALEMENT       */}
        {/* La barre latérale gauche reste strictement immobile et figée à l'écran */}
        {/* ======================================================================= */}
        <main
          className={`flex-1 h-full overflow-y-auto p-3.5 sm:p-5 lg:p-7 min-w-0 transition-colors focus:outline-none ${
            isDark ? 'bg-[#070F22]' : 'bg-slate-50'
          }`}
        >
          <div className="max-w-7xl mx-auto w-full pb-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
