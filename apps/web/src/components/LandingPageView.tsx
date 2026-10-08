import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
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
  HelpCircle,
  Copy,
  Download,
  Mail
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
  onOpenSearchModal: (mode?: 'DEFUNT' | 'DOSSIER') => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  catalogue,
  onCreateDemand,
  onSearchDossier,
  onOpenSearchModal
}) => {
  // Limite d'affichage des services du catalogue (6 par défaut, clic sur "Voir +" pour afficher le reste)
  const [showAllServices, setShowAllServices] = useState(false);

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

  // Étape 2 : Services sélectionnés par la famille (Frais d'admission inclus d'office)
  const [selectedServiceIds, setSelectedServiceIds] = useState<Record<string, number>>({
    'art-adm-00': 1 // Frais d'admission obligatoire pour l'ouverture du dossier
  });

  // Onglet actif dans l'étape 2 des services (filtre par pôle ou Tous)
  const [wizardCategoryTab, setWizardCategoryTab] = useState<string>('TOUS');

  // Étape 3 : Résultat après création & QR Code automatique
  const [createdDossier, setCreatedDossier] = useState<DossierVivant | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedInfo, setCopiedInfo] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Génération automatique du QR Code certifié pour le médecin et l'accueil
  useEffect(() => {
    if (createdDossier) {
      QRCode.toDataURL(createdDossier.numeroDossier, {
        width: 220,
        margin: 2,
        color: { dark: '#061126', light: '#ffffff' }
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Erreur génération QR Code:', err));
    }
  }, [createdDossier]);

  // Copie complète des informations du dossier dans le presse-papier
  const handleCopyInfo = () => {
    if (!createdDossier) return;
    const infoText = `HOSPITAL NOMARGUERI — DOSSIER FUNÉRAIRE OFFICIEL
==================================================
Numéro de Dossier : ${createdDossier.numeroDossier}
Jeton QR Sécurisé : ${createdDossier.qrCodeToken}
Statut : ${createdDossier.statut}
Date d'enregistrement : ${new Date(createdDossier.dateCreation).toLocaleDateString('fr-FR')}

DÉFUNT :
- Nom : ${createdDossier.defunt.prenom} ${createdDossier.defunt.nom}
- Sexe : ${createdDossier.defunt.sexe}
- Date du décès : ${createdDossier.defunt.dateDeces}
- Lieu du décès : ${createdDossier.defunt.lieuDeces}

REPRÉSENTANT FAMILIAL :
- Nom : ${createdDossier.demandeur.nom}
- Lien : ${createdDossier.demandeur.lienParente}
- Téléphone : ${createdDossier.demandeur.telephone}

PRESTATIONS RETENUES :
${createdDossier.prestations.map((p) => `- ${p.titre}`).join('\n')}

ÉTABLISSEMENT :
- Adresse : N°10 AV/Mondo Q/Domaine-Village Mbezale C/Nsele
- Contact 24h/24 : +243 997 222 228 / +243 833 330 040
- Email : contact@nomargueri.com
==================================================
Présentez ce numéro ou le QR Code au médecin ou à l'accueil pour retrouver immédiatement votre dossier.`;

    navigator.clipboard.writeText(infoText).then(() => {
      setCopiedInfo(true);
      setTimeout(() => setCopiedInfo(false), 3000);
    });
  };

  // Téléchargement direct de l'image QR Code
  const handleDownloadQrImage = () => {
    if (!qrCodeDataUrl || !createdDossier) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `QRCode-${createdDossier.numeroDossier.replace('#', '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Recherche & Filtres dans le catalogue public
  const [rechercheCatalogue, setRechercheCatalogue] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState<string>('TOUS');

  // Gestion de la sélection des services (art-adm-00 verrouillé d'office)
  const toggleService = (articleId: string) => {
    if (articleId === 'art-adm-00') {
      alert("Les frais d'admission constituent le service de base obligatoire pour l'ouverture du dossier funéraire.");
      return;
    }
    setSelectedServiceIds((prev) => {
      const next = { ...prev };
      if (next[articleId]) {
        delete next[articleId];
      } else {
        next[articleId] = 1;
      }
      // Frais d'admission toujours garantis
      next['art-adm-00'] = 1;
      return next;
    });
  };

  // Démarrage du wizard (avec admission garantie)
  const handleOpenWizard = (preselectedArticleId?: string) => {
    setSelectedServiceIds((prev) => ({
      ...prev,
      'art-adm-00': 1,
      ...(preselectedArticleId ? { [preselectedArticleId]: 1 } : {})
    }));
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

      {/* HEADER PRINCIPAL PROPORTIONNÉ */}
      <header className="sticky top-0 z-40 bg-[#061126]/95 backdrop-blur-md border-b border-blue-950/80 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo et Identité H+ Hospital Nomargueri (format compact sans badge souverain) */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <img
              src="/logo-hospital-nomargueri.jpg"
              alt="Logo H+ Hospital Nomargueri"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-sky-400/80 shadow-sm object-cover bg-white shrink-0"
            />
            <div className="min-w-0">
              <span className="text-xs sm:text-base font-extrabold tracking-tight text-white uppercase font-sans block leading-none truncate">
                HOSPITAL NOMARGUERI
              </span>
              <p className="text-[9px] sm:text-[10px] text-sky-300/80 tracking-wide uppercase font-medium mt-0.5 sm:mt-1 truncate">
                Morgue & Parcours Funéraire
              </p>
            </div>
          </div>

          {/* Bouton d'Action Header */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-semibold shrink-0">
            <button
              onClick={() => onOpenSearchModal('DEFUNT')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-blue-900/80 transition-colors shadow-sm text-[11px] sm:text-xs"
            >
              <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Trouver un défunt</span>
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1 — HERO SECTION (DISPOSITION 2 COLONNES AVEC LES CTAS EN BLOC DÉDIÉ) */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20 border-b border-blue-950/60 bg-gradient-to-b from-[#061126] via-[#091A3E] to-[#0A1E48]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(2,132,199,0.15),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Colonne Gauche : Titre percutant & Description */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Hospital Nomargueri.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">
                  Dignité • Sérénité • Traçabilité
                </span>
              </h1>

              <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                Prise en charge intégrale et personnalisée du parcours funéraire : réservation de salons de recueillement, soins de thanatopraxie, logistique de transport sécurisée et assistance aux formalités officielles.
              </p>
            </div>

            {/* Colonne Droite : Les 3 CTAs */}
            <div className="lg:col-span-5">
              <div className="bg-[#0B1E48]/90 border border-blue-900/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 backdrop-blur-sm">
                <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                  DÉMARCHES EN LIGNE & ACCOMPAGNEMENT
                </div>

                <div className="space-y-3">
                  {/* CTA 1 : Déclarer un décès */}
                  <button
                    onClick={() => handleOpenWizard()}
                    className="w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Déclarer un décès</span>
                  </button>

                  {/* CTA 2 : Suivre un dossier */}
                  <button
                    onClick={() => onOpenSearchModal('DOSSIER')}
                    className="w-full py-3.5 px-5 rounded-xl bg-[#061126] hover:bg-slate-900 text-slate-200 border border-blue-900 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Search className="w-4 h-4 text-sky-400" />
                    <span>Suivre un dossier</span>
                  </button>

                  {/* CTA 3 : Nos services */}
                  <a
                    href="#catalogue"
                    className="w-full py-3 px-5 bg-blue-950/60 hover:bg-blue-900/60 text-sky-300 hover:text-white border border-blue-800/60 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Nos services</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                  </a>
                </div>
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

          {/* Grille des prestations sans aucun prix public (6 premiers services par défaut) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {(showAllServices ? filteredCatalogue : filteredCatalogue.slice(0, 6)).map((art) => (
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

          {/* Bouton "Voir +" pour afficher le reste des services */}
          {filteredCatalogue.length > 6 && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setShowAllServices(!showAllServices)}
                className="px-6 py-2.5 rounded-xl bg-blue-900/70 hover:bg-blue-800 text-sky-200 border border-blue-700/80 font-semibold text-xs transition-colors shadow-sm"
              >
                {showAllServices
                  ? 'Voir moins'
                  : `Voir + (${filteredCatalogue.length - 6} autres prestations)`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER OFFICIEL — AVEC BLOCS ADRESSE & CONTACTS RÉAGENCÉS ET MENTION PROPULSÉ PAR MOKILI */}
      <footer className="mt-auto bg-[#040C1D] py-10 border-t border-blue-950/80 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-between">
            {/* Colonne Gauche : Logo et Identité */}
            <div className="flex items-center justify-center md:justify-start space-x-3 shrink-0">
              <img
                src="/logo-hospital-nomargueri.jpg"
                alt="Hospital Nomargueri"
                className="w-10 h-10 rounded-full border border-sky-400/80 shadow object-cover bg-white shrink-0"
              />
              <div className="text-left">
                <span className="font-bold text-white uppercase text-sm block">
                  HOSPITAL NOMARGUERI
                </span>
                <span className="text-[11px] text-slate-400">
                  Morgue & Parcours Funéraire
                </span>
              </div>
            </div>

            {/* Colonne Centrale : Adresse Centrée avec Kinshasa DRC. à la 2ème ligne */}
            <div className="flex flex-col items-center text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-sky-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Adresse</span>
              </div>
              <div className="text-xs text-slate-200 leading-snug">
                <div>10, Av : Mondo, Domaine-Village Mbezale, Nsele,</div>
                <div className="font-semibold text-slate-100">Kinshasa DRC.</div>
              </div>
            </div>

            {/* Colonne Droite : Contacts formaté à droite */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1">
              <div className="inline-flex items-center md:justify-end gap-1.5 text-sky-400">
                <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Contacts</span>
              </div>
              <div className="font-mono text-white text-[11px] space-y-0.5">
                <div>+243 997 222 228 / +243 833 330 040</div>
                <a
                  href="mailto:contact@nomargueri.com"
                  className="font-mono text-sky-300 hover:underline text-[11px] block"
                >
                  contact@nomargueri.com
                </a>
              </div>
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
          <div className="relative bg-[#0A1A3E] border border-blue-900/80 rounded-2xl max-w-4xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-6">
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

            {/* ÉTAPE 2 : PROPOSITION ET SÉLECTION SIMPLE / MULTIPLE DES SERVICES (5 PÔLES) */}
            {wizardStep === 2 && (
              <div className="space-y-4 text-xs">
                {/* En-tête explicatif clair */}
                <div className="p-3.5 bg-blue-950/60 border border-blue-800/60 rounded-xl text-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm text-white">Services Proposés pour {defuntPrenom} {defuntNom}</p>
                    <p className="text-[11px] text-sky-300/80 mt-0.5">
                      Cliquez sur une ou plusieurs prestations pour les ajouter à la prise en charge. Vous pouvez combiner librement les services.
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-900/80 text-sky-300 border border-sky-400/40">
                    Sélection multiple libre
                  </span>
                </div>

                {/* Filtres par Pôle (Onglets complets et lisibles, sans texte tronqué) */}
                <div className="flex flex-wrap gap-1.5 border-b border-blue-950 pb-2.5">
                  {[
                    { key: 'TOUS', label: 'Tous les services', count: catalogue.length },
                    { key: 'CEREMONIE', label: '1. Recueillement & Salons', count: catalogue.filter(c => c.categorie === 'CEREMONIE').length },
                    { key: 'TOILETTE_ET_SOINS', label: '2. Soins & Thanatopraxie', count: catalogue.filter(c => c.categorie === 'TOILETTE_ET_SOINS' || c.categorie === 'CONSERVATION').length },
                    { key: 'FOURNITURE_FUNERAIRE', label: '3. Boutique d’Articles & Cercueils', count: catalogue.filter(c => c.categorie === 'FOURNITURE_FUNERAIRE').length },
                    { key: 'TRANSPORT', label: '4. Suivi Logistique & Transport', count: catalogue.filter(c => c.categorie === 'TRANSPORT').length },
                    { key: 'ADMINISTRATIF', label: '5. Assistance Administrative', count: catalogue.filter(c => c.categorie === 'ADMINISTRATIF' || c.categorie === 'ADMISSION').length }
                  ].map((tab) => {
                    const isActive = wizardCategoryTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setWizardCategoryTab(tab.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md font-bold'
                            : 'bg-[#061126] text-slate-300 hover:text-white hover:bg-[#0E2456] border border-blue-900/60'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-blue-800 text-sky-200' : 'bg-slate-900 text-slate-400'}`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Grille des Services : Grands blocs très lisibles et sélectionnables en 1 clic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[390px] overflow-y-auto pr-1">
                  {catalogue
                    .filter((art) => {
                      if (wizardCategoryTab === 'TOUS') return true;
                      if (wizardCategoryTab === 'CEREMONIE') return art.categorie === 'CEREMONIE';
                      if (wizardCategoryTab === 'TOILETTE_ET_SOINS') return art.categorie === 'TOILETTE_ET_SOINS' || art.categorie === 'CONSERVATION';
                      if (wizardCategoryTab === 'FOURNITURE_FUNERAIRE') return art.categorie === 'FOURNITURE_FUNERAIRE';
                      if (wizardCategoryTab === 'TRANSPORT') return art.categorie === 'TRANSPORT';
                      if (wizardCategoryTab === 'ADMINISTRATIF') return art.categorie === 'ADMINISTRATIF' || art.categorie === 'ADMISSION';
                      return true;
                    })
                    .map((art) => {
                      const isSelected = !!selectedServiceIds[art.id];
                      return (
                        <div
                          key={art.id}
                          onClick={() => toggleService(art.id)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                            isSelected
                              ? 'bg-[#0B2559] border-sky-400 text-white shadow-lg shadow-blue-900/40 ring-1 ring-sky-400/40'
                              : 'bg-[#061126] border-blue-900/60 text-slate-300 hover:border-slate-600 hover:bg-[#0A1D45]'
                          }`}
                        >
                          <div>
                            {/* Entête du service : Catégorie + Bouton état de sélection */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-sky-300 border border-blue-900">
                                {art.id === 'art-adm-00' || art.categorie === 'ADMISSION'
                                  ? 'Ouverture de Dossier (Base)'
                                  : art.categorie === 'CEREMONIE'
                                  ? 'Recueillement & Salon'
                                  : art.categorie === 'TOILETTE_ET_SOINS' || art.categorie === 'CONSERVATION'
                                  ? 'Soins du Corps'
                                  : art.categorie === 'FOURNITURE_FUNERAIRE'
                                  ? 'Boutique Funéraire'
                                  : art.categorie === 'TRANSPORT'
                                  ? 'Axe Transport'
                                  : 'Assistance Administrative'}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {art.id === 'art-adm-00' ? (
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-sky-200 bg-blue-900/90 px-2.5 py-1 rounded-lg border border-sky-400">
                                    <Check className="w-3.5 h-3.5 text-sky-300" />
                                    Obligatoire d'office
                                  </span>
                                ) : isSelected ? (
                                  <span className="flex items-center gap-1 text-[11px] font-bold text-sky-200 bg-sky-500/30 px-2.5 py-1 rounded-lg border border-sky-400/50">
                                    <Check className="w-3.5 h-3.5 text-sky-300" />
                                    Sélectionné
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-medium text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/80 hover:text-white">
                                    + Choisir
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Titre du service */}
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                              {art.titre}
                            </h4>

                            {/* Description claire et complète */}
                            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                              {art.description}
                            </p>
                          </div>

                          {/* Options contextuelles si le salon ou le transport est sélectionné */}
                          {isSelected && (art.id === 'art-rec-01' || art.id === 'art-rec-02') && (
                            <div className="mt-3 pt-2.5 border-t border-sky-500/30" onClick={(e) => e.stopPropagation()}>
                              <label className="block text-[10px] font-semibold text-sky-200 mb-1">
                                Date et heure souhaitée pour la veillée :
                              </label>
                              <input
                                type="datetime-local"
                                value={dateSalon}
                                onChange={(e) => setDateSalon(e.target.value)}
                                className="w-full p-2 bg-[#061126] border border-sky-400/60 rounded-lg text-white text-xs focus:outline-none"
                              />
                            </div>
                          )}

                          {isSelected && art.id === 'art-transp-01' && (
                            <div className="mt-3 pt-2.5 border-t border-sky-500/30" onClick={(e) => e.stopPropagation()}>
                              <label className="block text-[10px] font-semibold text-sky-200 mb-1">
                                Hôpital ou morgue de départ (pour le transfert) :
                              </label>
                              <input
                                type="text"
                                placeholder="Ex: Clinique Ngaliema ou Hôpital Provincial..."
                                value={morgueDepart}
                                onChange={(e) => setMorgueDepart(e.target.value)}
                                className="w-full p-2 bg-[#061126] border border-sky-400/60 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Synthèse des services retenus & Actions de validation */}
                <div className="p-3.5 bg-[#061126] border border-blue-900/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="w-full sm:w-auto">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Prestations Retenues</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-sky-400">
                        {Object.keys(selectedServiceIds).length} prestation(s)
                      </span>
                      <span className="text-xs text-slate-400">
                        sélectionnée(s) pour la prise en charge
                      </span>
                    </div>

                    {/* Mini pastilles des services sélectionnés pour un aperçu instantané */}
                    <div className="flex flex-wrap gap-1 mt-1.5 max-w-lg">
                      {Object.keys(selectedServiceIds).map((id) => {
                        const art = catalogue.find((a) => a.id === id);
                        return art ? (
                          <span
                            key={id}
                            onClick={() => toggleService(id)}
                            className="text-[10px] bg-blue-950 text-sky-300 border border-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-red-950 hover:text-red-300 hover:border-red-800 transition-colors"
                            title="Cliquer pour retirer"
                          >
                            {art.titre.slice(0, 22)}...
                            <span className="text-slate-400">✕</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-blue-900 transition-colors"
                    >
                      ← Précédent
                    </button>

                    <button
                      type="button"
                      disabled={submitting || Object.keys(selectedServiceIds).length === 0}
                      onClick={handleFinalSubmit}
                      className="flex-1 sm:flex-initial px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? 'Enregistrement...' : 'Valider & Créer le Dossier ➔'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 : RÉCÉPISSÉ OFFICIEL, QR CODE AUTOMATIQUE, COPIE & TÉLÉCHARGEMENT PDF */}
            {wizardStep === 3 && createdDossier && (
              <div className="space-y-4 text-xs text-center py-1">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white">
                    Dossier Funéraire Enregistré avec Succès
                  </h4>
                  <p className="text-xs text-slate-300">
                    Votre demande de prise en charge a été enregistrée avec attribution immédiate d'un QR Code certifié.
                  </p>
                </div>

                {/* Bloc QR Code Officiel attribué automatiquement pour les médecins et l'accueil */}
                <div className="bg-[#040D20] border-2 border-sky-400/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-left shadow-xl">
                  {qrCodeDataUrl ? (
                    <div className="bg-white p-2.5 rounded-xl shadow-md shrink-0 text-center">
                      <img src={qrCodeDataUrl} alt="QR Code Dossier" className="w-32 h-32 object-contain mx-auto" />
                      <span className="block text-[9px] font-mono font-bold text-slate-900 mt-1">
                        SCAN OFFICIEL
                      </span>
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 border border-blue-900">
                      <QrCode className="w-10 h-10 text-sky-400 animate-pulse" />
                    </div>
                  )}

                  <div className="space-y-2 flex-1">
                    <div>
                      <span className="text-[10px] text-sky-300 font-semibold uppercase tracking-wider block">
                        Code QR Certifié Attribué au Dossier
                      </span>
                      <span className="text-lg sm:text-xl font-black text-white font-mono tracking-tight block">
                        {createdDossier.numeroDossier}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Ce QR Code est attribué automatiquement à votre dossier. Présentez-le à l'accueil ou au médecin pour qu'ils retrouvent immédiatement l'ensemble de vos informations dans leur base de données.
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadQrImage}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Télécharger le QR Code (.PNG)
                    </button>
                  </div>
                </div>

                {/* Carte Récapitulative du Récépissé */}
                <div className="bg-[#061126] border border-blue-900 rounded-2xl p-4 sm:p-5 text-left space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-blue-950">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Défunt Pris en Charge :</span>
                      <strong className="text-white text-sm block mt-0.5">
                        {createdDossier.defunt.prenom} {createdDossier.defunt.nom}
                      </strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">Décès déclaré le : {createdDossier.defunt.dateDeces}</p>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-xl border border-blue-950">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Représentant Familial :</span>
                      <strong className="text-white text-sm block mt-0.5">
                        {createdDossier.demandeur.nom}
                      </strong>
                      <p className="text-slate-400 text-[11px] font-mono mt-0.5">{createdDossier.demandeur.telephone}</p>
                    </div>
                  </div>

                  {/* Prestations choisies avec Frais d'admission obligatoire */}
                  <div className="pt-2 border-t border-blue-950">
                    <span className="text-slate-400 block text-[10px] mb-1.5 font-semibold uppercase">
                      Prestations et Services Enregistrés :
                    </span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {createdDossier.prestations.map((p) => (
                        <div key={p.id} className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-blue-950">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            {p.titre}
                          </span>
                          <span className="text-[10px] text-sky-400 font-mono font-semibold px-2 py-0.5 rounded bg-blue-950 border border-blue-900">
                            Validé
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Instructions pour la famille */}
                <div className="p-3 bg-blue-950/60 border border-blue-800/60 rounded-xl text-left text-[11px] text-sky-200 space-y-1">
                  <p className="font-semibold text-white">Instructions pour la Famille :</p>
                  <p>
                    1. Présentez-vous à l'accueil du funérarium (N°10 AV/Mondo Q/Domaine-Village Mbezale C/Nsele) muni du numéro <strong>{createdDossier.numeroDossier}</strong> ou de votre QR Code.
                  </p>
                  <p>
                    2. Le médecin et nos conseillers accèdent instantanément à votre dossier dès le scan pour valider les actes d'admission et lancer les prestations demandées.
                  </p>
                </div>

                {/* Barre d'Actions : Copier, Télécharger PDF, Suivre */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {/* Bouton 1 : Copier mes informations */}
                  <button
                    type="button"
                    onClick={handleCopyInfo}
                    className={`py-3 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 border ${
                      copiedInfo
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-blue-900'
                    }`}
                  >
                    {copiedInfo ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>Informations Copiées !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-sky-400" />
                        <span>Copier mes informations</span>
                      </>
                    )}
                  </button>

                  {/* Bouton 2 : Télécharger en PDF */}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-sky-300" />
                    <span>Télécharger en PDF</span>
                  </button>

                  {/* Bouton 3 : Suivre le dossier en ligne */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsWizardOpen(false);
                      onSearchDossier(createdDossier.numeroDossier);
                    }}
                    className="py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    <span>Suivre en Ligne ➔</span>
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
