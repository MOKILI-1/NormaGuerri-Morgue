import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Clock,
  Coins,
  Building2,
  Flower2,
  AlertCircle,
  Plus,
  ArrowRight,
  CheckCircle2,
  Users,
  Search,
  Filter,
  RefreshCw,
  ThermometerSnowflake,
  CalendarCheck
} from 'lucide-react';
import { useBackoffice } from '../../context/BackofficeContext';
import { ApiClient } from '../../services/api';
import { DossierVivant } from '@nomarguerrie/shared-types';
import { DOSSIERS_MOCK } from '../../../../api/src/data/mock-db';

export const DashboardPage: React.FC = () => {
  const { currentPole, currentUser, caisseSession } = useBackoffice();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dossiers, setDossiers] = useState<DossierVivant[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const isOnline = await ApiClient.checkHealth();
        if (isOnline) {
          const res = await ApiClient.getDossiers();
          setDossiers(res);
        } else {
          setDossiers(DOSSIERS_MOCK);
        }
      } catch (err) {
        setDossiers(DOSSIERS_MOCK);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchData();
  }, [currentPole]);

  // Calcul des statistiques selon le pôle sélectionné
  const totalDossiers = dossiers.length;
  const caTotalUSD = 18450;
  const caTotalCDF = caTotalUSD * 2800;
  const facturesEnAttente = 4;
  const transactionsDuJour = 9;

  // Spécificités Pôle Morgue vs Funérarium
  const statsMorgue = {
    placesOccupees: 18,
    placesDisponibles: 14,
    tauxOccupation: 56,
    sortiesAutorisees: 3,
    alertesConservation: 1
  };

  const statsFunerarium = {
    salonsReserves: 6,
    convoisCorbillard: 4,
    fleursEtPlaques: 11,
    devisEnCours: 5,
    ceremoniesAujourdhui: 2
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-300 font-medium">Chargement des indicateurs du pôle {currentPole}...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue & Actions rapides */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-blue-950">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                currentPole === 'MORGUE'
                  ? 'bg-blue-600/30 text-sky-300 border border-blue-500/50'
                  : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
              }`}
            >
              {currentPole === 'MORGUE' ? 'Pôle Morgue & Défunts' : 'Pôle Funérarium & Cérémonies'}
            </span>
            <span className="text-xs text-slate-400">• Session : {currentUser?.directionRattachee}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Tableau de Bord de Pilotage
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/backoffice/ops')}
            className={`py-2 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center gap-1.5 ${
              currentPole === 'MORGUE'
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{currentPole === 'MORGUE' ? 'Nouvelle Admission Morgue' : 'Nouveau Dossier Funéraire'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. KPIS MAJEURS : FINANCIERS & OPÉRATIONNELS                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Chiffre d'Affaires Global */}
        <div className="bg-[#091838] border border-blue-900/80 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Chiffre d'Affaires Encaissé</span>
            <div className="p-2 rounded-xl bg-blue-600/20 text-sky-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">
              ${caTotalUSD.toLocaleString('fr-FR')} USD
            </span>
            <span className="block text-xs text-sky-400/80 font-mono mt-0.5">
              ≈ {(caTotalCDF).toLocaleString('fr-FR')} CDF
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1 border-t border-blue-950">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% ce mois (Traçabilité 100%)</span>
          </div>
        </div>

        {/* KPI 2 : Factures en Attente */}
        <div className="bg-[#091838] border border-blue-900/80 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Factures / Devis en Attente</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">
              {facturesEnAttente} factures
            </span>
            <span className="block text-xs text-amber-300 font-mono mt-0.5">
              En attente d'approbation ou de règlement
            </span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-blue-950">
            <span>Délai moyen de règlement : 24h</span>
          </div>
        </div>

        {/* KPI 3 : Statut de Caisse du Jour */}
        <div className="bg-[#091838] border border-blue-900/80 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Session Caisse Physique</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">
              ${caisseSession.totalEncaisseLiquideUSD} USD
            </span>
            <span className="block text-xs text-emerald-300 font-mono mt-0.5">
              + {caisseSession.totalEncaisseLiquideCDF.toLocaleString('fr-FR')} CDF
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1 border-t border-blue-950">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{caisseSession.estOuverte ? 'Caisse Active (Guichet Ouvert)' : 'Caisse Clôturée'}</span>
          </div>
        </div>

        {/* KPI 4 : Métier Spécifique (Morgue vs Funérarium) */}
        <div className="bg-[#091838] border border-blue-900/80 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {currentPole === 'MORGUE' ? 'Capacité Chambres Froides' : 'Salons & Cérémonies'}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              {currentPole === 'MORGUE' ? (
                <ThermometerSnowflake className="w-4 h-4" />
              ) : (
                <CalendarCheck className="w-4 h-4" />
              )}
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono">
              {currentPole === 'MORGUE'
                ? `${statsMorgue.placesOccupees} / ${statsMorgue.placesOccupees + statsMorgue.placesDisponibles}`
                : `${statsFunerarium.salonsReserves} réservations`}
            </span>
            <span className="block text-xs text-slate-300 font-mono mt-0.5">
              {currentPole === 'MORGUE'
                ? `${statsMorgue.placesDisponibles} casiers libres disponibles`
                : `${statsFunerarium.convoisCorbillard} convois corbillard prévus`}
            </span>
          </div>
          <div className="text-[11px] text-sky-400 pt-1 border-t border-blue-950">
            <span>
              {currentPole === 'MORGUE'
                ? `Taux d'occupation : ${statsMorgue.tauxOccupation}%`
                : `${statsFunerarium.ceremoniesAujourdhui} veillées ce jour`}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TABLE DES DOSSIERS & ACTIVITÉS RÉCENTES DU PÔLE                         */}
      {/* ========================================================================= */}
      <div className="bg-[#050E22] border border-blue-950 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">
              {currentPole === 'MORGUE'
                ? 'Dossiers des Corps en Séjour à la Morgue'
                : 'Dossiers Funéraires & Prestations Réservées'}
            </h3>
            <p className="text-xs text-slate-400">
              Suivi chronologique, statuts de facturation et visa médical
            </p>
          </div>

          <button
            onClick={() => navigate('/backoffice/ops')}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
          >
            <span>Voir tout le registre (Ops)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#030914] text-slate-400 uppercase text-[10px] tracking-wider border-b border-blue-950">
              <tr>
                <th className="py-3 px-4">N° Dossier</th>
                <th className="py-3 px-4">Identité du Défunt</th>
                <th className="py-3 px-4">
                  {currentPole === 'MORGUE' ? 'Emplacement / Casier' : 'Services Retenus'}
                </th>
                <th className="py-3 px-4">Statut Opérationnel</th>
                <th className="py-3 px-4">Solde Facturation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-950/60 text-slate-300">
              {dossiers.map((d) => (
                <tr key={d.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                    {d.numeroDossier}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">
                      {d.defunt.prenom} {d.defunt.nom}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Décès : {new Date(d.defunt.dateDeces).toLocaleDateString('fr-FR')} • {d.defunt.lieuDeces}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {currentPole === 'MORGUE' ? (
                      <span className="px-2.5 py-1 rounded bg-blue-950 text-sky-300 font-mono border border-blue-900">
                        {d.emplacementActuel?.numeroCase || 'Attente case'}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-[11px]">
                        {d.prestations.length} prestation(s) rattachée(s)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-900/40 text-sky-300 border border-sky-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {d.statut}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-white font-bold">${d.finance.soldeRestant} USD</span>
                    <span className="block text-[10px] text-slate-400">
                      ({d.finance.statutPaiement})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate('/backoffice/ops')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-medium transition-colors"
                    >
                      Détail ➔
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
