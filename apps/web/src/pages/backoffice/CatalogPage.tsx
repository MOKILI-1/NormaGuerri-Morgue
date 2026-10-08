import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  DollarSign,
  Percent,
  CheckCircle2,
  Building2,
  Flower2,
  Edit,
  Trash2,
  Package,
  RefreshCw
} from 'lucide-react';
import { useBackoffice } from '../../context/BackofficeContext';
import { CATALOGUE_SERVICES_MOCK } from '../../data/mock-db';
import { ArticleCatalogue, CategorieService } from '@nomarguerrie/shared-types';

export const CatalogPage: React.FC = () => {
  const { currentPole } = useBackoffice();

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<ArticleCatalogue[]>([]);
  const [filtreCategorie, setFiltreCategorie] = useState<string>('TOUTES');
  const [recherche, setRecherche] = useState('');

  // Modal ajout/édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState<CategorieService>('ADMISSION');
  const [prixUSD, setPrixUSD] = useState('');
  const [tauxTVA, setTauxTVA] = useState('16');
  const [estStockable, setEstStockable] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setArticles(CATALOGUE_SERVICES_MOCK);
      setLoading(false);
    }, 250);
  }, [currentPole]);

  // Filtrage selon pôle
  const articlesFiltres = articles.filter((art) => {
    // Si Pôle MORGUE : ADMISSION, CONSERVATION, TOILETTE_ET_SOINS, ADMINISTRATIF
    // Si Pôle FUNERARIUM : CEREMONIE, FOURNITURE_FUNERAIRE, TRANSPORT, ADMINISTRATIF
    const matchPole =
      currentPole === 'MORGUE'
        ? art.categorie === 'ADMISSION' ||
          art.categorie === 'CONSERVATION' ||
          art.categorie === 'TOILETTE_ET_SOINS' ||
          art.categorie === 'ADMINISTRATIF'
        : art.categorie === 'CEREMONIE' ||
          art.categorie === 'FOURNITURE_FUNERAIRE' ||
          art.categorie === 'TRANSPORT' ||
          art.categorie === 'ADMINISTRATIF';

    const matchCat = filtreCategorie === 'TOUTES' || art.categorie === filtreCategorie;
    const matchSearch =
      art.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      art.code.toLowerCase().includes(recherche.toLowerCase()) ||
      art.description.toLowerCase().includes(recherche.toLowerCase());

    return matchPole && matchCat && matchSearch;
  });

  const handleAjouterArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const nouveau: ArticleCatalogue = {
      id: `art-${Date.now()}`,
      code: code || `SRV-${Math.floor(100 + Math.random() * 900)}`,
      titre,
      description,
      categorie,
      prixUnitaire: parseFloat(prixUSD) || 50,
      devise: 'USD',
      estStockable,
      uniteFacturation: estStockable ? 'UNITE' : 'FORFAIT'
    };

    setArticles([nouveau, ...articles]);
    setIsModalOpen(false);
    setCode('');
    setTitre('');
    setDescription('');
    setPrixUSD('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
        <span className="text-sm text-slate-300">Chargement du catalogue {currentPole}...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-blue-950">
        <div>
          <span className="text-xs text-sky-400 font-mono font-bold uppercase tracking-wider block">
            OFFRE COMMERCIALE & SERVICES
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Catalogue & Paramétrage des Prestations ({currentPole})
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Prestation</span>
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-[#050E22] border border-blue-950 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher code, désignation..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#030914] border border-blue-950 rounded-xl text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Catégories du pôle :</span>
          {['TOUTES', 'ADMISSION', 'CEREMONIE', 'TRANSPORT', 'FOURNITURE_FUNERAIRE', 'TOILETTE_ET_SOINS'].map((c) => (
            <button
              key={c}
              onClick={() => setFiltreCategorie(c)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                filtreCategorie === c ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grille des Articles du Catalogue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articlesFiltres.map((art) => (
          <div
            key={art.id}
            className="bg-[#050E22] border border-blue-950 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-blue-800 transition-colors shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] text-sky-400 font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-900">
                  {art.code}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {art.categorie}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm leading-snug">{art.titre}</h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{art.description}</p>
            </div>

            <div className="pt-3 border-t border-blue-950 flex items-center justify-between">
              <div>
                <span className="font-mono font-black text-white text-base">
                  ${art.prixUnitaire} {art.devise}
                </span>
                <span className="block text-[10px] text-sky-300 font-mono">
                  ≈ {(art.prixUnitaire * 2800).toLocaleString('fr-FR')} CDF
                </span>
              </div>

              <span className="text-[10px] px-2 py-1 rounded-full bg-slate-900 text-slate-300 border border-blue-950">
                {art.uniteFacturation} • TVA 16%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajout */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071329] border border-blue-900 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <h3 className="font-bold text-base">Ajouter une Prestation au Catalogue</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAjouterArticle} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Désignation du Service / Produit</label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  required
                  className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Code Service</label>
                  <input
                    type="text"
                    placeholder="Ex: SRV-SAL-03"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={categorie}
                    onChange={(e) => setCategorie(e.target.value as any)}
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  >
                    <option value="ADMISSION">Admission</option>
                    <option value="CEREMONIE">Cérémonie & Salons</option>
                    <option value="TRANSPORT">Axe Transport & Corbillard</option>
                    <option value="FOURNITURE_FUNERAIRE">Boutique & Fleurs</option>
                    <option value="TOILETTE_ET_SOINS">Soins & Thanatopraxie</option>
                    <option value="CONSERVATION">Conservation Frigorifique</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Prix de Base (USD)</label>
                  <input
                    type="number"
                    placeholder="Ex: 150"
                    value={prixUSD}
                    onChange={(e) => setPrixUSD(e.target.value)}
                    required
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Règle de Taxe</label>
                  <select
                    value={tauxTVA}
                    onChange={(e) => setTauxTVA(e.target.value)}
                    className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
                  >
                    <option value="16">TVA 16% (Standard)</option>
                    <option value="0">Exonéré (0%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description détaillée</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-[#040A1A] border border-blue-950 rounded-xl text-white"
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
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
