import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackoffice } from '../../context/BackofficeContext';
import { ApiClient } from '../../services/api';
import { DossierVivant } from '@nomarguerrie/shared-types';
import { DOSSIERS_MOCK } from '../../../../api/src/data/mock-db';

export const DashboardPage: React.FC = () => {
  const { currentPole, currentUser, caisseSession } = useBackoffice();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dossiers, setDossiers] = useState<DossierVivant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const isOnline = await ApiClient.checkHealth();
        if (isOnline) {
          const res = await ApiClient.getDossiers();
          setDossiers(res);
        } else {
          setDossiers(DOSSIERS_MOCK);
        }
      } catch {
        setDossiers(DOSSIERS_MOCK);
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    };

    fetchData();
  }, [currentPole]);

  // Données représentatives de la Morgue
  const registreMorgue = [
    {
      id: 'NMG-2026-002581',
      defunt: 'KASANDA TSHIYOYO Jean-Luc',
      dateAdmission: '06/10/2026 - 08:30',
      casier: 'Chambre F1 • Casier #04',
      temperature: '+2.8°C',
      soins: 'Thanatopraxie & Habillage',
      statut: 'En conservation'
    },
    {
      id: 'NMG-2026-002580',
      defunt: 'MUTOMBO KABEYA Patient',
      dateAdmission: '05/10/2026 - 14:15',
      casier: 'Chambre F1 • Casier #12',
      temperature: '+3.1°C',
      soins: 'Toilette rituelle effectuée',
      statut: 'Levée autorisée'
    },
    {
      id: 'NMG-2026-002579',
      defunt: 'TSHILOMBA MBIYA Thérèse',
      dateAdmission: '04/10/2026 - 19:40',
      casier: 'Chambre F2 • Casier #08',
      temperature: '+2.9°C',
      soins: 'Toilette & Maquillage',
      statut: 'En conservation'
    },
    {
      id: 'NMG-2026-002578',
      defunt: 'LUMUMBA DIUMI André',
      dateAdmission: '02/10/2026 - 11:00',
      casier: 'Chambre F2 • Casier #15',
      temperature: '+3.0°C',
      soins: 'Soins de thanatopraxie',
      statut: 'Prêt pour cérémonie'
    }
  ];

  // Données représentatives du Funérarium
  const registreFunerarium = [
    {
      id: 'NMG-2026-002581',
      famille: 'Famille KASANDA (Grâce)',
      defunt: 'KASANDA TSHIYOYO Jean-Luc',
      salon: 'Grand Salon Cérémonial A',
      creneau: '08/10/2026 • 18h00 - 23h00',
      prestations: 'Traiteur 50 pers. + Mémorial',
      statut: 'Confirmé'
    },
    {
      id: 'NMG-2026-002580',
      famille: 'Famille MUTOMBO (Patrick)',
      defunt: 'MUTOMBO KABEYA Patient',
      salon: 'Salon Intimiste B',
      creneau: '07/10/2026 • 14h00 - 18h00',
      prestations: 'Corbillard VIP + Gerbe florale',
      statut: 'En cours'
    },
    {
      id: 'NMG-2026-002579',
      famille: 'Famille TSHILOMBA (Alain)',
      defunt: 'TSHILOMBA MBIYA Thérèse',
      salon: 'Grand Salon Cérémonial B',
      creneau: '09/10/2026 • 19h00 - 06h00',
      prestations: 'Conciergerie + Livre d’or',
      statut: 'Planifié'
    },
    {
      id: 'NMG-2026-002578',
      famille: 'Famille LUMUMBA (Marc)',
      defunt: 'LUMUMBA DIUMI André',
      salon: 'Salon Intimiste A',
      creneau: '10/10/2026 • 10h00 - 14h00',
      prestations: 'Plaque marbre + Transport morgue ext.',
      statut: 'En préparation'
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <span className="text-xs text-slate-400">Chargement des données du pôle {currentPole}...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE ÉPURÉ DE LA VUE D'ENSEMBLE                                      */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                currentPole === 'MORGUE'
                  ? 'bg-blue-950/80 text-blue-300 border border-blue-900/60'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-900/60'
              }`}
            >
              {currentPole === 'MORGUE' ? 'PÔLE MORGUE' : 'PÔLE FUNÉRARIUM'}
            </span>
            <span className="text-xs text-slate-400">
              • Unité opérationnelle active
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Tableau de Bord — {currentPole === 'MORGUE' ? 'Morgue & Conservation' : 'Funérarium & Familles'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentPole === 'MORGUE'
              ? 'Surveillance des admissions, chambres froides, mouvements et levées de corps'
              : 'Gestion des salons de recueillement, veillées, prestations et logistique funéraire'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/backoffice/ops')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold text-white transition-colors ${
              currentPole === 'MORGUE'
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-emerald-700 hover:bg-emerald-600'
            }`}
          >
            {currentPole === 'MORGUE' ? '+ Nouvelle admission' : '+ Nouveau dossier'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CARTES KPIS MÉTIERS SPÉCIFIQUES AU PÔLE CHOISI (ÉPURÉES SANS ICÔNES)  */}
      {/* ========================================================================= */}
      {currentPole === 'MORGUE' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Admissions Actives
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white block">
              18 corps
            </span>
            <span className="text-xs text-slate-400 block pt-1 border-t border-slate-800/80">
              Prise en charge continue
            </span>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Occupation Casiers
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white block">
              56%
            </span>
            <span className="text-xs text-slate-400 block pt-1 border-t border-slate-800/80">
              14 casiers libres sur 32
            </span>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Soins & Thanatopraxie
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white block">
              4 soins
            </span>
            <span className="text-xs text-slate-400 block pt-1 border-t border-slate-800/80">
              Programmés ce jour
            </span>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Levées Autorisées
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white block">
              3 départs
            </span>
            <span className="text-xs text-slate-400 block pt-1 border-t border-slate-800/80">
              Conformes aux autorisations
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Salons Réservés
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white block">
              6 salons
            </span>
            <span className="text-xs text-slate-400 block pt-1 border-t border-slate-800/80">
              Sur 8 salons disponibles
            </span>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Veillées & Cérémonies
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white block">
              2 veillées
            </span>
            <span className="text-xs text-slate-400 block pt-1 border-t border-slate-800/80">
              Prévues ce soir
            </span>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Transports Corbillard
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white block">
              4 convois
            </span>
            <span className="text-xs text-slate-400 block pt-1 border-t border-slate-800/80">
              En cours de planification
            </span>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Articles & Fleurs
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white block">
              11 commandes
            </span>
            <span className="text-xs text-slate-400 block pt-1 border-t border-slate-800/80">
              Fleurs, cercueils & plaques
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BANDEAU DE GESTION FINANCIÈRE & CAISSE CENTRALE                         */}
      {/* ========================================================================= */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Synthèse Financière & Caisse Partagée
          </span>
          <div className="flex flex-wrap items-baseline gap-3 mt-1">
            <span className="text-lg sm:text-xl font-bold text-white font-mono">
              $18 450 USD
            </span>
            <span className="text-xs text-slate-400 font-mono">
              (≈ 51 660 000 CDF)
            </span>
            <span className="text-xs text-slate-400">• 4 factures en attente</span>
          </div>
        </div>

        <div className="text-xs text-slate-300 flex items-center gap-3">
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Guichet Caisse : </span>
            <span className="font-semibold text-white">${caisseSession.totalEncaisseLiquideUSD} USD</span>
            <span className="text-slate-400 font-mono text-[11px] ml-1">
              + {caisseSession.totalEncaisseLiquideCDF.toLocaleString('fr-FR')} CDF
            </span>
          </div>
          <button
            onClick={() => navigate('/backoffice/payments')}
            className="text-xs text-slate-300 hover:text-white underline hover:no-underline"
          >
            Gérer la caisse ➔
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. REGISTRE OPÉRATIONNEL SELON LE PÔLE                                    */}
      {/* ========================================================================= */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {currentPole === 'MORGUE'
                ? 'Registre Actif des Admissions & Chambres Froides'
                : 'Registre des Réservations & Cérémonies Funéraires'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentPole === 'MORGUE'
                ? 'Dossiers actuellement pris en charge dans les unités frigorifiques'
                : 'Salons de recueillement et prestations planifiées'}
            </p>
          </div>

          <button
            onClick={() => navigate('/backoffice/ops')}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            Voir tous les dossiers
          </button>
        </div>

        {currentPole === 'MORGUE' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B132B] text-slate-400 font-medium border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">N° Dossier</th>
                  <th className="py-3 px-4">Défunt</th>
                  <th className="py-3 px-4">Date Admission</th>
                  <th className="py-3 px-4">Emplacement</th>
                  <th className="py-3 px-4">Soins Réalisés</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {registreMorgue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-200">
                      {item.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {item.defunt}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {item.dateAdmission}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-200 font-medium">{item.casier}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{item.temperature}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {item.soins}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-200 border border-slate-700">
                        {item.statut}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate('/backoffice/ops')}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Consulter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B132B] text-slate-400 font-medium border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">N° Dossier</th>
                  <th className="py-3 px-4">Défunt & Famille</th>
                  <th className="py-3 px-4">Salon Funéraire</th>
                  <th className="py-3 px-4">Date & Créneau</th>
                  <th className="py-3 px-4">Prestations Liées</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {registreFunerarium.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-200">
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-white block">{item.defunt}</span>
                      <span className="text-[11px] text-slate-400 block">{item.famille}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {item.salon}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {item.creneau}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {item.prestations}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-200 border border-slate-700">
                        {item.statut}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate('/backoffice/ops')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Consulter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
