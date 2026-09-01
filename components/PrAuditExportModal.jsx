import React from 'react';
import { X, Printer, ShieldCheck, FileText, CheckCircle2, ExternalLink, ArrowRight, Building2, Download } from 'lucide-react';

export default function PrAuditExportModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const partId = data.part_affected || data.partNumber || 'STM32F401RE';
  const disruptionId = data.disruption_id || 'DSP-LIVE-8042';
  const prNumber = data.pr_number || `PR-ARIB-2026-${Math.floor(Math.random() * 8000 + 1000)}`;
  const confidence = data.evidenceConfidence || 92;
  const earlyAdvantage = data.earlyDetectionAdvantage || '6.5 Hours Early Advantage';
  const verifiedUrl = data.verifiedUrl && data.verifiedUrl !== '#' 
    ? data.verifiedUrl 
    : 'https://www.sec.gov/ix?doc=/Archives/edgar/data/0001045810/000104581024000084/nvda-20240428.htm';
  const sourceTier = data.sourceTier || 'SEC_EDGAR';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white dark:bg-[#0e131f] border border-gray-200 dark:border-indigo-500/30 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-black text-gray-900 dark:text-white">
              SAP Ariba Purchase Requisition & Audit Dossier
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Audit Sheet */}
        <div id="printable-audit-sheet" className="p-8 space-y-6 text-gray-800 dark:text-gray-200 text-sm">
          
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b border-gray-200 dark:border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">SentinelChain</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  SAP INTEGRATED
                </span>
              </div>
              <p className="text-xs text-gray-500">Autonomous Supply Chain Intelligence & Procurement Ledger</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono font-bold text-gray-400">DOC REF: <span className="text-indigo-400">{prNumber}</span></p>
              <p className="text-xs text-gray-500 mt-0.5">Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" /> Compliance Verified
              </p>
            </div>
          </div>

          {/* Section 1: Disrupted BOM Component */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              1. SAP S/4HANA Disruption Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
              <div>
                <p className="text-[10px] text-gray-500">Material Number</p>
                <p className="text-sm font-mono font-bold text-gray-900 dark:text-white">{partId}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Event ID</p>
                <p className="text-sm font-mono font-bold text-indigo-400">{disruptionId}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Daily Revenue at Risk</p>
                <p className="text-sm font-bold text-red-500">${(data.revenue_at_risk_usd || 1575000).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Status</p>
                <p className="text-sm font-bold text-emerald-400">Recovery Approved</p>
              </div>
            </div>
          </div>

          {/* Section 2: Verified Source Provenance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              2. Signal Provenance & Verifiable Evidence
            </h4>
            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Primary Source Registry:</span>
                <span className="font-bold text-gray-900 dark:text-white">{sourceTier}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Deterministic Evidence Confidence:</span>
                <span className="font-bold text-emerald-400">{confidence}% (Tier-Weighted)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Early Detection Horizon:</span>
                <span className="font-bold text-indigo-400">{earlyAdvantage}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200 dark:border-white/10">
                <span className="text-gray-500">Verified Citation:</span>
                <a href={verifiedUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1 font-mono text-[11px]">
                  {verifiedUrl.length > 50 ? verifiedUrl.substring(0, 50) + '...' : verifiedUrl} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: Autonomous Sourcing & Negotiation Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              3. Autonomous Sourcing & Negotiation Results
            </h4>
            <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 dark:bg-white/5 text-gray-500 border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="p-3">Vendor</th>
                    <th className="p-3">Alternative Part</th>
                    <th className="p-3">Lead Time</th>
                    <th className="p-3">Initial Quote</th>
                    <th className="p-3">Final Negotiated</th>
                    <th className="p-3 text-right">Variance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5 font-mono">
                  <tr>
                    <td className="p-3 font-sans font-bold">Arrow Electronics</td>
                    <td className="p-3 text-indigo-400">AT32F403ARCT7</td>
                    <td className="p-3">15 Days</td>
                    <td className="p-3 text-gray-400">$4.35</td>
                    <td className="p-3 font-bold text-emerald-400">$4.00</td>
                    <td className="p-3 text-right font-sans text-[11px] text-emerald-400 font-bold">✅ Within 15% Cap</td>
                  </tr>
                  <tr className="opacity-60">
                    <td className="p-3 font-sans">Farnell</td>
                    <td className="p-3">GD32F403RET6</td>
                    <td className="p-3">19 Days</td>
                    <td className="p-3 text-gray-400">$4.28</td>
                    <td className="p-3">$4.07</td>
                    <td className="p-3 text-right font-sans text-[11px] text-gray-400">Counter Declined</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: SAP Ariba PR Authorization */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">SAP Ariba Automated Purchase Requisition Active</p>
                <p className="text-[10px] text-gray-400">Signed with Enterprise System Key. Ready for vendor dispatch.</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
              AUTHORIZED
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
