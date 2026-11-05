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
      icon: <Zap className="w-4 h-4 text-primary-500" />,
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
              icon: <Search className="w-4 h-4 text-primary-500" />,
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
      <div className="bg-white dark:bg-secondary-900 w-full max-w-xl rounded-xl border border-secondary-200 dark:border-secondary-800 shadow-card overflow-hidden animate-[fadeIn_0.15s_ease-out]">
        <div className="flex items-center px-4 py-3.5 border-b border-secondary-200 dark:border-secondary-800">
          <Search className="w-5 h-5 text-secondary-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-secondary-900 dark:text-white placeholder-secondary-400 text-base"
            placeholder="Search disruptions, plans, vendors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="text-secondary-400 hover:text-secondary-900 dark:hover:text-white bg-secondary-100 dark:bg-secondary-800 rounded px-2 py-1 text-xs font-mono">
            ESC
          </button>
        </div>
        
        {(results.length > 0 || newsResults.length > 0) && (
          <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
            {results.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest px-4 mb-2">Database Records</p>
                {results.map((r, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-800/50 rounded-lg transition-colors group cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      router.push(r.url);
                    }}
                  >
                    <div className="p-2 bg-secondary-100 dark:bg-secondary-800/80 rounded-md group-hover:bg-white dark:group-hover:bg-secondary-700 transition-colors">
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-secondary-900 dark:text-white text-sm">{r.title}</p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">{r.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {newsResults.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest px-4 mb-2">Live News Search API (Analyze on Click)</p>
                {newsResults.map((r, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-800/50 rounded-lg transition-colors group cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      try {
                        localStorage.setItem('pending_analysis_news', JSON.stringify(r.newsObject));
                      } catch(e) {}
                      router.push('/');
                    }}
                  >
                    <div className="p-2 bg-primary-500/10 rounded-md group-hover:bg-primary-500/20 transition-colors">
                      {r.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-secondary-900 dark:text-white text-sm truncate">{r.title}</p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">{r.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {query.trim() && results.length === 0 && newsResults.length === 0 && (
          <div className="p-8 text-center text-secondary-500 text-sm">
            No database records or live news found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
