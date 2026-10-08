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
  ArrowLeftRight
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
      salon: 'Grand Salon Cérémonial A',
      creneau: '08/10/2026 • 18h00 - 23h00',
      prestations: ['Cercueil Chêne Massif', 'Traiteur 50p', 'Mémorial Numérique Web', 'Chapiteau & Chaises VIP'],
      devisUSD: 1450,
      devisCDF: 4060000,
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
      salon: 'Salon Intimiste B',
      creneau: '07/10/2026 • 14h00 - 18h00',
      prestations: ['Corbillard Limousine VIP', 'Gerbe Florale Prestige', 'Livre d’Or cuir & Stylos'],
      devisUSD: 980,
      devisCDF: 2744000,
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
      salon: 'Grand Salon Cérémonial B',
      creneau: '09/10/2026 • 19h00 - 06h00',
      prestations: ['Conciergerie & Boissons chaudes', 'Veillée de prière', 'Sono & Chœur liturgique'],
      devisUSD: 1120,
      devisCDF: 3136000,
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
      salon: 'Salon Intimiste A',
      creneau: '10/10/2026 • 10h00 - 14h00',
      prestations: ['Plaque commémorative en marbre', 'Transfert depuis centre médical'],
      devisUSD: 650,
      devisCDF: 1820000,
      statutPaiement: 'SOLDE',
      statutCeremonie: 'CONFIRME',
      corbillardAssigné: 'Non assigné',
      avancementPreparation: 40
    }
  ]);

  // Sous-onglet de travail actif dans le dashboard
  const [activeTabMorgue, setActiveTabMorgue] = useState<'REGISTRE' | 'CONTROLES_SORTIE' | 'CHAMBRES'>('REGISTRE');
  const [activeTabFunerarium, setActiveTabFunerarium] = useState<'REGISTRE' | 'PLANNING_SALONS' | 'LOGISTIQUE'>('REGISTRE');

  // =========================================================================
  // 2. MODALES OPÉRATIONNELLES FONCTIONNELLES (SLIDES PPTX 4, 5, 6, 7)
  // =========================================================================

  // Modal 1 : Workflow d'Admission Morgue en 6 Étapes (Slide 4)
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

  // Modal 2 : Contrôle & Sortie du Corps (Slide 5)
  const [selectedSortieDossier, setSelectedSortieDossier] = useState<DefuntMorgue | null>(null);
  const [checkIdValid, setCheckIdValid] = useState(false);
  const [checkAyantDroitValid, setCheckAyantDroitValid] = useState(false);
  const [checkMedicoLegalValid, setCheckMedicoLegalValid] = useState(false);
  const [recepteurNom, setRecepteurNom] = useState('');
  const [destinationCimetiere, setDestinationCimetiere] = useState('Cimetière de la Nsele');

  // Modal 3 : Nouvelle Demande Funéraire (Slide 6 en 5 étapes)
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

  // Modal 4 : Consultation Dossier Unique NG-2026-XXXX (Slide 7)
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

  // Modal 5 : Soins & Séjour (Slide 5)
  const [selectedSoinsDefunt, setSelectedSoinsDefunt] = useState<DefuntMorgue | null>(null);
  const [nouveauxSoins, setNouveauxSoins] = useState('Thanatopraxie complète, habillage solennel et coiffure');

  // =========================================================================
  // 3. LOGIQUE D'EXÉCUTION DES WORKFLOWS (SLIDE 4, 5, 6, 7)
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

  // Exécution de la Sortie du Corps avec libération du casier (Slide 5)
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

  // Enregistrement nouvelle demande funéraire (Slide 6)
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
                    : 'bg-emerald-700 text-white'
                }`}
              >
                {currentPole === 'MORGUE' ? 'PARCOURS MORGUE (ÉTAPE 1 À 6)' : 'PARCOURS FUNÉRAIRE (ÉTAPE 1 À 9)'}
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                • Dossier Unique Partagé NG-2026-XXXX
              </span>
            </div>

            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentPole === 'MORGUE'
                ? 'Pôle Morgue — De l’admission du corps à sa sortie'
                : 'Pôle Funérarium — De la commande de prestations à la clôture'}
            </h1>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {currentPole === 'MORGUE'
                ? 'Pourquoi ce tableau de bord ? Garantir la conservation thermique ininterrompue (+2°C à +4°C), tracer les soins de thanatopraxie et interdire formellement toute levée du corps sans les 4 verrous stricts : identité certifiée, mandataire mandaté, visa médico-légal et solde financier complet.'
                : 'Pourquoi ce tableau de bord ? Coordonner les veillées, salons, convois corbillard et fournitures funéraires sans aucune ressaisie : les réservations et devis s’adossent directement sur le Dossier Unique déjà ouvert à la morgue, avec un suivi séparé USD et CDF.'}
            </p>
          </div>

          {/* Boutons d'Action Principaux */}
          <div className="flex items-center gap-2.5 shrink-0">
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
            ) : (
              <button
                onClick={() => {
                  setFunStep(1);
                  setIsFuneraireModalOpen(true);
                }}
                className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-700/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nouvelle Demande Funéraire (Slide 6)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INDICATEURS KPIS STRICTS DU STORYBOARD PPTX (SLIDE 9)                  */}
      {/* ========================================================================= */}
      {currentPole === 'MORGUE' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 : Défunts présents / sortis (Slide 9) */}
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

          {/* KPI 2 : Places disponibles & Taux d'occupation (Slide 9) */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Places Disponibles / Casiers
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                14 libres
              </span>
              <span className="text-xs text-slate-400 font-mono">sur 32 casiers</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-sky-400' : 'border-slate-100 text-sky-600'}`}>
              Taux d'occupation global : 56%
            </span>
          </div>

          {/* KPI 3 : Durée moyenne de séjour (Slide 9) */}
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

          {/* KPI 4 : Sorties prévues ce jour (Slide 9) */}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 Funéraire : Salons réservés (Slide 9) */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Salons de Veillée Réservés
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                6 salons
              </span>
              <span className="text-xs text-slate-400 font-mono">sur 8 disponibles</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-emerald-400' : 'border-slate-100 text-emerald-600'}`}>
              2 salons libres ce soir
            </span>
          </div>

          {/* KPI 2 Funéraire : Funérailles du jour (Slide 9) */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Funérailles du Jour
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                2 cérémonies
              </span>
              <span className="text-xs text-slate-400 font-mono">en cours</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              Grand Salon A (18h) & Intimiste B (14h)
            </span>
          </div>

          {/* KPI 3 Funéraire : Dossiers à préparer (Slide 9) */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Dossiers à Préparer
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                5 dossiers
              </span>
              <span className="text-xs text-slate-400 font-mono">en coordination</span>
            </div>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-sky-400' : 'border-slate-100 text-sky-600'}`}>
              Cercueils & fleuristerie commandés
            </span>
          </div>

          {/* KPI 4 Funéraire : Convois corbillard disponibles (Slide 9) */}
          <div
            className={`border rounded-2xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Convois Corbillard Planifiés
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
      {/* 3. SYNTHÈSE FINANCIÈRE & CAISSE ÉTANCHE USD & CDF (SLIDE 8 DU PPTX)        */}
      {/* ========================================================================= */}
      <div
        className={`border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              SLIDE 8 — RÈGLE STRICTE
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
              Vérification des 4 Verrous Légaux & Financiers avant Levée du Corps (Slide 5)
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

      {/* Vue Funérarium : Registre des Prestations & Cérémonies (Slide 6) */}
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
      {/* 6. MODAL 1 : WORKFLOW NOUVELLE ADMISSION MORGUE EN 6 ÉTAPES (SLIDE 4)     */}
      {/* ========================================================================= */}
      {isAdmissionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1A3E] border border-blue-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-blue-950 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-sky-400">
                  SLIDE 4 DU STORYBOARD PPTX — ADMISSION OFFICIELLE
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
                    2. Informations d'Arrivée & État du Corps (Slide 4)
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
                    3. Contact Famille / Ayant Droit Responsable (Slide 4)
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
                    4. Pièces Justificatives et Visas Légaux (Slide 4)
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
                    5. Sélection de la Chambre Froide et du Casier Disponible (Slide 4)
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
                    6. Confirmation et Génération du Dossier Unique NG-2026-XXXX (Slide 4)
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
      {/* 7. MODAL 2 : CONTRÔLE ET SORTIE DU CORPS (SLIDE 5 DU PPTX)                */}
      {/* ========================================================================= */}
      {selectedSortieDossier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1A3E] border border-blue-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                  SLIDE 5 DU STORYBOARD PPTX — SORTIE DU CORPS
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
                  <strong className="block">4. Situation Financière en Caisse (Règle Slide 8)</strong>
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
      {/* 8. MODAL 3 : NOUVELLE DEMANDE FUNÉRAIRE (SLIDE 6 DU PPTX EN 5 ÉTAPES)     */}
      {/* ========================================================================= */}
      {isFuneraireModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1A3E] border border-blue-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                  SLIDE 6 DU STORYBOARD PPTX — PARCOURS FUNÉRAIRE
                </span>
                <h3 className="text-lg font-bold text-white">
                  Nouvelle Réservation & Prestations Funéraires
                </h3>
              </div>
              <button onClick={() => setIsFuneraireModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleValiderDemandeFuneraire} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-950/40 border border-emerald-900 rounded-xl text-emerald-300">
                <strong>Règle Slide 6 :</strong> Retrouver le défunt existant via son n° NG-2026-XXXX ou créer les informations nécessaires. Zéro double saisie.
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
      {/* 9. MODAL 4 : FICHE DÉTAILLÉE DU DOSSIER UNIQUE NG-2026-XXXX (SLIDE 7)     */}
      {/* ========================================================================= */}
      {dossierUniqueConsulte && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0A1A3E] border border-blue-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-sky-400">
                  SLIDE 7 DU STORYBOARD PPTX — DOSSIER UNIQUE CENTRALISÉ
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

            {/* Volet Finance (Slide 8) */}
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
    </div>
  );
};
