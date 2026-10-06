import { DossierVivant } from '@nomarguerrie/shared-types';

export interface ResultatEvaluationRegles {
  sortieAutorisable: boolean;
  estBloquee: boolean;
  motifsBlocage: string[];
  alertes: string[];
  prochaineActionRecommandee: string;
}

/**
 * Moteur de Règles Métier NomarGuerrie
 * Respecte les exigences strictes de la Section 12 de la documentation V2 :
 * « Une sortie ne peut être autorisée que si toutes les conditions sont remplies.
 * Si une condition manque : SORTIE BLOQUÉE avec explication immédiate. »
 */
export class RulesEngineService {
  public static evaluerDossier(dossier: DossierVivant): ResultatEvaluationRegles {
    const motifsBlocage: string[] = [];
    const alertes: string[] = [];

    // Règle 1 : Identité confirmée et pièces d'identification
    if (!dossier.defunt.nom || !dossier.defunt.prenom) {
      motifsBlocage.push('Identité du défunt incomplète ou non confirmée.');
    }

    // Règle 2 : Documents obligatoires
    const docsObligatoiresManquants = dossier.documents.filter(
      (doc) => doc.estObligatoire && !doc.estValide
    );

    if (docsObligatoiresManquants.length > 0) {
      docsObligatoiresManquants.forEach((doc) => {
        motifsBlocage.push(`Document obligatoire non validé : ${doc.titre}.`);
      });
    }

    // Règle 3 : Restrictions médico-légales ou judiciaires
    if (dossier.estSousScelleJudiciaire) {
      motifsBlocage.push('Le corps est sous scellé judiciaire (interdiction formelle de déplacement ou sortie).');
    }

    if (dossier.autopsieRequise && !dossier.autopsieEffectuee) {
      motifsBlocage.push('Autopsie médico-légale requise non encore effectuée.');
    }

    // Règle 4 : Situation financière
    if (dossier.finance.soldeRestant > 0) {
      motifsBlocage.push(
        `Situation financière non soldée : Reste à payer ${dossier.finance.soldeRestant.toFixed(2)} ${dossier.finance.devise}.`
      );
    }

    // Règle 5 : Prestations requises non terminées
    const prestationsEnCours = dossier.prestations.filter(
      (p) => p.statut === 'DEMANDE' || p.statut === 'EN_COURS'
    );
    if (prestationsEnCours.length > 0) {
      alertes.push(
        `${prestationsEnCours.length} prestation(s) encore en cours ou non finalisée(s).`
      );
    }

    const estBloquee = motifsBlocage.length > 0;
    const sortieAutorisable = !estBloquee && prestationsEnCours.length === 0;

    let prochaineActionRecommandee = 'Dossier prêt pour la validation de sortie.';
    if (estBloquee) {
      prochaineActionRecommandee = motifsBlocage[0];
    } else if (prestationsEnCours.length > 0) {
      prochaineActionRecommandee = `Finaliser la prestation : ${prestationsEnCours[0].titre}.`;
    }

    return {
      sortieAutorisable,
      estBloquee,
      motifsBlocage,
      alertes,
      prochaineActionRecommandee
    };
  }
}
