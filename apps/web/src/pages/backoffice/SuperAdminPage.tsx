import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Layers,
  ArrowUpDown,
  CreditCard,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  DollarSign,
  ArrowRight,
  UserCheck,
  Lock,
  Building,
  KeyRound,
  LayoutDashboard,
  Calendar,
  FileCheck,
  Truck,
  Eye,
  RefreshCw,
  Box,
  Scale,
  Sparkles,
  Sliders,
  ChevronRight,
  Tag,
  Check,
  X,
  FileText,
  Activity,
  Award,
  HelpCircle,
  Edit3
} from 'lucide-react';
import { useBackoffice, UserSession, PoleMetier } from '../../context/BackofficeContext';
import { NiveauAccreditation } from '@nomarguerrie/shared-types';
import { UTILISATEURS_MOCK } from '../../data/mock-db';

export interface OperationMultiPole {
  id: string;
  pole: 'MORGUE' | 'FUNERARIUM';
  type: string;
  dossierId: string;
  defunt: string;
  agent: string;
  horodatage: string;
  statut: 'VALIDE' | 'EN_COURS' | 'ALERTE';
  montant?: string;
}

export interface FluxDossier {
  dossierId: string;
  defunt: string;
  pole: 'MORGUE' | 'FUNERARIUM';
  dateEntree: string;
  statutSejour: string;
  dateSortiePrevue: string;
  sortieEffective?: string;
  finances: 'SOLDE' | 'ACOMPTE' | 'EN_ATTENTE';
  resteAPayer?: string;
  visaLegal: 'VALIDE' | 'EN_ATTENTE' | 'REQUISITION';
}

export interface ServicePrestationSimilaire {
  id: string;
  categorie: 'SOINS_CORPS' | 'HEBERGEMENT_ESPACE' | 'TRANSPORT_CONVOI' | 'FOURNITURES' | 'FORMALITES' | 'CAISSE_TARIFS';
  nomCategorie: string;
  nomService: string;
  pole: 'MORGUE' | 'FUNERARIUM';
  perimetreMission: string;
  lieuOuRessource: string;
  prixUSD: number;
  prixCDF: number;
  statut: 'ACTIF' | 'EN_REVISION' | 'SUR_DEVIS';
  responsableMetier: string;
  differentiateurCle: string;
  correspondancePaire: string; // Nom du service similaire dans l'autre pôle
}

