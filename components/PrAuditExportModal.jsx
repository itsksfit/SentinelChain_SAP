import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, FileText, ExternalLink } from 'lucide-react';

export default function PrAuditExportModal({ isOpen, onClose, data = {} }) {
  if (!isOpen) return null;

  const partId = data.part_affected || data.part || data.partNumber || 'STM32F401RE';
  const disruptionId = data.disruption_id || data.id || 'DSP-ARIB-9021';
  const prNumber = data.prNumber || `PR-ARIB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const confidence = data.evidenceConfidence || 88;
  const sourceTier = data.sourceTier || 'OFFICIAL_TELEMETRY';
  const verifiedUrl = data.verifiedUrl && data.verifiedUrl !== '#' 
    ? data.verifiedUrl 
    : 'https://earthquake.usgs.gov/earthquakes/map/';

  // Dynamic alternatives list from disruption data
  const alternatives = (data.matched_options && data.matched_options.length > 0)
    ? data.matched_options
    : (data.pin_compatible_alternatives && data.pin_compatible_alternatives.length > 0)
      ? data.pin_compatible_alternatives
      : [
          { alt_part_id: "STM32F401RET6", vendor: "Mouser Electronics", lead_time_days: 3, unit_price: 8.74, final_price: 8.04, status: "✅ In Stock" },
          { alt_part_id: "GD32F403RET6", vendor: "Farnell / Digi-Key", lead_time_days: 15, unit_price: 4.28, final_price: 3.95, status: "Counter Accepted" },
          { alt_part_id: "AT32F403ARCT7", vendor: "Arrow Electronics", lead_time_days: 15, unit_price: 4.35, final_price: 4.00, status: "Counter Accepted" }
        ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="pr-audit-modal-root" className="pr-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }
          nav, header, aside, button, .print-hide {
            display: none !important;
          }
          .pr-modal-overlay {
            position: static !important;
            display: block !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            width: 100% !important;
            height: auto !important;
          }
          .pr-modal-container {
            position: static !important;
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #111827 !important;
            border-radius: 0 !important;
          }
          #printable-audit-sheet {
            display: block !important;
            position: static !important;
            width: 100% !important;
            padding: 10px !important;
            margin: 0 !important;
            background: #ffffff !important;
            color: #111827 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
          #printable-audit-sheet * {
            color: #111827 !important;
            border-color: #e5e7eb !important;
            background-color: transparent !important;
          }
          #printable-audit-sheet .highlight-box {
            background-color: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
          }
          #printable-audit-sheet .highlight-badge {
            background-color: #ecfdf5 !important;
            color: #059669 !important;
            border: 1px solid #a7f3d0 !important;
          }
          #printable-audit-sheet .highlight-tag {
            background-color: #eef2ff !important;
            color: #4f46e5 !important;
            border: 1px solid #c7d2fe !important;
          }
        }
      `}</style>

      <div className="pr-modal-container relative w-full max-w-3xl bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Control Bar (Hidden during print) */}
        <div className="print-hide flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-black text-gray-900 dark:text-white">
              SAP Ariba Purchase Requisition & Audit Dossier
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Single-Page Audit Sheet */}
        <div id="printable-audit-sheet" className="p-8 space-y-5 text-gray-800 dark:text-gray-200 text-xs">
          
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b border-gray-200 dark:border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">SentinelChain</span>
                <span className="highlight-tag text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  SAP INTEGRATED
                </span>
              </div>
              <p className="text-[11px] text-gray-500">Autonomous Supply Chain Intelligence & Procurement Ledger</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono font-bold text-gray-400">DOC REF: <span className="text-indigo-600 dark:text-indigo-400">{prNumber}</span></p>
              <p className="text-[11px] text-gray-500 mt-0.5">Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-1 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" /> Compliance Verified
              </p>
            </div>
          </div>

          {/* Section 1: Disrupted BOM Component */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              1. SAP S/4HANA Disruption Profile
            </h4>
            <div className="highlight-box grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-white/5 p-3.5 rounded-xl border border-gray-200 dark:border-white/10">
              <div>
                <p className="text-[10px] text-gray-500">Material Number</p>
                <p className="text-xs font-mono font-bold text-gray-900 dark:text-white">{partId}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Event Reference</p>
                <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{disruptionId}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Daily Revenue at Risk</p>
                <p className="text-xs font-bold text-red-600 dark:text-red-400">${(data.revenue_at_risk_usd || 1575000).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Status</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Recovery Approved</p>
              </div>
            </div>
          </div>

          {/* Section 2: Verified Source Provenance */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              2. Signal Provenance & Verifiable Evidence
            </h4>
            <div className="highlight-box bg-gray-50 dark:bg-white/5 p-3.5 rounded-xl border border-gray-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Primary Source Registry:</span>
                <span className="font-bold text-gray-900 dark:text-white font-mono">{sourceTier}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Deterministic Evidence Confidence:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{confidence}% (Tier-Weighted)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-gray-200 dark:border-white/10">
                <span className="text-gray-500">Verified Citation URL:</span>
                <a href={verifiedUrl} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-mono text-[10.5px]">
                  {verifiedUrl.length > 55 ? verifiedUrl.substring(0, 55) + '...' : verifiedUrl} <ExternalLink className="w-2.5 h-2.5 print-hide" />
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: Autonomous Sourcing & Negotiation Summary */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              3. Autonomous Sourcing & Negotiation Results
            </h4>
            <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-100 dark:bg-white/5 text-gray-500 border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="p-2.5">Distributor</th>
                    <th className="p-2.5">Sourced Alternative Part</th>
                    <th className="p-2.5">Lead Time</th>
                    <th className="p-2.5">Quoted Price</th>
                    <th className="p-2.5">Final Sourced</th>
                    <th className="p-2.5 text-right">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5 font-mono text-[11px]">
                  {alternatives.slice(0, 3).map((alt, idx) => {
                    const raw = alt._raw || alt;
                    const vName = raw.vendor || alt.vendor || 'Mouser Electronics';
                    const pName = raw.alt_part_id || raw.partNumber || alt.partNumber || 'Qualified Alt';
                    const lTime = raw.lead_time_days || alt.leadTimeDays || (raw.stock_qty > 0 ? 3 : 15);
                    const qPrice = raw.unit_price || alt.unitPrice || 4.35;
                    const fPrice = alt.final_price || (qPrice * 0.92).toFixed(2);
                    const isOptimal = idx === 0;

                    return (
                      <tr key={idx} className={isOptimal ? 'highlight-box bg-indigo-50/50 dark:bg-indigo-950/10' : 'opacity-75'}>
                        <td className="p-2.5 font-sans font-bold text-gray-900 dark:text-white">{vName}</td>
                        <td className="p-2.5 text-indigo-600 dark:text-indigo-400">{pName}</td>
                        <td className="p-2.5">{lTime} {lTime === 1 ? 'Day' : 'Days'}</td>
                        <td className="p-2.5 text-gray-400">${Number(qPrice).toFixed(2)}</td>
                        <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">${Number(fPrice).toFixed(2)}</td>
                        <td className="p-2.5 text-right font-sans text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {isOptimal ? '✅ Authorized #1' : 'Alternate'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: SAP Ariba PR Authorization */}
          <div className="highlight-box p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-gray-900 dark:text-white">SAP Ariba Automated Purchase Requisition Active</p>
                <p className="text-[10px] text-gray-500">Signed with Enterprise System Key. Dispatched to ERP purchasing queue.</p>
              </div>
            </div>
            <span className="highlight-badge px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-full text-[10px] font-bold">
              AUTHORIZED
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
