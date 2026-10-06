import {
  DossierVivant,
  CaseEmplacement,
  ArticleCatalogue,
  Utilisateur,
  AuditLogEntry,
  MetriquesDashboard,
  TacheFileDuJour
} from '@nomarguerrie/shared-types';

export const UTILISATEURS_MOCK: Utilisateur[] = [
  {
    id: 'usr-1',
    nom: 'KABEYA',
    prenom: 'Alain',
    email: 'alain.kabeya@nomarguerrie.cd',
    role: 'AGENT_RECEPTION',
    niveauAccreditation: 2,
    estActif: true,
    telephone: '+243810000001',
    creeLe: '2026-01-15T08:00:00Z'
  },
  {
    id: 'usr-2',
    nom: 'MUTOMBO',
    prenom: 'Éric',
    email: 'eric.mutombo@nomarguerrie.cd',
    role: 'AGENT_MORGUE',
    niveauAccreditation: 2,
    estActif: true,
    telephone: '+243810000002',
    creeLe: '2026-01-15T08:00:00Z'
  },
  {
    id: 'usr-3',
    nom: 'TSHILOMBA',
    prenom: 'Nathalie',
    email: 'nathalie.tshilomba@nomarguerrie.cd',
    role: 'COMPTABLE',
    niveauAccreditation: 3,
    estActif: true,
    telephone: '+243810000003',
    creeLe: '2026-01-15T08:00:00Z'
  },
  {
    id: 'usr-4',
    nom: 'Dr. ILUNGA',
    prenom: 'Christian',
    email: 'dr.ilunga@nomarguerrie.cd',
    role: 'MEDICO_LEGAL',
    niveauAccreditation: 4,
    estActif: true,
    telephone: '+243810000004',
    creeLe: '2026-01-15T08:00:00Z'
  },
  {
    id: 'usr-5',
    nom: 'MUKENDI',
    prenom: 'Serge',
    email: 'serge.mukendi@nomarguerrie.cd',
    role: 'RESPONSABLE_EXPLOITATION',
    niveauAccreditation: 4,
    estActif: true,
    telephone: '+243810000005',
    creeLe: '2026-01-15T08:00:00Z'
  },
  {
    id: 'usr-6',
    nom: 'MBUYI',
    prenom: 'Aimé',
    email: 'direction@nomarguerrie.cd',
    role: 'DIRECTION',
    niveauAccreditation: 5,
    estActif: true,
    telephone: '+243810000006',
    creeLe: '2026-01-15T08:00:00Z'
  }
];

export const CATALOGUE_SERVICES_MOCK: ArticleCatalogue[] = [
  {
    id: 'art-1',
    code: 'SRV-ADM-01',
    titre: 'Frais d’admission & Enregistrement légal',
    description: 'Ouverture du dossier, attribution QR code, enregistrement registre mortuaire et bracelet.',
    categorie: 'ADMISSION',
    prixUnitaire: 50,
    devise: 'USD',
    estStockable: false,
    uniteFacturation: 'FORFAIT'
  },
  {
    id: 'art-2',
    code: 'SRV-CNS-01',
    titre: 'Conservation en chambre froide (Froid standard)',
    description: 'Séjour en case frigorifique régulée (+2°C à +4°C). Facturé par jour.',
    categorie: 'CONSERVATION',
    prixUnitaire: 25,
    devise: 'USD',
    estStockable: false,
    uniteFacturation: 'JOUR'
  },
  {
    id: 'art-3',
    code: 'SRV-SOIN-01',
    titre: 'Toilette mortuaire & Soins de présentation',
    description: 'Lavage, habillage, coiffage et mise en présentation du défunt pour la famille.',
    categorie: 'TOILETTE_ET_SOINS',
    prixUnitaire: 120,
    devise: 'USD',
    estStockable: false,
    uniteFacturation: 'FORFAIT'
  },
  {
    id: 'art-4',
    code: 'SRV-EMB-01',
    titre: 'Thanatopraxie & Embaumement conservatoire',
    description: 'Traitement conservatoire avancé pour rapatriement ou veillée prolongée.',
    categorie: 'TOILETTE_ET_SOINS',
    prixUnitaire: 350,
    devise: 'USD',
    estStockable: false,
    uniteFacturation: 'FORFAIT'
  },
  {
    id: 'art-5',
    code: 'PRD-CER-01',
    titre: 'Cercueil Prestige modèle Acajou',
    description: 'Cercueil en bois massif capitonné avec poignées dorées et croix.',
    categorie: 'FOURNITURE_FUNERAIRE',
    prixUnitaire: 650,
    devise: 'USD',
    estStockable: true,
    stockDisponible: 8,
    uniteFacturation: 'UNITE'
  },
  {
    id: 'art-6',
    code: 'SRV-SAL-01',
    titre: 'Mise à disposition salle de recueillement (Chapelle)',
    description: 'Espace climatisé pour culte d’adieu et recueillement des proches (2 heures).',
    categorie: 'CEREMONIE',
    prixUnitaire: 200,
    devise: 'USD',
    estStockable: false,
    uniteFacturation: 'FORFAIT'
  },
  {
    id: 'art-7',
    code: 'SRV-COR-01',
    titre: 'Transport corbillard grand confort',
    description: 'Déplacement de la morgue vers l’église / lieu de culte et cimetière.',
    categorie: 'TRANSPORT',
    prixUnitaire: 180,
    devise: 'USD',
    estStockable: false,
    uniteFacturation: 'FORFAIT'
  }
];

