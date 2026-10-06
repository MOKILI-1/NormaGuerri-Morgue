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

---

## 3. DÉCISIONS TECHNIQUES VALIDÉES & APPLIQUÉES

1. **Port API dédié (4050) :** Choisi pour isoler NomarGuerrie des autres micro-services du poste de développement qui occupaient le port 4000.
2. **Moteur de Règles Strict :** Blocage automatique et explicatif des sorties si le permis d'inhumer fait défaut ou si le solde financier n'est pas intégralement réglé.
3. **Double Validation Séquentielle :** Préparation Agent ➔ Contrôle Responsable ➔ Visa Comptable ➔ Autorisation Direction.
4. **Résilience Congolaise (H04 Hybride) :** Client web capable de basculer en mode autonome / local-first en cas de coupure de liaison externe.
