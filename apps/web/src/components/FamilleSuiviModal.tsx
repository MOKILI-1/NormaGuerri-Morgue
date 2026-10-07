import React, { useState, useEffect, useMemo } from 'react';
import { DossierVivant } from '@nomarguerrie/shared-types';
import {
  X,
  Search,
  Calendar,
  MapPin,
  ArrowLeft,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';

interface FamilleSuiviModalProps {
  dossier: DossierVivant | null;
  dossiers?: DossierVivant[];
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (ref: string) => void;
  onSelectDossier?: (dossier: DossierVivant) => void;
  initialMode?: 'DEFUNT' | 'DOSSIER';
}

export const FamilleSuiviModal: React.FC<FamilleSuiviModalProps> = ({
  dossier,
  dossiers = [],
  isOpen,
  onClose,
  onSearch,
  onSelectDossier,
  initialMode = 'DEFUNT'
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedDossier, setSelectedDossier] = useState<DossierVivant | null>(dossier);
  const [activeMode, setActiveMode] = useState<'DEFUNT' | 'DOSSIER'>(initialMode);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setSelectedDossier(dossier);
    if (!dossier) {
      setSearchInput('');
      setHasSearched(false);
    }
  }, [dossier, isOpen]);

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode, isOpen]);

  // Filtrage réactif des défunts
  const matchingDossiers = useMemo(() => {
    const term = searchInput.trim().toLowerCase();
    if (!term) return [];
    return dossiers.filter((d) => {
      const nom = d.defunt.nom.toLowerCase();
      const prenom = d.defunt.prenom.toLowerCase();
      const postnom = (d.defunt.postnom || '').toLowerCase();
      const fullName1 = `${prenom} ${nom}`;
      const fullName2 = `${nom} ${prenom}`;
      const numDossier = d.numeroDossier.toLowerCase();
      const numClean = d.numeroDossier.toLowerCase().replace('#', '');
      const qr = d.qrCodeToken.toLowerCase();

      return (
        nom.includes(term) ||
        prenom.includes(term) ||
        postnom.includes(term) ||
        fullName1.includes(term) ||
        fullName2.includes(term) ||
        numDossier.includes(term) ||
        numClean.includes(term) ||
        qr.includes(term)
      );
    });
  }, [dossiers, searchInput]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchInput.trim();
    if (!term) return;
    setHasSearched(true);

    if (matchingDossiers.length === 1) {
      setSelectedDossier(matchingDossiers[0]);
      if (onSelectDossier) onSelectDossier(matchingDossiers[0]);
      return;
    }

    if (onSearch && matchingDossiers.length === 0) {
      onSearch(term);
    }
  };

  const handleSelectOne = (d: DossierVivant) => {
    setSelectedDossier(d);
    if (onSelectDossier) onSelectDossier(d);
  };

  const handleBackToSearch = () => {
    setSelectedDossier(null);
  };

  // Détermination du statut général de localisation (sans numéro de case frigorifique pour raisons de sécurité et de décence)
  const getLocalisationGenerale = (statut: string) => {
    switch (statut) {
      case 'SORTI':
      case 'ARCHIVE':
        return 'Inhumé / Levée effectuée';
      case 'CONTROLE_EN_COURS':
      case 'AUTORISATION_VALIDEE':
        return 'Transféré vers salon de présentation';
      case 'ADMIS':
      case 'EN_CONSERVATION':
      case 'EN_PREPARATION':
      default:
        return 'En chambre funéraire';
    }
  };

  // Statut administratif du dossier pour le mode Suivi de dossier
  const getStatutDossierBadge = (statut: string) => {
    switch (statut) {
      case 'DEMANDE':
        return { label: 'Dossier Introduit', style: 'bg-blue-900/60 text-sky-300 border-blue-700' };
      case 'EN_ATTENTE_ADMISSION':
        return { label: 'En attente de validation', style: 'bg-amber-900/60 text-amber-300 border-amber-700' };
      case 'ADMIS':
      case 'EN_CONSERVATION':
      case 'EN_PREPARATION':
      case 'AUTORISATION_VALIDEE':
        return { label: 'Validé & Pris en charge', style: 'bg-emerald-900/60 text-emerald-300 border-emerald-700' };
      case 'SORTI':
        return { label: 'Clôturé (Levée effectuée)', style: 'bg-purple-900/60 text-purple-300 border-purple-700' };
      default:
        return { label: 'En traitement', style: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-[#0A1A3E] border border-blue-900/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {/* En-tête Modal */}
        <div className="flex items-start justify-between border-b border-blue-950/80 pb-4">
          <div className="flex items-center space-x-3">
            <img
              src="/logo-hospital-nomargueri.jpg"
              alt="Hospital Nomargueri"
              className="w-12 h-12 rounded-full border border-sky-400 shadow object-cover bg-white shrink-0"
            />
            <div>
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">
                Hospital Nomargueri • Portail Public
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {selectedDossier
                  ? `Fiche Défunt • ${selectedDossier.defunt.prenom} ${selectedDossier.defunt.nom}`
                  : activeMode === 'DOSSIER'
                  ? 'Suivre un dossier funéraire'
                  : 'Trouver un défunt'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VUE 1 : FORMULAIRE DE RECHERCHE GRAND FORMAT & ÉPURÉ (SANS DÉFUNTS PAR DÉFAUT) */}
        {/* ========================================================================= */}
        {!selectedDossier ? (
          <div className="space-y-6">
            {/* Onglets doux pour basculer entre Trouver un défunt et Suivre un dossier */}
            <div className="flex border-b border-blue-950 pb-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('DEFUNT');
                  setSelectedDossier(null);
                }}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeMode === 'DEFUNT'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-[#061126] text-slate-300 hover:text-white border border-blue-900/60'
                }`}
              >
                Trouver un défunt
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode('DOSSIER');
                  setSelectedDossier(null);
                }}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeMode === 'DOSSIER'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-[#061126] text-slate-300 hover:text-white border border-blue-900/60'
                }`}
              >
                Suivre un dossier
              </button>
            </div>

            {/* Formulaire de recherche agrandi avec UX améliorée */}
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <label className="block text-xs font-semibold text-slate-200">
                {activeMode === 'DOSSIER'
                  ? 'Saisissez le numéro de dossier (ex: #NMG-2026-002581) ou le nom de famille :'
                  : 'Saisissez le nom, postnom ou prénom de la personne décédée :'}
              </label>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={
                      activeMode === 'DOSSIER'
                        ? 'Ex: #NMG-2026-002581 ou Kasanda...'
                        : 'Ex: KASANDA, Patient, Henriette...'
                    }
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setHasSearched(false);
                    }}
                    className="w-full pl-11 pr-10 py-3 bg-[#061126] border border-blue-900 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-inner"
                    autoFocus
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        setHasSearched(false);
                      }}
                      className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                {activeMode === 'DOSSIER'
                  ? 'Permet de vérifier en temps réel si votre dossier a été introduit, s’il est validé ou en attente.'
                  : 'Ce niveau d’information publique sert à l’orientation des visiteurs et aux proches pour l’organisation des funérailles.'}
              </p>
            </form>

            {/* ===================================================================== */}
            {/* RÉSULTATS DE LA RECHERCHE (Aucun défunt affiché avant la recherche)    */}
            {/* ===================================================================== */}
            {searchInput.trim().length > 0 ? (
              <div className="space-y-3 pt-2 border-t border-blue-950">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold">
                    {matchingDossiers.length} résultat{matchingDossiers.length > 1 ? 's' : ''} trouvé{matchingDossiers.length > 1 ? 's' : ''}
                  </span>
                  {matchingDossiers.length > 0 && (
                    <span className="text-[11px] text-sky-400">Cliquez pour afficher les informations publiques</span>
                  )}
                </div>

                {matchingDossiers.length > 0 ? (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {matchingDossiers.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => handleSelectOne(d)}
                        className="p-4 rounded-2xl bg-[#061126] hover:bg-slate-900 border border-blue-900/80 hover:border-sky-400 cursor-pointer transition-all space-y-2 group shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-white text-base group-hover:text-sky-300 transition-colors">
                              {d.defunt.prenom} {d.defunt.nom} {d.defunt.postnom ? ` ${d.defunt.postnom}` : ''}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <span>Décès : {new Date(d.defunt.dateDeces).toLocaleDateString('fr-FR')}</span>
                              <span>•</span>
                              <span>Lieu : {d.defunt.lieuDeces}</span>
                            </div>
                          </div>

                          <span className="font-mono text-xs text-sky-300 font-bold bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-900">
                            {d.numeroDossier}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-blue-950">
                          <span className="text-slate-300 text-[11px] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                            Localisation : {getLocalisationGenerale(d.statut)}
                          </span>
                          <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform flex items-center text-xs font-semibold">
                            Consulter ➔
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-blue-950 text-center space-y-2 text-xs text-slate-300">
                    <AlertCircle className="w-7 h-7 text-amber-400 mx-auto" />
                    <p className="font-bold text-white text-sm">
                      Aucun enregistrement trouvé pour « {searchInput} »
                    </p>
                    <p className="text-slate-400 max-w-md mx-auto text-xs leading-relaxed">
                      Vérifiez l’orthographe ou contactez l'accueil au <strong>+243 997 222 228 / +243 833 330 040</strong>.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Panneau d'orientation initial (SANS aucun nom de défunt affiché) */
              <div className="p-5 rounded-2xl bg-[#061126]/60 border border-blue-950 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2 text-sky-300 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Cadre officiel de consultation et de confidentialité</span>
                </div>
                <p className="leading-relaxed">
                  Pour préserver la décence et la sérénité des familles, les informations publiques (horaires de recueillement, levée de corps et orientation des proches) sont consultables uniquement par recherche nominative ou référence de dossier.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VUE 2 : INFORMATIONS PUBLIQUES STRICTES (CONFORMES AUX 4 POINTS DEMANDÉS) */
          /* ========================================================================= */
          <div className="space-y-5">
            <button
              onClick={handleBackToSearch}
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Effectuer une autre recherche</span>
            </button>

            {/* 1. IDENTITÉ DU DÉFUNT */}
            <div className="bg-[#061126] rounded-2xl p-5 border border-blue-900/80 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-950 border-2 border-sky-400 flex items-center justify-center text-sky-200 font-bold text-base shadow">
                    {selectedDossier.defunt.prenom[0]}
                    {selectedDossier.defunt.nom[0]}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block">
                      1. Identité du Défunt
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {selectedDossier.defunt.nom} {selectedDossier.defunt.postnom ? `${selectedDossier.defunt.postnom} ` : ''}{selectedDossier.defunt.prenom}
                    </h3>
                  </div>
                </div>

                <span className="font-mono text-xs text-sky-400 font-bold bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-900">
                  {selectedDossier.numeroDossier}
                </span>
              </div>

              {/* 2. DATES CLÉS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-blue-950 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Date de naissance :</span>
                    <strong className="text-white">
                      {selectedDossier.defunt.dateNaissance
                        ? new Date(selectedDossier.defunt.dateNaissance).toLocaleDateString('fr-FR')
                        : 'Non communiquée'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Date du décès :</span>
                    <strong className="text-white">
                      {new Date(selectedDossier.defunt.dateDeces).toLocaleDateString('fr-FR')}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. STATUT DE LA LOCALISATION (GÉNÉRAL SANS NUMÉRO DE CASE FRIGORIFIQUE) */}
            <div className="bg-[#061126] rounded-2xl p-4 sm:p-5 border border-blue-900/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block">
                3. Statut de la Localisation
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  <span className="text-base font-bold text-white">
                    {getLocalisationGenerale(selectedDossier.statut)}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 italic">
                  Protocole de sécurité & décence
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Le corps est sous surveillance continue et sécurisée au sein de l'établissement Hospital Nomargueri.
              </p>
            </div>

            {/* 4. INFORMATIONS SUR LES OBSÈQUES */}
            <div className="bg-[#061126] rounded-2xl p-4 sm:p-5 border border-blue-900/80 space-y-3">
              <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block">
                4. Informations sur les Obsèques & Recueillement
              </span>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Lieu de recueillement :</span>
                    <strong className="text-white">
                      Salons Funéraires Hospital Nomargueri (N°10 AV/Mondo, Mbezale, Nsele)
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Levée du corps & Hommage :</span>
                    <strong className="text-white">
                      Selon la programmation validée avec la famille et les ayants droit
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* SI MODE SUIVI DE DOSSIER : ÉTAT DU DOSSIER INTRODUIT / EN ATTENTE / VALIDÉ */}
            {activeMode === 'DOSSIER' && (
              <div className="bg-blue-950/40 rounded-2xl p-4 border border-blue-900 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Statut du Dossier Familial :
                  </span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {getStatutDossierBadge(selectedDossier.statut).label}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatutDossierBadge(selectedDossier.statut).style}`}>
                  {getStatutDossierBadge(selectedDossier.statut).label}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Bouton de Fermeture */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
        >
          Fermer la consultation
        </button>
      </div>
    </div>
  );
};
