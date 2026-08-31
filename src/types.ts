export interface AgentIdentity {
  id: string;
  name: string;
  version: string;
  role: string;
  allowedTools: string[];
  permissions: string[];
}

export type CaseType = 'ONBOARDING' | 'AML_ALERT' | 'ENTITY_DISCREPANCY' | 'LIFECYCLE_CHANGE' | 'REBALANCING';
export type CaseStatus = 'DRAFT' | 'INVESTIGATING' | 'POLICY_EVALUATION' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
export type PolicyDecision = 'ALLOW' | 'DENY' | 'HUMAN_REVIEW';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DocumentRecord {
  id: string;
  name: string;
  type: 'TRUST_DEED' | 'ACRA_BIZFILE' | 'PASSPORT_ID' | 'SOURCE_OF_WEALTH' | 'SWIFT_MESSAGE' | 'BOARD_RESOLUTION' | 'INVESTMENT_MANDATE' | 'TAX_DECLARATION';
  size: string;
  uploadedAt: string;
  sha256: string;
  extractedSnippet: string;
  summary: string;
  clientName?: string;
  verifiedStatus?: 'VERIFIED' | 'PENDING' | 'FLAGGED';
}

export interface OwnershipNode {
  id: string;
  name: string;
  type: 'INDIVIDUAL_UBO' | 'TRUST' | 'HOLDING_CO' | 'OPERATING_CO' | 'FOUNDATION';
  jurisdiction: string;
  registrationNumber?: string;
  percentage?: number;
  roles?: string[];
  isUBO?: boolean;
  isVerifiedWithRegistry?: boolean;
  notes?: string;
}

export interface OwnershipLink {
  from: string;
  to: string;
  percentage: number;
  relationshipType: 'BENEFICIARY' | 'SHAREHOLDER' | 'TRUSTEE' | 'SETTLOR' | 'DIRECTOR';
}

export interface EntityGraph {
  nodes: OwnershipNode[];
  links: OwnershipLink[];
  uboIdentified: string[];
  totalTiers: number;
  anomaliesDetected: string[];
}

export interface RegistryRecord {
  uen: string;
  entityName: string;
  status: string;
  incorporationDate: string;
  registeredAddress: string;
  paidUpCapital: string;
  officers: Array<{
    name: string;
    role: string;
    idNumberMasked: string;
    appointedDate: string;
  }>;
  shareholders: Array<{
    name: string;
    shares: string;
    percentage: number;
  }>;
  matchScore: number;
  verifiedAt: string;
  registrySource: 'ACRA_API_MARKETPLACE' | 'ACRA_SIMULATOR';
  proofHash: string;
}

export interface AMLDetails {
  transactionId?: string;
  amount: number;
  currency: string;
  originator: string;
  originatorBank: string;
  beneficiary: string;
  beneficiaryBank: string;
  corridor: string;
  corridorRisk: RiskLevel;
  sourceOfFundsDeclared: string;
  sourceOfFundsVerified: boolean;
  sanctionsCheckStatus: 'CLEAR' | 'POTENTIAL_HIT' | 'BLOCKED';
  pepMatch: boolean;
  pepDetails?: string;
  adverseMediaHit: boolean;
  uboMismatch: boolean;
  overallRisk: RiskLevel;
  findings: string[];
}

export interface PolicyRuleResult {
  ruleId: string;
  name: string;
  conditionDescription: string;
  passed: boolean;
  triggerDetails: string;
  actionIfViolated: PolicyDecision;
}

export interface PolicyEvaluation {
  policyId: string;
  policyName: string;
  policyVersion: string;
  thresholdAmount?: number;
  decision: PolicyDecision;
  reasons: string[];
  rulesEvaluated: PolicyRuleResult[];
  approvalRequired: boolean;
  evaluatedAt: string;
  policyHash: string;
}

export interface HumanApproval {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUEST_INFO';
  reviewerName?: string;
  reviewerRole?: string;
  reviewedAt?: string;
  decisionReason?: string;
  digitalSignature?: string;
  conditionsApplied?: string[];
}

export interface AegisEvent {
  eventId: string;
  caseId: string;
  sequenceIndex: number;
  timestamp: string;
  actor: {
    type: 'AGENT' | 'POLICY_ENGINE' | 'HUMAN_OFFICER' | 'ACTION_GATEWAY';
    id: string;
    version: string;
  };
  action: string;
  evidence: Array<{
    id: string;
    name: string;
    sha256: string;
  }>;
  policy?: {
    id: string;
    version: string;
  };
  decision?: PolicyDecision | string;
  tool?: {
    name: string;
    resultHash?: string;
  };
  payloadSnapshot: any;
  previousEventHash: string;
  eventHash: string;
}

export interface ActionReceipt {
  receiptId: string;
  caseId: string;
  actionType: string;
  agentId: string;
  agentVersion: string;
  policyId: string;
  policyVersion: string;
  decision: PolicyDecision | string;
  evidenceCount: number;
  evidenceRootHash: string;
  executionStatus: 'SUCCESS' | 'BLOCKED' | 'PENDING_APPROVAL';
  integrityStatus: 'VERIFIED' | 'TAMPERED';
  timestamp: string;
  previousEventHash: string;
  eventHash: string;
  caseRootHash: string;
  signature: string;
  verificationCert: string;
}

export interface TelemetrySpan {
  spanId: string;
  traceId: string;
  parentSpanId?: string;
  agentId: string;
  agentName: string;
  operationName: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  status: 'OK' | 'ERROR';
  attributes: Record<string, any>;
}

