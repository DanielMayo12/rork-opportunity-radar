export type OpportunityCategory = 
  | 'side-hustle'
  | 'online-business'
  | 'reselling'
  | 'investing'
  | 'local-demand'
  | 'trending'
  | 'ai-opportunities'
  | 'freelancing'
  | 'trending-products';

export type OpportunityDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type OpportunityTimeCommitment = 
  | 'flexible'
  | 'part-time'
  | 'full-time'
  | 'weekend-only';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  difficulty: OpportunityDifficulty;
  timeCommitment: OpportunityTimeCommitment;
  estimatedEarning: {
    min: number;
    max: number;
    period: 'month' | 'week' | 'project';
  };
  startupCost: {
    min: number;
    max: number;
  };
  trending: boolean;
  trendingScore: number;
  tags: string[];
  location?: string;
  createdAt: string;
  keyInsights: string[];
  steps: string[];
  resources: Resource[];
  competition: 'low' | 'medium' | 'high';
  demandTrend: 'rising' | 'stable' | 'declining';
  riskLevel: RiskLevel;
  whyThisOpportunity: string;
  timeToFirstRevenue: string;
}

export interface Resource {
  title: string;
  type: 'article' | 'video' | 'tool' | 'platform';
  url?: string;
}

export type UserInterest = 
  | 'side-hustles'
  | 'reselling'
  | 'freelancing'
  | 'investing'
  | 'online-business'
  | 'local-opportunities'
  | 'ai-opportunities'
  | 'trending-products';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  interests: UserInterest[];
  savedOpportunities: string[];
  completedOpportunities: string[];
  joinedAt: string;
  region: string;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
}
