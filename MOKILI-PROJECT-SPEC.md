# MOKILI PROJECT SPECIFICATION — NOMARGUERRIE

**Organisation :** MOKILI SAS / Partenaire  
**Projet :** NomarGuerrie  
**Version du document :** 1.0  
**Statut :** Spécification de Cadrage Validée  
**Date :** 06 octobre 2026  
**Référence Framework :** MOKILI FRAMEWORK V1.0 (Core, Profiles, Modules, Hosting, Master V1.1)

---

## 1. IDENTITY & VISION

- **Nom du projet :** NomarGuerrie
- **Nature :** Plateforme souveraine et opérationnelle de gestion du parcours funéraire et des opérations de morgue.
- **Principe fondamental :** *« Le dossier est le centre du système. Tout commence par une demande. Toute demande devient un dossier vivant. »*
- **Slogan / Philosophie :** *« Une donnée saisie une fois. Une action = plusieurs automatisations. L'utilisateur ne doit pas avoir à comprendre la complexité interne pour accomplir son travail. »*

---

## 2. OBJECTIFS & PROBLÉMATIQUE

### Problème résolu
Dans la gestion funéraire traditionnelle (particulièrement en RDC), les flux sont morcelés : saisies manuelles redondantes, risques élevés d'erreurs d'identification, goulots d'étranglement administratifs et financiers, documents égarés, manque de visibilité de la direction, et vulnérabilité absolue aux coupures réseau/Internet.

### Objectifs du système
1. **Dossier Vivant unique :** Référence unique inviolable pour chaque défunt, matérialisée par un QR Code sécurisé.
2. **Dashboard opérationnel proactif :** Ne pas être un simple reporting statistique, mais un chef d'orchestre quotidien indiquant : *Qu'est-ce qui arrive ? Qu'est-ce qui doit être fait ? Qu'est-ce qui est bloqué ? Qu'est-ce qui nécessite une autorisation ?*
3. **Moteur de règles & Double validation :** Blocage automatique des sorties ou mouvements si les conditions (documents obligatoires, solde financier, autorisations judiciaires/médicales) ne sont pas satisfaites.
4. **Résilience et Souveraineté :** Tolérance totale aux coupures réseau grâce à une architecture hybride Cloud + Local (Edge/Local-First), garantissant une continuité de service 24/7 sur site.

---

## 3. UTILISATEURS & ACTEURS (PERSONAS)

1. **Client / Famille / Demandeur :** Initie la demande de services (en ligne ou guichet), suit l'avancement, consulte la facture et effectue les paiements.
2. **Agent de réception :** Traite les demandes entrantes, procède aux admissions, identifie le défunt, vérifie les pièces d'identité et coordonnées.
3. **Agent de morgue (Terrain) :** Scanne les QR codes, attribue et contrôle les emplacements (chambres froides, cases), effectue les soins de conservation, toilettes, transferts internes.
4. **Comptable / Agent Financier :** Gère la tarification des prestations et produits, valide les acomptes et règlements, suit les impayés, autorise la conformité financière.
5. **Médecin légiste / Autorité médico-légale :** Enregistre les autopsies, saisit les restrictions judiciaires, délivre les autorisations médico-légales de sortie.
6. **Responsable d'exploitation :** Supervise les flux journaliers, arbitre les blocages, effectue la double-validation des sorties et transferts.
7. **Direction générale :** Vue macroscopique sur la capacité des chambres, le chiffre d'affaires, les alertes de saturation, l'audit et la performance.
8. **Administrateur système :** Configure les infrastructures (chambres, capacités, tarifs, catalogue de services), gère les utilisateurs et les habilitations.

---

## 4. PÉRIMÈTRE & PROGRESSIVE DELIVERY

