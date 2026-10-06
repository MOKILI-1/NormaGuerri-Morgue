import React, { useState } from 'react';
import { DossierVivant } from '@nomarguerrie/shared-types';
import { ShieldCheck, X, Clock, PhoneCall, FileText, Search, QrCode, CheckCircle2, Check } from 'lucide-react';

interface FamilleSuiviModalProps {
  dossier: DossierVivant | null;
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (ref: string) => void;
}

export const FamilleSuiviModal: React.FC<FamilleSuiviModalProps> = ({
  dossier,
  isOpen,
  onClose,
  onSearch
}) => {
  const [searchInput, setSearchInput] = useState('');

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim() || !onSearch) return;
    onSearch(searchInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#0A1A3E] border border-blue-900/80 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/logo-hospital-nomargueri.jpg"
              alt="Hospital Nomargueri"
              className="w-11 h-11 rounded-full border border-sky-400 shadow object-cover bg-white shrink-0"
            />
            <div>
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">
                Hospital Nomargueri • Suivi Famille
              </span>
              <h2 className="text-lg font-bold text-white">
                {dossier ? `Dossier ${dossier.numeroDossier}` : 'Vérifier un Dossier'}
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

        {/* Barre de recherche intégrée */}
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            {dossier ? 'Vérifier une autre référence' : 'Saisissez votre numéro de dossier ou jeton QR'}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: #NMG-2026-002581 ou QR-XXXXX"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#061126] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
            >
              Vérifier
            </button>
          </div>
        </form>

        {dossier ? (
          <>
            {/* Informations Défunt */}
            <div className="bg-[#061126] rounded-xl p-4 border border-blue-900/60 space-y-2 text-xs">
              <div className="text-sky-300 uppercase font-semibold text-[10px] flex items-center justify-between">
                <span>Identité du Défunt</span>
                <span className="font-mono text-sky-400 font-bold">{dossier.numeroDossier}</span>
              </div>
              <p className="text-base font-bold text-white">
                {dossier.defunt.prenom} {dossier.defunt.nom}
              </p>
              <div className="flex flex-wrap gap-4 text-slate-300 pt-1">
                <span>Sexe : <strong className="text-white">{dossier.defunt.sexe}</strong></span>
                <span>Date décès : <strong className="text-white">{dossier.defunt.dateDeces}</strong></span>
                <span>Lieu : <strong className="text-white">{dossier.defunt.lieuDeces}</strong></span>
              </div>
            </div>

            {/* Statut d'Avancement du Parcours */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                État Actuel de la Prise en Charge
              </span>

              <div className="bg-[#061126] rounded-xl p-3 border border-blue-900/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {dossier.statut === 'DEMANDE' && 'Demande en ligne enregistrée'}
                    {dossier.statut === 'EN_ATTENTE_ADMISSION' && 'En attente d’admission à la morgue'}
                    {dossier.statut === 'ADMIS' && 'Dossier admis • Prise en charge officielle'}
                    {dossier.statut === 'EN_CONSERVATION' && 'En conservation frigorifique sécurisée'}
                    {dossier.statut === 'EN_PREPARATION' && 'Soins de thanatopraxie et toilette'}
                    {dossier.statut === 'CONTROLE_EN_COURS' && 'Contrôle réglementaire et vérifications'}
                    {dossier.statut === 'AUTORISATION_VALIDEE' && 'Autorisation accordée • Prêt pour levée'}
                    {dossier.statut === 'SORTI' && 'Levée du corps effectuée'}
                    {dossier.statut === 'ARCHIVE' && 'Dossier archivé'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Prochaine étape : {dossier.indicateurs.prochaineActionAttendue}
                  </p>
                </div>
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/60 text-sky-300 border border-sky-400/30">
                  {dossier.statut}
                </span>
              </div>
            </div>

            {/* Prestations Funéraires en Cours */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                Prestations & Soins Rattachés au Dossier
              </span>

              <div className="bg-[#061126] rounded-xl p-3 border border-blue-900/60 space-y-1.5 max-h-40 overflow-y-auto">
                {dossier.prestations.map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-xs text-slate-300 py-1 border-b border-blue-950/60 last:border-0">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-sky-400" />
                      {p.titre}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-sky-300 font-mono">
                      {p.statut}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6 px-4 bg-[#061126] rounded-xl border border-blue-900/60 text-xs text-slate-400 space-y-2">
            <QrCode className="w-8 h-8 mx-auto text-sky-400 opacity-60" />
            <p>
              Entrez le numéro unique figurant sur votre récépissé d'admission ou scannez votre jeton pour visualiser l'état du dossier et le suivi des soins.
            </p>
          </div>
        )}

        {/* Assistance Famille 24/7 */}
        <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3 text-xs flex items-center justify-between text-sky-200">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-sky-400" />
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