export const CASES_EMPLACEMENTS_MOCK: CaseEmplacement[] = [
  // Chambre A : Capacité 12 cases
  { id: 'case-a01', chambreId: 'ch-a', chambreNom: 'Chambre A — Standard', numeroCase: 'Case A-01', statut: 'OCCUPEE', temperatureActuelle: 3.2, dossierActuelId: 'dos-2' },
  { id: 'case-a02', chambreId: 'ch-a', chambreNom: 'Chambre A — Standard', numeroCase: 'Case A-02', statut: 'DISPONIBLE', temperatureActuelle: 3.0 },
  { id: 'case-a03', chambreId: 'ch-a', chambreNom: 'Chambre A — Standard', numeroCase: 'Case A-03', statut: 'DISPONIBLE', temperatureActuelle: 2.9 },
  { id: 'case-a04', chambreId: 'ch-a', chambreNom: 'Chambre A — Standard', numeroCase: 'Case A-04', statut: 'OCCUPEE', temperatureActuelle: 3.1 },
  { id: 'case-a05', chambreId: 'ch-a', chambreNom: 'Chambre A — Standard', numeroCase: 'Case A-05', statut: 'MAINTENANCE', temperatureActuelle: 7.5 },
  // Chambre B : Capacité 16 cases
  { id: 'case-b14', chambreId: 'ch-b', chambreNom: 'Chambre B — Conservation Longue', numeroCase: 'Case B-14', statut: 'OCCUPEE', temperatureActuelle: -1.2, dossierActuelId: 'dos-1' },
  { id: 'case-b15', chambreId: 'ch-b', chambreNom: 'Chambre B — Conservation Longue', numeroCase: 'Case B-15', statut: 'DISPONIBLE', temperatureActuelle: -1.0 },
  { id: 'case-b16', chambreId: 'ch-b', chambreNom: 'Chambre B — Conservation Longue', numeroCase: 'Case B-16', statut: 'DISPONIBLE', temperatureActuelle: -1.4 },
  // Chambre C : Médico-Légale
  { id: 'case-c01', chambreId: 'ch-c', chambreNom: 'Chambre C — Médico-Légale', numeroCase: 'Case C-01', statut: 'DISPONIBLE', temperatureActuelle: 2.1 }
];

