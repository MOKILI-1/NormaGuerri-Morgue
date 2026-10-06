import React, { useState } from 'react';
import { DossierVivant } from '@nomarguerrie/shared-types';
import {
  Search,
  AlertOctagon,
  CheckCircle,
  Building,
  User,
  ArrowRight,
  Plus
} from 'lucide-react';

interface DossiersListViewProps {
  dossiers: DossierVivant[];
  onSelectDossier: (dossierId: string) => void;
  onOpenNewAdmission: () => void;
}

export const DossiersListView: React.FC<DossiersListViewProps> = ({
  dossiers,
  onSelectDossier,
  onOpenNewAdmission
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('TOUS');

  const filteredDossiers = dossiers.filter((d) => {
    const matchesSearch =
      d.numeroDossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.defunt.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.defunt.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.demandeur.nom.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatut === 'TOUS') return matchesSearch;
    if (filterStatut === 'BLOQUES') return matchesSearch && d.indicateurs.estBloque;
    if (filterStatut === 'PAYES') return matchesSearch && d.finance.statutPaiement === 'PAYE_TOTAL';
    return matchesSearch && d.statut === filterStatut;
  });

  return (
    <div className="space-y-6">
      {/* Barre d'action supérieure */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Registre des Dossiers Vivants</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Centre opérationnel de suivi des défunts et traçabilité du parcours funéraire.
          </p>
        </div>
        <button
          onClick={onOpenNewAdmission}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Admission
        </button>
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par numéro de dossier, nom du défunt, demandeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="TOUS">Tous les statuts</option>
          <option value="EN_CONSERVATION">En Conservation</option>
          <option value="CONTROLE_EN_COURS">Contrôle en cours</option>
          <option value="BLOQUES">⚠️ Dossiers Bloqués</option>
          <option value="PAYES">✅ Soldés à 100%</option>
        </select>
      </div>

      {/* Grille / Liste des Dossiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDossiers.map((dossier) => (
          <div
            key={dossier.id}
            onClick={() => onSelectDossier(dossier.id)}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3">
              {/* En-tête carte */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {dossier.numeroDossier}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    dossier.statut === 'EN_CONSERVATION'
                      ? 'bg-blue-100 text-blue-700'
                      : dossier.statut === 'CONTROLE_EN_COURS'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {dossier.statut.replace('_', ' ')}
                </span>
              </div>

              {/* Défunt */}
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {dossier.defunt.prenom} {dossier.defunt.nom} {dossier.defunt.postnom || ''}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                  Proche : {dossier.demandeur.prenom} {dossier.demandeur.nom} ({dossier.demandeur.lienParente || 'Famille'})
                </p>
              </div>

              {/* Emplacement Actuel */}
              <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Building className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-medium truncate">
                  {dossier.emplacementActuel
                    ? `${dossier.emplacementActuel.chambreNom} — ${dossier.emplacementActuel.numeroCase}`
                    : 'Emplacement non attribué'}
                </span>
              </div>

              {/* Alertes ou Blocages */}
              {dossier.indicateurs.estBloque ? (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 p-2 rounded-lg text-xs text-rose-700">
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{dossier.indicateurs.alerteActive || 'Sortie bloquée par règles'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dossier conforme — Prêt pour sortie</span>
                </div>
              )}
            </div>

            {/* Pied de carte : Finance & Accès */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Paiement : </span>
                <span className="font-bold text-slate-800">
                  ${dossier.finance.totalPaye} / ${dossier.finance.totalPrestations} ({dossier.finance.pourcentagePaye}%)
                </span>
              </div>

              <span className="text-blue-600 font-semibold flex items-center gap-1 group">
                Ouvrir <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
