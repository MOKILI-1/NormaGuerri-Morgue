# JOURNAL DE SUIVI DU PROJET — NOMARGUERRIE

**Projet :** NomarGuerrie  
**Organisation :** MOKILI SAS  
**Dernière mise à jour :** 06 octobre 2026  
**Responsable d'orchestration :** MOKILI Master Engine / Antigravity AI  
**Statut Global :** 🟢 Socle et MVP Opérationnel Construit et Validé par Lots Testables

---

## 1. ÉTAT ACTUEL DU PROJET

- **Phase actuelle :** Lots 0 à 8 achevés avec succès.
- **Statut de compilation :**
  - `@nomarguerrie/shared-types` : 🟢 Compilé (0 erreur)
  - `@nomarguerrie/api` : 🟢 Compilé (0 erreur)
  - `@nomarguerrie/web` : 🟢 Compilé via Vite (0 erreur, bundle optimisé)
- **Tests d'exécution API :** 🟢 `http://localhost:4050/api/health` testé et validé (code 200, statut OK).

---

## 2. HISTORIQUE DÉTAILLÉ DES ACTIONS & PREUVES DE TEST

| Date & Heure | Étape / Action | Résultat & Preuve de Test |
|---|---|---|
| 06/10/2026 - 14:40 | Découverte et chargement du framework central MOKILI | Configuration locale validée depuis `C:\Users\MONYANYO\Desktop\MONYANYO\ENTREPRISE\MOKILI\FRAMEWORK`. |
| 06/10/2026 - 15:23 | Analyse exhaustive de la documentation V2 (PDF 24p) | Extraction intégrale des 11 domaines, du modèle de Dossier Vivant et de la double validation de sortie. |
| 06/10/2026 - 15:30 | Création de la constitution technique officielle | `MOKILI-PROJECT-SPEC.md`, `AGENTS.md`, `CLAUDE.md`, `PLAN.md`, `README.md` créés et conformes. |
| 06/10/2026 - 15:48 | Définition des types du domaine métier (`packages/shared-types`) | 100% des entités (Dossier, Défunt, Emplacement, Finance, Audit, RBAC) modélisées avec TypeScript strict. |
| 06/10/2026 - 16:03 | Test compilation `packages/shared-types` | **Preuve :** Commande `tsc` terminée avec code de retour 0. |
| 06/10/2026 - 16:05 | Développement du backend API & Moteur de règles strict | Endpoints REST, générateur de QR Code, double validation et journal d'audit immuable. |
| 06/10/2026 - 16:22 | Test santé HTTP du serveur API sur port 4050 | **Preuve :** Réponse HTTP : `{"status":"OK","service":"NomarGuerrie Core API","version":"1.0.0"}`. |
| 06/10/2026 - 16:23 | Développement et build de l'interface React / Vite | Dashboard proactif, cartographie interactive des chambres, vue Dossier Vivant, scanner QR code. |
| 06/10/2026 - 16:23 | Test compilation du frontend `@nomarguerrie/web` | **Preuve :** Vite v5.4.21 `built in 23.78s`, assets générés avec succès dans `dist/`. |
| 06/10/2026 - 16:25 | Packaging Docker Compose pour résilience locale | Fichiers `docker-compose.yml`, `apps/api/Dockerfile`, `apps/web/Dockerfile` prêts pour déploiement sur site morgue. |
| 06/10/2026 - 21:20 | Module d'authentification et suivi public sécurisé | `LoginView` avec comptes professionnels, `FamilleSuiviModal` public sans fuite de données internes. |
| 06/10/2026 - 21:22 | Test compilation TypeScript & Bundle Vite | **Preuve :** `tsc` et `vite build` 100% verts (code 0, 1509 modules transformés). |
| 06/10/2026 - 22:20 | Intégration Charte H+ Hospital Nomargueri & Disposition RTNC Pay | Intégration du logo officiel, disposition 2 sections RTNC Pay et Footer "Propulsé par Mokili" vers `mokili.io`. |
| 06/10/2026 - 22:22 | Workflow Déclaration en 3 étapes avec proposition des services | Étape 1: Défunt & Famille ➔ Étape 2: Proposition des prestations funéraires ➔ Étape 3: Récépissé & QR Code. |
| 06/10/2026 - 23:20 | Refonte 5 Pôles Funéraires Métier & Retrait Cartes Flottantes | Suppression des 3 cartes flottantes intermédiaires. Implémentation des 5 modules de services personnalisés (Recueillement, Soins thanatopraxie, Boutique cercueils/fleurs, Logistique axe transport & géolocalisation SMS, Assistance administrative & coffre-fort numérique). Masquage strict de tous les prix publics. Charte chromatique Bleu Roi / Bleu Ciel / Deep Navy validée. |
| 06/10/2026 - 23:28 | Calibrage Proportionné, Header & Alignement des 3 CTAs | Réduction proportionnée du bloc logo (36px), suppression du badge 'SOUVERAIN', suppression de 'Consulter les prestations' au header. Remplacement du bloc protocole par les 3 CTAs ordonnés ('Déclarer un décès', 'Suivre un dossier existant', 'Découvrir les 5 pôles de services') et grille harmonieuse d'accès direct aux 5 pôles. |

---

## 3. DÉCISIONS TECHNIQUES VALIDÉES & APPLIQUÉES

1. **Port API dédié (4050) :** Choisi pour isoler NomarGuerrie des autres micro-services du poste de développement qui occupaient le port 4000.
2. **Étanchéité Totale de la Landing Page :** Le portail public famille (`/`) ne contient aucun lien ni référence d'accès au Backoffice.
3. **Séparation Stricte des Routes :** L'accès backoffice s'effectue exclusivement via `/backoffice`, protégé par un écran d'authentification nominatif.
4. **Moteur de Règles Strict :** Blocage automatique et explicatif des sorties si le permis d'inhumer fait défaut ou si le solde financier n'est pas intégralement réglé.
5. **Double Validation Séquentielle :** Préparation Agent ➔ Contrôle Responsable ➔ Visa Comptable ➔ Autorisation Direction.
6. **Résilience Congolaise (H04 Hybride) :** Client web capable de basculer en mode autonome / local-first en cas de coupure de liaison externe.