export const DOSSIERS_MOCK: DossierVivant[] = [
  {
    id: 'dos-1',
    numeroDossier: '#NMG-2026-002581',
    qrCodeToken: 'NMG_TOKEN_2026_002581_SECURE_98X',
    statut: 'EN_CONSERVATION',
    dateCreation: '2026-10-04T09:30:00Z',
    dateAdmission: '2026-10-05T10:15:00Z',
    dateSortiePrevue: '2026-10-12T09:00:00Z',
    responsableDossierId: 'usr-2',
    responsableDossierNom: 'Éric MUTOMBO',
    defunt: {
      id: 'def-1',
      nom: 'KASANDA',
      postnom: 'TSHIYOYO',
      prenom: 'Jean-Luc',
      sexe: 'MASCULIN',
      dateNaissance: '1962-04-12',
      dateDeces: '2026-10-04T05:30:00Z',
      lieuDeces: 'Clinique Ngaliema, Kinshasa',
      causeDecesPresumee: 'Arrêt cardio-respiratoire',
      numCertificatDeces: 'CD-2026-KN-941',
      medecinDeclarant: 'Dr. Mbayo Laurent',
      numeroPieceIdentite: 'ID-KN-892182',
      typePieceIdentite: 'CARTE_ELECTEUR',
      observationsMedicales: 'Aucune restriction infectieuse.'
    },
    demandeur: {
      id: 'dem-1',
      nom: 'KASANDA',
      prenom: 'Grâce',
      type: 'FAMILLE',
      lienParente: 'Fille aînée',
      telephone: '+243825551234',
      email: 'grace.kasanda@gmail.com',
      adresse: 'Av. de la Justice n°45, Gombe',
      ville: 'Kinshasa'
    },
    emplacementActuel: {
      id: 'case-b14',
      chambreId: 'ch-b',
      chambreNom: 'Chambre B — Conservation Longue',
      numeroCase: 'Case B-14',
      statut: 'OCCUPEE',
      temperatureActuelle: -1.2,
      dossierActuelId: 'dos-1'
    },
    prestations: [
      { id: 'pr-1', articleId: 'art-1', titre: 'Frais d’admission & Enregistrement', quantite: 1, prixUnitaire: 50, prixTotal: 50, devise: 'USD', dateAjout: '2026-10-05', statut: 'TERMINE' },
      { id: 'pr-2', articleId: 'art-2', titre: 'Conservation en chambre froide', quantite: 7, prixUnitaire: 25, prixTotal: 175, devise: 'USD', dateAjout: '2026-10-05', statut: 'EN_COURS' },
      { id: 'pr-3', articleId: 'art-3', titre: 'Toilette mortuaire & Soins', quantite: 1, prixUnitaire: 120, prixTotal: 120, devise: 'USD', dateAjout: '2026-10-05', statut: 'DEMANDE' },
      { id: 'pr-4', articleId: 'art-5', titre: 'Cercueil Prestige modèle Acajou', quantite: 1, prixUnitaire: 650, prixTotal: 650, devise: 'USD', dateAjout: '2026-10-05', statut: 'DEMANDE' },
      { id: 'pr-5', articleId: 'art-7', titre: 'Transport corbillard', quantite: 1, prixUnitaire: 180, prixTotal: 180, devise: 'USD', dateAjout: '2026-10-05', statut: 'DEMANDE' }
    ],
    finance: {
      totalPrestations: 1175,
      totalPaye: 822.5,
      soldeRestant: 352.5,
      pourcentagePaye: 70,
      devise: 'USD',
      statutPaiement: 'ACOMPTE_VERSE',
      historiquePaiements: [
        {
          id: 'pay-1',
          dossierId: 'dos-1',
          dateHeure: '2026-10-05T11:00:00Z',
          montant: 822.5,
          devise: 'USD',
          modePaiement: 'ESPECES',
          referenceRecu: 'RC-2026-00192',
          encaissePar: 'Nathalie TSHILOMBA'
        }
      ]
    },
    documents: [
      { id: 'doc-1', dossierId: 'dos-1', titre: 'Certificat de Décès Médical', typeDocument: 'CERTIFICAT_DECES', estObligatoire: true, estValide: true, dateUpload: '2026-10-05', fichierUrl: '/docs/certificat-kasanda.pdf' },
      { id: 'doc-2', dossierId: 'dos-1', titre: 'Pièce d’identité du Demandeur', typeDocument: 'PIECE_IDENTITE_DEMANDEUR', estObligatoire: true, estValide: true, dateUpload: '2026-10-05', fichierUrl: '/docs/id-demandeur.pdf' },
      { id: 'doc-3', dossierId: 'dos-1', titre: 'Permis d’inhumer de l’Officier d’État Civil', typeDocument: 'PERMIS_INHUMER', estObligatoire: true, estValide: false, dateUpload: '2026-10-06', fichierUrl: '', commentaires: 'En attente de délivrance à l’Hôtel de Ville de Kinshasa' }
    ],
    validationSortie: {
      etape1PreparationAgent: { estValidee: false },
      etape2ControleResponsable: { estValidee: false },
      etape3VerificationFinance: { estValidee: false },
      etape4AutorisationDirection: { estValidee: false },
      estCompletementAutorisee: false,
      estBloquee: true,
      motifsBlocage: [
        'Permis d’inhumer obligatoire manquant ou non validé',
        'Solde restant dû de 352.50 USD à apurer avant autorisation finale'
      ]
    },
    indicateurs: {
      identificationConforme: true,
      documentsRequisTotal: 3,
      documentsValidesTotal: 2,
      conservationValidee: true,
      nombreServicesActifs: 5,
      pourcentagePaiement: 70,
      sortieAutorisee: false,
      prochaineActionAttendue: 'Réceptionner le permis d’inhumer officiel et apurer le solde financier.',
      estBloque: true,
      alerteActive: 'Document obligatoire manquant : Permis d’inhumer.'
    },
    estSousScelleJudiciaire: false,
    autopsieRequise: false,
    autopsieEffectuee: false,
    historiqueMouvements: [
      {
        id: 'mvt-1',
        dossierId: 'dos-1',
        dateHeure: '2026-10-05T10:30:00Z',
        typeMouvement: 'ADMISSION',
        sourceEmplacement: 'Véhicule Ambulancier',
        destinationEmplacement: 'Chambre B — Case 14',
        agentId: 'usr-2',
        agentNom: 'Éric MUTOMBO',
        motif: 'Admission initiale après contrôle d’identité et braceletage.'
      }
    ]
  },
  {
    id: 'dos-2',
    numeroDossier: '#NMG-2026-002574',
    qrCodeToken: 'NMG_TOKEN_2026_002574_SECURE_12Z',
    statut: 'CONTROLE_EN_COURS',
    dateCreation: '2026-10-01T14:00:00Z',
    dateAdmission: '2026-10-01T15:20:00Z',
    dateSortiePrevue: '2026-10-06T14:30:00Z',
    responsableDossierId: 'usr-5',
    responsableDossierNom: 'Serge MUKENDI',
    defunt: {
      id: 'def-2',
      nom: 'BOMPIMO',
      prenom: 'Henriette',
      sexe: 'FEMININ',
      dateNaissance: '1948-11-03',
      dateDeces: '2026-10-01T11:00:00Z',
      lieuDeces: 'Hôpital Général de Référence, Kinshasa',
      causeDecesPresumee: 'Vieillesse',
      numCertificatDeces: 'CD-2026-KN-910',
      medecinDeclarant: 'Dr. Kalombo P.',
      numeroPieceIdentite: 'ID-KN-129481',
      typePieceIdentite: 'PASSEPORT'
    },
    demandeur: {
      id: 'dem-2',
      nom: 'BOMPIMO',
      prenom: 'Marc',
      type: 'FAMILLE',
      lienParente: 'Fils',
      telephone: '+243812345678',
      adresse: 'Av. Kasa-Vubu n°112, Bandalungwa',
      ville: 'Kinshasa'
    },
    emplacementActuel: {
      id: 'case-a01',
      chambreId: 'ch-a',
      chambreNom: 'Chambre A — Standard',
      numeroCase: 'Case A-01',
      statut: 'OCCUPEE',
      temperatureActuelle: 3.2,
      dossierActuelId: 'dos-2'
    },
    prestations: [
      { id: 'pr-10', articleId: 'art-1', titre: 'Frais d’admission', quantite: 1, prixUnitaire: 50, prixTotal: 50, devise: 'USD', dateAjout: '2026-10-01', statut: 'TERMINE' },
      { id: 'pr-11', articleId: 'art-2', titre: 'Conservation', quantite: 5, prixUnitaire: 25, prixTotal: 125, devise: 'USD', dateAjout: '2026-10-01', statut: 'TERMINE' },
      { id: 'pr-12', articleId: 'art-3', titre: 'Toilette & Soins', quantite: 1, prixUnitaire: 120, prixTotal: 120, devise: 'USD', dateAjout: '2026-10-01', statut: 'TERMINE' }
    ],
    finance: {
      totalPrestations: 295,
      totalPaye: 295,
      soldeRestant: 0,
      pourcentagePaye: 100,
      devise: 'USD',
      statutPaiement: 'PAYE_TOTAL',
      historiquePaiements: [
        {
          id: 'pay-2',
          dossierId: 'dos-2',
          dateHeure: '2026-10-06T09:00:00Z',
          montant: 295,
          devise: 'USD',
          modePaiement: 'ESPECES',
          referenceRecu: 'RC-2026-00214',
          encaissePar: 'Nathalie TSHILOMBA'
        }
      ]
    },
    documents: [
      { id: 'doc-10', dossierId: 'dos-2', titre: 'Certificat de Décès', typeDocument: 'CERTIFICAT_DECES', estObligatoire: true, estValide: true, dateUpload: '2026-10-01', fichierUrl: '/docs/cert-bompimo.pdf' },
      { id: 'doc-11', dossierId: 'dos-2', titre: 'Permis d’inhumer', typeDocument: 'PERMIS_INHUMER', estObligatoire: true, estValide: true, dateUpload: '2026-10-05', fichierUrl: '/docs/permis-bompimo.pdf' },
      { id: 'doc-12', dossierId: 'dos-2', titre: 'Pièce identité famille', typeDocument: 'PIECE_IDENTITE_DEMANDEUR', estObligatoire: true, estValide: true, dateUpload: '2026-10-01', fichierUrl: '/docs/id-bompimo.pdf' }
    ],
    validationSortie: {
      etape1PreparationAgent: { estValidee: true, valideeParNom: 'Éric MUTOMBO', dateValidation: '2026-10-06T10:00:00Z' },
      etape2ControleResponsable: { estValidee: true, valideeParNom: 'Serge MUKENDI', dateValidation: '2026-10-06T10:30:00Z' },
      etape3VerificationFinance: { estValidee: true, valideeParNom: 'Nathalie TSHILOMBA', dateValidation: '2026-10-06T11:00:00Z' },
      etape4AutorisationDirection: { estValidee: false }, // En attente du clic final de la Direction
      estCompletementAutorisee: false,
      estBloquee: false,
      motifsBlocage: []
    },
    indicateurs: {
      identificationConforme: true,
      documentsRequisTotal: 3,
      documentsValidesTotal: 3,
      conservationValidee: true,
      nombreServicesActifs: 3,
      pourcentagePaiement: 100,
      sortieAutorisee: false,
      prochaineActionAttendue: 'Signature finale de l’autorisation de sortie par la Direction.',
      estBloque: false
    },
    estSousScelleJudiciaire: false,
    autopsieRequise: false,
    autopsieEffectuee: false,
    historiqueMouvements: [
      {
        id: 'mvt-2',
        dossierId: 'dos-2',
        dateHeure: '2026-10-01T15:30:00Z',
        typeMouvement: 'ADMISSION',
        destinationEmplacement: 'Chambre A — Case 01',
        agentId: 'usr-2',
        agentNom: 'Éric MUTOMBO',
        motif: 'Admission initiale'
      }
    ]
  }
];

