import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Layers,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
  Sun,
  Moon,
  ArrowLeftRight,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useBackoffice, PoleMetier } from '../../context/BackofficeContext';

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

  const navigationItems = [
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

  const handleSwitchPole = () => {
    resetPoleSelection();
    navigate('/backoffice');
  };

  const handleLogout = () => {
    logout();
    navigate('/backoffice');
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#0B132B] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER APP BAR CORPORATE AVEC TOGGLE LIGHT/DARK & PÔLE ACTIF       */}
      {/* ========================================================================= */}
      <header
        className={`h-16 border-b flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0 transition-colors ${
          isDark
            ? 'bg-[#0F172A] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-3">
            <img
              src="/logo-hospital-nomargueri.jpg"
              alt="Hospital Nomargueri"
              className="w-8 h-8 rounded-full border border-slate-700 object-cover bg-white shrink-0"
            />
            <div>
              <span className="font-bold text-xs uppercase tracking-wide block">
                HOSPITAL NOMARGUERI
              </span>
              <span className={`text-[10px] block leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Plateforme Clinique & Espace Métier
              </span>
            </div>
          </div>
        </div>

        {/* PÔLE ACTIF, SWITCHER, STATUTS CAISSE, TOGGLE THÈME & DÉCONNEXION */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Badge Pôle Actif & Bouton Changer de Pôle */}
          <div
            className={`flex items-center px-2.5 py-1 rounded-xl border gap-2 ${
              isDark
                ? 'bg-[#0B132B] border-slate-800 text-slate-300'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span className="text-[11px] hidden sm:inline opacity-80">Pôle :</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                currentPole === 'MORGUE'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-700 text-white'
              }`}
            >
              {currentPole === 'MORGUE' ? 'Morgue' : 'Funérarium'}
            </span>
            <button
              onClick={handleSwitchPole}
              className={`text-[11px] underline hover:no-underline font-medium transition-colors flex items-center gap-1 ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Retourner à la sélection des 2 pôles"
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span className="hidden md:inline">Changer</span>
            </button>
          </div>

          {/* Statut Caisse */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs ${
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
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium transition-colors ${
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
            <span className="hidden sm:inline text-[11px]">{isDark ? 'Clair' : 'Sombre'}</span>
          </button>

          {/* Bouton Super Admin */}
          <NavLink
            to="/backoffice/super-admin"
            className={({ isActive }) =>
              `hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : isDark
                  ? 'text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/50 border-amber-800/80'
                  : 'text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border-amber-300'
              }`
            }
            title="Cockpit de supervision Super Admin"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </NavLink>

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
              isDark
                ? 'text-slate-400 hover:text-red-300 border-slate-800 hover:border-red-900/60'
                : 'text-slate-600 hover:text-red-600 border-slate-200 hover:border-red-300 bg-white'
            }`}
            title="Se déconnecter"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY AVEC SIDEBAR LATÉRALE ET ZONE DE CONTENU                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION LATÉRALE */}
        <aside
          className={`fixed lg:static inset-y-16 left-0 z-20 w-60 border-r flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isDark
              ? 'bg-[#0B132B] border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Menu Haut */}
          <div className="p-3.5 space-y-5 overflow-y-auto">
            {/* Rappel du Pôle actif */}
            <div
              className={`p-3 rounded-xl border text-xs ${
                currentPole === 'MORGUE'
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
                <span className="font-mono">{currentPole}</span>
              </div>
              <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {currentPole === 'MORGUE'
                  ? 'Corps, chambres froides & soins'
                  : 'Salons de veillée & prestations'}
              </p>
            </div>

            {/* Liens de navigation */}
            <div className="space-y-1">
              <span className={`text-[10px] uppercase font-semibold tracking-wider px-3 block ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Menu de gestion
              </span>

              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? currentPole === 'MORGUE'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-emerald-700 text-white shadow-sm'
                        : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{item.name}</span>
                      <span
                        className={`text-[10px] block truncate font-normal ${
                          isActive
                            ? 'text-slate-100 opacity-80'
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

              {/* Accès Espace Super Admin */}
              <div className="pt-2">
                <NavLink
                  to="/backoffice/super-admin"
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : isDark
                        ? 'text-amber-300 hover:text-amber-200 bg-amber-950/20 hover:bg-amber-950/40 border-amber-800/40'
                        : 'text-amber-800 hover:text-amber-900 bg-amber-50/80 hover:bg-amber-100 border-amber-200'
                    }`
                  }
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">Espace Super Admin</span>
                    <span className="text-[10px] block truncate font-normal opacity-80">
                      RBAC, Flux & Supervision
                    </span>
                  </div>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Bas de Sidebar : Profil Agent */}
          <div
            className={`p-3.5 border-t ${
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

        {/* CONTENU PRINCIPAL DE LA PAGE AVEC GESTION DU THÈME */}
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors ${
            isDark ? 'bg-[#070F22]' : 'bg-slate-50'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
