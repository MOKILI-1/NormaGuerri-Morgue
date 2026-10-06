import React from 'react';
import { RoleUtilisateur } from '@nomarguerrie/shared-types';
import {
  QrCode,
  PlusCircle,
  Activity,
  Layers,
  FolderOpen,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'dossiers' | 'emplacements';
  onNavigate: (view: 'dashboard' | 'dossiers' | 'emplacements') => void;
  activeRole: RoleUtilisateur;
  onRoleChange: (role: RoleUtilisateur) => void;
  onOpenScanner: () => void;
  onOpenNewAdmission: () => void;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeRole,
  onRoleChange,
  onOpenScanner,
  onOpenNewAdmission,
  isBackendConnected
}) => {
  const roles: { value: RoleUtilisateur; label: string; badge: string }[] = [
    { value: 'AGENT_RECEPTION', label: 'Agent Réception', badge: 'Accueil / Entrées' },
    { value: 'AGENT_MORGUE', label: 'Agent Morgue', badge: 'Terrain / Cases' },
    { value: 'COMPTABLE', label: 'Comptable', badge: 'Finances / Facturation' },
    { value: 'RESPONSABLE_EXPLOITATION', label: 'Resp. Exploitation', badge: 'Contrôles / Arbitrage' },
    { value: 'DIRECTION', label: 'Direction Générale', badge: 'Macro / Décisions' }
  ];

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et Identité */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                NomarGuerrie
                <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono border border-blue-700/50">V2</span>
              </span>
              <p className="text-xs text-slate-400 hidden sm:block">Système Souverain du Parcours Funéraire</p>
            </div>
          </div>

          {/* Navigation Principale */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                currentView === 'dashboard'
                  ? 'bg-slate-800 text-blue-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              Accueil & Dashboard
            </button>

            <button
              onClick={() => onNavigate('dossiers')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                currentView === 'dossiers'
                  ? 'bg-slate-800 text-blue-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              Dossiers Vivants
            </button>

            <button
              onClick={() => onNavigate('emplacements')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                currentView === 'emplacements'
                  ? 'bg-slate-800 text-blue-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              Chambres & Cases
            </button>
          </nav>

          {/* Actions Rapides & Profil */}
          <div className="flex items-center space-x-3">
            {/* Scan QR Code */}
            <button
              onClick={onOpenScanner}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-1.5 shadow transition-colors"
              title="Scanner un QR Code de dossier"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Scanner QR</span>
            </button>

            {/* Nouvelle Admission */}
            <button
              onClick={onOpenNewAdmission}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium flex items-center gap-1.5 shadow transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Nouvelle Admission</span>
            </button>

            {/* Sélecteur de Rôle Actif */}
            <div className="relative group">
              <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs cursor-pointer">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <div className="text-left">
                  <div className="font-semibold text-slate-200">
                    {roles.find((r) => r.value === activeRole)?.label}
                  </div>
                </div>
                <select
                  value={activeRole}
                  onChange={(e) => onRoleChange(e.target.value as RoleUtilisateur)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value} className="bg-slate-900 text-white">
                      {r.label} ({r.badge})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Indicateur Résilience Réseau Local */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 border-l border-slate-800 pl-3">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isBackendConnected ? 'LAN Morgue Actif' : 'Mode Edge Local'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
