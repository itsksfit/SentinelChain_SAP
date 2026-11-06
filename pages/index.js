import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Activity, AlertTriangle, ShieldCheck, Cpu, Box, 
  Search, MessageSquare, CheckCircle, Clock, Zap,
  Menu, Bell, User, LayoutDashboard, Database, Settings, ShieldAlert, RefreshCw, ArrowRight,
  ExternalLink, Layers, Radio, Globe as GlobeIcon, FileText, Check, TrendingUp, TrendingDown,
  Sparkles, CheckCircle2, Sliders, ChevronRight, Factory, Package, ArrowUpRight, BarChart3,
  SlidersHorizontal, CheckSquare
} from 'lucide-react';
import events from '../data/events.json';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PrAuditExportModal from '../components/PrAuditExportModal';
import SourceRegistryScraperModal from '../components/SourceRegistryScraperModal';
import SpendProtectedChart from '../components/SpendProtectedChart';
import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('../components/WorldMap'), { ssr: false });

export async function getServerSideProps() {
  try {
    const { getLatestDisruptions } = require('../lib/intelligence/newsClient');
    const { explodeBOM } = require('../lib/sap/bomEngine');
    const signals = await getLatestDisruptions();

    // Explode real SAP S/4HANA BOMs for all key tracked enterprise materials
    const trackedParts = [
      'STM32F401RE',
      'TPS54331DR',
      'BMI270',
      'MT29F64G08AECABH1',
      'XC7Z020-1CLG400C',
      'MCU-2201X',
      'PWR-9942A'
    ];

    const partDetails = {
      'STM32F401RE': { name: 'Main Engine Controller', category: 'Microcontrollers (MCU)', daysOfSupply: 5, safetyStock: 12000, inventoryOnHand: 2200, unitCost: 4.85 },
      'TPS54331DR': { name: 'Automotive Powertrain Inverter', category: 'Power ICs (PMIC)', daysOfSupply: 8, safetyStock: 25000, inventoryOnHand: 7400, unitCost: 1.62 },
      'BMI270': { name: 'Inertial Navigation Unit', category: 'Inertial Sensors (IMU)', daysOfSupply: 14, safetyStock: 8000, inventoryOnHand: 4100, unitCost: 3.20 },
      'MT29F64G08AECABH1': { name: 'Industrial Telemetry Gateway', category: 'Flash Memory (NAND)', daysOfSupply: 18, safetyStock: 15000, inventoryOnHand: 9200, unitCost: 8.90 },
      'XC7Z020-1CLG400C': { name: 'Robotics Core Compute Board', category: 'SoC / FPGA', daysOfSupply: 6, safetyStock: 5000, inventoryOnHand: 950, unitCost: 38.50 },
      'MCU-2201X': { name: 'ADAS Sensor Fusion Module', category: 'Automotive Compute', daysOfSupply: 7, safetyStock: 10000, inventoryOnHand: 3100, unitCost: 12.40 },
      'PWR-9942A': { name: 'High-Voltage Battery BMS', category: 'BMS Management', daysOfSupply: 12, safetyStock: 18000, inventoryOnHand: 8400, unitCost: 6.75 }
    };

    let affectedProducts = [];
    for (const part of trackedParts) {
      try {
        const bomResult = await explodeBOM(part);
        if (bomResult && bomResult.affectedProducts) {
          const detail = partDetails[part] || { name: 'Electronic Assembly', category: 'Discrete IC', daysOfSupply: 10, safetyStock: 10000, inventoryOnHand: 5000, unitCost: 5.00 };
          const prods = bomResult.affectedProducts.map((pName, idx) => ({
            productCode: `SAP-FG-${part.substring(0, 4)}-${100 + idx}`,
            productName: pName,
            assemblyId: `ASM-${part.substring(0, 3)}-${2026 + idx}`,
            bottleneckPart: part,
            category: detail.category,
            plant: bomResult.plantsAffected ? bomResult.plantsAffected[idx % bomResult.plantsAffected.length] : (idx % 2 === 0 ? 'Plant 1010 (Stuttgart)' : 'Plant 2040 (Austin)'),
            dailyRevenue: bomResult.revenueAtRiskPerDay ? Math.round(bomResult.revenueAtRiskPerDay / bomResult.affectedProducts.length) : (250000 + idx * 75000),
            daysOfSupply: detail.daysOfSupply,
            inventoryOnHand: detail.inventoryOnHand,
            safetyStock: detail.safetyStock,
            runout: `${detail.daysOfSupply}d`
          }));
          affectedProducts = [...affectedProducts, ...prods];
        }
      } catch (err) {
        console.error(`Error exploding BOM for ${part}:`, err);
      }
    }

    // Default fallback list
    if (affectedProducts.length === 0) {
      affectedProducts = [
        { productCode: 'SAP-FG-STM3-101', productName: 'Automotive Telematics Gateway v4', assemblyId: 'ASM-STM-2026', bottleneckPart: 'STM32F401RE', category: 'Microcontrollers (MCU)', plant: 'Plant 1010 (Stuttgart)', dailyRevenue: 450000, daysOfSupply: 5, inventoryOnHand: 2200, safetyStock: 12000, runout: '5d' },
        { productCode: 'SAP-FG-TPS5-102', productName: 'Smart Power Inverter Module', assemblyId: 'ASM-TPS-2027', bottleneckPart: 'TPS54331DR', category: 'Power ICs (PMIC)', plant: 'Plant 2040 (Austin)', dailyRevenue: 320000, daysOfSupply: 8, inventoryOnHand: 7400, safetyStock: 25000, runout: '8d' },
        { productCode: 'SAP-FG-BMI2-103', productName: 'ADAS Sensor Fusion Subsystem', assemblyId: 'ASM-BMI-2028', bottleneckPart: 'BMI270', category: 'Inertial Sensors (IMU)', plant: 'Plant 1010 (Stuttgart)', dailyRevenue: 280000, daysOfSupply: 14, inventoryOnHand: 4100, safetyStock: 8000, runout: '14d' },
        { productCode: 'SAP-FG-MT29-104', productName: 'Aerospace Flight Computer Bus', assemblyId: 'ASM-MT2-2029', bottleneckPart: 'MT29F64G08AECABH1', category: 'Flash Memory (NAND)', plant: 'Plant 3020 (Munich)', dailyRevenue: 525000, daysOfSupply: 18, inventoryOnHand: 9200, safetyStock: 15000, runout: '18d' },
      ];
    }

    return {
      props: {
        initialSignals: signals || [],
        affectedProducts: affectedProducts || []
      }
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialSignals: [],
        affectedProducts: [
          { productCode: 'SAP-FG-STM3-101', productName: 'Automotive Telematics Gateway v4', assemblyId: 'ASM-STM-2026', bottleneckPart: 'STM32F401RE', category: 'Microcontrollers (MCU)', plant: 'Plant 1010 (Stuttgart)', dailyRevenue: 450000, daysOfSupply: 5, inventoryOnHand: 2200, safetyStock: 12000, runout: '5d' },
          { productCode: 'SAP-FG-TPS5-102', productName: 'Smart Power Inverter Module', assemblyId: 'ASM-TPS-2027', bottleneckPart: 'TPS54331DR', category: 'Power ICs (PMIC)', plant: 'Plant 2040 (Austin)', dailyRevenue: 320000, daysOfSupply: 8, inventoryOnHand: 7400, safetyStock: 25000, runout: '8d' },
        ]
      }
    };
  }
}

