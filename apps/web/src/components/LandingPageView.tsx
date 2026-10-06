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
  // Modal de Déclaration Multi-étapes (Étape 1: Défunt & Famille -> Étape 2: Choix des Services -> Étape 3: Récépissé & QR Code)
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

  // Étape 2 : Services sélectionnés
  // Par défaut, l'admission est sélectionnée (50 $)
  const [selectedServiceIds, setSelectedServiceIds] = useState<Record<string, number>>({
    'art-1': 1
  });

  // Étape 3 : Résultat après création
  const [createdDossier, setCreatedDossier] = useState<DossierVivant | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Recherche & Filtres dans le catalogue
  const [rechercheCatalogue, setRechercheCatalogue] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('TOUS');

  // Gestion du panier / sélection des services dans le wizard
  const toggleService = (articleId: string) => {
    // L'admission de base ne peut pas être décochée
    if (articleId === 'art-1') return;

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

  const updateQuantity = (articleId: string, delta: number) => {
    setSelectedServiceIds((prev) => {
      const current = prev[articleId] || 1;
      const nextVal = Math.max(1, current + delta);
      return { ...prev, [articleId]: nextVal };
    });
  };

  // Calcul du total en direct dans le wizard
  const totalEstimeUSD = Object.entries(selectedServiceIds).reduce((sum, [artId, qty]) => {
    const art = catalogue.find((a) => a.id === artId);
    return sum + (art ? art.prixUnitaire * qty : 0);
  }, 0);

  const totalEstimeCDF = totalEstimeUSD * 2800; // Taux approximatif indicatif

  // Démarrage du wizard
  const handleOpenWizard = (preselectedArticleId?: string) => {
    if (preselectedArticleId && preselectedArticleId !== 'art-1') {
      setSelectedServiceIds((prev) => ({
        ...prev,
        [preselectedArticleId]: 1
      }));
    }
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  // Validation Étape 1 -> Passage à l'étape 2 (Proposition des services)
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
          causeDecesPresumee: 'Mort naturelle'
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

  // Filtrage du catalogue
  const categoriesList = [
    { key: 'TOUS', label: 'Tous les services', count: catalogue.length },
    { key: 'ADMISSION', label: 'Admission & Dossier', count: catalogue.filter((c) => c.categorie === 'ADMISSION').length },
    { key: 'CONSERVATION', label: 'Conservation Frigorifique', count: catalogue.filter((c) => c.categorie === 'CONSERVATION').length },
    { key: 'TOILETTE_ET_SOINS', label: 'Soins & Thanatopraxie', count: catalogue.filter((c) => c.categorie === 'TOILETTE_ET_SOINS').length },
    { key: 'FOURNITURE_FUNERAIRE', label: 'Cercueils & Fournitures', count: catalogue.filter((c) => c.categorie === 'FOURNITURE_FUNERAIRE').length },
    { key: 'CEREMONIE', label: 'Cérémonie & Chapelle', count: catalogue.filter((c) => c.categorie === 'CEREMONIE').length },
    { key: 'TRANSPORT', label: 'Transport & Convoi', count: catalogue.filter((c) => c.categorie === 'TRANSPORT').length }
  ];

  const filteredCatalogue = catalogue.filter((art) => {
    const matchCat = selectedCategorie === 'TOUS' || art.categorie === selectedCategorie;
    const matchTxt =
      art.titre.toLowerCase().includes(rechercheCatalogue.toLowerCase()) ||
      art.description.toLowerCase().includes(rechercheCatalogue.toLowerCase()) ||
      art.code.toLowerCase().includes(rechercheCatalogue.toLowerCase());
    return matchCat && matchTxt;
  });

  return (
    <div className="min-h-screen bg-[#07132B] text-slate-100 flex flex-col font-sans selection:bg-sky-600 selection:text-white">
      {/* Liseré supérieur aux couleurs officielles */}
      <div className="h-1 bg-gradient-to-r from-blue-700 via-sky-400 to-indigo-800" />

      {/* HEADER PRINCIPAL — DISPOSITION OFFICIELLE */}
      <header className="sticky top-0 z-40 bg-[#07132B]/95 backdrop-blur-md border-b border-blue-950/80 shadow-lg">
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
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono border border-sky-400/30 font-semibold tracking-wide hidden sm:inline-block">
                  SOUVERAIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide uppercase font-medium">
                Morgue & Parcours Funéraire • Kinshasa
              </p>
            </div>
          </div>

          {/* Boutons d'Action Header (comme dans RTNC Pay) */}
          <div className="flex items-center space-x-3 text-xs font-semibold">
            <button
              onClick={onOpenSearchModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span>Vérifier un dossier / reçu</span>
            </button>

            <a
              href="#catalogue"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5"
            >
              <span>Consulter la grille</span>
            </a>
          </div>
        </div>
      </header>

      {/* SECTION 1 — HERO SECTION (DISPOSITION INSPIRÉE DE RTNC PAY) */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-28 border-b border-blue-950/60 bg-gradient-to-b from-[#07132B] via-[#091838] to-[#0A1A3F]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Colonne Gauche : Titre percutant, Sous-titre & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge pilule style RTNC Pay */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>PORTAIL OFFICIEL FUNÉRAIRE & MORGUE</span>
              </div>

              {/* Titre géant solennel */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Prestations Hospital Nomargueri.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-sky-400">
                  Dignité • Sérénité • Traçabilité
                </span>
              </h1>

              {/* Description sobre */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                Tarifs officiels des prestations funéraires et conservation frigorifique de l'Hôpital Nomargueri. Déclarez une admission, composez votre prise en charge et réglez par Mobile Money, carte bancaire ou directement au guichet en espèces.
              </p>

              {/* Deux CTAs majeurs côte-à-côte (comme RTNC Pay) */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <button
                  onClick={() => handleOpenWizard()}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
                >
                  Déclarer un décès & Choisir les services ➔
                </button>

                <button
                  onClick={onOpenSearchModal}
                  className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  Suivre un dossier existant
                </button>
              </div>

              {/* Mention des règlements acceptés (comme dans RTNC Pay) */}
              <div className="pt-2 text-xs text-slate-400 font-medium">
                <span className="text-slate-500">Règlements acceptés :</span> M-Pesa • Orange Money • Airtel Money • AfriMoney • Cartes Visa/Mastercard • Espèces au guichet
              </div>
            </div>

            {/* Colonne Droite : Carte institutionnelle encadrée (comme dans RTNC Pay) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0D1F44] border border-blue-900/70 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 backdrop-blur-sm">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  PROTOCOLE & ENGAGEMENTS EN VIGUEUR
                </div>

                {/* Encadré 1 interne mis en valeur */}
                <div className="bg-[#081530] border border-blue-800/60 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span>Conservation Frigorifique Contrôlée 24/7</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Surveillance thermique permanente (+2°C à +4°C). Identification unique et infalsifiable par scellé et bracelet QR Code dès l'admission.
                  </p>
                </div>

                {/* Encadré 2 interne */}
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-white">Ventilation tarifaire transparente</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Toutes nos quittances intègrent le détail des prestations sélectionnées avec reçu officiel, QR Code sécurisé et conformité médico-légale stricte.
                  </p>
                </div>

                {/* Bouton bas de carte */}
                <a
                  href="#catalogue"
                  className="w-full py-3 bg-[#11285A] hover:bg-[#163474] text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  Rechercher un service par catégorie ➔
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 CARTES FLOTTANTES DE TRANSITION (DISPOSITION RTNC PAY) */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Carte 1 */}
          <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chambres Froides & Conservation</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Conservation en froid positif standard et grand froid régulé. Sécurité thermique garantie 24h/24.
              </p>
            </div>
          </div>

          {/* Carte 2 */}
          <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Soins & Thanatopraxie</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Toilette mortuaire rituelle, thanatopraxie, habillage et présentation digne dans le respect des volontés.
              </p>
            </div>
          </div>

          {/* Carte 3 */}
          <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Factures & Reçus Officiels</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Quittances instantanées avec QR code sécurisé, conformité administrative et traçabilité financière totale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — GRILLE TARIFAIRE OFFICIELLE & CATALOGUE (DISPOSITION RTNC PAY) */}
      <section id="catalogue" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Grand conteneur bleu nuit arrondi comme dans RTNC Pay */}
        <div className="bg-[#091738] border border-blue-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Header du catalogue */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              GRILLE TARIFAIRE OFFICIELLE • HOSPITAL NOMARGUERI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Catalogue classé par catégorie
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Sélectionnez une catégorie ci-dessous pour filtrer les prestations de conservation, soins, cercueils, cérémonies ou transport.
            </p>
          </div>

          {/* Barre de Recherche intégrée (comme RTNC Pay) */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une prestation, une case frigorifique, un cercueil, une chapelle..."
              value={rechercheCatalogue}
              onChange={(e) => setRechercheCatalogue(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#06112A] border border-blue-900/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Onglets / Filtres par catégorie avec compteurs */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categoriesList.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategorie(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategorie === cat.key
                    ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                    : 'bg-[#0B1E48] text-slate-300 hover:text-white hover:bg-[#102960] border border-blue-900/60'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Grille des prestations */}
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
                      {art.uniteFacturation}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {art.titre}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {art.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-blue-950 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block text-[10px]">Tarif Officiel</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-amber-400">
                        {art.prixUnitaire} $
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        (~ {(art.prixUnitaire * 2800).toLocaleString()} CDF)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenWizard(art.id)}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center gap-1"
                  >
                    Choisir ce service
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
            {/* Logo et Nom */}
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

            {/* Assistance 24/7 & Localisation */}
            <div className="flex items-center space-x-6 text-slate-400 text-xs">
              <span>Kinshasa, RD Congo</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Urgences 24h/24 : <strong>+243 81 000 0000</strong></span>
              </span>
            </div>
          </div>

          <div className="border-t border-blue-950/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p className="text-slate-500">
              © {new Date().getFullYear()} Hospital Nomargueri. Tous droits réservés. Traçabilité par QR Code certifié.
            </p>

            {/* Mention expresse demandée : "Propulsé par Mokili" avec lien vers mokili.io */}
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
      {/* MODAL DU WORKFLOW DE DÉCLARATION EN 3 ÉTAPES (DÉFUNT -> SERVICES -> REÇU) */}
      {/* ========================================================================= */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1935] border border-blue-900/80 rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-6">
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
                    <span className={`font-semibold ${wizardStep === 1 ? 'text-amber-400' : 'text-slate-400'}`}>
                      1. Identités
                    </span>
                    <span>➔</span>
                    <span className={`font-semibold ${wizardStep === 2 ? 'text-amber-400' : 'text-slate-400'}`}>
                      2. Choix des Services
                    </span>
                    <span>➔</span>
                    <span className={`font-semibold ${wizardStep === 3 ? 'text-emerald-400' : 'text-slate-400'}`}>
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
                <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-sky-200">
                  <p className="font-semibold">Étape 1 sur 2 : Informations Légales</p>
                  <p className="text-[11px] text-sky-300/80 mt-0.5">
                    Renseignez l'identité du défunt et du représentant. À l'étape suivante, l'application vous proposera la sélection des prestations funéraires.
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
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white uppercase focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                    <div className="sm:col-span-1">
                      <label className="block text-slate-300 mb-1 font-medium">Nom complet du proche *</label>
                      <input
                        type="text"
                        placeholder="Ex: Jean-Luc KABEYA"
                        value={contactNom}
                        onChange={(e) => setContactNom(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white uppercase focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2"
                  >
                    Continuer vers le Choix des Services
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ÉTAPE 2 : L'APPLICATION PROPOSE LES SERVICES FUNÉRAIRES (DEMANDE UTILISATEUR) */}
            {wizardStep === 2 && (
              <div className="space-y-5 text-xs">
                <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-xl text-amber-200">
                  <p className="font-bold">Étape 2 sur 2 : Sélection des Prestations pour {defuntPrenom} {defuntNom}</p>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">
                    Cochez les services souhaités pour composer la prise en charge. Les frais d'admission et enregistrement légal (50 $) sont obligatoires pour ouvrir le dossier mortuaire.
                  </p>
                </div>

                {/* Liste des prestations disponibles */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {catalogue.map((art) => {
                    const isSelected = !!selectedServiceIds[art.id];
                    const qty = selectedServiceIds[art.id] || 1;
                    const isMandatory = art.id === 'art-1';

                    return (
                      <div
                        key={art.id}
                        onClick={() => toggleService(art.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-950/80 border-sky-400 text-white shadow-md'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                              isSelected ? 'bg-sky-500 text-white' : 'border border-slate-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{art.titre}</span>
                              {isMandatory && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold">
                                  Requis
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{art.description}</p>
                          </div>
                        </div>

                        <div className="text-right pl-3 shrink-0">
                          <span className="font-extrabold text-amber-400 text-sm block">
                            {art.prixUnitaire} $
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {art.uniteFacturation}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Barre de Total et Devis Estimé en Direct */}
                <div className="p-4 bg-[#081530] border border-blue-900/80 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total des Prestations Estimé</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-400">{totalEstimeUSD} $</span>
                      <span className="text-xs text-sky-300 font-mono">
                        (~ {totalEstimeCDF.toLocaleString()} CDF)
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
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-400/25 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? 'Création en cours...' : 'Valider & Créer le Dossier ➔'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 : RÉCÉPISSÉ OFFICIEL & ATTRIBUTION DU DOSSIER PAR QR CODE */}
            {wizardStep === 3 && createdDossier && (
              <div className="space-y-5 text-xs text-center py-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white">
                    Dossier Funéraire Créé avec Succès
                  </h4>
                  <p className="text-xs text-slate-300">
                    Votre demande a été enregistrée dans le registre officiel de l'Hôpital Nomargueri.
                  </p>
                </div>

                {/* Carte de Récépissé */}
                <div className="bg-[#081530] border border-blue-900 rounded-2xl p-5 text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-blue-950 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Numéro Officiel de Dossier</span>
                      <span className="text-lg font-black text-amber-400 font-mono">
                        {createdDossier.numeroDossier}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jeton QR Sécurisé</span>
                      <span className="text-xs font-mono text-sky-400">{createdDossier.qrCodeToken}</span>
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

                  {/* Prestations choisies */}
                  <div className="pt-2 border-t border-blue-950">
                    <span className="text-slate-400 block text-[10px] mb-1.5">Prestations Retenues :</span>
                    <div className="space-y-1">
                      {createdDossier.prestations.map((p) => (
                        <div key={p.id} className="flex justify-between text-[11px] text-slate-300">
                          <span>• {p.titre}</span>
                          <span className="font-semibold text-white">{p.prixTotal} $</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-blue-950 flex justify-between items-center text-sm font-bold">
                    <span className="text-white">Total des Prestations :</span>
                    <span className="text-amber-400 text-base">{createdDossier.finance.totalPrestations} $</span>
                  </div>
                </div>

                {/* Instructions pour la famille */}
                <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-left text-[11px] text-sky-200 space-y-1">
                  <p className="font-semibold text-white">Instructions pour la Famille :</p>
                  <p>
                    1. Présentez-vous à la morgue avec le numéro <strong>{createdDossier.numeroDossier}</strong> et le certificat de décès.
                  </p>
                  <p>
                    2. Le règlement des frais peut s'effectuer au guichet en espèces ou via Mobile Money dès confirmation de l'admission.
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
                    className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-md"
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
