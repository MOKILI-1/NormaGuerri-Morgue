import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Coins,
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  DollarSign,
  ArrowRight,
  Printer
} from 'lucide-react';
import { useBackoffice } from '../../context/BackofficeContext';

interface Transaction {
  id: string;
  referenceRecu: string;
  dateHeure: string;
  montantUSD: number;
  montantCDF: number;
  mode: 'MOBILE_MONEY' | 'CARTE_BANCAIRE' | 'ESPECES';
  operateur?: 'M_PESA' | 'ORANGE_MONEY' | 'AIRTEL_MONEY' | 'VISA' | 'GUICHET';
  clientNom: string;
  dossierRef: string;
  statut: 'VALIDE' | 'EN_ATTENTE' | 'REJETE';
  tokenSecurise: string;
}

export const PaymentsHub: React.FC = () => {
  const { caisseSession, ouvrirCaisse, fermerCaisse, ajouterEncaissementLiquide, currentUser } = useBackoffice();

  const [activeTab, setActiveTab] = useState<'TRANSACTIONS' | 'CAISSE' | 'VERIFICATION'>('TRANSACTIONS');
  const [loading, setLoading] = useState(true);

  // Transactions factices
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rechercheTrans, setRechercheTrans] = useState('');
  const [filtreMode, setFiltreMode] = useState<string>('TOUS');

  // Formulaire d'encaissement guichet rapide
  const [montantSaisieUSD, setMontantSaisieUSD] = useState('');
  const [montantSaisieCDF, setMontantSaisieCDF] = useState('');
  const [clientPaiement, setClientPaiement] = useState('');
  const [dossierPaiement, setDossierPaiement] = useState('#NMG-2026-002581');
  const [modeEncaissement, setModeEncaissement] = useState<'ESPECES' | 'MOBILE_MONEY' | 'CARTE_BANCAIRE'>('ESPECES');

  // État Clôture de caisse
  const [comptageFinalUSD, setComptageFinalUSD] = useState('');
  const [comptageFinalCDF, setComptageFinalCDF] = useState('');
  const [resultatCloture, setResultatCloture] = useState<{ ecartUSD: number; ecartCDF: number } | null>(null);

  // État Vérification cryptographique
  const [codeVerification, setCodeVerification] = useState('');
  const [reçuVerifie, setReçuVerifie] = useState<Transaction | null>(null);
  const [erreurVerif, setErreurVerif] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const initTransactions: Transaction[] = [
        {
          id: 'tx-001',
          referenceRecu: 'RC-2026-NMG-00192',
          dateHeure: '2026-10-06 14:30',
          montantUSD: 822.5,
          montantCDF: 2303000,
          mode: 'ESPECES',
          operateur: 'GUICHET',
          clientNom: 'KASANDA Grâce',
          dossierRef: '#NMG-2026-002581',
          statut: 'VALIDE',
          tokenSecurise: 'SEC_REC_99812A'
        },
        {
          id: 'tx-002',
          referenceRecu: 'RC-2026-NMG-00193',
          dateHeure: '2026-10-06 15:15',
          montantUSD: 250,
          montantCDF: 700000,
          mode: 'MOBILE_MONEY',
          operateur: 'M_PESA',
          clientNom: 'BOMPIMO Marc',
          dossierRef: '#NMG-2026-002574',
          statut: 'VALIDE',
          tokenSecurise: 'SEC_REC_55419B'
        },
        {
          id: 'tx-003',
          referenceRecu: 'RC-2026-NMG-00194',
          dateHeure: '2026-10-06 16:40',
          montantUSD: 140,
          montantCDF: 392000,
          mode: 'MOBILE_MONEY',
          operateur: 'ORANGE_MONEY',
          clientNom: 'MUKENDI Joseph',
          dossierRef: '#NMG-2026-002590',
          statut: 'VALIDE',
          tokenSecurise: 'SEC_REC_11029C'
        }
      ];
      setTransactions(initTransactions);
      setLoading(false);
    }, 250);
  }, []);

  const handleEncaisser = (e: React.FormEvent) => {
    e.preventDefault();
    const usd = parseFloat(montantSaisieUSD) || 0;
    const cdf = parseFloat(montantSaisieCDF) || usd * 2800;

    const nouvelleTx: Transaction = {
      id: `tx-${Date.now()}`,
      referenceRecu: `RC-2026-NMG-${Math.floor(1000 + Math.random() * 9000)}`,
      dateHeure: new Date().toISOString().replace('T', ' ').slice(0, 16),
      montantUSD: usd,
      montantCDF: cdf,
      mode: modeEncaissement,
      operateur: modeEncaissement === 'ESPECES' ? 'GUICHET' : 'M_PESA',
      clientNom: clientPaiement || 'Client Guichet',
      dossierRef: dossierPaiement,
      statut: 'VALIDE',
      tokenSecurise: `SEC_REC_${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    setTransactions([nouvelleTx, ...transactions]);

    if (modeEncaissement === 'ESPECES') {
      ajouterEncaissementLiquide(usd, cdf);
    }

    setMontantSaisieUSD('');
    setMontantSaisieCDF('');
    setClientPaiement('');
    alert(`Encaissement validé avec succès ! Reçu : ${nouvelleTx.referenceRecu}`);
  };

  const handleCloturerCaisse = (e: React.FormEvent) => {
    e.preventDefault();
    const cUSD = parseFloat(comptageFinalUSD) || 0;
    const cCDF = parseFloat(comptageFinalCDF) || 0;
    const res = fermerCaisse(cUSD, cCDF);
    setResultatCloture(res);
  };

  const handleVerifierRecu = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = codeVerification.trim().toUpperCase();
    const match = transactions.find(
      (t) => t.referenceRecu.toUpperCase().includes(clean) || t.tokenSecurise.toUpperCase() === clean
    );
    if (match) {
      setReçuVerifie(match);
      setErreurVerif(false);
    } else {
      setReçuVerifie(null);
      setErreurVerif(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-300">Chargement du Hub Paiements & Caisse...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-blue-950">
        <div>
          <span className="text-xs text-sky-400 font-mono font-bold uppercase tracking-wider block">
            FINANCE & TRÉSORERIE • NOMARGUÉRRIE
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Hub Paiements & Sessions de Caisse
          </h1>
        </div>

        {/* Onglets du Hub */}
        <div className="flex bg-[#050E22] p-1 rounded-xl border border-blue-950 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'TRANSACTIONS' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('CAISSE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'CAISSE' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Caisse Physique (Cash)
          </button>
          <button
            onClick={() => setActiveTab('VERIFICATION')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'VERIFICATION' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vérification Reçu
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ONGLET 1 : TRANSACTIONS                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="space-y-4">
          {/* Filtres & Recherche */}
          <div className="bg-[#050E22] border border-blue-950 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher référence, client, jeton..."
                value={rechercheTrans}
                onChange={(e) => setRechercheTrans(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#030914] border border-blue-950 rounded-xl text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Canal de paiement :</span>
              {['TOUS', 'ESPECES', 'MOBILE_MONEY', 'CARTE_BANCAIRE'].map((m) => (
                <button
                  key={m}
                  onClick={() => setFiltreMode(m)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                    filtreMode === m ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Table des Transactions */}
          <div className="bg-[#050E22] border border-blue-950 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#030914] text-slate-400 uppercase text-[10px] tracking-wider border-b border-blue-950">
                  <tr>
                    <th className="py-3 px-4">Réf. Reçu</th>
                    <th className="py-3 px-4">Date & Heure</th>
                    <th className="py-3 px-4">Client / Dossier</th>
                    <th className="py-3 px-4">Mode / Opérateur</th>
                    <th className="py-3 px-4">Montant USD</th>
                    <th className="py-3 px-4">Montant CDF</th>
                    <th className="py-3 px-4">Jeton Cryptographique</th>
                    <th className="py-3 px-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-950/60 text-slate-300">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                        {tx.referenceRecu}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {tx.dateHeure}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{tx.clientNom}</span>
                        <span className="text-[10px] text-sky-400 font-mono">{tx.dossierRef}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-sky-300 font-semibold text-[10px] border border-blue-900 uppercase">
                          {tx.mode} {tx.operateur ? `(${tx.operateur})` : ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ${tx.montantUSD.toFixed(2)} USD
                      </td>
                      <td className="py-3.5 px-4 font-mono text-sky-300">
                        {tx.montantCDF.toLocaleString('fr-FR')} CDF
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[10px]">
                        {tx.tokenSecurise}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {tx.statut}
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
      {/* ONGLET 2 : CAISSE PHYSIQUE (CASH)                                         */}
      {/* ========================================================================= */}
      {activeTab === 'CAISSE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne Gauche : État de la session & Clôture */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#050E22] border border-blue-950 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-blue-950 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">État de la Session de Caisse</h3>
                  <p className="text-xs text-slate-400 font-mono">Session : {caisseSession.referenceSession}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    caisseSession.estOuverte
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {caisseSession.statut}
                </span>
              </div>

              {/* Indicateurs de caisse */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#030914] border border-blue-950">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Fond de roulement USD :</span>
                  <strong className="text-white text-lg">${caisseSession.fondDeRoulementUSD} USD</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#030914] border border-blue-950">
                  <span className="text-slate-400 block text-[10px] uppercase font-sans">Fond de roulement CDF :</span>
                  <strong className="text-white text-lg">{caisseSession.fondDeRoulementCDF.toLocaleString('fr-FR')} CDF</strong>
                </div>
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60">
                  <span className="text-sky-300 block text-[10px] uppercase font-sans">Total Encaissé USD :</span>
                  <strong className="text-sky-300 text-lg">${caisseSession.totalEncaisseLiquideUSD} USD</strong>
                </div>
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60">
                  <span className="text-sky-300 block text-[10px] uppercase font-sans">Total Encaissé CDF :</span>
                  <strong className="text-sky-300 text-lg">{caisseSession.totalEncaisseLiquideCDF.toLocaleString('fr-FR')} CDF</strong>
                </div>
              </div>

              {/* Formulaire Clôture & Rapprochement Superviseur */}
              {caisseSession.estOuverte ? (
                <form onSubmit={handleCloturerCaisse} className="p-4 bg-slate-900/80 rounded-xl border border-blue-950 space-y-3 text-xs">
                  <span className="font-bold text-white block uppercase text-[11px]">
                    Clôture de Caisse & Comptage Physique (Contrôle Superviseur)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Comptage Espèces USD</label>
                      <input
                        type="number"
                        placeholder="Ex: 1650"
                        value={comptageFinalUSD}
                        onChange={(e) => setComptageFinalUSD(e.target.value)}
                        required
                        className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Comptage Espèces CDF</label>
                      <input
                        type="number"
                        placeholder="Ex: 4350000"
                        value={comptageFinalCDF}
                        onChange={(e) => setComptageFinalCDF(e.target.value)}
                        required
                        className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Clôturer la Caisse & Vérifier les Écarts</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Session de caisse clôturée et certifiée.</span>
                  </div>
                  {resultatCloture && (
                    <div className="font-mono text-slate-300 text-[11px]">
                      Écart USD constaté : <strong className={resultatCloture.ecartUSD === 0 ? 'text-emerald-400' : 'text-amber-400'}>{resultatCloture.ecartUSD} USD</strong> • Écart CDF : <strong className={resultatCloture.ecartCDF === 0 ? 'text-emerald-400' : 'text-amber-400'}>{resultatCloture.ecartCDF} CDF</strong>
                    </div>
                  )}
                  <button
                    onClick={() => ouvrirCaisse(200, 500000)}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Ouvrir une nouvelle session de caisse
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Colonne Droite : Saisie Rapide d'Encaissement Liquide */}
          <div className="lg:col-span-5">
            <div className="bg-[#050E22] border border-blue-950 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-bold text-white text-base">Saisie d'un Nouvel Encaissement</h3>
              <form onSubmit={handleEncaisser} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Dossier funéraire</label>
                  <input
                    type="text"
                    value={dossierPaiement}
                    onChange={(e) => setDossierPaiement(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Nom du Déposant</label>
                  <input
                    type="text"
                    placeholder="Ex: Famille KASANDA"
                    value={clientPaiement}
                    onChange={(e) => setClientPaiement(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">Montant USD</label>
                    <input
                      type="number"
                      placeholder="Ex: 50"
                      value={montantSaisieUSD}
                      onChange={(e) => setMontantSaisieUSD(e.target.value)}
                      required
                      className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Mode</label>
                    <select
                      value={modeEncaissement}
                      onChange={(e) => setModeEncaissement(e.target.value as any)}
                      className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                    >
                      <option value="ESPECES">Espèces au guichet</option>
                      <option value="MOBILE_MONEY">Mobile Money</option>
                      <option value="CARTE_BANCAIRE">Carte Bancaire</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!caisseSession.estOuverte}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Coins className="w-4 h-4" />
                  <span>Encaisser & Émettre le Reçu</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ONGLET 3 : VÉRIFICATION CRYPTOGRAPHIQUE                                  */}
      {/* ========================================================================= */}
      {activeTab === 'VERIFICATION' && (
        <div className="max-w-xl mx-auto bg-[#050E22] border border-blue-950 rounded-2xl p-6 sm:p-7 space-y-5">
          <div>
            <h3 className="font-bold text-white text-base">Vérificateur d'Authenticité des Reçus</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Saisissez le numéro officiel de reçu ou scannez le jeton QR pour attester de son encaissement cryptographique.
            </p>
          </div>

          <form onSubmit={handleVerifierRecu} className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: RC-2026-NMG-00192 ou SEC_REC_99812A"
              value={codeVerification}
              onChange={(e) => setCodeVerification(e.target.value)}
              className="flex-1 p-2.5 bg-[#030914] border border-blue-950 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Vérifier
            </button>
          </form>

          {reçuVerifie && (
            <div className="bg-[#030914] border border-emerald-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Reçu Certifié Conforme & Encaissé
                </span>
                <span className="font-mono">{reçuVerifie.referenceRecu}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px] pt-2 border-t border-blue-950">
                <div>Client : <strong className="text-white">{reçuVerifie.clientNom}</strong></div>
                <div>Dossier : <strong className="text-white">{reçuVerifie.dossierRef}</strong></div>
                <div>Montant USD : <strong className="text-white">${reçuVerifie.montantUSD}</strong></div>
                <div>Mode : <strong className="text-white">{reçuVerifie.mode}</strong></div>
                <div>Date : <strong className="text-white">{reçuVerifie.dateHeure}</strong></div>
                <div>Jeton : <strong className="text-white">{reçuVerifie.tokenSecurise}</strong></div>
              </div>
            </div>
          )}

          {erreurVerif && (
            <div className="bg-red-950/40 border border-red-800 rounded-xl p-3 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Aucun reçu officiel ne correspond à cette référence cryptographique.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
