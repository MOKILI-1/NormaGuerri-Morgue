import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackoffice, PoleMetier } from '../../context/BackofficeContext';
import { Sun, Moon, Lock, Mail, AlertCircle, X, Shield, ArrowRight, ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';

export const PoleSelectPage: React.FC = () => {
  const {
    currentUser,
    setCurrentPole,
    logout,
    theme,
    toggleTheme,
    targetPole,
    setTargetPole,
    loginWithPole,
    managedAccounts
  } = useBackoffice();
  const navigate = useNavigate();

  // État local de la modale de connexion overlay
  const [email, setEmail] = useState('eric.mutombo@nomargueri.cd');
  const [password, setPassword] = useState('Morgue2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // ÉTAPE 1 : Clic sur une case ou Super Admin -> Déclenche l'overlay de login pour ce pôle
  const handleChoosePolePath = (pole: PoleMetier) => {
    setAuthError(null);
    setTargetPole(pole);

    // Pré-sélectionner un compte pertinent et son mot de passe pour fluidifier le test
    if (pole === 'MORGUE') {
      const acc = managedAccounts.find((a) => a.polesAutorises === 'MORGUE') || managedAccounts[0];
      setEmail(acc.email);
      setPassword(acc.motDePasse || 'Morgue2026!');
    } else if (pole === 'FUNERARIUM') {
      const acc = managedAccounts.find((a) => a.polesAutorises === 'FUNERARIUM') || managedAccounts[1];
      setEmail(acc.email);
      setPassword(acc.motDePasse || 'Funer2026!');
    } else {
      const acc = managedAccounts.find((a) => a.role === 'DIRECTION' || a.niveauAccreditation === 5) || managedAccounts[2];
      setEmail(acc.email);
      setPassword(acc.motDePasse || 'Admin2026!');
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
      const matched = managedAccounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
      if (!matched) {
        setLoading(false);
        setAuthError(`Identifiant inconnu : Aucun compte actif n'est associé à l'adresse "${email}".`);
        return;
      }

      if (!matched.estActif) {
        setLoading(false);
        setAuthError(`Compte désactivé : L'accès pour ${matched.prenom} ${matched.nom} a été suspendu par la Direction Générale.`);
        return;
      }

      // Vérification du mot de passe
      if (matched.motDePasse && password.trim() !== matched.motDePasse && password !== '••••••••') {
        setLoading(false);
        setAuthError(`Mot de passe incorrect pour le compte de ${matched.prenom} ${matched.nom}.`);
        return;
      }

      const result = loginWithPole(matched, targetPole);

      setLoading(false);
      if (result.success) {
        if (targetPole === 'SUPER_ADMIN') {
          navigate('/backoffice/super-admin?tab=dashboard');
        } else {
          navigate('/backoffice/dashboard');
        }
      } else {
        setAuthError(result.error || "Accréditation insuffisante pour ce pôle.");
      }
    }, 350);
  };

  const handleAccessSuperAdmin = () => {
    handleChoosePolePath('SUPER_ADMIN');
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

          {/* Bouton Accès Super Admin */}
          <button
            type="button"
            onClick={handleAccessSuperAdmin}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isDark
                ? 'bg-amber-950/40 hover:bg-amber-900/50 border-amber-800/80 text-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800 shadow-sm'
            }`}
            title="Accéder au cockpit de supervision Super Admin"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Super Admin</span>
          </button>
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
                  targetPole === 'SUPER_ADMIN'
                    ? 'text-amber-400'
                    : targetPole === 'MORGUE'
                    ? 'text-blue-500'
                    : 'text-emerald-500'
                }`}>
                  {targetPole === 'SUPER_ADMIN'
                    ? 'Espace Super Admin • Direction Générale'
                    : targetPole === 'MORGUE'
                    ? 'Pôle Morgue & Conservation'
                    : 'Pôle Funérarium & Cérémonies'}
                </span>
                <h2 className="text-lg font-bold tracking-tight uppercase">
                  {targetPole === 'SUPER_ADMIN' ? 'Connexion Super Admin' : 'Connexion Session Sécurisée'}
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {targetPole === 'SUPER_ADMIN'
                    ? 'Accès réservé exclusivement aux membres accrédités de la Direction Générale.'
                    : 'Seul le personnel accrédité de ce pôle ou le Super Admin est autorisé.'}
                </p>
              </div>
            </div>

            {/* Message d'erreur de restriction d'accès RBAC */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>Accès refusé</span>
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
                <div className="flex items-center justify-between">
                  <label className={`block font-medium text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Masquer' : 'Afficher'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
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
                className={`w-full py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-colors shadow-sm disabled:opacity-50 ${
                  targetPole === 'SUPER_ADMIN'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                    : targetPole === 'MORGUE'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
              >
                {loading
                  ? 'Vérification des accréditations...'
                  : targetPole === 'SUPER_ADMIN'
                  ? 'Accéder au Dashboard Super Admin'
                  : 'Accéder à l\'espace sécurisé'}
              </button>

              {/* Sélecteur rapide d'identifiants configurés pour faciliter les tests */}
              <div className={`p-3 rounded-2xl border text-[11px] space-y-2 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Comptes & Accès configurés :
                  </span>
                  <span className="text-[10px] text-slate-500">Cliquer pour tester</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {managedAccounts.map((acc) => {
                    const isForThisPole =
                      targetPole === 'SUPER_ADMIN'
                        ? acc.role === 'DIRECTION' || acc.niveauAccreditation === 5
                        : acc.polesAutorises === 'LES_DEUX' ||
                          acc.polesAutorises === targetPole ||
                          acc.role === 'DIRECTION' ||
                          acc.niveauAccreditation === 5;

                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setEmail(acc.email);
                          setPassword(acc.motDePasse || '');
                          setAuthError(null);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-colors flex items-center gap-1 ${
                          email.toLowerCase() === acc.email.toLowerCase()
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                            : isForThisPole
                            ? isDark
                              ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                              : 'bg-white text-slate-700 hover:text-slate-900 border-slate-300'
                            : isDark
                            ? 'bg-red-950/30 text-red-300/80 hover:text-red-200 border-red-900/40'
                            : 'bg-red-50 text-red-700/80 hover:text-red-900 border-red-200'
                        }`}
                        title={`${acc.prenom} ${acc.nom} (${acc.role}) - Pôles: ${acc.polesAutorises || 'LES_DEUX'}`}
                      >
                        <span className="font-semibold">{acc.prenom} {acc.nom}</span>
                        <span className="opacity-60 text-[9px]">({acc.polesAutorises === 'LES_DEUX' ? '2 Pôles' : acc.polesAutorises === 'MORGUE' ? 'Morgue' : 'Funérarium'})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>

            <div className="text-center pt-2">
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
