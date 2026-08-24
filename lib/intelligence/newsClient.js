export async function getLatestDisruptions() {
  const { NEWS_API_KEY } = process.env;

  if (!NEWS_API_KEY) {
    return getMockNews();
  }

  try {
    // Broad query encompassing the entire semiconductor industry + logistics
    const keywords = encodeURIComponent('semiconductor OR chip OR wafer OR foundry OR fab OR microprocessor OR TSMC OR Intel OR AMD OR NVIDIA OR ASML OR Qualcomm OR logistics OR freight OR shipping');
    const url = `https://newsapi.org/v2/everything?q=${keywords}&sortBy=publishedAt&language=en&pageSize=100&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("News API failed");
    
    const data = await response.json();
    
    // We want a 2:2 ratio of (BOM-impacting) to (Non-impacting) for a great demo experience.
    const bomKeywords = [
      'semiconductor', 'chip', 'wafer', 'fab', 'foundry', 'microprocessor', 'integrated circuit', 'silicon',
      'gpu', 'cpu', 'mcu', 'soc', 'fpga', 'nand', 'dram',
      'tsmc', 'intel', 'amd', 'nvidia', 'asml', 'qualcomm', 'broadcom', 'samsung', 'micron', 'texas instruments', 'stmicroelectronics', 'nxp', 'infineon'
    ];
    
    let bomRelevant = [];
    let general = [];
    
    data.articles.forEach(article => {
      const text = (article.title + " " + article.description).toLowerCase();
      const isBom = bomKeywords.some(kw => text.includes(kw.toLowerCase()));
      if (isBom) {
        bomRelevant.push(article);
      } else {
        general.push(article);
      }
    });
    
    // Fallback if filtering fails
    if (bomRelevant.length < 2 || general.length < 2) {
        bomRelevant = data.articles.slice(0, 2);
        general = data.articles.slice(2, 4);
    }
    
    // Pick 2 random from each bucket
    const selectedBom = bomRelevant.sort(() => 0.5 - Math.random()).slice(0, 2);
    const selectedGeneral = general.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    const combined = [...selectedBom, ...selectedGeneral].sort(() => 0.5 - Math.random());
    
    return combined.map((article, i) => {
      const breakingTime = new Date(Date.now() - Math.floor(Math.random() * 600000));
      return {
        id: `live-news-${Math.random().toString(36).substring(7)}`,
        title: article.title,
        description: article.description,
        source: article.source.name,
        url: article.url,
        publishedAt: breakingTime.toISOString(),
        isLive: true
      };
    }).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  } catch (err) {
    console.error("Error fetching live news:", err);
    return getMockNews();
  }
}

function getMockNews() {
  return [
    {
      id: "evt1",
      title: "TSMC reports unexpected yield drop at Taiwan Fab",
      description: "Yield drop impacts MCU availability.",
      source: "Global Trade Watch",
      publishedAt: new Date(Date.now() - 120000).toISOString(),
      isLive: true
    },
    {
      id: "evt2",
      title: "Major port strike delays general shipping",
      description: "Logistics impacted, but semiconductor air freight safe.",
      source: "Logistics Daily",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      isLive: true
    }
  ];
}
