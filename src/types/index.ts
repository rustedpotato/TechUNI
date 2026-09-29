export type StageType = 
  | 'discover' 
  | 'screen' 
  | 'validate' 
  | 'agree' 
  | 'prototype' 
  | 'pilot' 
  | 'commercialize';

export type UserRole = 'student' | 'mentor' | 'buyer' | 'admin';

export interface Project {
  id: string;
  title: string;
  domain: string;
  institution: string;
  leadInventor: string;
  leadEmail: string;
  stage: StageType;
  trl: number; // 1-9
  score: number; // 0-100
  summary: string;
  problem: string;
  solution: string;
  demoUrl?: string;
  ipDisclosure: 'none' | 'provisional_filed' | 'college_disclosed' | 'patented';
  tags: string[];
  createdDate: string;
  evaluations: Evaluation[];
  buyerValidations: BuyerValidation[];
  agreement?: Agreement;
  milestones: Milestone[];
  testLogs: TestLog[];
  pilot?: Pilot;
  deal?: Deal;
}

export interface Evaluation {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  date: string;
  isAiAdvisory?: boolean;
  problemSeverity: number; // max 20
  marketPotential: number; // max 20
  technicalFeasibility: number; // max 15
  differentiation: number; // max 15
  ipPotential: number; // max 10
  costScalability: number; // max 10
  industryDemand: number; // max 10
  totalScore: number; // calculated sum out of 100
  notes: string;
}

export interface BuyerValidation {
  id: string;
  companyName: string;
  contactPerson: string;
  date: string;
  interestLevel: 'not_interested' | 'informational' | 'needs_changes' | 'would_pilot' | 'ready_to_contract';
  notes: string;
}

export interface Agreement {
  id: string;
  signedDate?: string;
  isSigned: boolean;
  collegeCleared: boolean;
  inventorEquityPct: number;
  companyEquityPct: number;
  collegeRoyaltyPct: number;
  continuationTerms: string;
  documentName: string;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  targetTrl: number;
}

export interface TestLog {
  id: string;
  title: string;
  date: string;
  location: string;
  testerName: string;
  result: string;
  verifiedTrl: number;
}

export interface Pilot {
  id: string;
  companyName: string;
  scope: string;
  durationWeeks: number;
  successMetrics: string;
  status: 'planned' | 'in_progress' | 'completed_successful' | 'completed_unsuccessful';
  outcomeNotes?: string;
}

export interface Deal {
  id: string;
  type: 'license' | 'sale' | 'revenue_share' | 'corporate_program' | 'spinout';
  companyName: string;
  valueInr: number;
  terms: string;
  date: string;
}

export interface CompanyDemand {
  id: string;
  companyName: string;
  sector: string;
  title: string;
  description: string;
  tags: string[];
  budgetSignal: string;
  targetDeliveryMonths: number;
}