export const AUDIT_LOGS_MOCK: AuditLogEntry[] = [
  {
    id: 'aud-1',
    dossierId: 'dos-1',
    dateHeure: '2026-10-05T10:15:00Z',
    utilisateurId: 'usr-1',
    utilisateurNom: 'Alain KABEYA',
    utilisateurRole: 'AGENT_RECEPTION',
    action: 'CREATION_DOSSIER',
    description: 'Enregistrement de la demande et admission du défunt Jean-Luc KASANDA TSHIYOYO.'
  },
  {
    id: 'aud-2',
    dossierId: 'dos-1',
    dateHeure: '2026-10-05T10:30:00Z',
    utilisateurId: 'usr-2',
    utilisateurNom: 'Éric MUTOMBO',
    utilisateurRole: 'AGENT_MORGUE',
    action: 'AFFECTATION_CASE',
    description: 'Affectation en Chambre B — Case 14 après vérification physique du bracelet.'
  },
  {
    id: 'aud-3',
    dossierId: 'dos-1',
    dateHeure: '2026-10-05T11:00:00Z',
    utilisateurId: 'usr-3',
    utilisateurNom: 'Nathalie TSHILOMBA',
    utilisateurRole: 'COMPTABLE',
    action: 'ENCAISSEMENT_ACOMPTE',
    description: 'Encaissement acompte de 822.50 USD en espèces (Reçu n° RC-2026-00192).'
  }
];

