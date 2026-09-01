import React, { useState, useEffect } from 'react';
import { X, Sliders, Shield, Save, CheckCircle2, RotateCcw } from 'lucide-react';

export default function GuardrailsModal({ isOpen, onClose }) {
  const [priceVariance, setPriceVariance] = useState(15);
  const [minConfidence, setMinConfidence] = useState(70);
  const [procurementMode, setProcurementMode] = useState('SPOT_FIRST');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('enterprise_guardrails') || '{}');
      if (saved.priceVariance) setPriceVariance(saved.priceVariance);
      if (saved.minConfidence) setMinConfidence(saved.minConfidence);
      if (saved.procurementMode) setProcurementMode(saved.procurementMode);
    } catch(e) {}
  }, [isOpen]);

  const handleSave = () => {
    const config = { priceVariance, minConfidence, procurementMode };
    localStorage.setItem('enterprise_guardrails', JSON.stringify(config));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setPriceVariance(15);
    setMinConfidence(70);
    setProcurementMode('SPOT_FIRST');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white dark:bg-[#0e131f] border border-gray-200 dark:border-indigo-500/30 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-black text-gray-900 dark:text-white">
              Enterprise Procurement Guardrails
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-sm">
          
          {/* Price Variance Ceiling */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-900 dark:text-white">Max Negotiated Price Ceiling Variance</span>
              <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                +{priceVariance}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={priceVariance}
              onChange={(e) => setPriceVariance(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <p className="text-[10px] text-gray-500">Autonomous Chase Agent rejects any vendor counter higher than +{priceVariance}% of base SAP price.</p>
          </div>

          {/* Minimum Evidence Confidence Gate */}
          <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-white/5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-900 dark:text-white">Minimum Evidence Confidence Gate</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {minConfidence}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[10px] text-gray-500">Requires at least {minConfidence}% tier-weighted confidence to trigger automated procurement plans.</p>
          </div>

          {/* Sourcing Preference */}
          <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-white/5">
            <label className="text-xs font-bold text-gray-900 dark:text-white block">Autonomous Sourcing Priority</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProcurementMode('SPOT_FIRST')}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-left ${
                  procurementMode === 'SPOT_FIRST'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'
                }`}
              >
                🛒 Spot Market First
                <span className="block text-[9px] font-normal text-gray-500 mt-0.5">Mouser / Arrow Parallel RFQ</span>
              </button>

              <button
                type="button"
                onClick={() => setProcurementMode('STO_FIRST')}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-left ${
                  procurementMode === 'STO_FIRST'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'
                }`}
              >
                🏭 Internal STO First
                <span className="block text-[9px] font-normal text-gray-500 mt-0.5">Inter-plant inventory transfer</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset Default
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Guardrails
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
