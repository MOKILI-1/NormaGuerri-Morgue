# PLAN DE DÉVELOPPEMENT — NOMARGUERRIE

**Projet :** NomarGuerrie — Plateforme souveraine de gestion du parcours funéraire  
**Méthodologie :** MOKILI Progressive Delivery — Lots testables, modulaires et réversibles  
**Date :** 06 octobre 2026  
**Statut global :** Initialisation du Socle (Lot 0 en cours)

---

## SYNTHÈSE DES LOTS DE DÉVELOPPEMENT

| Lot | Désignation | Objectif Principal | Statut |
|---|---|---|---|
| **Lot 0** | Cadrage, Constitution & Socle Projet | Arborescence monorepo/modulaire, configs, typages fondamentaux | 🟢 Terminé |
| **Lot 1** | Modèle de Données & Schéma Relationnel | Tables Dossier, Défunt, Emplacements, Prestations, Finance, Audit | 🟢 Terminé |
| **Lot 2** | API & Domain Services (Backend Core) | Auth, RBAC contextuel, Case Management, Moteur de règles, QR Code | 🟢 Terminé |
| **Lot 3** | Dashboard Opérationnel (Frontend Core) | Centre de commande "Ma journée", files de tâches par rôle, alertes | 🟢 Terminé |
| **Lot 4** | Dossier Vivant & Scanner QR Contextuel | Interface du dossier unifié, scan caméra/code, timeline d'audit | 🟢 Terminé |
| **Lot 5** | Admissions, Emplacements & Mouvements | Visualisation des chambres/cases, affectation et historique transferts | 🟢 Terminé |
| **Lot 6** | Prestations, Produits & Module Financier | Catalogue de services, facturation liée, encaissements, soldes | 🟢 Terminé |
| **Lot 7** | Double Validation, Règles de Sortie & Docs | Workflow de sortie sécurisé, génération fiches et autorisations | 🟢 Terminé |
| **Lot 8** | Résilience Hors-ligne, Tests & Packaging | Fonctionnement réseau local, Docker Compose, durcissement MOKILI | 🟢 Terminé |

---

## DÉTAIL DES LOTS

### 🟡 LOT 0 — Cadrage, Constitution & Socle Projet
- [x] Inspection exhaustive du dépôt et lecture de la documentation fonctionnelle V2 (PDF 24 pages).
- [x] Chargement du framework central MOKILI depuis le répertoire parent.
- [x] Rédaction et validation des documents de constitution (`MOKILI-PROJECT-SPEC.md`, `AGENTS.md`, `CLAUDE.md`, `PLAN.md`, `SUIVI.md`, `README.md`).
- [x] Initialisation de la structure du projet (`apps/web`, `apps/api`, `packages/shared-types`).
- [x] Configuration des environnements et outillages TypeScript / Tailwind / Vite.

### 🟢 LOT 1 — Modèle de Données & Schéma Relationnel
- [x] Modélisation du Dossier Vivant (`Dossier`, `Defunt`, `Demandeur`, `Admission`).
- [x] Modélisation de la logistique (`Chambre`, `CaseEmplacement`, `MouvementHistorique`).
- [x] Modélisation financière (`PrestationService`, `LigneFacture`, `PaiementEncaissement`).
- [x] Modélisation sécurité & audit (`User`, `Role`, `Permission`, `AuditLogEntry`, `Autorisation`).
- [x] Création des migrations et scripts de seed (données initiales : chambres, types de services, utilisateurs par défaut).

### 🟢 LOT 2 — API & Domain Services (Backend Core)
- [x] M01 Auth & M02 RBAC : Authentification, vérification rôle + contexte.
- [x] Service Dossier : Génération du code unique `#NMG-YYYY-XXXXXX` et du jeton QR Code chiffré.
- [x] Moteur de Règles : Algorithme d'évaluation des prérequis de sortie (documents requis, solde financier, autorisations).
- [x] Endpoints REST documentés et sécurisés sur port 4050.

