import React, { useState, useEffect, useCallback } from 'react';
import {
  DossierVivant,
  RoleUtilisateur,
  MetriquesDashboard,
  TacheFileDuJour,
  CaseEmplacement,
  ArticleCatalogue,
  ModePaiement,
  Utilisateur,
  PrestationDossier,
  Paiement
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
import { LoginView } from './components/LoginView';
import { FamilleSuiviModal } from './components/FamilleSuiviModal';
import {
  METRIQUES_DASHBOARD_MOCK,
  DOSSIERS_MOCK,
  CASES_EMPLACEMENTS_MOCK,
  CATALOGUE_SERVICES_MOCK,
  TACHES_FILE_DU_JOUR_MOCK
} from '../../api/src/data/mock-db';

export const App: React.FC = () => {
  // Détection initiale de l'URL (Séparation stricte Landing Page / Backoffice)
  const getInitialMode = (): 'landing' | 'backoffice' => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/backoffice') || hash.includes('backoffice')) {
        return 'backoffice';
      }
    }
    return 'landing';
  };

  const [pageMode, setPageMode] = useState<'landing' | 'backoffice'>(getInitialMode);
  const [currentUser, setCurrentUser] = useState<Utilisateur | null>(() => {
    try {
      const saved = localStorage.getItem('nomarguerrie_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'dossiers' | 'emplacements' | 'detail'>('dashboard');
  const [activeRole, setActiveRole] = useState<RoleUtilisateur>(() => {
    return currentUser?.role || 'RESPONSABLE_EXPLOITATION';
  });

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

  // Suivi public pour les familles (sur la Landing Page)
  const [familyTrackedDossier, setFamilyTrackedDossier] = useState<DossierVivant | null>(null);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);

  // Écouteur des changements de route dans le navigateur (SPA routing)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/backoffice') || hash.includes('backoffice')) {
        setPageMode('backoffice');
      } else {
        setPageMode('landing');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

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

  // Actions d'authentification
  const handleLoginSuccess = (user: Utilisateur) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    try {
      localStorage.setItem('nomarguerrie_active_user', JSON.stringify(user));
    } catch {
      // Ignorer
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('nomarguerrie_active_user');
    } catch {
      // Ignorer
    }
  };

  const handleNavigateToLanding = () => {
    setPageMode('landing');
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
  };

  // Actions de navigation interne
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

  // Recherche sécurisée pour le suivi famille sur la Landing Page
  const handleFamilySearch = async (numOuToken: string) => {
    const cleaned = numOuToken.trim();
    if (!cleaned) return;

    try {
      if (isBackendConnected) {
        const dossier = await ApiClient.scanQrCode(cleaned);
        setFamilyTrackedDossier(dossier);
        setIsFamilyModalOpen(true);
      } else {
        const found = dossiers.find(
          (d) =>
            d.numeroDossier.toLowerCase() === cleaned.toLowerCase() ||
            d.qrCodeToken === cleaned ||
            d.id === cleaned
        );
        if (found) {
          setFamilyTrackedDossier(found);
          setIsFamilyModalOpen(true);
        } else {
          alert(
            `Aucun dossier trouvé pour la référence "${cleaned}". Veuillez vérifier le numéro de dossier remis lors de l'enregistrement ou contacter l'assistance au +243 81 000 0000.`
          );
        }
      }
    } catch {
      alert(
        `Aucun dossier trouvé pour la référence "${cleaned}". Veuillez vérifier le numéro ou contacter le standard.`
      );
    }
  };

  // Actions métier sur le dossier vivant
  const handleAffecterEmplacement = async (caseId: string, motif?: string) => {
    if (!selectedDossierId) return;
    try {
      const agentId = currentUser?.id || 'usr-1';
      if (isBackendConnected) {
        await ApiClient.affecterEmplacement(selectedDossierId, caseId, agentId, motif);
      } else {
        const c = emplacements.find((e) => e.id === caseId);
        setDossiers((prev) =>
          prev.map((d) => {
            if (d.id === selectedDossierId) {
              return {
                ...d,
                statut: 'EN_CONSERVATION',
                emplacementActuel: c,
                indicateurs: {
                  ...d.indicateurs,
                  conservationValidee: true,
                  estBloque: false,
                  prochaineActionAttendue: 'Soins thanatopraxie'
                }
              };
            }
            return d;
          })
        );
      }
      await refreshData();
      alert('Emplacement frigorifique affecté avec succès.');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'affectation");
    }
  };

  const handleAjouterPrestation = async (articleId: string, quantite: number = 1) => {
    if (!selectedDossierId) return;
    try {
      const agentId = currentUser?.id || 'usr-1';
      if (isBackendConnected) {
        await ApiClient.ajouterPrestation(selectedDossierId, articleId, quantite, agentId);
      } else {
        const art = catalogue.find((a) => a.id === articleId);
        if (!art) return;
        setDossiers((prev) =>
          prev.map((d) => {
            if (d.id === selectedDossierId) {
              const newPresta: PrestationDossier = {
                id: `pr-${Date.now()}`,
                articleId: art.id,
                titre: art.titre,
                quantite,
                prixUnitaire: art.prixUnitaire,
                prixTotal: art.prixUnitaire * quantite,
                devise: art.devise,
                dateAjout: new Date().toISOString(),
                statut: 'DEMANDE'
              };
              const newTotal = d.finance.totalPrestations + newPresta.prixTotal;
              const newSolde = Math.max(0, newTotal - d.finance.totalPaye);
              return {
                ...d,
                prestations: [...d.prestations, newPresta],
                finance: {
                  ...d.finance,
                  totalPrestations: newTotal,
                  soldeRestant: newSolde,
                  pourcentagePaye: newTotal > 0 ? Math.min(100, Math.round((d.finance.totalPaye / newTotal) * 100)) : 100
                }
              };
            }
            return d;
          })
        );
      }
      await refreshData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'ajout de la prestation");
    }
  };

  const handleEnregistrerPaiement = async (
    montant: number,
    mode: ModePaiement,
    notes?: string
  ) => {
    if (!selectedDossierId) return;
    try {
      const agentId = currentUser?.id || 'usr-1';
      if (isBackendConnected) {
        await ApiClient.enregistrerPaiement(selectedDossierId, montant, mode, agentId, notes);
      } else {
        setDossiers((prev) =>
          prev.map((d) => {
            if (d.id === selectedDossierId) {
              const newPaye = d.finance.totalPaye + montant;
              const newSolde = Math.max(0, d.finance.totalPrestations - newPaye);
              const nouveauPaiement: Paiement = {
                id: `pay-${Date.now()}`,
                dossierId: d.id,
                dateHeure: new Date().toISOString(),
                montant,
                devise: 'USD',
                modePaiement: mode,
                referenceRecu: `REC-${Date.now().toString().slice(-6)}`,
                referencePaiementExterne: notes,
                encaissePar: currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Comptabilité'
              };
              const pct = d.finance.totalPrestations > 0 ? Math.min(100, Math.round((newPaye / d.finance.totalPrestations) * 100)) : 100;
              return {
                ...d,
                finance: {
                  ...d.finance,
                  totalPaye: newPaye,
                  soldeRestant: newSolde,
                  pourcentagePaye: pct,
                  statutPaiement: newSolde === 0 ? 'PAYE_TOTAL' : 'ACOMPTE_VERSE',
                  historiquePaiements: [...d.finance.historiquePaiements, nouveauPaiement]
                },
                indicateurs: {
                  ...d.indicateurs,
                  pourcentagePaiement: pct
                }
              };
            }
            return d;
          })
        );
      }
      await refreshData();
      alert('Paiement enregistré avec succès.');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'enregistrement du paiement");
    }
  };

  const handleValiderEtapeSortie = async (
    etape: 1 | 2 | 3 | 4,
    remarques?: string
  ) => {
    if (!selectedDossierId) return;
    try {
      const agentId = currentUser?.id || 'usr-1';
      if (isBackendConnected) {
        await ApiClient.validerEtapeSortie(selectedDossierId, etape, agentId, remarques);
      } else {
        setDossiers((prev) =>
          prev.map((d) => {
            if (d.id === selectedDossierId) {
              const vs = { ...d.validationSortie };
              const etapeObj = {
                estValidee: true,
                valideeParId: currentUser?.id || 'usr-1',
                valideeParNom: currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Agent Responsable',
                dateValidation: new Date().toISOString(),
                remarques
              };
              if (etape === 1) vs.etape1PreparationAgent = etapeObj;
              if (etape === 2) vs.etape2ControleResponsable = etapeObj;
              if (etape === 3) vs.etape3VerificationFinance = etapeObj;
              if (etape === 4) vs.etape4AutorisationDirection = etapeObj;

              const allDone =
                vs.etape1PreparationAgent.estValidee &&
                vs.etape2ControleResponsable.estValidee &&
                vs.etape3VerificationFinance.estValidee &&
                vs.etape4AutorisationDirection.estValidee;

              vs.estCompletementAutorisee = allDone;

              return {
                ...d,
                statut: allDone ? ('AUTORISATION_VALIDEE' as const) : d.statut,
                validationSortie: vs,
                indicateurs: {
                  ...d.indicateurs,
                  sortieAutorisee: allDone
                }
              };
            }
            return d;
          })
        );
      }
      await refreshData();
      alert(`Étape ${etape} validée avec succès.`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la validation');
    }
  };

  const handleNouvelleAdmissionSubmit = async (payload: {
    defunt: DossierVivant['defunt'];
    demandeur: DossierVivant['demandeur'];
  }) => {
    setIsNewAdmissionOpen(false);
    const agentId = currentUser?.id || 'usr-1';
    if (isBackendConnected) {
      const nouveau = await ApiClient.creerDossier({ ...payload, agentId });
      setSelectedDossierId(nouveau.id);
    } else {
      const nouveauNum = `#NMG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const fakeDossier: DossierVivant = {
        id: `dossier-${Date.now()}`,
        numeroDossier: nouveauNum,
        qrCodeToken: `QR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        dateCreation: new Date().toISOString(),
        dateAdmission: new Date().toISOString(),
        statut: 'ADMIS',
        responsableDossierId: agentId,
        responsableDossierNom: currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Agent Réception',
        defunt: payload.defunt,
        demandeur: payload.demandeur,
        prestations: [
          {
            id: `pr-${Date.now()}`,
            articleId: 'art-1',
            titre: 'Frais d’admission & Enregistrement légal',
            quantite: 1,
            prixUnitaire: 50,
            prixTotal: 50,
            devise: 'USD',
            dateAjout: new Date().toISOString(),
            statut: 'TERMINE'
          }
        ],
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
          estBloquee: false,
          motifsBlocage: []
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
          estBloque: false
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

  // 1. VUE PORTAIL PUBLIC : LANDING PAGE FAMILLES
  // Totalement étanche : aucun bouton, lien ou accès vers le backoffice
  if (pageMode === 'landing') {
    return (
      <>
        <LandingPageView
          onCreateDemand={handleNouvelleAdmissionSubmit}
          onSearchDossier={handleFamilySearch}
        />
        <FamilleSuiviModal
          dossier={familyTrackedDossier}
          isOpen={isFamilyModalOpen}
          onClose={() => setIsFamilyModalOpen(false)}
        />
      </>
    );
  }

  // 2. VUE SÉCURISÉE DU BACKOFFICE : VÉRIFICATION D'AUTHENTIFICATION
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onGoToPublicSite={handleNavigateToLanding}
      />
    );
  }

  // 3. VUE OPÉRATIONNELLE : BACKOFFICE NOMARGUERRIE AUTHENTIFIÉ
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
        onGoToLanding={handleNavigateToLanding}
        onLogout={handleLogout}
        currentUserName={`${currentUser.prenom} ${currentUser.nom}`}
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
