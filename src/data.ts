export interface RawArticle {
  id: string;
  title: string;
  content: string;
  timeAgo: string;
  sourceCategory: string;
  imageUrl: string;
}

export const rawNewsData: RawArticle[] = [
  {
    id: "1",
    title: "Indian SaaS reaches $15B milestone, but AI disruption looms large",
    content: "The domestic software-as-a-service (SaaS) market has hit a monumental new peak, officially crossing the $15 billion revenue mark this fiscal year. This represents a staggering 25% year-over-year growth, driven primarily by strong US and European enterprise demand.\n\nHowever, beneath the surface of this historic milestone, industry analysts are sounding the alarm. Traditional Indian SaaS players face mounting pressure to integrate foundational generative AI capabilities or risk losing their core enterprise clients to newer, AI-native startups. Major enterprise customers are reportedly freezing contract renewals in favor of vendors who can offer automated workflows, intelligent agents, and embedded AI copilots.\n\nSpeaking at a prominent industry roundtable in Bengaluru, key executives noted that the next 18 months will force a vicious consolidation phase. Companies that successfully pivot their core infrastructure to leverage Large Language Models (LLMs) will command premium pricing, while legacy task-management tools without an AI roadmap may face an existential threat.",
    timeAgo: "2 hours ago",
    sourceCategory: "Tech & Startups",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Mid-cap funds see highest inflow in 6 months",
    content: "Retail investors are pouring record amounts of capital into mid-cap mutual funds following a slight mid-month market correction. Mutual fund houses reported their highest net inflow in six months, signaling robust domestic retail confidence despite swirling global macroeconomic headwinds and fluctuating federal reserve rates.\n\nAccording to the latest data from the Association of Mutual Funds in India (AMFI), mid-cap funds saw an unprecedented surge of ₹4,500 crore in fresh SIP registrations. Market experts suggest that domestic investors are capitalizing on the 'buy the dip' strategy, betting heavily on India's projected domestic manufacturing output and increased domestic consumption.\n\nFund managers highlight that while large-cap valuations appear slightly stretched, the mid-cap segment continues to offer significant earnings growth visibility, especially in sectors tied to capital goods, infrastructure, and specialized manufacturing. The resilient domestic liquidity is providing a strong structural floor against potential foreign institutional selling.",
    timeAgo: "4 hours ago",
    sourceCategory: "Markets & Mutual Funds",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "RBI announces new guidelines for fintech lenders",
    content: "The Reserve Bank of India (RBI) has unveiled stringent new guidelines mandating significantly higher capital adequacy requirements for peer-to-peer (P2P) lending platforms. The sudden regulatory shift is aimed at curbing unsecured loan growth and preventing potential systemic risks bubbling up within the rapidly expanding fintech shadow-banking sector.\n\nThe new mandate requires platforms to maintain a strict 15% capital buffer on all risk-weighted assets, a massive jump from the previous 9% requirement. Consequently, several high-flying digital lending startups have seen their private secondary valuations drop sharply overnight as venture capital firms reassess the viability of aggressive customer acquisition models unbacked by physical capital.\n\nIndustry insiders warn that the tightened norms will inevitably lead to a wave of mergers and acquisitions in the fintech sector. Smaller lenders without heavy institutional backing may be forced into distressed sales, while dominant traditional banks stand to regain the market share they lost to agile algorithms over the last three years.",
    timeAgo: "6 hours ago",
    sourceCategory: "Policy & Finance",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Electric vehicle sales plateau as charging infrastructure lags",
    content: "Major automakers are reporting an unexpected slowdown in battery electric vehicle (BEV) adoption rates moving into the third quarter. While early-adopter enthusiasm initially drove exponential sales growth, the mass-market transition has hit a formidable structural roadblock: charging logistics.\n\nRecent consumer confidence surveys indicate that over 65% of potential EV buyers are holding off on purchases strictly due to 'range anxiety' and the unreliability of fast-charging networks on key inter-city highway corridors. Buyers report that while urban home-charging works well, cross-country travel remains a logistical nightmare plagued by broken public chargers and massive wait times.\n\nIn response to the stalling sales, several legacy automakers have quietly revised their long-term EV production targets, opting instead to funnel immediate R&D capital back into hybrid powertrains to bridge the gap. Government planners admit that the current pace of infrastructure deployment is entirely inadequate to meet the mandated 30% EV penetration target set for the end of the decade.",
    timeAgo: "1 hour ago",
    sourceCategory: "Auto & Infrastructure",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2080&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Global supply chain disruptions ease up ahead of festive quarter",
    content: "Global logistics networks are finally exhibiting sustainable signs of normalization after a turbulent operating year. Freight tracking indexes reveal that shipping container rates and transit delays have significantly cooled off, offering immense relief to supply chain managers right before the crucial end-of-year festive quarter.\n\nThe easing of seaport congestion and the stabilization of international air cargo rates mean that Fast-Moving Consumer Goods (FMCG) and major retail conglomerates are forecasting substantially lower inbound logistics costs. These savings are expected to provide a considerable boost to operating profit margins across the board.\n\nMarket analysts project that retail giants may choose to pass some of these logistical savings directly to consumers through aggressive festive discounting, potentially sparking highly competitive price wars. If the supply pipelines remain robust and unchoked, economists predict that third-quarter retail profitability could hit a five-year zenith.",
    timeAgo: "5 hours ago",
    sourceCategory: "Economy & Retail",
    imageUrl: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2000&auto=format&fit=crop"
  }
];

