/**
 * Modèles de domaine fondamentaux pour NomarGuerrie
 * Conforme aux spécifications MOKILI & Documentation Fonctionnelle V2
 */

// ==========================================
// 1. RÔLES ET ACCRÉDITATIONS (M01 / M02)
// ==========================================

export type RoleUtilisateur =
  | 'AGENT_RECEPTION'
  | 'AGENT_MORGUE'
  | 'COMPTABLE'
  | 'MEDICO_LEGAL'
  | 'RESPONSABLE_EXPLOITATION'
  | 'DIRECTION'
  | 'ADMINISTRATEUR';

export type NiveauAccreditation = 1 | 2 | 3 | 4 | 5;

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: RoleUtilisateur;
  niveauAccreditation: NiveauAccreditation;
  estActif: boolean;
  avatarUrl?: string;
  telephone?: string;
  creeLe: string;
}

// ==========================================
// 2. LE DÉFUNT & LE DEMANDEUR
// ==========================================

export type Sexe = 'MASCULIN' | 'FEMININ' | 'INDETERMINE';

export interface Defunt {
  id: string;
  nom: string;
  postnom?: string;
  prenom: string;
  sexe: Sexe;
  dateNaissance?: string;
  dateDeces: string;
  heureDeces?: string;
  lieuDeces: string;
  causeDecesPresumee?: string;
  numCertificatDeces?: string;
  medecinDeclarant?: string;
  photoUrl?: string;
  numeroPieceIdentite?: string;
  typePieceIdentite?: 'PASSEPORT' | 'CARTE_ELECTEUR' | 'PERMIS' | 'AUTRE';
  observationsMedicales?: string;
}

export type TypeDemandeur = 'FAMILLE' | 'PROCHE' | 'AYANT_DROIT' | 'INSTITUTION' | 'AUTORITE_JUDICIAIRE';

export interface Demandeur {
  id: string;
  nom: string;
  prenom: string;
  type: TypeDemandeur;
  lienParente?: string; // ex: Fils, Épouse, Frère, Mandataire
  telephone: string;
  telephoneSecondaire?: string;
  email?: string;
  adresse: string;
  ville: string;
  commune?: string;
  pieceIdentiteNumero?: string;
}

// ==========================================
// 3. EMPLACEMENT & LOGISTIQUE
// ==========================================

export type StatutCase = 'DISPONIBLE' | 'OCCUPEE' | 'RESERVEE' | 'MAINTENANCE';

export interface CaseEmplacement {
  id: string;
  chambreId: string;
  chambreNom: string; // ex: "Chambre A - Froid Positif"
  numeroCase: string; // ex: "Case 14"
  statut: StatutCase;
  temperatureActuelle?: number; // en °C
  dossierActuelId?: string;
  occupeDepuis?: string;
}

export type TypeMouvement =
  | 'ADMISSION'
  | 'TRANSFERT_CASE'
  | 'SORTIE_SOINS'
  | 'RETOUR_SOINS'
  | 'SORTIE_AUTOPSIE'
  | 'RETOUR_AUTOPSIE'
  | 'SORTIE_CEREMONIE'
  | 'SORTIE_DEFINITIVE';

export interface MouvementHistorique {
  id: string;
  dossierId: string;
  dateHeure: string;
  typeMouvement: TypeMouvement;
  sourceEmplacement?: string;
  destinationEmplacement: string;
  agentId: string;
  agentNom: string;
  motif: string;
  observations?: string;
}

// ==========================================
// 4. PRESTATIONS & CATALOGUE SERVICES
// ==========================================

export type CategorieService =
  | 'ADMISSION'
  | 'CONSERVATION'
  | 'TOILETTE_ET_SOINS'
  | 'AUTOPSIE'
  | 'TRANSPORT'
  | 'CEREMONIE'
  | 'FOURNITURE_FUNERAIRE' // ex: Cercueils, urnes
  | 'ADMINISTRATIF';

export interface ArticleCatalogue {
  id: string;
  code: string;
  titre: string;
  description: string;
  categorie: CategorieService;
  prixUnitaire: number;
  devise: 'USD' | 'CDF';
  estStockable: boolean;
  stockDisponible?: number;
  uniteFacturation: 'FORFAIT' | 'JOUR' | 'UNITE';
}

export interface PrestationDossier {
  id: string;
  articleId: string;
  titre: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
  devise: 'USD' | 'CDF';
  dateAjout: string;
  datePlanifiee?: string;
  statut: 'DEMANDE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
  effectuePar?: string;
}

// ==========================================
// 5. FINANCE & FACTURATION
// ==========================================

export type StatutPaiement = 'NON_PAYE' | 'ACOMPTE_VERSE' | 'PAYE_TOTAL' | 'EN_LITIGE';
export type ModePaiement = 'ESPECES' | 'MOBILE_MONEY' | 'VIREMENT_BANCAIRE' | 'CHEQUE' | 'CARTE';

export interface Paiement {
  id: string;
  dossierId: string;
  dateHeure: string;
  montant: number;
  devise: 'USD' | 'CDF';
  modePaiement: ModePaiement;
  referenceRecu: string;
  referencePaiementExterne?: string;
  encaissePar: string;
  quittanceUrl?: string;
  notes?: string;
}

