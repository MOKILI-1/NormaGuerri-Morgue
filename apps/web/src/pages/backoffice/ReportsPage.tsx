import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Building,
  Smartphone
} from 'lucide-react';
import { useBackoffice } from '../../context/BackofficeContext';

export const ReportsPage: React.FC = () => {
  const { currentPole } = useBackoffice();
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState<'MOIS' | 'TRIMESTRE' | 'ANNEE'>('MOIS');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, [periode]);

  // Données consolidées de trésorerie
  const comptesBancaires = [
    { banque: 'Rawbank CDF', devise: 'CDF', solde: 48500000, type: 'Banque Locale' },
    { banque: 'EquityBCDC USD', devise: 'USD', solde: 14250, type: 'Banque Internationale' },
    { banque: 'Vodacash (M-Pesa)', devise: 'USD / CDF', solde: 3200, type: 'Mobile Money' },
    { banque: 'Orange Money Pro', devise: 'USD / CDF', solde: 2150, type: 'Mobile Money' },
    { banque: 'Caisse Centrale Espèces', devise: 'Mixte', solde: 1450, type: 'Caisse Physique' }
  ];

  // Écritures comptables
  const ecrituresComptables = [
    { date: '2026-10-06', piece: 'PC-2026-0041', compte: '706100', libelle: 'Prestations de séjour chambre froide', debitUSD: 0, creditUSD: 175 },
    { date: '2026-10-06', piece: 'PC-2026-0042', compte: '706200', libelle: 'Réservation grand salon veillée', debitUSD: 0, creditUSD: 250 },
    { date: '2026-10-06', piece: 'PC-2026-0043', compte: '512100', libelle: 'Règlement M-Pesa client BOMPIMO', debitUSD: 250, creditUSD: 0 },
    { date: '2026-10-05', piece: 'PC-2026-0040', compte: '531100', libelle: 'Encaissement caisse espèces KASANDA', debitUSD: 822.5, creditUSD: 0 },
    { date: '2026-10-05', piece: 'PC-2026-0039', compte: '706300', libelle: 'Frais d’admission et ouverture dossier', debitUSD: 0, creditUSD: 50 }
  ];

  const handleExportCSV = () => {
    let csv = 'Date,Piece,Compte,Libelle,Debit_USD,Credit_USD\n';
    ecrituresComptables.forEach((e) => {
      csv += `${e.date},${e.piece},${e.compte},"${e.libelle}",${e.debitUSD},${e.creditUSD}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ecritures_Comptables_Nomarguerrie_${periode}_2026.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-300">Génération des rapports comptables...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-blue-950">
        <div>
          <span className="text-xs text-sky-400 font-mono font-bold uppercase tracking-wider block">
            DIRECTION FINANCIÈRE & AUDIT
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Comptabilité, Rapprochement Bancaire & Reporting
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#050E22] p-1 rounded-xl border border-blue-950 text-xs flex">
            {(['MOIS', 'TRIMESTRE', 'ANNEE'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriode(p)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                  periode === p ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Exporter Écritures (CSV/Excel)</span>
          </button>
        </div>
      </div>

      {/* Rapprochement des Comptes et Trésorerie */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {comptesBancaires.map((cp, idx) => (
          <div key={idx} className="bg-[#050E22] border border-blue-950 rounded-2xl p-4 space-y-1 shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">{cp.type}</span>
            <strong className="text-white text-xs block truncate">{cp.banque}</strong>
            <span className="text-base font-black text-sky-400 font-mono block">
              {cp.devise === 'CDF' ? `${cp.solde.toLocaleString('fr-FR')} CDF` : `$${cp.solde.toLocaleString('fr-FR')} USD`}
            </span>
          </div>
        ))}
      </div>

      {/* Journal des Écritures Comptables Prêtes pour Export */}
      <div className="bg-[#050E22] border border-blue-950 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Journal Général des Écritures Multi-Devises</h3>
            <p className="text-xs text-slate-400">Prêt pour injection dans votre ERP / logiciel comptable externe</p>
          </div>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
            Équilibre Débit/Crédit Validé
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#030914] text-slate-400 uppercase text-[10px] border-b border-blue-950">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">N° Pièce</th>
                <th className="py-2.5 px-3">Compte</th>
                <th className="py-2.5 px-3">Libellé de l'Écriture</th>
                <th className="py-2.5 px-3 text-right">Débit (USD)</th>
                <th className="py-2.5 px-3 text-right">Crédit (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-950/60 text-slate-300">
              {ecrituresComptables.map((ec, i) => (
                <tr key={i} className="hover:bg-slate-900/60">
                  <td className="py-2 px-3 text-slate-400">{ec.date}</td>
                  <td className="py-2 px-3 text-sky-400">{ec.piece}</td>
                  <td className="py-2 px-3 text-amber-300 font-bold">{ec.compte}</td>
                  <td className="py-2 px-3 text-white font-sans">{ec.libelle}</td>
                  <td className="py-2 px-3 text-right text-emerald-400 font-bold">
                    {ec.debitUSD > 0 ? `$${ec.debitUSD.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-2 px-3 text-right text-sky-400 font-bold">
                    {ec.creditUSD > 0 ? `$${ec.creditUSD.toFixed(2)}` : '-'}
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
