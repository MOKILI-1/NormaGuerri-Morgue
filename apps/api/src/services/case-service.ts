import {
  DossierVivant,
  ModePaiement,
  RoleUtilisateur,
  TacheFileDuJour,
  MetriquesDashboard,
  AuditLogEntry,
  PrestationDossier,
  Paiement
} from '@nomarguerrie/shared-types';
import {
  DOSSIERS_MOCK,
  CASES_EMPLACEMENTS_MOCK,
  CATALOGUE_SERVICES_MOCK,
  UTILISATEURS_MOCK,
  AUDIT_LOGS_MOCK,
  TACHES_FILE_DU_JOUR_MOCK,
  METRIQUES_DASHBOARD_MOCK
} from '../data/mock-db';
import { RulesEngineService } from './rules-engine';
import { QrService } from './qr-service';

export class CaseService {
  private static dossiers: DossierVivant[] = [...DOSSIERS_MOCK];
  private static auditLogs: AuditLogEntry[] = [...AUDIT_LOGS_MOCK];
  private static cases: typeof CASES_EMPLACEMENTS_MOCK = [...CASES_EMPLACEMENTS_MOCK];

  public static getTousLesDossiers(filtreTexte?: string): DossierVivant[] {
    if (!filtreTexte) return this.dossiers;
    const search = filtreTexte.toLowerCase().trim();
    return this.dossiers.filter(
      (d) =>
        d.numeroDossier.toLowerCase().includes(search) ||
        d.numeroDossier.toLowerCase().replace('#', '').includes(search) ||
        d.defunt.nom.toLowerCase().includes(search) ||
        d.defunt.prenom.toLowerCase().includes(search) ||
        (d.defunt.postnom && d.defunt.postnom.toLowerCase().includes(search)) ||
        `${d.defunt.prenom} ${d.defunt.nom}`.toLowerCase().includes(search) ||
        `${d.defunt.nom} ${d.defunt.prenom}`.toLowerCase().includes(search) ||
        d.demandeur.nom.toLowerCase().includes(search)
    );
  }

  public static getDossierParId(id: string): DossierVivant | undefined {
    return this.dossiers.find((d) => d.id === id);
  }

  public static getDossierParTokenOuNumero(tokenOuNumero: string): DossierVivant | undefined {
    const clean = tokenOuNumero.trim().toLowerCase();
    return this.dossiers.find(
      (d) =>
        d.qrCodeToken.toLowerCase() === clean ||
        d.numeroDossier.toLowerCase() === clean ||
        d.numeroDossier.toLowerCase().replace('#', '') === clean ||
        d.id.toLowerCase() === clean ||
        d.defunt.nom.toLowerCase() === clean ||
        d.defunt.prenom.toLowerCase() === clean ||
        `${d.defunt.prenom} ${d.defunt.nom}`.toLowerCase() === clean ||
        `${d.defunt.nom} ${d.defunt.prenom}`.toLowerCase() === clean
    );
  }

  public static getCases(): typeof CASES_EMPLACEMENTS_MOCK {
    return this.cases;
  }

  public static getCatalogue(): typeof CATALOGUE_SERVICES_MOCK {
    return CATALOGUE_SERVICES_MOCK;
  }

  public static getAuditLogs(dossierId?: string): AuditLogEntry[] {
    if (!dossierId) return this.auditLogs;
    return this.auditLogs.filter((a) => a.dossierId === dossierId);
  }

  public static getMetriquesDashboard(): MetriquesDashboard {
    // Calcul dynamique de l'occupation
    const updatedChambres = METRIQUES_DASHBOARD_MOCK.chambresOccupation.map((ch) => {
      const casesTotal = this.cases.filter((c) => c.chambreId === ch.chambreId);
      const casesOccupees = casesTotal.filter((c) => c.statut === 'OCCUPEE').length;
      const capacite = casesTotal.length || ch.capaciteTotale;
      const pct = Math.round((casesOccupees / capacite) * 100);
      return {
        ...ch,
        capaciteTotale: capacite,
        casesOccupees,
        pourcentageOccupation: pct,
        statutAlerte: (pct >= 90 ? 'CRITIQUE' : pct >= 75 ? 'ELEVEE' : 'NORMAL') as 'CRITIQUE' | 'ELEVEE' | 'NORMAL'
      };
    });

    return {
      ...METRIQUES_DASHBOARD_MOCK,
      chambresOccupation: updatedChambres
    };
  }

