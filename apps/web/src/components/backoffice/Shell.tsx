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
  X
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
    },
    {
      name: 'Rôles & Accréditations',
      path: '/backoffice/access',
      icon: ShieldCheck,
      description: 'Utilisateurs & RBAC'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/backoffice/login');
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER APP BAR CORPORATE & ÉPURÉ                                   */}
      {/* ========================================================================= */}
      <header className="h-16 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
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
              className="w-8 h-8 rounded-full border border-slate-700 object-cover bg-white shrink-0"
            />
            <div>
              <span className="font-bold text-xs uppercase tracking-wide text-white block">
                HOSPITAL NOMARGUERI
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                Plateforme Clinique & Espace Métier
              </span>
            </div>
          </div>
        </div>

        {/* PÔLE ACTIF, STATUTS & ACTIONS */}
        <div className="flex items-center space-x-3">
          {/* Badge Pôle Actif & Sélecteur */}
          <div className="flex items-center bg-[#0B132B] px-2.5 py-1 rounded-xl border border-slate-800 gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Pôle :</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                currentPole === 'MORGUE'
                  ? 'bg-blue-950/80 text-blue-300 border border-blue-900/60'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-900/60'
              }`}
            >
              {currentPole === 'MORGUE' ? 'Morgue' : 'Funérarium'}
            </span>
            <button
              onClick={() => navigate('/backoffice/select-pole')}
              className="text-[11px] text-slate-400 hover:text-white underline hover:no-underline ml-1"
              title="Changer de pôle"
            >
              Changer
            </button>
          </div>

          {/* Statut Caisse */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <span className="text-[11px]">Caisse :</span>
            {caisseSession.estOuverte ? (
              <span className="text-emerald-400 font-medium text-[11px]">Ouverte</span>
            ) : (
              <span className="text-slate-400 font-medium text-[11px]">Clôturée</span>
            )}
          </div>

          {/* Lien Landing Public */}
          <a
            href="/"
            className="hidden sm:inline-block text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            Portail public
          </a>

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-red-300 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BODY AVEC SIDEBAR LATÉRALE ET ZONE DE CONTENU                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION LATÉRALE */}
        <aside
          className={`fixed lg:static inset-y-16 left-0 z-20 w-60 bg-[#0B132B] border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Menu Haut */}
          <div className="p-3.5 space-y-5 overflow-y-auto">
            {/* Rappel du Pôle actif */}
            <div
              className={`p-3 rounded-xl border text-xs ${
                currentPole === 'MORGUE'
                  ? 'bg-blue-950/30 border-blue-900/50 text-blue-200'
                  : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-wider">
                <span>Espace en cours</span>
                <span className="font-mono">{currentPole}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                {currentPole === 'MORGUE'
                  ? 'Corps, chambres froides & soins'
                  : 'Salons de veillée & prestations'}
              </p>
            </div>

            {/* Liens de navigation */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider px-3 block">
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
                          ? 'bg-blue-600 text-white'
                          : 'bg-emerald-700 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{item.name}</span>
                      <span
                        className={`text-[10px] block truncate font-normal ${
                          isActive ? 'text-slate-100 opacity-80' : 'text-slate-500'
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
          <div className="p-3.5 border-t border-slate-800 bg-[#0A1024]">
            {currentUser && (
              <div className="space-y-1 text-xs">
                <span className="font-medium text-slate-200 block truncate">
                  {currentUser.prenom} {currentUser.nom}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {currentUser.role.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block truncate">
                  {currentUser.directionRattachee}
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* CONTENU PRINCIPAL DE LA PAGE */}
        <main className="flex-1 overflow-y-auto bg-[#070F22] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
