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
  KeyRound
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
  const { theme } = useBackoffice();
  const isDark = theme === 'dark';

  // Onglet principal dans l'espace Super Admin
  const [activeTab, setActiveTab] = useState<'RBAC' | 'OPERATIONS' | 'FLUX' | 'FINANCE'>('RBAC');

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
  // 2. SUPERVISION DES OPÉRATIONS MULTI-PÔLES (Filtre Morgue / Funérarium)
  // =========================================================================
  const [filterPoleOp, setFilterPoleOp] = useState<'TOUS' | 'MORGUE' | 'FUNERARIUM'>('TOUS');

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
      type: 'Réservation Salon Cérémonial A',
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
      type: 'Toilette & Thanatopraxie validée',
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
    },
    {
      id: 'OP-1043',
      pole: 'MORGUE',
      type: 'Autorisation de Sortie & Visa',
      dossierId: 'NMG-2026-002580',
      defunt: 'MUTOMBO KABEYA Patient',
      agent: 'Dr Aimé KASANDA',
      horodatage: '06/10/2026 - 15:00',
      statut: 'VALIDE'
    }
  ];

  const filteredOperations = operationsMultiPole.filter((op) => {
    if (filterPoleOp === 'TOUS') return true;
    return op.pole === filterPoleOp;
  });

  // =========================================================================
  // 3. ENTRÉES & SORTIES DES DOSSIERS (Traçabilité hospitalière)
  // =========================================================================
  const [filterFlux, setFilterFlux] = useState<'TOUS' | 'PRESENTS' | 'SORTIES_JOUR' | 'SORTIS'>('TOUS');

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
      statutSejour: 'Levée en cours',
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

  const filteredFlux = fluxDossiers.filter((f) => {
    if (filterFlux === 'PRESENTS') return !f.sortieEffective;
    if (filterFlux === 'SORTIES_JOUR') return f.dateSortiePrevue.includes('07/10/2026');
    if (filterFlux === 'SORTIS') return !!f.sortieEffective;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE SUPER ADMIN                                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Super Admin • Direction Générale
            </span>
            <span className="text-[10px] text-slate-400">Accès Universel & Supervision</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Cockpit de Supervision & Contrôle Global
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestion des accréditations RBAC, traçabilité des opérations multi-pôles et flux des dossiers.
          </p>
        </div>

        {/* Bouton d'action contextuelle */}
        {activeTab === 'RBAC' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Agent</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. ONGLETS DE NAVIGATION DU SUPER ADMIN                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
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
          <span>Finances Consolidées</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : ACCRÉDITATIONS & ATTRIBUTION DES ACCÈS PAR AGENT                   */}
      {/* ========================================================================= */}
      {activeTab === 'RBAC' && (
        <div className="space-y-4">
          {/* Barre de filtre et recherche */}
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

          {/* Tableau d'attribution des accès avec sélecteurs en direct */}
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
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {agent.email}
                      </td>
                      <td className="py-3 px-4">
                        {/* Sélecteur de direction par le Super Admin */}
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
                        {/* Sélecteur de niveau par le Super Admin */}
                        <select
                          value={agent.niveauAccreditation}
                          onChange={(e) => handleUpdateNiveau(agent.id, parseInt(e.target.value, 10) as NiveauAccreditation)}
                          className={`text-xs p-1.5 rounded-lg border font-semibold ${
                            isDark
                              ? 'bg-[#0B132B] border-slate-700 text-sky-400'
                              : 'bg-white border-slate-300 text-blue-700'
                          }`}
                        >
                          <option value={1}>Niveau 1 — Consultation simple</option>
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
      {/* VUE 2 : SUPERVISION DES OPÉRATIONS MULTI-PÔLES AVEC FILTRE MORGUE / FUNÉRARIUM */}
      {/* ========================================================================= */}
      {activeTab === 'OPERATIONS' && (
        <div className="space-y-4">
          {/* Filtre Pôle avec badges */}
          <div
            className={`border rounded-2xl p-4 flex items-center justify-between gap-4 text-xs ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-white">Filtrer par pôle opérationnel :</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterPoleOp('TOUS')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  filterPoleOp === 'TOUS'
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous les Pôles ({operationsMultiPole.length})
              </button>
              <button
                onClick={() => setFilterPoleOp('MORGUE')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                  filterPoleOp === 'MORGUE'
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'bg-slate-800 text-blue-400 hover:text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Pôle Morgue ({operationsMultiPole.filter((o) => o.pole === 'MORGUE').length})</span>
              </button>
              <button
                onClick={() => setFilterPoleOp('FUNERARIUM')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                  filterPoleOp === 'FUNERARIUM'
                    ? 'bg-emerald-600 text-white'
                    : isDark
                    ? 'bg-slate-800 text-emerald-400 hover:text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Pôle Funérarium ({operationsMultiPole.filter((o) => o.pole === 'FUNERARIUM').length})</span>
              </button>
            </div>
          </div>

          {/* Tableau des opérations */}
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
      {/* VUE 3 : ENTRÉES & SORTIES DES DOSSIERS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'FLUX' && (
        <div className="space-y-4">
          {/* Filtres de flux */}
          <div
            className={`border rounded-2xl p-4 flex items-center justify-between gap-4 text-xs ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-white">Traçabilité des admissions et sorties :</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterFlux('TOUS')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  filterFlux === 'TOUS' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tous les Dossiers ({fluxDossiers.length})
              </button>
              <button
                onClick={() => setFilterFlux('PRESENTS')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  filterFlux === 'PRESENTS' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                En Séjour Actif
              </button>
              <button
                onClick={() => setFilterFlux('SORTIES_JOUR')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  filterFlux === 'SORTIES_JOUR' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Sorties ce Jour (1)
              </button>
              <button
                onClick={() => setFilterFlux('SORTIS')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                  filterFlux === 'SORTIS' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Sorties Clôturées
              </button>
            </div>
          </div>

          {/* Tableau de traçabilité Entrées/Sorties */}
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
                  {filteredFlux.map((flux) => (
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
      {/* VUE 4 : SYNTHÈSE FINANCIÈRE CONSOLIDÉE                                    */}
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
                Encaissements Liquides (Caisse Centrale)
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
                Bloquant la délivrance des visas de sortie
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
