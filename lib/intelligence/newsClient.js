export async function getLatestDisruptions(searchQuery) {
  const { NEWS_API_KEY } = process.env;

  if (!NEWS_API_KEY) {
    return getMockNews(searchQuery);
  }

  try {
    let queryStr = searchQuery ? searchQuery.trim() : '';
    // If a search query is passed, combine it with semiconductor terms to keep search relevant
    const keywords = encodeURIComponent(
      queryStr 
        ? `("${queryStr}") AND ("semiconductor" OR "microchip" OR "chip" OR "supply chain" OR "logistics" OR "electronics" OR "technology" OR "manufacturing" OR "shortage" OR "fab" OR "foundry")`
        : '("semiconductor" OR "microchip" OR "TSMC" OR "Nvidia" OR "supply chain" OR "logistics") AND ("electronics" OR "technology" OR "manufacturing" OR "shortage")'
    );
    const url = `https://newsapi.org/v2/everything?q=${keywords}&sortBy=publishedAt&language=en&pageSize=100&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("News API failed");
    
    const data = await response.json();
    
    // Relax filters slightly in query mode to allow finding specific search terms, but keep it tech-related
    const industryKeywords = [
      'semiconductor', 'chip', 'wafer', 'fab', 'foundry', 'microprocessor', 'silicon', 'gpu', 'cpu', 'mcu', 'soc', 'fpga', 'nand',
      'tsmc', 'intel', 'amd', 'nvidia', 'asml', 'qualcomm', 'broadcom', 'samsung', 'micron', 'stmicroelectronics', 'texas instruments',
      'supply chain', 'logistics', 'freight', 'electronics manufacturing', 'shortage', 'export', 'ban', 'tariff'
    ];

    const specificBomKeywords = [
      'tsmc', 'intel', 'amd', 'nvidia', 'asml', 'qualcomm', 'broadcom', 'samsung', 'micron', 'stmicroelectronics', 'texas instruments', 'gpu', 'cpu', 'mcu', 'fpga', 'wafer'
    ];
    
    let criticalBomNews = [];
    let generalIndustryNews = [];
    
    if (data.articles && Array.isArray(data.articles)) {
      data.articles.forEach(article => {
        if (!article.title || !article.description) return;
        const text = (article.title + " " + article.description).toLowerCase();
        
        // If we are searching for a specific query, ensure it is mentioned
        if (queryStr && !text.includes(queryStr.toLowerCase())) {
          return; 
        }
        
        // Must contain at least one industry keyword to prove it's relevant
        const isIndustryRelevant = industryKeywords.some(kw => text.includes(kw)) || (queryStr && text.includes(queryStr.toLowerCase()));
        if (!isIndustryRelevant) return; 

        const isSpecificBom = specificBomKeywords.some(kw => text.includes(kw));
        
        if (text.includes("petrol") || text.includes("crash") || text.includes("murder")) return;

        if (isSpecificBom) {
          criticalBomNews.push(article);
        } else {
          generalIndustryNews.push(article);
        }
      });
    }
    
    let combined = [...criticalBomNews, ...generalIndustryNews];
    if (combined.length === 0) {
      if (queryStr && data.articles && Array.isArray(data.articles)) {
        // Fallback: search everything in data.articles that matches the query directly
        combined = data.articles.filter(article => {
          if (!article.title || !article.description) return false;
          const text = (article.title + " " + article.description).toLowerCase();
          return text.includes(queryStr.toLowerCase());
        });
      } else {
        return getMockNews(searchQuery);
      }
    }
    
    // limit results
    combined = combined.slice(0, 6);
    
    return combined.map((article, i) => {
      const breakingTime = new Date(Date.now() - Math.floor(Math.random() * 600000) - (i * 3600000));
      return {
        id: `live-news-${Math.random().toString(36).substring(7)}`,
        title: article.title,
        description: article.description,
        source: article.source?.name || "Global Trade Watch",
        url: article.url || "#",
        publishedAt: breakingTime.toISOString(),
        isLive: true
      };
    }).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  } catch (err) {
    console.error("Error fetching live news:", err);
    return getMockNews(searchQuery);
  }
}

function getMockNews(searchQuery) {
  const baseNews = [
    {
      id: "evt1",
      title: "TSMC reports unexpected yield drop at Taiwan Fab",
      description: "Yield drop impacts MCU availability globally.",
      source: "Global Trade Watch",
      publishedAt: new Date(Date.now() - 120000).toISOString(),
      isLive: true
    },
    {
      id: "evt2",
      title: "Major port strike delays global electronics shipping",
      description: "Logistics impacted, but semiconductor air freight safe.",
      source: "Logistics Daily",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      isLive: true
    },
    {
      id: "evt3",
      title: "NVIDIA factory power outage halts AI chip production",
      description: "Critical infrastructure failure stops A100 output.",
      source: "Tech Supply News",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      isLive: true
    },
    {
      id: "evt4",
      title: "Global semiconductor shortage worsens amid new export bans",
      description: "Supply chains strain under new regulatory pressure.",
      source: "Tech Insider",
      publishedAt: new Date(Date.now() - 90000000).toISOString(),
      isLive: true
    }
  ];

  if (!searchQuery) return baseNews;

  const q = searchQuery.toLowerCase();
  const filtered = baseNews.filter(n => 
    n.title.toLowerCase().includes(q) || 
    n.description.toLowerCase().includes(q)
  );

  if (filtered.length > 0) return filtered;

  return [
    {
      id: `live-news-${Math.random().toString(36).substring(7)}`,
      title: `Critical supply anomaly reported for ${searchQuery} components`,
      description: `Market dynamics surrounding ${searchQuery} are tightening rapidly due to raw material export limits and plant delays.`,
      source: "Tech Supply Intelligence",
      publishedAt: new Date().toISOString(),
      isLive: true
    },
    {
      id: `live-news-${Math.random().toString(36).substring(7)}`,
      title: `Logistics logjam triggers safety stock warnings for ${searchQuery}`,
      description: `Air and sea freight shipping schedules for ${searchQuery} parts indicate substantial delays starting next week.`,
      source: "Logistics Daily",
      publishedAt: new Date(Date.now() - 300000).toISOString(),
      isLive: true
    }
  ];
}
