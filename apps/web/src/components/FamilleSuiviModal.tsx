import React from 'react';
import { DossierVivant } from '@nomarguerrie/shared-types';
import { ShieldCheck, X, Clock, PhoneCall, FileText } from 'lucide-react';

interface FamilleSuiviModalProps {
  dossier: DossierVivant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FamilleSuiviModal: React.FC<FamilleSuiviModalProps> = ({
  dossier,
  isOpen,
  onClose
}) => {
  if (!isOpen || !dossier) return null;

  const solde = dossier.finance.soldeRestant;
  const total = dossier.finance.totalPrestations;
  const paye = dossier.finance.totalPaye;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                Suivi Sécurisé Famille
              </span>
              <h2 className="text-lg font-bold text-white">
                Dossier {dossier.numeroDossier}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informations Défunt */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-2 text-xs">
          <div className="text-slate-400 uppercase font-semibold text-[10px]">Identité du Défunt</div>
          <p className="text-base font-bold text-white">
            {dossier.defunt.prenom} {dossier.defunt.nom}
          </p>
          <div className="flex flex-wrap gap-4 text-slate-300 pt-1">
            <span>Sexe : <strong>{dossier.defunt.sexe}</strong></span>
            <span>Date décès : <strong>{dossier.defunt.dateDeces}</strong></span>
            <span>Lieu : <strong>{dossier.defunt.lieuDeces}</strong></span>
          </div>
        </div>

        {/* Statut d'Avancement du Parcours */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            État Actuel de la Prise en Charge
          </span>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                {dossier.statut === 'DEMANDE' && 'Demande enregistrée • En cours de traitement'}
                {dossier.statut === 'EN_ATTENTE_ADMISSION' && 'En attente d’arrivée à la morgue'}
                {dossier.statut === 'ADMIS' && 'Dossier admis • En attente d’affectation'}
                {dossier.statut === 'EN_CONSERVATION' && 'En conservation sécurisée'}
                {dossier.statut === 'EN_PREPARATION' && 'Soins et thanatopraxie en cours'}
                {dossier.statut === 'CONTROLE_EN_COURS' && 'Contrôle et vérifications réglementaires'}
                {dossier.statut === 'AUTORISATION_VALIDEE' && 'Autorisation accordée • Prêt pour levée'}
                {dossier.statut === 'SORTI' && 'Levée du corps effectuée'}
                {dossier.statut === 'ARCHIVE' && 'Dossier archivé'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Prochaine étape : {dossier.indicateurs.prochaineActionAttendue}
              </p>
            </div>
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {dossier.statut}
            </span>
          </div>
        </div>

        {/* Situation Financière Transparente */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Situation Financière Transparente
          </span>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Total Prestations</span>
              <span className="font-bold text-white">{total.toLocaleString()} $</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Déjà Réglé</span>
              <span className="font-bold text-emerald-400">{paye.toLocaleString()} $</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Solde Dû</span>
              <span className={`font-bold ${solde > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {solde.toLocaleString()} $
              </span>
            </div>
          </div>
        </div>

        {/* Assistance Famille 24/7 */}
        <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-3 text-xs flex items-center justify-between text-blue-200">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-blue-400" />
            <span>Assistance téléphonique familles :</span>
          </div>
          <span className="font-bold text-white">+243 81 000 0000</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
        >
          Fermer la Consultation
        </button>
      </div>
    </div>
  );
};
