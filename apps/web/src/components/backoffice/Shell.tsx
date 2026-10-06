import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Layers,
  BarChart3,
  ShieldCheck,
  LogOut,
  Building2,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Coins,
  ArrowLeftRight,
  RefreshCw,
  Bell,
  User,
  Shield,
  HelpCircle,
  Home
} from 'lucide-react';
import { useBackoffice, PoleMetier } from '../../context/BackofficeContext';

export const Shell: React.FC = () => {
  const { currentUser, currentPole, setCurrentPole, caisseSession, logout } = useBackoffice();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      name: "Vue d'ensemble",
      path: '/backoffice/dashboard',
      icon: LayoutDashboard,
      description: 'KPIs, alertes & activité'
    },
    {
      name: 'Gestion Métier (Ops)',
      path: '/backoffice/ops',
      icon: FileText,
      description: 'Facturation & parcours'
    },
    {
      name: 'Paiements & Caisse',
      path: '/backoffice/payments',
      icon: CreditCard,
      description: 'Transactions & sessions caisse'
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
      description: 'Comptabilité & multi-devises'
    },
    {
      name: 'Gestion des Rôles (RBAC)',
      path: '/backoffice/access',
      icon: ShieldCheck,
      description: 'Utilisateurs & directions'
    }
  ];

  const handleSwitchPole = (nouveauPole: PoleMetier) => {
    setCurrentPole(nouveauPole);
  };

  const handleLogout = () => {
    logout();
    navigate('/backoffice/login');
  };

  const currentItem = navigationItems.find((item) => location.pathname.startsWith(item.path)) || navigationItems[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER APP BAR                                                     */}
      {/* ========================================================================= */}
      <header className="h-16 bg-[#061126] border-b border-blue-950 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-3">
            <img
              src="/logo-hospital-nomargueri.jpg"
              alt="Hospital Nomargueri"
              className="w-9 h-9 rounded-full border border-sky-400 object-cover bg-white shrink-0"
            />
            <div>
              <span className="font-extrabold text-sm text-white tracking-wide uppercase">
                HOSPITAL NOMARGUERI
              </span>
              <span className="text-[10px] text-sky-400 font-mono block leading-none mt-0.5">
                Back-Office Opérationnel Souverain
              </span>
            </div>
          </div>
        </div>

        {/* SWITCHER DE PÔLE EN HEADER & STATUTS CAISSE */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Switcher Pôle Actuel (Morgue vs Funérarium) */}
          <div className="flex items-center bg-[#030914] p-1 rounded-xl border border-blue-900/80 shadow-inner">
            <button
              onClick={() => handleSwitchPole('MORGUE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentPole === 'MORGUE'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-300" />
              <span>Morgue</span>
            </button>
            <button
              onClick={() => handleSwitchPole('FUNERARIUM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentPole === 'FUNERARIUM'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-200" />
              <span>Funérarium</span>
            </button>
            <button
              onClick={() => navigate('/backoffice/select-pole')}
              title="Changer de pôle"
              className="p-1.5 text-slate-400 hover:text-sky-300 rounded-lg hover:bg-slate-800 transition-colors ml-1"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Statut Caisse */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-blue-950 text-xs">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 text-[11px]">Caisse :</span>
            {caisseSession.estOuverte ? (
              <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ouverte
              </span>
            ) : (
              <span className="text-amber-400 font-semibold text-[11px]">Clôturée</span>
            )}
          </div>

          {/* Lien vers Landing Page Public */}
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
            title="Consulter la Landing Page Publique"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="text-[11px]">Landing</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY AVEC SIDEBAR LATÉRALE ET ZONE DE CONTENU                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION LATÉRALE */}
        <aside
          className={`fixed lg:static inset-y-16 left-0 z-20 w-64 bg-[#050E22] border-r border-blue-950/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Menu Haut */}
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Badge Pôle Actif avec rappel de mission */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                currentPole === 'MORGUE'
                  ? 'bg-blue-950/50 border-blue-800/60 text-sky-200'
                  : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider">
                <span>Espace Actif :</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    currentPole === 'MORGUE' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {currentPole}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                {currentPole === 'MORGUE'
                  ? 'Gestion des corps, admissions & chambres froides'
                  : 'Prestations, salons de veillée & organisation funéraire'}
              </p>
            </div>

            {/* Liste des Liens du Shell */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 block">
                Modules Métiers
              </span>

              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? currentPole === 'MORGUE'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-white'
                          : currentPole === 'MORGUE'
                          ? 'text-sky-400'
                          : 'text-emerald-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{item.name}</span>
                      <span
                        className={`text-[10px] block truncate font-normal ${
                          isActive ? 'text-blue-100 opacity-90' : 'text-slate-500'
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

          {/* Bas de Sidebar : Profil Agent & Actions */}
          <div className="p-4 border-t border-blue-950/80 bg-[#040A1A] space-y-3">
            {currentUser && (
              <div className="flex items-center space-x-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-blue-950">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {currentUser.prenom[0]}
                  {currentUser.nom[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-white text-xs block truncate">
                    {currentUser.prenom} {currentUser.nom}
                  </span>
                  <span className="text-[10px] text-sky-400 font-mono block truncate">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-red-900/50 hover:text-red-200 text-slate-300 text-xs font-semibold border border-slate-700/80 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL DE LA PAGE */}
        <main className="flex-1 overflow-y-auto bg-[#071329] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
