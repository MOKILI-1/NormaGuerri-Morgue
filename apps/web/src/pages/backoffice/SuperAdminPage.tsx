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
  RefreshCw
} from 'lucide-react';
import { useBackoffice, UserSession, PoleMetier } from '../../context/BackofficeContext';
import { NiveauAccreditation } from '@nomarguerrie/shared-types';
import { UTILISATEURS_MOCK } from '../../../../api/src/data/mock-db';

interface OperationMultiPole {
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

interface FluxDossier {
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

export const SuperAdminPage: React.FC = () => {
  const { theme, currentPole } = useBackoffice();
  const isDark = theme === 'dark';

  // Onglet principal dans l'espace Super Admin : par défaut le Dashboard complet consolidé
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'RBAC' | 'OPERATIONS' | 'FLUX' | 'FINANCE'>('DASHBOARD');

  // Filtre d'affichage pôle pour la vue globale
  const [poleFilter, setPoleFilter] = useState<'TOUS' | 'MORGUE' | 'FUNERARIUM'>('TOUS');

  // =========================================================================
  // 1. GESTION DES ACCRÉDITATIONS & RBAC (Département & Niveau d'accréditation)
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

  // Modification directe des accès d'un agent par le Super Admin
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
      a.role.toLowerCase().includes(searchAgent.toLowerCase());
    return matchDir && matchSearch;
  });

  // =========================================================================
  // 2. DONNÉES CONSOLIDÉES CONFORMES AU STORYBOARD PPTX (SLIDES 4, 5, 6, 8, 9)
  // =========================================================================