### Phase 1 — Core (MVP Immédiat)
- Authentification sécurisée (M01) & RBAC contextuel fin (M02).
- Dashboard opérationnel ("Ma journée", file du jour par rôle, alertes).
- Gestion des Demandes entrantes (guichet & portail simple).
- Gestion du Dossier Vivant avec identifiant unique et QR Code sécurisé.
- Module Admissions & Identification.
- Gestion des Emplacements (chambres, cases, statut d'occupation).
- Mouvements & Traçabilité (changement de case, transferts internes).
- Catalogue des Services funéraires & rattachement au dossier.
- Module Financier basique (devis, facturation automatique, encaissements, soldes).
- Moteur de règles de sortie & double-validation.
- Timeline d'audit immuable (M16).

### Phase 2 — Operations (V1)
- Planning centralisé avec détection de conflits de ressources (salles de culte, corbillards, équipes).
- Gestion de stock (cercueils, urnes, consommables) liée aux prestations.
- Module Médico-légal complet (autopsies, réquisitions judiciaires).
- Système de notifications opérationnelles (M10).

### Phase 3 — Écosystème & Mobilité (V2)
- Portail famille dédié (suivi d'hommages, avis de décès, paiements en ligne).
- Application mobile PWA avancée pour agents de terrain.
- Intégration partenaires (communes, cimetières, transporteurs funéraires).
- Connecteurs MOKILI Ecosystem (Mbongo, Masolo, MOKILI ID, KóTàa).

### Phase 4 — Intelligence (V3)
- Recherche en langage naturel.
- Détection proactive d'anomalies de séjour et alertes saturation prédictive.

---

## 5. CLASSIFICATION & PROFIL MOKILI

- **Profil Principal :** `P13 — Plateforme complexe` (ERP de gestion opérationnelle métier multi-acteurs).
- **Profils Secondaires :**
  - `P14 — Dashboard / Back-office` (Centre de commande orienté action & files de tâches).
  - `P07 — Application web` (Application interactive agents & administration).
  - `P01 — Site vitrine / Landing page` (Portail d'accueil public, prise de demande par les familles).
  - `P09 — API / Backend` (Endpoints REST sécurisés, logique de scan QR, synchronisation).

---

## 6. ARCHITECTURE TECHNIQUE

- **Niveau Architectural :** **Niveau C/D — Monolithe Modulaire Hybride & Synchronisable**.
- **Topologie :**
  ```text
  [ Client Public / Portail ]      [ Agents / Terminaux Mobiles ]
              │                                   │
              ▼                                   ▼
      Cloud Edge / VPS                   Serveur Local Morgue (Sur site)
    (Next / Astro / React)               (Node.js + MySQL Local)
              │                                   │
              └──────── Asynchronous Sync ────────┘
                      (Queue & Event Ledger)
  ```
- **Services de Domaine Internes (Modular Monolith) :**
  1. `CaseManagementService` (Dossier, défunt, demandeur, QR Code).
  2. `WorkflowRulesEngine` (Validation, conditions de sortie, contrôles bloquants).
  3. `AdmissionLocationService` (Chambres froides, cases, transferts, mouvements).
  4. `FinanceBillingService` (Prestations, factures, acomptes, reciblage).
  5. `InventoryStockService` (Cercueils, articles, réservation automatique).
  6. `SchedulingResourceService` (Salles, corbillards, équipes, détection de conflits).
  7. `DocumentGeneratorService` (Fiches d'admission, autorisations, factures PDF).
  8. `AuditTimelineService` (Traçabilité inviolable de chaque opération).

---

## 7. STACK RETENUE (CONFORME MOKILI STANDARDS)

### Frontend (Dashboard & Back-office)
- **Framework :** React 18+ avec TypeScript & Vite (Standard MOKILI P07/P14).
- **UI & Styling :** Tailwind CSS + DaisyUI (Sobriété, rapidité, accessibilité).
- **Gestion de Formulaires :** Formik + Zod (Validation stricte des saisies).
- **Requêtes & État :** Axios + TanStack React Query (Cache réseau optimisé, offline resilience).
- **Scan QR Code :** `@zxing/library` ou `html5-qrcode` (Scan via caméra smartphone/tablette ou douchette USB).
- **Icônes :** Lucide React (Cohérence visuelle professionnelle).

### Backend & API
- **Runtime :** Node.js avec TypeScript (Standard MOKILI P09).
- **Framework API :** Express ou Fastify modulaire (Architecture en couches : routes, controllers, services, repositories).
- **ORM / Query Builder :** Prisma ou Drizzle ORM avec migrations versionnées.
- **Sécurité :** Helmet, CORS stricts, Rate-limiting (M22), bcrypt pour hachage, JWT signés avec refresh tokens.

### Base de données
- **Moteur :** MySQL 8.0+ (Standard relationnel MOKILI Core).
- **Contraintes :** Intégrité référentielle stricte, indexation sur numéros de dossiers, identifiants QR et dates d'admission.

### Résilience Hors-Ligne (Spécificité RDC / MOKILI)
- Mécanisme de buffer local (Local Storage / IndexedDB côté client).
- Architecture conçue pour tourner en local sur le réseau LAN de la morgue même en cas de coupure de la connexion Internet externe.

---

## 8. MODULES MOKILI ACTIVÉS

| Code | Module | Statut | Justification |
|---|---|---|---|
| M01 | AUTH | **ACTIVE** | Authentification sécurisée des agents et responsables |
| M02 | RBAC | **ACTIVE** | Rôles à 5 dimensions (Rôle + Niveau + Action + Contexte) |
| M03 | USER / PROFILE | **ACTIVE** | Gestion des profils collaborateurs |
| M04 | PAYMENT | **ACTIVE** | Enregistrement des règlements (espèces, banque, futurs Mobile Money) |
| M05 | BILLING | **ACTIVE** | Génération de devis, facturation automatique selon prestations |
| M07 | STORAGE | **ACTIVE** | Pièces jointes (certificats de décès, pièces d'identité, permis) |
| M10 | NOTIFICATIONS | **ACTIVE** | Alertes de saturation, retards, documents manquants |
| M16 | AUDIT | **ACTIVE** | Journal d'audit inviolable de toutes les actions sur un dossier |
| M22 | RATE LIMITING | **ACTIVE** | Protection des endpoints sensibles |
| M25 | ADMIN | **ACTIVE** | Configuration des chambres, tarifs et services |
| M12 | QUEUE | *OPTIONAL (V1)* | File de traitement asynchrone pour la synchronisation |
| M17 | AI | *FUTURE (V3)* | Assistant intelligent et recherche en langage naturel |

---

## 9. INFRASTRUCTURE & HÉBERGEMENT

- **Profil MOKILI :** `H04 — Hybrid`
  - **Local (Edge Morgue) :** Machine dédiée / mini-serveur sur site avec Docker, Nginx et base locale pour garantir l'indépendance réseau.
  - **Cloud / Central :** `H03 — VPS MOKILI` conforme au protocole **MOKILI VPS SECURITY DEPLOYMENT V2** (Nginx, Certbot SSL, UFW, Fail2ban, SSH Ed25519, utilisateur système non-root dédié).

---

## 10. SÉCURITÉ & AUDIT

1. **Scan QR Code sécurisé :** Le QR code ne divulgue aucune donnée médicale ou personnelle en clair ; il contient un jeton/ID chiffré qui requiert une session agent authentifiée pour afficher le dossier selon ses permissions.
2. **Double Validation :** Aucune sortie de corps ne peut être finalisée sans l'accord séquentiel : Préparation Agent → Contrôle Responsable → Vérification Solde Comptable → Signature/Autorisation finale.
3. **Immutabilité de l'audit :** Tout événement sur le dossier (changement de case, modification de contact, encaissement) est archivé avec horodatage, utilisateur et adresse IP sans possibilité d'écrasement.

---

## 11. HYPOTHÈSES & DÉCISIONS STRUCTURANTES

1. **Devise de facturation :** Support bi-monétaire (USD et CDF), standard en RDC.
2. **Localisation :** Interface en Français (avec possibilité d'adaptation multilingue future Lingala/Swahili).
3. **Matériel d'identification :** Le QR code doit pouvoir être imprimé sur bracelet d'identification étanche et sur fiche cartonnée de dossier.

---

## 12. ÉLÉMENTS [À CLARIFIER] (P1 / P2)

- `[À CLARIFIER P1]` : Quels types d'imprimantes sont disponibles sur site (imprimante laser standard A4, imprimante à étiquettes thermiques pour bracelets de corps) ?
- `[À CLARIFIER P2]` : L'établissement possède-t-il déjà un groupe électrogène / onduleur assurant l'alimentation continue du serveur local ?
