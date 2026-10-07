import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackoffice, PoleMetier } from '../../context/BackofficeContext';

export const PoleSelectPage: React.FC = () => {
  const { currentUser, setCurrentPole, logout } = useBackoffice();
  const navigate = useNavigate();

  const handleSelectPole = (pole: PoleMetier) => {
    setCurrentPole(pole);
    // Redirection directe vers le tableau de bord du pôle choisi
    navigate('/backoffice/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/backoffice/login');
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans">
      {/* Barre supérieure institutionnelle sobre */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0F172A]/90 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/logo-hospital-nomargueri.jpg"
            alt="Hospital Nomargueri"
            className="w-8 h-8 rounded-full border border-slate-700 object-cover bg-white"
          />
          <div>
            <span className="font-bold text-xs uppercase tracking-wide text-white block">
              HOSPITAL NOMARGUERI
            </span>
            <span className="text-[10px] text-slate-400 block">
              Portail Hospitalier & Espace Métier
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          {currentUser && (
            <div className="text-right hidden sm:block">
              <span className="font-medium text-slate-200 block text-xs">
                {currentUser.prenom} {currentUser.nom}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {currentUser.role.replace(/_/g, ' ')}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal : Sélection des 2 pôles (Morgue ou Funérarium) */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl space-y-8">
          {/* Titre et consignes épurés */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              SECTORISATION OPÉRATIONNELLE
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Sélectionnez votre unité d'activité
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Veuillez choisir le pôle pour accéder au tableau de bord et aux fonctionnalités adaptées à votre intervention.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* LES 2 GRANDES CASES : MORGUE & FUNÉRARIUM (DESIGN SOFT & SANS SURCHARGE)  */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ===================================================================== */}
            {/* CASE 1 : MORGUE                                                       */}
            {/* ===================================================================== */}
            <div
              onClick={() => handleSelectPole('MORGUE')}
              className="bg-[#0F172A] border border-slate-800 hover:border-blue-500/70 hover:bg-[#111C36] rounded-2xl p-7 sm:p-8 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-6 shadow-sm group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Pôle Hospitalier
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-900/60">
                    Conservation
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-sky-300 transition-colors uppercase tracking-tight">
                    Morgue
                  </h2>
                  <p className="text-xs font-medium text-slate-300 mt-1">
                    Gestion des corps et conservation frigorifique
                  </p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Prise en charge dès l'admission : affectation en casier frigorifique, surveillance thermique continue (+2°C à +4°C), soins de thanatopraxie, bracelet d'identification QR Code et levée du corps.
                </p>

                {/* Liste structurée sobre sans icônes superflues */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Admissions & Identification QR Code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Gestion des chambres froides et casiers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Soins, toilette rituelle & mouvements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Autorisations et levée définitive du corps</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white font-medium text-xs transition-colors"
                >
                  Accéder au Pôle Morgue ➔
                </button>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* CASE 2 : FUNÉRARIUM                                                   */}
            {/* ===================================================================== */}
            <div
              onClick={() => handleSelectPole('FUNERARIUM')}
              className="bg-[#0F172A] border border-slate-800 hover:border-emerald-500/70 hover:bg-[#0F2220] rounded-2xl p-7 sm:p-8 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-6 shadow-sm group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Pôle Cérémonial
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-900/60">
                    Familles
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors uppercase tracking-tight">
                    Funérarium
                  </h2>
                  <p className="text-xs font-medium text-slate-300 mt-1">
                    Prestations, veillées et accompagnement des proches
                  </p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Coordination du recueillement : réservation de salons funéraires avec calendrier en direct, conciergerie et traiteur, mémorial numérique, boutique d'articles funéraires et transport corbillard.
                </p>

                {/* Liste structurée sobre sans icônes superflues */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Salons de recueillement & Veillées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Conciergerie, traiteur & mémorial en ligne</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Boutique d'articles, cercueils & fleurs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Axe transport, corbillard & géolocalisation</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 group-hover:bg-emerald-600 text-white font-medium text-xs transition-colors"
                >
                  Accéder au Pôle Funérarium ➔
                </button>
              </div>
            </div>
          </div>

          {/* Note d'information transverse */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400 font-normal">
              Dossier défunt unique • Caisse centrale et facturation unifiées entre la morgue et le funérarium
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
