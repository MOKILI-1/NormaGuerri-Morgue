import React from 'react';
import { CaseEmplacement } from '@nomarguerrie/shared-types';
import { Building, Thermometer, UserCheck, Wrench, CheckCircle } from 'lucide-react';

interface EmplacementsViewProps {
  emplacements: CaseEmplacement[];
  onSelectCase: (caseId: string) => void;
}

export const EmplacementsView: React.FC<EmplacementsViewProps> = ({
  emplacements,
  onSelectCase
}) => {
  // Grouper par chambre
  const chambres = Array.from(new Set(emplacements.map((e) => e.chambreNom)));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Cartographie des Chambres Froides</h1>
        <p className="text-sm text-slate-500 mt-1">
          Supervision en direct de la disponibilité des cases, de la température et de l’affectation des défunts.
        </p>
      </div>

      <div className="space-y-8">
        {chambres.map((chambreNom) => {
          const casesDeLaChambre = emplacements.filter((e) => e.chambreNom === chambreNom);
          const casesOccupees = casesDeLaChambre.filter((e) => e.statut === 'OCCUPEE').length;
          const pct = Math.round((casesOccupees / casesDeLaChambre.length) * 100);

          return (
            <div key={chambreNom} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Building className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{chambreNom}</h2>
                    <p className="text-xs text-slate-500">
                      Capacité : {casesOccupees} / {casesDeLaChambre.length} occupées ({pct}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Disponible
                  </span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800" /> Occupée
                  </span>
                  <span className="flex items-center gap-1 text-amber-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Maintenance
                  </span>
                </div>
              </div>

              {/* Grille des cases */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {casesDeLaChambre.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onSelectCase(c.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between h-24 ${
                      c.statut === 'OCCUPEE'
                        ? 'bg-slate-900 text-white border-slate-800 hover:border-slate-700'
                        : c.statut === 'MAINTENANCE'
                        ? 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-300'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{c.numeroCase}</span>
                      {c.statut === 'OCCUPEE' ? (
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                      ) : c.statut === 'MAINTENANCE' ? (
                        <Wrench className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] opacity-80 mt-2">
                      <span className="flex items-center gap-0.5">
                        <Thermometer className="w-3 h-3" />
                        {c.temperatureActuelle ? `${c.temperatureActuelle}°C` : 'N/A'}
                      </span>
                      <span className="font-semibold uppercase text-[10px]">{c.statut}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
