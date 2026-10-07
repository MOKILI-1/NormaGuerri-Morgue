import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackoffice, UserSession } from '../../context/BackofficeContext';

export const LoginPage: React.FC = () => {
  const { login } = useBackoffice();
  const navigate = useNavigate();

  const [email, setEmail] = useState('eric.mutombo@nomargueri.cd');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Comptes de démonstration professionnels
  const demoAccounts: UserSession[] = [
    {
      id: 'usr-1',
      nom: 'MUTOMBO',
      prenom: 'Éric',
      email: 'eric.mutombo@nomargueri.cd',
      role: 'RESPONSABLE_EXPLOITATION',
      niveauAccreditation: 4,
      estActif: true,
      telephone: '+243997222228',
      creeLe: '2026-01-10T08:00:00Z',
      actorId: 'ACT-EXP-001',
      directionRattachee: 'DIRECTION_MORGUE'
    },
    {
      id: 'usr-2',
      nom: 'TSHILOMBA',
      prenom: 'Nathalie',
      email: 'nathalie.tshilomba@nomargueri.cd',
      role: 'COMPTABLE',
      niveauAccreditation: 3,
      estActif: true,
      telephone: '+243833330040',
      creeLe: '2026-01-12T08:00:00Z',
      actorId: 'ACT-CAISSE-002',
      directionRattachee: 'CAISSE_CENTRALE'
    },
    {
      id: 'usr-3',
      nom: 'KASANDA',
      prenom: 'Aimé',
      email: 'direction@nomargueri.cd',
      role: 'DIRECTION',
      niveauAccreditation: 5,
      estActif: true,
      telephone: '+243997222228',
      creeLe: '2026-01-15T08:00:00Z',
      actorId: 'ACT-DG-003',
      directionRattachee: 'DIRECTION_GENERALE'
    },
    {
      id: 'usr-4',
      nom: 'LUMUMBA',
      prenom: 'Clarisse',
      email: 'clarisse.lumumba@nomargueri.cd',
      role: 'AGENT_RECEPTION',
      niveauAccreditation: 2,
      estActif: true,
      telephone: '+243810000004',
      creeLe: '2026-02-01T08:00:00Z',
      actorId: 'ACT-FUN-004',
      directionRattachee: 'DIRECTION_FUNERARIUM'
    }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const matched = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase()) || demoAccounts[0];
      login(matched);
      setLoading(false);
      // Redirection immédiate vers la deuxième page : Sélection des 2 pôles (Morgue ou Funérarium)
      navigate('/backoffice/select-pole');
    }, 450);
  };

  const handleSelectDemo = (account: UserSession) => {
    setEmail(account.email);
    login(account);
    navigate('/backoffice/select-pole');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative bg-[#0F172A] border border-slate-800 rounded-2xl max-w-md w-full p-8 text-slate-100 shadow-2xl space-y-6">
        {/* En-tête sobre et épuré */}
        <div className="text-center space-y-3">
          <img
            src="/logo-hospital-nomargueri.jpg"
            alt="Hospital Nomargueri"
            className="w-14 h-14 rounded-full border border-slate-700 mx-auto object-cover bg-white shadow-sm"
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase font-sans">
              HOSPITAL NOMARGUERI
            </h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Portail Hospitalier & Espace Métier
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Formulaire épuré sans surcharge d'icônes */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium text-xs">
              Identifiant / E-mail professionnel
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-slate-700/80 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              placeholder="nom@nomargueri.cd"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-slate-300 font-medium text-xs">
                Mot de passe
              </label>
              <span className="text-[11px] text-slate-500">Sécurisé</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-slate-700/80 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs tracking-wide transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* Accès rapide démonstration : design soft et discret */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
          <span className="text-[11px] text-slate-400 font-medium block">
            Comptes de test accrédités :
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <span className="font-medium text-slate-200 block truncate">
                  {acc.prenom} {acc.nom}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {acc.role.replace(/_/g, ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Lien discret de retour */}
        <div className="text-center pt-1">
          <a
            href="/"
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Retour à la page d'accueil
          </a>
        </div>
      </div>
    </div>
  );
};
