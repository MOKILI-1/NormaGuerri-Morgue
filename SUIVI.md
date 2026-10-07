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
| 06/10/2026 - 23:28 | Calibrage Proportionné, Header & Alignement des 3 CTAs | Réduction proportionnée du bloc logo (36px), suppression du badge 'SOUVERAIN', suppression de 'Consulter les prestations' au header. |
| 06/10/2026 - 23:40 | Restauration Hero 2 Colonnes & Sélecteur Multi-Services Aéré | Rétablissement de la disposition 2 colonnes du Hero (Titre/description à gauche, carte des 3 CTAs à droite). Retrait du badge 'PORTAIL OFFICIEL' et des 5 cartes sous le Hero. Refonte totale de l'Étape 2 du wizard : suppression des onglets tronqués, affichage en grands blocs aérés et lisibles, sélection/désélection simple ou multiple en 1 clic avec état visuel clair (`[✓] Sélectionné`), résumé interactif des prestations retenues. |
| 07/10/2026 - 00:15 | Frais d'admission obligatoires, QR Code médical, actions dossier & coordonnées footer | Retrait de 'Kinshasa' du logo Header et Footer. Frais d'admission automatiquement inclus et verrouillés lors de la création de dossier. Retrait de l'en-tête d'étapes dans le modal. Récépissé étape 3 avec QR Code haute résolution scannable par le corps médical, boutons Copier le résumé complet, Télécharger en PDF (impression directe) et Télécharger l'image QR Code (.PNG). Coordonnées complètes intégrées au Footer (N°10 AV/Mondo, téléphones +243 997 222 228 / +243 833 330 040, email contact@nomargueri.com). |
| 07/10/2026 - 00:35 | 'Trouver un décès' & Recherche Registre Défunts | Remplacement de 'Suivre un dossier' par 'Trouver un décès' au header et au hero. Transformation complète de la modale en Registre des défunts avec recherche par nom/prénom/n° dossier et affichage des fiches défunts. Restauration du footer initial de la Landing Page comme demandé. |
| 07/10/2026 - 00:50 | Back-Office Modulaire React Router, Shell & 2 Pôles (Norma.jpeg) | Implémentation complète de l'architecture Back-Office : (1) Connexion en overlay (`/backoffice/login`), (2) Accueil avec sélection des 2 grandes cases 🟦 MORGUE et 🟩 FUNÉRARIUM (`/backoffice/select-pole`), (3) Composant `<Shell />` global avec navigation latérale et switcher de pôle, (4) Vue d'ensemble adaptative (`/backoffice/dashboard`), (5) Module Opérationnel & Facturation (`/backoffice/ops` et `/invoices`) avec statuts et export PDF officiel, (6) Hub Paiements & Caisse (`/backoffice/payments` et `/verify`) avec historique transactions, sessions de caisse physique guichet et vérification cryptographique des reçus, (7) Catalogue & Paramétrage (`/backoffice/catalog`) multi-pôles, (8) Rapports financiers & multi-devises (`/backoffice/reports` et `/accounting`) avec export CSV/Excel, (9) Gestion des Rôles RBAC (`/backoffice/access` et `/org`). |
| 07/10/2026 - 01:10 | Refonte Flux Back-Office Séquentiel & Design Corporate Santé International | Flux en 3 étapes strictes : (1) Login modal en overlay épuré dès l'accès au back-office, (2) Sélection exclusive parmi les 2 grandes cases nobles 'Morgue' et 'Funérarium', (3) Dashboard adapté aux indicateurs et registres du pôle retenu. Design soft, épuré, digne des plateformes hospitalières internationales (réduction drastique des icônes, typographie soignée, contrastes apaisants). Serveurs dev actifs sur ports 3000 et 4050. |
| 07/10/2026 - 01:30 | Ajustements Landing, Inversion du Flux Back-Office (Path-First + RBAC), Bascule Light/Dark & Storyboard PPTX | **Landing :** Suppression d'Espace Pro (header & footer), catalogue limité à 6 prestations avec bouton 'Voir +', Header 'Trouver un défunt', Hero 'Suivre un dossier' et 'Nos services', footer restructuré (Adresse et Contacts distincts), modal de recherche publique agrandie sans affichage par défaut de défunts, conforme aux 4 volets stricts (identité, dates clés, statut localisation sans n° casier, obsèques).<br/>**Back-Office :** Page des 2 cases Morgue/Funérarium devient la 1ère page d'accueil, déclenchant l'overlay de login sur sélection avec contrôle d'accès strict (RBAC morgue vs funérarium vs Super Admin universel). Intégration du toggle Light / Dark persistant. Dashboards enrichis selon le Storyboard PPTX (Morgue: 18 défunts présents, 42 sortis, 56% occupation, 6.4j séjour, 3 départs prévus; Funérarium: 6/8 salons réservés, 2 cérémonies, 4 convois, devis USD et CDF suivis séparément). |
| 07/10/2026 - 02:00 | Espace Super Admin Dédié, Graphiques Épurés, Retrait Badges/Comptes Test & Footer Centré | **Landing :** Bloc Adresse centré avec « Kinshasa DRC. » sur la 2e ligne, bloc Contacts aligné à droite, harmonisation soignée des icônes.<br/>**Back-Office :** « Portail public » transformé en « Super Admin » (accès au cockpit stratégique). Espace Super Admin dédié (`SuperAdminPage.tsx`) permettant d'assigner les départements et niveaux d'accréditation RBAC (1 à 5), de superviser toutes les opérations avec badge et filtre Pôle (Tous, 🟦 Morgue, 🟩 Funérarium), de tracer les entrées et sorties de chaque dossier avec visas légaux et statuts financiers, et de suivre les finances consolidées. Retrait des badges 'Conservation' et 'Familles' sur `PoleSelectPage.tsx`. Retrait complet des comptes de test au login. Suppression du menu 'Rôles & Accréditations' des pôles Morgue et Funérarium pour le confiner exclusivement au Super Admin. Intégration de graphiques épurés (flux hebdomadaire entrées/sorties et jauge de capacité/occupation en temps réel) sur la vue d'ensemble du dashboard. |

---

## 3. DÉCISIONS TECHNIQUES VALIDÉES & APPLIQUÉES

1. **Port API dédié (4050) :** Choisi pour isoler NomarGuerrie des autres micro-services du poste de développement qui occupaient le port 4000.
2. **Étanchéité Totale de la Landing Page :** Le portail public famille (`/`) ne contient aucun lien ni référence d'accès au Backoffice.
3. **Séparation Stricte des Routes :** L'accès backoffice s'effectue exclusivement via `/backoffice`, protégé par un écran d'authentification nominatif.
4. **Moteur de Règles Strict :** Blocage automatique et explicatif des sorties si le permis d'inhumer fait défaut ou si le solde financier n'est pas intégralement réglé.
5. **Double Validation Séquentielle :** Préparation Agent ➔ Contrôle Responsable ➔ Visa Comptable ➔ Autorisation Direction.
6. **Résilience Congolaise (H04 Hybride) :** Client web capable de basculer en mode autonome / local-first en cas de coupure de liaison externe.
