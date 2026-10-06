# CONSTITUTION TECHNIQUE DU PROJET — AGENTS.md

**Projet :** NomarGuerrie — Plateforme souveraine de gestion du parcours funéraire  
**Standard :** MOKILI TECH CORE & MASTER PROMPT V1.1  
**Environnement racine :** `C:\Users\MONYANYO\Desktop\MONYANYO\ENTREPRISE\MOKILI`  
**Dossier Projet :** `C:\Users\MONYANYO\Desktop\MONYANYO\ENTREPRISE\MOKILI\PROJET CODE ZIP DEV PROMPT\Morgue NOMARGUERRIE`

---

## 1. RÈGLES FONDAMENTALES D'INGÉNIERIE

1. **Le besoin détermine l'architecture, l'architecture détermine la stack, la stack détermine l'infrastructure.**
2. **Ne jamais coder à l'aveugle.** Tout développement s'inscrit dans un lot défini dans `PLAN.md` et fait l'objet d'un rapport dans `SUIVI.md`.
3. **Zéro régression, zéro écrasement silencieux.** Inspecter l'existant avant de modifier.
4. **Sécurité & Secrets :** Ne jamais commiter de mots de passe, clés API, ou tokens dans le code ou Git. Toujours utiliser `.env.example` et `.env`.
5. **Règle anti-usine-à-gaz :** « L'utilisateur ne doit pas avoir à comprendre la complexité interne pour accomplir son travail. » Chaque écran doit avoir une utilité opérationnelle claire.
6. **Double validation et traçabilité :** Tout mouvement, toute sortie de corps et tout paiement doit être tracé dans la timeline d'audit de manière inaltérable.
7. **Gestion des incertitudes :** Lorsqu'une information est absente, la marquer explicitement sous le format `[À CLARIFIER]`.

---

## 2. STACK TECHNIQUE OFFICIELLE DU PROJET

- **Frontend :** React 18+, TypeScript, Vite, Tailwind CSS, DaisyUI, Lucide React, Formik + Zod, Axios.
- **Backend :** Node.js, TypeScript, Express / Fastify modulaire (Architecture Clean / N-Tier).
- **Base de Données :** MySQL 8.0+ avec ORM Prisma / migrations versionnées.
- **Identifiants & QR Code :** Génération QR Code via `qrcode`, scan via caméra web/mobile ou lecteur optique USB.
- **Conteneurisation :** Docker + Docker Compose pour déploiement local résilient et VPS.

---

## 3. CONVENTIONS DE CODE & STRUCTURE

```text
Morgue NOMARGUERRIE/
├── MOKILI-PROJECT-SPEC.md   # Spécification officielle et décisions
├── AGENTS.md                # Constitution technique locale
├── CLAUDE.md                # Alias d'instructions
├── PLAN.md                  # Plan de développement par lots testables
├── SUIVI.md                 # Journal de bord et statut d'avancement
├── README.md                # Documentation d'accueil et d'exécution
│
├── apps/
│   ├── web/                 # Application Frontend React (Dashboard, Formulaires, Scan QR)
│   └── api/                 # Backend Node.js / TypeScript (Domain Services, API REST)
│
└── packages/                # Modules partagés (types, schemas de validation)
```

- **Nommage des fichiers :** `kebab-case` pour les fichiers utilitaires/services, `PascalCase` pour les composants React.
- **Typage :** TypeScript strict activé (`strict: true`), aucun `any` non justifié.
- **Gestion des erreurs :** Toujours renvoyer des réponses HTTP structurées `{ success: boolean, data?: any, error?: { code: string, message: string } }`.

---

## 4. WORKFLOW DE TEST & VALIDATION

À la fin de chaque lot (Lot 1, Lot 2, etc.) :
1. Vérifier la compilation TypeScript (`tsc --noEmit`).
2. Vérifier le bon démarrage et les tests unitaires/intégration.
3. Vérifier les cas d'erreur (champs invalides, utilisateur non autorisé, QR code inconnu).
4. Mettre à jour `SUIVI.md` et marquer la tâche comme terminée dans `PLAN.md`.