export default function Home({ initialSignals = [], affectedProducts = [] }) {
  const router = useRouter();
  
  const [stage, setStage] = useState(0); // 0: Idle, 1: Detected, 2: Impact, 3: Matched
  const [loading, setLoading] = useState(false);
  const [detectResult, setDetectResult] = useState(null);
  const [impactResult, setImpactResult] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [auditTrail, setAuditTrail] = useState([]);
  const [sapStatus, setSapStatus] = useState(null);
  
  // Real SAP S/4HANA BOM filter state
  const [selectedPlantFilter, setSelectedPlantFilter] = useState('ALL');
  const [bomSortBy, setBomSortBy] = useState('revenue');

  // PR Audit Dossier Modal
  const [showPrModal, setShowPrModal] = useState(false);

  // Live Multi-Source Ingestion States
  const [liveNews, setLiveNews] = useState(initialSignals);
  const [filterTier, setFilterTier] = useState('ALL');
  const [activeNews, setActiveNews] = useState(initialSignals.length > 0 ? initialSignals[0] : null);
  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const [isSearchingNews, setIsSearchingNews] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const SCAN_CYCLE_SECONDS = 24 * 60 * 60; // 24 Hours Cycle (86,400s)
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [scanCountdown, setScanCountdown] = useState(SCAN_CYCLE_SECONDS);
  const [lastScannedTime, setLastScannedTime] = useState(new Date().toLocaleTimeString());

  // Formatter for 24-hour countdown display (e.g., 23h 59m 45s)
  const formatScanCountdown = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  };

  // Scraper Modal State
  const [showScraperModal, setShowScraperModal] = useState(false);
  const [selectedSignalForScrape, setSelectedSignalForScrape] = useState(null);

  const fetchNews = async (query = '', forceRefresh = false) => {
    setIsRefreshing(true);
    setIsLiveScanning(true);
    let url = '/api/news/latest';
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (forceRefresh) params.append('refresh', 'true');
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    try {
      const r = await fetch(url);
      const news = await r.json();
      if (Array.isArray(news) && news.length > 0) {
        setLiveNews(news);
        setActiveNews(prev => prev || news[0]);
        setLastScannedTime(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Failed to fetch live disruption signals:", error);
    } finally {
      setIsRefreshing(false);
      setTimeout(() => {
        setIsLiveScanning(false);
      }, 500);
    }
  };

  const handleManualScan = () => {
    setScanCountdown(SCAN_CYCLE_SECONDS);
    fetchNews(newsSearchQuery, true);
  };

  const handleOpenScraperModal = (sig, e) => {
    if (e) e.stopPropagation();
    setSelectedSignalForScrape(sig);
    setShowScraperModal(true);
  };

  const stageRef = useRef(stage);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    fetch('/api/sap/status').then(r => r.json()).then(setSapStatus);
    fetchNews('', false);
    
    const ticker = setInterval(() => {
      setScanCountdown(prev => {
        if (prev <= 1) {
          if (stageRef.current === 0 && !isSearchingNews) {
            fetchNews('', true);
          }
          return SCAN_CYCLE_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ticker);
  }, [isSearchingNews]);

  const threatSectionRef = useRef(null);

  const addAudit = (source, message) => {
    setAuditTrail(prev => [...prev, { time: new Date().toISOString(), source, message }]);
  };

  const simulatePipeline = async (newsArticle) => {
    setLoading(true);
    setStage(1);
    setAuditTrail([]);

    if (typeof window !== 'undefined' && threatSectionRef.current) {
      threatSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 1. Detect (Entity Extraction + Private Deterministic BOM Correlation)
    const r1 = await fetch('/api/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: newsArticle })
    });
    const d1 = await r1.json();
    setDetectResult(d1);
    addAudit('Groq LPU Entity Extractor', `Disruption signal processed: ${d1.reason}`);
    addAudit('BOM Correlation Engine', `Confidence: ${d1.evidenceConfidence}%. Affected MPN identified: ${d1.partNumber}`);

    if (d1.severity === 'None' || !d1.partNumber) {
      setLoading(false);
      addAudit('Decision Matrix', 'Material impact deemed non-critical. No assembly line action required.');
      return;
    }

    await new Promise(r => setTimeout(r, 1200));
    setStage(2);

    // 2. Impact (Explode SAP S/4HANA BOM Tree)
    const r2 = await fetch('/api/impact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        partNumber: d1.partNumber,
        severity: d1.severity,
        confidence: d1.evidenceConfidence
      })
    });
    const d2 = await r2.json();
    setImpactResult(d2);
    addAudit('SAP S/4HANA OData', `Material ${d1.partNumber} exploded in ERP BOM tree`);
    addAudit('AI Impact Officer', `${(d2.affectedProducts || []).length} finished assembly lines mapped with $${(d2.revenueAtRiskPerDay || 1575000).toLocaleString()}/day revenue exposure`);

    await new Promise(r => setTimeout(r, 1200));
    setStage(3);

    // 3. Match (Spot Market Sourcing via Mouser / Catalog)
    const r3 = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partNumber: d1.partNumber })
    });
    const d3 = await r3.json();
    setMatchResult(d3);
    addAudit('Mouser Electronics API', `${d3.length} pin-compatible replacement alternatives discovered with live spot inventory`);

    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    
    addAudit('SAP Ariba PR Settlement', 'Automated Purchase Requisition staged within +10% cost-ceiling guardrails. Awaiting human commitment.');
    
    const newRecord = {
      disruption_id: "DSP-LIVE-" + Math.floor(Math.random() * 10000),
      event_type: d1.reason || "Operational Anomaly Identified",
      part_affected: d1.partNumber,
      severity: d1.severity,
      revenue_at_risk_usd: d2.revenueAtRiskPerDay || 1575000,
      status: "Awaiting Decision",
      evidenceConfidence: d1.evidenceConfidence || 92,
      verifiedUrl: d1.verifiedUrl || newsArticle.verifiedUrl || "#",
      sourceTier: d1.sourceTier || newsArticle.sourceTier || "CORPORATE_DISCLOSURE",
      source: newsArticle.source || "Multi-Source Feed",
      correlationDetails: d1.correlationDetails,
      plants_affected: 3,
      products_affected: d2.affectedProducts?.length || 3,
      orders_at_risk: 42,
      matched_options: d3,
      detected_at: new Date().toISOString()
    };
    
    try {
      const current = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
      localStorage.setItem('custom_disruptions', JSON.stringify([newRecord, ...current]));
    } catch(e) {}
    
    setMatchResult(newRecord);
  };

  const getSourceBadge = (tier) => {
    switch(tier) {
      case 'SEC_EDGAR':
        return { label: 'SEC EDGAR (10-K/8-K)', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40' };
      case 'OFFICIAL_IR':
        return { label: 'Official IR (Non-U.S.)', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/40' };
      case 'FED_REGISTER_BIS':
        return { label: 'Federal Register (BIS)', color: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40' };
      case 'USGS_SEISMIC':
        return { label: 'USGS Seismic Sensor', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40' };
      case 'NEWS_BASELINE':
        return { label: 'Media Wire Baseline', color: 'bg-secondary-100 text-secondary-700 border-secondary-200 dark:bg-secondary-800 dark:text-secondary-300 dark:border-secondary-700' };
      default:
        return { label: 'Primary Disclosure', color: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/40 dark:text-primary-400 dark:border-primary-900/40' };
    }
  };

  const filteredSignals = liveNews.filter(s => {
    if (filterTier === 'ALL') return true;
    if (filterTier === 'SEC_IR') return s.sourceTier === 'SEC_EDGAR' || s.sourceTier === 'OFFICIAL_IR';
    return s.sourceTier === filterTier;
  });

  // Filter & sort real SAP BOM products
  const filteredSapProducts = affectedProducts.filter(prod => {
    if (selectedPlantFilter === 'ALL') return true;
    return prod.plant.toUpperCase().includes(selectedPlantFilter);
  }).sort((a, b) => {
    if (bomSortBy === 'runout') {
      const getDays = (s) => {
        const m = (s || '').match(/(\d+)d/);
        return m ? parseInt(m[1]) : 999;
      };
      return getDays(a.runout) - getDays(b.runout);
    }
    return (b.dailyRevenue || 0) - (a.dailyRevenue || 0);
  });

  const totalSapRevenueAtRisk = affectedProducts.reduce((sum, p) => sum + (p.dailyRevenue || 0), 0);

  return (
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-[#0A0C10] text-secondary-900 dark:text-white transition-colors duration-200 antialiased font-sans">
      <Head>
        <title>SentinelChain | Autonomous Supply Chain Control Tower</title>
        <meta name="description" content="Autonomous B2B Supply Chain Risk Intelligence & Real-Time SAP S/4HANA Remediation Platform." />
      </Head>

      <Sidebar />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-7 max-w-[1600px] mx-auto w-full space-y-8 pb-28 min-w-0">
          
          {/* ======================================================== */}
          {/* SECTION 1: OPERATIONS TOWER & REVENUE EXPOSURE MATRIX    */}
          {/* ======================================================== */}
          <div className="space-y-6">
            
            {/* Control Strip & Operational Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#121620] border border-[#E5E7EB] dark:border-[#222736] shadow-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800/60 text-xs font-mono font-bold text-primary-600 dark:text-primary-400">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                  OPERATIONAL RADAR
                </div>

                <div className="flex items-center gap-2 text-xs font-mono font-medium text-secondary-600 dark:text-secondary-400">
                  <span>SAP Backbone:</span>
                  <span className="text-secondary-900 dark:text-white font-bold">API_BILL_OF_MATERIAL_SRV</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                    OData Active
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#F6F8FA] dark:bg-[#181D2A] border border-[#E5E7EB] dark:border-[#2A3347] rounded-xl px-3 py-1.5 text-xs font-mono font-semibold text-secondary-600 dark:text-secondary-400">
                  <Clock className="w-3.5 h-3.5 text-primary-500" />
                  <span>Telemetry Window:</span>
                  <span className="font-bold text-secondary-900 dark:text-white">Live 24h</span>
                </div>

                {(loading || stage > 0) && (
                  <button 
                    onClick={() => { 
                      setStage(0); 
                      setDetectResult(null); 
                      setImpactResult(null); 
                      setMatchResult(null); 
                      setAuditTrail([]); 
                      setActiveNews(null); 
                    }}
                    className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white bg-white dark:bg-[#161B26] hover:bg-secondary-100 rounded-xl transition-all border border-[#E5E7EB] dark:border-[#2A3347] cursor-pointer shadow-xs"
                  >
                    Reset Triage Pipeline
                  </button>
                )}
              </div>
            </div>

            {/* Operations Title & Action Strip */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-secondary-900 dark:text-white">
                  Semiconductor Supply Operations Tower
                </h1>
                <p className="text-secondary-600 dark:text-secondary-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
                  Autonomous threat correlation across USGS seismic sensors, Federal Register BIS export controls, and corporate SEC disclosures, cross-referenced with SAP S/4HANA Bill of Materials and live Mouser spot inventory.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button 
                  onClick={() => {
                    if (liveNews.length > 0) simulatePipeline(liveNews[0]);
                  }}
                  className="h-11 px-5 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Execute Threat Triage</span>
                </button>

                <Link 
                  href="/disruptions" 
                  className="h-11 px-4.5 bg-white dark:bg-[#141824] hover:bg-secondary-50 dark:hover:bg-[#1B2030] text-secondary-900 dark:text-white border border-[#E5E7EB] dark:border-[#262B3B] text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Signals</span>
                  <ArrowRight className="w-3.5 h-3.5 text-secondary-400" />
                </Link>

                <Link 
                  href="/plans" 
                  className="h-11 px-4.5 bg-white dark:bg-[#141824] hover:bg-secondary-50 dark:hover:bg-[#1B2030] text-secondary-900 dark:text-white border border-[#E5E7EB] dark:border-[#262B3B] text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Recovery PRs</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </Link>
              </div>
            </div>

            {/* High-Density 4-Card Executive Threat Matrix (Unified Ground Truth) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Metric Card 1: Revenue at Risk */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#121620] border border-[#E5E7EB] dark:border-[#222736] shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-secondary-500 dark:text-secondary-400">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                    Total Daily Revenue Exposure
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40">
                    CRITICAL
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-red-600 dark:text-red-400 tracking-tight">
                    ${(totalSapRevenueAtRisk / 1000000).toFixed(2)}M <span className="text-xs font-normal text-secondary-500">/ day</span>
                  </div>
                  <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                    Across 4 impacted manufacturing assembly plants
                  </p>
                </div>
                <div className="pt-2.5 border-t border-[#F0F2F5] dark:border-[#1E232F] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-secondary-500">Primary Bottleneck:</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">STM32F401RE</span>
                </div>
              </div>

              {/* Metric Card 2: Assembly Plant Line Buffers */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#121620] border border-[#E5E7EB] dark:border-[#222736] shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-secondary-500 dark:text-secondary-400">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                    Critical Line Buffers
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40">
                    &lt; 5D RUNOUT
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400 tracking-tight">
                    3 Assembly Lines
                  </div>
                  <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                    Stuttgart #1010, Austin #2040 facing stockout
                  </p>
                </div>
                <div className="pt-2.5 border-t border-[#F0F2F5] dark:border-[#1E232F] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-secondary-500">Fastest Runout:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">Plant 1010 (5 Days)</span>
                </div>
              </div>

              {/* Metric Card 3: Ingestion Telemetry Signals */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#121620] border border-[#E5E7EB] dark:border-[#222736] shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-secondary-500 dark:text-secondary-400">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                    Active Telemetry Signals
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
                    VERIFIED
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-secondary-900 dark:text-white tracking-tight">
                    {liveNews.length > 0 ? liveNews.length : 14} Signals
                  </div>
                  <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                    USGS Seismic (M4+), BIS Export Rules, SEC 10-Q
                  </p>
                </div>
                <div className="pt-2.5 border-t border-[#F0F2F5] dark:border-[#1E232F] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-secondary-500">Signal Confidence:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">94.2% Tier-Weighted</span>
                </div>
              </div>

              {/* Metric Card 4: Sourcing Guardrails */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#121620] border border-[#E5E7EB] dark:border-[#222736] shadow-xs flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-secondary-500 dark:text-secondary-400">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                    Autonomous Settlement
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                    100% GUARDRAILED
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                    14,200 pcs
                  </div>
                  <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-1 leading-snug">
                    Mouser spot stock allocated under +10% price ceiling
                  </p>
                </div>
                <div className="pt-2.5 border-t border-[#F0F2F5] dark:border-[#1E232F] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-secondary-500">SAP Ariba PR:</span>
                  <span className="font-bold text-secondary-900 dark:text-white">Auto-Prepared</span>
                </div>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* SECTION 2: SILICON CORRIDOR RADAR & CAPITAL TERMINAL     */}
          {/* ======================================================== */}
          <div className="bg-white dark:bg-[#121620] rounded-2xl border border-[#E5E7EB] dark:border-[#222736] p-6 sm:p-7 space-y-6 shadow-xs">
            
            {/* Header Control Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F0F2F5] dark:border-[#202636]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/50 border border-primary-200/80 dark:border-primary-800/60 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black font-mono uppercase tracking-wider text-secondary-900 dark:text-white">
                    Global Semiconductor Corridors & Capital Preservation
                  </h2>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                    Live Foundry Telemetry (Hsinchu, Tainan, Dresden, Austin) and Autonomous Margin Protection
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/40 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  20+ Live Fab Corridors Monitored
                </span>
              </div>
            </div>

            {/* DUAL BALANCED ANALYTICAL PANELS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Panel: Global Disruption WorldMap (7 Columns / ~58%) */}
              <div className="lg:col-span-7 border border-[#E5E7EB] dark:border-[#262B3B] rounded-2xl overflow-hidden bg-[#F8F9FA] dark:bg-[#0C0F17] relative shadow-inner min-h-[440px] flex flex-col justify-between">
                <div className="p-3.5 bg-white/95 dark:bg-[#0E1118]/90 backdrop-blur border-b border-[#E5E7EB] dark:border-white/10 flex items-center justify-between text-secondary-900 dark:text-white z-10">
                  <div className="flex items-center gap-2 font-mono">
                    <GlobeIcon className="w-4 h-4 text-primary-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Foundry Geographic Telemetry</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30">APAC: TSMC Tainan</span>
                    <span className="px-2 py-0.5 rounded bg-secondary-100 dark:bg-white/10 text-secondary-700 dark:text-white/70">EMEA: Silicon Saxony</span>
                    <span className="px-2 py-0.5 rounded bg-secondary-100 dark:bg-white/10 text-secondary-700 dark:text-white/70">Americas: TI Sherman</span>
                  </div>
                </div>

                <div className="flex-1 relative flex items-center justify-center">
                  <WorldMap />
                </div>
              </div>

              {/* Right Panel: Interactive Capital Protection Terminal (5 Columns / ~42%) */}
              <SpendProtectedChart />
            </div>

          </div>

          {/* ======================================================== */}
          {/* SECTION 3: MANUFACTURING IMPACT & SAP S/4HANA BOM TABLE  */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB] dark:border-[#222222]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-5 h-5 text-primary-500" />
                  <h2 className="text-lg sm:text-xl font-black font-mono text-secondary-900 dark:text-white tracking-tight uppercase">
                    Manufacturing Line Impact & SAP S/4HANA BOM
                  </h2>
                </div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  Bill of Materials explosion (<code className="text-primary-600 dark:text-primary-400 font-mono font-bold">API_BILL_OF_MATERIAL_SRV</code>) isolating component bottlenecks, plant runout buffers, and daily revenue-at-risk.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                  {filteredSapProducts.length} Assemblies at Risk (${(totalSapRevenueAtRisk / 1000000).toFixed(2)}M/d)
                </span>

                {/* Sort Order Toggle */}
                <div className="flex items-center gap-1 bg-secondary-100 dark:bg-[#181D2A] p-1 rounded-xl border border-[#E5E7EB] dark:border-[#2A3347]">
                  <span className="text-[11px] font-mono uppercase font-bold text-secondary-500 px-1.5">Sort:</span>
                  <button
                    onClick={() => setBomSortBy('revenue')}
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      bomSortBy === 'revenue'
                        ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 shadow-2xs'
                        : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                    }`}
                  >
                    Revenue at Risk
                  </button>
                  <button
                    onClick={() => setBomSortBy('runout')}
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      bomSortBy === 'runout'
                        ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 shadow-2xs'
                        : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                    }`}
                  >
                    Urgent Runout
                  </button>
                </div>
                
                {/* Plant Filter Pills */}
                <div className="flex items-center gap-1 bg-secondary-100 dark:bg-[#181D2A] p-1 rounded-xl border border-[#E5E7EB] dark:border-[#2A3347]">
                  {['ALL', 'STUTTGART', 'AUSTIN', 'MUNICH'].map(pl => (
                    <button
                      key={pl}
                      onClick={() => setSelectedPlantFilter(pl)}
                      className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        selectedPlantFilter === pl
                          ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 shadow-2xs'
                          : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                      }`}
                    >
                      {pl === 'ALL' ? 'All Plants' : pl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Industrial High-Density SAP BOM Table */}
            <div className="bg-white dark:bg-[#121620] rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-[#222736] shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-[#222736] bg-[#F8F9FA] dark:bg-[#161B26] text-[11px] font-mono font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
                      <th className="px-5 py-3.5">Finished Product & SAP Code</th>
                      <th className="px-5 py-3.5">Assembly Plant</th>
                      <th className="px-5 py-3.5">Bottleneck Component MPN</th>
                      <th className="px-5 py-3.5">Revenue-at-Risk</th>
                      <th className="px-5 py-3.5">Stock Buffer / Runout Gauge</th>
                      <th className="px-5 py-3.5 text-right">Autonomous Resolution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1E232F] font-mono">
                    {filteredSapProducts.slice(0, 8).map((prod, idx) => (
                      <tr key={idx} className="hover:bg-[#F9FAFB] dark:hover:bg-[#161C28] transition-colors">
                        <td className="px-5 py-3.5 font-sans">
                          <div className="font-extrabold text-secondary-900 dark:text-white text-xs sm:text-sm">
                            {prod.productName}
                          </div>
                          <span className="font-mono text-xs text-primary-600 dark:text-primary-400 font-bold">{prod.productCode}</span>
                          <span className="text-[11px] text-secondary-400 ml-2 font-mono">({prod.assemblyId})</span>
                        </td>

                        <td className="px-5 py-3.5 font-sans">
                          <div className="flex items-center gap-1.5 text-secondary-800 dark:text-secondary-200 font-semibold text-xs">
                            <Factory className="w-3.5 h-3.5 text-secondary-400" />
                            <span>{prod.plant}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="font-mono font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 px-2.5 py-1 rounded-md">
                            {prod.bottleneckPart}
                          </span>
                          <span className="text-[11px] text-secondary-500 dark:text-secondary-400 font-sans ml-2">{prod.category}</span>
                        </td>

                        <td className="px-5 py-3.5 font-black text-red-600 dark:text-red-400 text-sm">
                          ${(prod.dailyRevenue / 1000).toFixed(0)}k<span className="text-xs font-normal text-secondary-400 font-sans">/day</span>
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className={`font-bold uppercase tracking-wider ${
                                prod.daysOfSupply <= 5 ? 'text-red-600 dark:text-red-400' : prod.daysOfSupply <= 10 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {prod.daysOfSupply <= 5 ? `Critical: ${prod.daysOfSupply}d Runout` : `${prod.daysOfSupply}d Buffer Remaining`}
                              </span>
                              <span className="text-secondary-400 text-[11px] font-mono">
                                {prod.inventoryOnHand}/{prod.safetyStock}
                              </span>
                            </div>
                            
                            {/* Visual Stock Buffer Gauge */}
                            <div className="w-full h-1.5 rounded-full bg-secondary-200 dark:bg-secondary-800 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${prod.daysOfSupply <= 5 ? 'bg-red-500' : prod.daysOfSupply <= 10 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${Math.min(100, Math.max(10, (prod.daysOfSupply / 20) * 100))}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-right font-sans">
                          <Link 
                            href={`/disruptions/DSP-LIVE-1001`}
                            className="px-3.5 py-1.5 bg-secondary-100 hover:bg-primary-50 hover:text-primary-600 dark:bg-secondary-800 dark:hover:bg-primary-950/40 dark:hover:text-primary-400 text-secondary-900 dark:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-2xs"
                          >
                            <span>Resolve</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 4: CONTEXTUAL REGIONAL SILICON CORRIDORS         */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-[#222222]">
              <div>
                <h2 className="text-lg sm:text-xl font-black font-mono text-secondary-900 dark:text-white tracking-tight uppercase">
                  Contextual Regional Semiconductor Corridors
                </h2>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                  Foundry cluster risk exposure mapped across APAC, EMEA, and Americas supply lines.
                </p>
              </div>

              <Link 
                href="/network"
                className="px-3.5 py-1.5 bg-white dark:bg-[#141824] hover:bg-secondary-50 dark:hover:bg-[#1B2030] border border-[#E5E7EB] dark:border-[#262B3B] rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <span>Foundry Grid</span> <ChevronRight className="w-3.5 h-3.5 text-secondary-400" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Regional Card 1: APAC */}
              <div className="p-5.5 rounded-2xl bg-white dark:bg-[#121620] border border-[#E5E7EB] dark:border-[#222736] shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2 font-mono">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-500">East Asia Silicon Corridor</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                      CRITICAL SHOCK
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-secondary-900 dark:text-white">Taiwan Hsinchu & Tainan Fabs</h3>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-2 leading-relaxed">
                    TSMC Fab 18 advanced wafer logistics disrupted due to M6.4 seismic activity. Microcontroller lead times spiked to 18 weeks.
                  </p>
                </div>

                <div className="pt-3.5 border-t border-[#F0F2F5] dark:border-[#1E232F] flex items-baseline justify-between font-mono">
                  <span className="text-xs text-secondary-500">Revenue at Risk:</span>
                  <span className="text-base font-black text-red-600 dark:text-red-400">$1,575,000 / day</span>
                </div>
              </div>

              {/* Regional Card 2: EMEA */}
              <div className="p-5.5 rounded-2xl bg-white dark:bg-[#121620] border border-[#E5E7EB] dark:border-[#222736] shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2 font-mono">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-500">Central Europe Automotive Hub</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                      ALLOCATION WARNING
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-secondary-900 dark:text-white">Dresden Silicon Saxony Corridor</h3>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-2 leading-relaxed">
                    Infineon & Bosch automotive power semiconductor allocations tight. Backup safety inventory deployed for Plant 1010.
                  </p>
                </div>

                <div className="pt-3.5 border-t border-[#F0F2F5] dark:border-[#1E232F] flex items-baseline justify-between font-mono">
                  <span className="text-xs text-secondary-500">Revenue at Risk:</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">$540,000 / day</span>
                </div>
              </div>

              {/* Regional Card 3: Americas */}
              <div className="p-5.5 rounded-2xl bg-white dark:bg-[#121620] border border-[#E5E7EB] dark:border-[#222736] shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2 font-mono">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-500">Americas Analog & Discrete</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                      NOMINAL BUFFER
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-secondary-900 dark:text-white">Dallas & Austin Semiconductor Corridors</h3>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-2 leading-relaxed">
                    Texas Instruments and NXP Dallas wafer runs running at 98.2% baseline inventory buffer with zero unfulfilled orders.
                  </p>
                </div>

                <div className="pt-3.5 border-t border-[#F0F2F5] dark:border-[#1E232F] flex items-baseline justify-between font-mono">
                  <span className="text-xs text-secondary-500">Revenue at Risk:</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">$0 / day (Nominal)</span>
                </div>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 5: MULTI-SOURCE DISRUPTION STREAM & SCRAPER      */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB] dark:border-[#222222]">
              <div>
                <h2 className="text-lg sm:text-xl font-black font-mono text-secondary-900 dark:text-white tracking-tight flex items-center gap-2 uppercase">
                  <Radio className="w-5 h-5 text-primary-500" /> Multi-Source Institutional Signal Stream
                </h2>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                  Continuous machine ingestion across USGS Live Seismic, Federal Register (BIS), SEC EDGAR & Corporate IR.
                </p>
              </div>

              {/* Source Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-secondary-100 dark:bg-[#181D2A] p-1.5 rounded-xl border border-[#E5E7EB] dark:border-[#2A3347]">
                {[
                  { id: 'ALL', label: 'All Signals' },
                  { id: 'SEC_IR', label: 'SEC / IR' },
                  { id: 'FED_REGISTER_BIS', label: 'BIS Rules' },
                  { id: 'USGS_SEISMIC', label: 'USGS Sensor' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setFilterTier(t.id)}
                    className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                      filterTier === t.id
                        ? 'bg-secondary-900 text-white dark:bg-white dark:text-secondary-900 border-secondary-900 dark:border-white shadow-2xs'
                        : 'bg-white dark:bg-[#121620] text-secondary-700 dark:text-secondary-300 border-[#E5E7EB] dark:border-[#262B3B] hover:border-[#D6D6D6]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-Time Web Scraping Engine Control Bar & Live Ticker */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121620] text-secondary-900 dark:text-white border border-[#E5E7EB] dark:border-[#222736] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-800/40 text-primary-600 dark:text-primary-400 shrink-0">
                  <Radio className="w-4 h-4 text-primary-500 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#121620]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono tracking-wider uppercase text-secondary-900 dark:text-white flex items-center gap-1.5">
                      Institutional Telemetry Web-Scraping Engine
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-0.5">
                    Automated regulatory and seismic crawler scanning USGS, Federal Register (BIS EAR), SEC EDGAR & IR (24h Daily Sweep)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* 24-Hour Countdown Ticker */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary-50 dark:bg-[#181D2A] border border-[#E5E7EB] dark:border-[#2A3347]">
                  <Clock className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-xs text-secondary-700 dark:text-slate-300 font-mono">
                    Next sweep in <span className="font-extrabold text-primary-600 dark:text-primary-400">{formatScanCountdown(scanCountdown)}</span>
                  </span>
                  <span className="text-secondary-300 dark:text-slate-600">•</span>
                  <span className="text-[11px] text-primary-600 dark:text-primary-400 font-mono font-bold bg-primary-50 dark:bg-primary-950/60 px-1.5 py-0.5 rounded border border-primary-200 dark:border-primary-800/40">
                    24h Cycle
                  </span>
                  <span className="text-secondary-300 dark:text-slate-600">•</span>
                  <span className="text-[11px] text-secondary-500 dark:text-slate-400 font-mono">
                    Last: {lastScannedTime}
                  </span>
                </div>

                {/* Instant Scan Live Button */}
                <button
                  onClick={handleManualScan}
                  disabled={isLiveScanning}
                  className="px-3.5 py-1.5 bg-primary-500 hover:bg-primary-600 active:scale-95 disabled:opacity-50 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLiveScanning ? 'animate-spin' : ''}`} />
                  <span>{isLiveScanning ? 'Scraping Sources...' : 'Sweep Feeds Now'}</span>
                </button>
              </div>
            </div>

            {/* SKU Search Filter */}
            <div className="p-3.5 flex items-center gap-3 rounded-2xl border border-[#E5E7EB] dark:border-[#222736] bg-white dark:bg-[#121620] shadow-2xs">
              <Search className="w-4 h-4 text-secondary-400 shrink-0" />
              <input 
                type="text"
                placeholder="Filter by Part Number (STM32F401, TPS54331), Fab location, or institutional tier..."
                value={newsSearchQuery}
                onChange={(e) => setNewsSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (newsSearchQuery.trim()) {
                      setIsSearchingNews(true);
                      fetchNews(newsSearchQuery);
                    } else {
                      setIsSearchingNews(false);
                      fetchNews();
                    }
                  }
                }}
                className="flex-1 bg-transparent border-none text-xs font-mono font-medium outline-none text-secondary-900 dark:text-white placeholder-secondary-400"
              />
              {newsSearchQuery && (
                <button 
                  onClick={() => {
                    setNewsSearchQuery('');
                    setIsSearchingNews(false);
                    fetchNews();
                  }} 
                  className="text-xs font-mono font-bold text-secondary-400 hover:text-red-500 transition-colors uppercase px-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Signal Stream Cards Grid */}
            <div className="space-y-3.5">
              {filteredSignals.map((news) => {
                const badge = getSourceBadge(news.sourceTier);
                const isSelected = activeNews?.id === news.id;

                return (
                  <div 
                    key={news.id} 
                    onClick={() => {
                      if (!loading && activeNews?.id !== news.id) {
                        setActiveNews(news);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                      isSelected
                        ? 'bg-primary-50/60 dark:bg-primary-950/25 border-primary-500 shadow-sm ring-1 ring-primary-500/30' 
                        : 'bg-white dark:bg-[#121620] border-[#E5E7EB] dark:border-[#222736] hover:border-primary-300 dark:hover:border-primary-500/40 hover:shadow-2xs'
                    }`}
                  >
                    <div className="space-y-2 max-w-4xl">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-md border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {news.evidenceConfidence}% Tier-Weighted Confidence
                        </span>
                        <span className="text-xs text-secondary-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-secondary-400" />
                          {new Date(news.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-secondary-900 dark:text-white leading-snug">
                        {news.title}
                      </h4>

                      <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed font-sans">
                        {news.description}
                      </p>

                      <div className="pt-1.5 flex flex-wrap items-center gap-3">
                        <button 
                          onClick={(e) => handleOpenScraperModal(news, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-primary-600 hover:text-white bg-primary-50 hover:bg-primary-600 dark:bg-primary-950/40 dark:text-primary-400 dark:hover:bg-primary-600 dark:hover:text-white border border-primary-200 dark:border-primary-800/50 transition-all cursor-pointer shadow-2xs group"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                          <span>View Verified Source Registry</span>
                        </button>

                        {news.verifiedUrl && news.verifiedUrl !== '#' && (
                          <a 
                            href={news.verifiedUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white bg-secondary-100 dark:bg-secondary-800/60 border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#333333] transition-all"
                          >
                            <span>Official Source Proof</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-3 w-full md:w-auto justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          simulatePipeline(news);
                        }}
                        className="w-full md:w-auto px-5 py-2.5 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" /> Run Threat Triage
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 6: CLOSED-LOOP AUTONOMOUS REMEDIATION CONSOLE     */}
          {/* ======================================================== */}
          {(stage > 0 || detectResult || matchResult) && (
            <div ref={threatSectionRef} id="threat-section" className="space-y-6 pt-6 border-t border-[#E5E7EB] dark:border-[#222222]">
              
              {/* Header Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black font-mono text-secondary-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary-500" /> Autonomous Disruption Triage & Sourcing Engine
                  </h2>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                    Real-time execution: Signal Extraction → SAP S/4HANA BOM Explosion → Mouser Spot Sourcing → Ariba PR Draft
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPrModal(true)}
                    className="px-4 py-2 bg-white dark:bg-[#141824] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#262B3B] text-xs font-mono font-bold text-secondary-900 dark:text-white rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-primary-500" />
                    <span>Export PR Dossier (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Stage Progress Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${stage >= 1 ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-500/40 shadow-2xs' : 'bg-white dark:bg-[#121620] border-[#E5E7EB] dark:border-[#222736]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${stage >= 1 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-700'}`}>1</div>
                  <div>
                    <p className="text-xs font-bold text-secondary-900 dark:text-white">Public Entity Extraction</p>
                    <p className="text-[11px] font-mono text-secondary-500 dark:text-secondary-400">Groq LPU Signal → Affected MPN</p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${stage >= 2 ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-500/40 shadow-2xs' : 'bg-white dark:bg-[#121620] border-[#E5E7EB] dark:border-[#222736]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${stage >= 2 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-700'}`}>2</div>
                  <div>
                    <p className="text-xs font-bold text-secondary-900 dark:text-white">SAP S/4HANA BOM Tree Explosion</p>
                    <p className="text-[11px] font-mono text-secondary-500 dark:text-secondary-400">Dollar-at-Risk Calculated</p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${stage >= 3 ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-300 dark:border-primary-500/40 shadow-2xs' : 'bg-white dark:bg-[#121620] border-[#E5E7EB] dark:border-[#222736]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${stage >= 3 ? 'bg-primary-500 text-white' : 'bg-secondary-200 text-secondary-700'}`}>3</div>
                  <div>
                    <p className="text-xs font-bold text-secondary-900 dark:text-white">Mouser Spot Sourcing & Settlement</p>
                    <p className="text-[11px] font-mono text-secondary-500 dark:text-secondary-400">SAP Ariba PR Ready (+10% Guardrail)</p>
                  </div>
                </div>
              </div>

              {/* Detection Card */}
              {detectResult && (
                <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-[#121620] overflow-hidden shadow-xs">
                  <div className="bg-red-50 dark:bg-red-950/30 px-6 py-4 flex flex-wrap items-center justify-between border-b border-red-200 dark:border-red-900/40 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black font-mono text-red-900 dark:text-red-300 uppercase tracking-wide">
                          Critical Disruption Confirmed: {detectResult.partNumber}
                        </h3>
                        <p className="text-xs text-red-700/80 dark:text-secondary-400">
                          Directly correlated with private enterprise SAP S/4HANA Bill of Materials
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold uppercase tracking-wider bg-red-600 text-white px-3 py-1 rounded-full shadow-2xs">
                      Severity: {detectResult.severity?.toUpperCase() || 'HIGH'}
                    </span>
                  </div>

                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-secondary-500 uppercase tracking-wider mb-2">
                          Diagnostic Assessment & Root Cause
                        </h4>
                        <p className="text-secondary-800 dark:text-secondary-200 text-xs sm:text-sm leading-relaxed bg-[#F8F9FA] dark:bg-[#161B26] p-4 rounded-xl border border-[#E5E7EB] dark:border-[#222736]">
                          {detectResult.reason}
                        </p>
                      </div>

                      {/* Display Real Exploded Products in Triage */}
                      {impactResult?.affectedProducts && (
                        <div>
                          <h4 className="text-xs font-mono font-bold text-secondary-500 uppercase tracking-wider mb-2">
                            SAP S/4HANA Exploded Finished Assemblies ({impactResult.affectedProducts.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {impactResult.affectedProducts.map((prod, idx) => (
                              <span key={idx} className="px-3 py-1.5 text-xs font-mono font-bold bg-[#F8F9FA] dark:bg-[#161B26] text-secondary-900 dark:text-white rounded-xl border border-[#E5E7EB] dark:border-[#222736] flex items-center gap-1.5 shadow-2xs">
                                <Package className="w-3.5 h-3.5 text-primary-500" />
                                {prod}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-[#F8F9FA] dark:bg-[#161B26] rounded-xl border border-[#E5E7EB] dark:border-[#222736] space-y-2 text-xs font-mono">
                        <p className="text-xs font-bold uppercase text-secondary-400 tracking-wider">Provenance Proof</p>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary-500">Public Entity Extracted:</span>
                          <span className="font-bold text-secondary-900 dark:text-white">{detectResult.correlationDetails?.publicEntityExtracted || 'Semiconductor Foundry'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary-500">Target Material Number:</span>
                          <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{detectResult.partNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-secondary-500">Confidence Score:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{detectResult.evidenceConfidence || 88}% Tier-Weighted</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 lg:border-l lg:border-[#E5E7EB] dark:lg:border-[#222736] lg:pl-6 font-mono">
                      <div>
                        <span className="text-xs font-bold text-secondary-400 uppercase tracking-wider block">Impacted Material</span>
                        <span className="font-mono text-base font-black text-primary-600 dark:text-primary-400 mt-1 block">
                          {detectResult.partNumber}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-secondary-400 uppercase tracking-wider block">Daily Revenue Exposure</span>
                        <span className="text-2xl font-black text-red-600 dark:text-red-400 mt-1 block">
                          ${(detectResult.revenueAtRiskPerDay || 1575000).toLocaleString()}<span className="text-xs font-semibold text-secondary-400">/day</span>
                        </span>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => setShowPrModal(true)}
                          className="w-full py-2.5 bg-white dark:bg-[#161B26] hover:bg-secondary-50 border border-[#E5E7EB] dark:border-[#222736] text-xs font-mono font-bold text-secondary-900 dark:text-white rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-primary-500" /> Export Compliance PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sourced Alternatives Decision Center Table */}
              {matchResult && (
                <div className="rounded-2xl border border-primary-200 dark:border-primary-800/40 bg-white dark:bg-[#121620] p-6 space-y-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block">Autonomous Sourcing Qualified</span>
                      <h3 className="text-lg font-black font-mono text-secondary-900 dark:text-white mt-0.5">Mouser Electronics Spot Allocation Ready</h3>
                    </div>

                    <Link
                      href={`/disruptions/${matchResult.disruption_id || 'DSP-LIVE-1001'}`}
                      className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
                    >
                      <span>Open Decision Center</span> <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="border border-[#E5E7EB] dark:border-[#222736] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-[#F8F9FA] dark:bg-[#161B26] border-b border-[#E5E7EB] dark:border-[#222736] text-secondary-500 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="p-3.5">Qualified Part (MPN)</th>
                          <th className="p-3.5">Package & Compatibility</th>
                          <th className="p-3.5">Vendor</th>
                          <th className="p-3.5">Lead Time</th>
                          <th className="p-3.5">Stock Qty</th>
                          <th className="p-3.5">Quoted Price</th>
                          <th className="p-3.5">Target Negotiated</th>
                          <th className="p-3.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1E232F]">
                        <tr className="bg-primary-50/40 dark:bg-primary-950/20 font-bold">
                          <td className="p-3.5 text-primary-600 dark:text-primary-400 font-bold">STM32F401RBT6TR</td>
                          <td className="p-3.5 font-sans">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                              LQFP-64 (100% Drop-In)
                            </span>
                          </td>
                          <td className="p-3.5 font-sans">Mouser Electronics</td>
                          <td className="p-3.5 text-emerald-600 dark:text-emerald-400">3 Days</td>
                          <td className="p-3.5">14,200 pcs</td>
                          <td className="p-3.5 text-secondary-400">$6.26</td>
                          <td className="p-3.5 text-emerald-600 dark:text-emerald-400">$5.80</td>
                          <td className="p-3.5 text-right font-sans">
                            <span className="px-2.5 py-1 rounded bg-primary-500 text-white text-[11px] font-mono font-bold">
                              Optimal #1
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3.5 text-secondary-900 dark:text-white">STM32F401CCU6TR</td>
                          <td className="p-3.5 font-sans">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-700">
                              UFQFPN-48 (Functional Alt)
                            </span>
                          </td>
                          <td className="p-3.5 font-sans">Mouser Electronics</td>
                          <td className="p-3.5">3 Days</td>
                          <td className="p-3.5">8,500 pcs</td>
                          <td className="p-3.5 text-secondary-400">$6.70</td>
                          <td className="p-3.5 text-emerald-600 dark:text-emerald-400">$6.15</td>
                          <td className="p-3.5 text-right font-sans">
                            <span className="px-2.5 py-1 rounded bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 text-[11px] font-mono font-bold">
                              Alternate
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Multi-Agent Audit Log */}
              {auditTrail.length > 0 && (
                <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#222736] bg-white dark:bg-[#121620] p-6 space-y-4 shadow-xs font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-[#1E232F]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-900 dark:text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary-500" /> Multi-Agent Audit Log & Execution Trace
                    </h3>
                    <span className="text-[11px] text-secondary-400 font-mono">
                      Deterministic SAP & Mouser Ledger
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {auditTrail.map((log, index) => (
                      <div key={index} className="flex items-start gap-3 text-xs">
                        <span className="text-secondary-400 text-[11px] shrink-0">
                          {new Date(log.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                        </span>
                        <span className="font-bold text-primary-600 dark:text-primary-400 shrink-0">
                          [{log.source}]
                        </span>
                        <span className="text-secondary-800 dark:text-secondary-200">
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* PR Audit Dossier Modal */}
      <PrAuditExportModal 
        isOpen={showPrModal}
        onClose={() => setShowPrModal(false)}
        data={matchResult || {}}
      />

      {/* Real-Time Disruption Source Registry Webscraper Modal */}
      <SourceRegistryScraperModal
        isOpen={showScraperModal}
        onClose={() => setShowScraperModal(false)}
        signal={selectedSignalForScrape}
      />
    </div>
  );
}
