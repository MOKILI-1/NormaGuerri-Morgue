import React, { useState, useEffect, useMemo } from 'react';
import { DossierVivant } from '@nomarguerrie/shared-types';
import {
  X,
  Clock,
  PhoneCall,
  Search,
  CheckCircle2,
  Check,
  User,
  Calendar,
  MapPin,
  ArrowLeft,
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface FamilleSuiviModalProps {
  dossier: DossierVivant | null;
  dossiers?: DossierVivant[];
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (ref: string) => void;
  onSelectDossier?: (dossier: DossierVivant) => void;
}

export const FamilleSuiviModal: React.FC<FamilleSuiviModalProps> = ({
  dossier,
  dossiers = [],
  isOpen,
  onClose,
  onSearch,
  onSelectDossier
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedDossier, setSelectedDossier] = useState<DossierVivant | null>(dossier);

  // Synchronisation lorsque la prop dossier change
  useEffect(() => {
    setSelectedDossier(dossier);
    if (!dossier) {
      setSearchInput('');
    }
  }, [dossier, isOpen]);

  // Filtrage réactif de tous les défunts enregistrés
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

    // Si exactement 1 défunt correspond en local, l'afficher directement
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#0A1A3E] border border-blue-900/80 rounded-2xl max-w-xl w-full p-6 sm:p-7 text-white shadow-2xl space-y-6">
        {/* Header Modal */}
        <div className="flex items-start justify-between border-b border-blue-950/80 pb-4">
          <div className="flex items-center space-x-3">
            <img
              src="/logo-hospital-nomargueri.jpg"
              alt="Hospital Nomargueri"
              className="w-11 h-11 rounded-full border border-sky-400 shadow object-cover bg-white shrink-0"
            />
            <div>
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">
                Hospital Nomargueri • Registre Funéraire
              </span>
              <h2 className="text-lg font-bold text-white">
                {selectedDossier
                  ? `Fiche Défunt • ${selectedDossier.defunt.prenom} ${selectedDossier.defunt.nom}`
                  : 'Trouver un décès enregistré'}
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

        {/* ========================================================================= */}
        {/* VUE 1 : RECHERCHE DANS LE REGISTRE DES DÉFUNTS                             */}
        {/* ========================================================================= */}
        {!selectedDossier ? (
          <div className="space-y-5">
            {/* Formulaire de recherche */}
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Rechercher une personne décédée enregistrée dans nos services :
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tapez le nom, prénom (ex: Kasanda, Henriette) ou n° de dossier..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#061126] border border-blue-900/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    autoFocus
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Rechercher</span>
                </button>
              </div>
            </form>

            {/* RÉSULTATS DE LA RECHERCHE */}
            {searchInput.trim() ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {matchingDossiers.length} résultat{matchingDossiers.length > 1 ? 's' : ''} trouvé{matchingDossiers.length > 1 ? 's' : ''} :
                  </span>
                  {matchingDossiers.length > 0 && (
                    <span className="text-[11px] text-sky-400">Cliquez pour consulter le suivi</span>
                  )}
                </div>

                {matchingDossiers.length > 0 ? (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {matchingDossiers.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => handleSelectOne(d)}
                        className="p-3.5 rounded-xl bg-[#061126] hover:bg-slate-900/90 border border-blue-900/70 hover:border-sky-400/80 cursor-pointer transition-all space-y-2 group shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-white text-sm group-hover:text-sky-300 transition-colors">
                              {d.defunt.prenom} {d.defunt.nom} {d.defunt.postnom ? ` ${d.defunt.postnom}` : ''}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>Décédé le {new Date(d.defunt.dateDeces).toLocaleDateString('fr-FR')}</span>
                              <span>•</span>
                              <span>{d.defunt.lieuDeces}</span>
                            </div>
                          </div>
                          <span className="font-mono text-[11px] text-sky-400 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                            {d.numeroDossier}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-blue-950">
                          <span className="text-slate-300 text-[11px] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            {d.statut === 'DEMANDE' && 'Demande enregistrée'}
                            {d.statut === 'EN_ATTENTE_ADMISSION' && 'En attente d’admission'}
                            {d.statut === 'ADMIS' && 'Admis à la morgue'}
                            {d.statut === 'EN_CONSERVATION' && 'Conservation frigorifique sécurisée'}
                            {d.statut === 'EN_PREPARATION' && 'Soins de préparation & toilette'}
                            {d.statut === 'CONTROLE_EN_COURS' && 'Contrôle réglementaire'}
                            {d.statut === 'AUTORISATION_VALIDEE' && 'Autorisation accordée (Prêt)'}
                            {d.statut === 'SORTI' && 'Levée du corps effectuée'}
                            {d.statut === 'ARCHIVE' && 'Dossier archivé'}
                          </span>
                          <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform flex items-center text-[11px] font-semibold">
                            Consulter la fiche <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-slate-900/60 border border-blue-950 text-center space-y-2 text-xs text-slate-300">
                    <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                    <p className="font-semibold text-white">
                      Aucun défunt trouvé sous le nom « {searchInput} »
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Vérifiez l'orthographe du nom ou contactez directement notre standard d'accueil au <strong>+243 997 222 228</strong> pour vérification dans nos registres manuels.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Invitation et défunts récents enregistrés */
              <div className="space-y-3">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Défunts récemment pris en charge à l'établissement :
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {dossiers.slice(0, 5).map((d) => (
                    <div
                      key={d.id}
                      onClick={() => handleSelectOne(d)}
                      className="p-3 rounded-xl bg-[#061126] hover:bg-slate-900/80 border border-blue-950 hover:border-blue-800 cursor-pointer transition-all flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">
                          {d.defunt.prenom} {d.defunt.nom}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Décédé le {new Date(d.defunt.dateDeces).toLocaleDateString('fr-FR')} • {d.defunt.lieuDeces}
                        </span>
                      </div>
                      <span className="font-mono text-sky-400 text-[11px] px-2 py-0.5 rounded bg-blue-950">
                        {d.numeroDossier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VUE 2 : FICHE DU DÉFUNT ET SUIVI EN TEMPS RÉEL                             */
          /* ========================================================================= */
          <div className="space-y-4">
            <button
              onClick={handleBackToSearch}
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Rechercher un autre défunt</span>
            </button>

            {/* Identité Complète du Défunt */}
            <div className="bg-[#061126] rounded-xl p-4 border border-blue-900/70 space-y-2 text-xs">
              <div className="text-sky-300 uppercase font-semibold text-[10px] flex items-center justify-between">
                <span>Défunt Enregistré</span>
                <span className="font-mono text-sky-400 font-bold">{selectedDossier.numeroDossier}</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {selectedDossier.defunt.prenom} {selectedDossier.defunt.nom} {selectedDossier.defunt.postnom ? ` ${selectedDossier.defunt.postnom}` : ''}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  Sexe : <strong className="text-white">{selectedDossier.defunt.sexe}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  Date décès : <strong className="text-white">{new Date(selectedDossier.defunt.dateDeces).toLocaleDateString('fr-FR')}</strong>
                </span>
                <span className="flex items-center gap-1.5 sm:col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  Lieu : <strong className="text-white">{selectedDossier.defunt.lieuDeces}</strong>
                </span>
              </div>
            </div>

            {/* Statut d'Avancement du Parcours */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                État Actuel de la Prise en Charge
              </span>

              <div className="bg-[#061126] rounded-xl p-3.5 border border-blue-900/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedDossier.statut === 'DEMANDE' && 'Demande en ligne enregistrée'}
                    {selectedDossier.statut === 'EN_ATTENTE_ADMISSION' && 'En attente d’admission à la morgue'}
                    {selectedDossier.statut === 'ADMIS' && 'Dossier admis • Prise en charge officielle'}
                    {selectedDossier.statut === 'EN_CONSERVATION' && 'En conservation frigorifique sécurisée'}
                    {selectedDossier.statut === 'EN_PREPARATION' && 'Soins de thanatopraxie et toilette'}
                    {selectedDossier.statut === 'CONTROLE_EN_COURS' && 'Contrôle réglementaire et vérifications'}
                    {selectedDossier.statut === 'AUTORISATION_VALIDEE' && 'Autorisation accordée • Prêt pour levée'}
                    {selectedDossier.statut === 'SORTI' && 'Levée du corps effectuée'}
                    {selectedDossier.statut === 'ARCHIVE' && 'Dossier archivé'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Prochaine étape : {selectedDossier.indicateurs.prochaineActionAttendue}
                  </p>
                </div>
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/60 text-sky-300 border border-sky-400/30">
                  {selectedDossier.statut}
                </span>
              </div>
            </div>

            {/* Prestations Funéraires Associées */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                Prestations & Soins Rattachés au Dossier
              </span>

              <div className="bg-[#061126] rounded-xl p-3 border border-blue-900/60 space-y-1.5 max-h-36 overflow-y-auto">
                {selectedDossier.prestations.map((p) => (
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
          </div>
        )}

        {/* Assistance Famille Permanente 24/7 avec les vrais numéros */}
        <div className="bg-blue-950/50 border border-blue-900/60 rounded-xl p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sky-200">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-300">Permanence Familles 24h/24 :</span>
          </div>
          <div className="font-mono font-bold text-white text-xs flex items-center gap-3">
            <a href="tel:+243997222228" className="hover:text-sky-300 transition-colors">
              +243 997 222 228
            </a>
            <span className="text-slate-500">•</span>
            <a href="tel:+243833330040" className="hover:text-sky-300 transition-colors">
              +243 833 330 040
            </a>
          </div>
        </div>

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
