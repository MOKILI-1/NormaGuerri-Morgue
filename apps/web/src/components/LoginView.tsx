import React, { useState } from 'react';
import { RoleUtilisateur, Utilisateur } from '@nomarguerrie/shared-types';
import { ShieldCheck, Lock, User, ArrowRight, KeyRound, AlertCircle } from 'lucide-react';
import { UTILISATEURS_MOCK } from '../../../api/src/data/mock-db';

interface LoginViewProps {
  onLoginSuccess: (user: Utilisateur) => void;
  onGoToPublicSite: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onGoToPublicSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const found = UTILISATEURS_MOCK.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (found) {
      onLoginSuccess(found);
    } else {
      setError('Identifiants incorrects. Veuillez utiliser un compte officiel NomarGuerrie.');
    }
  };

  const handleQuickLogin = (role: RoleUtilisateur) => {
    const user = UTILISATEURS_MOCK.find((u) => u.role === role) || UTILISATEURS_MOCK[0];
    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-xl shadow-blue-900/50 border border-blue-500/30">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          NomarGuerrie — Backoffice
        </h1>
        <p className="text-xs text-slate-400">
          Portail réservé aux agents habilités, corps médical et direction
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Email professionnel</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  placeholder="ex: serge.mukendi@nomarguerrie.cd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              Connexion Sécurisée
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Accès Rapides par Profils Officiels */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold uppercase flex items-center gap-1 text-blue-400">
                <KeyRound className="w-3 h-3" /> Accès Rapide par Rôle (Démo)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('RESPONSABLE_EXPLOITATION')}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-left flex items-center justify-between transition-colors group"
              >
                <div>
                  <span className="font-bold text-white block">Serge MUKENDI</span>
                  <span className="text-[11px] text-slate-400">Responsable Exploitation (Niveau 4)</span>
                </div>
                <span className="text-blue-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">➔</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('AGENT_MORGUE')}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-left flex items-center justify-between transition-colors group"
              >
                <div>
                  <span className="font-bold text-white block">Éric MUTOMBO</span>
                  <span className="text-[11px] text-slate-400">Agent Morgue & Cases (Niveau 2)</span>
                </div>
                <span className="text-blue-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">➔</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('COMPTABLE')}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-left flex items-center justify-between transition-colors group"
              >
                <div>
                  <span className="font-bold text-white block">Nathalie TSHILOMBA</span>
                  <span className="text-[11px] text-slate-400">Comptable & Finances (Niveau 3)</span>
                </div>
                <span className="text-blue-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">➔</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('DIRECTION')}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-left flex items-center justify-between transition-colors group"
              >
                <div>
                  <span className="font-bold text-white block">Aimé MBUYI</span>
                  <span className="text-[11px] text-slate-400">Direction Générale (Niveau 5)</span>
                </div>
                <span className="text-blue-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">➔</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onGoToPublicSite}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Retour au site public NomarGuerrie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