export const SuperAdminPage: React.FC = () => {
  const { theme } = useBackoffice();
  const isDark = theme === 'dark';

  // Navigation interne Super Admin
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SERVICES' | 'RBAC' | 'FLUX' | 'OPERATIONS' | 'FINANCE'>('DASHBOARD');

  // Filtre de pôle transverse
  const [poleFilter, setPoleFilter] = useState<'TOUS' | 'MORGUE' | 'FUNERARIUM'>('TOUS');

  // =========================================================================
  // 1. SERVICES & PRESTATIONS COMMUNS OU SIMILAIRES (AVEC BADGES ET MATRIX)
  // =========================================================================
  const [catalogueServices, setCatalogueServices] = useState<ServicePrestationSimilaire[]>([
    // --- 1. SOINS & PRÉPARATION CORPORELLE ---
    {
      id: 'SRV-001',
      categorie: 'SOINS_CORPS',
      nomCategorie: 'Soins du Corps & Préparation',
      nomService: 'Thanatopraxie Clinique & Soins de Conservation',
      pole: 'MORGUE',
      perimetreMission: 'Traitement médical et aseptique obligatoire, injection intra-artérielle de fluides conservateurs, désinfection complète et maintien thermique en chambre froide (+2°C/+4°C).',
      lieuOuRessource: 'Laboratoire de Thanatopraxie Clinique (Morgue)',
      prixUSD: 250,
      prixCDF: 700000,
      statut: 'ACTIF',
      responsableMetier: 'Médecin Légiste & Thanatopracteur Hospitalier',
      differentiateurCle: 'Conservation biologique et médico-technique du corps sous surveillance hygiénique stricte.',
      correspondancePaire: 'Toilette Rituelle, Habillage & Maquillage Cérémonial'
    },
    {
      id: 'SRV-002',
      categorie: 'SOINS_CORPS',
      nomCategorie: 'Soins du Corps & Préparation',
      nomService: 'Toilette Rituelle, Habillage & Maquillage Cérémonial',
      pole: 'FUNERARIUM',
      perimetreMission: 'Mise en beauté esthétique, coiffure soignée, maquillage funéraire adapté au recueillement, habillage solennel avec les vêtements et parures fournis par la famille.',
      lieuOuRessource: 'Salle de Préparation Esthétique & Loge Funéraire',
      prixUSD: 180,
      prixCDF: 504000,
      statut: 'ACTIF',
      responsableMetier: 'Maître de Cérémonie & Esthéticien Funéraire',
      differentiateurCle: 'Présentation visuelle digne et apaisante pour l’adieu et le recueillement de la famille.',
      correspondancePaire: 'Thanatopraxie Clinique & Soins de Conservation'
    },
    {
      id: 'SRV-003',
      categorie: 'SOINS_CORPS',
      nomCategorie: 'Soins du Corps & Préparation',
      nomService: 'Reconstitution Morphologique Post-Traumatique',
      pole: 'MORGUE',
      perimetreMission: 'Restauration faciale et corporelle suite à accident ou autopsie médico-légale, sutures chirurgicales et modelage plastique de scellement.',
      lieuOuRessource: 'Bloc Opératoire Médico-Légal (Morgue)',
      prixUSD: 320,
      prixCDF: 896000,
      statut: 'ACTIF',
      responsableMetier: 'Chirurgien / Légiste Agréé',
      differentiateurCle: 'Actes chirurgicaux invasifs et légaux de reconstitution anatomique.',
      correspondancePaire: 'Mise en Bière Solennelle & Présentation au Cercueil'
    },
    {
      id: 'SRV-004',
      categorie: 'SOINS_CORPS',
      nomCategorie: 'Soins du Corps & Préparation',
      nomService: 'Mise en Bière Solennelle & Présentation au Cercueil',
      pole: 'FUNERARIUM',
      perimetreMission: 'Installation du défunt dans le cercueil capitonné, disposition des mains, recueillement de levée de bière, scellement rituel sous le regard des proches.',
      lieuOuRessource: 'Salon Funéraire & Salle de Mise en Bière',
      prixUSD: 150,
      prixCDF: 420000,
      statut: 'ACTIF',
      responsableMetier: 'Équipe Funéraire d’Honneur',
      differentiateurCle: 'Rituel solennel d’introduction du corps dans son cercueil avant cérémonie.',
      correspondancePaire: 'Reconstitution Morphologique Post-Traumatique'
    },

    // --- 2. HÉBERGEMENT & ESPACES ---
    {
      id: 'SRV-005',
      categorie: 'HEBERGEMENT_ESPACE',
      nomCategorie: 'Hébergement & Espaces de Recueillement',
      nomService: 'Conservation en Casier Frigorifique (+2°C / +4°C)',
      pole: 'MORGUE',
      perimetreMission: 'Séjour en case frigorifique régulée avec contrôle thermo-hygrométrique continu 24h/24, sonde numérique connectée, alerte automatique si durée > 15 jours.',
      lieuOuRessource: 'Chambres Froides F1, F2 ou F3 (32 casiers)',
      prixUSD: 25,
      prixCDF: 700000, // Forfait jour
      statut: 'ACTIF',
      responsableMetier: 'Régulateur Frigoriste & Agent d’Admission',
      differentiateurCle: 'Conservation sous chaîne de froid positive continue du corps biologique.',
      correspondancePaire: 'Location Grand Salon Cérémonial Climatisé (Veillée)'
    },
    {
      id: 'SRV-006',
      categorie: 'HEBERGEMENT_ESPACE',
      nomCategorie: 'Hébergement & Espaces de Recueillement',
      nomService: 'Location Grand Salon Cérémonial Climatisé (Veillée)',
      pole: 'FUNERARIUM',
      perimetreMission: 'Espace climatisé de recueillement et de culte (capacité 120 places assises), pupitre d’hommage, sonorisation, diffusion photo/vidéo souvenir, loge famille privée.',
      lieuOuRessource: 'Grand Salon Cérémonial A ou B',
      prixUSD: 650,
      prixCDF: 1820000,
      statut: 'ACTIF',
      responsableMetier: 'Régisseur Général des Salons Funéraires',
      differentiateurCle: 'Accueil collectif de la communauté pour veillées religieuses ou cérémonies d’adieu.',
      correspondancePaire: 'Conservation en Casier Frigorifique (+2°C / +4°C)'
    },
    {
      id: 'SRV-007',
      categorie: 'HEBERGEMENT_ESPACE',
      nomCategorie: 'Hébergement & Espaces de Recueillement',
      nomService: 'Casier Frigorifique Grand Froid / Réserve Sécurisée',
      pole: 'MORGUE',
      perimetreMission: 'Conservation spécialisée longue durée sous scellé parquet ou litige successoral, casier sécurisé avec traçabilité biométrique d’ouverture.',
      lieuOuRessource: 'Chambre F3 (Réserve sécurisée sous scellé)',
      prixUSD: 40,
      prixCDF: 112000,
      statut: 'ACTIF',
      responsableMetier: 'Chef d’Exploitation Morgue',
      differentiateurCle: 'Conservation judiciaire et sous scellé officiel inviolable.',
      correspondancePaire: 'Salon Intimiste de Recueillement VIP'
    },
    {
      id: 'SRV-008',
      categorie: 'HEBERGEMENT_ESPACE',
      nomCategorie: 'Hébergement & Espaces de Recueillement',
      nomService: 'Salon Intimiste de Recueillement VIP',
      pole: 'FUNERARIUM',
      perimetreMission: 'Salon feutré climatisé (capacité 30 personnes) pour adieu intime de la proche famille, service conciergerie, boissons chaudes et eau de source.',
      lieuOuRessource: 'Salons Intimistes C et D',
      prixUSD: 350,
      prixCDF: 980000,
      statut: 'ACTIF',
      responsableMetier: 'Hôte d’Accueil & Conciergerie Funéraire',
      differentiateurCle: 'Espace de confidentialité réservé aux ayants droit immédiats.',
      correspondancePaire: 'Casier Frigorifique Grand Froid / Réserve Sécurisée'
    },

    // --- 3. TRANSPORTS, CONVOIS & LOGISTIQUE ---
    {
      id: 'SRV-009',
      categorie: 'TRANSPORT_CONVOI',
      nomCategorie: 'Transports, Convois & Véhicules',
      nomService: 'Transfert Sanitaire & Admission Dépouille',
      pole: 'MORGUE',
      perimetreMission: 'Prise en charge du corps au centre hospitalier ou à domicile, brancard étanche sécurisé, transport hygiénique vers le sas d’admission morgue.',
      lieuOuRessource: 'Fourgon Sanitaire Hospitalier #01 / #02',
      prixUSD: 120,
      prixCDF: 336000,
      statut: 'ACTIF',
      responsableMetier: 'Ambulancier & Brancardier Mortuaire',
      differentiateurCle: 'Transport médicalisé et prise en charge primaire du corps dès le constat de décès.',
      correspondancePaire: 'Convoi d’Honneur Corbillard Limousine VIP'
    },
    {
      id: 'SRV-010',
      categorie: 'TRANSPORT_CONVOI',
      nomCategorie: 'Transports, Convois & Véhicules',
      nomService: 'Convoi d’Honneur Corbillard Limousine VIP',
      pole: 'FUNERARIUM',
      perimetreMission: 'Cortège funéraire solennel avec Corbillard Limousine Lincoln d’apparat, chauffeur en livrée, sonnerie d’adieu, guidage vers l’église et le cimetière / nécropole.',
      lieuOuRessource: 'Limousine Lincoln Cérémoniale VIP',
      prixUSD: 450,
      prixCDF: 1260000,
      statut: 'ACTIF',
      responsableMetier: 'Maître de Convoi Funéraire & Conducteur d’Honneur',
      differentiateurCle: 'Cortège public d’apparat et procession d’hommage vers l’inhumation.',
      correspondancePaire: 'Transfert Sanitaire & Admission Dépouille'
    },
    {
      id: 'SRV-011',
      categorie: 'TRANSPORT_CONVOI',
      nomCategorie: 'Transports, Convois & Véhicules',
      nomService: 'Transfert Interne Morgue vers Salons Funéraires',
      pole: 'MORGUE',
      perimetreMission: 'Passage par sas sécurisé interne reliant la zone froide de conservation aux salons funéraires, scellement biométrique du transfert sans rupture de garde.',
      lieuOuRessource: 'Sas Hygiénique Intermédiaire Morgue-Funérarium',
      prixUSD: 0,
      prixCDF: 0,
      statut: 'ACTIF',
      responsableMetier: 'Régulateur Technique Interne',
      differentiateurCle: 'Mouvement interne interne zéro coût garantissant la chaîne de garde hospitalière.',
      correspondancePaire: 'Convoi Bus Deluxe d’Accompagnement de Famille'
    },
    {
      id: 'SRV-012',
      categorie: 'TRANSPORT_CONVOI',
      nomCategorie: 'Transports, Convois & Véhicules',
      nomService: 'Convoi Bus Deluxe d’Accompagnement de Famille',
      pole: 'FUNERARIUM',
      perimetreMission: 'Autocar climatisé 45 places assurant le transport groupé de la délégation familiale depuis le funérarium vers la cérémonie religieuse et le lieu de sépulture.',
      lieuOuRessource: 'Flotte Bus Convoi NomarGuerrie',
      prixUSD: 280,
      prixCDF: 784000,
      statut: 'ACTIF',
      responsableMetier: 'Coordinateur Logistique des Convois',
      differentiateurCle: 'Transport des personnes et de la délégation accompagnatrice.',
      correspondancePaire: 'Transfert Interne Morgue vers Salons Funéraires'
    },

    // --- 4. FOURNITURES, CERCUEILS & ACCESSOIRES ---
    {
      id: 'SRV-013',
      categorie: 'FOURNITURES',
      nomCategorie: 'Fournitures, Cercueils & Équipements',
      nomService: 'Housse Mortuaire Sanitaire & Bracelet QR Code Scellé',
      pole: 'MORGUE',
      perimetreMission: 'Housse hermétique thermo-soudée conforme aux normes de biosécurité OMS, bracelet d’identification indéchirable scellé au poignet avec identifiant unique NG-2026-XXXX.',
      lieuOuRessource: 'Stock Sanitaire Central Morgue',
      prixUSD: 45,
      prixCDF: 126000,
      statut: 'ACTIF',
      responsableMetier: 'Responsable Approvisionnement Sanitaire',
      differentiateurCle: 'Fournitures sanitaires étanches et traçabilité inviolable dès l’admission.',
      correspondancePaire: 'Cercueil Bois Noble Verni & Capitonnage Satin'
    },
    {
      id: 'SRV-014',
      categorie: 'FOURNITURES',
      nomCategorie: 'Fournitures, Cercueils & Équipements',
      nomService: 'Cercueil Bois Noble Verni & Capitonnage Satin',
      pole: 'FUNERARIUM',
      perimetreMission: 'Cercueil d’ébénisterie en Chêne ou Acajou massif, capitonnage satin blanc ou ivoire, 4 poignées en laiton moulé, crucifix ou croissant gravé, plaque nominative.',
      lieuOuRessource: 'Showroom des Cercueils Funéraires',
      prixUSD: 850,
      prixCDF: 2380000,
      statut: 'ACTIF',
      responsableMetier: 'Conseiller Funéraire & Maître Ébéniste',
      differentiateurCle: 'Ouvrage d’art funéraire destiné à la sépulture et au dernier hommage.',
      correspondancePaire: 'Housse Mortuaire Sanitaire & Bracelet QR Code Scellé'
    },
    {
      id: 'SRV-015',
      categorie: 'FOURNITURES',
      nomCategorie: 'Fournitures, Cercueils & Équipements',
      nomService: 'Scellés Médico-Légaux & Sonde Thermique RFID',
      pole: 'MORGUE',
      perimetreMission: 'Scellés officiels numérotés pour conservation judiciaire, pastille RFID de contrôle thermique insérée pour traçabilité continue.',
      lieuOuRessource: 'Armoire Forte de Sécurité Morgue',
      prixUSD: 30,
      prixCDF: 84000,
      statut: 'ACTIF',
      responsableMetier: 'Chef de Poste Sécurité Morgue',
      differentiateurCle: 'Sécurisation médico-légale contre toute manipulation non autorisée.',
      correspondancePaire: 'Fleuristerie Prestige, Couronnes Naturelles & Livre d’Or'
    },
    {
      id: 'SRV-016',
      categorie: 'FOURNITURES',
      nomCategorie: 'Fournitures, Cercueils & Équipements',
      nomService: 'Fleuristerie Prestige, Couronnes Naturelles & Livre d’Or',
      pole: 'FUNERARIUM',
      perimetreMission: 'Compositions florales deuil fraîches, gerbe présidentielle ou familiale, ruban personnalisé doré, livre de condoléances en cuir avec chevalet d’accueil.',
      lieuOuRessource: 'Atelier Floral & Boutique du Recueillement',
      prixUSD: 190,
      prixCDF: 532000,
      statut: 'ACTIF',
      responsableMetier: 'Artiste Fleuriste Funéraire',
      differentiateurCle: 'Ornements floraux d’émotion et recueil des témoignages d’affection.',
      correspondancePaire: 'Scellés Médico-Légaux & Sonde Thermique RFID'
    },

    // --- 5. FORMALITÉS LÉGALES & ADMINISTRATIVES ---
    {
      id: 'SRV-017',
      categorie: 'FORMALITES',
      nomCategorie: 'Formalités Légales & Actes Administratifs',
      nomService: 'Constat Officiel de Décès & Visa Médico-Légal',
      pole: 'MORGUE',
      perimetreMission: 'Vérification légale du certificat médical de décès délivré par le médecin traitant ou légiste, enregistrement au registre hospitalier, vérification absence d’opposition judiciaire.',
      lieuOuRessource: 'Secrétariat Médico-Légal de la Morgue',
      prixUSD: 50,
      prixCDF: 140000,
      statut: 'ACTIF',
      responsableMetier: 'Secrétaire Médical & Médecin Inspecteur',
      differentiateurCle: 'Acte médical probant validant la mort biologique et la levée légale.',
      correspondancePaire: 'Permis d’Inhumer & Concession Cimetière'
    },
    {
      id: 'SRV-018',
      categorie: 'FORMALITES',
      nomCategorie: 'Formalités Légales & Actes Administratifs',
      nomService: 'Permis d’Inhumer & Concession Cimetière',
      pole: 'FUNERARIUM',
      perimetreMission: 'Instruction administrative auprès de l’Hôtel de Ville / Maison Communale pour obtention du permis d’inhumer légal, réservation de la concession au cimetière.',
      lieuOuRessource: 'Bureau des Formalités Administratives Funéraires',
      prixUSD: 110,
      prixCDF: 308000,
      statut: 'ACTIF',
      responsableMetier: 'Officier d’État-Civil Délégué & Juriste Funéraire',
      differentiateurCle: 'Actes civils municipaux autorisant l’enterrement dans le domaine public.',
      correspondancePaire: 'Constat Officiel de Décès & Visa Médico-Légal'
    },

    // --- 6. CAISSE & TARIFICATION ---
    {
      id: 'SRV-019',
      categorie: 'CAISSE_TARIFS',
      nomCategorie: 'Caisse, Tarifs & Règlements',
      nomService: 'Facturation Conservation & Droits Hospitaliers',
      pole: 'MORGUE',
      perimetreMission: 'Encaissement rigoureux en caisse centrale avec ségrégation stricte USD et CDF. Quittance 100% soldée obligatoire pour déverrouiller la levée de corps.',
      lieuOuRessource: 'Guichet Caisse Centrale (Morgue)',
      prixUSD: 350,
      prixCDF: 980000,
      statut: 'ACTIF',
      responsableMetier: 'Caissier Principal / Comptable',
      differentiateurCle: 'Verrou financier souverain : aucun corps ne sort tant que la quittance n’est pas soldée.',
      correspondancePaire: 'Facturation Packages Cérémonies, Salons & Acomptes'
    },
    {
      id: 'SRV-020',
      categorie: 'CAISSE_TARIFS',
      nomCategorie: 'Caisse, Tarifs & Règlements',
      nomService: 'Facturation Packages Cérémonies, Salons & Acomptes',
      pole: 'FUNERARIUM',
      perimetreMission: 'Émission des devis obsèques à la carte, encaissement des acomptes (min 60%), gestion des paiements échelonnés avant départ du cortège d’inhumation.',
      lieuOuRessource: 'Guichet Caisse Funéraire & Facturation',
      prixUSD: 1450,
      prixCDF: 4060000,
      statut: 'ACTIF',
      responsableMetier: 'Responsable Caisse & Facturation Obsèques',
      differentiateurCle: 'Facturation modulaire des prestations d’hommage avec échéancier d’acompte.',
      correspondancePaire: 'Facturation Conservation & Droits Hospitaliers'
    }
  ]);

  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('TOUTES');
  const [serviceViewMode, setServiceViewMode] = useState<'LISTE' | 'MATRICE_COMPAREE'>('LISTE');
  const [searchService, setSearchService] = useState('');
  const [editingService, setEditingService] = useState<ServicePrestationSimilaire | null>(null);

  // Filtrage du catalogue de services
  const filteredServices = catalogueServices.filter((s) => {
    const matchPole = poleFilter === 'TOUS' || s.pole === poleFilter;
    const matchCat = selectedServiceCategory === 'TOUTES' || s.categorie === selectedServiceCategory;
    const matchSearch =
      s.nomService.toLowerCase().includes(searchService.toLowerCase()) ||
      s.perimetreMission.toLowerCase().includes(searchService.toLowerCase()) ||
      s.lieuOuRessource.toLowerCase().includes(searchService.toLowerCase()) ||
      s.differentiateurCle.toLowerCase().includes(searchService.toLowerCase());
    return matchPole && matchCat && matchSearch;
  });

  // Sauvegarde des modifications tarifaires par le Super Admin
  const handleSaveServiceEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setCatalogueServices((prev) =>
      prev.map((s) => (s.id === editingService.id ? editingService : s))
    );
    setEditingService(null);
  };

  // =========================================================================
  // 2. GESTION DES ACCRÉDITATIONS & RBAC (Département & Niveau 1-5)
  // =========================================================================
  const [agents, setAgents] = useState<UserSession[]>(() => {
    return UTILISATEURS_MOCK.map((u, i) => ({
      ...u,
      actorId: `ACT-00${i + 1}`,
      directionRattachee:
        u.role === 'DIRECTION'
          ? 'DIRECTION_GENERALE'
          : u.role === 'COMPTABLE'
          ? 'CAISSE_CENTRALE'
          : u.role === 'AGENT_RECEPTION'
          ? 'DIRECTION_FUNERARIUM'
          : 'DIRECTION_MORGUE'
    }));
  });

  const [searchAgent, setSearchAgent] = useState('');
  const [filterDirection, setFilterDirection] = useState<string>('TOUTES');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Formulaire ajout agent
  const [newNom, setNewNom] = useState('');
  const [newPrenom, setNewPrenom] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDirection, setNewDirection] = useState<UserSession['directionRattachee']>('DIRECTION_MORGUE');
  const [newNiveau, setNewNiveau] = useState<NiveauAccreditation>(2);
  const [newRole, setNewRole] = useState<UserSession['role']>('AGENT_RECEPTION');
  const [newTelephone, setNewTelephone] = useState('+243 8');

  const handleUpdateDirection = (agentId: string, dir: UserSession['directionRattachee']) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, directionRattachee: dir } : a))
    );
  };

  const handleUpdateNiveau = (agentId: string, niveau: NiveauAccreditation) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, niveauAccreditation: niveau } : a))
    );
  };

  const handleToggleActif = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, estActif: !a.estActif } : a))
    );
  };

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const nouvelAgent: UserSession = {
      id: `usr-${Date.now()}`,
      nom: newNom.toUpperCase(),
      prenom: newPrenom,
      email: newEmail,
      role: newRole,
      niveauAccreditation: newNiveau,
      estActif: true,
      telephone: newTelephone,
      creeLe: new Date().toISOString(),
      actorId: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      directionRattachee: newDirection
    };
    setAgents([nouvelAgent, ...agents]);
    setIsAddModalOpen(false);
    setNewNom('');
    setNewPrenom('');
    setNewEmail('');
  };

  const filteredAgents = agents.filter((a) => {
    const matchDir = filterDirection === 'TOUTES' || a.directionRattachee === filterDirection;
    const matchSearch =
      a.nom.toLowerCase().includes(searchAgent.toLowerCase()) ||
      a.prenom.toLowerCase().includes(searchAgent.toLowerCase()) ||
      a.email.toLowerCase().includes(searchAgent.toLowerCase()) ||
      a.role.toLowerCase().includes(searchAgent.toLowerCase()) ||
      a.actorId.toLowerCase().includes(searchAgent.toLowerCase());
    return matchDir && matchSearch;
  });

  // =========================================================================
  // 3. FLUX & TRAÇABILITÉ DES DOSSIERS (ENTRÉES & SORTIES AVEC BADGES)
  // =========================================================================
  const [fluxDossiers, setFluxDossiers] = useState<FluxDossier[]>([
    {
      dossierId: 'NMG-2026-002581',
      defunt: 'KASANDA TSHIYOYO Jean-Luc',
      pole: 'MORGUE',
      dateEntree: '06/10/2026 - 08:30',
      statutSejour: 'En conservation (Casier #04 • +2.8°C)',
      dateSortiePrevue: '09/10/2026 - 10:00',
      finances: 'SOLDE',
      visaLegal: 'VALIDE'
    },
    {
      dossierId: 'NMG-2026-002580',
      defunt: 'MUTOMBO KABEYA Patient',
      pole: 'MORGUE',
      dateEntree: '01/10/2026 - 14:15',
      statutSejour: 'Levée autorisée (Sortie planifiée 16h)',
      dateSortiePrevue: '07/10/2026 - 16:00',
      sortieEffective: '07/10/2026 - 16:15',
      finances: 'SOLDE',
      visaLegal: 'VALIDE'
    },
    {
      dossierId: 'NMG-2026-002579',
      defunt: 'TSHILOMBA MBIYA Thérèse',
      pole: 'FUNERARIUM',
      dateEntree: '29/09/2026 - 19:40',
      statutSejour: 'Grand Salon Cérémonial B (Veillée en cours)',
      dateSortiePrevue: '08/10/2026 - 09:30',
      finances: 'ACOMPTE',
      resteAPayer: '$340 USD',
      visaLegal: 'EN_ATTENTE'
    },
    {
      dossierId: 'NMG-2026-002578',
      defunt: 'LUMUMBA DIUMI André',
      pole: 'MORGUE',
      dateEntree: '22/09/2026 - 11:00',
      statutSejour: 'En conservation (Casier #15 • Séjour 15j Alerte)',
      dateSortiePrevue: '10/10/2026 - 11:00',
      finances: 'SOLDE',
      visaLegal: 'VALIDE'
    },
    {
      dossierId: 'NMG-2026-002574',
      defunt: 'BOMPIMO Henriette',
      pole: 'FUNERARIUM',
      dateEntree: '20/09/2026 - 16:00',
      statutSejour: 'Sortie définitive effectuée vers Nécropole',
      dateSortiePrevue: '05/10/2026 - 11:00',
      sortieEffective: '05/10/2026 - 11:20',
      finances: 'SOLDE',
      visaLegal: 'VALIDE'
    }
  ]);

  const filteredFlux = fluxDossiers.filter((f) => {
    if (poleFilter === 'TOUS') return true;
    return f.pole === poleFilter;
  });

  // Action Super Admin : Valider dérogation ou visa exceptionnel
  const handleValiderDerogationDG = (dossierId: string) => {
    setFluxDossiers((prev) =>
      prev.map((f) =>
        f.dossierId === dossierId
          ? { ...f, visaLegal: 'VALIDE', finances: 'SOLDE', resteAPayer: undefined }
          : f
      )
    );
    alert(`Visa de dérogation Direction Générale accordé pour le dossier ${dossierId}. Statut régularisé.`);
  };

  // =========================================================================
  // 4. SUPERVISION OPÉRATIONS MULTI-PÔLES (JOURNAL D’AUDIT CENTRAL)
  // =========================================================================
  const operationsMultiPole: OperationMultiPole[] = [
    {
      id: 'OP-1049',
      pole: 'MORGUE',
      type: 'Admission & Bracelet QR Code',
      dossierId: 'NMG-2026-002581',
      defunt: 'KASANDA TSHIYOYO Jean-Luc',
      agent: 'Éric MUTOMBO',
      horodatage: '07/10/2026 - 14:30',
      statut: 'VALIDE'
    },
    {
      id: 'OP-1048',
      pole: 'FUNERARIUM',
      type: 'Réservation Grand Salon A',
      dossierId: 'NMG-2026-002581',
      defunt: 'KASANDA TSHIYOYO Jean-Luc',
      agent: 'Clarisse LUMUMBA',
      horodatage: '07/10/2026 - 13:50',
      statut: 'VALIDE',
      montant: '$1 450 USD'
    },
    {
      id: 'OP-1047',
      pole: 'MORGUE',
      type: 'Thanatopraxie Clinique & Soins',
      dossierId: 'NMG-2026-002580',
      defunt: 'MUTOMBO KABEYA Patient',
      agent: 'Dr Aimé KASANDA',
      horodatage: '07/10/2026 - 11:15',
      statut: 'VALIDE'
    },
    {
      id: 'OP-1046',
      pole: 'FUNERARIUM',
      type: 'Convoi Corbillard Limousine VIP',
      dossierId: 'NMG-2026-002580',
      defunt: 'MUTOMBO KABEYA Patient',
      agent: 'Clarisse LUMUMBA',
      horodatage: '07/10/2026 - 10:40',
      statut: 'VALIDE',
      montant: '$980 USD'
    },
    {
      id: 'OP-1045',
      pole: 'MORGUE',
      type: 'Alerte séjour prolongé (> 15 jours)',
      dossierId: 'NMG-2026-002578',
      defunt: 'LUMUMBA DIUMI André',
      agent: 'Sonde Automatique F2',
      horodatage: '07/10/2026 - 09:00',
      statut: 'ALERTE'
    },
    {
      id: 'OP-1044',
      pole: 'FUNERARIUM',
      type: 'Commande Fleuristerie & Gerbe Prestige',
      dossierId: 'NMG-2026-002579',
      defunt: 'TSHILOMBA MBIYA Thérèse',
      agent: 'Clarisse LUMUMBA',
      horodatage: '06/10/2026 - 16:20',
      statut: 'VALIDE',
      montant: '780 000 CDF'
    }
  ];

  const filteredOperations = operationsMultiPole.filter((op) => {
    if (poleFilter === 'TOUS') return true;
    return op.pole === poleFilter;
  });

  // Catégories uniques pour les onglets de services
  const categoriesList = [
    { id: 'TOUTES', label: 'Toutes les Prestations' },
    { id: 'SOINS_CORPS', label: '1. Soins & Thanatopraxie' },
    { id: 'HEBERGEMENT_ESPACE', label: '2. Hébergement & Salons' },
    { id: 'TRANSPORT_CONVOI', label: '3. Transports & Convois' },
    { id: 'FOURNITURES', label: '4. Fournitures & Cercueils' },
    { id: 'FORMALITES', label: '5. Formalités Légales' },
    { id: 'CAISSE_TARIFS', label: '6. Caisse & Tarification' }
  ];

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE SUPER ADMIN AVEC SÉLECTEUR DE FILTRE TRANSVERSE                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Super Admin • Direction Générale
            </span>
            <span className="text-[10px] text-slate-400">Supervision Stratégique & Contrôle Souverain</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Cockpit de Supervision Transverse & Gestion des Accès
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilotage unifié des Pôles Morgue & Funérarium, différenciation des services similaires, attribution RBAC et contrôle financier.
          </p>
        </div>

        {/* Filtres globaux de secteur avec badges très clairs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setPoleFilter('TOUS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              poleFilter === 'TOUS' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vue Consolidée
          </button>
          <button
            onClick={() => setPoleFilter('MORGUE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
              poleFilter === 'MORGUE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>Pôle Morgue</span>
          </button>
          <button
            onClick={() => setPoleFilter('FUNERARIUM')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
              poleFilter === 'FUNERARIUM' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Pôle Funérarium</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ONGLETS DE NAVIGATION DÉDIÉS AU SUPER ADMIN                             */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'DASHBOARD'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDark
              ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard & Graphiques</span>
        </button>

        {/* NOUVEL ONGLET CLÉ : SERVICES COMMUNS & SIMILAIRES */}
        <button
          onClick={() => setActiveTab('SERVICES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'SERVICES'
              ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-sm'
              : isDark
              ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-300" />
          <span className="flex items-center gap-1.5">
            <span>Services & Prestations Similaires</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/30 text-amber-200">
              {catalogueServices.length}
            </span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('RBAC')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'RBAC'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDark
              ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Accréditations & RBAC ({agents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('FLUX')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'FLUX'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDark
              ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>Entrées & Sorties Dossiers ({fluxDossiers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('OPERATIONS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'OPERATIONS'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDark
              ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Supervision Opérations ({operationsMultiPole.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('FINANCE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'FINANCE'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDark
              ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Finances & Trésorerie</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : DASHBOARD CONSOLIDÉ AVEC GRAPHIQUES ÉPURÉS ET BADGES               */}
      {/* ========================================================================= */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* 8 KPIS STRATÉGIQUES AVEC BADGES TRÈS VISIBLES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1 : MORGUE - Défunts Présents / Sortis */}
            {(poleFilter === 'TOUS' || poleFilter === 'MORGUE') && (
              <div
                className={`border rounded-xl p-5 space-y-1 relative overflow-hidden transition-colors ${
                  isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Défunts Présents
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    PÔLE MORGUE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">18 présents</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  42 défunts sortis ce mois-ci
                </div>
              </div>
            )}

            {/* KPI 2 : MORGUE - Casiers Frigorifiques */}
            {(poleFilter === 'TOUS' || poleFilter === 'MORGUE') && (
              <div
                className={`border rounded-xl p-5 space-y-1 relative overflow-hidden transition-colors ${
                  isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Casiers Frigorifiques
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    PÔLE MORGUE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">14 libres</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  56% d’occupation (18/32 casiers)
                </div>
              </div>
            )}

            {/* KPI 3 : FUNÉRARIUM - Salons de Veillée */}
            {(poleFilter === 'TOUS' || poleFilter === 'FUNERARIUM') && (
              <div
                className={`border rounded-xl p-5 space-y-1 relative overflow-hidden transition-colors ${
                  isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Salons de Veillée
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    PÔLE FUNÉRARIUM
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">6 réservés</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  75% d’occupation (sur 8 salons)
                </div>
              </div>
            )}

            {/* KPI 4 : FUNÉRARIUM - Cérémonies du Jour */}
            {(poleFilter === 'TOUS' || poleFilter === 'FUNERARIUM') && (
              <div
                className={`border rounded-xl p-5 space-y-1 relative overflow-hidden transition-colors ${
                  isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Cérémonies du Jour
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    PÔLE FUNÉRARIUM
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">2 cérémonies</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  4 convois corbillard planifiés
                </div>
              </div>
            )}

            {/* KPI 5 : MORGUE - Durée Moyenne Séjour */}
            {(poleFilter === 'TOUS' || poleFilter === 'MORGUE') && (
              <div
                className={`border rounded-xl p-5 space-y-1 relative overflow-hidden transition-colors ${
                  isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Durée Moyenne Séjour
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    PÔLE MORGUE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">6,4 jours</div>
                <div className="text-xs text-amber-400 pt-1 border-t border-slate-800 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>1 alerte séjour (&gt; 15 jours)</span>
                </div>
              </div>
            )}

            {/* KPI 6 : MORGUE - Sorties ce Jour */}
            {(poleFilter === 'TOUS' || poleFilter === 'MORGUE') && (
              <div
                className={`border rounded-xl p-5 space-y-1 relative overflow-hidden transition-colors ${
                  isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Sorties ce Jour
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    PÔLE MORGUE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">3 départs</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  Visas légaux & soldes vérifiés
                </div>
              </div>
            )}

            {/* KPI 7 : FUNÉRARIUM - Dossiers en Préparation */}
            {(poleFilter === 'TOUS' || poleFilter === 'FUNERARIUM') && (
              <div
                className={`border rounded-xl p-5 space-y-1 relative overflow-hidden transition-colors ${
                  isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">
                    Dossiers en Préparation
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    PÔLE FUNÉRARIUM
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">5 dossiers</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  Cercueils & cérémonies en cours
                </div>
              </div>
            )}

            {/* KPI 8 : REVENUS GLOBAUX SÉGRÉGÉS */}
            <div
              className={`border rounded-xl p-5 space-y-1 relative overflow-hidden transition-colors ${
                isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase text-slate-400">
                  Recettes Consolidées
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  TRÉSORERIE
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">$18 450 USD</div>
              <div className="text-xs text-sky-400 font-mono pt-1 border-t border-slate-800">
                & 51 660 000 CDF encaissés
              </div>
            </div>
          </div>

          {/* 4 GRAPHIQUES ÉPURÉS & MODERNES (ACTIVITÉ, JAUGE, REVENUS, DOSSIERS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Graphique 1 : Activité Hebdomadaire Transverse */}
            <div
              className={`lg:col-span-7 border rounded-2xl p-5 space-y-4 ${
                isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Activité Hebdomadaire Transverse
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    Entrées Morgue vs Cérémonies Funéraires
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                    <span className="text-slate-300 font-semibold">Pôle Morgue (24)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                    <span className="text-slate-300 font-semibold">Pôle Funérarium (16)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-800/60 pb-2">
                  {[
                    { jour: 'Lun', morgue: 4, funer: 2, hM: '60%', hF: '30%' },
                    { jour: 'Mar', morgue: 3, funer: 3, hM: '45%', hF: '45%' },
                    { jour: 'Mer', morgue: 5, funer: 2, hM: '75%', hF: '30%' },
                    { jour: 'Jeu', morgue: 2, funer: 4, hM: '30%', hF: '60%' },
                    { jour: 'Ven', morgue: 6, funer: 5, hM: '90%', hF: '75%' },
                    { jour: 'Sam', morgue: 3, funer: 4, hM: '45%', hF: '60%' },
                    { jour: 'Dim', morgue: 1, funer: 1, hM: '15%', hF: '15%' }
                  ].map((col) => (
                    <div key={col.jour} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        <div
                          style={{ height: col.hM }}
                          className="w-3.5 sm:w-5 rounded-t bg-blue-500 hover:bg-blue-400 transition-all cursor-pointer"
                          title={`Morgue : ${col.morgue} entrées`}
                        />
                        <div
                          style={{ height: col.hF }}
                          className="w-3.5 sm:w-5 rounded-t bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer"
                          title={`Funérarium : ${col.funer} cérémonies`}
                        />
                      </div>
                      <span className="text-[10px] font-mono mt-2 text-slate-400 block">{col.jour}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                  <span>Pic hebdomadaire constaté le vendredi (11 mouvements)</span>
                  <span className="font-mono text-emerald-400">Traçabilité centrale certifiée</span>
                </div>
              </div>
            </div>

            {/* Graphique 2 : Taux d'Occupation & Jauges en Temps Réel */}
            <div
              className={`lg:col-span-5 border rounded-2xl p-5 space-y-4 ${
                isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Capacités Opérationnelles
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  Taux d'Occupation en Temps Réel
                </h3>
              </div>

              <div className="space-y-4">
                {/* Jauge Morgue */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800">
                        MORGUE
                      </span>
                      Casiers Frigorifiques (32 places)
                    </span>
                    <span className="font-mono text-sky-400 font-bold">56% (18/32)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '56%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">14 casiers immédiatement disponibles pour admission</span>
                </div>

                {/* Jauge Funérarium */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        FUNÉRARIUM
                      </span>
                      Salons de Recueillement (8 salons)
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">75% (6/8)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '75%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">2 salons disponibles pour nouvelles veillées</span>
                </div>

                {/* Jauge Convois & Flotte Corbillards */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                        FLOTTE
                      </span>
                      Corbillards & Véhicules Déployés
                    </span>
                    <span className="font-mono text-purple-400 font-bold">50% (4/8 véhicules)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: '50%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">2 limousines Lincoln VIP et 2 fourgons en mission</span>
                </div>
              </div>
            </div>
          </div>

          {/* BANNIÈRE D’ACCÈS RAPIDE VERS LES SERVICES SIMILAIRES */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-emerald-950/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Différenciation Métier Souveraine
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  Morgue vs Funérarium : 6 Domaines de Prestations Similaires
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">
                La plateforme NomarGuerrie distingue nettement les soins cliniques médico-légaux (Morgue) des soins esthétiques et rituels d'adieu (Funérarium), tout en assurant une continuité sans faille du Dossier Unique.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('SERVICES')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-md"
            >
              <Scale className="w-4 h-4" />
              <span>Consulter la Matrice Comparative</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* REGISTRE UNIFIÉ DES DOSSIERS AVEC BADGES TRÈS EXPLICITES */}
          <div
            className={`border rounded-2xl overflow-hidden shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Registre Unifié des Dépouilles & Cérémonies
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Traçabilité continue de chaque défunt à travers les deux pôles avec contrôle des visas légaux et des soldes.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {filteredFlux.length} dossiers actifs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`font-semibold uppercase text-[10px] tracking-wider border-b ${
                    isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <tr>
                    <th className="py-3 px-4">Pôle Opérationnel</th>
                    <th className="py-3 px-4">N° Dossier Unique</th>
                    <th className="py-3 px-4">Défunt & Famille</th>
                    <th className="py-3 px-4">Localisation & Séjour</th>
                    <th className="py-3 px-4">Date Entrée</th>
                    <th className="py-3 px-4">Sortie Prévue</th>
                    <th className="py-3 px-4">Situation Caisse</th>
                    <th className="py-3 px-4 text-center">Visa Légal</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {filteredFlux.map((item) => (
                    <tr
                      key={item.dossierId}
                      className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1 ${
                            item.pole === 'MORGUE'
                              ? 'bg-blue-950 text-sky-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.pole === 'MORGUE' ? 'bg-sky-400' : 'bg-emerald-400'}`} />
                          {item.pole === 'MORGUE' ? 'PÔLE MORGUE' : 'PÔLE FUNÉRARIUM'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{item.dossierId}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{item.defunt}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{item.statutSejour}</td>
                      <td className="py-3.5 px-4 text-slate-400">{item.dateEntree}</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.sortieEffective ? (
                          <span className="text-purple-400 font-semibold">Effectuée : {item.sortieEffective}</span>
                        ) : (
                          <span>Prévue : {item.dateSortiePrevue}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            item.finances === 'SOLDE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {item.finances === 'SOLDE' ? 'SOLDÉ 100%' : `RESTE : ${item.resteAPayer}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.visaLegal === 'VALIDE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {item.visaLegal}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 2 : SERVICES & PRESTATIONS COMMUNS OU SIMILAIRES (AVEC BADGES)         */}
      {/* ========================================================================= */}
      {activeTab === 'SERVICES' && (
        <div className="space-y-5">
          {/* En-tête explicatif du catalogue comparatif */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Catalogue & Nomenclature Multi-Pôles
                  </span>
                  <span className="text-xs text-slate-400">
                    Clarification des missions complémentaires entre la Morgue et le Funérarium
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  Services Communs ou Similaires avec Badges de Différenciation
                </h2>
                <p className="text-xs text-slate-400">
                  Chaque prestation est clairement attribuée à son pôle de compétence avec sa finalité opérationnelle, son lieu, son responsable et ses tarifs officiels (USD & CDF).
                </p>
              </div>

              {/* Commutateur de mode d'affichage */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shrink-0">
                <button
                  onClick={() => setServiceViewMode('LISTE')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    serviceViewMode === 'LISTE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Vue Catalogue Détaillé
                </button>
                <button
                  onClick={() => setServiceViewMode('MATRICE_COMPAREE')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                    serviceViewMode === 'MATRICE_COMPAREE'
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Matrice Face-à-Face</span>
                </button>
              </div>
            </div>

            {/* Barre de filtres par catégorie et recherche */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedServiceCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                      selectedServiceCategory === cat.id
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : isDark
                        ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filtrer prestation, soin, lieu..."
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none ${
                    isDark
                      ? 'bg-[#0B132B] border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* MODE 1 : VUE CATALOGUE DÉTAILLÉ AVEC BADGES */}
          {serviceViewMode === 'LISTE' && (
            <div
              className={`border rounded-2xl overflow-hidden shadow-sm ${
                isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    className={`font-semibold uppercase text-[10px] tracking-wider border-b ${
                      isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <tr>
                      <th className="py-3 px-4">Pôle Responsable</th>
                      <th className="py-3 px-4">Prestation / Service</th>
                      <th className="py-3 px-4">Catégorie</th>
                      <th className="py-3 px-4">Périmètre & Différenciateur Clé</th>
                      <th className="py-3 px-4">Lieu / Équipement</th>
                      <th className="py-3 px-4 text-right">Tarif Officiel</th>
                      <th className="py-3 px-4 text-center">Statut</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                    {filteredServices.map((service) => (
                      <tr
                        key={service.id}
                        className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                      >
                        {/* BADGE DE DIFFÉRENCIATION TRÈS VISIBLE */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1.5 shadow-sm ${
                              service.pole === 'MORGUE'
                                ? 'bg-blue-950 text-sky-300 border border-blue-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                service.pole === 'MORGUE' ? 'bg-sky-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
                              }`}
                            />
                            {service.pole === 'MORGUE' ? 'PÔLE MORGUE' : 'PÔLE FUNÉRARIUM'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-white">
                          <div>{service.nomService}</div>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">
                            Réf: {service.id} • {service.responsableMetier}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-[11px] font-medium text-slate-300">
                            {service.nomCategorie}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                            {service.perimetreMission}
                          </p>
                          <span className="text-[10px] text-amber-300/90 italic block mt-0.5">
                            ★ Règle : {service.differentiateurCle}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {service.lieuOuRessource}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <span className="font-mono font-black text-white text-xs block">
                            ${service.prixUSD} USD
                          </span>
                          <span className="font-mono text-[10px] text-sky-400 block">
                            {service.prixCDF.toLocaleString('fr-FR')} CDF
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              service.statut === 'ACTIF'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {service.statut}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setEditingService(service)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Configurer le tarif ou les règles métiers"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODE 2 : MATRICE COMPARATIVE FACE-À-FACE (MORGUE VS FUNÉRARIUM) */}
          {serviceViewMode === 'MATRICE_COMPAREE' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* COLONNE GAUCHE : MORGUE */}
                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/60 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-blue-900/60">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">
                      PÔLE MORGUE — DOMAINE CLINIQUE & CONSERVATION
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Missions hospitalières impératives : conservation thermique ininterrompue, traçabilité médico-légale inviolable, thanatopraxie clinique et scellement d’identification par bracelet RFID.
                  </p>
                </div>

                {/* COLONNE DROITE : FUNÉRARIUM */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/60 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/60">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">
                      PÔLE FUNÉRARIUM — DOMAINE DU RECUEILLEMENT & DES CÉRÉMONIES
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Missions funéraires et d’hommage : accueil des familles, organisation des veillées et cérémonies d’adieu, toilette et habillage rituels, cercueils d’ébénisterie et convois d’honneur.
                  </p>
                </div>
              </div>

              {/* PAIRES COMPARATIVES PAR DOMAINE */}
              <div className="space-y-3">
                {[
                  {
                    domaine: '1. Soins du Corps & Préparation',
                    morgueService: 'Thanatopraxie Clinique & Soins de Conservation',
                    morguePrix: '$250 USD (700 000 CDF)',
                    morgueDetails: 'Conservation médico-technique, injection aseptique, maintien au grand froid.',
                    funerService: 'Toilette Rituelle, Habillage & Maquillage Cérémonial',
                    funerPrix: '$180 USD (504 000 CDF)',
                    funerDetails: 'Présentation esthétique du visage, habillage solennel selon directives familiales.'
                  },
                  {
                    domaine: '2. Hébergement & Espaces de Recueillement',
                    morgueService: 'Conservation en Casier Frigorifique (+2°C / +4°C)',
                    morguePrix: '$25 USD / jour',
                    morgueDetails: 'Sonde thermique continue 24h/24, alerte automatique si séjour > 15 jours.',
                    funerService: 'Location Salon Cérémonial Climatisé (Veillée)',
                    funerPrix: '$650 USD / créneau',
                    funerDetails: 'Espace 120 places pour recueillement, culte, sonorisation et loge privée famille.'
                  },
                  {
                    domaine: '3. Transports, Convois & Véhicules',
                    morgueService: 'Transfert Sanitaire & Admission Dépouille',
                    morguePrix: '$120 USD (336 000 CDF)',
                    morgueDetails: 'Prise en charge au centre hospitalier ou domicile vers le sas d’admission morgue.',
                    funerService: 'Convoi d’Honneur Corbillard Limousine VIP',
                    funerPrix: '$450 USD (1 260 000 CDF)',
                    funerDetails: 'Cortège solennel Lincoln avec chauffeur en livrée vers l’église et le cimetière.'
                  },
                  {
                    domaine: '4. Fournitures, Cercueils & Équipements',
                    morgueService: 'Housse Mortuaire Sanitaire & Bracelet QR Code Scellé',
                    morguePrix: '$45 USD (126 000 CDF)',
                    morgueDetails: 'Housse étanche conforme aux normes OMS et bracelet biométrique inviolable.',
                    funerService: 'Cercueil Bois Noble Verni (Chêne / Acajou)',
                    funerPrix: '$850 USD (2 380 000 CDF)',
                    funerDetails: 'Capitonnage satin blanc, poignées en laiton, croix gravée et plaque personnalisée.'
                  },
                  {
                    domaine: '5. Formalités Légales & Actes Administratifs',
                    morgueService: 'Constat Officiel de Décès & Visa Médico-Légal',
                    morguePrix: '$50 USD (140 000 CDF)',
                    morgueDetails: 'Examen légiste, vérification réquisition parquet et certificat de décès.',
                    funerService: 'Permis d’Inhumer & Concession Cimetière',
                    funerPrix: '$110 USD (308 000 CDF)',
                    funerDetails: 'Actes d’état-civil auprès de la Maison Communale et réservation de la sépulture.'
                  },
                  {
                    domaine: '6. Caisse, Tarification & Règlements',
                    morgueService: 'Facturation Conservation & Droits Hospitaliers',
                    morguePrix: 'Quittance 100% Soldée obligatoire',
                    morgueDetails: 'Verrou strict : aucun corps ne peut sortir sans apurement total en caisse centrale.',
                    funerService: 'Facturation Packages Obsèques & Acomptes',
                    funerPrix: 'Acompte min 60% à la réservation',
                    funerDetails: 'Échéancier modulaire des prestations d’hommage avec solde avant le cortège.'
                  }
                ].map((paire, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-2xl p-4 space-y-3 ${
                      isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="font-bold text-amber-300 text-xs uppercase tracking-wide">
                        {paire.domaine}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Comparatif Souverain NomarGuerrie
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Côté Morgue */}
                      <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800">
                            PÔLE MORGUE
                          </span>
                          <strong className="text-white font-mono">{paire.morguePrix}</strong>
                        </div>
                        <h4 className="font-bold text-white text-xs">{paire.morgueService}</h4>
                        <p className="text-[11px] text-slate-300">{paire.morgueDetails}</p>
                      </div>

                      {/* Côté Funérarium */}
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            PÔLE FUNÉRARIUM
                          </span>
                          <strong className="text-white font-mono">{paire.funerPrix}</strong>
                        </div>
                        <h4 className="font-bold text-white text-xs">{paire.funerService}</h4>
                        <p className="text-[11px] text-slate-300">{paire.funerDetails}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 3 : ACCRÉDITATIONS & ATTRIBUTION DES ACCÈS PAR AGENT (RBAC)            */}
      {/* ========================================================================= */}
      {activeTab === 'RBAC' && (
        <div className="space-y-4">
          <div
            className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher agent, matricule, email..."
                value={searchAgent}
                onChange={(e) => setSearchAgent(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isDark
                    ? 'bg-[#0B132B] border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 text-[11px]">Département :</span>
              {['TOUTES', 'DIRECTION_MORGUE', 'DIRECTION_FUNERARIUM', 'CAISSE_CENTRALE', 'DIRECTION_GENERALE'].map((dir) => (
                <button
                  key={dir}
                  onClick={() => setFilterDirection(dir)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                    filterDirection === dir
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'bg-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dir === 'TOUTES' ? 'Tous' : dir.replace('DIRECTION_', '').replace('_', ' ')}
                </button>
              ))}

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 ml-2 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Nouvel Agent</span>
              </button>
            </div>
          </div>

          <div
            className={`border rounded-2xl overflow-hidden shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`font-semibold uppercase text-[10px] tracking-wider border-b ${
                    isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <tr>
                    <th className="py-3 px-4">Agent (Matricule)</th>
                    <th className="py-3 px-4">Email Professionnel</th>
                    <th className="py-3 px-4">Département Assigné</th>
                    <th className="py-3 px-4">Niveau d'Accréditation</th>
                    <th className="py-3 px-4 text-center">Statut Accès</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {filteredAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-bold block text-white">
                          {agent.prenom} {agent.nom}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{agent.actorId}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">{agent.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={agent.directionRattachee}
                          onChange={(e) => handleUpdateDirection(agent.id, e.target.value as any)}
                          className={`text-xs p-1.5 rounded-lg border font-medium ${
                            isDark
                              ? 'bg-[#0B132B] border-slate-700 text-slate-200'
                              : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        >
                          <option value="DIRECTION_MORGUE">🟦 Direction Morgue</option>
                          <option value="DIRECTION_FUNERARIUM">🟩 Direction Funérarium</option>
                          <option value="CAISSE_CENTRALE">🟨 Caisse Centrale</option>
                          <option value="DIRECTION_GENERALE">👑 Direction Générale (Super Admin)</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={agent.niveauAccreditation}
                          onChange={(e) => handleUpdateNiveau(agent.id, parseInt(e.target.value, 10) as NiveauAccreditation)}
                          className={`text-xs p-1.5 rounded-lg border font-semibold ${
                            isDark
                              ? 'bg-[#0B132B] border-slate-700 text-sky-400'
                              : 'bg-white border-slate-300 text-blue-700'
                          }`}
                        >
                          <option value={1}>Niveau 1 — Consultation</option>
                          <option value={2}>Niveau 2 — Agent Saisie & Accueil</option>
                          <option value={3}>Niveau 3 — Régulateur & Soins</option>
                          <option value={4}>Niveau 4 — Responsable Exploitation</option>
                          <option value={5}>Niveau 5 — Super Admin / Direction</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleActif(agent.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                            agent.estActif
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                              : 'bg-red-950 text-red-400 border-red-800 hover:bg-red-900'
                          }`}
                        >
                          {agent.estActif ? 'ACTIF' : 'SUSPENDU'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 4 : ENTRÉES & SORTIES DES DOSSIERS (AVEC ACTION DÉROGATION DG)          */}
      {/* ========================================================================= */}
      {activeTab === 'FLUX' && (
        <div className="space-y-4">
          <div
            className={`border rounded-2xl overflow-hidden shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Traçabilité Inviolable des Admissions & Sorties de Corps
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Vérification médico-légale obligatoire, libération automatique du casier et contrôle des quittances financières.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {filteredFlux.length} flux surveillés
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`font-semibold uppercase text-[10px] tracking-wider border-b ${
                    isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <tr>
                    <th className="py-3 px-4">Pôle</th>
                    <th className="py-3 px-4">N° Dossier & Défunt</th>
                    <th className="py-3 px-4">Date Entrée (Admission)</th>
                    <th className="py-3 px-4">Localisation & Séjour</th>
                    <th className="py-3 px-4">Sortie Prévue / Effectuée</th>
                    <th className="py-3 px-4">Contrôle Financier</th>
                    <th className="py-3 px-4 text-center">Visa Légal</th>
                    <th className="py-3 px-4 text-center">Dérogation DG</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {filteredFlux.map((flux) => (
                    <tr
                      key={flux.dossierId}
                      className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1 ${
                            flux.pole === 'MORGUE'
                              ? 'bg-blue-950 text-sky-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${flux.pole === 'MORGUE' ? 'bg-sky-400' : 'bg-emerald-400'}`} />
                          {flux.pole}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{flux.defunt}</span>
                        <span className="text-[10px] font-mono text-slate-400">{flux.dossierId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{flux.dateEntree}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">{flux.statutSejour}</td>
                      <td className="py-3.5 px-4">
                        <span className="block text-slate-300">Prévue : {flux.dateSortiePrevue}</span>
                        {flux.sortieEffective && (
                          <span className="text-[10px] font-semibold text-purple-400 block">
                            Effectuée : {flux.sortieEffective}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            flux.finances === 'SOLDE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {flux.finances === 'SOLDE' ? 'SOLDÉ 100%' : `RESTE : ${flux.resteAPayer}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            flux.visaLegal === 'VALIDE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {flux.visaLegal}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {flux.visaLegal !== 'VALIDE' || flux.finances !== 'SOLDE' ? (
                          <button
                            onClick={() => handleValiderDerogationDG(flux.dossierId)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition-colors shadow-sm"
                            title="Accorder un visa de dérogation exceptionnelle au nom de la Direction Générale"
                          >
                            Dérogation DG
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-semibold">Conforme</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 5 : SUPERVISION DES OPÉRATIONS MULTI-PÔLES                             */}
      {/* ========================================================================= */}
      {activeTab === 'OPERATIONS' && (
        <div className="space-y-4">
          <div
            className={`border rounded-2xl overflow-hidden shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Journal des Opérations Hospitalières & Funéraires
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Chaque mouvement physique ou réservation est historisé et horodaté pour audit inaltérable.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {filteredOperations.length} opérations enregistrées
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`font-semibold uppercase text-[10px] tracking-wider border-b ${
                    isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <tr>
                    <th className="py-3 px-4">Pôle</th>
                    <th className="py-3 px-4">Réf Opération</th>
                    <th className="py-3 px-4">Type d'Opération</th>
                    <th className="py-3 px-4">Dossier / Défunt</th>
                    <th className="py-3 px-4">Agent Responsable</th>
                    <th className="py-3 px-4">Date & Heure</th>
                    <th className="py-3 px-4 text-right">Montant</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {filteredOperations.map((op) => (
                    <tr
                      key={op.id}
                      className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1 ${
                            op.pole === 'MORGUE'
                              ? 'bg-blue-950 text-sky-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${op.pole === 'MORGUE' ? 'bg-sky-400' : 'bg-emerald-400'}`} />
                          {op.pole}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-white">{op.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{op.type}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{op.defunt}</span>
                        <span className="text-[10px] font-mono text-slate-400">{op.dossierId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{op.agent}</td>
                      <td className="py-3.5 px-4 text-slate-400">{op.horodatage}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                        {op.montant || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            op.statut === 'VALIDE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {op.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 6 : FINANCES CONSOLIDÉES & TRÉSORERIE SÉGRÉGÉE                          */}
      {/* ========================================================================= */}
      {activeTab === 'FINANCE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">
                Chiffre d'Affaires Global Consolidé
              </span>
              <div className="mt-2 space-y-1">
                <div className="text-2xl font-black text-white font-mono">$18 450 USD</div>
                <div className="text-sm font-semibold text-sky-400 font-mono">51 660 000 CDF</div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-sky-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Pôle Morgue (62%) :
                  </span>
                  <strong className="text-white font-mono">$11 440 USD</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Pôle Funérarium (38%) :
                  </span>
                  <strong className="text-white font-mono">$7 010 USD</strong>
                </div>
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">
                Encaissements Guichet (Caisse Centrale)
              </span>
              <div className="mt-2 space-y-1">
                <div className="text-2xl font-black text-emerald-400 font-mono">$1 450 USD</div>
                <div className="text-sm font-semibold text-emerald-300 font-mono">3 850 000 CDF</div>
              </div>
              <span className="text-[10px] text-slate-500 block mt-2 pt-2 border-t border-slate-800">
                Session active ouverte par Nathalie TSHILOMBA
              </span>
            </div>

            <div
              className={`p-5 rounded-2xl border ${
                isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">
                Créances & Factures en Attente
              </span>
              <div className="mt-2 space-y-1">
                <div className="text-2xl font-black text-amber-400 font-mono">$340 USD</div>
                <div className="text-sm font-semibold text-amber-300 font-mono">952 000 CDF</div>
              </div>
              <span className="text-[10px] text-slate-500 block mt-2 pt-2 border-t border-slate-800">
                4 dossiers avec solde restant (levée bloquée)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CONFIGURATION TARIF PRESTATION (PAR LE SUPER ADMIN)                  */}
      {/* ========================================================================= */}
      {editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071329] border border-blue-900 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  editingService.pole === 'MORGUE'
                    ? 'bg-blue-950 text-sky-300 border border-blue-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {editingService.pole === 'MORGUE' ? 'PÔLE MORGUE' : 'PÔLE FUNÉRARIUM'}
                </span>
                <h3 className="font-bold text-base mt-1">Configurer la Prestation</h3>
              </div>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleSaveServiceEdit} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Libellé du service</label>
                <input
                  type="text"
                  value={editingService.nomService}
                  onChange={(e) => setEditingService({ ...editingService, nomService: e.target.value })}
                  required
                  className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Tarif en USD ($)</label>
                  <input
                    type="number"
                    value={editingService.prixUSD}
                    onChange={(e) => setEditingService({ ...editingService, prixUSD: Number(e.target.value) })}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Tarif en CDF (Francs)</label>
                  <input
                    type="number"
                    value={editingService.prixCDF}
                    onChange={(e) => setEditingService({ ...editingService, prixCDF: Number(e.target.value) })}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Lieu / Équipement mobilisé</label>
                <input
                  type="text"
                  value={editingService.lieuOuRessource}
                  onChange={(e) => setEditingService({ ...editingService, lieuOuRessource: e.target.value })}
                  required
                  className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Périmètre opérationnel & Définition</label>
                <textarea
                  value={editingService.perimetreMission}
                  onChange={(e) => setEditingService({ ...editingService, perimetreMission: e.target.value })}
                  rows={3}
                  className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Pôle de compétence</label>
                  <select
                    value={editingService.pole}
                    onChange={(e) => setEditingService({ ...editingService, pole: e.target.value as any })}
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-bold"
                  >
                    <option value="MORGUE">🟦 Pôle Morgue</option>
                    <option value="FUNERARIUM">🟩 Pôle Funérarium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Statut</label>
                  <select
                    value={editingService.statut}
                    onChange={(e) => setEditingService({ ...editingService, statut: e.target.value as any })}
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-bold"
                  >
                    <option value="ACTIF">ACTIF</option>
                    <option value="EN_REVISION">EN RÉVISION</option>
                    <option value="SUR_DEVIS">SUR DEVIS</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md"
                >
                  Sauvegarder les Tarifs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CRÉATION NOUVEL AGENT (PAR LE SUPER ADMIN)                          */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071329] border border-blue-900 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <h3 className="font-bold text-base">Attribuer un Accès Agent (RBAC)</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleAddAgent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Nom de famille</label>
                  <input
                    type="text"
                    value={newNom}
                    onChange={(e) => setNewNom(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={newPrenom}
                    onChange={(e) => setNewPrenom(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">E-mail professionnel</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  placeholder="agent@nomargueri.cd"
                  className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Département d&apos;Affectation</label>
                  <select
                    value={newDirection}
                    onChange={(e) => setNewDirection(e.target.value as any)}
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  >
                    <option value="DIRECTION_MORGUE">Direction Morgue</option>
                    <option value="DIRECTION_FUNERARIUM">Direction Funérarium</option>
                    <option value="CAISSE_CENTRALE">Caisse Centrale</option>
                    <option value="DIRECTION_GENERALE">Direction Générale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Niveau d&apos;Accréditation</label>
                  <select
                    value={newNiveau}
                    onChange={(e) => setNewNiveau(Number(e.target.value) as NiveauAccreditation)}
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  >
                    <option value={1}>Niveau 1 — Consultation</option>
                    <option value={2}>Niveau 2 — Agent Saisie</option>
                    <option value={3}>Niveau 3 — Régulateur</option>
                    <option value={4}>Niveau 4 — Responsable</option>
                    <option value={5}>Niveau 5 — Super Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={newTelephone}
                  onChange={(e) => setNewTelephone(e.target.value)}
                  required
                  className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md"
                >
                  Enregistrer l&apos;agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