export interface Case {
  id: string;
  title: string;
  clientName: string;
  type: CaseType;
  status: CaseStatus;
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
  targetEntityName: string;
  documents: DocumentRecord[];
  entityGraph: EntityGraph;
  registryRecord?: RegistryRecord;
  amlDetails?: AMLDetails;
  policyEvaluation?: PolicyEvaluation;
  humanApproval?: HumanApproval;
  actionReceipts: ActionReceipt[];
  events: AegisEvent[];
  telemetrySpans: TelemetrySpan[];
  caseIntegrityRoot: string;
  isTampered: boolean;
  tamperMessage?: string;
  tamperedEventIndex?: number;
}

export interface PolicyConfig {
  amlTransactionThreshold: number; // default $5,000,000
  strictUboThreshold: number; // default 25%
  requireAcraDirectMatch: boolean;
  policyVersion: string; // e.g. "1.0.0" or "1.1.0"
}

// -------------------------------------------------------------
// WEALTH MANAGEMENT OPERATING SYSTEM TYPES
// -------------------------------------------------------------

export type AppMode = 'WEALTH' | 'CONTROL_PLANE';
export type WealthNavTab = 'overview' | 'clients' | 'workflows' | 'investments' | 'planning' | 'documents' | 'intelligence';
export type ControlPlaneNavTab = 'overview' | 'trace' | 'evidence' | 'proof';

export type LifecycleStageKey = 
  | 'PROSPECT' 
  | 'KYC' 
  | 'ONBOARDING' 
  | 'PLANNING' 
  | 'INVESTED' 
  | 'MONITORING' 
  | 'REVIEW' 
  | 'INVESTIGATION' 
  | 'EXIT';

export interface LifecycleStageItem {
  key: LifecycleStageKey;
  label: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING' | 'FLAGGED';
  date?: string;
  note?: string;
  assignedAgents?: string[];
}

export interface WealthPortfolioItem {
  assetClass: string;
  value: number;
  allocationPercent: number;
  targetPercent: number;
  performanceYTD: string;
  performanceColor?: string;
  driftPercent?: number; // e.g. +4.2%
}

export interface WealthGoal {
  id: string;
  category: 'Liquidity' | 'Growth' | 'Legacy' | 'Philanthropy' | 'Real Estate';
  title: string;
  targetAmount: string;
  currentStatus: string;
  status: 'ON_TRACK' | 'ATTENTION' | 'ACHIEVED';
  timeHorizon: string;
  description: string;
}

export interface ClientEntitySummary {
  id: string;
  name: string;
  type: string;
  jurisdiction: string;
  uen?: string;
  ownershipPercent: number;
  status: 'Active' | 'Live' | 'Pending Review';
  verificationSource: string;
  isUBO: boolean;
}

export interface AegisIntelligenceInsight {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  summary: string;
  whyItMatters: string;
  suggestedAction: string;
  actionLabel: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'OWNERSHIP' | 'PORTFOLIO_DRIFT' | 'KYC_REVIEW' | 'AML_ALERT' | 'TAX_RESIDENCY' | 'ONBOARDING';
  evidencePoints: string[];
  relatedCaseId?: string;
  confidence: 'High' | 'Medium';
  createdAt: string;
  resolved?: boolean;
}

export interface WorkflowItem {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  category: 'ONBOARDING' | 'LIFECYCLE_CHANGE' | 'AML_INVESTIGATION' | 'KYC_REFRESH' | 'REBALANCING';
  status: 'RUNNING' | 'WAITING_APPROVAL' | 'COMPLETED' | 'BLOCKED';
  currentStageNumber: number;
  totalStages: number;
  currentStageDescription: string;
  assignedAgents: string[];
  caseId: string;
  startedAt: string;
  lastUpdatedAt: string;
  boundedRestraint?: {
    attemptedAction: string;
    policyBlocked: string;
    reason: string;
    humanActionRequired: string;
  };
  stages: Array<{
    name: string;
    status: 'COMPLETED' | 'ACTIVE' | 'PENDING' | 'BLOCKED';
    agent?: string;
    time?: string;
    note?: string;
  }>;
}

export interface ClientProfile {
  id: string;
  name: string;
  primaryContact: string;
  title: string;
  avatarInitials: string;
  totalWealthSGD: number;
  currency: string;
  riskProfile: 'Low' | 'Moderate' | 'Balanced' | 'Growth' | 'High';
  relationshipYears: number;
  nextReviewDate: string;
  entitiesCount: number;
  activeWorkflowsCount: number;
  lifecycleStage: LifecycleStageKey;
  lifecycleTimeline: LifecycleStageItem[];
  portfolios: WealthPortfolioItem[];
  goals: WealthGoal[];
  entities: ClientEntitySummary[];
  intelligenceInsights: AegisIntelligenceInsight[];
  activeWorkflows: WorkflowItem[];
  documents: DocumentRecord[];
  linkedCaseId: string;
  overviewSummary: string;
  structureSummary: {
    totalEntities: number;
    ownershipTiers: number;
    registryMatched: boolean;
    beneficialOwner: string;
    screeningStatus: 'CLEAR' | 'FLAGGED' | 'IN_REVIEW';
    confidence: 'High' | 'Medium';
  };
}

export interface AdvisorBookSummary {
  advisorName: string;
  advisorRole: string;
  totalAUMFormatted: string;
  clientsCount: number;
  clientsNeedAttentionCount: number;
  reviewsDueCount: number;
  approvalsWaitingCount: number;
  activeWorkflowsCount: number;
}
