import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Search, X, Package, ShieldAlert, Zap, Truck } from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [newsResults, setNewsResults] = useState([]);
  const [dataset, setDataset] = useState({ disruptions: [], vendors: [] });
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      
      // Load data
      Promise.all([
        fetch('/api/stats').then(r => r.json()).catch(() => ({})),
        fetch('/api/search_data').then(r => r.json()).catch(() => ({ disruptions: [], vendors: [] }))
      ]).then(([stats, data]) => {
        try {
          const custom = JSON.parse(localStorage.getItem('custom_disruptions') || '[]');
          setDataset({
            disruptions: [...custom, ...(data.disruptions || [])],
            vendors: data.vendors || []
          });
        } catch(e) {}
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    
    // Filter Disruptions
    const dMatches = dataset.disruptions.filter(d => 
      d.disruption_id.toLowerCase().includes(q) || 
      (d.part_affected && d.part_affected.toLowerCase().includes(q))
    ).slice(0, 5).map(d => ({
      type: 'Disruption',
      id: d.disruption_id,
      title: `${d.disruption_id} (${d.part_affected})`,
      icon: <ShieldAlert className="w-4 h-4 text-orange-500" />,
      url: `/disruptions?id=${d.disruption_id}`
    }));

    // Filter Plans
    const pMatches = dataset.disruptions.filter(d => 
      d.recovery_plan_id && d.recovery_plan_id.toLowerCase().includes(q)
    ).slice(0, 5).map(d => ({
      type: 'Plan',
      id: d.recovery_plan_id,
      title: `Recovery Plan: ${d.recovery_plan_id}`,
      icon: <Zap className="w-4 h-4 text-indigo-500" />,
      url: `/plans?id=${d.recovery_plan_id}`
    }));

    // Filter Vendors
    const vMatches = dataset.vendors.filter(v => 
      v.name.toLowerCase().includes(q) || v.vendor_id.toLowerCase().includes(q)
    ).slice(0, 5).map(v => ({
      type: 'Vendor',
      id: v.vendor_id,
      title: v.name,
      icon: <Truck className="w-4 h-4 text-emerald-500" />,
      url: `/network?vendor=${encodeURIComponent(v.name)}`
    }));

    setResults([...dMatches, ...pMatches, ...vMatches]);
  }, [query, dataset]);

  // Debounced News Search API Call
  useEffect(() => {
    if (!query.trim()) {
      setNewsResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/news/latest?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            const formatted = data.map(newsItem => ({
              type: 'Multi-Source Signal',
              id: newsItem.id,
              title: newsItem.title,
              description: newsItem.description,
              icon: <Search className="w-4 h-4 text-indigo-400" />,
              newsObject: newsItem
            }));
            setNewsResults(formatted);
          } else {
            setNewsResults([]);
          }
        })
        .catch(() => setNewsResults([]));
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div className="bg-white dark:bg-[#0f1115] w-full max-w-xl rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden animate-[fadeIn_0.15s_ease-out]">
        <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-white/10">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 text-lg"
            placeholder="Search disruptions, plans, vendors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/10 rounded px-2 py-1 text-xs font-mono">
            ESC
          </button>
        </div>
        
        {(results.length > 0 || newsResults.length > 0) && (
          <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
            {results.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Database Records</p>
                {results.map((r, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group"
                    onClick={() => {
                      setIsOpen(false);
                      router.push(r.url);
                    }}
                  >
                    <div className="p-2 bg-gray-100 dark:bg-black/30 rounded-md group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{r.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{r.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {newsResults.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Live News Search API (Analyze on Click)</p>
                {newsResults.map((r, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group"
                    onClick={() => {
                      setIsOpen(false);
                      try {
                        localStorage.setItem('pending_analysis_news', JSON.stringify(r.newsObject));
                      } catch(e) {}
                      router.push('/');
                    }}
                  >
                    <div className="p-2 bg-indigo-500/10 rounded-md group-hover:bg-indigo-500/20 transition-colors">
                      {r.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{r.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {query.trim() && results.length === 0 && newsResults.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No database records or live news found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
