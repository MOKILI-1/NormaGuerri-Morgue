import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  FileText,
  CreditCard,
  Layers,
  BarChart3,
  Users,
  Building,
  Truck,
  Calendar,
  DollarSign,
  X,
  Printer,
  HeartHandshake,
  ArrowRight,
  Eye,
  RefreshCw,
  Lock,
  Unlock,
  Thermometer,
  Check,
  Box,
  MapPin,
  Sparkles,
  ArrowLeftRight,
  Activity,
  Stethoscope,
  Bed,
  HeartPulse,
  Pill,
  Microscope,
  UserCheck,
  UserX,
  Send,
  HeartCrack
} from 'lucide-react';
import { useBackoffice } from '../../context/BackofficeContext';
import { ApiClient } from '../../services/api';
import { DossierVivant, Sexe, TypeDemandeur } from '@nomarguerrie/shared-types';
import { DOSSIERS_MOCK, CATALOGUE_SERVICES_MOCK } from '../../data/mock-db';

interface DefuntMorgue {
  id: string;
  numeroDossier: string;
  defuntNom: string;
  defuntPrenom: string;
  statutIdentification: 'IDENTIFIE_OFFICIEL' | 'PROVISOIRE' | 'NON_IDENTIFIE_X';
  provenance: string;
  dateAdmission: string;
  dureeSejourJours: number;
  chambre: string;
  casier: string;
  temperature: string;
  soinsAppliques: string;
  totalUSD: number;
  payeUSD: number;
  situationFinanciere: 'SOLDE' | 'ACOMPTE' | 'NON_PAYE';
  verrouDocuments: boolean;
  verrouAyantDroit: boolean;
  verrouMedicoLegal: boolean;
  verrouFinance: boolean;
  statutSortie: 'EN_CONSERVATION' | 'SORTIE_AUTORISEE' | 'SORTI';
  sortieEffective?: {
    dateHeure: string;
    recepteur: string;
    destinationCimetiere: string;
  };
}

interface ReservationFuneraire {
  id: string;
  numeroDossier: string;
  familleNom: string;
  familleTel: string;
  defuntNom: string;
  salon: string;
  creneau: string;
  prestations: string[];
  devisUSD: number;
  devisCDF: number;
  statutPaiement: 'SOLDE' | 'ACOMPTE' | 'EN_ATTENTE';
  statutCeremonie: 'CONFIRME' | 'EN_COURS' | 'CLOTURE';
  corbillardAssigné?: string;
  avancementPreparation: number; // 0 - 100%
}

export interface PatientHopital {
  id: string;
  numeroDossier: string;
  patientNom: string;
  patientPrenom: string;
  sexe: 'MASCULIN' | 'FEMININ';
  age: number;
  telephone: string;
  dateAdmission: string;
  typeAdmission: 'NOUVEAU_CAS' | 'ANCIEN_PATIENT';
  statutClinique: 'ADMIS_URGENCES' | 'HOSPITALISE' | 'SORTIE_GUERI' | 'TRANSFERE' | 'DECEDE';
  service: 'URGENCES' | 'MEDECINE_INTERNE' | 'CHIRURGIE' | 'MATERNITE' | 'PEDIATRIE' | 'SOINS_INTENSIFS';
  chambreLit: string;
  medecinTraitant: string;
  diagnosticPrincipal: string;
  totalUSD: number;
  totalCDF: number;
  payeUSD: number;
  statutPaiement: 'SOLDE' | 'ACOMPTE' | 'EN_ATTENTE';
  transfertDetails?: {
    etablissementCible: string;
    motifTransfert: string;
    dateHeure: string;
    ambulanceAssignee: string;
  };
  decesDetails?: {
    dateHeureConstat: string;
    medecinDeclarant: string;
    boxMorgueAssignee: string;
    transfereMorgue: boolean;
  };
  actesLivres: string[];
}

export interface ServiceHospitalierLivraison {
  id: string;
  dateHeure: string;
  numeroDossier: string;
  patientNom: string;
  departement: 'PHARMACIE' | 'LABORATOIRE' | 'IMAGERIE' | 'BLOC' | 'SOINS_INFIRMIERS';
  designationActeOuProduit: string;
  quantite: number;
  montantUSD: number;
  montantCDF: number;
  praticienResponsable: string;
  statutLivraison: 'LIVRE' | 'EN_COURS' | 'VALIDE';
}

