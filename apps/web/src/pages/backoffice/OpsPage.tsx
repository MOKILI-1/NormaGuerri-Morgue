import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  Download,
  AlertCircle,
  Eye,
  Trash2,
  Send,
  Building2,
  Flower2,
  RefreshCw
} from 'lucide-react';
import { useBackoffice } from '../../context/BackofficeContext';
import { CATALOGUE_SERVICES_MOCK, DOSSIERS_MOCK } from '../../../../api/src/data/mock-db';

interface Facture {
  id: string;
  numeroFacture: string;
  clientNom: string;
  clientTel: string;
  defuntNom: string;
  dossierRef: string;
  pole: 'MORGUE' | 'FUNERARIUM';
  articles: Array<{ id: string; titre: string; quantite: number; prixUSD: number; prixCDF: number }>;
  sousTotalUSD: number;
  remiseUSD: number;
  tvaUSD: number;
  totalUSD: number;
  totalCDF: number;
  statut: 'BROUILLON' | 'PROFORMA' | 'DEFINITIVE' | 'ATTENTE_APPROBATION_REMISE' | 'PAYEE';
  dateCreation: string;
  lienPaiementToken: string;
}

export const OpsPage: React.FC = () => {
  const { currentPole, currentUser } = useBackoffice();

  const [loading, setLoading] = useState(true);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [filtreStatut, setFiltreStatut] = useState<string>('TOUS');
  const [recherche, setRecherche] = useState('');

  // État du modal de création de facture
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDossierRef, setSelectedDossierRef] = useState(DOSSIERS_MOCK[0]?.numeroDossier || '#NMG-2026-002581');
  const [clientNom, setClientNom] = useState('KASANDA Grâce');
  const [clientTel, setClientTel] = useState('+243825551234');
  const [defuntNom, setDefuntNom] = useState('KASANDA TSHIYOYO Jean-Luc');
  const [selectedArticles, setSelectedArticles] = useState<Array<{ id: string; titre: string; quantite: number; prixUSD: number }>>([
    { id: 'art-adm-00', titre: 'Frais d’admission & Ouverture de dossier funéraire', quantite: 1, prixUSD: 50 },
    { id: 'art-rec-01', titre: 'Réservation de salon funéraire (Petit salon intimiste)', quantite: 1, prixUSD: 120 }
  ]);
  const [remisePourcent, setRemisePourcent] = useState(0);

  // Modal visualisation PDF
  const [selectedFacturePdf, setSelectedFacturePdf] = useState<Facture | null>(null);

  useEffect(() => {
    // Initialisation des factures factices selon l'architecture
    setLoading(true);
    setTimeout(() => {
      const initFactures: Facture[] = [
        {
          id: 'fac-001',
          numeroFacture: 'FAC-2026-NMG-00192',
          clientNom: 'KASANDA Grâce',
          clientTel: '+243825551234',
          defuntNom: 'KASANDA TSHIYOYO Jean-Luc',
          dossierRef: '#NMG-2026-002581',
          pole: 'MORGUE',
          articles: [
            { id: 'art-adm-00', titre: 'Frais d’admission & Ouverture de dossier funéraire', quantite: 1, prixUSD: 50, prixCDF: 140000 },
            { id: 'art-2', titre: 'Conservation en chambre froide (7 jours)', quantite: 7, prixUSD: 175, prixCDF: 490000 }
          ],
          sousTotalUSD: 225,
          remiseUSD: 0,
          tvaUSD: 36,
          totalUSD: 261,
          totalCDF: 730800,
          statut: 'DEFINITIVE',
          dateCreation: '2026-10-05',
          lienPaiementToken: 'PAY_LINK_9482X'
        },
        {
          id: 'fac-002',
          numeroFacture: 'FAC-2026-NMG-00193',
          clientNom: 'BOMPIMO Marc',
          clientTel: '+243812345678',
          defuntNom: 'BOMPIMO Henriette',
          dossierRef: '#NMG-2026-002574',
          pole: 'FUNERARIUM',
          articles: [
            { id: 'art-rec-02', titre: 'Grand salon de veillée & Hommage solennel', quantite: 1, prixUSD: 250, prixCDF: 700000 },
            { id: 'art-flr-01', titre: 'Couronne florale naturelle & Gerbe d’honneur', quantite: 2, prixUSD: 160, prixCDF: 448000 },
            { id: 'art-transp-02', titre: 'Convoi funéraire corbillard grand confort', quantite: 1, prixUSD: 180, prixCDF: 504000 }
          ],
          sousTotalUSD: 590,
          remiseUSD: 29.5,
          tvaUSD: 89.68,
          totalUSD: 650.18,
          totalCDF: 1820504,
          statut: 'PROFORMA',
          dateCreation: '2026-10-06',
          lienPaiementToken: 'PAY_LINK_5193B'
        },
        {
          id: 'fac-003',
          numeroFacture: 'FAC-2026-NMG-00194',
          clientNom: 'MUKENDI Joseph',
          clientTel: '+243899990001',
          defuntNom: 'MUKENDI Christine',
          dossierRef: '#NMG-2026-002590',
          pole: 'MORGUE',
          articles: [
            { id: 'art-adm-00', titre: 'Frais d’admission initiale', quantite: 1, prixUSD: 50, prixCDF: 140000 },
            { id: 'art-thn-01', titre: 'Soins de thanatopraxie & présentation', quantite: 1, prixUSD: 140, prixCDF: 392000 }
          ],
          sousTotalUSD: 190,
          remiseUSD: 0,
          tvaUSD: 30.4,
          totalUSD: 220.4,
          totalCDF: 617120,
          statut: 'ATTENTE_APPROBATION_REMISE',
          dateCreation: '2026-10-06',
          lienPaiementToken: 'PAY_LINK_2201R'
        }
      ];

      setFactures(initFactures);
      setLoading(false);
    }, 300);
  }, [currentPole]);

  // Filtrage
  const facturesFiltrees = factures.filter((f) => {
    const matchPole = currentPole === 'SUPER_ADMIN' ? true : f.pole === currentPole;
    const matchStatut = filtreStatut === 'TOUS' || f.statut === filtreStatut;
    const matchSearch =
      f.numeroFacture.toLowerCase().includes(recherche.toLowerCase()) ||
      f.clientNom.toLowerCase().includes(recherche.toLowerCase()) ||
      f.defuntNom.toLowerCase().includes(recherche.toLowerCase()) ||
      f.dossierRef.toLowerCase().includes(recherche.toLowerCase());
    return matchPole && matchStatut && matchSearch;
  });

  // Calcul du montant de la nouvelle facture
  const tauxCDF = 2800;
  const sousTotalNewUSD = selectedArticles.reduce((acc, curr) => acc + curr.prixUSD * curr.quantite, 0);
  const montantRemiseUSD = (sousTotalNewUSD * remisePourcent) / 100;
  const tvaNewUSD = (sousTotalNewUSD - montantRemiseUSD) * 0.16;
  const totalNewUSD = sousTotalNewUSD - montantRemiseUSD + tvaNewUSD;
  const totalNewCDF = totalNewUSD * tauxCDF;

  const handleCreerFacture = (e: React.FormEvent) => {
    e.preventDefault();
    const nouvelle: Facture = {
      id: `fac-${Date.now()}`,
      numeroFacture: `FAC-2026-NMG-${Math.floor(1000 + Math.random() * 9000)}`,
      clientNom,
      clientTel,
      defuntNom,
      dossierRef: selectedDossierRef,
      pole: currentPole === 'FUNERARIUM' ? 'FUNERARIUM' : 'MORGUE',
      articles: selectedArticles.map((a) => ({
        ...a,
        prixCDF: a.prixUSD * tauxCDF
      })),
      sousTotalUSD: sousTotalNewUSD,
      remiseUSD: montantRemiseUSD,
      tvaUSD: tvaNewUSD,
      totalUSD: totalNewUSD,
      totalCDF: totalNewCDF,
      statut: 'PROFORMA',
      dateCreation: new Date().toISOString().slice(0, 10),
      lienPaiementToken: `PAY_${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    setFactures([nouvelle, ...factures]);
    setIsModalOpen(false);
  };

  const handleChangerStatut = (id: string, nouveauStatut: Facture['statut']) => {
    setFactures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, statut: nouveauStatut } : f))
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-300">Chargement du module de facturation {currentPole}...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
              {currentPole === 'MORGUE' ? 'Ops Morgue' : 'Ops Funérarium'}
            </span>
            <span className="text-xs text-slate-400">• Facturation, Devis & Liens de Paiement</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Gestion Opérationnelle & Facturation
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className={`py-2 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center gap-1.5 ${
            currentPole === 'MORGUE'
              ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Émettre une Facture / Devis</span>
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-[#050E22] border border-blue-950 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par n° facture, défunt, client..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#030914] border border-blue-950 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-slate-400 text-[11px] shrink-0">Filtrer par statut :</span>
          {['TOUS', 'BROUILLON', 'PROFORMA', 'DEFINITIVE', 'ATTENTE_APPROBATION_REMISE', 'PAYEE'].map((st) => (
            <button
              key={st}
              onClick={() => setFiltreStatut(st)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors shrink-0 ${
                filtreStatut === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des Factures */}
      <div className="bg-[#050E22] border border-blue-950 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#030914] text-slate-400 uppercase text-[10px] tracking-wider border-b border-blue-950">
              <tr>
                <th className="py-3 px-4">Réf. Facture</th>
                <th className="py-3 px-4">Dossier / Défunt</th>
                <th className="py-3 px-4">Client / Contact</th>
                <th className="py-3 px-4">Articles</th>
                <th className="py-3 px-4">Montant Total</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-950/60 text-slate-300">
              {facturesFiltrees.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                    {fac.numeroFacture}
                    <span className="block text-[10px] text-slate-400 font-normal">{fac.dateCreation}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{fac.defuntNom}</span>
                    <span className="font-mono text-sky-400 text-[10px]">{fac.dossierRef}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-white block font-medium">{fac.clientNom}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{fac.clientTel}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-300 text-[11px] block">{fac.articles.length} prestation(s)</span>
                    <span className="text-[10px] text-slate-500 truncate block max-w-xs">
                      {fac.articles.map((a) => a.titre).join(', ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-white text-sm">${fac.totalUSD.toFixed(2)} USD</span>
                    <span className="block text-[10px] text-sky-300">
                      ≈ {Math.round(fac.totalCDF).toLocaleString('fr-FR')} CDF
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={fac.statut}
                      onChange={(e) => handleChangerStatut(fac.id, e.target.value as Facture['statut'])}
                      className="bg-[#030914] border border-blue-950 rounded-lg text-[10px] font-bold px-2 py-1 text-sky-300 focus:outline-none focus:ring-1 focus:ring-sky-400 uppercase"
                    >
                      <option value="BROUILLON">BROUILLON</option>
                      <option value="PROFORMA">PROFORMA</option>
                      <option value="ATTENTE_APPROBATION_REMISE">ATTENTE REMISE</option>
                      <option value="DEFINITIVE">DÉFINITIVE</option>
                      <option value="PAYEE">PAYÉE</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedFacturePdf(fac)}
                      title="Visualiser le PDF officiel"
                      className="p-1.5 rounded-lg bg-blue-950 text-sky-400 hover:bg-blue-900 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://nomargueri.cd/pay/${fac.lienPaiementToken}`);
                        alert('Lien de paiement copié : https://nomargueri.cd/pay/' + fac.lienPaiementToken);
                      }}
                      title="Copier le lien de paiement client"
                      className="p-1.5 rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1 : CRÉATION D'UNE NOUVELLE FACTURE / DEVIS                        */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071329] border border-blue-900 rounded-3xl max-w-2xl w-full p-6 sm:p-7 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <h3 className="font-bold text-base text-white">
                Émettre une nouvelle Facture / Devis ({currentPole})
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreerFacture} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Défunt concerné</label>
                  <input
                    type="text"
                    value={defuntNom}
                    onChange={(e) => setDefuntNom(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Numéro de dossier</label>
                  <input
                    type="text"
                    value={selectedDossierRef}
                    onChange={(e) => setSelectedDossierRef(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nom du Client / Déclarant</label>
                  <input
                    type="text"
                    value={clientNom}
                    onChange={(e) => setClientNom(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Téléphone Client</label>
                  <input
                    type="text"
                    value={clientTel}
                    onChange={(e) => setClientTel(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              {/* Sélection des Prestations du Catalogue */}
              <div className="space-y-2 pt-2 border-t border-blue-950">
                <span className="font-semibold text-slate-300 block">Prestations à facturer :</span>
                <div className="bg-[#040A1A] rounded-xl p-3 border border-blue-950 space-y-2 max-h-40 overflow-y-auto">
                  {selectedArticles.map((art, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-blue-950/60 last:border-0">
                      <span className="truncate flex-1">{art.titre}</span>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="font-mono text-sky-400">${art.prixUSD} USD</span>
                        <button
                          type="button"
                          onClick={() => setSelectedArticles(selectedArticles.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calcul et Totaux */}
              <div className="bg-blue-950/40 rounded-xl p-3 border border-blue-900/60 space-y-1.5 text-right font-mono">
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Sous-total HT :</span>
                  <span>${sousTotalNewUSD.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>TVA (16%) :</span>
                  <span>${tvaNewUSD.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-blue-900/60">
                  <span>Total TTC :</span>
                  <span className="text-sky-300">${totalNewUSD.toFixed(2)} USD</span>
                </div>
                <div className="text-[11px] text-sky-400">
                  ≈ {Math.round(totalNewCDF).toLocaleString('fr-FR')} CDF (Taux : 2 800)
                </div>
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md"
                >
                  Générer la Facture Proforma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2 : PRÉVISUALISATION PDF OFFICIELLE                                */}
      {/* ========================================================================= */}
      {selectedFacturePdf && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6">
            {/* Header Facture */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase">HOSPITAL NOMARGUERI</h2>
                <p className="text-xs text-slate-600">Parcours Funéraire Souverain • Kinshasa</p>
                <p className="text-[11px] text-slate-500">N°10 AV/Mondo Q/Domaine-Village Mbezale C/Nsele</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-blue-700 block">{selectedFacturePdf.numeroFacture}</span>
                <span className="text-xs text-slate-500">Date : {selectedFacturePdf.dateCreation}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase block mt-1">
                  {selectedFacturePdf.statut}
                </span>
              </div>
            </div>

            {/* Client & Défunt */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Client / Représentant :</span>
                <strong className="text-slate-900 block mt-0.5">{selectedFacturePdf.clientNom}</strong>
                <span className="text-slate-600 font-mono">{selectedFacturePdf.clientTel}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[10px]">Défunt Pris en Charge :</span>
                <strong className="text-slate-900 block mt-0.5">{selectedFacturePdf.defuntNom}</strong>
                <span className="text-slate-600 font-mono">{selectedFacturePdf.dossierRef}</span>
              </div>
            </div>

            {/* Articles */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Prestation</th>
                    <th className="p-2.5 text-center">Qté</th>
                    <th className="p-2.5 text-right">Prix Unitaire</th>
                    <th className="p-2.5 text-right">Total USD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedFacturePdf.articles.map((a, i) => (
                    <tr key={i}>
                      <td className="p-2.5">{a.titre}</td>
                      <td className="p-2.5 text-center">{a.quantite}</td>
                      <td className="p-2.5 text-right font-mono">${a.prixUSD}</td>
                      <td className="p-2.5 text-right font-mono font-bold">${(a.prixUSD * a.quantite).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux & Signature */}
            <div className="flex justify-between items-end pt-2 text-xs">
              <div className="text-slate-500 text-[11px] space-y-1">
                <p>Paiements acceptés : M-Pesa, Orange Money, Airtel Money, Espèces.</p>
                <p className="font-mono">Jeton de certification QR : {selectedFacturePdf.lienPaiementToken}</p>
              </div>
              <div className="text-right space-y-1 font-mono">
                <p className="text-slate-600">Sous-total : ${selectedFacturePdf.sousTotalUSD.toFixed(2)}</p>
                <p className="text-slate-600">TVA (16%) : ${selectedFacturePdf.tvaUSD.toFixed(2)}</p>
                <p className="text-base font-black text-slate-900 border-t border-slate-300 pt-1">
                  Total : ${selectedFacturePdf.totalUSD.toFixed(2)} USD
                </p>
                <p className="text-xs text-blue-700 font-bold">
                  ≈ {Math.round(selectedFacturePdf.totalCDF).toLocaleString('fr-FR')} CDF
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedFacturePdf(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-semibold"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer la Facture PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
