import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBackoffice, UserSession } from '../../context/BackofficeContext';

export const LoginPage: React.FC = () => {
  const { login } = useBackoffice();
  const navigate = useNavigate();

  const [email, setEmail] = useState('eric.mutombo@nomargueri.cd');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Comptes de démonstration professionnels prêts à l'emploi
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
      // Trouver l'utilisateur correspondant ou prendre le compte par défaut
      const matched = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase()) || demoAccounts[0];
      login(matched);
      setLoading(false);
      // Redirection vers l'écran d'accueil avec les 2 grosses cases (Norma.jpeg)
      navigate('/backoffice/select-pole');
    }, 600);
  };

  const handleSelectDemo = (account: UserSession) => {
    setEmail(account.email);
    login(account);
    navigate('/backoffice/select-pole');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="relative bg-[#071329] border border-blue-900/80 rounded-3xl max-w-md w-full p-7 sm:p-8 text-white shadow-2xl space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <img
            src="/logo-hospital-nomargueri.jpg"
            alt="Hospital Nomargueri"
            className="w-16 h-16 rounded-full border-2 border-sky-400 mx-auto shadow-lg object-cover bg-white"
          />
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              HOSPITAL NOMARGUERI
            </h2>
            <p className="text-xs text-sky-400 font-mono tracking-wide mt-0.5">
              Plateforme Métier & Back-Office
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulaire de Connexion */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Identifiant / E-mail professionnel</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-[#040A1A] border border-blue-950 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-[#040A1A] border border-blue-950 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authentification en cours...</span>
            ) : (
              <>
                <span>Se Connecter au Back-Office</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Comptes rapides prêts pour test */}
        <div className="pt-2 border-t border-blue-950 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Accès rapide par profil métier :
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-blue-950 border border-blue-950/80 text-left transition-colors flex flex-col justify-between"
              >
                <span className="font-bold text-white truncate">{acc.prenom} {acc.nom}</span>
                <span className="text-[9px] text-sky-400 truncate">{acc.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lien retour au portail public */}
        <div className="text-center">
          <a
            href="/"
            className="text-[11px] text-slate-400 hover:text-sky-300 transition-colors underline"
          >
            ← Retourner au portail public
          </a>
        </div>
      </div>
    </div>
  );
};