  public static getFileDuJour(role?: RoleUtilisateur): TacheFileDuJour[] {
    if (!role) return TACHES_FILE_DU_JOUR_MOCK;
    return TACHES_FILE_DU_JOUR_MOCK.filter((t) => t.roleCible === role);
  }

  /**
   * Création d'une nouvelle admission / dossier vivant
   */
  public static creerDossier(
    payload: {
      defunt: DossierVivant['defunt'];
      demandeur: DossierVivant['demandeur'];
      observations?: string;
    },
    agentId: string
  ): DossierVivant {
    const agent = UTILISATEURS_MOCK.find((u) => u.id === agentId) || UTILISATEURS_MOCK[0];
    const annee = new Date().getFullYear();
    const count = this.dossiers.length + 1;
    const numDossier = `#NMG-${annee}-${String(count).padStart(6, '0')}`;
    const token = QrService.genererJetonSecurise(numDossier);
    const dossierId = `dos-${Date.now()}`;

    // Prestation initiale d'admission
    const fraisAdmission = CATALOGUE_SERVICES_MOCK[0];
    const prestationInitiale: PrestationDossier = {
      id: `pr-${Date.now()}-adm`,
      articleId: fraisAdmission.id,
      titre: fraisAdmission.titre,
      quantite: 1,
      prixUnitaire: fraisAdmission.prixUnitaire,
      prixTotal: fraisAdmission.prixUnitaire,
      devise: fraisAdmission.devise,
      dateAjout: new Date().toISOString(),
      statut: 'TERMINE'
    };

    const nouveauDossier: DossierVivant = {
      id: dossierId,
      numeroDossier: numDossier,
      qrCodeToken: token,
      statut: 'EN_ATTENTE_ADMISSION',
      dateCreation: new Date().toISOString(),
      dateAdmission: new Date().toISOString(),
      responsableDossierId: agent.id,
      responsableDossierNom: `${agent.prenom} ${agent.nom}`,
      defunt: payload.defunt,
      demandeur: payload.demandeur,
      prestations: [prestationInitiale],
      finance: {
        totalPrestations: fraisAdmission.prixUnitaire,
        totalPaye: 0,
        soldeRestant: fraisAdmission.prixUnitaire,
        pourcentagePaye: 0,
        devise: 'USD',
        statutPaiement: 'NON_PAYE',
        historiquePaiements: []
      },
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          dossierId,
          titre: 'Certificat de Décès',
          typeDocument: 'CERTIFICAT_DECES',
          estObligatoire: true,
          estValide: false,
          dateUpload: new Date().toISOString(),
          fichierUrl: ''
        },
        {
          id: `doc-${Date.now()}-2`,
          dossierId,
          titre: 'Pièce d’identité Demandeur',
          typeDocument: 'PIECE_IDENTITE_DEMANDEUR',
          estObligatoire: true,
          estValide: true,
          dateUpload: new Date().toISOString(),
          fichierUrl: ''
        },
        {
          id: `doc-${Date.now()}-3`,
          dossierId,
          titre: 'Permis d’inhumer',
          typeDocument: 'PERMIS_INHUMER',
          estObligatoire: true,
          estValide: false,
          dateUpload: new Date().toISOString(),
          fichierUrl: ''
        }
      ],
      validationSortie: {
        etape1PreparationAgent: { estValidee: false },
        etape2ControleResponsable: { estValidee: false },
        etape3VerificationFinance: { estValidee: false },
        etape4AutorisationDirection: { estValidee: false },
        estCompletementAutorisee: false,
        estBloquee: true,
        motifsBlocage: ['Admission récente : documents et solde en attente']
      },
      indicateurs: {
        identificationConforme: true,
        documentsRequisTotal: 3,
        documentsValidesTotal: 1,
        conservationValidee: false,
        nombreServicesActifs: 1,
        pourcentagePaiement: 0,
        sortieAutorisee: false,
        prochaineActionAttendue: 'Attribuer une case frigorifique et réceptionner le certificat de décès.',
        estBloque: true,
        alerteActive: 'Emplacement non encore attribué.'
      },
      estSousScelleJudiciaire: false,
      autopsieRequise: false,
      autopsieEffectuee: false,
      historiqueMouvements: []
    };

    // Recalculer règles
    this.recalculerEtatDossier(nouveauDossier);

    this.dossiers.unshift(nouveauDossier);

    // Enregistrer dans l'audit timeline
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      dossierId,
      dateHeure: new Date().toISOString(),
      utilisateurId: agent.id,
      utilisateurNom: `${agent.prenom} ${agent.nom}`,
      utilisateurRole: agent.role,
      action: 'CREATION_DOSSIER',
      description: `Création du dossier ${numDossier} pour le défunt ${payload.defunt.prenom} ${payload.defunt.nom}.`
    });

    return nouveauDossier;
  }

  /**
   * Affecter ou changer de case frigorifique
   */
  public static affecterEmplacement(dossierId: string, caseId: string, agentId: string, motif?: string): DossierVivant {
    const dossier = this.getDossierParId(dossierId);
    if (!dossier) throw new Error('Dossier introuvable.');

    const targetCase = this.cases.find((c) => c.id === caseId);
    if (!targetCase) throw new Error('Case introuvable.');
    if (targetCase.statut === 'OCCUPEE' && targetCase.dossierActuelId !== dossierId) {
      throw new Error(`La ${targetCase.numeroCase} de la ${targetCase.chambreNom} est déjà occupée.`);
    }

    const agent = UTILISATEURS_MOCK.find((u) => u.id === agentId) || UTILISATEURS_MOCK[1];
    const sourceEmplacementNom = dossier.emplacementActuel
      ? `${dossier.emplacementActuel.chambreNom} — ${dossier.emplacementActuel.numeroCase}`
      : 'Espace Réception / Arrivée';

    // Libérer l'ancienne case si existante
    if (dossier.emplacementActuel) {
      const ancienneCase = this.cases.find((c) => c.id === dossier.emplacementActuel?.id);
      if (ancienneCase) {
        ancienneCase.statut = 'DISPONIBLE';
        ancienneCase.dossierActuelId = undefined;
      }
    }

    // Occuper la nouvelle case
    targetCase.statut = 'OCCUPEE';
    targetCase.dossierActuelId = dossier.id;
    targetCase.occupeDepuis = new Date().toISOString();

    dossier.emplacementActuel = { ...targetCase };
    dossier.statut = 'EN_CONSERVATION';
    dossier.indicateurs.conservationValidee = true;

    // Enregistrer le mouvement
    const mvt = {
      id: `mvt-${Date.now()}`,
      dossierId: dossier.id,
      dateHeure: new Date().toISOString(),
      typeMouvement: 'TRANSFERT_CASE' as const,
      sourceEmplacement: sourceEmplacementNom,
      destinationEmplacement: `${targetCase.chambreNom} — ${targetCase.numeroCase}`,
      agentId: agent.id,
      agentNom: `${agent.prenom} ${agent.nom}`,
      motif: motif || 'Affectation de case en chambre froide'
    };
    dossier.historiqueMouvements.unshift(mvt);

    this.recalculerEtatDossier(dossier);

    // Audit log
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      dossierId: dossier.id,
      dateHeure: new Date().toISOString(),
      utilisateurId: agent.id,
      utilisateurNom: `${agent.prenom} ${agent.nom}`,
      utilisateurRole: agent.role,
      action: 'AFFECTATION_CASE',
      description: `Déplacement vers ${targetCase.chambreNom} — ${targetCase.numeroCase}. Motif : ${motif || 'Attribution de conservation'}.`
    });

    return dossier;
  }

  /**
   * Ajouter une prestation ou un produit (ex: cercueil, thanatopraxie)
   */
  public static ajouterPrestation(
    dossierId: string,
    articleId: string,
    quantite: number,
    agentId: string
  ): DossierVivant {
    const dossier = this.getDossierParId(dossierId);
    if (!dossier) throw new Error('Dossier introuvable.');

    const article = CATALOGUE_SERVICES_MOCK.find((a) => a.id === articleId);
    if (!article) throw new Error('Article ou prestation introuvable au catalogue.');

    const agent = UTILISATEURS_MOCK.find((u) => u.id === agentId) || UTILISATEURS_MOCK[2];
    const totalLigne = article.prixUnitaire * quantite;

    const nouvellePrestation: PrestationDossier = {
      id: `pr-${Date.now()}`,
      articleId: article.id,
      titre: article.titre,
      quantite,
      prixUnitaire: article.prixUnitaire,
      prixTotal: totalLigne,
      devise: article.devise,
      dateAjout: new Date().toISOString(),
      statut: 'DEMANDE'
    };

    dossier.prestations.push(nouvellePrestation);

    // Recalcul financier automatique
    dossier.finance.totalPrestations += totalLigne;
    dossier.finance.soldeRestant = dossier.finance.totalPrestations - dossier.finance.totalPaye;
    dossier.finance.pourcentagePaye = Math.round(
      (dossier.finance.totalPaye / dossier.finance.totalPrestations) * 100
    );
    dossier.finance.statutPaiement =
      dossier.finance.soldeRestant <= 0
        ? 'PAYE_TOTAL'
        : dossier.finance.totalPaye > 0
        ? 'ACOMPTE_VERSE'
        : 'NON_PAYE';

    this.recalculerEtatDossier(dossier);

    // Audit log
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      dossierId: dossier.id,
      dateHeure: new Date().toISOString(),
      utilisateurId: agent.id,
      utilisateurNom: `${agent.prenom} ${agent.nom}`,
      utilisateurRole: agent.role,
      action: 'AJOUT_PRESTATION',
      description: `Ajout de la prestation "${article.titre}" (Qté: ${quantite}, Montant: ${totalLigne} USD).`
    });

    return dossier;
  }

  /**
   * Enregistrer un encaissement (acompte ou solde)
   */
  public static enregistrerPaiement(
    dossierId: string,
    montant: number,
    mode: ModePaiement,
    agentId: string,
    notes?: string
  ): DossierVivant {
    const dossier = this.getDossierParId(dossierId);
    if (!dossier) throw new Error('Dossier introuvable.');

    if (montant <= 0) throw new Error('Le montant du paiement doit être supérieur à zéro.');

    const agent = UTILISATEURS_MOCK.find((u) => u.id === agentId) || UTILISATEURS_MOCK[2];
    const refRecu = `RC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;

    const paiement: Paiement = {
      id: `pay-${Date.now()}`,
      dossierId: dossier.id,
      dateHeure: new Date().toISOString(),
      montant,
      devise: dossier.finance.devise,
      modePaiement: mode,
      referenceRecu: refRecu,
      encaissePar: `${agent.prenom} ${agent.nom}`,
      notes
    };

    dossier.finance.historiquePaiements.unshift(paiement);
    dossier.finance.totalPaye += montant;
    dossier.finance.soldeRestant = Math.max(0, dossier.finance.totalPrestations - dossier.finance.totalPaye);
    dossier.finance.pourcentagePaye = Math.min(
      100,
      Math.round((dossier.finance.totalPaye / dossier.finance.totalPrestations) * 100)
    );
    dossier.finance.statutPaiement =
      dossier.finance.soldeRestant <= 0
        ? 'PAYE_TOTAL'
        : dossier.finance.totalPaye > 0
        ? 'ACOMPTE_VERSE'
        : 'NON_PAYE';

    this.recalculerEtatDossier(dossier);

    // Audit log
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      dossierId: dossier.id,
      dateHeure: new Date().toISOString(),
      utilisateurId: agent.id,
      utilisateurNom: `${agent.prenom} ${agent.nom}`,
      utilisateurRole: agent.role,
      action: 'ENCAISSEMENT_PAIEMENT',
      description: `Encaissement de ${montant.toFixed(2)} USD via ${mode} (Reçu ${refRecu}). Solde restant : ${dossier.finance.soldeRestant.toFixed(2)} USD.`
    });

    return dossier;
  }

  /**
   * Double validation séquentielle des sorties (Section 14 de la doc V2)
   */
  public static validerEtapeSortie(
    dossierId: string,
    etape: 1 | 2 | 3 | 4,
    agentId: string,
    remarques?: string
  ): DossierVivant {
    const dossier = this.getDossierParId(dossierId);
    if (!dossier) throw new Error('Dossier introuvable.');

    const agent = UTILISATEURS_MOCK.find((u) => u.id === agentId) || UTILISATEURS_MOCK[4];
    const now = new Date().toISOString();

    const evaluation = RulesEngineService.evaluerDossier(dossier);

    if (etape === 1) {
      // Préparation Agent
      dossier.validationSortie.etape1PreparationAgent = {
        estValidee: true,
        valideeParId: agent.id,
        valideeParNom: `${agent.prenom} ${agent.nom}`,
        dateValidation: now,
        remarques
      };
    } else if (etape === 2) {
      // Contrôle Responsable
      if (!dossier.validationSortie.etape1PreparationAgent.estValidee) {
        throw new Error('L’étape 1 (Préparation par l’agent) doit être validée préalablement.');
      }
      dossier.validationSortie.etape2ControleResponsable = {
        estValidee: true,
        valideeParId: agent.id,
        valideeParNom: `${agent.prenom} ${agent.nom}`,
        dateValidation: now,
        remarques
      };
    } else if (etape === 3) {
      // Vérification Finance
      if (dossier.finance.soldeRestant > 0) {
        throw new Error(`Impossible de valider : solde financier non apuré (${dossier.finance.soldeRestant} USD restants).`);
      }
      dossier.validationSortie.etape3VerificationFinance = {
        estValidee: true,
        valideeParId: agent.id,
        valideeParNom: `${agent.prenom} ${agent.nom}`,
        dateValidation: now,
        remarques
      };
    } else if (etape === 4) {
      // Autorisation Direction
      if (evaluation.estBloquee) {
        throw new Error(`Sortie bloquée par le moteur de règles : ${evaluation.motifsBlocage.join(' | ')}`);
      }
      if (
        !dossier.validationSortie.etape1PreparationAgent.estValidee ||
        !dossier.validationSortie.etape2ControleResponsable.estValidee ||
        !dossier.validationSortie.etape3VerificationFinance.estValidee
      ) {
        throw new Error('Toutes les étapes précédentes (Préparation, Contrôle, Finance) doivent être visées avant l’autorisation finale.');
      }

      dossier.validationSortie.etape4AutorisationDirection = {
        estValidee: true,
        valideeParId: agent.id,
        valideeParNom: `${agent.prenom} ${agent.nom}`,
        dateValidation: now,
        remarques
      };
      dossier.validationSortie.estCompletementAutorisee = true;
      dossier.statut = 'AUTORISATION_VALIDEE';
      dossier.indicateurs.sortieAutorisee = true;
    }

    this.recalculerEtatDossier(dossier);

    // Audit log
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      dossierId: dossier.id,
      dateHeure: now,
      utilisateurId: agent.id,
      utilisateurNom: `${agent.prenom} ${agent.nom}`,
      utilisateurRole: agent.role,
      action: `VALIDATION_SORTIE_ETAPE_${etape}`,
      description: `Validation étape ${etape} pour la sortie du défunt ${dossier.defunt.prenom} ${dossier.defunt.nom}.`
    });

    return dossier;
  }

  /**
   * Met à jour les indicateurs et le moteur de règles sur le dossier vivant
   */
  private static recalculerEtatDossier(dossier: DossierVivant): void {
    const evaluation = RulesEngineService.evaluerDossier(dossier);

    dossier.validationSortie.estBloquee = evaluation.estBloquee;
    dossier.validationSortie.motifsBlocage = evaluation.motifsBlocage;

    const docsValides = dossier.documents.filter((d) => d.estValide).length;
    dossier.indicateurs.documentsValidesTotal = docsValides;
    dossier.indicateurs.documentsRequisTotal = dossier.documents.filter((d) => d.estObligatoire).length;
    dossier.indicateurs.estBloque = evaluation.estBloquee;
    dossier.indicateurs.prochaineActionAttendue = evaluation.prochaineActionRecommandee;
    dossier.indicateurs.alerteActive = evaluation.alertes[0] || (evaluation.estBloquee ? evaluation.motifsBlocage[0] : undefined);
  }
}
