import React, { useState } from 'react';
import { DossierVivant, ArticleCatalogue, PrestationDossier } from '@nomarguerrie/shared-types';
import { LandingPageView } from '../components/LandingPageView';
import { FamilleSuiviModal } from '../components/FamilleSuiviModal';
import { ApiClient } from '../services/api';
import { CATALOGUE_SERVICES_MOCK, DOSSIERS_MOCK } from '../data/mock-db';

export const LandingPageContainer: React.FC = () => {
  const [dossiers, setDossiers] = useState<DossierVivant[]>(DOSSIERS_MOCK);
  const [catalogue] = useState<ArticleCatalogue[]>(CATALOGUE_SERVICES_MOCK);
  const [familyTrackedDossier, setFamilyTrackedDossier] = useState<DossierVivant | null>(null);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);

  // Soumission d'une nouvelle demande en ligne par la famille
  const handleNouvelleAdmissionSubmit = async (payload: {
    defunt: DossierVivant['defunt'];
    demandeur: DossierVivant['demandeur'];
    prestationsIds?: Record<string, number>;
  }): Promise<DossierVivant> => {
    let dossierCree: DossierVivant;

    const prestations: PrestationDossier[] = [];
    let totalPrestations = 0;

    if (payload.prestationsIds && Object.keys(payload.prestationsIds).length > 0) {
      Object.entries(payload.prestationsIds).forEach(([artId, qte]) => {
        const article = catalogue.find((a) => a.id === artId);
        const titre = article ? article.titre : 'Service funéraire sélectionné';
        const prixUnitaire = article ? article.prixUnitaire : 50;
        const prixTotal = prixUnitaire * qte;

        prestations.push({
          id: `pr-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          articleId: artId,
          titre,
          quantite: qte,
          prixUnitaire,
          prixTotal,
          devise: 'USD',
          dateAjout: new Date().toISOString(),
          statut: 'DEMANDE'
        });
        totalPrestations += prixTotal;
      });
    } else {
      prestations.push({
        id: `pr-${Date.now()}`,
        articleId: 'art-adm-00',
        titre: 'Frais d’admission & Ouverture de dossier funéraire',
        quantite: 1,
        prixUnitaire: 50,
        prixTotal: 50,
        devise: 'USD',
        dateAjout: new Date().toISOString(),
        statut: 'DEMANDE'
      });
      totalPrestations = 50;
    }

    const nouveauNum = `#NMG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    dossierCree = {
      id: `dossier-${Date.now()}`,
      numeroDossier: nouveauNum,
      qrCodeToken: `QR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      dateCreation: new Date().toISOString(),
      dateAdmission: new Date().toISOString(),
      statut: 'DEMANDE',
      responsableDossierId: 'usr-1',
      responsableDossierNom: 'Direction Accueil',
      defunt: payload.defunt,
      demandeur: payload.demandeur,
      prestations,
      finance: {
        totalPrestations,
        totalPaye: 0,
        soldeRestant: totalPrestations,
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
        documentsValidesTotal: 0,
        conservationValidee: false,
        nombreServicesActifs: prestations.length,
        pourcentagePaiement: 0,
        sortieAutorisee: false,
        prochaineActionAttendue: 'Validation physique de la dépouille à l’accueil',
        estBloque: false
      },
      estSousScelleJudiciaire: false,
      autopsieRequise: false,
      autopsieEffectuee: false,
      historiqueMouvements: [
        {
          id: `mvt-${Date.now()}`,
          dossierId: `dossier-${Date.now()}`,
          dateHeure: new Date().toISOString(),
          typeMouvement: 'ADMISSION',
          destinationEmplacement: 'Accueil Funérarium',
          agentId: 'usr-1',
          agentNom: 'Portail Famille',
          motif: 'Déclaration préalable en ligne par les ayants droit'
        }
      ]
    };

    setDossiers((prev) => [dossierCree, ...prev]);
    return dossierCree;
  };

  // Recherche de défunt / suivi de dossier
  const handleFamilySearch = async (terme: string) => {
    const cleaned = terme.trim();
    if (!cleaned) return;
    const lower = cleaned.toLowerCase();

    const foundList = dossiers.filter((d) => {
      const nom = d.defunt.nom.toLowerCase();
      const prenom = d.defunt.prenom.toLowerCase();
      const postnom = (d.defunt.postnom || '').toLowerCase();
      const fullName1 = `${prenom} ${nom}`;
      const fullName2 = `${nom} ${prenom}`;
      const numDossier = d.numeroDossier.toLowerCase();
      const numClean = d.numeroDossier.toLowerCase().replace('#', '');
      const qr = d.qrCodeToken.toLowerCase();

      return (
        nom.includes(lower) ||
        prenom.includes(lower) ||
        postnom.includes(lower) ||
        fullName1.includes(lower) ||
        fullName2.includes(lower) ||
        numDossier.includes(lower) ||
        numClean.includes(lower) ||
        qr.includes(lower) ||
        d.id.toLowerCase() === lower
      );
    });

    if (foundList.length === 1) {
      setFamilyTrackedDossier(foundList[0]);
      setIsFamilyModalOpen(true);
    } else if (foundList.length > 1) {
      setFamilyTrackedDossier(null);
      setIsFamilyModalOpen(true);
    } else {
      alert(
        `Aucun décès trouvé pour "${cleaned}". Vérifiez l'orthographe du nom ou contactez notre accueil 24h/24 au +243 997 222 228 / +243 833 330 040.`
      );
    }
  };

  const [modalMode, setModalMode] = useState<'DEFUNT' | 'DOSSIER'>('DEFUNT');

  const handleOpenSearchModal = (mode: 'DEFUNT' | 'DOSSIER' = 'DEFUNT') => {
    setModalMode(mode);
    setFamilyTrackedDossier(null);
    setIsFamilyModalOpen(true);
  };

  return (
    <>
      <LandingPageView
        catalogue={catalogue}
        onCreateDemand={handleNouvelleAdmissionSubmit}
        onSearchDossier={handleFamilySearch}
        onOpenSearchModal={handleOpenSearchModal}
      />
      <FamilleSuiviModal
        dossier={familyTrackedDossier}
        dossiers={dossiers}
        isOpen={isFamilyModalOpen}
        initialMode={modalMode}
        onClose={() => {
          setIsFamilyModalOpen(false);
          setFamilyTrackedDossier(null);
        }}
        onSearch={handleFamilySearch}
        onSelectDossier={(d) => setFamilyTrackedDossier(d)}
      />
    </>
  );
};
