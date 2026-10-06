# NomarGuerrie — Plateforme Souveraine de Gestion du Parcours Funéraire

NomarGuerrie est une plateforme métier conçue pour moderniser, sécuriser et fluidifier la gestion complète d'une morgue et du parcours funéraire.

Conçu selon les standards d'ingénierie et d'architecture du **Framework MOKILI SAS**.

---

## 🏛️ Vision & Principes Directeurs

- **Le Dossier Vivant au centre :** Chaque défunt est rattaché à un dossier opérationnel unique qui agrège en continu identité, admissions, localisation, soins, prestations, finance et autorisations.
- **Le Dashboard comme centre de commande :** Une interface proactive ("Ma journée", files de travail personnalisées par rôle) indiquant instantanément aux équipes ce qui arrive, ce qui doit être fait, ce qui est bloqué et ce qui requiert une validation.
- **Une donnée saisie une fois :** Zéro ressaisie administrative.
- **Une action = plusieurs automatisations :** L'ajout d'une prestation réserve une ressource, décrémente le stock, actualise la facture et ajuste la file de tâches.
- **Résilience Congolaise (Local-First) :** Conçu pour fonctionner de manière autonome sur réseau local sans dépendance permanente à Internet.

---

## 👥 Rôles & Accès Contextuels

| Rôle | Périmètre d'action principal |
|---|---|
| **Agent de réception** | Traitement des demandes, admissions, identités, documents et contacts |
| **Agent de morgue** | Gestion des chambres froides, cases, transferts internes, soins et préparation |
| **Comptable / Finance** | Suivi des devis, factures, acomptes, encaissements et validation du solde |
| **Médecin légiste** | Autopsies, constats légaux et levée des restrictions médico-légales |
| **Responsable d'exploitation** | Contrôles transversaux, arbitrage des blocages et double-validation des sorties |
| **Direction** | Supervision macro, taux d'occupation des chambres, finances et audit complet |
| **Famille / Demandeur** | Demande de services, consultation du dossier et règlement en ligne |

---

## 🛠️ Stack Technique (Standards MOKILI)

- **Frontend :** React 18+ (TypeScript, Vite, Tailwind CSS, DaisyUI, Lucide React, Formik + Zod)
- **Backend :** Node.js (TypeScript, API REST modulaire, architecture en couches)
- **Base de Données :** MySQL 8.0+ (Migrations strictes)
- **Identification :** QR Code dynamique et sécurisé (Scan via caméra ou douchette optique)
- **Infrastructure :** Hybride (Micro-serveur local sur site + Déploiement VPS MOKILI V2)

---

## 📁 Architecture du Répertoire

```text
Morgue NOMARGUERRIE/
├── MOKILI-PROJECT-SPEC.md   # Spécification technique et fonctionnelle
├── AGENTS.md                # Constitution technique permanente
├── CLAUDE.md                # Référence d'instructions
├── PLAN.md                  # Plan de développement par lots testables
├── SUIVI.md                 # Journal de suivi et registre des risques
├── README.md                # Présentation et guide de démarrage
│
├── apps/
│   ├── web/                 # Application Frontend React (Vite)
│   └── api/                 # API Backend Node.js / TypeScript
│
└── packages/
    └── shared-types/        # Définitions TypeScript partagées (Dossier, Rôles, Statuts)
```

---

## 🚀 Démarrage Rapide (Environnement de Développement)

### Prérequis
- Node.js (v18+)
- npm ou pnpm
- MySQL (v8.0+) ou instance Docker

### Installation & Lancement
*(Détail fourni lors de la livraison du Lot 0)*

---

## 📜 Documentation & Références MOKILI
Le projet suit les normes de :
- `MOKILI TECH CORE V1.0`
- `MOKILI STACK & PROJECT PROFILE MATRIX V1.0` (Profils P13, P14, P07, H04)
- `MOKILI MODULES SYSTEM V1.0` (Modules M01, M02, M03, M04, M05, M07, M10, M16, M25)
- `MOKILI VPS SECURITY DEPLOYMENT V2`
