import React from 'react';
import { MetriquesDashboard, TacheFileDuJour, RoleUtilisateur } from '@nomarguerrie/shared-types';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  UserCheck,
  Building,
  CheckSquare,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  stats: MetriquesDashboard;
  taches: TacheFileDuJour[];
  activeRole: RoleUtilisateur;
  onSelectDossier: (dossierId: string) => void;
  onNavigate: (view: 'dashboard' | 'dossiers' | 'emplacements') => void;
  onOpenNewAdmission: () => void;
  onOpenScanner: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  taches,
  activeRole,
  onSelectDossier,
  onNavigate,
  onOpenNewAdmission,
  onOpenScanner
}) => {
  return (
    <div className="space-y-6">
      {/* En-tête contextuel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <UserCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Centre de Commande Opérationnel
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Session active en tant que <span className="font-semibold text-slate-800 uppercase">{activeRole.replace('_', ' ')}</span>.
            Toutes les actions sont tracées dans le registre d'audit.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenScanner}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            Scanner QR Dossier
          </button>
          <button
            onClick={onOpenNewAdmission}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            + Admission Immédiate
          </button>
        </div>
      </div>

      {/* BLOC 1 : MA JOURNÉE & FLUX DU JOUR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Urgences */}
        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">À Traiter d'Urgence</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.urgencesCount} dossiers</p>
            <p className="text-xs text-rose-500 mt-0.5">Documents ou sorties bloquées</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Tâches en attente */}
        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Tâches en Attente</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.tachesEnAttenteCount} actions</p>
            <p className="text-xs text-amber-600/80 mt-0.5">Affectations et vérifications</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Admissions Aujourd'hui */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Admissions du Jour</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.admissionsAujourdhui} entrées</p>
            <p className="text-xs text-slate-500 mt-0.5">{stats.sortiesPrevuesAujourdhui} sorties prévues</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Building className="w-6 h-6" />
          </div>
        </div>

        {/* Encaissé Aujourd'hui */}
        <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Encaissé Aujourd'hui</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">${stats.financeResume.encaisseAujourdhui.toFixed(0)}</p>
            <p className="text-xs text-emerald-600/80 mt-0.5">{stats.financeResume.facturesOuvertesCount} factures ouvertes</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* BLOC 2 : FILE DU JOUR CONTEXTUELLE & CAPACITÉ EN TEMPS RÉEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File du jour de l'utilisateur (2 colonnes) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                File du Jour ({activeRole.replace('_', ' ')})
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {taches.length} action(s) prioritaire(s)
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {taches.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                <p className="font-medium text-slate-700">Toutes les tâches prioritaires sont traitées !</p>
                <p className="text-xs text-slate-400 mt-1">Aucun blocage immédiat pour votre profil.</p>
              </div>
            ) : (
              taches.map((t) => (
                <div
                  key={t.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => onSelectDossier(t.dossierId)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {t.numeroDossier}
                      </span>
                      <span className="font-semibold text-sm text-slate-900">{t.nomDefunt}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          t.urgence === 'CRITIQUE'
                            ? 'bg-rose-100 text-rose-700'
                            : t.urgence === 'HAUTE'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {t.urgence}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{t.titreTache}</p>
                  </div>

                  <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1 shrink-0">
                    Traiter <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Capacité des Chambres Froides (1 colonne) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-600" />
              Occupation des Chambres
            </h2>
            <button
              onClick={() => onNavigate('emplacements')}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Voir le plan
            </button>
          </div>

          <div className="space-y-4">
            {stats.chambresOccupation.map((ch) => (
              <div key={ch.chambreId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{ch.nom}</span>
                  <span
                    className={`font-bold ${
                      ch.statutAlerte === 'CRITIQUE'
                        ? 'text-rose-600'
                        : ch.statutAlerte === 'ELEVEE'
                        ? 'text-amber-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {ch.casesOccupees} / {ch.capaciteTotale} ({ch.pourcentageOccupation}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      ch.statutAlerte === 'CRITIQUE'
                        ? 'bg-rose-500'
                        : ch.statutAlerte === 'ELEVEE'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${ch.pourcentageOccupation}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Synthèse financière immédiate */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Synthèse Recouvrement</p>
            <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between text-xs">
              <span className="text-slate-600">Total Impayés en cours</span>
              <span className="font-bold text-rose-600">${stats.financeResume.totalImpayes.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
