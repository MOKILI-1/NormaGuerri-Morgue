import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  HeartHandshake,
  QrCode,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  PhoneCall,
  ChevronRight,
  Clock,
  Printer,
  FileText,
  User,
  Plus,
  Check,
  Truck,
  Coffee,
  BookOpen,
  Flower2,
  Lock,
  BellRing,
  HelpCircle
} from 'lucide-react';
import { DossierVivant, Sexe, ArticleCatalogue } from '@nomarguerrie/shared-types';

interface LandingPageViewProps {
  catalogue: ArticleCatalogue[];
  onCreateDemand: (payload: {
    defunt: DossierVivant['defunt'];
    demandeur: DossierVivant['demandeur'];
    servicesChoisis?: Array<{ article: ArticleCatalogue; quantite: number }>;
  }) => Promise<DossierVivant>;
  onSearchDossier: (numOuToken: string) => void;
  onOpenSearchModal: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  catalogue,
  onCreateDemand,
  onSearchDossier,
  onOpenSearchModal
}) => {
  // Modal de Déclaration Multi-étapes (Étape 1: Défunt & Famille -> Étape 2: Choix des 5 Pôles de Services -> Étape 3: Récépissé & QR Code)
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

  // Étape 1 : Formulaire d'identité
  const [defuntNom, setDefuntNom] = useState('');
  const [defuntPrenom, setDefuntPrenom] = useState('');
  const [defuntSexe, setDefuntSexe] = useState<Sexe>('MASCULIN');
  const [dateDeces, setDateDeces] = useState(new Date().toISOString().slice(0, 10));
  const [lieuDeces, setLieuDeces] = useState('Kinshasa');
  const [contactNom, setContactNom] = useState('');
  const [contactTel, setContactTel] = useState('');
  const [contactLien, setContactLien] = useState('Enfant / Descendant');

  // Champs logistiques spécifiques (Axe Transport & Salons)
  const [morgueDepart, setMorgueDepart] = useState('');
  const [dateSalon, setDateSalon] = useState('');

  // Étape 2 : Services sélectionnés par la famille
  const [selectedServiceIds, setSelectedServiceIds] = useState<Record<string, number>>({
    'art-adm-01': 1, // Formalités de base d'office
    'art-soin-03': 1 // Conservation sécurisée
  });

  // Onglet actif dans l'étape 2 des services
  const [wizardCategoryTab, setWizardCategoryTab] = useState<number>(1);

  // Étape 3 : Résultat après création
  const [createdDossier, setCreatedDossier] = useState<DossierVivant | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Recherche & Filtres dans le catalogue public
  const [rechercheCatalogue, setRechercheCatalogue] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('TOUS');

  // Gestion de la sélection des services
  const toggleService = (articleId: string) => {
    setSelectedServiceIds((prev) => {
      const next = { ...prev };
      if (next[articleId]) {
        delete next[articleId];
      } else {
        next[articleId] = 1;
      }
      return next;
    });
  };

  // Démarrage du wizard
  const handleOpenWizard = (preselectedArticleId?: string) => {
    if (preselectedArticleId) {
      setSelectedServiceIds((prev) => ({
        ...prev,
        [preselectedArticleId]: 1
      }));
    }
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  // Validation Étape 1 -> Passage à l'étape 2 (Proposition des 5 pôles de services)
  const handleGoToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defuntNom.trim() || !defuntPrenom.trim() || !contactNom.trim() || !contactTel.trim()) {
      alert('Veuillez renseigner tous les champs obligatoires du défunt et du représentant.');
      return;
    }
    setWizardStep(2);
  };

  // Validation Étape 2 -> Création effective du dossier avec les prestations choisies
  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const servicesChoisis = Object.entries(selectedServiceIds)
        .map(([artId, qty]) => {
          const art = catalogue.find((a) => a.id === artId);
          return art ? { article: art, quantite: qty } : null;
        })
        .filter((item): item is { article: ArticleCatalogue; quantite: number } => item !== null);

      const dossier = await onCreateDemand({
        defunt: {
          id: `def-${Date.now()}`,
          nom: defuntNom.toUpperCase(),
          prenom: defuntPrenom,
          sexe: defuntSexe,
          dateDeces,
          lieuDeces: lieuDeces || 'Kinshasa',
          causeDecesPresumee: 'Mort naturelle',
          observationsMedicales: morgueDepart ? `Transfert commandé depuis : ${morgueDepart}` : undefined
        },
        demandeur: {
          id: `dem-${Date.now()}`,
          nom: contactNom.toUpperCase(),
          prenom: '',
          type: 'FAMILLE',
          lienParente: contactLien,
          telephone: contactTel,
          adresse: 'Kinshasa',
          ville: 'Kinshasa'
        },
        servicesChoisis
      });

      setCreatedDossier(dossier);
      setWizardStep(3);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la création du dossier.');
    } finally {
      setSubmitting(false);
    }
  };

  // Les 5 grands pôles de services demandés
  const polesModules = [
    {
      id: 1,
      titre: '1. Recueillement & Funérarium',
      desc: 'Salons intimistes & grands salons, conciergerie traiteur et mémorial numérique.',
      categorieShared: 'CEREMONIE',
      icon: Building
    },
    {
      id: 2,
      titre: '2. Soins du Corps & Esthétique',
      desc: 'Toilette rituelle, habillage, maquillage et soins de thanatopraxie pour présentation digne.',
      categorieShared: 'TOILETTE_ET_SOINS',
      icon: HeartHandshake
    },
    {
      id: 3,
      titre: '3. Boutique d’Articles Funéraires',
      desc: 'Cercueils nobles en bois ou écologiques, couronnes florales et plaques commémoratives.',
      categorieShared: 'FOURNITURE_FUNERAIRE',
      icon: Flower2
    },
    {
      id: 4,
      titre: '4. Suivi Logistique & Axe Transport',
      desc: 'Commande de corbillard, transfert depuis morgue externe et géolocalisation en direct.',
      categorieShared: 'TRANSPORT',
      icon: Truck
    },
    {
      id: 5,
      titre: '5. Assistance Administrative & Juridique',
      desc: 'Déclaration de décès, autorisations officielles et coffre-fort numérique sécurisé.',
      categorieShared: 'ADMINISTRATIF',
      icon: Lock
    }
  ];

  // Filtres catalogue public
  const categoriesList = [
    { key: 'TOUS', label: 'Toutes les prestations', count: catalogue.length },
    { key: 'CEREMONIE', label: 'Recueillement & Salons', count: catalogue.filter((c) => c.categorie === 'CEREMONIE').length },
    { key: 'TOILETTE_ET_SOINS', label: 'Soins & Thanatopraxie', count: catalogue.filter((c) => c.categorie === 'TOILETTE_ET_SOINS' || c.categorie === 'CONSERVATION').length },
    { key: 'FOURNITURE_FUNERAIRE', label: 'Boutique & Articles', count: catalogue.filter((c) => c.categorie === 'FOURNITURE_FUNERAIRE').length },
    { key: 'TRANSPORT', label: 'Axe Transport & Convoi', count: catalogue.filter((c) => c.categorie === 'TRANSPORT').length },
    { key: 'ADMINISTRATIF', label: 'Assistance Administrative', count: catalogue.filter((c) => c.categorie === 'ADMINISTRATIF' || c.categorie === 'ADMISSION').length }
  ];

  const filteredCatalogue = catalogue.filter((art) => {
    let matchCat = false;
    if (selectedCategorie === 'TOUS') matchCat = true;
    else if (selectedCategorie === 'CEREMONIE') matchCat = art.categorie === 'CEREMONIE';
    else if (selectedCategorie === 'TOILETTE_ET_SOINS') matchCat = art.categorie === 'TOILETTE_ET_SOINS' || art.categorie === 'CONSERVATION';
    else if (selectedCategorie === 'FOURNITURE_FUNERAIRE') matchCat = art.categorie === 'FOURNITURE_FUNERAIRE';
    else if (selectedCategorie === 'TRANSPORT') matchCat = art.categorie === 'TRANSPORT';
    else if (selectedCategorie === 'ADMINISTRATIF') matchCat = art.categorie === 'ADMINISTRATIF' || art.categorie === 'ADMISSION';

    const matchTxt =
      art.titre.toLowerCase().includes(rechercheCatalogue.toLowerCase()) ||
      art.description.toLowerCase().includes(rechercheCatalogue.toLowerCase()) ||
      art.code.toLowerCase().includes(rechercheCatalogue.toLowerCase());
    return matchCat && matchTxt;
  });

  return (
    <div className="min-h-screen bg-[#061126] text-slate-100 flex flex-col font-sans selection:bg-sky-600 selection:text-white">
      {/* Liseré supérieur bleu cobalt & cyan (charte du logo) */}
      <div className="h-1 bg-gradient-to-r from-blue-700 via-sky-400 to-blue-800" />

      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-40 bg-[#061126]/95 backdrop-blur-md border-b border-blue-950/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo et Identité H+ Hospital Nomargueri */}
          <div className="flex items-center space-x-3.5">
            <img
              src="/logo-hospital-nomargueri.jpg"
              alt="Logo H+ Hospital Nomargueri"
              className="w-12 h-12 rounded-full border-2 border-sky-400/80 shadow-md object-cover bg-white shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
                  HOSPITAL NOMARGUERI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-sky-300 font-mono border border-sky-500/40 font-semibold tracking-wide hidden sm:inline-block">
                  SOUVERAIN
                </span>
              </div>
              <p className="text-[11px] text-sky-300/80 tracking-wide uppercase font-medium">
                Morgue & Parcours Funéraire • Kinshasa
              </p>
            </div>
          </div>

          {/* Boutons d'Action Header */}
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <button
              onClick={onOpenSearchModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-blue-900 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span>Vérifier un dossier</span>
            </button>

            <a
              href="#catalogue"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <span>Consulter les prestations</span>
            </a>
          </div>
        </div>
      </header>

      {/* SECTION 1 — HERO SECTION (DISPOSITION 2 COLONNES AVEC CTAS ET PROTOCOLE) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-blue-950/60 bg-gradient-to-b from-[#061126] via-[#091A3E] to-[#0A1E48]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(2,132,199,0.15),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Colonne Gauche : Titre percutant, Sous-titre & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/40 border border-blue-600/40 text-sky-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>PORTAIL OFFICIEL FUNÉRAIRE & MORGUE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Hospital Nomargueri.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">
                  Dignité • Sérénité • Traçabilité
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                Prise en charge intégrale et personnalisée du parcours funéraire : réservation de salons de recueillement, soins de thanatopraxie, logistique de transport géolocalisée et assistance aux formalités officielles.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <button
                  onClick={() => handleOpenWizard()}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  Déclarer un décès & Choisir les prestations ➔
                </button>

                <button
                  onClick={onOpenSearchModal}
                  className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-blue-900 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  Suivre un dossier existant
                </button>
              </div>
            </div>

            {/* Colonne Droite : Carte institutionnelle avec les engagements officiels */}
            <div className="lg:col-span-5">
              <div className="bg-[#0B1E48]/90 border border-blue-900/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 backdrop-blur-sm">
                <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                  SERVICES D’ACCOMPAGNEMENT DÉDIÉS
                </div>

                <div className="bg-[#06132D] border border-blue-800/60 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span>Prise en charge coordonnée en 5 Pôles</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Recueillement en salons climatisés, soins esthétiques et thanatopraxie, boutique marbrerie, transfert sécurisé depuis morgue externe et formalités légales.
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-white">Traçabilité & Notifications en temps réel</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Chaque étape (arrivée, soins, levée de corps) est suivie avec précision par QR Code infalsifiable et alertes SMS pour la tranquillité des proches.
                  </p>
                </div>

                <a
                  href="#catalogue"
                  className="w-full py-3 bg-blue-950/80 hover:bg-blue-900 text-sky-300 border border-blue-700/50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  Découvrir les 5 pôles de services ➔
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — CATALOGUE DES PRESTATIONS ARTICULÉ AUTOUR DES 5 PÔLES */}
      <section id="catalogue" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#091A3E] border border-blue-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Header du catalogue */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
              OFFRE DE SERVICES COMPLÈTE • HOSPITAL NOMARGUERI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Catalogue des prestations et soins funéraires
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Choisissez parmi nos services de recueillement, soins du corps, articles funéraires, transport sécurisé et assistance administrative.
            </p>
          </div>

          {/* Barre de Recherche intégrée */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un salon, un soin de thanatopraxie, un corbillard, un cercueil, des démarches..."
              value={rechercheCatalogue}
              onChange={(e) => setRechercheCatalogue(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#061126] border border-blue-900/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Onglets des 5 catégories */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categoriesList.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategorie(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategorie === cat.key
                    ? 'bg-blue-600 text-white shadow-md font-bold'
                    : 'bg-[#0B1E48] text-slate-300 hover:text-white hover:bg-[#102960] border border-blue-900/60'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Grille des prestations sans aucun prix public */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredCatalogue.map((art) => (
              <div
                key={art.id}
                className="bg-[#0B1E48]/80 hover:bg-[#0D2456] border border-blue-900/60 hover:border-sky-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-sky-400 border border-blue-800">
                      {art.code}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {art.categorie.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {art.titre}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {art.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-blue-950 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span>Service disponible</span>
                  </div>

                  <button
                    onClick={() => handleOpenWizard(art.id)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center gap-1"
                  >
                    Demander ce service
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER OFFICIEL — AVEC MENTION OBLIGATOIRE "PROPULSÉ PAR MOKILI" */}
      <footer className="mt-auto bg-[#040C1D] py-12 border-t border-blue-950/80 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <img
                src="/logo-hospital-nomargueri.jpg"
                alt="Hospital Nomargueri"
                className="w-9 h-9 rounded-full border border-sky-400/80 shadow object-cover bg-white"
              />
              <div>
                <span className="font-bold text-white uppercase text-sm block">
                  HOSPITAL NOMARGUERI
                </span>
                <span className="text-[11px] text-slate-400">
                  Plateforme Souveraine de Gestion du Parcours Funéraire
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-slate-400 text-xs">
              <span>Kinshasa, RD Congo</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                <span>Urgences 24h/24 : <strong>+243 81 000 0000</strong></span>
              </span>
            </div>
          </div>

          <div className="border-t border-blue-950/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p className="text-slate-500">
              © {new Date().getFullYear()} Hospital Nomargueri. Tous droits réservés. Traçabilité par QR Code certifié.
            </p>

            <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-full border border-blue-950">
              <span className="text-slate-400">Propulsé par</span>
              <a
                href="https://mokili.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors flex items-center gap-1"
              >
                Mokili
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL DU WORKFLOW EN 3 ÉTAPES : PROPOSITION DÉTAILLÉE DES 5 SERVICES      */}
      {/* ========================================================================= */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1A3E] border border-blue-900/80 rounded-2xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-6">
            {/* Header du Wizard */}
            <div className="flex items-center justify-between border-b border-blue-950 pb-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/logo-hospital-nomargueri.jpg"
                  alt="Hospital Nomargueri"
                  className="w-10 h-10 rounded-full border border-sky-400 shadow object-cover bg-white"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Déclaration & Prise en Charge Funéraire
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className={`font-semibold ${wizardStep === 1 ? 'text-sky-400' : 'text-slate-400'}`}>
                      1. Identités
                    </span>
                    <span>➔</span>
                    <span className={`font-semibold ${wizardStep === 2 ? 'text-sky-400' : 'text-slate-400'}`}>
                      2. Choix des Services (5 Pôles)
                    </span>
                    <span>➔</span>
                    <span className={`font-semibold ${wizardStep === 3 ? 'text-sky-300' : 'text-slate-400'}`}>
                      3. Récépissé & QR Code
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsWizardOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* ÉTAPE 1 : IDENTITÉS DU DÉFUNT ET DU REPRÉSENTANT FAMILIAL */}
            {wizardStep === 1 && (
              <form onSubmit={handleGoToStep2} className="space-y-5 text-xs">
                <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl text-sky-200">
                  <p className="font-semibold">Étape 1 sur 2 : Informations Légales</p>
                  <p className="text-[11px] text-sky-300/80 mt-0.5">
                    Renseignez l'identité du défunt et du représentant. À l'étape suivante, l'application vous proposera la personnalisation des services (recueillement, soins, boutique, transport et démarches).
                  </p>
                </div>

                {/* Section Défunt */}
                <div className="space-y-3">
                  <div className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                    Identité du Défunt
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Nom de famille *</label>
                      <input
                        type="text"
                        placeholder="Ex: TSHISEKEDI"
                        value={defuntNom}
                        onChange={(e) => setDefuntNom(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white uppercase focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Prénom *</label>
                      <input
                        type="text"
                        placeholder="Ex: Paul"
                        value={defuntPrenom}
                        onChange={(e) => setDefuntPrenom(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Sexe *</label>
                      <select
                        value={defuntSexe}
                        onChange={(e) => setDefuntSexe(e.target.value as Sexe)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      >
                        <option value="MASCULIN">Masculin</option>
                        <option value="FEMININ">Féminin</option>
                        <option value="INDETERMINE">Indéterminé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Date du décès *</label>
                      <input
                        type="date"
                        value={dateDeces}
                        onChange={(e) => setDateDeces(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Lieu du décès *</label>
                      <input
                        type="text"
                        placeholder="Ex: Hôpital Général, Kinshasa"
                        value={lieuDeces}
                        onChange={(e) => setLieuDeces(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section Représentant familial */}
                <div className="space-y-3 pt-3 border-t border-blue-950">
                  <div className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                    Représentant Familial (Contact Principal)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Nom complet du proche *</label>
                      <input
                        type="text"
                        placeholder="Ex: Jean-Luc KABEYA"
                        value={contactNom}
                        onChange={(e) => setContactNom(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white uppercase focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Numéro de téléphone *</label>
                      <input
                        type="tel"
                        placeholder="+243 81 234 5678"
                        value={contactTel}
                        onChange={(e) => setContactTel(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Lien de parenté *</label>
                      <input
                        type="text"
                        placeholder="Ex: Fils, Épouse, Frère..."
                        value={contactLien}
                        onChange={(e) => setContactLien(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                  >
                    Continuer vers la Sélection des Services
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ÉTAPE 2 : PROPOSITION DÉTAILLÉE DES 5 PÔLES DE SERVICES (À LA DEMANDE DE L'UTILISATEUR) */}
            {wizardStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl text-sky-200">
                  <p className="font-bold">Services Proposés pour {defuntPrenom} {defuntNom}</p>
                  <p className="text-[11px] text-sky-300/80 mt-0.5">
                    Sélectionnez les prestations souhaitées parmi les 5 pôles d'accompagnement. Vous pourrez ajuster ou compléter vos choix à tout moment.
                  </p>
                </div>

                {/* 5 Onglets des Pôles */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 border-b border-blue-950 pb-2">
                  {polesModules.map((pole) => {
                    const Icon = pole.icon;
                    const isActive = wizardCategoryTab === pole.id;
                    return (
                      <button
                        key={pole.id}
                        type="button"
                        onClick={() => setWizardCategoryTab(pole.id)}
                        className={`p-2 rounded-xl text-left flex flex-col gap-1 transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md font-bold'
                            : 'bg-[#061126] text-slate-300 hover:bg-[#0D2456] border border-blue-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[11px] truncate">{pole.titre.split('. ')[1]}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Contenu spécifique selon le pôle actif */}
                <div className="max-h-[340px] overflow-y-auto pr-1 space-y-3">
                  {/* PÔLE 1 : RECUEILLEMENT & FUNÉRARIUM */}
                  {wizardCategoryTab === 1 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#061126] rounded-xl border border-blue-900/60 space-y-2">
                        <span className="font-bold text-sky-300 block text-[11px]">
                          1.1 Réservation de Salon Funéraire & Plages Horaires
                        </span>
                        <p className="text-slate-400 text-[11px]">
                          Choisissez la taille du salon et planifiez la date de recueillement.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {catalogue
                            .filter((a) => a.id === 'art-rec-01' || a.id === 'art-rec-02')
                            .map((art) => (
                              <div
                                key={art.id}
                                onClick={() => toggleService(art.id)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                  selectedServiceIds[art.id]
                                    ? 'bg-blue-950 border-sky-400 text-white shadow'
                                    : 'bg-[#0A1A3E] border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <strong className="text-xs">{art.titre}</strong>
                                  {selectedServiceIds[art.id] && <Check className="w-4 h-4 text-sky-400" />}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">{art.description}</p>
                              </div>
                            ))}
                        </div>
                        <div className="pt-2">
                          <label className="block text-slate-300 text-[11px] mb-1">Date et heure souhaitée pour la veillée :</label>
                          <input
                            type="datetime-local"
                            value={dateSalon}
                            onChange={(e) => setDateSalon(e.target.value)}
                            className="p-2 bg-[#0A1A3E] border border-slate-700 rounded-lg text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-[#061126] rounded-xl border border-blue-900/60 space-y-2">
                        <span className="font-bold text-sky-300 block text-[11px]">
                          1.2 Conciergerie, Traiteur & Mémorial Numérique
                        </span>
                        <div className="space-y-2">
                          {catalogue
                            .filter((a) => a.id === 'art-rec-03' || a.id === 'art-rec-04')
                            .map((art) => (
                              <div
                                key={art.id}
                                onClick={() => toggleService(art.id)}
                                className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                  selectedServiceIds[art.id]
                                    ? 'bg-blue-950 border-sky-400 text-white'
                                    : 'bg-[#0A1A3E] border-slate-800 text-slate-300'
                                }`}
                              >
                                <div>
                                  <div className="font-semibold text-xs">{art.titre}</div>
                                  <div className="text-[10px] text-slate-400">{art.description}</div>
                                </div>
                                {selectedServiceIds[art.id] ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500 text-white font-bold">Sélectionné</span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Ajouter</span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PÔLE 2 : SOINS DU CORPS ET ESTHÉTIQUE */}
                  {wizardCategoryTab === 2 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#061126] rounded-xl border border-blue-900/60 space-y-2">
                        <span className="font-bold text-sky-300 block text-[11px]">
                          2.1 Forfaits de Préparation & Esthétique
                        </span>
                        <p className="text-slate-400 text-[11px]">
                          Toilette rituelle, habillage (dépôt des vêtements par la famille), coiffure et maquillage digne.
                        </p>
                        <div
                          onClick={() => toggleService('art-soin-01')}
                          className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                            selectedServiceIds['art-soin-01'] ? 'bg-blue-950 border-sky-400 text-white' : 'bg-[#0A1A3E] border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs">Toilette rituelle, habillage & coiffure de présentation</div>
                            <div className="text-[10px] text-slate-400">Planification du dépôt des vêtements et maquillage soigné</div>
                          </div>
                          {selectedServiceIds['art-soin-01'] && <Check className="w-4 h-4 text-sky-400" />}
                        </div>
                      </div>

                      <div className="p-3 bg-[#061126] rounded-xl border border-blue-900/60 space-y-2">
                        <span className="font-bold text-sky-300 block text-[11px]">
                          2.2 Soins de Conservation (Thanatopraxie & Conservation)
                        </span>
                        <div className="p-2.5 bg-sky-950/40 border border-sky-800/40 rounded-lg text-[10px] text-sky-300">
                          ℹ️ Fortement recommandé pour les corps provenant d'une morgue externe sans infrastructures de pointe et pour une présentation à visage découvert.
                        </div>
                        <div className="space-y-2">
                          {catalogue
                            .filter((a) => a.id === 'art-soin-02' || a.id === 'art-soin-03')
                            .map((art) => (
                              <div
                                key={art.id}
                                onClick={() => toggleService(art.id)}
                                className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                  selectedServiceIds[art.id]
                                    ? 'bg-blue-950 border-sky-400 text-white'
                                    : 'bg-[#0A1A3E] border-slate-800 text-slate-300'
                                }`}
                              >
                                <div>
                                  <div className="font-semibold text-xs">{art.titre}</div>
                                  <div className="text-[10px] text-slate-400">{art.description}</div>
                                </div>
                                {selectedServiceIds[art.id] ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500 text-white font-bold">Sélectionné</span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Ajouter</span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PÔLE 3 : BOUTIQUE D'ARTICLES FUNÉRAIRES */}
                  {wizardCategoryTab === 3 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#061126] rounded-xl border border-blue-900/60 space-y-2">
                        <span className="font-bold text-sky-300 block text-[11px]">
                          3.1 Choix du Cercueil ou de l'Urne
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {catalogue
                            .filter((a) => a.id === 'art-cer-01' || a.id === 'art-cer-02')
                            .map((art) => (
                              <div
                                key={art.id}
                                onClick={() => toggleService(art.id)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                  selectedServiceIds[art.id]
                                    ? 'bg-blue-950 border-sky-400 text-white'
                                    : 'bg-[#0A1A3E] border-slate-800 text-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <strong className="text-xs">{art.titre}</strong>
                                  {selectedServiceIds[art.id] && <Check className="w-4 h-4 text-sky-400" />}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">{art.description}</p>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="p-3 bg-[#061126] rounded-xl border border-blue-900/60 space-y-2">
                        <span className="font-bold text-sky-300 block text-[11px]">
                          3.2 Fleurs d’Honneur & Plaques Commémoratives
                        </span>
                        <div className="space-y-2">
                          {catalogue
                            .filter((a) => a.id === 'art-flr-01' || a.id === 'art-plq-01')
                            .map((art) => (
                              <div
                                key={art.id}
                                onClick={() => toggleService(art.id)}
                                className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                  selectedServiceIds[art.id]
                                    ? 'bg-blue-950 border-sky-400 text-white'
                                    : 'bg-[#0A1A3E] border-slate-800 text-slate-300'
                                }`}
                              >
                                <div>
                                  <div className="font-semibold text-xs">{art.titre}</div>
                                  <div className="text-[10px] text-slate-400">{art.description}</div>
                                </div>
                                {selectedServiceIds[art.id] ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500 text-white font-bold">Sélectionné</span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Ajouter</span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PÔLE 4 : SUIVI LOGISTIQUE ET AXE TRANSPORT */}
                  {wizardCategoryTab === 4 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#061126] rounded-xl border border-blue-900/60 space-y-2">
                        <span className="font-bold text-sky-300 block text-[11px]">
                          4.1 Commande de Corbillard & Transfert du Corps
                        </span>
                        <p className="text-slate-400 text-[11px]">
                          Indispensable pour les corps venant d'une morgue externe ou d'un centre hospitalier.
                        </p>
                        <div className="space-y-2">
                          {catalogue
                            .filter((a) => a.id === 'art-transp-01' || a.id === 'art-transp-02')
                            .map((art) => (
                              <div
                                key={art.id}
                                onClick={() => toggleService(art.id)}
                                className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                                  selectedServiceIds[art.id]
                                    ? 'bg-blue-950 border-sky-400 text-white'
                                    : 'bg-[#0A1A3E] border-slate-800 text-slate-300'
                                }`}
                              >
                                <div>
                                  <div className="font-semibold text-xs">{art.titre}</div>
                                  <div className="text-[10px] text-slate-400">{art.description}</div>
                                </div>
                                {selectedServiceIds[art.id] ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500 text-white font-bold">Sélectionné</span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Ajouter</span>
                                )}
                              </div>
                            ))}
                        </div>
                        <div className="pt-2">
                          <label className="block text-slate-300 text-[11px] mb-1 font-medium">
                            Adresse ou Nom de la morgue de départ (hôpital d'origine) :
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Clinique Ngaliema ou Hôpital Provincial de Kinshasa"
                            value={morgueDepart}
                            onChange={(e) => setMorgueDepart(e.target.value)}
                            className="w-full p-2 bg-[#0A1A3E] border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-[#061126] rounded-xl border border-blue-900/60 space-y-2">
                        <span className="font-bold text-sky-300 block text-[11px]">
                          4.2 Géolocalisation & Alertes SMS en Temps Réel
                        </span>
                        <div
                          onClick={() => toggleService('art-transp-03')}
                          className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                            selectedServiceIds['art-transp-03'] ? 'bg-blue-950 border-sky-400 text-white' : 'bg-[#0A1A3E] border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs">Notifications de transfert en direct par SMS / Application</div>
                            <div className="text-[10px] text-slate-400">
                              Recevez : « Le corps a quitté la morgue X » puis « Le corps est arrivé au funérarium ».
                            </div>
                          </div>
                          {selectedServiceIds['art-transp-03'] && <Check className="w-4 h-4 text-sky-400" />}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PÔLE 5 : ASSISTANCE ADMINISTRATIVE ET JURIDIQUE */}
                  {wizardCategoryTab === 5 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-[#061126] rounded-xl border border-blue-900/60 space-y-2">
                        <span className="font-bold text-sky-300 block text-[11px]">
                          5.1 Générateur de Formalités Légales & Permis
                        </span>
                        <div
                          onClick={() => toggleService('art-adm-01')}
                          className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                            selectedServiceIds['art-adm-01'] ? 'bg-blue-950 border-sky-400 text-white' : 'bg-[#0A1A3E] border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs">Aide administrative à la déclaration de décès et autorisations</div>
                            <div className="text-[10px] text-slate-400">Permis d'inhumer, certificat de transport auprès des autorités locales</div>
                          </div>
                          {selectedServiceIds['art-adm-01'] && <Check className="w-4 h-4 text-sky-400" />}
                        </div>
                      </div>

                      <div className="p-3 bg-[#061126] rounded-xl border border-blue-900/60 space-y-2">
                        <span className="font-bold text-sky-300 block text-[11px]">
                          5.2 Coffre-fort Numérique Sécurisé
                        </span>
                        <div
                          onClick={() => toggleService('art-adm-02')}
                          className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                            selectedServiceIds['art-adm-02'] ? 'bg-blue-950 border-sky-400 text-white' : 'bg-[#0A1A3E] border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs">Numérisation et téléversement sécurisé des actes d'état civil</div>
                            <div className="text-[10px] text-slate-400">Téléchargement instantané des actes officiels délivrés par l'établissement</div>
                          </div>
                          {selectedServiceIds['art-adm-02'] && <Check className="w-4 h-4 text-sky-400" />}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Synthèse des services retenus */}
                <div className="p-3.5 bg-[#061126] border border-blue-900/80 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Prestations Sélectionnées</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-sky-400">
                        {Object.keys(selectedServiceIds).length} prestation(s)
                      </span>
                      <span className="text-xs text-slate-400">
                        retenues pour la prise en charge
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                    >
                      ← Précédent
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleFinalSubmit}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? 'Enregistrement...' : 'Valider & Créer le Dossier ➔'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 : RÉCÉPISSÉ OFFICIEL & ATTRIBUTION DU DOSSIER PAR QR CODE */}
            {wizardStep === 3 && createdDossier && (
              <div className="space-y-5 text-xs text-center py-2">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white">
                    Dossier Funéraire Enregistré avec Succès
                  </h4>
                  <p className="text-xs text-slate-300">
                    Votre demande de prise en charge a été enregistrée dans le système de l'Hôpital Nomargueri.
                  </p>
                </div>

                {/* Carte de Récépissé */}
                <div className="bg-[#061126] border border-blue-900 rounded-2xl p-5 text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-blue-950 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Numéro Officiel de Dossier</span>
                      <span className="text-lg font-black text-sky-400 font-mono">
                        {createdDossier.numeroDossier}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jeton QR Sécurisé</span>
                      <span className="text-xs font-mono text-sky-300">{createdDossier.qrCodeToken}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Défunt :</span>
                      <strong className="text-white text-sm">
                        {createdDossier.defunt.prenom} {createdDossier.defunt.nom}
                      </strong>
                      <p className="text-slate-400 text-[11px]">Décès le {createdDossier.defunt.dateDeces}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Représentant :</span>
                      <strong className="text-white text-sm">
                        {createdDossier.demandeur.nom}
                      </strong>
                      <p className="text-slate-400 text-[11px] font-mono">{createdDossier.demandeur.telephone}</p>
                    </div>
                  </div>

                  {/* Prestations choisies réparties par pôles */}
                  <div className="pt-2 border-t border-blue-950">
                    <span className="text-slate-400 block text-[10px] mb-1.5 font-semibold">Prestations Retenues :</span>
                    <div className="space-y-1.5">
                      {createdDossier.prestations.map((p) => (
                        <div key={p.id} className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-blue-950">
                          <span className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-sky-400" />
                            {p.titre}
                          </span>
                          <span className="text-[10px] text-sky-400 font-mono font-semibold">Enregistré</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Instructions pour la famille */}
                <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl text-left text-[11px] text-sky-200 space-y-1">
                  <p className="font-semibold text-white">Instructions pour la Famille :</p>
                  <p>
                    1. Présentez-vous à l'accueil du funérarium muni du numéro <strong>{createdDossier.numeroDossier}</strong> et du certificat de décès.
                  </p>
                  <p>
                    2. Nos conseillers valideront les créneaux de salon, la planification du transport et la préparation personnalisée du défunt.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimer le Récépissé
                  </button>

                  <button
                    onClick={() => {
                      setIsWizardOpen(false);
                      onSearchDossier(createdDossier.numeroDossier);
                    }}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/30"
                  >
                    Suivre le Dossier en Ligne ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
