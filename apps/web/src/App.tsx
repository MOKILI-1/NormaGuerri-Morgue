import React, { useState, useEffect, useCallback } from 'react';
import {
  DossierVivant,
  RoleUtilisateur,
  MetriquesDashboard,
  TacheFileDuJour,
  CaseEmplacement,
  ArticleCatalogue,
  ModePaiement
} from '@nomarguerrie/shared-types';
import { ApiClient } from './services/api';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DossiersListView } from './components/DossiersListView';
import { DossierDetailView } from './components/DossierDetailView';
import { EmplacementsView } from './components/EmplacementsView';
import { QrScannerModal } from './components/QrScannerModal';
import { NouvelleAdmissionModal } from './components/NouvelleAdmissionModal';
import { LandingPageView } from './components/LandingPageView';
import { METRIQUES_DASHBOARD_MOCK, DOSSIERS_MOCK, CASES_EMPLACEMENTS_MOCK, CATALOGUE_SERVICES_MOCK, TACHES_FILE_DU_JOUR_MOCK } from '../../api/src/data/mock-db';

export const App: React.FC = () => {
  const [pageMode, setPageMode] = useState<'landing' | 'backoffice'>('landing');
  const [currentView, setCurrentView] = useState<'dashboard' | 'dossiers' | 'emplacements' | 'detail'>('dashboard');
  const [activeRole, setActiveRole] = useState<RoleUtilisateur>('RESPONSABLE_EXPLOITATION');

  const [dossiers, setDossiers] = useState<DossierVivant[]>(DOSSIERS_MOCK);
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  const [stats, setStats] = useState<MetriquesDashboard>(METRIQUES_DASHBOARD_MOCK);
  const [taches, setTaches] = useState<TacheFileDuJour[]>(TACHES_FILE_DU_JOUR_MOCK);
  const [emplacements, setEmplacements] = useState<CaseEmplacement[]>(CASES_EMPLACEMENTS_MOCK);
  const [catalogue, setCatalogue] = useState<ArticleCatalogue[]>(CATALOGUE_SERVICES_MOCK);

  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isNewAdmissionOpen, setIsNewAdmissionOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | undefined>();

  // Synchronisation des données (avec fallback local automatique)
  const refreshData = useCallback(async () => {
    try {
      const isOnline = await ApiClient.checkHealth();
      setIsBackendConnected(isOnline);

      if (isOnline) {
        const [casesData, statsData, emplacementsData, catalogueData] = await Promise.all([
          ApiClient.getDossiers(),
          ApiClient.getDashboardStats(),
          ApiClient.getEmplacements(),
          ApiClient.getCatalogue()
        ]);
        setDossiers(casesData);
        setStats(statsData);
        setEmplacements(emplacementsData);
        setCatalogue(catalogueData);

        const tachesData = await ApiClient.getTachesFileDuJour(activeRole);
        setTaches(tachesData);
      } else {
        // Mode simulation locale
        setTaches(TACHES_FILE_DU_JOUR_MOCK.filter((t) => !activeRole || t.roleCible === activeRole));
      }
    } catch {
      setIsBackendConnected(false);
    }
  }, [activeRole]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Actions de navigation
  const handleSelectDossier = (dossierId: string) => {
    setSelectedDossierId(dossierId);
    setCurrentView('detail');
  };

  const handleOpenScanner = () => {
    setIsScannerOpen(true);
  };

  const handleScanSuccess = async (tokenOuNumero: string) => {
    setIsScannerOpen(false);
    try {
      if (isBackendConnected) {
        const dossier = await ApiClient.scanQrCode(tokenOuNumero);
        setSelectedDossierId(dossier.id);
      } else {
        const found = dossiers.find(
          (d) => d.numeroDossier === tokenOuNumero || d.qrCodeToken === tokenOuNumero || d.id === tokenOuNumero
        );
        if (found) {
          setSelectedDossierId(found.id);
        } else {
          alert('QR Code ou numéro non reconnu dans la base.');
          return;
        }
      }
      setCurrentView('detail');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur lors du scan.');
    }
  };

  const handleShowQrModalForActiveDossier = async () => {
    if (!selectedDossier) return;
    try {
      if (isBackendConnected) {
        const qrUrl = await ApiClient.getQrCodeImage(selectedDossier.id);
        setQrCodeDataUrl(qrUrl);
      } else {
        setQrCodeDataUrl('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(selectedDossier.qrCodeToken));
      }
      setIsScannerOpen(true);
    } catch {
      setIsScannerOpen(true);
    }
  };

  // Actions métier sur le dossier vivant
  const handleAffecterEmplacement = async (caseId: string, motif?: string) => {
    if (!selectedDossierId) return;
    if (isBackendConnected) {
      const updated = await ApiClient.affecterEmplacement(selectedDossierId, caseId, 'usr-2', motif);
      setDossiers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } else {
      // Simulation locale
      setDossiers((prev) =>
        prev.map((d) => {
          if (d.id !== selectedDossierId) return d;
          const targetCase = emplacements.find((c) => c.id === caseId);
          return {
            ...d,
            emplacementActuel: targetCase ? { ...targetCase, statut: 'OCCUPEE' } : undefined,
            statut: 'EN_CONSERVATION'
          };
        })
      );
    }
    await refreshData();
  };

  const handleAjouterPrestation = async (articleId: string, quantite: number) => {
    if (!selectedDossierId) return;
    if (isBackendConnected) {
      const updated = await ApiClient.ajouterPrestation(selectedDossierId, articleId, quantite, 'usr-3');
      setDossiers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    }
    await refreshData();
  };

  const handleEnregistrerPaiement = async (montant: number, mode: ModePaiement, notes?: string) => {
    if (!selectedDossierId) return;
    if (isBackendConnected) {
      const updated = await ApiClient.enregistrerPaiement(selectedDossierId, montant, mode, 'usr-3', notes);
      setDossiers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    }
    await refreshData();
  };

  const handleValiderEtapeSortie = async (etape: 1 | 2 | 3 | 4, remarques?: string) => {
    if (!selectedDossierId) return;
    if (isBackendConnected) {
      const updated = await ApiClient.validerEtapeSortie(selectedDossierId, etape, 'usr-5', remarques);
      setDossiers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    }
    await refreshData();
  };

  const handleNouvelleAdmissionSubmit = async (payload: {
    defunt: DossierVivant['defunt'];
    demandeur: DossierVivant['demandeur'];
  }) => {
    if (isBackendConnected) {
      const nouveau = await ApiClient.creerDossier({ ...payload, agentId: 'usr-1' });
      setDossiers((prev) => [nouveau, ...prev]);
      setSelectedDossierId(nouveau.id);
    } else {
      const annee = new Date().getFullYear();
      const numDossier = `#NMG-${annee}-${String(dossiers.length + 1).padStart(6, '0')}`;
      const fakeDossier: DossierVivant = {
        id: `dos-${Date.now()}`,
        numeroDossier: numDossier,
        qrCodeToken: `NMG_SEC_${Date.now()}`,
        statut: 'EN_ATTENTE_ADMISSION',
        dateCreation: new Date().toISOString(),
        responsableDossierId: 'usr-1',
        responsableDossierNom: 'Alain KABEYA',
        defunt: payload.defunt,
        demandeur: payload.demandeur,
        prestations: [],
        finance: {
          totalPrestations: 50,
          totalPaye: 0,
          soldeRestant: 50,
          pourcentagePaye: 0,
          devise: 'USD',
          statutPaiement: 'NON_PAYE',
          historiquePaiements: []
        },
        documents: [],
        validationSortie: {
          etape1PreparationAgent: { estValidee: false },
          etape2ControleResponsable: { estValidee: false },
          etape3VerificationFinance: { estValidee: false },
          etape4AutorisationDirection: { estValidee: false },
          estCompletementAutorisee: false,
          estBloquee: true,
          motifsBlocage: ['Admission en cours de formalisation']
        },
        indicateurs: {
          identificationConforme: true,
          documentsRequisTotal: 3,
          documentsValidesTotal: 1,
          conservationValidee: false,
          nombreServicesActifs: 1,
          pourcentagePaiement: 0,
          sortieAutorisee: false,
          prochaineActionAttendue: 'Affecter une case frigorifique',
          estBloque: true
        },
        estSousScelleJudiciaire: false,
        autopsieRequise: false,
        autopsieEffectuee: false,
        historiqueMouvements: []
      };
      setDossiers((prev) => [fakeDossier, ...prev]);
      setSelectedDossierId(fakeDossier.id);
    }
    setCurrentView('detail');
    await refreshData();
  };

  const selectedDossier = dossiers.find((d) => d.id === selectedDossierId);

  // Si on est en mode Landing Page Publique (Portail Familles)
  if (pageMode === 'landing') {
    return (
      <LandingPageView
        onGoToBackoffice={() => setPageMode('backoffice')}
        onCreateDemand={handleNouvelleAdmissionSubmit}
        onSearchDossier={(numOuToken) => {
          setPageMode('backoffice');
          handleScanSuccess(numOuToken);
        }}
      />
    );
  }

  // Sinon, affichage du Backoffice Opérationnel
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Barre de navigation Backoffice */}
      <Navbar
        currentView={currentView === 'detail' ? 'dossiers' : currentView}
        onNavigate={(v) => {
          setSelectedDossierId(null);
          setCurrentView(v);
        }}
        activeRole={activeRole}
        onRoleChange={(r) => {
          setActiveRole(r);
        }}
        onOpenScanner={handleOpenScanner}
        onOpenNewAdmission={() => setIsNewAdmissionOpen(true)}
        isBackendConnected={isBackendConnected}
        onGoToLanding={() => setPageMode('landing')}
      />

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {currentView === 'dashboard' && (
          <DashboardView
            stats={stats}
            taches={taches}
            activeRole={activeRole}
            onSelectDossier={handleSelectDossier}
            onNavigate={(v) => setCurrentView(v)}
            onOpenNewAdmission={() => setIsNewAdmissionOpen(true)}
            onOpenScanner={handleOpenScanner}
          />
        )}

        {currentView === 'dossiers' && (
          <DossiersListView
            dossiers={dossiers}
            onSelectDossier={handleSelectDossier}
            onOpenNewAdmission={() => setIsNewAdmissionOpen(true)}
          />
        )}

        {currentView === 'detail' && selectedDossier && (
          <DossierDetailView
            dossier={selectedDossier}
            activeRole={activeRole}
            catalogue={catalogue}
            emplacements={emplacements}
            onBack={() => setCurrentView('dossiers')}
            onRefreshDossier={refreshData}
            onAffecterEmplacement={handleAffecterEmplacement}
            onAjouterPrestation={handleAjouterPrestation}
            onEnregistrerPaiement={handleEnregistrerPaiement}
            onValiderEtapeSortie={handleValiderEtapeSortie}
            onShowQrModal={handleShowQrModalForActiveDossier}
          />
        )}

        {currentView === 'emplacements' && (
          <EmplacementsView
            emplacements={emplacements}
            onSelectCase={(caseId) => {
              const dossierTrouve = dossiers.find((d) => d.emplacementActuel?.id === caseId);
              if (dossierTrouve) {
                handleSelectDossier(dossierTrouve.id);
              } else {
                alert('Cette case est actuellement vide.');
              }
            }}
          />
        )}
      </main>

      {/* Modales globales */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => {
          setIsScannerOpen(false);
          setQrCodeDataUrl(undefined);
        }}
        onScanSuccess={handleScanSuccess}
        activeDossierForQr={qrCodeDataUrl ? selectedDossier : undefined}
        qrDataUrl={qrCodeDataUrl}
      />

      <NouvelleAdmissionModal
        isOpen={isNewAdmissionOpen}
        onClose={() => setIsNewAdmissionOpen(false)}
        onSubmit={handleNouvelleAdmissionSubmit}
      />

      {/* Footer sobre MOKILI */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>
          NomarGuerrie V2 • Conçu selon les standards d'ingénierie du <strong>Framework MOKILI SAS</strong> • Déploiement Souverain
        </p>
      </footer>
    </div>
  );
};

export default App;