  // Registre unifié multi-pôles avec badges de différenciation
  const registreUnifie = [
    {
      id: 'NMG-2026-002581',
      pole: 'MORGUE' as const,
      defunt: 'KASANDA TSHIYOYO Jean-Luc',
      familleContact: 'Famille KASANDA (Grâce)',
      detailsActivite: 'Admission Chambre F1 • Casier #04 (+2.8°C)',
      prestationOuSoin: 'Thanatopraxie & Grand Salon Cérémonial A',
      dateHeure: '06/10/2026 - 08:30',
      finances: 'Soldé 100% ($1 450 USD)',
      statut: 'En conservation continue',
      visaLegal: 'Validé (Permis #2026-81)'
    },
    {
      id: 'NMG-2026-002580',
      pole: 'MORGUE' as const,
      defunt: 'MUTOMBO KABEYA Patient',
      familleContact: 'Famille MUTOMBO (Patrick)',
      detailsActivite: 'Chambre F1 • Casier #12 (+3.1°C)',
      prestationOuSoin: 'Toilette rituelle & Corbillard Limousine VIP',
      dateHeure: '01/10/2026 - 14:15',
      finances: 'Soldé 100% ($980 USD)',
      statut: 'Levée autorisée (Sortie ce jour 16h)',
      visaLegal: 'Validé & Scellé'
    },
    {
      id: 'NMG-2026-002579',
      pole: 'FUNERARIUM' as const,
      defunt: 'TSHILOMBA MBIYA Thérèse',
      familleContact: 'Famille TSHILOMBA (Alain)',
      detailsActivite: 'Salon Intimiste C • Créneau 08/10/2026',
      prestationOuSoin: 'Chapiteau, Fleurs & Livre d’Or',
      dateHeure: '29/09/2026 - 19:40',
      finances: 'Acompte 60% (Reste $340 USD)',
      statut: 'En attente solde pour visa final',
      visaLegal: 'En cours de régularisation'
    },
    {
      id: 'NMG-2026-002578',
      pole: 'MORGUE' as const,
      defunt: 'LUMUMBA DIUMI André',
      familleContact: 'Famille LUMUMBA (Clarisse)',
      detailsActivite: 'Chambre F2 • Casier #15 (Séjour 15j - Alerte)',
      prestationOuSoin: 'Soins thanatopraxie complets',
      dateHeure: '22/09/2026 - 11:00',
      finances: 'Soldé 100%',
      statut: 'Prêt pour cérémonie funéraire',
      visaLegal: 'Validé'
    },
    {
      id: 'NMG-2026-002574',
      pole: 'FUNERARIUM' as const,
      defunt: 'BOMPIMO Henriette',
      familleContact: 'Famille BOMPIMO (Serge)',
      detailsActivite: 'Convoi corbillard vers Nécropole',
      prestationOuSoin: 'Cercueil Chêne noble & Cérémonie',
      dateHeure: '20/09/2026 - 16:00',
      finances: 'Soldé 100%',
      statut: 'Clôturé (Inhumation effectuée)',
      visaLegal: 'Archivé'
    }
  ];

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
      type: 'Thanatopraxie & Habillage',
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
      type: 'Alerte durée séjour > 15j',
      dossierId: 'NMG-2026-002578',
      defunt: 'LUMUMBA DIUMI André',
      agent: 'Système Automatique',
      horodatage: '07/10/2026 - 09:00',
      statut: 'ALERTE'
    },
    {
      id: 'OP-1044',
      pole: 'FUNERARIUM',
      type: 'Commande Gerbe Florale & Urne',
      dossierId: 'NMG-2026-002579',
      defunt: 'TSHILOMBA MBIYA Thérèse',
      agent: 'Clarisse LUMUMBA',
      horodatage: '06/10/2026 - 16:20',
      statut: 'VALIDE',
      montant: '780 000 CDF'
    }
  ];

  const fluxDossiers: FluxDossier[] = [
    {
      dossierId: 'NMG-2026-002581',
      defunt: 'KASANDA TSHIYOYO Jean-Luc',
      pole: 'MORGUE',
      dateEntree: '06/10/2026 - 08:30',
      statutSejour: 'En conservation (Casier #04)',
      dateSortiePrevue: '09/10/2026 - 10:00',
      finances: 'SOLDE',
      visaLegal: 'VALIDE'
    },
    {
      dossierId: 'NMG-2026-002580',
      defunt: 'MUTOMBO KABEYA Patient',
      pole: 'MORGUE',
      dateEntree: '01/10/2026 - 14:15',
      statutSejour: 'Levée autorisée (Départ 16h)',
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
      statutSejour: 'Salon Intimiste C',
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
      statutSejour: 'En conservation (Casier #15)',
      dateSortiePrevue: '10/10/2026 - 11:00',
      finances: 'SOLDE',
      visaLegal: 'VALIDE'
    },
    {
      dossierId: 'NMG-2026-002574',
      defunt: 'BOMPIMO Henriette',
      pole: 'FUNERARIUM',
      dateEntree: '20/09/2026 - 16:00',
      statutSejour: 'Sortie définitive effectuée',
      dateSortiePrevue: '05/10/2026 - 11:00',
      sortieEffective: '05/10/2026 - 11:20',
      finances: 'SOLDE',
      visaLegal: 'VALIDE'
    }
  ];

  const filteredRegistre = registreUnifie.filter((r) => {
    if (poleFilter === 'TOUS') return true;
    return r.pole === poleFilter;
  });

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE SUPER ADMIN AVEC STATUT DIRECTION & SÉLECTEUR DE FILTRE        */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Super Admin • Direction Générale
            </span>
            <span className="text-[10px] text-slate-400">Accès Universel & Supervision Transverse</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Tableau de Bord Stratégique & Supervision
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Vision unifiée des Pôles Morgue & Funérarium, attribution des accès RBAC et traçabilité inviolable des flux.
          </p>
        </div>

        {/* Filtres de secteur */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setPoleFilter('TOUS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              poleFilter === 'TOUS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vue Consolidée
          </button>
          <button
            onClick={() => setPoleFilter('MORGUE')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              poleFilter === 'MORGUE' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Morgue</span>
          </button>
          <button
            onClick={() => setPoleFilter('FUNERARIUM')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              poleFilter === 'FUNERARIUM' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Funérarium</span>
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
          <span>Dashboard Consolidé</span>
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
      {/* VUE 1 : DASHBOARD CONSOLIDÉ COMPLET AVEC BADGES DE DIFFÉRENCIATION         */}
      {/* ========================================================================= */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* SECTION KPIS CONSOLIDÉS (SLIDE 9 DU STORYBOARD FONCTIONNEL) */}
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
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800">
                    MORGUE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">18 présents</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  42 défunts sortis ce mois-ci
                </div>
              </div>
            )}

            {/* KPI 2 : MORGUE - Places disponibles & Taux occupation */}
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
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800">
                    MORGUE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">14 libres</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  56% d’occupation (18/32 casiers)
                </div>
              </div>
            )}

            {/* KPI 3 : FUNÉRARIUM - Salons réservés */}
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
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    FUNÉRAIRE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">6 réservés</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  75% d’occupation (sur 8 salons)
                </div>
              </div>
            )}

            {/* KPI 4 : FUNÉRARIUM - Funérailles du jour & Convois */}
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
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    FUNÉRAIRE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">2 cérémonies</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  4 convois corbillard planifiés
                </div>
              </div>
            )}

            {/* KPI 5 : MORGUE - Durée de séjour */}
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
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800">
                    MORGUE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">6,4 jours</div>
                <div className="text-xs text-amber-400 pt-1 border-t border-slate-800">
                  1 alerte de séjour (&gt; 15 jours)
                </div>
              </div>
            )}

            {/* KPI 6 : MORGUE - Sorties prévues aujourd'hui */}
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
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950 text-sky-300 border border-blue-800">
                    MORGUE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">3 départs</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  Visas médico-légaux & soldes vérifiés
                </div>
              </div>
            )}

            {/* KPI 7 : FUNÉRARIUM - Dossiers à préparer */}
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
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    FUNÉRAIRE
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">5 dossiers</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  Prestations à la carte en cours
                </div>
              </div>
            )}

            {/* KPI 8 : FINANCE - CA Global consolidé */}
            <div
              className={`border rounded-xl p-5 space-y-1 relative overflow-hidden transition-colors ${
                isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase text-slate-400">
                  Recettes Totales
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  FINANCE
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">$18 450 USD</div>
              <div className="text-xs text-sky-400 font-mono pt-1 border-t border-slate-800">
                & 51 660 000 CDF encaissés
              </div>
            </div>
          </div>

          {/* GRAPHIQUES ÉPURÉS CONSOLIDÉS (ACTIVITÉ & CAPACITÉ) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Graphique 1 : Flux d'Activité Hebdomadaire Comparatif */}
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
                    <span className="text-slate-300">Morgue (24)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                    <span className="text-slate-300">Funéraire (16)</span>
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
                          className="w-3 sm:w-4 rounded-t bg-blue-500 hover:bg-blue-400 transition-all"
                          title={`Morgue : ${col.morgue}`}
                        />
                        <div
                          style={{ height: col.hF }}
                          className="w-3 sm:w-4 rounded-t bg-emerald-500 hover:bg-emerald-400 transition-all"
                          title={`Funéraire : ${col.funer}`}
                        />
                      </div>
                      <span className="text-[10px] font-mono mt-2 text-slate-400 block">{col.jour}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                  <span>Pic hebdomadaire : Vendredi (11 mouvements)</span>
                  <span>Traçabilité centrale : 100% informatisée</span>
                </div>
              </div>
            </div>

            {/* Graphique 2 : Taux d'Occupation Comparatif */}
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
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Casiers Morgue (32 places)
                    </span>
                    <span className="font-mono text-sky-400 font-bold">56% (18/32)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '56%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">14 casiers frigorifiques immédiatement disponibles</span>
                </div>

                {/* Jauge Funérarium */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Salons de Veillée (8 salons)
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">75% (6/8)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">2 salons disponibles pour nouvelles réservations</span>
                </div>

                {/* Synthèse Trésorerie */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Caisse Physique Ouverte :</span>
                    <strong className="text-white font-mono">$1 450 USD + 3 850 000 CDF</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Créances restantes :</span>
                    <span className="text-amber-400 font-mono">$340 USD (4 dossiers)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLEAU UNIFIÉ DU REGISTRE DES DÉPOUILLES & CÉRÉMONIES AVEC BADGES */}
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
                  Visualisation transversale avec badge de pôle, contrôle des visas médico-légaux et quittances financières.
                </p>
              </div>
              <span className="text-xs text-slate-400">
                {filteredRegistre.length} dossiers affichés
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
                    <th className="py-3 px-4">N° Dossier</th>
                    <th className="py-3 px-4">Défunt & Famille</th>
                    <th className="py-3 px-4">Localisation & Séjour</th>
                    <th className="py-3 px-4">Prestation / Soin</th>
                    <th className="py-3 px-4">Finances</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-center">Visa Légal</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {filteredRegistre.map((item) => (
                    <tr
                      key={item.id}
                      className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                            item.pole === 'MORGUE'
                              ? 'bg-blue-950 text-sky-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {item.pole}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{item.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{item.defunt}</span>
                        <span className="text-[10px] text-slate-400">{item.familleContact}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{item.detailsActivite}</td>
                      <td className="py-3.5 px-4 text-slate-200">{item.prestationOuSoin}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            item.finances.includes('100%')
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {item.finances}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{item.statut}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.visaLegal.includes('Validé')
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
      {/* VUE 2 : ACCRÉDITATIONS & ATTRIBUTION DES ACCÈS PAR AGENT (RBAC)            */}
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
                placeholder="Rechercher agent, email, rôle..."
                value={searchAgent}
                onChange={(e) => setSearchAgent(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  isDark
                    ? 'bg-[#0B132B] border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
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
      {/* VUE 3 : ENTRÉES & SORTIES DES DOSSIERS (TRAÇABILITÉ HOSPITALIÈRE)          */}
      {/* ========================================================================= */}
      {activeTab === 'FLUX' && (
        <div className="space-y-4">
          <div
            className={`border rounded-2xl overflow-hidden shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Traçabilité Inviolable des Admissions & Sorties de Corps
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Vérification médico-légale obligatoire, libération automatique du casier et quittance financière.
              </p>
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
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {fluxDossiers.map((flux) => (
                    <tr
                      key={flux.dossierId}
                      className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                            flux.pole === 'MORGUE'
                              ? 'bg-blue-950 text-sky-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 4 : SUPERVISION DES OPÉRATIONS MULTI-PÔLES                             */}
      {/* ========================================================================= */}
      {activeTab === 'OPERATIONS' && (
        <div className="space-y-4">
          <div
            className={`border rounded-2xl overflow-hidden shadow-sm ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Journal des Opérations Hospitalières & Funéraires
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Chaque mouvement physique ou réservation est historisé et horodaté.
              </p>
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
                  {operationsMultiPole.map((op) => (
                    <tr
                      key={op.id}
                      className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                            op.pole === 'MORGUE'
                              ? 'bg-blue-950 text-sky-300 border border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
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
      {/* VUE 5 : FINANCES CONSOLIDÉES & TRÉSORERIE (SLIDE 8 DU STORYBOARD)          */}
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
              <span className="text-[10px] text-slate-500 block mt-2 pt-2 border-t border-slate-800">
                Pôle Morgue (62%) • Pôle Funérarium (38%)
              </span>
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
                4 factures avec solde restant (bloquant sortie)
              </span>
            </div>
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
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400">✕</button>
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
                  <label className="block text-slate-300 mb-1">Département d'Affectation</label>
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
                  <label className="block text-slate-300 mb-1">Niveau d'Accréditation</label>
                  <select
                    value={newNiveau}
                    onChange={(e) => setNewNiveau(parseInt(e.target.value, 10) as NiveauAccreditation)}
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Enregistrer l'agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
