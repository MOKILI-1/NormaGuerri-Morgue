import React, { useState } from 'react';
import { QrCode, Search, Sparkles, X, ShieldCheck } from 'lucide-react';
import { DossierVivant } from '@nomarguerrie/shared-types';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (tokenOuNum: string) => void;
  activeDossierForQr?: DossierVivant;
  qrDataUrl?: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  activeDossierForQr,
  qrDataUrl
}) => {
  const [tokenInput, setTokenInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    onScanSuccess(tokenInput.trim());
    setTokenInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <QrCode className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {activeDossierForQr ? 'QR Code d’Identification' : 'Scanner un QR Code de Dossier'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeDossierForQr ? (
          /* Affichage du QR code d'un dossier actif */
          <div className="text-center space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl inline-block shadow-inner">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code Dossier" className="w-48 h-48 mx-auto" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400 font-mono">
                  Génération en cours...
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="font-mono font-bold text-slate-900 text-sm">
                {activeDossierForQr.numeroDossier}
              </p>
              <p className="text-xs text-slate-500">
                Défunt : {activeDossierForQr.defunt.prenom} {activeDossierForQr.defunt.nom}
              </p>
              <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-600 font-medium pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Jeton chiffré sécurisé MOKILI
              </div>
            </div>
          </div>
        ) : (
          /* Scanner / Recherche par QR */
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Scannez le bracelet du défunt, la fiche carton ou saisissez le code pour ouvrir le dossier dans votre contexte d'accréditation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Scanner ou coller le jeton QR / N° de dossier..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Résoudre & Ouvrir le Dossier
              </button>
            </form>

            {/* Raccourcis de test immédiat */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Tests de simulation rapide
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onScanSuccess('#NMG-2026-002581')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left font-mono text-[11px]"
                >
                  <span className="block font-bold text-slate-800">#NMG-2026-002581</span>
                  <span className="text-[10px] text-slate-500">Jean-Luc Kasanda</span>
                </button>
                <button
                  onClick={() => onScanSuccess('#NMG-2026-002574')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left font-mono text-[11px]"
                >
                  <span className="block font-bold text-slate-800">#NMG-2026-002574</span>
                  <span className="text-[10px] text-slate-500">Henriette Bompimo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
