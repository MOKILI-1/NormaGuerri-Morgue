import React, { useState } from 'react';
import { DossierVivant, Sexe, TypeDemandeur } from '@nomarguerrie/shared-types';
import { PlusCircle, X, User, HeartHandshake } from 'lucide-react';

interface NouvelleAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    defunt: DossierVivant['defunt'];
    demandeur: DossierVivant['demandeur'];
  }) => Promise<void>;
}

export const NouvelleAdmissionModal: React.FC<NouvelleAdmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulaire Défunt
  const [defuntNom, setDefuntNom] = useState('');
  const [defuntPrenom, setDefuntPrenom] = useState('');
  const [defuntPostnom, setDefuntPostnom] = useState('');
  const [defuntSexe, setDefuntSexe] = useState<Sexe>('MASCULIN');
  const [defuntDateDeces, setDefuntDateDeces] = useState(new Date().toISOString().slice(0, 10));
  const [defuntLieuDeces, setDefuntLieuDeces] = useState('');
  const [defuntCauseDeces, setDefuntCauseDeces] = useState('');
  const [defuntCertificatDeces, setDefuntCertificatDeces] = useState('');
  const [defuntMedecin, setDefuntMedecin] = useState('');

  // Formulaire Demandeur
  const [demNom, setDemNom] = useState('');
  const [demPrenom, setDemPrenom] = useState('');
  const [demType, setDemType] = useState<TypeDemandeur>('FAMILLE');
  const [demLien, setDemLien] = useState('Enfant / Descendant');
  const [demTel, setDemTel] = useState('');
  const [demAdresse, setDemAdresse] = useState('');

  if (!isOpen) return null;

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!defuntNom || !defuntPrenom || !demNom || !demTel) {
      setError('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        defunt: {
          id: `def-${Date.now()}`,
          nom: defuntNom.toUpperCase(),
          prenom: defuntPrenom,
          postnom: defuntPostnom.toUpperCase(),
          sexe: defuntSexe,
          dateDeces: defuntDateDeces,
          lieuDeces: defuntLieuDeces || 'Kinshasa',
          causeDecesPresumee: defuntCauseDeces,
          numCertificatDeces: defuntCertificatDeces,
          medecinDeclarant: defuntMedecin
        },
        demandeur: {
          id: `dem-${Date.now()}`,
          nom: demNom.toUpperCase(),
          prenom: demPrenom,
          type: demType,
          lienParente: demLien,
          telephone: demTel,
          adresse: demAdresse,
          ville: 'Kinshasa'
        }
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <PlusCircle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Nouvelle Demande d'Admission</h2>
              <p className="text-xs text-slate-500">
                Étape {step} sur 2 : {step === 1 ? 'Identité du Défunt' : 'Proche / Demandeur'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
            {error}
          </div>
        )}

        {/* Étape 1 : Défunt */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nom *</label>
                <input
                  type="text"
                  placeholder="KASANDA"
                  value={defuntNom}
                  onChange={(e) => setDefuntNom(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Postnom</label>
                <input
                  type="text"
                  placeholder="TSHIYOYO"
                  value={defuntPostnom}
                  onChange={(e) => setDefuntPostnom(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Prénom *</label>
                <input
                  type="text"
                  placeholder="Jean-Luc"
                  value={defuntPrenom}
                  onChange={(e) => setDefuntPrenom(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Sexe</label>
                <select
                  value={defuntSexe}
                  onChange={(e) => setDefuntSexe(e.target.value as Sexe)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="MASCULIN">Masculin</option>
                  <option value="FEMININ">Féminin</option>
                  <option value="INDETERMINE">Indéterminé</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Date du Décès</label>
                <input
                  type="date"
                  value={defuntDateDeces}
                  onChange={(e) => setDefuntDateDeces(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Lieu du décès (Hôpital / Domicile)</label>
                <input
                  type="text"
                  placeholder="Clinique Ngaliema..."
                  value={defuntLieuDeces}
                  onChange={(e) => setDefuntLieuDeces(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">N° Certificat de décès</label>
                <input
                  type="text"
                  placeholder="CD-2026-..."
                  value={defuntCertificatDeces}
                  onChange={(e) => setDefuntCertificatDeces(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!defuntNom || !defuntPrenom) {
                    setError('Nom et prénom du défunt requis.');
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
              >
                Continuer vers Demandeur ➔
              </button>
            </div>
          </div>
        )}

        {/* Étape 2 : Demandeur */}
        {step === 2 && (
          <form onSubmit={handleSubmitFinal} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nom du Demandeur *</label>
                <input
                  type="text"
                  placeholder="KASANDA"
                  value={demNom}
                  onChange={(e) => setDemNom(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Prénom du Demandeur *</label>
                <input
                  type="text"
                  placeholder="Grâce"
                  value={demPrenom}
                  onChange={(e) => setDemPrenom(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Lien de parenté</label>
                <input
                  type="text"
                  placeholder="Fille aînée, Frère, Conjoint..."
                  value={demLien}
                  onChange={(e) => setDemLien(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Téléphone de contact *</label>
                <input
                  type="text"
                  placeholder="+243 81 000 0000"
                  value={demTel}
                  onChange={(e) => setDemTel(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Adresse de résidence (Kinshasa)</label>
              <input
                type="text"
                placeholder="Av. de la Justice n°45, Gombe"
                value={demAdresse}
                onChange={(e) => setDemAdresse(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>

            <div className="pt-3 border-t flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
              >
                ← Précédent
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-sm disabled:opacity-50"
              >
                {loading ? 'Création en cours...' : 'Créer le Dossier Vivant & Générer QR'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
