import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  HeartHandshake,
  QrCode,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  PhoneCall
} from 'lucide-react';
import { DossierVivant, Sexe } from '@nomarguerrie/shared-types';

interface LandingPageViewProps {
  onCreateDemand: (payload: {
    defunt: DossierVivant['defunt'];
    demandeur: DossierVivant['demandeur'];
  }) => Promise<void>;
  onSearchDossier: (numOuToken: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onCreateDemand,
  onSearchDossier
}) => {
  // Formulaire de demande en ligne
  const [defuntNom, setDefuntNom] = useState('');
  const [defuntPrenom, setDefuntPrenom] = useState('');
  const [defuntSexe, setDefuntSexe] = useState<Sexe>('MASCULIN');
  const [lieuDeces, setLieuDeces] = useState('');
  const [contactNom, setContactNom] = useState('');
  const [contactTel, setContactTel] = useState('');
  const [contactLien, setContactLien] = useState('Enfant / Descendant');

  const [searchDossierInput, setSearchDossierInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmitDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!defuntNom || !defuntPrenom || !contactNom || !contactTel) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setSubmitting(true);
    try {
      await onCreateDemand({
        defunt: {
          id: `def-${Date.now()}`,
          nom: defuntNom.toUpperCase(),
          prenom: defuntPrenom,
          sexe: defuntSexe,
          dateDeces: new Date().toISOString().slice(0, 10),
          lieuDeces: lieuDeces || 'Kinshasa',
          causeDecesPresumee: 'Mort naturelle'
        },
        demandeur: {
          id: `dem-${Date.now()}`,
          nom: contactNom.toUpperCase(),
          prenom: '',
          type: 'FAMILLE',
          lienParente: contactLien,
          telephone: contactTel,
          adresse: 'Kinshasa',
          ville: 'Kinshasa'
        }
      });
      setSuccessMessage('Votre demande a été enregistrée avec succès. Votre numéro de dossier vous a été attribué.');
      setDefuntNom('');
      setDefuntPrenom('');
      setLieuDeces('');
      setContactNom('');
      setContactTel('');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la soumission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchDossierInput.trim()) return;
    onSearchDossier(searchDossierInput.trim());
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP HEADER & NAVBAR PUBLIQUE (Sans aucune mention de backoffice) */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 border border-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                NomarGuerrie
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-400/30 font-semibold tracking-wide">
                  SOUVERAIN
                </span>
              </span>
              <p className="text-xs text-slate-400">Plateforme Moderne du Parcours Funéraire</p>
            </div>
          </div>

          {/* Navigation Liens */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-blue-400 transition-colors">Nos Services</a>
            <a href="#demarche" className="hover:text-blue-400 transition-colors">Démarches & Étapes</a>
            <a href="#demande" className="hover:text-blue-400 transition-colors">Demande en Ligne</a>
            <a href="#suivi" className="hover:text-blue-400 transition-colors">Suivre un Dossier</a>
          </nav>

          {/* Permanence Téléphonique 24/7 */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Assistance 24/7 : +243 81 000 0000</span>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texte Hero */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modernisation & Sérénité du Parcours Funéraire</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Accompagner vos proches avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">dignité, transparence</span> et respect.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                NomarGuerrie centralise et sécurise l'intégralité du parcours funéraire en RDC : identification infalsifiable par <strong>QR Code sécurisé</strong>, conservation frigorifique moderne, traçabilité des soins, transparence financière et assistance bienveillante 24h/24.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="#demande"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/25 transition-all text-center flex items-center justify-center gap-2"
                >
                  Faire une Demande Immédiate
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#services"
                  className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all text-center flex items-center justify-center gap-2"
                >
                  Découvrir les Services
                </a>
              </div>

              {/* Indicateurs clés sous le hero */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 text-center sm:text-left">
                <div>
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Traçabilité QR Code</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24h / 7j</p>
                  <p className="text-xs text-slate-400 mt-0.5">Permanence & Accueil</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Souverain</p>
                  <p className="text-xs text-slate-400 mt-0.5">Indépendance Réseau</p>
                </div>
              </div>
            </div>

            {/* Carte interactive : Suivi rapide d'un dossier */}
            <div id="suivi" className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Espace Famille & Suivi</h3>
                    <p className="text-xs text-slate-400">Consultez l'état d'un dossier avec son numéro unique</p>
                  </div>
                </div>

                <form onSubmit={handleSearchSubmit} className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ex: #NMG-2026-002581 ou jeton QR..."
                      value={searchDossierInput}
                      onChange={(e) => setSearchDossierInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Vérifier l'État du Dossier
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Garantie de Sécurité & Confidentialité
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Seuls les proches munis de l'identifiant officiel remis lors de l'admission ont accès au suivi de leur dossier et aux reçus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION SERVICES */}
      <section id="services" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Excellence Funéraire</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Des Prestations Pensées pour Soulager les Familles</h2>
            <p className="text-sm text-slate-400">
              Un accompagnement complet et respectueux des traditions pour honorer la mémoire de vos défunts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1 */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Conservation Frigorifique Contrôlée</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chambres froides modernes régulées électroniquement (+2°C à +4°C et négatif), avec surveillance 24/7 des températures et alimentation continue par onduleurs.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Toilette, Soins & Thanatopraxie</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Soins de présentation rigoureux, habillage, coiffage et thanatopraxie experte pour permettre aux proches de se recueillir dans la sérénité.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cercueils & Fournitures d'Honneur</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Large gamme de cercueils en bois noble massif (Acajou, Chêne), capitonnages soignés, croix, fleurs et ornements funéraires selon vos souhaits.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Chapelle de Recueillement</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Espace climatisé et intimiste pour célébrer des veillées ou cultes d'adieu dans le calme et le recueillement avant la levée de corps.
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Transport & Corbillards Prestige</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Véhicules funéraires grand confort climatisés avec chauffeurs professionnels pour le cortège vers l'église et les nécropoles de la ville.
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Assistance Légale & Documents</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prise en charge des formalités : enregistrement du certificat de décès, permis d'inhumer délivré par l'État Civil et autorisations judiciaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION DÉMARCHES EN 4 ÉTAPES */}
      <section id="demarche" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Simplicité & Rigueur</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Le Parcours en 4 Étapes Claires</h2>
            <p className="text-sm text-slate-400">
              Chaque étape est tracée pour éliminer toute ambiguïté ou perte de temps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 space-y-3 relative">
              <span className="text-4xl font-extrabold text-blue-500/30">01</span>
              <h4 className="text-base font-bold text-white">Demande d'Admission</h4>
              <p className="text-xs text-slate-400">
                Enregistrement de la famille en ligne ou au guichet avec le certificat médical initial.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 space-y-3 relative">
              <span className="text-4xl font-extrabold text-blue-500/30">02</span>
              <h4 className="text-base font-bold text-white">Attribution QR Code</h4>
              <p className="text-xs text-slate-400">
                Bracelet inviolable avec QR code sécurisé posé sur le défunt et fiche remise aux proches.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 space-y-3 relative">
              <span className="text-4xl font-extrabold text-blue-500/30">03</span>
              <h4 className="text-base font-bold text-white">Soins & Services</h4>
              <p className="text-xs text-slate-400">
                Choix du cercueil, des soins de présentation et du calendrier de la cérémonie.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 space-y-3 relative">
              <span className="text-4xl font-extrabold text-blue-500/30">04</span>
              <h4 className="text-base font-bold text-white">Double Validation</h4>
              <p className="text-xs text-slate-400">
                Contrôle rigoureux avant la levée de corps pour une sortie digne et en conformité absolue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FORMULAIRE DE DEMANDE EN LIGNE (INTERACTIF) */}
      <section id="demande" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Enregistrement Rapide</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Initier une Demande de Prise en Charge</h2>
            <p className="text-sm text-slate-400">
              Remplissez ces quelques informations pour ouvrir un dossier immédiat. Nos équipes vous contacteront sous 15 minutes.
            </p>
          </div>

          {successMessage && (
            <div className="p-4 bg-emerald-900/40 border border-emerald-600/50 text-emerald-200 rounded-xl text-sm flex items-center justify-between">
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 font-bold ml-4">×</button>
            </div>
          )}

          <form onSubmit={handleSubmitDemand} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">1. Renseignements du Défunt</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom du Défunt *</label>
                <input
                  type="text"
                  placeholder="KASANDA"
                  value={defuntNom}
                  onChange={(e) => setDefuntNom(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Prénom du Défunt *</label>
                <input
                  type="text"
                  placeholder="Jean-Luc"
                  value={defuntPrenom}
                  onChange={(e) => setDefuntPrenom(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Sexe</label>
                <select
                  value={defuntSexe}
                  onChange={(e) => setDefuntSexe(e.target.value as Sexe)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="MASCULIN">Masculin</option>
                  <option value="FEMININ">Féminin</option>
                  <option value="INDETERMINE">Indéterminé</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Lieu du Décès (Hôpital / Commune)</label>
                <input
                  type="text"
                  placeholder="Ex: Clinique Ngaliema, Kinshasa"
                  value={lieuDeces}
                  onChange={(e) => setLieuDeces(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="border-b border-slate-800 pb-3 pt-2">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">2. Coordonnées de la Famille</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom du Contact Proche *</label>
                <input
                  type="text"
                  placeholder="KASANDA Grâce"
                  value={contactNom}
                  onChange={(e) => setContactNom(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Téléphone de Contact *</label>
                <input
                  type="tel"
                  placeholder="+243 82 555 1234"
                  value={contactTel}
                  onChange={(e) => setContactTel(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Lien de Parenté</label>
                <input
                  type="text"
                  placeholder="Fille, Frère, Conjoint..."
                  value={contactLien}
                  onChange={(e) => setContactLien(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Transmission en cours...' : 'Soumettre la Demande & Créer le Dossier'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 6. FOOTER (Totalement sobre, public) */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              N
            </div>
            <span>NomarGuerrie • Plateforme Souveraine de Gestion du Parcours Funéraire</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <span>Kinshasa, RD Congo</span>
            <span>•</span>
            <span>Service d'Urgence 24h/24</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
