import React, { useState } from 'react';
import {
  DossierVivant,
  RoleUtilisateur,
  ArticleCatalogue,
  CaseEmplacement,
  ModePaiement
} from '@nomarguerrie/shared-types';
import {
  ArrowLeft,
  Building,
  User,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Plus,
  QrCode,
  FileText,
  Clock,
  Printer,
  Calendar,
  AlertTriangle,
  History
} from 'lucide-react';

interface DossierDetailViewProps {
  dossier: DossierVivant;
  activeRole: RoleUtilisateur;
  catalogue: ArticleCatalogue[];
  emplacements: CaseEmplacement[];
  onBack: () => void;
  onRefreshDossier: () => void;
  onAffecterEmplacement: (caseId: string, motif?: string) => Promise<void>;
  onAjouterPrestation: (articleId: string, quantite: number) => Promise<void>;
  onEnregistrerPaiement: (montant: number, mode: ModePaiement, notes?: string) => Promise<void>;
  onValiderEtapeSortie: (etape: 1 | 2 | 3 | 4, remarques?: string) => Promise<void>;
  onShowQrModal: () => void;
}

export const DossierDetailView: React.FC<DossierDetailViewProps> = ({
  dossier,
  activeRole,
  catalogue,
  emplacements,
  onBack,
  onAffecterEmplacement,
  onAjouterPrestation,
  onEnregistrerPaiement,
  onValiderEtapeSortie,
  onShowQrModal
}) => {
  const [activeTab, setActiveTab] = useState<
    'identite' | 'emplacement' | 'prestations' | 'finance' | 'validation' | 'audit'
  >('identite');

  // États pour les formulaires modaux locaux
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [motifTransfert, setMotifTransfert] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [quantitePrestation, setQuantitePrestation] = useState(1);
  const [montantPaiement, setMontantPaiement] = useState(dossier.finance.soldeRestant);
  const [modePaiement, setModePaiement] = useState<ModePaiement>('ESPECES');
  const [remarqueValidation, setRemarqueValidation] = useState('');

  const [loadingAction, setLoadingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAffecterCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) return;
    setLoadingAction(true);
    setActionError(null);
    try {
      await onAffecterEmplacement(selectedCaseId, motifTransfert);
      setActionSuccess('Emplacement mis à jour avec succès.');
      setSelectedCaseId('');
      setMotifTransfert('');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAjouterPrestation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticleId) return;
    setLoadingAction(true);
    setActionError(null);
    try {
      await onAjouterPrestation(selectedArticleId, quantitePrestation);
      setActionSuccess('Prestation ajoutée au dossier.');
      setSelectedArticleId('');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEnregistrerPaiement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (montantPaiement <= 0) return;
    setLoadingAction(true);
    setActionError(null);
    try {
      await onEnregistrerPaiement(montantPaiement, modePaiement);
      setActionSuccess('Paiement enregistré avec succès.');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleValidationEtape = async (etape: 1 | 2 | 3 | 4) => {
    setLoadingAction(true);
    setActionError(null);
    try {
      await onValiderEtapeSortie(etape, remarqueValidation);
      setActionSuccess(`Étape ${etape} validée avec succès.`);
      setRemarqueValidation('');
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Bouton retour et barre de statut */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste des dossiers
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onShowQrModal}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            Voir QR Code du Dossier
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimer Fiche
          </button>
        </div>
      </div>

      {/* Notifications locales */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 font-bold ml-2">×</button>
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-rose-700 font-bold ml-2">×</button>
        </div>
      )}

      {/* 1. EN-TÊTE OFFICIEL DU DOSSIER VIVANT (Section 5 Doc V2) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-bold px-3 py-1 rounded bg-slate-900 text-white">
                {dossier.numeroDossier}
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                {dossier.defunt.prenom} {dossier.defunt.nom} {dossier.defunt.postnom || ''}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Admission : {new Date(dossier.dateCreation).toLocaleDateString()}</span>
              <span>•</span>
              <span>Responsable : {dossier.responsableDossierNom}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                dossier.statut === 'EN_CONSERVATION'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : dossier.statut === 'AUTORISATION_VALIDEE'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {dossier.statut.replace('_', ' ')}
            </span>

            <div className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              {dossier.emplacementActuel
                ? `${dossier.emplacementActuel.chambreNom} — ${dossier.emplacementActuel.numeroCase}`
                : 'En attente d’emplacement'}
            </div>
          </div>
        </div>

        {/* 2. INDICATEURS IMMÉDIATS (Section 5 & 12 Doc V2) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {/* Identification */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Identification</p>
            <p className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4" /> Conforme
            </p>
          </div>

          {/* Documents */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Documents Requis</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">
              {dossier.indicateurs.documentsValidesTotal} / {dossier.indicateurs.documentsRequisTotal} validés
            </p>
          </div>

          {/* Conservation */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Conservation</p>
            <p className="text-sm font-bold text-blue-600 mt-0.5">
              {dossier.emplacementActuel ? 'Active (OK)' : 'Non affectée'}
            </p>
          </div>

          {/* Services */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Services Actifs</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">
              {dossier.prestations.length} prestation(s)
            </p>
          </div>

          {/* Paiement */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Paiement</p>
            <p className={`text-sm font-bold mt-0.5 ${dossier.finance.soldeRestant === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {dossier.finance.pourcentagePaye}% (${dossier.finance.totalPaye}/${dossier.finance.totalPrestations})
            </p>
          </div>

          {/* Autorisation Sortie */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Autorisation Sortie</p>
            <p className={`text-sm font-bold flex items-center gap-1 mt-0.5 ${dossier.validationSortie.estCompletementAutorisee ? 'text-emerald-600' : 'text-rose-600'}`}>
              {dossier.validationSortie.estCompletementAutorisee ? (
                <>
                  <ShieldCheck className="w-4 h-4" /> Autorisée
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" /> Bloquée
                </>
              )}
            </p>
          </div>
        </div>

        {/* Prochaine Action / Blocage Moteur de Règles */}
        {dossier.indicateurs.estBloque ? (
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-lg text-xs text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900">SORTIE BLOQUÉE PAR LE MOTEUR DE RÈGLES :</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                {dossier.validationSortie.motifsBlocage.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Prochaine action :</strong> {dossier.indicateurs.prochaineActionAttendue}</span>
          </div>
        )}
      </div>

      {/* 3. NAVIGATION PAR ONGLETS */}
      <div className="border-b border-slate-200 flex gap-2 overflow-x-auto text-sm font-medium">
        {[
          { id: 'identite', label: 'Identité & Demandeur' },
          { id: 'emplacement', label: 'Emplacement & Mouvements' },
          { id: 'prestations', label: 'Prestations Funéraires' },
          { id: 'finance', label: 'Facturation & Encaissements' },
          { id: 'validation', label: 'Double Validation Sortie' },
          { id: 'audit', label: 'Timeline & Traçabilité' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`pb-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENU ONGLET 1 : IDENTITÉ & DEMANDEUR */}
      {activeTab === 'identite' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fiche Défunt */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4 text-blue-600" />
              Informations du Défunt
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Nom complet :</span>
                <span className="font-semibold text-slate-900">
                  {dossier.defunt.prenom} {dossier.defunt.nom} {dossier.defunt.postnom}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Sexe :</span>
                <span className="font-semibold text-slate-900">{dossier.defunt.sexe}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Date & Heure du décès :</span>
                <span className="font-semibold text-slate-900">
                  {new Date(dossier.defunt.dateDeces).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Lieu du décès :</span>
                <span className="font-semibold text-slate-900">{dossier.defunt.lieuDeces}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Certificat de décès N° :</span>
                <span className="font-semibold font-mono text-slate-900">{dossier.defunt.numCertificatDeces || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Médecin déclarant :</span>
                <span className="font-semibold text-slate-900">{dossier.defunt.medecinDeclarant || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Fiche Demandeur / Proche */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4 text-emerald-600" />
              Demandeur & Ayant Droit
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Nom & Prénom :</span>
                <span className="font-semibold text-slate-900">
                  {dossier.demandeur.prenom} {dossier.demandeur.nom}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Lien de parenté :</span>
                <span className="font-semibold text-slate-900">{dossier.demandeur.lienParente || 'Proche'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Téléphone principal :</span>
                <span className="font-semibold font-mono text-slate-900">{dossier.demandeur.telephone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Adresse de résidence :</span>
                <span className="font-semibold text-slate-900">{dossier.demandeur.adresse}, {dossier.demandeur.ville}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 2 : EMPLACEMENT & MOUVEMENTS */}
      {activeTab === 'emplacement' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire d'affectation / transfert */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              Affecter / Transférer de Case
            </h3>
            <form onSubmit={handleAffecterCase} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Sélectionner la case disponible</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  required
                >
                  <option value="">-- Choisir une case --</option>
                  {emplacements
                    .filter((c) => c.statut === 'DISPONIBLE' || c.id === dossier.emplacementActuel?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.chambreNom} — {c.numeroCase} (Actuel: {c.statut})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Motif du transfert ou de l'affectation</label>
                <input
                  type="text"
                  placeholder="ex: Affectation initiale, Passage en froid négatif..."
                  value={motifTransfert}
                  onChange={(e) => setMotifTransfert(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingAction || !selectedCaseId}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                {loadingAction ? 'Mise à jour en cours...' : 'Valider le Mouvement'}
              </button>
            </form>
          </div>

          {/* Historique des mouvements */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              Registre Chronologique des Déplacements
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {dossier.historiqueMouvements.length === 0 ? (
                <p className="text-slate-400 py-4 text-center">Aucun mouvement enregistré pour ce dossier.</p>
              ) : (
                dossier.historiqueMouvements.map((m) => (
                  <div key={m.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">
                        {m.sourceEmplacement ? `${m.sourceEmplacement} ➔ ` : ''}{m.destinationEmplacement}
                      </p>
                      <p className="text-slate-500">Motif : {m.motif}</p>
                      <p className="text-slate-400">Agent : {m.agentNom}</p>
                    </div>
                    <span className="font-mono text-slate-400 shrink-0">
                      {new Date(m.dateHeure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 3 : PRESTATIONS FUNÉRAIRES */}
      {activeTab === 'prestations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ajouter une prestation */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                Ajouter une Prestation / Fourniture
              </h3>
              <form onSubmit={handleAjouterPrestation} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Prestation ou Produit du Catalogue</label>
                  <select
                    value={selectedArticleId}
                    onChange={(e) => setSelectedArticleId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                    required
                  >
                    <option value="">-- Choisir au catalogue --</option>
                    {catalogue.map((art) => (
                      <option key={art.id} value={art.id}>
                        {art.titre} (${art.prixUnitaire} {art.devise})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Quantité (jours, unités, etc.)</label>
                  <input
                    type="number"
                    min="1"
                    value={quantitePrestation}
                    onChange={(e) => setQuantitePrestation(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingAction || !selectedArticleId}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  Ajouter au Dossier
                </button>
              </form>
            </div>

            {/* Liste des prestations du dossier */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900">Prestations et Articles Liés</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase border-b">
                    <tr>
                      <th className="p-2">Désignation</th>
                      <th className="p-2">Quantité</th>
                      <th className="p-2">Prix Unit.</th>
                      <th className="p-2">Total</th>
                      <th className="p-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dossier.prestations.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2 font-medium text-slate-800">{p.titre}</td>
                        <td className="p-2">{p.quantite}</td>
                        <td className="p-2 font-mono">${p.prixUnitaire}</td>
                        <td className="p-2 font-mono font-bold">${p.prixTotal}</td>
                        <td className="p-2">
                          <span className="px-2 py-0.5 rounded font-semibold text-xs bg-slate-100 text-slate-700">
                            {p.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 4 : FACTURATION & ENCAISSEMENTS */}
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire d'encaissement */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Enregistrer un Encaissement
            </h3>
            <form onSubmit={handleEnregistrerPaiement} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Montant perçu (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={montantPaiement}
                  onChange={(e) => setMontantPaiement(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mode de règlement</label>
                <select
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value as ModePaiement)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="ESPECES">Espèces (Guichet)</option>
                  <option value="MOBILE_MONEY">Mobile Money (M-Pesa / Airtel / Orange)</option>
                  <option value="VIREMENT_BANCAIRE">Virement Bancaire</option>
                  <option value="CHEQUE">Chèque Certifié</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loadingAction || montantPaiement <= 0}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                Émettre le Reçu d’Encaissement
              </button>
            </form>
          </div>

          {/* Synthèse et Reçus */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Bilan Financier & Quittances</h3>
              <div className="text-right">
                <span className="text-xs text-slate-500">Solde Restant Dû : </span>
                <span className="text-lg font-bold font-mono text-rose-600">
                  ${dossier.finance.soldeRestant.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {dossier.finance.historiquePaiements.map((pay) => (
                <div key={pay.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">
                      Reçu N° {pay.referenceRecu} — ${pay.montant.toFixed(2)} {pay.devise}
                    </p>
                    <p className="text-slate-500">
                      Mode : {pay.modePaiement} • Encaissé par {pay.encaissePar}
                    </p>
                  </div>
                  <span className="font-mono text-slate-400">
                    {new Date(pay.dateHeure).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 5 : DOUBLE VALIDATION DE SORTIE (Section 14 Doc V2) */}
      {activeTab === 'validation' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Protocole de Double Validation des Sorties
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Conformément à la règle de sécurité funéraire MOKILI, aucune sortie ne peut s'effectuer sans les 4 visas consécutifs.
            </p>
          </div>

          {/* Les 4 étapes séquentielles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Étape 1 */}
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${dossier.validationSortie.etape1PreparationAgent.estValidee ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-slate-700">1. Préparation Agent</span>
              <p className="text-slate-500">Mise en bière & habillement.</p>
              {dossier.validationSortie.etape1PreparationAgent.estValidee ? (
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Visé par {dossier.validationSortie.etape1PreparationAgent.valideeParNom}
                </div>
              ) : (
                <button
                  onClick={() => handleValidationEtape(1)}
                  disabled={loadingAction}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-xs"
                >
                  Viser Étape 1
                </button>
              )}
            </div>

            {/* Étape 2 */}
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${dossier.validationSortie.etape2ControleResponsable.estValidee ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-slate-700">2. Contrôle Responsable</span>
              <p className="text-slate-500">Contrôle identité & bracelet.</p>
              {dossier.validationSortie.etape2ControleResponsable.estValidee ? (
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Visé par {dossier.validationSortie.etape2ControleResponsable.valideeParNom}
                </div>
              ) : (
                <button
                  onClick={() => handleValidationEtape(2)}
                  disabled={loadingAction || !dossier.validationSortie.etape1PreparationAgent.estValidee}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-xs disabled:opacity-40"
                >
                  Viser Étape 2
                </button>
              )}
            </div>

            {/* Étape 3 */}
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${dossier.validationSortie.etape3VerificationFinance.estValidee ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-slate-700">3. Visa Comptable</span>
              <p className="text-slate-500">Solde financier à 100%.</p>
              {dossier.validationSortie.etape3VerificationFinance.estValidee ? (
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Visé par {dossier.validationSortie.etape3VerificationFinance.valideeParNom}
                </div>
              ) : (
                <button
                  onClick={() => handleValidationEtape(3)}
                  disabled={loadingAction || dossier.finance.soldeRestant > 0}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-xs disabled:opacity-40"
                >
                  Viser Étape 3
                </button>
              )}
            </div>

            {/* Étape 4 */}
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${dossier.validationSortie.etape4AutorisationDirection.estValidee ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-bold text-slate-700">4. Autorisation Direction</span>
              <p className="text-slate-500">Signature finale de sortie.</p>
              {dossier.validationSortie.etape4AutorisationDirection.estValidee ? (
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Autorisée par {dossier.validationSortie.etape4AutorisationDirection.valideeParNom}
                </div>
              ) : (
                <button
                  onClick={() => handleValidationEtape(4)}
                  disabled={loadingAction || dossier.indicateurs.estBloque}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow-xs disabled:opacity-40"
                >
                  Signer Sortie Finale
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 6 : TIMELINE D'AUDIT (M16) */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <History className="w-4 h-4 text-blue-600" />
            Registre d'Audit Immuable du Dossier
          </h3>
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 text-xs">
            {dossier.historiqueMouvements.map((m, idx) => (
              <div key={idx} className="relative pl-6">
                <span className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                <p className="font-bold text-slate-900">{m.typeMouvement} : {m.motif}</p>
                <p className="text-slate-500">Par {m.agentNom} • Destination : {m.destinationEmplacement}</p>
                <span className="text-slate-400 font-mono">{new Date(m.dateHeure).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