export const TACHES_FILE_DU_JOUR_MOCK: TacheFileDuJour[] = [
  {
    id: 'tch-1',
    dossierId: 'dos-1',
    numeroDossier: '#NMG-2026-002581',
    nomDefunt: 'Jean-Luc KASANDA',
    titreTache: 'Contrôler état de conservation frigorifique en Case B-14',
    urgence: 'NORMALE',
    roleCible: 'AGENT_MORGUE',
    actionUrl: '/dossiers/dos-1'
  },
  {
    id: 'tch-2',
    dossierId: 'dos-1',
    numeroDossier: '#NMG-2026-002581',
    nomDefunt: 'Jean-Luc KASANDA',
    titreTache: 'Relancer la famille pour le dépôt du permis d’inhumer officiel',
    urgence: 'HAUTE',
    roleCible: 'AGENT_RECEPTION',
    actionUrl: '/dossiers/dos-1'
  },
  {
    id: 'tch-3',
    dossierId: 'dos-2',
    numeroDossier: '#NMG-2026-002574',
    nomDefunt: 'Henriette BOMPIMO',
    titreTache: 'Autoriser la sortie définitive (Solde 100% réglé, contrôle OK)',
    urgence: 'CRITIQUE',
    roleCible: 'DIRECTION',
    actionUrl: '/dossiers/dos-2'
  }
];

