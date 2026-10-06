import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Plus,
  Search,
  Lock,
  UserCheck,
  Building,
  KeyRound,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useBackoffice, UserSession } from '../../context/BackofficeContext';
import { UTILISATEURS_MOCK } from '../../../../api/src/data/mock-db';

export const AccessPage: React.FC = () => {
  const { currentUser } = useBackoffice();
  const [loading, setLoading] = useState(true);
  const [utilisateurs, setUtilisateurs] = useState<UserSession[]>([]);
  const [recherche, setRecherche] = useState('');
  const [filtreDirection, setFiltreDirection] = useState<string>('TOUTES');

  // Modal création agent
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserSession['role']>('AGENT_RECEPTION');
  const [direction, setDirection] = useState<UserSession['directionRattachee']>('DIRECTION_MORGUE');
  const [telephone, setTelephone] = useState('+243');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const users: UserSession[] = UTILISATEURS_MOCK.map((u, i) => ({
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
      setUtilisateurs(users);
      setLoading(false);
    }, 250);
  }, []);

  const handleCreerAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const nouvelAgent: UserSession = {
      id: `usr-${Date.now()}`,
      nom: nom.toUpperCase(),
      prenom,
      email,
      role,
      niveauAccreditation: role === 'DIRECTION' ? 5 : role === 'RESPONSABLE_EXPLOITATION' ? 4 : 2,
      estActif: true,
      telephone,
      creeLe: new Date().toISOString(),
      actorId: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      directionRattachee: direction
    };

    setUtilisateurs([nouvelAgent, ...utilisateurs]);
    setIsModalOpen(false);
    setNom('');
    setPrenom('');
    setEmail('');
  };

  const usersFiltres = utilisateurs.filter((u) => {
    const matchDir = filtreDirection === 'TOUTES' || u.directionRattachee === filtreDirection;
    const matchTxt =
      u.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      u.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      u.email.toLowerCase().includes(recherche.toLowerCase()) ||
      u.role.toLowerCase().includes(recherche.toLowerCase());
    return matchDir && matchTxt;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-300">Chargement de l'annuaire RBAC & Organisation...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-blue-950">
        <div>
          <span className="text-xs text-sky-400 font-mono font-bold uppercase tracking-wider block">
            ADMINISTRATION SYSTÈME & SÉCURITÉ
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Gestion des Utilisateurs (RBAC) & Organisation
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Compte Agent</span>
        </button>
      </div>

      {/* Barre de Recherche et Filtres par Direction */}
      <div className="bg-[#050E22] border border-blue-950 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher agent, email, rôle..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#030914] border border-blue-950 rounded-xl text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Direction rattachée :</span>
          {['TOUTES', 'DIRECTION_MORGUE', 'DIRECTION_FUNERARIUM', 'CAISSE_CENTRALE', 'DIRECTION_GENERALE'].map((d) => (
            <button
              key={d}
              onClick={() => setFiltreDirection(d)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                filtreDirection === d ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {d.replace('DIRECTION_', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Table des Utilisateurs & Droits d'Accès */}
      <div className="bg-[#050E22] border border-blue-950 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#030914] text-slate-400 uppercase text-[10px] tracking-wider border-b border-blue-950">
              <tr>
                <th className="py-3 px-4">Agent / Nom Complet</th>
                <th className="py-3 px-4">E-mail Officiel</th>
                <th className="py-3 px-4">Rôle Métier (RBAC)</th>
                <th className="py-3 px-4">Direction Rattachée</th>
                <th className="py-3 px-4 text-center">Accréditation</th>
                <th className="py-3 px-4 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-950/60 text-slate-300">
              {usersFiltres.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">
                      {u.prenom} {u.nom}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{u.actorId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded bg-blue-950 text-sky-300 font-mono font-bold text-[10px] border border-blue-900 uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    {u.directionRattachee}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-sky-400">
                    Niveau {u.niveauAccreditation} / 5
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ACTIF
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création Agent */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071329] border border-blue-900 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <h3 className="font-bold text-base">Créer un nouveau compte Agent (RBAC)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreerAgent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Nom de famille</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">E-mail professionnel</label>
                <input
                  type="email"
                  placeholder="nom@nomargueri.cd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Rôle Système</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  >
                    <option value="AGENT_RECEPTION">Commercial / Conseiller</option>
                    <option value="COMPTABLE">Caissier / Guichet</option>
                    <option value="RESPONSABLE_EXPLOITATION">Responsable Exploitation</option>
                    <option value="DIRECTION">Direction Générale (DG)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Direction de Rattachement</label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  >
                    <option value="DIRECTION_MORGUE">Direction Morgue</option>
                    <option value="DIRECTION_FUNERARIUM">Direction Funérarium</option>
                    <option value="CAISSE_CENTRALE">Caisse Centrale</option>
                    <option value="DIRECTION_GENERALE">Direction Générale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Téléphone mobile</label>
                <input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                  className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Créer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