### 🟢 LOT 3 — Dashboard Opérationnel (Frontend Core)
- [x] Layout principal réactif et sobre (Design épuré adapté au milieu funéraire).
- [x] Vue "Ma Journée" : urgences, tâches en attente, demandes à valider.
- [x] Widget Capacité en temps réel : jauge d'occupation des chambres froides.
- [x] File du jour dynamique adaptée selon le rôle connecté (Agent morgue, Comptable, Responsable, Direction).

### 🟢 LOT 4 — Dossier Vivant & Scanner QR Contextuel
- [x] Composant Scanner QR Code (caméra Web/Mobile & saisie manuelle d'urgence).
- [x] Vue Dossier Vivant : En-tête avec statut, badges d'indicateurs immédiats (Identification, Documents, Conservation, Paiement, Autorisation de sortie).
- [x] Timeline d'audit chronologique avec traçabilité de chaque événement.
- [x] Adaptabilité contextuelle de la vue selon le rôle de l'utilisateur connecté.

### 🟢 LOT 5 — Admissions, Emplacements & Mouvements
- [x] Formulaire d'admission guidé pas-à-pas (anti-saisie multiple).
- [x] Plan interactif des chambres froides et statut des cases (Disponible, Occupée, En maintenance).
- [x] Gestion des mouvements de corps avec motif et mise à jour automatique de la localisation.

### 🟢 LOT 6 — Prestations, Produits & Module Financier
- [x] Catalogue des services et produits funéraires (mise en bière, conservation, cercueils, etc.).
- [x] Rattachement des prestations au dossier vivant avec recalcul instantané des montants dus.
- [x] Module d'encaissement (acomptes, règlements complets) et génération des reçus.
- [x] Affichage en temps réel du statut financier du dossier (Payé, Partiel, Impayé).

### 🟢 LOT 7 — Double Validation, Règles de Sortie & Documents
- [x] Processus de sortie à quadruple étape : Préparation Agent → Contrôle Responsable → Vérification Finance → Autorisation finale.
- [x] Blocage automatique explicatif si des conditions ne sont pas remplies.
- [x] Génération de documents imprimables (Fiche d'admission, Fiche de mouvement, Autorisation de sortie).

### 🟢 LOT 8 — Résilience Hors-ligne, Tests & Packaging
- [x] Cache local et détection d'état réseau pour maintien opérationnel sans Internet.
- [x] Tests de bout-en-bout des parcours critiques (API + Web).
- [x] Conteneurisation Docker Compose pour exécution sur site (serveur local morgue).

### 🟢 LOT 9 — Séparation Landing Page & Backoffice, Authentification et Sécurité
- [x] Suppression complète de tout lien/bouton Backoffice sur la Landing Page publique.
- [x] Séparation stricte des routes : `/` pour le portail public familles et `/backoffice` pour la gestion morgue.
- [x] Écran d'authentification professionnel (`LoginView`) avec 5 profils prédéfinis.
- [x] Suivi public pour les familles (`FamilleSuiviModal`) sans fuite de données internes.
- [x] Validation TypeScript stricte (`tsc`) et build Vite (`vite build`) réussis.

### 🟢 LOT 10 — Charte Graphique H+ Hospital Nomargueri, Disposition RTNC Pay & Workflow Services
- [x] Intégration du logo officiel circulaire H+ Hospital Nomargueri et codes graphiques funérarium/morgue.
- [x] Refonte Landing Page selon la disposition RTNC Pay : 2 sections (Hero 2 colonnes + CTAs ambre + carte engagements + 3 cartes flottantes + Grille tarifaire officielle classée par catégories).
- [x] Workflow interactif de déclaration en 3 étapes : Saisie Défunt/Famille ➔ Proposition interactive des services funéraires avec devis en direct ➔ Récépissé & QR Code.
- [x] Footer avec mention officielle "Propulsé par Mokili" menant vers `https://mokili.io`.
- [x] Tests et compilation 100% verts.
