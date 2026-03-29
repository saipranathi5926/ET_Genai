import { RawArticle, UserProfile } from "./data";

export interface ProcessedArticle extends RawArticle {
  entities: string[];
  sentiment: "Positive" | "Negative" | "Neutral";
  relevanceScore: number;
  matchReasons: string[];
}

/**
 * Step 1: Entity Extraction
 * Simulates an NLP agent extracting key nouns and topics from the article.
 */
function extractEntities(text: string): string[] {
  const commonEntities = ["SaaS", "AI", "mid-cap", "RBI", "fintech", "electric vehicle", "FMCG", "retail", "supply chain"];
  const found = commonEntities.filter(entity => text.toLowerCase().includes(entity.toLowerCase()));
  return found.length > 0 ? found : ["Markets", "Trends"];
}

/**
 * Step 2: Sentiment Analysis
 * Simulates tagging sentiment.
 */
function tagSentiment(text: string): "Positive" | "Negative" | "Neutral" {
  const positiveWords = ["peak", "confidence", "growth", "inflow", "boost", "relief", "milestone"];
  const negativeWords = ["pressure", "disruption", "correction", "risk", "drop", "plateau", "lags", "deterrents"];
  
  let score = 0;
  positiveWords.forEach(w => { if(text.toLowerCase().includes(w)) score++; });
  negativeWords.forEach(w => { if(text.toLowerCase().includes(w)) score--; });

  if (score > 0) return "Positive";
  if (score < 0) return "Negative";
  return "Neutral";
}

/**
 * Step 3: Personalized Relevance Ranking
 * Analyzes the match between user's profile and the article's entities / categories.
 */
function scoreRelevance(article: RawArticle, entities: string[], profile: UserProfile): { score: number, reasons: string[] } {
  let score = Math.floor(Math.random() * 20) + 10; // base score 10-30
  let reasons: string[] = [];

  // Match category
  if (profile.interests.some(interest => article.sourceCategory.includes(interest))) {
    score += 30;
    reasons.push(`Matches interest: ${profile.interests.find(i => article.sourceCategory.includes(i))}`);
  }

  // Match keywords / entities
  const matchedKeywords = entities.filter(e => profile.keywords.some(k => k.toLowerCase() === e.toLowerCase()));
  if (matchedKeywords.length > 0) {
    score += 40;
    reasons.push(`Contains keywords: ${matchedKeywords.join(", ")}`);
  }

  // Bonus for textual matching to profile keywords
  profile.keywords.forEach(keyword => {
    if (article.content.toLowerCase().includes(keyword.toLowerCase())) {
      score += 15;
    }
  });

  return { score: Math.min(score, 99), reasons };
}

/**
 * The Agentic Pipeline
 * Ingests raw news, processes via 3 steps, and delivers sorted personalized output.
 */
export async function runAgentPipeline(rawNews: RawArticle[], profile: UserProfile): Promise<ProcessedArticle[]> {
  // Simulate network/processing delay (Agent Thinking)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const processed = rawNews.map(article => {
    const combinedText = article.title + " " + article.content;
    
    // Step 1: Extract Entities
    const entities = extractEntities(combinedText);
    
    // Step 2: Sentiment Tagging
    const sentiment = tagSentiment(combinedText);
    
    // Step 3: Personalised Ranking
    const { score, reasons } = scoreRelevance(article, entities, profile);

    return {
      ...article,
      entities,
      sentiment,
      relevanceScore: score,
      matchReasons: reasons.length > 0 ? reasons : ["General market update"]
    };
  });

  // Return sorted by relevance score
  return processed.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