export const fetchRealNews = async (): Promise<RawArticle[]> => {
  try {
    const res = await fetch("https://saurav.tech/NewsAPI/top-headlines/category/business/in.json");
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    return data.articles.slice(0, 15).map((a: any, index: number) => {
      
      // Intelligently assign categories based on keywords in the live text
      let cat = "Economy & Retail";
      const text = (a.title + " " + (a.description || "")).toLowerCase();
      
      if (text.includes("tech") || text.includes("software") || text.includes("app") || text.includes("ai") || text.includes("cyber")) {
        cat = "Tech";
      } else if (text.includes("startup") || text.includes("founder") || text.includes("fund") || text.includes("vc") || text.includes("seed")) {
        cat = "Startups";
      } else if (text.includes("market") || text.includes("stock") || text.includes("share") || text.includes("sensex") || text.includes("nifty") || text.includes("invest")) {
        cat = "Markets";
      } else {
        // Fallback rotation to ensure we have a rich distribution for the UI filters
        const fallbacks = ["Markets", "Tech", "Startups", "Policy & Finance"];
        cat = fallbacks[index % fallbacks.length];
      }

      return {
        id: "live_" + index,
        title: a.title,
        content: a.description || a.content || "Detailed content available on the original publisher's website.",
        timeAgo: new Date(a.publishedAt).toLocaleDateString(),
        sourceCategory: cat,
        imageUrl: a.urlToImage || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=2000"
      };
    });
  } catch(e) {
    return rawNewsData;
  }
};

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  interests: string[];
  keywords: string[];
}

export const profiles: UserProfile[] = [
  {
    id: "p1",
    name: "Hemanth",
    role: "Startup Founder & Tech Enthusiast",
    interests: ["Tech", "Startups", "Policy"],
    keywords: ["SaaS", "AI", "fintech", "startup"]
  },
  {
    id: "p2",
    name: "Aditi",
    role: "Mutual Fund Investor",
    interests: ["Markets", "Economy", "Mutual Funds"],
    keywords: ["mid-cap", "inflow", "retail", "FMCG", "margins"]
  },
  {
    id: "p3",
    name: "Rohan",
    role: "Auto Sector Analyst",
    interests: ["Auto", "Infrastructure", "Policy"],
    keywords: ["electric", "vehicle", "charging", "supply chain"]
  }
];
