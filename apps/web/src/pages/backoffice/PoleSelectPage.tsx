import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackoffice, PoleMetier, UserSession } from '../../context/BackofficeContext';
import { Sun, Moon, Lock, Mail, AlertCircle, X, Shield, ArrowRight } from 'lucide-react';

export const PoleSelectPage: React.FC = () => {
  const {
    currentUser,
    setCurrentPole,
    logout,
    theme,
    toggleTheme,
    targetPole,
    setTargetPole,
    loginWithPole
  } = useBackoffice();
  const navigate = useNavigate();

  // État local de la modale de connexion overlay
  const [email, setEmail] = useState('eric.mutombo@nomargueri.cd');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Comptes de démonstration avec leurs droits stricts
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
    }
  ];

  // ÉTAPE 1 : Clic sur une des 2 cases -> Déclenche l'affichage de l'overlay de login pour ce pôle
  const handleChoosePolePath = (pole: PoleMetier) => {
    setAuthError(null);
    setTargetPole(pole);

    // Pré-sélectionner un compte pertinent pour fluidifier le test
    if (pole === 'MORGUE') {
      setEmail('eric.mutombo@nomargueri.cd');
    } else {
      setEmail('clarisse.lumumba@nomargueri.cd');
    }
  };

  // Fermeture de l'overlay login
  const handleCloseLoginModal = () => {
    setTargetPole(null);
    setAuthError(null);
  };

  // ÉTAPE 2 : Soumission de la connexion et vérification RBAC stricte pour le pôle choisi
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPole) return;
    setLoading(true);
    setAuthError(null);

    setTimeout(() => {
      const matched = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase()) || demoAccounts[0];
      const result = loginWithPole(matched, targetPole);

      setLoading(false);
      if (result.success) {
        navigate('/backoffice/dashboard');
      } else {
        setAuthError(result.error || "Accréditation insuffisante pour ce pôle.");
      }
    }, 350);
  };

  const handleSelectDemo = (account: UserSession) => {
    if (!targetPole) return;
    setEmail(account.email);
    setAuthError(null);
    setLoading(true);

    setTimeout(() => {
      const result = loginWithPole(account, targetPole);
      setLoading(false);
      if (result.success) {
        navigate('/backoffice/dashboard');
      } else {
        setAuthError(result.error || "Accréditation insuffisante pour ce pôle.");
      }
    }, 250);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-[#0B132B] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. BARRE SUPÉRIEURE AVEC SÉLECTEUR THÈME LIGHT / DARK                      */}
      {/* ========================================================================= */}
      <header
        className={`h-16 px-4 sm:px-8 border-b flex items-center justify-between transition-colors ${
          isDark
            ? 'bg-[#0F172A] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-3">
          <img
            src="/logo-hospital-nomargueri.jpg"
            alt="Hospital Nomargueri"
            className="w-8 h-8 rounded-full border border-slate-700 object-cover bg-white"
          />
          <div>
            <span className="font-bold text-xs uppercase tracking-wide block">
              HOSPITAL NOMARGUERI
            </span>
            <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Portail Hospitalier & Espace Métier
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Bouton de bascule Light / Dark */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
            title={isDark ? 'Passer en thème clair' : 'Passer en thème sombre'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Mode Clair</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Mode Sombre</span>
              </>
            )}
          </button>

          {/* Lien retour portail public */}
          <a
            href="/"
            className={`px-3 py-1.5 rounded-xl border text-xs transition-colors ${
              isDark
                ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-600'
            }`}
          >
            Portail public
          </a>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. PREMIÈRE PAGE : CHOIX DU CHEMIN ENTRE MORGUE ET FUNÉRARIUM             */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl space-y-8">
          {/* Titre sobre */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider font-mono ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              SECTORISATION OPÉRATIONNELLE
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Sélectionnez votre unité d'activité
            </h1>
            <p className={`text-xs sm:text-sm font-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Choisissez votre chemin pour ouvrir la session de travail et accéder aux fonctionnalités de votre pôle.
            </p>
          </div>

          {/* LES 2 GRANDES CASES : MORGUE & FUNÉRARIUM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ===================================================================== */}
            {/* CASE 1 : MORGUE                                                       */}
            {/* ===================================================================== */}
            <div
              onClick={() => handleChoosePolePath('MORGUE')}
              className={`rounded-2xl p-7 sm:p-8 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-6 shadow-sm border group ${
                isDark
                  ? 'bg-[#0F172A] border-slate-800 hover:border-blue-500/80 hover:bg-[#111C36]'
                  : 'bg-white border-slate-200 hover:border-blue-500/80 hover:bg-blue-50/50 shadow-md'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Pôle Hospitalier
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-900/60">
                    Conservation
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tight uppercase group-hover:text-blue-500 transition-colors">
                    Morgue
                  </h2>
                  <p className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Gestion des corps et conservation frigorifique
                  </p>
                </div>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Prise en charge intégrale dès l'admission : affectation en casier frigorifique, surveillance thermique continue (+2°C à +4°C), soins de thanatopraxie, bracelet d'identification QR Code et levée du corps.
                </p>

                {/* Liste structurée */}
                <div className={`pt-2 border-t space-y-2 text-xs ${isDark ? 'border-slate-800/80 text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Admissions & Identification QR Code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Chambres froides & Capacité des casiers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Soins, thanatopraxie & mouvements internes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Contrôle de sortie et autorisations</span>
                  </div>
                </div>
              </div>

              <div className={`pt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Accéder à la Morgue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* CASE 2 : FUNÉRARIUM                                                   */}
            {/* ===================================================================== */}
            <div
              onClick={() => handleChoosePolePath('FUNERARIUM')}
              className={`rounded-2xl p-7 sm:p-8 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-6 shadow-sm border group ${
                isDark
                  ? 'bg-[#0F172A] border-slate-800 hover:border-emerald-500/80 hover:bg-[#0F2220]'
                  : 'bg-white border-slate-200 hover:border-emerald-500/80 hover:bg-emerald-50/50 shadow-md'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Pôle Cérémonial
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-900/60">
                    Familles
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tight uppercase group-hover:text-emerald-500 transition-colors">
                    Funérarium
                  </h2>
                  <p className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Prestations, veillées et accompagnement des proches
                  </p>
                </div>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Coordination du recueillement : réservation de salons funéraires avec calendrier en direct, conciergerie et traiteur, mémorial numérique, boutique d'articles funéraires et transport corbillard.
                </p>

                {/* Liste structurée */}
                <div className={`pt-2 border-t space-y-2 text-xs ${isDark ? 'border-slate-800/80 text-slate-300' : 'border-slate-100 text-slate-700'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Salons de recueillement & Veillées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Conciergerie, traiteur & mémorial en ligne</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Boutique d'articles, cercueils & fleurs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Logistique corbillard & géolocalisation</span>
                  </div>
                </div>
              </div>

              <div className={`pt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 group-hover:bg-emerald-600 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Accéder au Funérarium</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. MODALE D'AUTHENTIFICATION EN OVERLAY (SE DÉCLENCHE APRÈS LE CLIC PÔLE)  */}
      {/* ========================================================================= */}
      {targetPole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div
            className={`relative rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 border ${
              isDark
                ? 'bg-[#0F172A] border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}
          >
            {/* Bouton fermeture */}
            <button
              type="button"
              onClick={handleCloseLoginModal}
              className={`absolute right-5 top-5 p-1 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* En-tête de la modale de login */}
            <div className="text-center space-y-2">
              <img
                src="/logo-hospital-nomargueri.jpg"
                alt="Hospital Nomargueri"
                className="w-14 h-14 rounded-full border border-slate-700 mx-auto object-cover bg-white shadow-sm"
              />
              <div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                  targetPole === 'MORGUE' ? 'text-blue-500' : 'text-emerald-500'
                }`}>
                  {targetPole === 'MORGUE' ? 'Pôle Morgue & Conservation' : 'Pôle Funérarium & Cérémonies'}
                </span>
                <h2 className="text-lg font-bold tracking-tight uppercase">
                  Connexion Session Sécurisée
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Seul le personnel accrédité de ce pôle ou le Super Admin est autorisé.
                </p>
              </div>
            </div>

            {/* Message d'erreur de restriction d'accès RBAC */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>Accès refusé pour ce pôle</span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-200/90 pl-6">
                  {authError}
                </p>
              </div>
            )}

            {/* Formulaire de Connexion */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className={`block font-medium text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Identifiant / E-mail professionnel
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors border ${
                    isDark
                      ? 'bg-[#0B132B] border-slate-700 text-white focus:border-sky-500 focus:ring-sky-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="nom@nomargueri.cd"
                />
              </div>

              <div className="space-y-1.5">
                <label className={`block font-medium text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors border ${
                    isDark
                      ? 'bg-[#0B132B] border-slate-700 text-white focus:border-sky-500 focus:ring-sky-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 text-white rounded-xl font-semibold text-xs tracking-wide transition-colors shadow-sm disabled:opacity-50 ${
                  targetPole === 'MORGUE'
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-emerald-700 hover:bg-emerald-600'
                }`}
              >
                {loading
                  ? 'Vérification des accréditations...'
                  : `Se connecter au Pôle ${targetPole === 'MORGUE' ? 'Morgue' : 'Funérarium'}`}
              </button>
            </form>

            {/* Profils de démonstration avec affichage de leurs droits réels */}
            <div className={`pt-4 border-t space-y-2.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-[11px] font-medium block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Comptes de test pour vérifier les restrictions d'accès :
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {demoAccounts.map((acc) => {
                  const isUniversal = acc.directionRattachee === 'DIRECTION_GENERALE' || acc.directionRattachee === 'CAISSE_CENTRALE';
                  const isAllowed = isUniversal || (targetPole === 'MORGUE' && acc.directionRattachee === 'DIRECTION_MORGUE') || (targetPole === 'FUNERARIUM' && acc.directionRattachee === 'DIRECTION_FUNERARIUM');

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectDemo(acc)}
                      className={`p-2.5 rounded-xl text-left transition-colors border flex flex-col justify-between ${
                        isDark
                          ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div>
                        <span className="font-bold block truncate text-xs">
                          {acc.prenom} {acc.nom}
                        </span>
                        <span className={`text-[10px] block truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {acc.role.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-mono mt-1 px-1.5 py-0.5 rounded w-fit ${
                          isAllowed
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                            : 'bg-red-950 text-red-300 border border-red-800/80'
                        }`}
                      >
                        {isUniversal
                          ? 'Super Admin (Tout accès)'
                          : isAllowed
                          ? 'Accès Autorisé'
                          : 'Bloqué pour ce pôle'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleCloseLoginModal}
                className={`text-[11px] transition-colors underline ${
                  isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Annuler et choisir un autre pôle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
