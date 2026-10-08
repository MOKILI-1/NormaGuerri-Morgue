import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackoffice } from '../../context/BackofficeContext';
import { ApiClient } from '../../services/api';
import { DossierVivant } from '@nomarguerrie/shared-types';
import { DOSSIERS_MOCK } from '../../data/mock-db';

export const DashboardPage: React.FC = () => {
  const { currentPole, currentUser, caisseSession, theme } = useBackoffice();
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

  const isDark = theme === 'dark';

  // Registre opérationnel Morgue (Slide 4, 5, 9 du Storyboard PPTX)
  const registreMorgue = [
    {
      id: 'NMG-2026-002581',
      defunt: 'KASANDA TSHIYOYO Jean-Luc',
      statutIdentification: 'Identifié officiel',
      provenance: 'Clinique Ngaliema',
      dateAdmission: '06/10/2026 - 08:30',
      dureeSejour: '1 jour',
      emplacement: 'Chambre F1 • Casier #04',
      temperature: '+2.8°C',
      soins: 'Thanatopraxie & Habillage',
      situationFinanciere: 'Soldé 100%',
      statutSortie: 'En conservation continue'
    },
    {
      id: 'NMG-2026-002580',
      defunt: 'MUTOMBO KABEYA Patient',
      statutIdentification: 'Identifié officiel',
      provenance: 'Hôpital de Référence',
      dateAdmission: '01/10/2026 - 14:15',
      dureeSejour: '6 jours',
      emplacement: 'Chambre F1 • Casier #12',
      temperature: '+3.1°C',
      soins: 'Toilette rituelle effectuée',
      situationFinanciere: 'Soldé 100%',
      statutSortie: 'Levée autorisée (Départ 16h)'
    },
    {
      id: 'NMG-2026-002579',
      defunt: 'TSHILOMBA MBIYA Thérèse',
      statutIdentification: 'Identifié officiel',
      provenance: 'Domicile familial',
      dateAdmission: '29/09/2026 - 19:40',
      dureeSejour: '8 jours',
      emplacement: 'Chambre F2 • Casier #08',
      temperature: '+2.9°C',
      soins: 'Soins de conservation & Maquillage',
      situationFinanciere: 'Acompte 60%',
      statutSortie: 'En attente solde pour visa'
    },
    {
      id: 'NMG-2026-002578',
      defunt: 'LUMUMBA DIUMI André',
      statutIdentification: 'Identifié officiel',
      provenance: 'Centre Médical Monkole',
      dateAdmission: '22/09/2026 - 11:00',
      dureeSejour: '15 jours (Alerte)',
      emplacement: 'Chambre F2 • Casier #15',
      temperature: '+3.0°C',
      soins: 'Soins thanatopraxie complets',
      situationFinanciere: 'Soldé 100%',
      statutSortie: 'Prêt pour cérémonie funéraire'
    }
  ];

  // Registre opérationnel Funérarium (Slide 6, 9 du Storyboard PPTX)
  const registreFunerarium = [
    {
      id: 'NMG-2026-002581',
      famille: 'Famille KASANDA (Grâce)',
      defunt: 'KASANDA TSHIYOYO Jean-Luc',
      salon: 'Grand Salon Cérémonial A',
      creneau: '08/10/2026 • 18h00 - 23h00',
      prestations: 'Cercueil Chêne Massif, Traiteur 50p, Mémorial Numérique',
      devisUSD: '$1 450 USD',
      devisCDF: '4 060 000 CDF',
      statut: 'Confirmé & Planifié'
    },
    {
      id: 'NMG-2026-002580',
      famille: 'Famille MUTOMBO (Patrick)',
      defunt: 'MUTOMBO KABEYA Patient',
      salon: 'Salon Intimiste B',
      creneau: '07/10/2026 • 14h00 - 18h00',
      prestations: 'Corbillard Limousine VIP, Gerbe Florale, Livre d’Or',
      devisUSD: '$980 USD',
      devisCDF: '2 744 000 CDF',
      statut: 'En cours d’hommage'
    },
    {
      id: 'NMG-2026-002579',
      famille: 'Famille TSHILOMBA (Alain)',
      defunt: 'TSHILOMBA MBIYA Thérèse',
      salon: 'Grand Salon Cérémonial B',
      creneau: '09/10/2026 • 19h00 - 06h00',
      prestations: 'Conciergerie, Boissons/Collations, Veillée de prière',
      devisUSD: '$1 120 USD',
      devisCDF: '3 136 000 CDF',
      statut: 'Réservation validée'
    },
    {
      id: 'NMG-2026-002578',
      famille: 'Famille LUMUMBA (Marc)',
      defunt: 'LUMUMBA DIUMI André',
      salon: 'Salon Intimiste A',
      creneau: '10/10/2026 • 10h00 - 14h00',
      prestations: 'Plaque marbre personnalisée, Transfert depuis morgue ext.',
      devisUSD: '$650 USD',
      devisCDF: '1 820 000 CDF',
      statut: 'En préparation logistique'
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Chargement du tableau de bord de pilotage...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE ÉPURÉ DE LA VUE D'ENSEMBLE (CONFORME STORYBOARD)               */}
      {/* ========================================================================= */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
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
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              • Unité d’activité en cours
            </span>
          </div>

          <h1 className={`text-xl sm:text-2xl font-bold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Tableau de Bord — {currentPole === 'MORGUE' ? 'Morgue & Conservation Frigorifique' : 'Funérarium & Prestations Funéraires'}
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {currentPole === 'MORGUE'
              ? 'De l’admission du corps à sa sortie définitive • Contrôle continu des chambres froides et casiers'
              : 'De la demande de prestations à la clôture • Salons de recueillement, veillées et logistique'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/backoffice/ops')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold text-white transition-colors shadow-sm ${
              currentPole === 'MORGUE'
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-emerald-700 hover:bg-emerald-600'
            }`}
          >
            {currentPole === 'MORGUE' ? '+ Nouvelle admission morgue' : '+ Nouvelle réservation salon'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INDICATEURS KPIS TIRÉS DU STORYBOARD PPTX (SLIDE 9)                    */}
      {/* ========================================================================= */}
      {currentPole === 'MORGUE' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 : Défunts présents & Sortis */}
          <div
            className={`border rounded-xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Défunts Présents
            </span>
            <span className={`text-2xl sm:text-3xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              18 corps
            </span>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              42 sorties effectuées ce mois
            </span>
          </div>

          {/* KPI 2 : Places disponibles & Taux d'occupation */}
          <div
            className={`border rounded-xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Occupation Casiers
            </span>
            <span className={`text-2xl sm:text-3xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              56%
            </span>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              14 places disponibles sur 32
            </span>
          </div>

          {/* KPI 3 : Durée moyenne de séjour */}
          <div
            className={`border rounded-xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Durée Moyenne de Séjour
            </span>
            <span className={`text-2xl sm:text-3xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              6,4 jours
            </span>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              1 alerte de séjour (&gt; 15 jours)
            </span>
          </div>

          {/* KPI 4 : Sorties prévues aujourd'hui */}
          <div
            className={`border rounded-xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Sorties Prévues ce Jour
            </span>
            <span className={`text-2xl sm:text-3xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              3 départs
            </span>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              Dossiers financiers et visas soldés
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 : Salons de recueillement réservés */}
          <div
            className={`border rounded-xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Salons de Veillée Réservés
            </span>
            <span className={`text-2xl sm:text-3xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              6 salons
            </span>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              Sur 8 salons disponibles
            </span>
          </div>

          {/* KPI 2 : Funérailles & Cérémonies du jour */}
          <div
            className={`border rounded-xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Funérailles du Jour
            </span>
            <span className={`text-2xl sm:text-3xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              2 cérémonies
            </span>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              Programmées cet après-midi et ce soir
            </span>
          </div>

          {/* KPI 3 : Dossiers à préparer */}
          <div
            className={`border rounded-xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Dossiers à Préparer
            </span>
            <span className={`text-2xl sm:text-3xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              5 dossiers
            </span>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              Prestations en cours de validation
            </span>
          </div>

          {/* KPI 4 : Transports Corbillard programmés */}
          <div
            className={`border rounded-xl p-5 space-y-1 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Convois Corbillard
            </span>
            <span className={`text-2xl sm:text-3xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              4 convois
            </span>
            <span className={`text-xs block pt-1 border-t ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              Corbillards VIP & Transferts planifiés
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2.B. GRAPHIQUES ÉPURÉS & ANALYSE D'ACTIVITÉ EN TEMPS RÉEL                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Graphique 1 : Flux d'activité hebdomadaire (Entrées vs Sorties) - 7 colonnes */}
        <div
          className={`lg:col-span-7 border rounded-2xl p-5 space-y-4 transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-[11px] font-semibold uppercase tracking-wider block ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Flux d'activité hebdomadaire
              </span>
              <h3 className={`text-sm sm:text-base font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentPole === 'MORGUE'
                  ? 'Entrées de corps vs Levées autorisées'
                  : 'Nouveaux dossiers vs Clôtures cérémonies'}
              </h3>
            </div>
            
            {/* Légende épurée */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Entrées (24)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Sorties (19)</span>
              </div>
            </div>
          </div>

          {/* Bar Chart épuré en CSS / Barres */}
          <div className="pt-2">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-800/60 pb-2">
              {[
                { jour: 'Lun', entrees: 4, sorties: 2, hE: '60%', hS: '35%' },
                { jour: 'Mar', entrees: 3, sorties: 3, hE: '45%', hS: '45%' },
                { jour: 'Mer', entrees: 5, sorties: 2, hE: '75%', hS: '35%' },
                { jour: 'Jeu', entrees: 2, sorties: 4, hE: '30%', hS: '60%' },
                { jour: 'Ven', entrees: 6, sorties: 5, hE: '90%', hS: '75%' },
                { jour: 'Sam', entrees: 3, sorties: 2, hE: '45%', hS: '35%' },
                { jour: 'Dim', entrees: 1, sorties: 1, hE: '15%', hS: '15%' }
              ].map((col) => (
                <div key={col.jour} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* Barre Entrées */}
                    <div
                      style={{ height: col.hE }}
                      className="w-3 sm:w-4 rounded-t bg-blue-500 hover:bg-blue-400 transition-all relative group-hover:brightness-110"
                      title={`${col.jour} : ${col.entrees} entrées`}
                    />
                    {/* Barre Sorties */}
                    <div
                      style={{ height: col.hS }}
                      className="w-3 sm:w-4 rounded-t bg-indigo-400 hover:bg-indigo-300 transition-all relative group-hover:brightness-110"
                      title={`${col.jour} : ${col.sorties} sorties`}
                    />
                  </div>
                  <span className={`text-[10px] font-mono mt-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {col.jour}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
              <span>Pic d'activité : Vendredi (11 mouvements)</span>
              <span>Moyenne : 3,4 dossiers / jour</span>
            </div>
          </div>
        </div>

        {/* Graphique 2 : Taux d'Occupation & Répartition Capacitaire - 5 colonnes */}
        <div
          className={`lg:col-span-5 border rounded-2xl p-5 space-y-4 transition-colors ${
            isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {currentPole === 'MORGUE' ? 'Capacité Chambres Froides' : 'Disponibilité Salons & Véhicules'}
            </span>
            <h3 className={`text-sm sm:text-base font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentPole === 'MORGUE' ? '56% d’occupation globale (18/32)' : '75% d’occupation salons (6/8)'}
            </h3>
          </div>

          {/* Jauge globale épurée */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/60">
              <div
                style={{ width: currentPole === 'MORGUE' ? '56%' : '75%' }}
                className={`h-full rounded-full transition-all duration-500 ${
                  currentPole === 'MORGUE'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-400'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-400'
                }`}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                {currentPole === 'MORGUE' ? '18 corps présents' : '6 salons occupés'}
              </span>
              <span className="font-semibold text-emerald-400">
                {currentPole === 'MORGUE' ? '14 casiers disponibles' : '2 salons libres'}
              </span>
            </div>
          </div>

          {/* Détail par secteur / chambre */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/60 text-xs">
            {currentPole === 'MORGUE' ? (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Chambre F1 (Standard)</span>
                    <span className="font-mono text-slate-400">8 / 10 casiers (+2.8°C)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Chambre F2 (Soins & Thanato)</span>
                    <span className="font-mono text-slate-400">6 / 10 casiers (+3.0°C)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Chambre F3 (Réserve sécurisée)</span>
                    <span className="font-mono text-slate-400">4 / 12 casiers (+2.5°C)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '33%' }} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Grand Salon Cérémonial A</span>
                    <span className="font-semibold text-amber-400">Réservé (18h-23h)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Grand Salon Cérémonial B</span>
                    <span className="font-semibold text-emerald-400">Disponible ce matin</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-600 h-full rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Salons Intimistes (6 unités)</span>
                    <span className="font-mono text-slate-400">5 réservés / 1 libre</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '83%' }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SYNTHÈSE FINANCE & CAISSE (SLIDE 8 DU STORYBOARD : USD & CDF SÉPARÉS)  */}
      {/* ========================================================================= */}
      <div
        className={`border rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
          isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Synthèse Financière & Caisse (Suivi strict USD & CDF séparés)
          </span>
          <div className="flex flex-wrap items-baseline gap-3 mt-1">
            <span className={`text-lg sm:text-xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              $18 450 USD
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              & 51 660 000 CDF encaissés
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              • 4 factures en attente de solde
            </span>
          </div>
        </div>

        <div className="text-xs flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-lg border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Session Caisse : </span>
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>${caisseSession.totalEncaisseLiquideUSD} USD</strong>
            <span className={`font-mono text-[11px] ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              + {caisseSession.totalEncaisseLiquideCDF.toLocaleString('fr-FR')} CDF
            </span>
          </div>
          <button
            onClick={() => navigate('/backoffice/payments')}
            className={`text-xs font-semibold underline hover:no-underline ${
              isDark ? 'text-sky-400 hover:text-sky-300' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            Accéder à la caisse ➔
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. REGISTRE OPÉRATIONNEL SELON LE STORYBOARD FONCTIONNEL                   */}
      {/* ========================================================================= */}
      <div
        className={`border rounded-xl overflow-hidden shadow-sm transition-colors ${
          isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div
          className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div>
            <h2 className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentPole === 'MORGUE'
                ? 'Registre Actif des Dépouilles & Contrôles de Sortie'
                : 'Registre des Salons de Veillée, Prestations & Cérémonies'}
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {currentPole === 'MORGUE'
                ? 'Surveillance thermique continue (+2°C à +4°C) et vérifications préalables à la sortie'
                : 'Coordination des créneaux de veillée, prestations à la carte et logistique corbillard'}
            </p>
          </div>

          <button
            onClick={() => navigate('/backoffice/ops')}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              isDark
                ? 'text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                : 'text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300 bg-slate-50'
            }`}
          >
            Voir tous les dossiers
          </button>
        </div>

        {currentPole === 'MORGUE' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`font-medium border-b ${
                  isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">N° Dossier</th>
                  <th className="py-3 px-4">Défunt & Provenance</th>
                  <th className="py-3 px-4">Date Admission</th>
                  <th className="py-3 px-4">Casier & Température</th>
                  <th className="py-3 px-4">Soins Appliqués</th>
                  <th className="py-3 px-4">Finances</th>
                  <th className="py-3 px-4">Statut Sortie</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                {registreMorgue.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                  >
                    <td className={`py-3 px-4 font-mono font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.defunt}</span>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.provenance}</span>
                    </td>
                    <td className={`py-3 px-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.dateAdmission}
                      <span className="block text-[10px] font-mono">Séjour : {item.dureeSejour}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.emplacement}</span>
                      <span className="text-[10px] text-emerald-500 font-mono font-semibold">{item.temperature}</span>
                    </td>
                    <td className="py-3 px-4">
                      {item.soins}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        item.situationFinanciere.includes('100%')
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {item.situationFinanciere}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {item.statutSortie}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate('/backoffice/ops')}
                        className={`text-xs font-semibold ${
                          isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                        }`}
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
              <thead
                className={`font-medium border-b ${
                  isDark ? 'bg-[#0B132B] text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-4">N° Dossier</th>
                  <th className="py-3 px-4">Défunt & Famille</th>
                  <th className="py-3 px-4">Salon de Veillée</th>
                  <th className="py-3 px-4">Date & Plage Horaire</th>
                  <th className="py-3 px-4">Prestations à la Carte</th>
                  <th className="py-3 px-4">Montant Suivi</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                {registreFunerarium.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}
                  >
                    <td className={`py-3 px-4 font-mono font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.defunt}</span>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.famille}</span>
                    </td>
                    <td className={`py-3 px-4 font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.salon}
                    </td>
                    <td className={`py-3 px-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.creneau}
                    </td>
                    <td className="py-3 px-4">
                      {item.prestations}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <strong className={`block ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.devisUSD}</strong>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.devisCDF}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {item.statut}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate('/backoffice/ops')}
                        className={`text-xs font-semibold ${
                          isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'
                        }`}
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