export interface DossierFinanceSummary {
  totalPrestations: number;
  totalPaye: number;
  soldeRestant: number;
  pourcentagePaye: number;
  devise: 'USD' | 'CDF';
  statutPaiement: StatutPaiement;
  historiquePaiements: Paiement[];
}

// ==========================================
// 6. DOCUMENTS & CONFORMITÉ
// ==========================================

export type TypeDocument =
  | 'CERTIFICAT_DECES'
  | 'PERMIS_INHUMER'
  | 'REQUISITION_JUDICIAIRE'
  | 'PIECE_IDENTITE_DEMANDEUR'
  | 'PIECE_IDENTITE_DEFUNT'
  | 'AUTORISATION_TRANSPORT'
  | 'ACTE_NOTARIE'
  | 'PROCES_VERBAL'
  | 'AUTRE';

export interface DocumentDossier {
  id: string;
  dossierId: string;
  titre: string;
  typeDocument: TypeDocument;
  estObligatoire: boolean;
  estValide: boolean;
  dateUpload: string;
  validePar?: string;
  dateValidation?: string;
  fichierUrl: string;
  commentaires?: string;
}

// ==========================================
// 7. DOUBLE VALIDATION & RÈGLES DE SORTIE
// ==========================================

export interface EtapeValidation {
  estValidee: boolean;
  valideeParId?: string;
  valideeParNom?: string;
  dateValidation?: string;
  remarques?: string;
}

export interface DoubleValidationSortie {
  etape1PreparationAgent: EtapeValidation;
  etape2ControleResponsable: EtapeValidation;
  etape3VerificationFinance: EtapeValidation;
  etape4AutorisationDirection: EtapeValidation;
  estCompletementAutorisee: boolean;
  estBloquee: boolean;
  motifsBlocage: string[];
}

// ==========================================
// 8. LE DOSSIER VIVANT (OBJET CENTRAL)
// ==========================================

export type StatutDossier =
  | 'DEMANDE'
  | 'EN_ATTENTE_ADMISSION'
  | 'ADMIS'
  | 'EN_CONSERVATION'
  | 'EN_PREPARATION'
  | 'CONTROLE_EN_COURS'
  | 'AUTORISATION_VALIDEE'
  | 'SORTI'
  | 'ARCHIVE';

export interface IndicateursDossier {
  identificationConforme: boolean;
  documentsRequisTotal: number;
  documentsValidesTotal: number;
  conservationValidee: boolean;
  nombreServicesActifs: number;
  pourcentagePaiement: number;
  sortieAutorisee: boolean;
  prochaineActionAttendue: string;
  estBloque: boolean;
  alerteActive?: string;
}

export interface DossierVivant {
  id: string;
  numeroDossier: string; // ex: "#NMG-2026-002581"
  qrCodeToken: string; // Jetons sécurisé servant pour le scan
  statut: StatutDossier;
  dateCreation: string;
  dateAdmission?: string;
  dateSortiePrevue?: string;
  dateSortieEffective?: string;
  responsableDossierId: string;
  responsableDossierNom: string;

  // Données métiers interconnectées
  defunt: Defunt;
  demandeur: Demandeur;
  emplacementActuel?: CaseEmplacement;
  prestations: PrestationDossier[];
  finance: DossierFinanceSummary;
  documents: DocumentDossier[];
  validationSortie: DoubleValidationSortie;
  indicateurs: IndicateursDossier;

  // Restrictions médico-légales
  estSousScelleJudiciaire: boolean;
  autopsieRequise: boolean;
  autopsieEffectuee: boolean;

  historiqueMouvements: MouvementHistorique[];
}

// ==========================================
// 9. AUDIT TIMELINE IMMUABLE (M16)
// ==========================================

export interface AuditLogEntry {
  id: string;
  dossierId: string;
  dateHeure: string;
  utilisateurId: string;
  utilisateurNom: string;
  utilisateurRole: RoleUtilisateur;
  action: string; // ex: "AFFECTATION_CASE", "AJOUT_PRESTATION", "VALIDATION_DOCUMENT"
  description: string;
  valeursPrecedentes?: Record<string, unknown>;
  valeursNouvelles?: Record<string, unknown>;
  adresseIp?: string;
}

// ==========================================
// 10. TABLEAU DE BORD OPÉRATIONNEL
// ==========================================

export interface TacheFileDuJour {
  id: string;
  dossierId: string;
  numeroDossier: string;
  nomDefunt: string;
  titreTache: string;
  urgence: 'BASSE' | 'NORMALE' | 'HAUTE' | 'CRITIQUE';
  roleCible: RoleUtilisateur;
  dateEcheance?: string;
  actionUrl: string;
}

export interface MetriquesDashboard {
  urgencesCount: number;
  tachesEnAttenteCount: number;
  demandesAValiderCount: number;
  operationsTermineesAujourdhuiCount: number;

  admissionsAujourdhui: number;
  sortiesPrevuesAujourdhui: number;
  transfertsAujourdhui: number;
  prestationsActivesTotal: number;

  chambresOccupation: {
    chambreId: string;
    nom: string;
    capaciteTotale: number;
    casesOccupees: number;
    pourcentageOccupation: number;
    statutAlerte: 'NORMAL' | 'ELEVEE' | 'CRITIQUE';
  }[];

  financeResume: {
    encaisseAujourdhui: number;
    facturesOuvertesCount: number;
    dossiersAvecSoldeCount: number;
    totalImpayes: number;
    devise: 'USD';
  };
}
