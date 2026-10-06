import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Flower2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ThermometerSnowflake,
  CalendarDays,
  FileSpreadsheet,
  Users,
  Coins
} from 'lucide-react';
import { useBackoffice, PoleMetier } from '../../context/BackofficeContext';

export const PoleSelectPage: React.FC = () => {
  const { currentUser, setCurrentPole } = useBackoffice();
  const navigate = useNavigate();

  const handleSelectPole = (pole: PoleMetier) => {
    setCurrentPole(pole);
    navigate('/backoffice/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#040C1D] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* En-tête officiel */}
      <div className="text-center space-y-3 max-w-2xl mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-[11px] text-sky-300 font-mono">
          <span>NOMARGUÉRRIE • PLATEFORME DE GESTION</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          2. ACCUEIL — Que voulez-vous gérer ?
        </h1>

        <p className="text-xs sm:text-sm text-slate-300">
          Bienvenue <strong>{currentUser?.prenom} {currentUser?.nom}</strong> ({currentUser?.role}).
          Sélectionnez le pôle opérationnel pour accéder à votre tableau de bord et à vos outils métiers.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* LES 2 GRANDES CASES MAJEURES : MORGUE & FUNÉRARIUM (NORMA.JPEG)           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl w-full">
        {/* ========================================================================= */}
        {/* CASE 1 : MORGUE (Gestion des corps et de la morgue)                      */}
        {/* ========================================================================= */}
        <div
          onClick={() => handleSelectPole('MORGUE')}
          className="group relative bg-gradient-to-b from-[#091E48] to-[#05112B] border-2 border-blue-700/80 hover:border-sky-400 rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div className="space-y-5">
            {/* Header carte */}
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-105 transition-transform">
                <Building2 className="w-8 h-8 text-sky-200" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-blue-900/60 text-sky-300 border border-blue-700">
                Pôle Hospitalier
              </span>
            </div>

            {/* Titre & Description principale */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-sky-300 transition-colors uppercase tracking-tight">
                MORGUE
              </h2>
              <p className="text-sm font-semibold text-sky-200 mt-1">
                Gestion des corps et de la morgue
              </p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Parcours complet de l'arrivée du corps à la sortie définitive : admissions, chambres froides & casiers, séjour, médico-légal et autorisations.
              </p>
            </div>

            {/* Étapes clés du parcours Morgue (Norma.jpeg) */}
            <div className="bg-[#030915]/70 rounded-2xl p-4 border border-blue-950/80 space-y-2 text-xs">
              <span className="text-[10px] text-sky-400 uppercase font-bold tracking-wider block">
                Parcours Morgue (Arrivée ➔ Sortie) :
              </span>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>1. Nouvelle admission & identités</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>2. Chambre froide & casiers frigorifiques</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>3. Soins thanatopraxie, toilette & mouvements</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>4. Contrôle de sortie & levée du corps</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bouton CTA */}
          <div className="pt-6 mt-6 border-t border-blue-900/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-300">
              Ouvrir le Dashboard Morgue
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-md">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CASE 2 : FUNÉRARIUM (Prestations et organisation des funérailles)        */}
        {/* ========================================================================= */}
        <div
          onClick={() => handleSelectPole('FUNERARIUM')}
          className="group relative bg-gradient-to-b from-[#06241B] to-[#03130E] border-2 border-emerald-700/80 hover:border-emerald-400 rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-600/30 hover:-translate-y-1 flex flex-col justify-between"
        >
          <div className="space-y-5">
            {/* Header carte */}
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 group-hover:scale-105 transition-transform">
                <Flower2 className="w-8 h-8 text-emerald-200" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                Pôle Cérémonies
              </span>
            </div>

            {/* Titre & Description principale */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-300 transition-colors uppercase tracking-tight">
                FUNÉRARIUM
              </h2>
              <p className="text-sm font-semibold text-emerald-200 mt-1">
                Prestations et organisation des funérailles
              </p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Des prestations funéraires à la clôture : réservation de salons de recueillement, corbillard, fleurs, cercueils, facturation et jour des funérailles.
              </p>
            </div>

            {/* Étapes clés du parcours Funéraire (Norma.jpeg) */}
            <div className="bg-[#020A07]/70 rounded-2xl p-4 border border-emerald-950/80 space-y-2 text-xs">
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">
                Parcours Funéraire (Prestations ➔ Clôture) :
              </span>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>1. Nouvelle demande & contact famille</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>2. Choix des prestations & réservations salons</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>3. Axe transport, corbillard & conciergerie</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>4. Devis, encaissement & jour des funérailles</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bouton CTA */}
          <div className="pt-6 mt-6 border-t border-emerald-900/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">
              Ouvrir le Dashboard Funérarium
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shadow-md">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Bloc explicatif commun : Dossier Unique & Transversalité */}
      <div className="mt-8 sm:mt-10 max-w-4xl w-full bg-[#071329] border border-blue-950 rounded-2xl p-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sky-300">
          <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Dossier Unique du Défunt partagé entre Morgue et Funérarium (NG-2026-XXXX)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Facturation & Caisse commune</span>
          <span>•</span>
          <span>Rapports unifiés</span>
        </div>
      </div>
    </div>
  );
};