export const METRIQUES_DASHBOARD_MOCK: MetriquesDashboard = {
  urgencesCount: 2,
  tachesEnAttenteCount: 5,
  demandesAValiderCount: 3,
  operationsTermineesAujourdhuiCount: 7,

  admissionsAujourdhui: 4,
  sortiesPrevuesAujourdhui: 2,
  transfertsAujourdhui: 1,
  prestationsActivesTotal: 14,

  chambresOccupation: [
    {
      chambreId: 'ch-a',
      nom: 'Chambre A — Standard',
      capaciteTotale: 12,
      casesOccupees: 11,
      pourcentageOccupation: 92,
      statutAlerte: 'CRITIQUE'
    },
    {
      chambreId: 'ch-b',
      nom: 'Chambre B — Conservation Longue',
      capaciteTotale: 16,
      casesOccupees: 11,
      pourcentageOccupation: 68,
      statutAlerte: 'NORMAL'
    },
    {
      chambreId: 'ch-c',
      nom: 'Chambre C — Médico-Légale',
      capaciteTotale: 4,
      casesOccupees: 3,
      pourcentageOccupation: 75,
      statutAlerte: 'ELEVEE'
    }
  ],

  financeResume: {
    encaisseAujourdhui: 1117.5,
    facturesOuvertesCount: 8,
    dossiersAvecSoldeCount: 4,
    totalImpayes: 2430.0,
    devise: 'USD'
  }
};