export const DashboardPage: React.FC = () => {
  const { currentPole, currentUser, caisseSession, theme } = useBackoffice();
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  // =========================================================================
  // 1. ÉTAT DES DONNÉES DU REGISTRE MORGUE & FUNÉRARIUM
  // =========================================================================
  const [registreMorgue, setRegistreMorgue] = useState<DefuntMorgue[]>([
    {
      id: 'mrg-1',
      numeroDossier: '#NG-2026-002581',
      defuntNom: 'KASANDA TSHIYOYO',
      defuntPrenom: 'Jean-Luc',
      statutIdentification: 'IDENTIFIE_OFFICIEL',
      provenance: 'Clinique Ngaliema',
      dateAdmission: '06/10/2026 - 08:30',
      dureeSejourJours: 2,
      chambre: 'Chambre F1 (Standard)',
      casier: 'Casier #04',
      temperature: '+2.8°C',
      soinsAppliques: 'Thanatopraxie & Habillage complet',
      totalUSD: 850,
      payeUSD: 850,
      situationFinanciere: 'SOLDE',
      verrouDocuments: true,
      verrouAyantDroit: true,
      verrouMedicoLegal: true,
      verrouFinance: true,
      statutSortie: 'SORTIE_AUTORISEE'
    },
    {
      id: 'mrg-2',
      numeroDossier: '#NG-2026-002580',
      defuntNom: 'MUTOMBO KABEYA',
      defuntPrenom: 'Patient',
      statutIdentification: 'IDENTIFIE_OFFICIEL',
      provenance: 'Hôpital Général de Référence',
      dateAdmission: '01/10/2026 - 14:15',
      dureeSejourJours: 7,
      chambre: 'Chambre F1 (Standard)',
      casier: 'Casier #12',
      temperature: '+3.1°C',
      soinsAppliques: 'Toilette rituelle effectuée',
      totalUSD: 620,
      payeUSD: 620,
      situationFinanciere: 'SOLDE',
      verrouDocuments: true,
      verrouAyantDroit: true,
      verrouMedicoLegal: true,
      verrouFinance: true,
      statutSortie: 'SORTIE_AUTORISEE'
    },
    {
      id: 'mrg-3',
      numeroDossier: '#NG-2026-002579',
      defuntNom: 'TSHILOMBA MBIYA',
      defuntPrenom: 'Thérèse',
      statutIdentification: 'IDENTIFIE_OFFICIEL',
      provenance: 'Domicile familial (Gombe)',
      dateAdmission: '29/09/2026 - 19:40',
      dureeSejourJours: 9,
      chambre: 'Chambre F2 (Soins & Thanato)',
      casier: 'Casier #08',
      temperature: '+2.9°C',
      soinsAppliques: 'Soins thanatopraxie & Maquillage',
      totalUSD: 740,
      payeUSD: 440,
      situationFinanciere: 'ACOMPTE',
      verrouDocuments: true,
      verrouAyantDroit: true,
      verrouMedicoLegal: true,
      verrouFinance: false, // Bloqué : 300 USD restant
      statutSortie: 'EN_CONSERVATION'
    },
    {
      id: 'mrg-4',
      numeroDossier: '#NG-2026-002578',
      defuntNom: 'LUMUMBA DIUMI',
      defuntPrenom: 'André',
      statutIdentification: 'IDENTIFIE_OFFICIEL',
      provenance: 'Centre Médical Monkole',
      dateAdmission: '22/09/2026 - 11:00',
      dureeSejourJours: 16, // Alerte séjour > 15j
      chambre: 'Chambre F2 (Soins & Thanato)',
      casier: 'Casier #15',
      temperature: '+3.0°C',
      soinsAppliques: 'Thanatopraxie & Embaumement longue durée',
      totalUSD: 1100,
      payeUSD: 1100,
      situationFinanciere: 'SOLDE',
      verrouDocuments: true,
      verrouAyantDroit: true,
      verrouMedicoLegal: true,
      verrouFinance: true,
      statutSortie: 'EN_CONSERVATION'
    }
  ]);

  const [registreFunerarium, setRegistreFunerarium] = useState<ReservationFuneraire[]>([
    {
      id: 'fun-1',
      numeroDossier: '#NG-2026-002581',
      familleNom: 'Famille KASANDA (Grâce)',
      familleTel: '+243 82 555 1234',
      defuntNom: 'KASANDA TSHIYOYO Jean-Luc',
      salon: 'Grand Chapiteau Climatisé (250 places)',
      creneau: '08/10/2026 • 18h00 - 23h00',
      prestations: [
        'Location Chapiteau étanche climatisé (250p)',
        'Gradins modulaires d’honneur (120 places)',
        'Privatisation Espaces Verts paysagers',
        'Corbillard Limousine Mercedes VIP #01',
        'Pompes Funèbres : Cercueil Chêne Massif & Fleuristerie'
      ],
      devisUSD: 1850,
      devisCDF: 5180000,
      statutPaiement: 'SOLDE',
      statutCeremonie: 'CONFIRME',
      corbillardAssigné: 'Corbillard Limousine Mercedes VIP #01',
      avancementPreparation: 90
    },
    {
      id: 'fun-2',
      numeroDossier: '#NG-2026-002580',
      familleNom: 'Famille MUTOMBO (Patrick)',
      familleTel: '+243 99 722 2228',
      defuntNom: 'MUTOMBO KABEYA Patient',
      salon: 'Espaces Verts & Tente de Recueillement',
      creneau: '07/10/2026 • 14h00 - 18h00',
      prestations: [
        'Privatisation Espaces Verts paysagers',
        'Gradins modulaires d’honneur',
        'Corbillard Limousine Lincoln #02',
        'Pompes Funèbres : Livre d’Or cuir & Couronnes'
      ],
      devisUSD: 1200,
      devisCDF: 3360000,
      statutPaiement: 'SOLDE',
      statutCeremonie: 'EN_COURS',
      corbillardAssigné: 'Corbillard Limousine Lincoln #02',
      avancementPreparation: 100
    },
    {
      id: 'fun-3',
      numeroDossier: '#NG-2026-002579',
      familleNom: 'Famille TSHILOMBA (Alain)',
      familleTel: '+243 81 234 5678',
      defuntNom: 'TSHILOMBA MBIYA Thérèse',
      salon: 'Grand Chapiteau Cérémonial B',
      creneau: '09/10/2026 • 19h00 - 06h00',
      prestations: [
        'Location Chapiteau climatisé 150p',
        'Gradins modulaires d’honneur',
        'Corbillard Fourgon Deluxe #03',
        'Pompes Funèbres : Cercueil Tradition Acajou'
      ],
      devisUSD: 1420,
      devisCDF: 3976000,
      statutPaiement: 'ACOMPTE',
      statutCeremonie: 'CONFIRME',
      corbillardAssigné: 'Corbillard Fourgon Deluxe #03',
      avancementPreparation: 65
    },
    {
      id: 'fun-4',
      numeroDossier: '#NG-2026-002578',
      familleNom: 'Famille LUMUMBA (Marc)',
      familleTel: '+243 83 330 0400',
      defuntNom: 'LUMUMBA DIUMI André',
      salon: 'Espaces Verts & Jardins Paysagers A',
      creneau: '10/10/2026 • 10h00 - 14h00',
      prestations: [
        'Espaces Verts de recueillement & Chaises d’honneur',
        'Transport Corbillard Fourgon d’escorte',
        'Pompes Funèbres : Registre commémoratif'
      ],
      devisUSD: 850,
      devisCDF: 2380000,
      statutPaiement: 'SOLDE',
      statutCeremonie: 'CONFIRME',
      corbillardAssigné: 'Corbillard Mercedes Deluxe #04',
      avancementPreparation: 40
    }
  ]);

  // =========================================================================
  // 1.B ÉTAT DES DONNÉES DU REGISTRE HÔPITAL (SOINS, ADMISSIONS, TRANSFERTS, DÉCÈS)
  // =========================================================================
  const [registreHopital, setRegistreHopital] = useState<PatientHopital[]>([
    {
      id: 'hop-1',
      numeroDossier: '#HOP-2026-00412',
      patientNom: 'BOKETSHU',
      patientPrenom: 'Jean-Marc',
      sexe: 'MASCULIN',
      age: 34,
      telephone: '+243 81 999 1122',
      dateAdmission: '28/10/2026 - 08:30',
      typeAdmission: 'NOUVEAU_CAS',
      statutClinique: 'ADMIS_URGENCES',
      service: 'URGENCES',
      chambreLit: 'Lit U-03 (Triage)',
      medecinTraitant: 'Dr. Jeanne KASONGO',
      diagnosticPrincipal: 'Paludisme grave avec syndrome fébrile aigu et déshydratation',
      totalUSD: 180,
      totalCDF: 504000,
      payeUSD: 180,
      statutPaiement: 'SOLDE',
      actesLivres: ['Consultation Urgences', 'Bilan Goutte Épaisse & NFS', 'Perfusion Artésunate IV 24h']
    },
    {
      id: 'hop-2',
      numeroDossier: '#HOP-2026-00398',
      patientNom: 'MUKUNA',
      patientPrenom: 'Antoinette',
      sexe: 'FEMININ',
      age: 58,
      telephone: '+243 99 444 8877',
      dateAdmission: '24/10/2026 - 14:15',
      typeAdmission: 'ANCIEN_PATIENT',
      statutClinique: 'HOSPITALISE',
      service: 'MEDECINE_INTERNE',
      chambreLit: 'Pavillon A — Lit #12 (Séjour 4j)',
      medecinTraitant: 'Dr. Christian ILUNGA',
      diagnosticPrincipal: 'Décompensation cardio-vasculaire & HTA stade 3 sous surveillance',
      totalUSD: 480,
      totalCDF: 1344000,
      payeUSD: 300,
      statutPaiement: 'ACOMPTE',
      actesLivres: ['Hospitalisation 4j', 'Échocardiographie doppler', 'Surveillance monitorée']
    },
    {
      id: 'hop-3',
      numeroDossier: '#HOP-2026-00405',
      patientNom: 'TSHIELA',
      patientPrenom: 'Clarisse',
      sexe: 'FEMININ',
      age: 28,
      telephone: '+243 82 333 5544',
      dateAdmission: '26/10/2026 - 10:00',
      typeAdmission: 'ANCIEN_PATIENT',
      statutClinique: 'SORTIE_GUERI',
      service: 'MATERNITE',
      chambreLit: 'Pavillon B — Lit #05 (Libéré)',
      medecinTraitant: 'Dr. MBALU Roger',
      diagnosticPrincipal: 'Accouchement eutocique sans complication, nouveau-né à terme en bonne santé',
      totalUSD: 350,
      totalCDF: 980000,
      payeUSD: 350,
      statutPaiement: 'SOLDE',
      actesLivres: ['Accouchement assisté', 'Soins du nouveau-né & carnet', 'Ordonnance de sortie délivrée']
    },
    {
      id: 'hop-4',
      numeroDossier: '#HOP-2026-00410',
      patientNom: 'KALOMBO',
      patientPrenom: 'David',
      sexe: 'MASCULIN',
      age: 46,
      telephone: '+243 85 777 2211',
      dateAdmission: '28/10/2026 - 06:15',
      typeAdmission: 'NOUVEAU_CAS',
      statutClinique: 'TRANSFERE',
      service: 'SOINS_INTENSIFS',
      chambreLit: 'Lit SI-02 (Transféré)',
      medecinTraitant: 'Dr. Jeanne KASONGO',
      diagnosticPrincipal: 'Syndrome coronarien aigu (Infarctus) — Évacuation vers plateau de coronarographie',
      totalUSD: 290,
      totalCDF: 812000,
      payeUSD: 290,
      statutPaiement: 'SOLDE',
      transfertDetails: {
        etablissementCible: 'Centre Médical Diamant / HJ Hospital',
        motifTransfert: 'Plateau technique d’angioplastie & coronarographie d’urgence',
        dateHeure: '28/10/2026 - 11:30',
        ambulanceAssignee: 'Ambulance Médicalisée SAMU #02'
      },
      actesLivres: ['Électrocardiogramme 12 dérivations', 'Stabilisation hémodynamique', 'Fiche d’évacuation médicale']
    },
    {
      id: 'hop-5',
      numeroDossier: '#HOP-2026-00408',
      patientNom: 'KABAMBA',
      patientPrenom: 'Léonard',
      sexe: 'MASCULIN',
      age: 72,
      telephone: '+243 81 888 9900',
      dateAdmission: '27/10/2026 - 22:45',
      typeAdmission: 'ANCIEN_PATIENT',
      statutClinique: 'DECEDE',
      service: 'SOINS_INTENSIFS',
      chambreLit: 'Lit SI-04 (Transféré Morgue)',
      medecinTraitant: 'Dr. Christian ILUNGA',
      diagnosticPrincipal: 'Arrêt cardio-respiratoire réfractaire, antécédents d’insuffisance rénale terminale',
      totalUSD: 520,
      totalCDF: 1456000,
      payeUSD: 520,
      statutPaiement: 'SOLDE',
      decesDetails: {
        dateHeureConstat: '28/10/2026 à 06:45',
        medecinDeclarant: 'Dr. Christian ILUNGA (Médecin Légiste)',
        boxMorgueAssignee: 'Box #18 Morgue',
        transfereMorgue: true
      },
      actesLivres: ['Réanimation cardio-pulmonaire avancée', 'Procès-verbal médical de décès', 'Braceletage & Transfert Box #18']
    },
    {
      id: 'hop-6',
      numeroDossier: '#HOP-2026-00411',
      patientNom: 'ILUNGA',
      patientPrenom: 'Grâce',
      sexe: 'FEMININ',
      age: 19,
      telephone: '+243 99 222 3344',
      dateAdmission: '28/10/2026 - 07:00',
      typeAdmission: 'NOUVEAU_CAS',
      statutClinique: 'HOSPITALISE',
      service: 'CHIRURGIE',
      chambreLit: 'Pavillon C — Lit #08',
      medecinTraitant: 'Dr. MWAMBA Guy',
      diagnosticPrincipal: 'Appendicite aiguë purulente opérée avec succès, surveillance post-opératoire',
      totalUSD: 620,
      totalCDF: 1736000,
      payeUSD: 400,
      statutPaiement: 'ACOMPTE',
      actesLivres: ['Appendicectomie cœlioscopique', 'Anesthésie générale', 'Antibioprophylaxie IV']
    }
  ]);

  // Prestations et Livraisons de services hospitaliers
  const [servicesHospitaliers, setServicesHospitaliers] = useState<ServiceHospitalierLivraison[]>([
    {
      id: 'liv-1',
      dateHeure: '28/10 - 09:15',
      numeroDossier: '#HOP-2026-00412',
      patientNom: 'BOKETSHU Jean-Marc',
      departement: 'PHARMACIE',
      designationActeOuProduit: 'Antibiotique Céftriaxone 1g + Soluté Ringer 500ml',
      quantite: 4,
      montantUSD: 45,
      montantCDF: 126000,
      praticienResponsable: 'Pharmacien Chef Kalonji',
      statutLivraison: 'LIVRE'
    },
    {
      id: 'liv-2',
      dateHeure: '28/10 - 09:45',
      numeroDossier: '#HOP-2026-00398',
      patientNom: 'MUKUNA Antoinette',
      departement: 'LABORATOIRE',
      designationActeOuProduit: 'Bilan sanguin complet : Ionogramme, Créatinine, Urée & NFS',
      quantite: 1,
      montantUSD: 60,
      montantCDF: 168000,
      praticienResponsable: 'Biologiste Dr. Lukusa',
      statutLivraison: 'VALIDE'
    },
    {
      id: 'liv-3',
      dateHeure: '28/10 - 10:20',
      numeroDossier: '#HOP-2026-00410',
      patientNom: 'KALOMBO David',
      departement: 'IMAGERIE',
      designationActeOuProduit: 'Radiographie pulmonaire numérique & ECG d’urgence',
      quantite: 1,
      montantUSD: 50,
      montantCDF: 140000,
      praticienResponsable: 'Manipulateur Radio Nsenga',
      statutLivraison: 'LIVRE'
    },
    {
      id: 'liv-4',
      dateHeure: '28/10 - 11:00',
      numeroDossier: '#HOP-2026-00411',
      patientNom: 'ILUNGA Grâce',
      departement: 'BLOC',
      designationActeOuProduit: 'Intervention chirurgicale sous cœlioscopie (Appendicectomie)',
      quantite: 1,
      montantUSD: 350,
      montantCDF: 980000,
      praticienResponsable: 'Dr. MWAMBA Guy (Chirurgien)',
      statutLivraison: 'VALIDE'
    },
    {
      id: 'liv-5',
      dateHeure: '28/10 - 11:40',
      numeroDossier: '#HOP-2026-00412',
      patientNom: 'BOKETSHU Jean-Marc',
      departement: 'SOINS_INFIRMIERS',
      designationActeOuProduit: 'Pack pansements aseptiques & surveillance monitorée 24h',
      quantite: 1,
      montantUSD: 30,
      montantCDF: 84000,
      praticienResponsable: 'Major Infirmier Tshilolo',
      statutLivraison: 'LIVRE'
    }
  ]);

  // Sous-onglet de travail actif dans le dashboard
  const [activeTabMorgue, setActiveTabMorgue] = useState<'REGISTRE' | 'CONTROLES_SORTIE' | 'CHAMBRES'>('REGISTRE');
  const [activeTabFunerarium, setActiveTabFunerarium] = useState<'REGISTRE' | 'PLANNING_SALONS' | 'LOGISTIQUE'>('REGISTRE');
  const [activeTabHopital, setActiveTabHopital] = useState<
    'ADMISSIONS_JOUR' | 'PATIENTS_HOSPITALISES' | 'SORTIES' | 'TRANSFERTS' | 'DECES' | 'SERVICES_LIVRAISON' | 'CAISSE'
  >('ADMISSIONS_JOUR');

  // Modal Admission Hôpital
  const [isHopitalAdmissionModalOpen, setIsHopitalAdmissionModalOpen] = useState(false);
  const [hopNom, setHopNom] = useState('');
  const [hopPrenom, setHopPrenom] = useState('');
  const [hopSexe, setHopSexe] = useState<'MASCULIN' | 'FEMININ'>('MASCULIN');
  const [hopAge, setHopAge] = useState(32);
  const [hopTel, setHopTel] = useState('+243 8');
  const [hopTypeAdmission, setHopTypeAdmission] = useState<'NOUVEAU_CAS' | 'ANCIEN_PATIENT'>('NOUVEAU_CAS');
  const [hopService, setHopService] = useState<'URGENCES' | 'MEDECINE_INTERNE' | 'CHIRURGIE' | 'MATERNITE' | 'PEDIATRIE' | 'SOINS_INTENSIFS'>('URGENCES');
  const [hopChambreLit, setHopChambreLit] = useState('Lit U-05 (Triage)');
  const [hopMedecin, setHopMedecin] = useState('Dr. Jeanne KASONGO');
  const [hopDiagnostic, setHopDiagnostic] = useState('Syndrome fébrile aigu, suspicion paludisme grave');
  const [hopAvanceUSD, setHopAvanceUSD] = useState(120);

  // Modal Constat Décès & Passerelle Morgue
  const [isHopitalDecesModalOpen, setIsHopitalDecesModalOpen] = useState(false);
  const [selectedPatientDeces, setSelectedPatientDeces] = useState<PatientHopital | null>(null);
  const [decesHeure, setDecesHeure] = useState('11:45');
  const [decesMedecin, setDecesMedecin] = useState('Dr. Christian ILUNGA (Médecin Légiste)');
  const [decesBoxMorgue, setDecesBoxMorgue] = useState('Box #18 Morgue');

  // Modal Livraison Prestation / Acte Hospitalier
  const [isHopitalActeModalOpen, setIsHopitalActeModalOpen] = useState(false);
  const [acteDossier, setActeDossier] = useState('');
  const [acteDepartement, setActeDepartement] = useState<'PHARMACIE' | 'LABORATOIRE' | 'IMAGERIE' | 'BLOC' | 'SOINS_INFIRMIERS'>('PHARMACIE');
  const [acteDesignation, setActeDesignation] = useState('Antibiotique Céftriaxone 1g + Soluté 500ml');
  const [actePrixUSD, setActePrixUSD] = useState(45);
  const [actePraticien, setActePraticien] = useState('Pharmacien Kalonji');

  // =========================================================================
  // 2. MODALES OPÉRATIONNELLES FONCTIONNELLES
  // =========================================================================

  // Modal 1 : Workflow d'Admission Morgue en 6 Étapes
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [admissionStep, setAdmissionStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [admNom, setAdmNom] = useState('');
  const [admPrenom, setAdmPrenom] = useState('');
  const [admSexe, setAdmSexe] = useState<'MASCULIN' | 'FEMININ'>('MASCULIN');
  const [admStatutId, setAdmStatutId] = useState<'IDENTIFIE_OFFICIEL' | 'PROVISOIRE' | 'NON_IDENTIFIE_X'>('IDENTIFIE_OFFICIEL');
  const [admDateDeces, setAdmDateDeces] = useState(new Date().toISOString().slice(0, 10));
  const [admHeureDeces, setAdmHeureDeces] = useState('04:30');
  const [admProvenance, setAdmProvenance] = useState('Clinique Ngaliema');
  const [admTransport, setAdmTransport] = useState('Ambulance Clinique');
  const [admEtatCorps, setAdmEtatCorps] = useState('Intact — Aucun signe de décomposition');
  const [admObservations, setAdmObservations] = useState('Aucun scellé judiciaire');
  const [admDeclarantNom, setAdmDeclarantNom] = useState('');
  const [admDeclarantTel, setAdmDeclarantTel] = useState('+243 8');
  const [admDeclarantLien, setAdmDeclarantLien] = useState('Enfant / Descendant');
  const [admDeclarantCNI, setAdmDeclarantCNI] = useState('');
  const [admDocCertificat, setAdmDocCertificat] = useState(true);
  const [admDocRequisition, setAdmDocRequisition] = useState(false);
  const [admDocPermis, setAdmDocPermis] = useState(false);
  const [admChambre, setAdmChambre] = useState('Chambre F1 (Standard)');
  const [admCasier, setAdmCasier] = useState('Casier #18');

  // Modal 2 : Contrôle & Sortie du Corps
  const [selectedSortieDossier, setSelectedSortieDossier] = useState<DefuntMorgue | null>(null);
  const [checkIdValid, setCheckIdValid] = useState(false);
  const [checkAyantDroitValid, setCheckAyantDroitValid] = useState(false);
  const [checkMedicoLegalValid, setCheckMedicoLegalValid] = useState(false);
  const [recepteurNom, setRecepteurNom] = useState('');
  const [destinationCimetiere, setDestinationCimetiere] = useState('Cimetière de la Nsele');

  // Modal 3 : Nouvelle Demande Funéraire (en 5 étapes)
  const [isFuneraireModalOpen, setIsFuneraireModalOpen] = useState(false);
  const [funStep, setFunStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [funSelectedDossierRef, setFunSelectedDossierRef] = useState('');
  const [funDefuntNom, setFunDefuntNom] = useState('');
  const [funFamilleNom, setFunFamilleNom] = useState('');
  const [funFamilleTel, setFunFamilleTel] = useState('+243 8');
  const [funSalon, setFunSalon] = useState('Grand Salon Cérémonial A');
  const [funDateHeure, setFunDateHeure] = useState('');
  const [funCorbillard, setFunCorbillard] = useState('Corbillard Limousine VIP');
  const [funSelectedPrestations, setFunSelectedPrestations] = useState<string[]>([
    'Grand salon de recueillement climatisé',
    'Cercueil bois noble verni',
    'Corbillard limousine d’honneur'
  ]);

  // Modal 4 : Consultation Dossier Unique NG-2026-XXXX
  const [dossierUniqueConsulte, setDossierUniqueConsulte] = useState<{
    numeroDossier: string;
    defunt: string;
    famille: string;
    chambreCasier: string;
    temperature: string;
    sejourJours: number;
    prestations: string[];
    salon: string;
    totalUSD: number;
    totalCDF: number;
    payeUSD: number;
    statutFinancier: string;
    visasComplets: boolean;
  } | null>(null);

  // Modal 5 : Soins & Séjour
  const [selectedSoinsDefunt, setSelectedSoinsDefunt] = useState<DefuntMorgue | null>(null);
  const [nouveauxSoins, setNouveauxSoins] = useState('Thanatopraxie complète, habillage solennel et coiffure');

  // =========================================================================
  // 3. LOGIQUE D'EXÉCUTION DES WORKFLOWS MÉTIERS
  // =========================================================================

  // Émission d'une nouvelle admission morgue
  const handleValiderAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const nouveauNum = `#NG-2026-00${Math.floor(2582 + Math.random() * 50)}`;
    const nouveauDefunt: DefuntMorgue = {
      id: `mrg-${Date.now()}`,
      numeroDossier: nouveauNum,
      defuntNom: admNom.toUpperCase(),
      defuntPrenom: admPrenom,
      statutIdentification: admStatutId,
      provenance: admProvenance,
      dateAdmission: `${new Date().toLocaleDateString('fr-FR')} - ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      dureeSejourJours: 0,
      chambre: admChambre,
      casier: admCasier,
      temperature: '+2.9°C',
      soinsAppliques: 'Mise en case sous surveillance thermique',
      totalUSD: 250,
      payeUSD: 50,
      situationFinanciere: 'ACOMPTE',
      verrouDocuments: admDocCertificat,
      verrouAyantDroit: !!admDeclarantNom,
      verrouMedicoLegal: !admDocRequisition,
      verrouFinance: false,
      statutSortie: 'EN_CONSERVATION'
    };

    setRegistreMorgue([nouveauDefunt, ...registreMorgue]);
    setIsAdmissionModalOpen(false);
    setAdmissionStep(1);
    alert(`Dossier d'admission ${nouveauNum} créé avec succès ! Casier ${admCasier} affecté.`);
  };

  // Exécution de la Sortie du Corps avec libération du casier
  const handleConfirmerSortie = () => {
    if (!selectedSortieDossier) return;
    if (!checkIdValid || !checkAyantDroitValid || !checkMedicoLegalValid) {
      alert('Veuillez cocher et attester tous les contrôles obligatoires.');
      return;
    }
    if (selectedSortieDossier.situationFinanciere !== 'SOLDE') {
      alert('La sortie ne peut être validée tant que la facture n’est pas 100% soldée en caisse.');
      return;
    }

    setRegistreMorgue((prev) =>
      prev.map((d) =>
        d.id === selectedSortieDossier.id
          ? {
              ...d,
              statutSortie: 'SORTI',
              casier: 'Libéré',
              temperature: 'Disponible',
              sortieEffective: {
                dateHeure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                recepteur: recepteurNom || 'Mandataire familial officiel',
                destinationCimetiere: destinationCimetiere
              }
            }
          : d
      )
    );

    alert(`Sortie validée avec succès pour ${selectedSortieDossier.numeroDossier}. Le casier a été libéré instantanément.`);
    setSelectedSortieDossier(null);
  };

  // Enregistrement nouvelle demande funéraire
  const handleValiderDemandeFuneraire = (e: React.FormEvent) => {
    e.preventDefault();
    const dossierRef = funSelectedDossierRef || `#NG-2026-00${Math.floor(2582 + Math.random() * 50)}`;
    const nouvelleResa: ReservationFuneraire = {
      id: `fun-${Date.now()}`,
      numeroDossier: dossierRef,
      familleNom: `Famille ${funFamilleNom}`,
      familleTel: funFamilleTel,
      defuntNom: funDefuntNom || 'Défunt Lié',
      salon: funSalon,
      creneau: funDateHeure || '11/10/2026 • 18h00 - 22h00',
      prestations: funSelectedPrestations,
      devisUSD: 1250,
      devisCDF: 3500000,
      statutPaiement: 'ACOMPTE',
      statutCeremonie: 'CONFIRME',
      corbillardAssigné: funCorbillard,
      avancementPreparation: 50
    };

    setRegistreFunerarium([nouvelleResa, ...registreFunerarium]);
    setIsFuneraireModalOpen(false);
    setFunStep(1);
    alert(`Prestations funéraires enregistrées sur le dossier ${dossierRef}.`);
  };

  // Enregistrement des soins de thanatopraxie
  const handleSauvegarderSoins = () => {
    if (!selectedSoinsDefunt) return;
    setRegistreMorgue((prev) =>
      prev.map((d) => (d.id === selectedSoinsDefunt.id ? { ...d, soinsAppliques: nouveauxSoins } : d))
    );
    setSelectedSoinsDefunt(null);
    alert('Soins et actes de conservation mis à jour.');
  };

  // Validation Admission Hôpital
  const handleValiderAdmissionHopital = (e: React.FormEvent) => {
    e.preventDefault();
    const nouveauNum = `#HOP-2026-00${Math.floor(413 + Math.random() * 50)}`;
    const nouveauPatient: PatientHopital = {
      id: `hop-${Date.now()}`,
      numeroDossier: nouveauNum,
      patientNom: hopNom.toUpperCase(),
      patientPrenom: hopPrenom,
      sexe: hopSexe,
      age: hopAge,
      telephone: hopTel,
      dateAdmission: `${new Date().toLocaleDateString('fr-FR')} - ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      typeAdmission: hopTypeAdmission,
      statutClinique: hopService === 'URGENCES' ? 'ADMIS_URGENCES' : 'HOSPITALISE',
      service: hopService,
      chambreLit: hopChambreLit,
      medecinTraitant: hopMedecin,
      diagnosticPrincipal: hopDiagnostic,
      totalUSD: hopAvanceUSD,
      totalCDF: hopAvanceUSD * 2800,
      payeUSD: hopAvanceUSD,
      statutPaiement: 'SOLDE',
      actesLivres: [`Admission initiale ${hopService}`, 'Consultation médicale & constantes vitales']
    };

    setRegistreHopital([nouveauPatient, ...registreHopital]);
    setIsHopitalAdmissionModalOpen(false);
    setHopNom('');
    setHopPrenom('');
    alert(`Admission du patient ${nouveauPatient.patientNom} ${nouveauPatient.patientPrenom} enregistrée avec succès (${nouveauNum}).`);
  };

  // Validation Constat Décès & Passerelle Immédiate Morgue (60 Box)
  const handleValiderDecesHopital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientDeces) return;

    // 1. Mettre à jour le statut du patient à l'hôpital
    setRegistreHopital((prev) =>
      prev.map((p) =>
        p.id === selectedPatientDeces.id
          ? {
              ...p,
              statutClinique: 'DECEDE' as const,
              chambreLit: `${p.chambreLit} (Transféré Morgue)`,
              decesDetails: {
                dateHeureConstat: `${new Date().toLocaleDateString('fr-FR')} à ${decesHeure}`,
                medecinDeclarant: decesMedecin,
                boxMorgueAssignee: decesBoxMorgue,
                transfereMorgue: true
              }
            }
          : p
      )
    );

    // 2. Créer automatiquement l'entrée dans le registre de la Morgue (Passerelle directe vers les 60 box)
    const nouveauMorgueId = `mrg-${Date.now()}`;
    const nouveauDossierMorgue = `#NG-2026-00${Math.floor(2585 + Math.random() * 50)}`;
    const nouveauCorps: DefuntMorgue = {
      id: nouveauMorgueId,
      numeroDossier: nouveauDossierMorgue,
      defuntNom: selectedPatientDeces.patientNom,
      defuntPrenom: selectedPatientDeces.patientPrenom,
      statutIdentification: 'IDENTIFIE_OFFICIEL',
      provenance: `Hôpital Nomargueri — Service ${selectedPatientDeces.service}`,
      dateAdmission: `${new Date().toLocaleDateString('fr-FR')} - ${decesHeure}`,
      dureeSejourJours: 0,
      chambre: 'Chambre Froide F1 (Standard)',
      casier: decesBoxMorgue,
      temperature: '+2.8°C',
      soinsAppliques: 'Transfert intra-hospitalier suite à constat médical de décès',
      totalUSD: 250,
      payeUSD: 0,
      situationFinanciere: 'ACOMPTE',
      verrouDocuments: true, // Certificat de décès légal déjà établi
      verrouAyantDroit: false,
      verrouMedicoLegal: true,
      verrouFinance: false,
      statutSortie: 'EN_CONSERVATION'
    };

    setRegistreMorgue([nouveauCorps, ...registreMorgue]);
    setIsHopitalDecesModalOpen(false);
    setSelectedPatientDeces(null);
    alert(
      `Constat de décès validé. Passerelle Morgue activée : Le corps de ${selectedPatientDeces.patientNom} a été admis en ${decesBoxMorgue} sous le dossier morgue ${nouveauDossierMorgue}.`
    );
  };

  // Validation Livraison Prestation / Acte Hospitalier
  const handleValiderLivraisonActe = (e: React.FormEvent) => {
    e.preventDefault();
    const nouvelleLivraison: ServiceHospitalierLivraison = {
      id: `liv-${Date.now()}`,
      dateHeure: `${new Date().toLocaleDateString('fr-FR').slice(0, 5)} - ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
      numeroDossier: acteDossier || '#HOP-2026-00412',
      patientNom: 'Patient Pris en Charge',
      departement: acteDepartement,
      designationActeOuProduit: acteDesignation,
      quantite: 1,
      montantUSD: actePrixUSD,
      montantCDF: actePrixUSD * 2800,
      praticienResponsable: actePraticien,
      statutLivraison: 'LIVRE'
    };

    setServicesHospitaliers([nouvelleLivraison, ...servicesHospitaliers]);
    setIsHopitalActeModalOpen(false);
    alert(`Livraison de service (${acteDepartement} - ${acteDesignation}) enregistrée avec succès.`);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. BANNIÈRE D'EXPLICATION FONCTIONNELLE : LE "POURQUOI" DE CE DASHBOARD   */}
      {/* ========================================================================= */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          currentPole === 'MORGUE'
            ? isDark
              ? 'bg-[#0B1736] border-blue-900/80 text-blue-100'
              : 'bg-blue-50 border-blue-200 text-blue-950 shadow-xs'
            : currentPole === 'HOPITAL'
            ? isDark
              ? 'bg-[#180E29] border-purple-900/80 text-purple-100'
              : 'bg-purple-50 border-purple-200 text-purple-950 shadow-xs'
            : isDark
            ? 'bg-[#0A231C] border-emerald-900/80 text-emerald-100'
            : 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  currentPole === 'MORGUE'
                    ? 'bg-blue-600 text-white'
                    : currentPole === 'HOPITAL'
                    ? 'bg-purple-600 text-white'
                    : 'bg-emerald-700 text-white'
                }`}
              >
                {currentPole === 'MORGUE'
                  ? 'PARCOURS MORGUE (ÉTAPE 1 À 6)'
                  : currentPole === 'HOPITAL'
                  ? 'PARCOURS HOSPITALIER CLINIQUE & SOINS'
                  : 'PARCOURS FUNÉRAIRE (ÉTAPE 1 À 9)'}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                • Dossier Unique Partagé NG-2026-XXXX
              </span>
            </div>

            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentPole === 'MORGUE'
                ? 'Pôle Morgue — De l’admission du corps à sa sortie'
                : currentPole === 'HOPITAL'
                ? 'Pôle Hôpital — Prise en charge, Soins, Admissions, Décès & Sorties'
                : 'Pôle Funérarium — De la commande de prestations à la clôture'}
            </h1>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {currentPole === 'MORGUE'
                ? 'Pourquoi ce tableau de bord ? Garantir la conservation thermique ininterrompue (+2°C à +4°C) dans nos 60 box frigorifiques, tracer les soins de thanatopraxie et interdire formellement toute levée du corps sans les 4 verrous stricts : identité certifiée, mandataire mandaté, visa médico-légal et solde financier complet.'
                : currentPole === 'HOPITAL'
                ? 'Pourquoi ce tableau de bord ? Administrer en continu les flux cliniques : triage des admissions du jour, gestion des lits hospitalisés, transferts sanitaires, livraisons de services (pharmacie, laboratoire, imagerie, bloc) et constats de décès avec passerelle immédiate vers les 60 box de la Morgue.'
                : 'Pourquoi ce tableau de bord ? Coordonner les réservations de chapiteaux climatisés, gradins modulaires d’honneur, espaces verts paysagers, convois corbillard et fournitures de pompes funèbres sans aucune ressaisie : les devis s’adossent directement sur le Dossier Unique déjà ouvert à la morgue, avec un suivi séparé USD et CDF.'}
            </p>
          </div>

          {/* Boutons d'Action Principaux */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {currentPole === 'MORGUE' ? (
              <button
                onClick={() => {
                  setAdmissionStep(1);
                  setIsAdmissionModalOpen(true);
                }}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nouvelle Admission Morgue (6 étapes)</span>
              </button>
            ) : currentPole === 'HOPITAL' ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsHopitalAdmissionModalOpen(true)}
                  className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nouvelle Admission Patient</span>
                </button>
                <button
                  onClick={() => setIsHopitalActeModalOpen(true)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-800/80 font-bold text-xs transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Délivrer Service / Acte</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setFunStep(1);
                  setIsFuneraireModalOpen(true);
                }}
                className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-700/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nouvelle Demande Funéraire</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INDICATEURS KPIS SOUVERAINS                                             */}
      {/* ========================================================================= */}
      {currentPole === 'MORGUE' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 : Défunts présents / sortis */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Défunts Présents / Sortis
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                18 corps
              </span>
              <span className="text-xs text-slate-400 font-mono">présents</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-emerald-400' : 'border-slate-100 text-emerald-600'}`}>
              ✓ 42 sorties effectuées ce mois
            </span>
          </div>

          {/* KPI 2 : Places disponibles & Taux d'occupation (60 BOX RÉELS) */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Capacité Froid • 60 Box Frigorifiques
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                26 libres
              </span>
              <span className="text-xs text-slate-400 font-mono">sur 60 box</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-sky-400' : 'border-slate-100 text-sky-600'}`}>
              34 box occupés • Taux d'occupation : 56,7%
            </span>
          </div>

          {/* KPI 3 : Durée moyenne de séjour */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Durée Moyenne de Séjour
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                6,4 jours
              </span>
            </div>
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80 text-xs text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>1 alerte séjour (&gt; 15 jours)</span>
            </div>
          </div>

          {/* KPI 4 : Sorties prévues ce jour */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Sorties Prévues Aujourd'hui
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                3 départs
              </span>
              <span className="text-xs text-slate-400 font-mono">programmés</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              2 autorisés • 1 en attente de solde
            </span>
          </div>
        </div>
      ) : currentPole === 'HOPITAL' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 Hôpital : Admissions du Jour / Nouveaux cas */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Admissions du Jour • Nouveaux Cas
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                14 admis
              </span>
              <span className="text-xs text-slate-400 font-mono">aujourd'hui</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-purple-400' : 'border-slate-100 text-purple-600'}`}>
              12 aux Urgences/Triage • 2 programmés
            </span>
          </div>

          {/* KPI 2 Hôpital : Patients Hospitalisés / Lits */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Patients Hospitalisés • Lits & Pavillons
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                48 lits
              </span>
              <span className="text-xs text-slate-400 font-mono">sur 75 disponibles</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-sky-400' : 'border-slate-100 text-sky-600'}`}>
              27 lits libres • Taux d'occupation : 64%
            </span>
          </div>

          {/* KPI 3 Hôpital : Sorties & Guérisons */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Sorties & Guérisons Validées
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                9 décharges
              </span>
              <span className="text-xs text-slate-400 font-mono">médicales</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-emerald-400' : 'border-slate-100 text-emerald-600'}`}>
              6 guérisons complètes • 3 ordonnances délivrées
            </span>
          </div>

          {/* KPI 4 Hôpital : Transferts & Constats Décès */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Transferts & Décès (Passerelle Morgue)
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                2 transf. • 1 décès
              </span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-amber-400' : 'border-slate-100 text-amber-600'}`}>
              Décès orienté vers Box #18 Morgue (Traçabilité)
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 Funéraire : Chapiteaux & Espaces Verts */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Chapiteaux & Espaces Verts
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                4 réservés
              </span>
              <span className="text-xs text-slate-400 font-mono">sur 6 zones</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-emerald-400' : 'border-slate-100 text-emerald-600'}`}>
              2 Chapiteaux climatisés + Jardins paysagers
            </span>
          </div>

          {/* KPI 2 Funéraire : Gradins Modulaires d’Honneur */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Gradins Modulaires d’Honneur
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                3 gradins
              </span>
              <span className="text-xs text-slate-400 font-mono">déployés</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              Capacité d'accueil : 360 places assises d'honneur
            </span>
          </div>

          {/* KPI 3 Funéraire : Pompes Funèbres & Cercueils */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Pompes Funèbres & Fournitures
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                5 commandes
              </span>
              <span className="text-xs text-slate-400 font-mono">en préparation</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-sky-400' : 'border-slate-100 text-sky-600'}`}>
              Cercueils chêne/acajou, fleuristerie & registres
            </span>
          </div>

          {/* KPI 4 Funéraire : Convois Corbillard Planifiés */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Transport & Convois Corbillard
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                4 convois
              </span>
              <span className="text-xs text-slate-400 font-mono">véhicules affectés</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              2 Limousines VIP • 2 Fourgons Deluxe
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SYNTHÈSE FINANCIÈRE & CAISSE ÉTANCHE USD & CDF                          */}
      {/* ========================================================================= */}
      <div
        className={`border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              RÈGLE DE CAISSE MULTI-DEVISES
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              USD et CDF sont suivis séparément : aucune conversion automatique sans taux défini.
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3 mt-1.5">
            <span className={`text-xl sm:text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              $18 450 USD
            </span>
            <span className={`text-sm font-mono font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              & 51 660 000 CDF encaissés
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              • Session caisse : ${caisseSession.totalEncaisseLiquideUSD} USD + {caisseSession.totalEncaisseLiquideCDF.toLocaleString('fr-FR')} CDF
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/backoffice/payments')}
          className="text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <span>Accéder à la caisse & reçus</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. ONGLETS DE REGISTRE MÉTIER SELON LE PÔLE                               */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {currentPole === 'MORGUE' ? (
          <>
            <button
              onClick={() => setActiveTabMorgue('REGISTRE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTabMorgue === 'REGISTRE'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              1. Registre Actif des Corps & Casiers ({registreMorgue.length})
            </button>
            <button
              onClick={() => setActiveTabMorgue('CONTROLES_SORTIE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTabMorgue === 'CONTROLES_SORTIE'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              2. Préparation & Contrôles avant Sortie (Les 4 Verrous)
            </button>
          </>
        ) : currentPole === 'HOPITAL' ? (
          <>
            <button
              onClick={() => setActiveTabHopital('ADMISSIONS_JOUR')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTabHopital === 'ADMISSIONS_JOUR'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>1. Admissions du Jour ({registreHopital.filter(p => p.typeAdmission === 'NOUVEAU_CAS').length})</span>
            </button>
            <button
              onClick={() => setActiveTabHopital('PATIENTS_HOSPITALISES')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTabHopital === 'PATIENTS_HOSPITALISES'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Bed className="w-3.5 h-3.5" />
              <span>2. Anciens Patients ({registreHopital.filter(p => p.statutClinique === 'HOSPITALISE').length})</span>
            </button>
            <button
              onClick={() => setActiveTabHopital('SORTIES')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTabHopital === 'SORTIES'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3. Sorties & Guérisons ({registreHopital.filter(p => p.statutClinique === 'SORTIE_GUERI').length})</span>
            </button>
            <button
              onClick={() => setActiveTabHopital('TRANSFERTS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTabHopital === 'TRANSFERTS'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>4. Transferts ({registreHopital.filter(p => p.statutClinique === 'TRANSFERE').length})</span>
            </button>
            <button
              onClick={() => setActiveTabHopital('DECES')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTabHopital === 'DECES'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <HeartCrack className="w-3.5 h-3.5 text-amber-300" />
              <span>5. Décès & Morgue ({registreHopital.filter(p => p.statutClinique === 'DECEDE').length})</span>
            </button>
            <button
              onClick={() => setActiveTabHopital('SERVICES_LIVRAISON')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTabHopital === 'SERVICES_LIVRAISON'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>6. Livraison Services ({servicesHospitaliers.length})</span>
            </button>
            <button
              onClick={() => setActiveTabHopital('CAISSE')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTabHopital === 'CAISSE'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
              <span>7. Entrées Caisse</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTabFunerarium('REGISTRE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTabFunerarium === 'REGISTRE'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              1. Registre des Prestations & Cérémonies ({registreFunerarium.length})
            </button>
            <button
              onClick={() => setActiveTabFunerarium('PLANNING_SALONS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTabFunerarium === 'PLANNING_SALONS'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              2. Planning des Salons de Veillée
            </button>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. VUE TABLEAU OPÉRATIONNEL AVEC ACTIONS FONCTIONNELLES                   */}
      {/* ========================================================================= */}
      {currentPole === 'MORGUE' && activeTabMorgue === 'REGISTRE' && (
        <div
          className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`font-semibold border-b ${
                  isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">N° Dossier Unique</th>
                  <th className="py-3 px-4">Défunt & Provenance</th>
                  <th className="py-3 px-4">Admission & Séjour</th>
                  <th className="py-3 px-4">Chambre & Casier</th>
                  <th className="py-3 px-4">Soins Appliqués</th>
                  <th className="py-3 px-4">Finance</th>
                  <th className="py-3 px-4">Statut Sortie</th>
                  <th className="py-3 px-4 text-right">Actions Opérationnelles</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                {registreMorgue.map((item) => (
                  <tr key={item.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          setDossierUniqueConsulte({
                            numeroDossier: item.numeroDossier,
                            defunt: `${item.defuntPrenom} ${item.defuntNom}`,
                            famille: 'Famille déclarée',
                            chambreCasier: `${item.chambre} • ${item.casier}`,
                            temperature: item.temperature,
                            sejourJours: item.dureeSejourJours,
                            prestations: [item.soinsAppliques, 'Conservation continue'],
                            salon: 'Non réservé',
                            totalUSD: item.totalUSD,
                            totalCDF: item.totalUSD * 2800,
                            payeUSD: item.payeUSD,
                            statutFinancier: item.situationFinanciere,
                            visasComplets: item.verrouDocuments && item.verrouAyantDroit && item.verrouMedicoLegal && item.verrouFinance
                          })
                        }
                        className="font-mono font-bold text-sky-400 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.numeroDossier}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {item.defuntNom} {item.defuntPrenom}
                      </span>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.provenance}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span>{item.dateAdmission}</span>
                      <span className={`block text-[10px] font-mono font-bold ${
                        item.dureeSejourJours > 15 ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        Séjour : {item.dureeSejourJours} j {item.dureeSejourJours > 15 ? '(ALERTE)' : ''}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {item.casier}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        {item.temperature}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="block truncate max-w-xs">{item.soinsAppliques}</span>
                      <button
                        onClick={() => setSelectedSoinsDefunt(item)}
                        className="text-[10px] text-sky-400 hover:underline font-semibold"
                      >
                        + Modifier les soins
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          item.situationFinanciere === 'SOLDE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        ${item.payeUSD} / ${item.totalUSD} ({item.situationFinanciere})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.statutSortie === 'SORTI'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : item.statutSortie === 'SORTIE_AUTORISEE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.statutSortie}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSortieDossier(item);
                          setCheckIdValid(item.verrouDocuments);
                          setCheckAyantDroitValid(item.verrouAyantDroit);
                          setCheckMedicoLegalValid(item.verrouMedicoLegal);
                        }}
                        disabled={item.statutSortie === 'SORTI'}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          item.statutSortie === 'SORTI'
                            ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        Contrôle & Sortie
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Onglet 2 Morgue : Contrôles avant sortie (Les 4 Verrous) */}
      {currentPole === 'MORGUE' && activeTabMorgue === 'CONTROLES_SORTIE' && (
        <div
          className={`border rounded-2xl p-5 space-y-4 transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-white">
              Vérification des 4 Verrous Légaux & Financiers avant Levée du Corps
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Règle souveraine : aucun corps ne peut franchir le sas de sortie sans l’alignement parfait des 4 validations ci-dessous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registreMorgue.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-400 text-xs">{item.numeroDossier}</span>
                  <span className="font-bold text-white text-xs">{item.defuntNom} {item.defuntPrenom}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded-lg border ${item.verrouDocuments ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300' : 'border-red-800 bg-red-950/40 text-red-300'}`}>
                    <span>1. Certificat décès : {item.verrouDocuments ? '✓ Validé' : '✗ Manquant'}</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${item.verrouAyantDroit ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300' : 'border-red-800 bg-red-950/40 text-red-300'}`}>
                    <span>2. Mandataire CNI : {item.verrouAyantDroit ? '✓ Validé' : '✗ Manquant'}</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${item.verrouMedicoLegal ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300' : 'border-red-800 bg-red-950/40 text-red-300'}`}>
                    <span>3. Visa légal : {item.verrouMedicoLegal ? '✓ Accordé' : '✗ Réquisition'}</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${item.situationFinanciere === 'SOLDE' ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300' : 'border-amber-800 bg-amber-950/40 text-amber-300'}`}>
                    <span>4. Solde Caisse : {item.situationFinanciere === 'SOLDE' ? '✓ Soldé 100%' : '✗ Solde restant'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Emplacement : {item.casier}</span>
                  <button
                    onClick={() => {
                      setSelectedSortieDossier(item);
                      setCheckIdValid(item.verrouDocuments);
                      setCheckAyantDroitValid(item.verrouAyantDroit);
                      setCheckMedicoLegalValid(item.verrouMedicoLegal);
                    }}
                    disabled={item.statutSortie === 'SORTI'}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Ouvrir protocole de sortie
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vue Funérarium : Registre des Prestations & Cérémonies */}
      {currentPole === 'FUNERARIUM' && (
        <div
          className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`font-semibold border-b ${
                  isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">N° Dossier</th>
                  <th className="py-3 px-4">Défunt & Famille</th>
                  <th className="py-3 px-4">Salon de Veillée</th>
                  <th className="py-3 px-4">Créneau Horaire</th>
                  <th className="py-3 px-4">Prestations à la Carte</th>
                  <th className="py-3 px-4">Corbillard Affecté</th>
                  <th className="py-3 px-4">Devis Suivi</th>
                  <th className="py-3 px-4">Préparation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                {registreFunerarium.map((item) => (
                  <tr key={item.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          setDossierUniqueConsulte({
                            numeroDossier: item.numeroDossier,
                            defunt: item.defuntNom,
                            famille: item.familleNom,
                            chambreCasier: 'Chambre F1 • Casier #04',
                            temperature: '+2.8°C',
                            sejourJours: 2,
                            prestations: item.prestations,
                            salon: item.salon,
                            totalUSD: item.devisUSD,
                            totalCDF: item.devisCDF,
                            payeUSD: item.statutPaiement === 'SOLDE' ? item.devisUSD : item.devisUSD * 0.6,
                            statutFinancier: item.statutPaiement,
                            visasComplets: true
                          })
                        }
                        className="font-mono font-bold text-sky-400 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.numeroDossier}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {item.defuntNom}
                      </span>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {item.familleNom} ({item.familleTel})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-400">{item.salon}</span>
                    </td>
                    <td className="py-3 px-4">{item.creneau}</td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] block">{item.prestations.join(', ')}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sky-300 font-medium">{item.corbillardAssigné}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <strong className="block text-white">${item.devisUSD} USD</strong>
                      <span className="text-[10px] text-slate-400">{item.devisCDF.toLocaleString('fr-FR')} CDF</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span>{item.avancementPreparation}%</span>
                        </div>
                        <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.avancementPreparation}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Prestations du dossier ${item.numeroDossier} validées pour le jour J.`)}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                      >
                        Pointer Jour J
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5.B VUES OPÉRATIONNELLES DU PÔLE HÔPITAL (7 MODULES PARTICULIERS)          */}
      {/* ========================================================================= */}

      {/* SOUS-MODULE 1 HÔPITAL : Admissions de la Journée (Nouveaux Cas) */}
      {currentPole === 'HOPITAL' && activeTabHopital === 'ADMISSIONS_JOUR' && (
        <div
          className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-400" />
                <span>Admissions du Jour • Triage des Nouveaux Cas</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Accueil et enregistrement d'urgence, constantes vitales et orientation pavillonnaire immédiate.
              </p>
            </div>
            <button
              onClick={() => setIsHopitalAdmissionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Enregistrer Nouveau Patient</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`font-semibold border-b ${
                  isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">N° Dossier Patient</th>
                  <th className="py-3 px-4">Nom & Prénom</th>
                  <th className="py-3 px-4">Âge & Sexe</th>
                  <th className="py-3 px-4">Date / Heure</th>
                  <th className="py-3 px-4">Service & Emplacement</th>
                  <th className="py-3 px-4">Diagnostic Initial</th>
                  <th className="py-3 px-4">Médecin Référent</th>
                  <th className="py-3 px-4">Finance</th>
                  <th className="py-3 px-4 text-right">Actions Cliniques</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                {registreHopital
                  .filter((p) => p.typeAdmission === 'NOUVEAU_CAS')
                  .map((p) => (
                    <tr key={p.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 font-mono font-bold text-purple-400">{p.numeroDossier}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {p.patientNom} {p.patientPrenom}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.telephone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span>{p.age} ans</span>
                        <span className="block text-[10px] text-slate-400">({p.sexe === 'MASCULIN' ? 'M' : 'F'})</span>
                      </td>
                      <td className="py-3 px-4">{p.dateAdmission}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                          {p.service}
                        </span>
                        <span className="block text-[11px] text-slate-300 mt-0.5">{p.chambreLit}</span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[11px]">{p.diagnosticPrincipal}</td>
                      <td className="py-3 px-4 font-medium text-slate-200">{p.medecinTraitant}</td>
                      <td className="py-3 px-4 font-mono">
                        <span className="text-emerald-400 font-bold">${p.payeUSD}</span> / ${p.totalUSD}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setActeDossier(p.numeroDossier);
                            setIsHopitalActeModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[11px] font-semibold"
                        >
                          + Prescrire
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPatientDeces(p);
                            setIsHopitalDecesModalOpen(true);
                          }}
                          className="px-2 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg text-[11px]"
                          title="Constater décès et transférer vers l'un des 60 box de la Morgue"
                        >
                          Décès
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 2 HÔPITAL : Anciens Patients Hospitalisés (Lits & Pavillons) */}
      {currentPole === 'HOPITAL' && activeTabHopital === 'PATIENTS_HOSPITALISES' && (
        <div
          className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Bed className="w-4 h-4 text-sky-400" />
                <span>Patients Hospitalisés • Gestion des Lits & Suivi des Séjours</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Surveillance clinique continue, administration des soins quotidiens et état d'avancement des thérapeutiques.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-sky-950 text-sky-300 border border-sky-800 rounded-xl">
              48 lits occupés / 75 lits
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`font-semibold border-b ${
                  isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">Dossier</th>
                  <th className="py-3 px-4">Patient Hospitalisé</th>
                  <th className="py-3 px-4">Pavillon & Lit</th>
                  <th className="py-3 px-4">Date d'Entrée</th>
                  <th className="py-3 px-4">Diagnostic & Surveillance</th>
                  <th className="py-3 px-4">Actes & Traitements Réalisés</th>
                  <th className="py-3 px-4">Situation Compte</th>
                  <th className="py-3 px-4 text-right">Actions Patient</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                {registreHopital
                  .filter((p) => p.statutClinique === 'HOSPITALISE' || p.statutClinique === 'ADMIS_URGENCES')
                  .map((p) => (
                    <tr key={p.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 font-mono font-bold text-purple-400">{p.numeroDossier}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {p.patientNom} {p.patientPrenom}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.medecinTraitant}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-sky-300">{p.chambreLit}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">Service {p.service}</span>
                      </td>
                      <td className="py-3 px-4">{p.dateAdmission}</td>
                      <td className="py-3 px-4 max-w-xs text-[11px] leading-relaxed">{p.diagnosticPrincipal}</td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 text-[10px]">
                          {p.actesLivres.map((act, i) => (
                            <div key={i} className="text-slate-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.statutPaiement === 'SOLDE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          ${p.payeUSD} / ${p.totalUSD} ({p.statutPaiement})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setRegistreHopital((prev) =>
                              prev.map((item) =>
                                item.id === p.id ? { ...item, statutClinique: 'SORTIE_GUERI' } : item
                              )
                            );
                            alert(`Sortie médicale validée pour le patient ${p.patientNom}.`);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold"
                        >
                          Valider Sortie
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPatientDeces(p);
                            setIsHopitalDecesModalOpen(true);
                          }}
                          className="px-2 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg text-[11px]"
                          title="Constater décès et passerelle vers les 60 box de la Morgue"
                        >
                          Constat Décès
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 3 HÔPITAL : Sorties & Guérisons */}
      {currentPole === 'HOPITAL' && activeTabHopital === 'SORTIES' && (
        <div
          className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sorties Validées • Guérisons & Décharges Médicales</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Clôture du dossier médical, délivrance d'ordonnances post-hospitalisation et visa de sortie caisse.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-xl">
              ✓ 9 sorties aujourd'hui
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`font-semibold border-b ${
                  isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">Dossier</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Service Libéré</th>
                  <th className="py-3 px-4">Diagnostic Traité</th>
                  <th className="py-3 px-4">Médecin Signataire</th>
                  <th className="py-3 px-4">Statut Facturation</th>
                  <th className="py-3 px-4">Documents Remis</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                {registreHopital
                  .filter((p) => p.statutClinique === 'SORTIE_GUERI')
                  .map((p) => (
                    <tr key={p.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">{p.numeroDossier}</td>
                      <td className="py-3 px-4 font-bold text-white">{p.patientNom} {p.patientPrenom}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {p.service}
                        </span>
                        <span className="block text-[10px] text-emerald-400 mt-0.5">Lit libéré</span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[11px]">{p.diagnosticPrincipal}</td>
                      <td className="py-3 px-4 text-slate-300">{p.medecinTraitant}</td>
                      <td className="py-3 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Soldé 100% (${p.totalUSD})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[10px] text-slate-300">
                        ✓ Ordonnance • Billet de sortie • Carnet santé
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`Impression du bulletin de sortie médicale pour le dossier ${p.numeroDossier}.`)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-semibold"
                        >
                          Imprimer Billet
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 4 HÔPITAL : Transferts Sanitaires */}
      {currentPole === 'HOPITAL' && activeTabHopital === 'TRANSFERTS' && (
        <div
          className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                <span>Transferts Sanitaires • Évacuations Médicalisées Externes</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Régulation SAMU, établissements partenaires spécialisés et liaison avec les centres de référence.
              </p>
            </div>
            <span className="text-xs text-sky-400 font-mono font-bold px-3 py-1 bg-sky-950 border border-sky-800 rounded-xl">
              2 transferts régulés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`font-semibold border-b ${
                  isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">Dossier</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Établissement Référent Cible</th>
                  <th className="py-3 px-4">Motif Médical du Transfert</th>
                  <th className="py-3 px-4">Ambulance & Équipage</th>
                  <th className="py-3 px-4">Médecin Régulateur</th>
                  <th className="py-3 px-4 text-right">Statut Évacuation</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                {registreHopital
                  .filter((p) => p.statutClinique === 'TRANSFERE')
                  .map((p) => (
                    <tr key={p.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 font-mono font-bold text-sky-400">{p.numeroDossier}</td>
                      <td className="py-3 px-4 font-bold text-white">{p.patientNom} {p.patientPrenom}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-sky-300">{p.transfertDetails?.etablissementCible}</span>
                      </td>
                      <td className="py-3 px-4 max-w-xs text-[11px]">{p.transfertDetails?.motifTransfert}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-300">{p.transfertDetails?.ambulanceAssignee}</td>
                      <td className="py-3 px-4 text-slate-300">{p.medecinTraitant}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
                          Transfert Effectué
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 5 HÔPITAL : Constat de Décès & Passerelle Directe vers les 60 Box de la Morgue */}
      {currentPole === 'HOPITAL' && activeTabHopital === 'DECES' && (
        <div
          className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                  PASSERELLE SOUVERAINE HÔPITAL ➔ MORGUE
                </span>
                <span className="text-xs text-slate-400">• Capacité : 60 Box Frigorifiques</span>
              </div>
              <h3 className="font-bold text-sm text-white mt-1 flex items-center gap-2">
                <HeartCrack className="w-4 h-4 text-red-400" />
                <span>Constats Médicaux de Décès & Attribution Immédiate de Box</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tout décès constaté en milieu hospitalier génère automatiquement une entrée dans le registre de conservation froide de la morgue.
              </p>
            </div>
            <button
              onClick={() => {
                const premierHospitalise = registreHopital.find((p) => p.statutClinique === 'HOSPITALISE');
                if (premierHospitalise) {
                  setSelectedPatientDeces(premierHospitalise);
                  setIsHopitalDecesModalOpen(true);
                } else {
                  alert('Aucun patient hospitalisé actif à transférer.');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <HeartCrack className="w-3.5 h-3.5" />
              <span>+ Constater Décès & Affecter Box Morgue</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`font-semibold border-b ${
                  isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">Dossier Hôpital</th>
                  <th className="py-3 px-4">Défunt</th>
                  <th className="py-3 px-4">Service d'Origine</th>
                  <th className="py-3 px-4">Date & Heure Constat</th>
                  <th className="py-3 px-4">Médecin Déclarant</th>
                  <th className="py-3 px-4">Box Morgue Assignée (sur 60 box)</th>
                  <th className="py-3 px-4">Statut Passerelle</th>
                  <th className="py-3 px-4 text-right">Traçabilité</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                {registreHopital
                  .filter((p) => p.statutClinique === 'DECEDE')
                  .map((p) => (
                    <tr key={p.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 font-mono font-bold text-red-400">{p.numeroDossier}</td>
                      <td className="py-3 px-4 font-bold text-white">{p.patientNom} {p.patientPrenom}</td>
                      <td className="py-3 px-4">{p.service}</td>
                      <td className="py-3 px-4 font-mono">{p.decesDetails?.dateHeureConstat}</td>
                      <td className="py-3 px-4 text-slate-300">{p.decesDetails?.medecinDeclarant}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800">
                          {p.decesDetails?.boxMorgueAssignee || 'Box #18 Morgue'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          ✓ Transféré en chambre froide
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`Dossier morgue lié synchronisé avec le Box ${p.decesDetails?.boxMorgueAssignee}.`)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-semibold"
                        >
                          Voir Box Morgue
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 6 HÔPITAL : Livraison de Services (Pharmacie, Labo, Imagerie, Bloc) */}
      {currentPole === 'HOPITAL' && activeTabHopital === 'SERVICES_LIVRAISON' && (
        <div
          className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-purple-400" />
                <span>Livraison de Services Médicaux & Prestations Techniques</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Délivrance pharmacie centrale, analyses laboratoire, radiologie/imagerie, interventions de bloc opératoire et soins infirmiers.
              </p>
            </div>
            <button
              onClick={() => setIsHopitalActeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Délivrer Service / Acte</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`font-semibold border-b ${
                  isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">Date / Heure</th>
                  <th className="py-3 px-4">N° Dossier</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Département Technique</th>
                  <th className="py-3 px-4">Désignation de la Prestation</th>
                  <th className="py-3 px-4">Quantité</th>
                  <th className="py-3 px-4">Tarification (USD & CDF)</th>
                  <th className="py-3 px-4">Praticien / Responsable</th>
                  <th className="py-3 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                {servicesHospitaliers.map((liv) => (
                  <tr key={liv.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-4 font-mono">{liv.dateHeure}</td>
                    <td className="py-3 px-4 font-mono font-bold text-purple-400">{liv.numeroDossier}</td>
                    <td className="py-3 px-4 font-bold text-white">{liv.patientNom}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          liv.departement === 'PHARMACIE'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : liv.departement === 'LABORATOIRE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : liv.departement === 'IMAGERIE'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : liv.departement === 'BLOC'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {liv.departement}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">{liv.designationActeOuProduit}</td>
                    <td className="py-3 px-4 font-mono">x{liv.quantite}</td>
                    <td className="py-3 px-4 font-mono">
                      <strong className="block text-white">${liv.montantUSD} USD</strong>
                      <span className="text-[10px] text-slate-400">{liv.montantCDF.toLocaleString('fr-FR')} CDF</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{liv.praticienResponsable}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        ✓ {liv.statutLivraison}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 7 HÔPITAL : Entrées Caisse Médicale */}
      {currentPole === 'HOPITAL' && activeTabHopital === 'CAISSE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Consultations & Urgences</span>
              <div className="text-xl font-bold font-mono text-white mt-1">$2 840 USD</div>
              <span className="text-[10px] text-slate-400">7 952 000 CDF</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Hospitalisations & Lits</span>
              <div className="text-xl font-bold font-mono text-white mt-1">$6 420 USD</div>
              <span className="text-[10px] text-slate-400">17 976 000 CDF</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Pharmacie & Laboratoire</span>
              <div className="text-xl font-bold font-mono text-white mt-1">$4 150 USD</div>
              <span className="text-[10px] text-slate-400">11 620 000 CDF</span>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0B132B] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Bloc & Imagerie</span>
              <div className="text-xl font-bold font-mono text-white mt-1">$5 040 USD</div>
              <span className="text-[10px] text-slate-400">14 112 000 CDF</span>
            </div>
          </div>

          <div
            className={`border rounded-2xl p-5 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm">Registre des Encaissements Hospitaliers</h4>
                <p className="text-xs text-slate-400">Suivi strict étanche en devises sans conversion sauvage.</p>
              </div>
              <button
                onClick={() => navigate('/backoffice/payments')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Ouvrir Module Complet Caisse
              </button>
            </div>

            <div className="pt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="py-2">Réf Reçu</th>
                    <th className="py-2">Dossier</th>
                    <th className="py-2">Patient</th>
                    <th className="py-2">Motif d'Encaissement</th>
                    <th className="py-2 font-mono">Montant USD</th>
                    <th className="py-2 font-mono">Montant CDF</th>
                    <th className="py-2 text-right">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-mono text-emerald-400">#RC-HOP-8821</td>
                    <td className="py-2.5 font-mono">#HOP-2026-00412</td>
                    <td className="py-2.5 font-semibold text-white">BOKETSHU Jean-Marc</td>
                    <td className="py-2.5">Forfait admission urgences & artésunate</td>
                    <td className="py-2.5 font-mono text-emerald-400 font-bold">$180 USD</td>
                    <td className="py-2.5 font-mono text-slate-300">504 000 CDF</td>
                    <td className="py-2.5 text-right font-semibold text-slate-300">Espèces Caisse</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-mono text-emerald-400">#RC-HOP-8820</td>
                    <td className="py-2.5 font-mono">#HOP-2026-00398</td>
                    <td className="py-2.5 font-semibold text-white">MUKUNA Antoinette</td>
                    <td className="py-2.5">Acompte hospitalisation 4j pavillon</td>
                    <td className="py-2.5 font-mono text-emerald-400 font-bold">$300 USD</td>
                    <td className="py-2.5 font-mono text-slate-300">840 000 CDF</td>
                    <td className="py-2.5 text-right font-semibold text-slate-300">Mobile Money (M-Pesa)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-mono text-emerald-400">#RC-HOP-8819</td>
                    <td className="py-2.5 font-mono">#HOP-2026-00405</td>
                    <td className="py-2.5 font-semibold text-white">TSHIELA Clarisse</td>
                    <td className="py-2.5">Solde accouchement et séjour maternité</td>
                    <td className="py-2.5 font-mono text-emerald-400 font-bold">$350 USD</td>
                    <td className="py-2.5 font-mono text-slate-300">980 000 CDF</td>
                    <td className="py-2.5 text-right font-semibold text-slate-300">Carte Bancaire</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL 1 : WORKFLOW NOUVELLE ADMISSION MORGUE EN 6 ÉTAPES               */}
      {/* ========================================================================= */}
      {isAdmissionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1A3E] border border-blue-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-blue-950 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-sky-400">
                  PROTOCOLE D'ADMISSION & BRACELETAGE DU CORPS
                </span>
                <h3 className="text-lg font-bold text-white">
                  Nouvelle Admission de Corps en Chambre Froide
                </h3>
              </div>
              <button onClick={() => setIsAdmissionModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Barre de progression des 6 étapes */}
            <div className="flex items-center justify-between text-[11px] font-semibold border-b border-blue-950/80 pb-3 overflow-x-auto gap-2">
              {[
                '1. Identité Défunt',
                '2. Infos Arrivée',
                '3. Famille / Ayant droit',
                '4. Documents',
                '5. Chambre & Casier',
                '6. Confirmation'
              ].map((etp, idx) => (
                <span
                  key={etp}
                  className={`px-2.5 py-1 rounded-lg shrink-0 ${
                    admissionStep === idx + 1
                      ? 'bg-blue-600 text-white font-bold'
                      : admissionStep > idx + 1
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'text-slate-500'
                  }`}
                >
                  {etp}
                </span>
              ))}
            </div>

            <form onSubmit={handleValiderAdmission} className="space-y-5 text-xs">
              {/* ÉTAPE 1 : Identité Défunt */}
              {admissionStep === 1 && (
                <div className="space-y-4">
                  <div className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                    1. Identité et Statut d'Identification du Défunt
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Nom de famille *</label>
                      <input
                        type="text"
                        placeholder="Ex: TSHISEKEDI"
                        value={admNom}
                        onChange={(e) => setAdmNom(e.target.value)}
                        required
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Prénom *</label>
                      <input
                        type="text"
                        placeholder="Ex: Paul"
                        value={admPrenom}
                        onChange={(e) => setAdmPrenom(e.target.value)}
                        required
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Statut d'identification *</label>
                      <select
                        value={admStatutId}
                        onChange={(e) => setAdmStatutId(e.target.value as any)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white font-bold text-sky-400"
                      >
                        <option value="IDENTIFIE_OFFICIEL">Identifié officiel (Pièce d'identité fournie)</option>
                        <option value="PROVISOIRE">Provisoire (Témoignage oral famille)</option>
                        <option value="NON_IDENTIFIE_X">Non identifié (Corps X / Réquisition judiciaire)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Date & Heure du décès *</label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={admDateDeces}
                          onChange={(e) => setAdmDateDeces(e.target.value)}
                          className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                        />
                        <input
                          type="time"
                          value={admHeureDeces}
                          onChange={(e) => setAdmHeureDeces(e.target.value)}
                          className="w-28 p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right pt-2">
                    <button
                      type="button"
                      onClick={() => setAdmissionStep(2)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold"
                    >
                      Suivant : Infos Arrivée ➔
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : Informations d'arrivée */}
              {admissionStep === 2 && (
                <div className="space-y-4">
                  <div className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                    2. Informations d'Arrivée & État du Corps
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Provenance du corps</label>
                      <input
                        type="text"
                        value={admProvenance}
                        onChange={(e) => setAdmProvenance(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Moyen de transport / Véhicule</label>
                      <input
                        type="text"
                        value={admTransport}
                        onChange={(e) => setAdmTransport(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 mb-1 font-medium">État physique du corps à l'arrivée</label>
                      <input
                        type="text"
                        value={admEtatCorps}
                        onChange={(e) => setAdmEtatCorps(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setAdmissionStep(1)} className="px-4 py-2 border rounded-xl">Retour</button>
                    <button type="button" onClick={() => setAdmissionStep(3)} className="px-5 py-2 bg-blue-600 rounded-xl font-bold">Suivant : Famille ➔</button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : Famille / Déclarant */}
              {admissionStep === 3 && (
                <div className="space-y-4">
                  <div className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                    3. Contact Famille / Ayant Droit Responsable
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Nom du déclarant mandaté *</label>
                      <input
                        type="text"
                        placeholder="Ex: Grâce KASANDA"
                        value={admDeclarantNom}
                        onChange={(e) => setAdmDeclarantNom(e.target.value)}
                        required
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Téléphone joignable 24h/24 *</label>
                      <input
                        type="text"
                        value={admDeclarantTel}
                        onChange={(e) => setAdmDeclarantTel(e.target.value)}
                        required
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Lien de parenté</label>
                      <input
                        type="text"
                        value={admDeclarantLien}
                        onChange={(e) => setAdmDeclarantLien(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">N° Pièce d'identité (CNI / Passeport)</label>
                      <input
                        type="text"
                        placeholder="Ex: CNI-KN-892102"
                        value={admDeclarantCNI}
                        onChange={(e) => setAdmDeclarantCNI(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setAdmissionStep(2)} className="px-4 py-2 border rounded-xl">Retour</button>
                    <button type="button" onClick={() => setAdmissionStep(4)} className="px-5 py-2 bg-blue-600 rounded-xl font-bold">Suivant : Documents ➔</button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 4 : Documents légaux */}
              {admissionStep === 4 && (
                <div className="space-y-4">
                  <div className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                    4. Pièces Justificatives et Visas Légaux
                  </div>
                  <div className="space-y-2.5 bg-[#061126] p-4 rounded-xl border border-blue-950">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={admDocCertificat}
                        onChange={(e) => setAdmDocCertificat(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span>Certificat médical de décès signé par le médecin légiste / traitant</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={admDocRequisition}
                        onChange={(e) => setAdmDocRequisition(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span>Réquisition judiciaire / Décision du Procureur de la République</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={admDocPermis}
                        onChange={(e) => setAdmDocPermis(e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span>Permis d'inhumer / autorisation de transport municipal</span>
                    </label>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setAdmissionStep(3)} className="px-4 py-2 border rounded-xl">Retour</button>
                    <button type="button" onClick={() => setAdmissionStep(5)} className="px-5 py-2 bg-blue-600 rounded-xl font-bold">Suivant : Casier ➔</button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 5 : Emplacement & Casier Frigorifique */}
              {admissionStep === 5 && (
                <div className="space-y-4">
                  <div className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                    5. Sélection de la Chambre Froide et du Casier Disponible
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Chambre froide</label>
                      <select
                        value={admChambre}
                        onChange={(e) => setAdmChambre(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white font-bold"
                      >
                        <option value="Chambre F1 (Standard)">Chambre F1 — Standard (+2.8°C)</option>
                        <option value="Chambre F2 (Soins & Thanato)">Chambre F2 — Soins & Thanatopraxie (+3.0°C)</option>
                        <option value="Chambre F3 (Réserve sécurisée)">Chambre F3 — Réserve sécurisée (+2.5°C)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1 font-medium">Casier disponible</label>
                      <select
                        value={admCasier}
                        onChange={(e) => setAdmCasier(e.target.value)}
                        className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white font-bold text-emerald-400"
                      >
                        <option value="Casier #18">Casier #18 (Libre • +2.8°C)</option>
                        <option value="Casier #19">Casier #19 (Libre • +2.9°C)</option>
                        <option value="Casier #22">Casier #22 (Libre • +3.0°C)</option>
                        <option value="Casier #25">Casier #25 (Libre • +2.7°C)</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-950/40 border border-blue-900 rounded-xl text-sky-300 text-xs">
                    ✓ Affectation immédiate du casier : dès validation, la sonde thermique est calibrée et le numéro NG-2026-XXXX est scellé.
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setAdmissionStep(4)} className="px-4 py-2 border rounded-xl">Retour</button>
                    <button type="button" onClick={() => setAdmissionStep(6)} className="px-5 py-2 bg-blue-600 rounded-xl font-bold">Suivant : Confirmation ➔</button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 6 : Confirmation & Récépissé d'admission */}
              {admissionStep === 6 && (
                <div className="space-y-4">
                  <div className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                    6. Confirmation et Génération du Dossier Unique NG-2026-XXXX
                  </div>
                  <div className="bg-[#061126] p-4 rounded-xl border border-blue-900 space-y-2 text-xs">
                    <div><strong>Défunt :</strong> {admPrenom} {admNom.toUpperCase()}</div>
                    <div><strong>Statut d'identification :</strong> {admStatutId}</div>
                    <div><strong>Chambre & Casier :</strong> {admChambre} • {admCasier}</div>
                    <div><strong>Déclarant :</strong> {admDeclarantNom} ({admDeclarantTel})</div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setAdmissionStep(5)} className="px-4 py-2 border rounded-xl">Retour</button>
                    <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black text-white shadow-lg">
                      ✓ Confirmer l’Admission & Sceller le Casier
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL 2 : CONTRÔLE ET SORTIE DU CORPS                                   */}
      {/* ========================================================================= */}
      {selectedSortieDossier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1A3E] border border-blue-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                  PROTOCOLE DE SORTIE SÉCURISÉE DU CORPS
                </span>
                <h3 className="text-lg font-bold text-white">
                  Contrôle des 4 Verrous Obligatoires avant Levée de Corps
                </h3>
              </div>
              <button onClick={() => setSelectedSortieDossier(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-900 text-xs">
              Dossier : <strong className="text-sky-300 font-mono">{selectedSortieDossier.numeroDossier}</strong> • Défunt : <strong>{selectedSortieDossier.defuntNom} {selectedSortieDossier.defuntPrenom}</strong> ({selectedSortieDossier.casier})
            </div>

            {/* Les 4 Verrous Stricts */}
            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#061126] border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkIdValid}
                  onChange={(e) => setCheckIdValid(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div>
                  <strong className="block text-white">1. Identité & Certificat de Décès Vérifiés</strong>
                  <span className="text-[11px] text-slate-400">Le certificat médical de décès est authentifié et correspond au bracelet du défunt.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#061126] border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkAyantDroitValid}
                  onChange={(e) => setCheckAyantDroitValid(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div>
                  <strong className="block text-white">2. Mandataire / Personne Autorisée Vérifiée</strong>
                  <span className="text-[11px] text-slate-400">La pièce d'identité de l'ayant droit mandaté a été vérifiée au guichet d'accueil.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#061126] border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkMedicoLegalValid}
                  onChange={(e) => setCheckMedicoLegalValid(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div>
                  <strong className="block text-white">3. Contrôle Médico-Légal & Autorisation du Procureur</strong>
                  <span className="text-[11px] text-slate-400">Aucun scellé ni opposition judiciaire active pour cette levée.</span>
                </div>
              </label>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                selectedSortieDossier.situationFinanciere === 'SOLDE'
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-red-950/40 border-red-800 text-red-300'
              }`}>
                <div>
                  <strong className="block">4. Situation Financière en Caisse</strong>
                  <span className="text-[11px]">
                    {selectedSortieDossier.situationFinanciere === 'SOLDE'
                      ? '✓ Facture 100% Soldée en caisse centrale.'
                      : '✗ Solde restant dû : Levée de corps strictement interdite tant que non soldé.'}
                  </span>
                </div>
                <span className="font-mono font-bold">${selectedSortieDossier.payeUSD} / ${selectedSortieDossier.totalUSD} USD</span>
              </div>
            </div>

            {/* Détails de sortie */}
            <div className="space-y-3 pt-2 border-t border-blue-950 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Personne qui reçoit le corps (Nom & CNI) *</label>
                <input
                  type="text"
                  placeholder="Ex: Patrick MUTOMBO (CNI-KN-9921)"
                  value={recepteurNom}
                  onChange={(e) => setRecepteurNom(e.target.value)}
                  className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Destination finale / Cimetière *</label>
                <input
                  type="text"
                  value={destinationCimetiere}
                  onChange={(e) => setDestinationCimetiere(e.target.value)}
                  className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-blue-950">
              <span className="text-[11px] text-slate-400">Action irréversible : le casier sera automatiquement libéré.</span>
              <button
                type="button"
                onClick={handleConfirmerSortie}
                disabled={selectedSortieDossier.situationFinanciere !== 'SOLDE'}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl font-bold text-white shadow-lg"
              >
                ✓ Valider la Sortie & Libérer le Casier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL 3 : NOUVELLE DEMANDE FUNÉRAIRE (EN 5 ÉTAPES)                     */}
      {/* ========================================================================= */}
      {isFuneraireModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1A3E] border border-blue-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                  RÉSERVATION DES SALONS & PARCOURS FUNÉRAIRE
                </span>
                <h3 className="text-lg font-bold text-white">
                  Nouvelle Réservation & Prestations Funéraires
                </h3>
              </div>
              <button onClick={() => setIsFuneraireModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleValiderDemandeFuneraire} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-950/40 border border-emerald-900 rounded-xl text-emerald-300">
                <strong>Continuité du Dossier Unique :</strong> Retrouver le défunt existant via son n° NG-2026-XXXX ou créer les informations nécessaires. Zéro double saisie.
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Associer au Dossier Unique existant (Morgue)</label>
                <select
                  value={funSelectedDossierRef}
                  onChange={(e) => setFunSelectedDossierRef(e.target.value)}
                  className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white font-mono"
                >
                  <option value="">Sélectionner un défunt déjà présent en morgue...</option>
                  {registreMorgue.map((d) => (
                    <option key={d.id} value={d.numeroDossier}>
                      {d.numeroDossier} — {d.defuntNom} {d.defuntPrenom} ({d.casier})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Famille responsable</label>
                  <input
                    type="text"
                    placeholder="Ex: Famille KASANDA"
                    value={funFamilleNom}
                    onChange={(e) => setFunFamilleNom(e.target.value)}
                    required
                    className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Téléphone Contact</label>
                  <input
                    type="text"
                    value={funFamilleTel}
                    onChange={(e) => setFunFamilleTel(e.target.value)}
                    required
                    className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Salon de veillée</label>
                  <select
                    value={funSalon}
                    onChange={(e) => setFunSalon(e.target.value)}
                    className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Grand Salon Cérémonial A">Grand Salon Cérémonial A (Dispo 18h-23h)</option>
                    <option value="Grand Salon Cérémonial B">Grand Salon Cérémonial B (Dispo toute la nuit)</option>
                    <option value="Salon Intimiste A">Salon Intimiste A (15 personnes)</option>
                    <option value="Salon Intimiste B">Salon Intimiste B (25 personnes)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Corbillard & Véhicule</label>
                  <select
                    value={funCorbillard}
                    onChange={(e) => setFunCorbillard(e.target.value)}
                    className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Corbillard Limousine Mercedes VIP #01">Corbillard Limousine Mercedes VIP #01</option>
                    <option value="Corbillard Limousine Lincoln #02">Corbillard Limousine Lincoln #02</option>
                    <option value="Corbillard Fourgon Deluxe #03">Corbillard Fourgon Deluxe #03</option>
                  </select>
                </div>
              </div>

              <div className="text-right pt-2">
                <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white shadow-lg">
                  ✓ Enregistrer la Réservation & Émettre le Devis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL 4 : FICHE DÉTAILLÉE DU DOSSIER UNIQUE NG-2026-XXXX               */}
      {/* ========================================================================= */}
      {dossierUniqueConsulte && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1A3E] border border-blue-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-sky-400">
                  DOSSIER UNIQUE DU DÉFUNT — TRAÇABILITÉ INTÉGRALE
                </span>
                <h3 className="text-lg font-bold text-white">
                  Fiche Défunt • {dossierUniqueConsulte.numeroDossier}
                </h3>
              </div>
              <button onClick={() => setDossierUniqueConsulte(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Volet Morgue */}
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900 space-y-2">
                <div className="font-bold text-sky-400 uppercase text-[11px] flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5" />
                  <span>Volet Morgue & Conservation</span>
                </div>
                <div><strong>Défunt :</strong> {dossierUniqueConsulte.defunt}</div>
                <div><strong>Emplacement :</strong> {dossierUniqueConsulte.chambreCasier}</div>
                <div><strong>Température sonde :</strong> {dossierUniqueConsulte.temperature}</div>
                <div><strong>Séjour cumulé :</strong> {dossierUniqueConsulte.sejourJours} jours</div>
              </div>

              {/* Volet Funérarium */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900 space-y-2">
                <div className="font-bold text-emerald-400 uppercase text-[11px] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>Volet Funérarium & Cérémonies</span>
                </div>
                <div><strong>Salon réservé :</strong> {dossierUniqueConsulte.salon}</div>
                <div><strong>Prestations :</strong> {dossierUniqueConsulte.prestations.join(', ')}</div>
                <div><strong>Famille :</strong> {dossierUniqueConsulte.famille}</div>
              </div>
            </div>

            {/* Volet Finance */}
            <div className="p-4 rounded-xl bg-[#061126] border border-slate-700 text-xs space-y-2">
              <div className="font-bold text-amber-400 uppercase text-[11px]">
                Volet Comptabilité & Caisse (Suivi strict USD & CDF séparés)
              </div>
              <div className="flex justify-between font-mono">
                <span>Total Facturé :</span>
                <strong className="text-white">${dossierUniqueConsulte.totalUSD} USD ({dossierUniqueConsulte.totalCDF.toLocaleString('fr-FR')} CDF)</strong>
              </div>
              <div className="flex justify-between font-mono">
                <span>Total Payé :</span>
                <strong className="text-emerald-400">${dossierUniqueConsulte.payeUSD} USD ({dossierUniqueConsulte.statutFinancier})</strong>
              </div>
            </div>

            <div className="text-right pt-2 border-t border-blue-950">
              <button
                onClick={() => setDossierUniqueConsulte(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold"
              >
                Fermer la fiche
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5 : Modification Soins */}
      {selectedSoinsDefunt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1A3E] border border-blue-900 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-white">Soins de thanatopraxie & Séjour</h3>
            <p className="text-xs text-slate-400">Défunt : {selectedSoinsDefunt.defuntNom} ({selectedSoinsDefunt.casier})</p>
            <textarea
              value={nouveauxSoins}
              onChange={(e) => setNouveauxSoins(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-[#061126] border border-slate-700 rounded-xl text-white text-xs"
            />
            <div className="flex justify-between pt-2">
              <button onClick={() => setSelectedSoinsDefunt(null)} className="px-4 py-1.5 border rounded-xl text-xs">Annuler</button>
              <button onClick={handleSauvegarderSoins} className="px-4 py-1.5 bg-blue-600 rounded-xl text-xs font-bold">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODALES OPÉRATIONNELLES DU PÔLE HÔPITAL                               */}
      {/* ========================================================================= */}

      {/* Modal Hôpital 1 : Nouvelle Admission Patient */}
      {isHopitalAdmissionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#1A102E] border border-purple-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-purple-950 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-purple-400">
                  ACCUEIL & ENREGISTREMENT CLINIQUE • HÔPITAL NOMARGUERI
                </span>
                <h3 className="text-lg font-bold text-white">
                  Nouvelle Admission Patient (Urgences & Hospitalisation)
                </h3>
              </div>
              <button onClick={() => setIsHopitalAdmissionModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleValiderAdmissionHopital} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Nom de famille *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TSHIBANDA"
                    value={hopNom}
                    onChange={(e) => setHopNom(e.target.value)}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Micheline"
                    value={hopPrenom}
                    onChange={(e) => setHopPrenom(e.target.value)}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Sexe *</label>
                  <select
                    value={hopSexe}
                    onChange={(e) => setHopSexe(e.target.value as any)}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white font-bold"
                  >
                    <option value="MASCULIN">Masculin</option>
                    <option value="FEMININ">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Âge (années) *</label>
                  <input
                    type="number"
                    min="0"
                    max="125"
                    value={hopAge}
                    onChange={(e) => setHopAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Téléphone de contact *</label>
                  <input
                    type="text"
                    required
                    value={hopTel}
                    onChange={(e) => setHopTel(e.target.value)}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Type d'Admission *</label>
                  <select
                    value={hopTypeAdmission}
                    onChange={(e) => setHopTypeAdmission(e.target.value as any)}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-purple-300 font-bold"
                  >
                    <option value="NOUVEAU_CAS">Nouveau Cas (Admission du Jour)</option>
                    <option value="ANCIEN_PATIENT">Ancien Patient (Hospitalisation / Réadmission)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Service de Prise en Charge *</label>
                  <select
                    value={hopService}
                    onChange={(e) => setHopService(e.target.value as any)}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white font-bold"
                  >
                    <option value="URGENCES">Urgences & Triage 24/7</option>
                    <option value="MEDECINE_INTERNE">Médecine Interne</option>
                    <option value="CHIRURGIE">Chirurgie & Bloc</option>
                    <option value="MATERNITE">Maternité & Gynécologie</option>
                    <option value="PEDIATRIE">Pédiatrie</option>
                    <option value="SOINS_INTENSIFS">Soins Intensifs & Réanimation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Lit / Chambre assignée</label>
                  <input
                    type="text"
                    value={hopChambreLit}
                    onChange={(e) => setHopChambreLit(e.target.value)}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Médecin Traitant Référent</label>
                  <input
                    type="text"
                    value={hopMedecin}
                    onChange={(e) => setHopMedecin(e.target.value)}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Caution / Acompte d'admission (USD)</label>
                  <input
                    type="number"
                    value={hopAvanceUSD}
                    onChange={(e) => setHopAvanceUSD(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Diagnostic Principal / Motif de Consultation *</label>
                <textarea
                  rows={2}
                  required
                  value={hopDiagnostic}
                  onChange={(e) => setHopDiagnostic(e.target.value)}
                  className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-purple-950">
                <button
                  type="button"
                  onClick={() => setIsHopitalAdmissionModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white shadow-lg text-xs"
                >
                  ✓ Valider l'Admission Médicale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hôpital 2 : Constat Décès Médical & Passerelle vers les 60 Box de la Morgue */}
      {isHopitalDecesModalOpen && selectedPatientDeces && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#200A15] border border-red-900 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-red-950 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-red-400">
                  PROCÉDURE MÉDICO-LÉGALE DE CONSTAT DE DÉCÈS
                </span>
                <h3 className="text-lg font-bold text-white">
                  Constat de Décès & Passerelle Vers les 60 Box de la Morgue
                </h3>
              </div>
              <button onClick={() => setIsHopitalDecesModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs space-y-1">
              <div><strong>Patient concerné :</strong> {selectedPatientDeces.patientNom} {selectedPatientDeces.patientPrenom}</div>
              <div><strong>Dossier hospitalier :</strong> <span className="font-mono">{selectedPatientDeces.numeroDossier}</span></div>
              <div><strong>Service actuel :</strong> {selectedPatientDeces.service} • {selectedPatientDeces.chambreLit}</div>
              <div><strong>Diagnostic :</strong> {selectedPatientDeces.diagnosticPrincipal}</div>
            </div>

            <form onSubmit={handleValiderDecesHopital} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Heure du Constat de Décès *</label>
                  <input
                    type="time"
                    required
                    value={decesHeure}
                    onChange={(e) => setDecesHeure(e.target.value)}
                    className="w-full p-2.5 bg-[#12040B] border border-red-900/80 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Médecin Légiste / Déclarant *</label>
                  <input
                    type="text"
                    required
                    value={decesMedecin}
                    onChange={(e) => setDecesMedecin(e.target.value)}
                    className="w-full p-2.5 bg-[#12040B] border border-red-900/80 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Affectation Emplacement Frigorifique (sur nos 60 Box Morgue) *
                </label>
                <select
                  value={decesBoxMorgue}
                  onChange={(e) => setDecesBoxMorgue(e.target.value)}
                  className="w-full p-2.5 bg-[#12040B] border border-red-900/80 rounded-xl text-sky-400 font-mono font-bold"
                >
                  <option value="Box #18 Morgue">Box #18 Morgue (Chambre F1 - Disponible)</option>
                  <option value="Box #02 Morgue">Box #02 Morgue (Chambre F1 - Disponible)</option>
                  <option value="Box #05 Morgue">Box #05 Morgue (Chambre F1 - Disponible)</option>
                  <option value="Box #09 Morgue">Box #09 Morgue (Chambre F1 - Disponible)</option>
                  <option value="Box #21 Morgue">Box #21 Morgue (Chambre F2 - Thanatopraxie)</option>
                  <option value="Box #27 Morgue">Box #27 Morgue (Chambre F2 - Thanatopraxie)</option>
                  <option value="Box #35 Morgue">Box #35 Morgue (Chambre F2 - Disponible)</option>
                  <option value="Box #42 Morgue">Box #42 Morgue (Chambre F3 - Longue durée)</option>
                  <option value="Box #50 Morgue">Box #50 Morgue (Chambre F3 - Disponible)</option>
                  <option value="Box #58 Morgue">Box #58 Morgue (Chambre F3 - Disponible)</option>
                  <option value="Box #60 Morgue">Box #60 Morgue (Chambre F3 - Disponible)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Capacité garantie : 60 box frigorifiques thermo-régulés (+2°C / +4°C).
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900 text-[11px] text-sky-200">
                ℹ️ <strong>Passerelle automatique :</strong> Le patient sera immédiatement transféré dans le registre de la morgue sous un dossier #NG-2026-XXXX avec conservation en continu et verrou de sortie activé jusqu'aux 4 visas légaux et financiers.
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-red-950">
                <button
                  type="button"
                  onClick={() => setIsHopitalDecesModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-600 rounded-xl font-bold text-white shadow-lg text-xs"
                >
                  ✓ Confirmer Constat & Transférer à la Morgue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hôpital 3 : Livraison Prestation / Acte Hospitalier */}
      {isHopitalActeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#1A102E] border border-purple-900 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-950 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-purple-400">
                  LIVRAISON DE PRESTATION MÉDICALE
                </span>
                <h3 className="text-lg font-bold text-white">
                  Délivrer Médicament, Examen ou Soin
                </h3>
              </div>
              <button onClick={() => setIsHopitalActeModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleValiderLivraisonActe} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">N° Dossier Patient Bénéficiaire *</label>
                <select
                  value={acteDossier}
                  onChange={(e) => setActeDossier(e.target.value)}
                  className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-purple-300 font-mono font-bold"
                >
                  {registreHopital.map((p) => (
                    <option key={p.id} value={p.numeroDossier}>
                      {p.numeroDossier} — {p.patientNom} {p.patientPrenom} ({p.service})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Département Technique Fournisseur *</label>
                <select
                  value={acteDepartement}
                  onChange={(e) => setActeDepartement(e.target.value as any)}
                  className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white font-bold"
                >
                  <option value="PHARMACIE">Pharmacie Centrale (Produits & Médicaments)</option>
                  <option value="LABORATOIRE">Laboratoire Biomédical (Analyses & Prélèvements)</option>
                  <option value="IMAGERIE">Imagerie Médicale & Radiologie / Échographie</option>
                  <option value="BLOC">Bloc Opératoire & Actes Chirurgicaux</option>
                  <option value="SOINS_INFIRMIERS">Soins Infirmiers & Pansements Hospitaliers</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Désignation de la Prestation / Produit *</label>
                <input
                  type="text"
                  required
                  value={acteDesignation}
                  onChange={(e) => setActeDesignation(e.target.value)}
                  className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Montant Facturé (USD) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={actePrixUSD}
                    onChange={(e) => setActePrixUSD(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {(actePrixUSD * 2800).toLocaleString('fr-FR')} CDF
                  </span>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Praticien Responsable *</label>
                  <input
                    type="text"
                    required
                    value={actePraticien}
                    onChange={(e) => setActePraticien(e.target.value)}
                    className="w-full p-2.5 bg-[#0E061B] border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-purple-950">
                <button
                  type="button"
                  onClick={() => setIsHopitalActeModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-slate-300 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white shadow-lg text-xs"
                >
                  ✓ Valider la Livraison du Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
