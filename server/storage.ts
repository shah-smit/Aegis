import { Case, AegisEvent, ActionReceipt } from '../src/types';
import { buildHashChain, generateActionReceipt, verifyCaseIntegrity, sha256, RawAegisEvent } from './cryptoUtils';
import { evaluatePolicy, currentPolicyConfig } from './policyEngine';
import { REGISTERED_AGENTS } from './agents';

export const casesStore: Map<string, Case> = new Map();

export function initializeDemoCases() {
  casesStore.clear();

  // -------------------------------------------------------------
  // SCENARIO A: Clean Wealth Management Onboarding
  // -------------------------------------------------------------
  const caseAId = 'CASE-2026-8492';
  const caseADocs = [
    {
      id: 'DOC-ONB-01',
      name: 'Emerald_Crest_Family_Trust_Deed_Executed.pdf',
      type: 'TRUST_DEED' as const,
      size: '2.4 MB',
      uploadedAt: '2026-08-16T08:15:00Z',
      sha256: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
      extractedSnippet: 'Clause 4.1: The Settlor (Lady Genevieve Alistair) irrevocably settles all issued shares of Emerald Horizons Holdings Ltd upon the Trustee for the sole lifetime benefit of Lady Genevieve Alistair...',
      summary: 'Irrevocable Jersey/Singapore trust settling 100% shares of Cayman HoldCo for beneficial interest of Lady Genevieve Alistair.',
    },
    {
      id: 'DOC-ONB-02',
      name: 'ACRA_Bizfile_Aegis_Wealth_Mgmt_Pte_Ltd.pdf',
      type: 'ACRA_BIZFILE' as const,
      size: '840 KB',
      uploadedAt: '2026-08-16T08:16:12Z',
      sha256: '4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b',
      extractedSnippet: 'UEN: 202418934K. Entity Name: AEGIS WEALTH MANAGEMENT PTE. LTD. Share Capital: SGD 1,000,000. Officers: Lady Genevieve Alistair (MD), Cheng Wei Jie (Director)...',
      summary: 'ACRA corporate extract verifying Live status, paid-up capital of SGD 1M, and directorship.',
    },
    {
      id: 'DOC-ONB-03',
      name: 'Source_Of_Wealth_Declaration_Deloitte_Audited.pdf',
      type: 'SOURCE_OF_WEALTH' as const,
      size: '1.6 MB',
      uploadedAt: '2026-08-16T08:17:30Z',
      sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
      extractedSnippet: 'Independent Audit Report: Liquid wealth of USD $120M generated via sale of European Logistics Tech group in 2023. Funds legitimately repatriated through Barclays Private Bank...',
      summary: 'Audited source of wealth corroborating liquidity from institutional technology divestment.',
    },
  ];

  const caseAGraph = {
    nodes: [
      { id: 'node-1', name: 'Lady Genevieve Alistair', type: 'INDIVIDUAL_UBO' as const, jurisdiction: 'Singapore (PR) / UK', percentage: 100, isUBO: true, isVerifiedWithRegistry: true, roles: ['Settlor', 'Beneficiary', 'Managing Director'] },
      { id: 'node-2', name: 'Emerald Crest Trust', type: 'TRUST' as const, jurisdiction: 'Jersey / Singapore', percentage: 100, roles: ['Family Trust Vehicle'] },
      { id: 'node-3', name: 'Emerald Horizons Holdings Ltd', type: 'HOLDING_CO' as const, jurisdiction: 'Cayman Islands', percentage: 100, roles: ['Intermediate HoldCo'] },
      { id: 'node-4', name: 'Aegis Wealth Management Pte Ltd', type: 'OPERATING_CO' as const, jurisdiction: 'Singapore', percentage: 100, isVerifiedWithRegistry: true, roles: ['Singapore Operating Entity'] },
    ],
    links: [
      { from: 'node-1', to: 'node-2', percentage: 100, relationshipType: 'SETTLOR' as const },
      { from: 'node-2', to: 'node-3', percentage: 100, relationshipType: 'BENEFICIARY' as const },
      { from: 'node-3', to: 'node-4', percentage: 100, relationshipType: 'SHAREHOLDER' as const },
    ],
    uboIdentified: ['Lady Genevieve Alistair (100% Beneficial Control)'],
    totalTiers: 4,
    anomaliesDetected: [],
  };

  const caseARegistry = {
    uen: '202418934K',
    entityName: 'AEGIS WEALTH MANAGEMENT PTE. LTD.',
    status: 'Live',
    incorporationDate: '2024-03-15',
    registeredAddress: '10 MARINA BOULEVARD #38-01, MARINA BAY FINANCIAL CENTRE TOWER 2, SINGAPORE 018983',
    paidUpCapital: 'SGD 1,000,000',
    officers: [
      { name: 'CHENG WEI JIE', role: 'Director', idNumberMasked: 'S****482A', appointedDate: '2024-03-15' },
      { name: 'LADY GENEVIEVE ALISTAIR', role: 'Managing Director', idNumberMasked: 'G****891P', appointedDate: '2024-03-15' },
      { name: 'TAN MIN LI', role: 'Secretary', idNumberMasked: 'S****193C', appointedDate: '2024-03-15' },
    ],
    shareholders: [
      { name: 'EMERALD HORIZONS HOLDINGS LTD', shares: '1,000,000 Ordinary Shares', percentage: 100 },
    ],
    matchScore: 99,
    verifiedAt: '2026-08-16T08:18:00Z',
    registrySource: 'ACRA_API_MARKETPLACE' as const,
    proofHash: 'acra_proof_8849102938475829102938475610293847561029384756102938475610293847',
  };

  const rawEventsA = [
    {
      eventId: 'EVT-A01-INIT',
      caseId: caseAId,
      timestamp: '2026-08-16T08:15:00Z',
      actor: { type: 'AGENT' as const, id: 'orchestrator-agent', version: '1.2.0' },
      action: 'INGEST_ONBOARDING_CASE',
      evidence: [{ id: caseADocs[0].id, name: caseADocs[0].name, sha256: caseADocs[0].sha256 }],
      payloadSnapshot: { title: 'Emerald Crest Family Office & Trust (UBO Onboarding)', client: 'Lady Genevieve Alistair' },
    },
    {
      eventId: 'EVT-A02-DOC-EXTRACT',
      caseId: caseAId,
      timestamp: '2026-08-16T08:15:45Z',
      actor: { type: 'AGENT' as const, id: 'doc-extractor-agent', version: '2.0.1' },
      action: 'EXTRACT_LEGAL_CLAUSES_AND_ENTITIES',
      evidence: caseADocs.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
      tool: { name: 'gemini_multimodal_parser', resultHash: sha256('gemini_doc_digest_emerald_trust') },
      payloadSnapshot: { extractedTiers: 4, uboCandidate: 'Lady Genevieve Alistair' },
    },
    {
      eventId: 'EVT-A03-GRAPH-SYNTH',
      caseId: caseAId,
      timestamp: '2026-08-16T08:16:30Z',
      actor: { type: 'AGENT' as const, id: 'entity-graph-agent', version: '1.4.0' },
      action: 'SYNTHESIZE_UBO_OWNERSHIP_GRAPH',
      evidence: [{ id: caseADocs[0].id, name: caseADocs[0].name, sha256: caseADocs[0].sha256 }],
      payloadSnapshot: { uboIdentified: ['Lady Genevieve Alistair (100%)'], tiers: 4, circularLoops: 0 },
    },
    {
      eventId: 'EVT-A04-REGISTRY-VERIFY',
      caseId: caseAId,
      timestamp: '2026-08-16T08:17:15Z',
      actor: { type: 'AGENT' as const, id: 'acra-registry-agent', version: '2.2.0' },
      action: 'VERIFY_ACRA_CORPORATE_PROFILE',
      evidence: [{ id: caseADocs[1].id, name: caseADocs[1].name, sha256: caseADocs[1].sha256 }],
      tool: { name: 'acra_business_profile_api', resultHash: caseARegistry.proofHash },
      payloadSnapshot: { uen: caseARegistry.uen, status: caseARegistry.status, matchScore: caseARegistry.matchScore },
    },
    {
      eventId: 'EVT-A05-POLICY-EVAL',
      caseId: caseAId,
      timestamp: '2026-08-16T08:18:00Z',
      actor: { type: 'POLICY_ENGINE' as const, id: 'aegis-deterministic-policy-gate', version: '2.1.0' },
      action: 'EVALUATE_PRIVATE_BANKING_ONBOARDING_POLICY',
      evidence: caseADocs.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
      policy: { id: 'PB-ONBOARDING-STD-002', version: '2.1.0' },
      decision: 'ALLOW',
      payloadSnapshot: { decision: 'ALLOW', reasons: ['ALL_POLICY_RULES_SATISFIED'] },
    },
    {
      eventId: 'EVT-A06-GATEWAY-EXEC',
      caseId: caseAId,
      timestamp: '2026-08-16T08:18:30Z',
      actor: { type: 'ACTION_GATEWAY' as const, id: 'aegis-action-gateway', version: '1.0.0' },
      action: 'EXECUTE_AUTONOMOUS_ONBOARDING_CLEARANCE',
      evidence: caseADocs.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
      policy: { id: 'PB-ONBOARDING-STD-002', version: '2.1.0' },
      decision: 'ALLOW',
      payloadSnapshot: { accountProvisioned: 'ACC-SGD-89210-PB', clearanceLevel: 'AUTONOMOUS_TIER_1' },
    },
  ];

  const chainedEventsA = buildHashChain(rawEventsA, caseAId);
  const caseARoot = chainedEventsA[chainedEventsA.length - 1].eventHash;

  const receiptA = generateActionReceipt({
    caseId: caseAId,
    actionType: 'EXECUTE_AUTONOMOUS_ONBOARDING_CLEARANCE',
    agentId: 'aegis-action-gateway',
    agentVersion: '1.0.0',
    policyId: 'PB-ONBOARDING-STD-002',
    policyVersion: '2.1.0',
    decision: 'ALLOW',
    evidenceItems: caseADocs.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
    executionStatus: 'SUCCESS',
    lastEvent: chainedEventsA[chainedEventsA.length - 1],
    caseRootHash: caseARoot,
  });

  const caseA: Case = {
    id: caseAId,
    title: 'Emerald Crest Family Office & Trust (UBO Onboarding)',
    clientName: 'Lady Genevieve Alistair',
    type: 'ONBOARDING',
    status: 'COMPLETED',
    riskLevel: 'LOW',
    createdAt: '2026-08-16T08:15:00Z',
    updatedAt: '2026-08-16T08:18:30Z',
    targetEntityName: 'Aegis Wealth Management Pte Ltd',
    documents: caseADocs,
    entityGraph: caseAGraph,
    registryRecord: caseARegistry,
    policyEvaluation: {
      policyId: 'PB-ONBOARDING-STD-002',
      policyName: 'PBIG Private Banking Onboarding & UBO Standard',
      policyVersion: '2.1.0',
      decision: 'ALLOW',
      reasons: ['ALL_POLICY_RULES_SATISFIED: All deterministic criteria met within autonomous clearance authority.'],
      rulesEvaluated: [
        { ruleId: 'RULE-ONB-01-UBO-IDENTIFIED', name: 'Ultimate Beneficial Ownership (UBO >= 25%) Identification', conditionDescription: 'Natural person with >= 25% direct/indirect equity or control', passed: true, triggerDetails: 'Identified UBO: Lady Genevieve Alistair (100%)', actionIfViolated: 'HUMAN_REVIEW' },
        { ruleId: 'RULE-ONB-02-REGISTRY-VERIFIED', name: 'Singapore ACRA Registry Corporate Verification', conditionDescription: 'Entity verified on Singapore ACRA API with Match Score >= 80%', passed: true, triggerDetails: 'UEN 202418934K Status: Live, Match Score: 99%', actionIfViolated: 'HUMAN_REVIEW' },
        { ruleId: 'RULE-ONB-03-STRUCTURE-ANOMALY', name: 'Corporate Layering & Multi-Tier Anomaly Filter', conditionDescription: 'No flagged corporate layering anomalies or circular loops', passed: true, triggerDetails: 'Clean linear holding structure verified.', actionIfViolated: 'HUMAN_REVIEW' },
        { ruleId: 'RULE-ONB-04-EVIDENCE-COMPLETE', name: 'Cryptographic Document Completeness Check', conditionDescription: 'Mandatory trust deed + corporate constitution + KYC ID documents verified', passed: true, triggerDetails: '3 cryptographic proof documents verified.', actionIfViolated: 'HUMAN_REVIEW' },
      ],
      approvalRequired: false,
      evaluatedAt: '2026-08-16T08:18:00Z',
      policyHash: sha256('policy_eval_case_a_emerald'),
    },
    actionReceipts: [receiptA],
    events: chainedEventsA,
    telemetrySpans: [
      { spanId: 'span-a01', traceId: caseAId, agentId: 'orchestrator-agent', agentName: 'Aegis Core Orchestrator', operationName: 'ORCHESTRATE_ONBOARDING_FLOW', startTime: Date.now() - 180000, endTime: Date.now() - 175000, durationMs: 5000, status: 'OK', attributes: { client: 'Lady Genevieve Alistair' } },
      { spanId: 'span-a02', traceId: caseAId, parentSpanId: 'span-a01', agentId: 'doc-extractor-agent', agentName: 'Gemini Document Intelligence Agent', operationName: 'EXTRACT_LEGAL_CLAUSES', startTime: Date.now() - 175000, endTime: Date.now() - 165000, durationMs: 10000, status: 'OK', attributes: { docsExtracted: 3 } },
      { spanId: 'span-a03', traceId: caseAId, parentSpanId: 'span-a01', agentId: 'entity-graph-agent', agentName: 'UBO & Ownership Graph Agent', operationName: 'SYNTHESIZE_UBO_GRAPH', startTime: Date.now() - 165000, endTime: Date.now() - 158000, durationMs: 7000, status: 'OK', attributes: { uboCount: 1 } },
      { spanId: 'span-a04', traceId: caseAId, parentSpanId: 'span-a01', agentId: 'acra-registry-agent', agentName: 'Singapore ACRA Registry Verification Agent', operationName: 'ACRA_API_QUERY', startTime: Date.now() - 158000, endTime: Date.now() - 150000, durationMs: 8000, status: 'OK', attributes: { uen: '202418934K', matchScore: 99 } },
      { spanId: 'span-a05', traceId: caseAId, parentSpanId: 'span-a01', agentId: 'aegis-deterministic-policy-gate', agentName: 'Aegis Policy Gate', operationName: 'POLICY_DECISION_EVAL', startTime: Date.now() - 150000, endTime: Date.now() - 149000, durationMs: 1000, status: 'OK', attributes: { decision: 'ALLOW' } },
    ],
    caseIntegrityRoot: caseARoot,
    isTampered: false,
  };
  casesStore.set(caseAId, caseA);

  // -------------------------------------------------------------
  // SCENARIO B: AML Exception Case ($8.2M Wire Alert)
  // -------------------------------------------------------------
  const caseBId = 'CASE-2026-9104';
  const caseBDocs = [
    {
      id: 'DOC-AML-01',
      name: 'SWIFT_MT103_CrossBorder_Wire_8.2M_USD.txt',
      type: 'SWIFT_MESSAGE' as const,
      size: '42 KB',
      uploadedAt: '2026-08-16T09:00:00Z',
      sha256: 'b8e9d0c1f2a34567890abcdef1234567890abcdef1234567890abcdef1234567',
      extractedSnippet: ':32A:260816USD8200000,00\n:50K:/CH8900000000000000000\nSTARLIGHT COMMODITIES HOLDINGS LLC\n:59:/SG123456789000000000\nAEGIS WEALTH MGMT PTE LTD\n:70:COMMODITY HEDGE SETTLEMENT REF #99824',
      summary: 'Inbound SWIFT wire transfer of USD $8,200,000 originating from First Zurich Private Bank via Cayman intermediary.',
    },
    {
      id: 'DOC-AML-02',
      name: 'Commodities_Trade_Contract_Unsigned.pdf',
      type: 'SOURCE_OF_WEALTH' as const,
      size: '1.2 MB',
      uploadedAt: '2026-08-16T09:01:20Z',
      sha256: 'e5f6a7b8c9d01234567890abcdef1234567890abcdef1234567890abcdef1234',
      extractedSnippet: 'Provisional Trade Term Sheet: Spot Physical Copper Cathode Supply Contract between Starlight Commodities LLC and Off-taker. Note: Annexure B (Bill of Lading) not attached.',
      summary: 'Trade contract lacking verified shipping manifests or third-party warehouse warrants.',
    },
  ];

  const caseBAMLDetails = {
    transactionId: 'TX-SWIFT-2026-88902',
    amount: 8200000,
    currency: 'USD',
    originator: 'Starlight Commodities Holdings LLC (Delaware / Zurich Account)',
    originatorBank: 'First Zurich Private Bank AG (Switzerland)',
    beneficiary: 'Aegis Wealth Management Pte Ltd (Singapore)',
    beneficiaryBank: 'DBS Bank Singapore',
    corridor: 'CHE -> CYM -> SGP (High-Scrutiny Offshore Corridor)',
    corridorRisk: 'HIGH' as const,
    sourceOfFundsDeclared: 'Structured Physical Commodities Hedging Settlement',
    sourceOfFundsVerified: false,
    sanctionsCheckStatus: 'CLEAR' as const,
    pepMatch: false,
    adverseMediaHit: false,
    uboMismatch: true,
    overallRisk: 'HIGH' as const,
    findings: [
      'Single transaction value of USD $8,200,000 exceeds autonomous gate threshold ($5,000,000)',
      'Intermediate routing through Cayman intermediary without direct operational nexus',
      'Declared underlying trade documentation lacks independent cryptographic corroboration (missing bill of lading)',
      'Signatory beneficial ownership mismatch against KYC registered controlling profile',
    ],
  };

  const rawEventsB = [
    {
      eventId: 'EVT-B01-ALERT',
      caseId: caseBId,
      timestamp: '2026-08-16T09:00:00Z',
      actor: { type: 'AGENT' as const, id: 'orchestrator-agent', version: '1.2.0' },
      action: 'INGEST_AML_TRANSACTION_ALERT',
      evidence: [{ id: caseBDocs[0].id, name: caseBDocs[0].name, sha256: caseBDocs[0].sha256 }],
      payloadSnapshot: { transactionId: caseBAMLDetails.transactionId, amount: 8200000, currency: 'USD' },
    },
    {
      eventId: 'EVT-B02-AML-INVESTIGATE',
      caseId: caseBId,
      timestamp: '2026-08-16T09:01:00Z',
      actor: { type: 'AGENT' as const, id: 'aml-investigator-agent', version: '3.1.0' },
      action: 'EXECUTE_PARALLEL_AML_INVESTIGATION',
      evidence: caseBDocs.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
      tool: { name: 'swift_decoder_risk_engine', resultHash: sha256('aml_findings_starlight') },
      payloadSnapshot: { riskCategory: 'HIGH', findingsCount: caseBAMLDetails.findings.length },
    },
    {
      eventId: 'EVT-B03-POLICY-GATE',
      caseId: caseBId,
      timestamp: '2026-08-16T09:02:00Z',
      actor: { type: 'POLICY_ENGINE' as const, id: 'aegis-deterministic-policy-gate', version: '1.0.0' },
      action: 'EVALUATE_AML_THRESHOLD_POLICY',
      evidence: caseBDocs.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
      policy: { id: 'AML-TRANSACTION-GATE-001', version: '1.0.0' },
      decision: 'HUMAN_REVIEW',
      payloadSnapshot: {
        decision: 'HUMAN_REVIEW',
        reasons: ['TRANSACTION_ABOVE_THRESHOLD: Value of USD 8,200,000 exceeds Policy v1.0.0 autonomous limit of USD 5,000,000', 'INCOMPLETE_SOURCE_OF_FUNDS'],
      },
    },
    {
      eventId: 'EVT-B04-GATEWAY-HOLD',
      caseId: caseBId,
      timestamp: '2026-08-16T09:02:30Z',
      actor: { type: 'ACTION_GATEWAY' as const, id: 'aegis-action-gateway', version: '1.0.0' },
      action: 'PLACE_AUTOMATED_TRANSACTION_HOLD',
      evidence: caseBDocs.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
      policy: { id: 'AML-TRANSACTION-GATE-001', version: '1.0.0' },
      decision: 'HUMAN_REVIEW',
      payloadSnapshot: { holdReference: 'HOLD-SG-2026-88902', action: 'TRANSACTION_HOLD_ENFORCED', status: 'AWAITING_COMPLIANCE_OFFICER_SIGNATURE' },
    },
  ];

  const chainedEventsB = buildHashChain(rawEventsB, caseBId);
  const caseBRoot = chainedEventsB[chainedEventsB.length - 1].eventHash;

  const receiptB = generateActionReceipt({
    caseId: caseBId,
    actionType: 'PLACE_AUTOMATED_TRANSACTION_HOLD',
    agentId: 'aegis-action-gateway',
    agentVersion: '1.0.0',
    policyId: 'AML-TRANSACTION-GATE-001',
    policyVersion: '1.0.0',
    decision: 'HUMAN_REVIEW',
    evidenceItems: caseBDocs.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
    executionStatus: 'BLOCKED',
    lastEvent: chainedEventsB[chainedEventsB.length - 1],
    caseRootHash: caseBRoot,
  });

  const caseB: Case = {
    id: caseBId,
    title: 'Starlight Commodities ($8.2M Wire Exception Alert)',
    clientName: 'Starlight Commodities Holdings LLC',
    type: 'AML_ALERT',
    status: 'PENDING_APPROVAL',
    riskLevel: 'HIGH',
    createdAt: '2026-08-16T09:00:00Z',
    updatedAt: '2026-08-16T09:02:30Z',
    targetEntityName: 'Starlight Commodities Holdings LLC',
    documents: caseBDocs,
    entityGraph: {
      nodes: [
        { id: 'node-b1', name: 'Starlight Commodities LLC', type: 'OPERATING_CO', jurisdiction: 'Delaware, USA', percentage: 100, roles: ['Originator'] },
        { id: 'node-b2', name: 'Starlight Swiss Nominee SA', type: 'HOLDING_CO', jurisdiction: 'Switzerland', percentage: 100, roles: ['Banking Account Holder'] },
        { id: 'node-b3', name: 'Aegis Wealth Management Pte Ltd', type: 'OPERATING_CO', jurisdiction: 'Singapore', percentage: 100, isVerifiedWithRegistry: true, roles: ['Beneficiary Client'] },
      ],
      links: [
        { from: 'node-b1', to: 'node-b2', percentage: 100, relationshipType: 'SHAREHOLDER' },
        { from: 'node-b2', to: 'node-b3', percentage: 100, relationshipType: 'BENEFICIARY' },
      ],
      uboIdentified: ['Unknown Offshore Nominee / Uncorroborated'],
      totalTiers: 3,
      anomaliesDetected: ['Discrepancy in beneficiary entity cross-matching against SWIFT MT103 field 50K'],
    },
    amlDetails: caseBAMLDetails,
    policyEvaluation: {
      policyId: 'AML-TRANSACTION-GATE-001',
      policyName: 'MAS AML/CFT Complex Transaction Gate',
      policyVersion: '1.0.0',
      thresholdAmount: 5000000,
      decision: 'HUMAN_REVIEW',
      reasons: [
        'TRANSACTION_ABOVE_THRESHOLD: Value of USD 8,200,000 exceeds Policy v1.0.0 autonomous limit of USD 5,000,000',
        'HIGH_RISK_JURISDICTION: Corridor CHE -> CYM -> SGP triggers heightened regulatory review',
        'INCOMPLETE_SOURCE_OF_FUNDS: Supporting wealth documentation incomplete or uncorroborated',
        'UBO_MISMATCH: Beneficiary entity ownership structure differs from established KYC baseline',
      ],
      rulesEvaluated: [
        { ruleId: 'RULE-AML-01-THRESHOLD', name: 'High-Value Wire Transfer Threshold Check', conditionDescription: 'Transaction Amount (USD 8,200,000) > Autonomous Limit (USD 5,000,000)', passed: false, triggerDetails: 'Exceeds autonomous limit by USD 3,200,000. Mandatory human checkpoint.', actionIfViolated: 'HUMAN_REVIEW' },
        { ruleId: 'RULE-AML-02-CORRIDOR', name: 'FATF High-Risk Jurisdiction Corridor Filter', conditionDescription: 'Corridor Risk Level <= MEDIUM', passed: false, triggerDetails: 'CHE -> CYM -> SGP flagged as HIGH AML risk corridor.', actionIfViolated: 'HUMAN_REVIEW' },
        { ruleId: 'RULE-AML-03-SANCTIONS-PEP', name: 'Sanctions List & Politically Exposed Persons (PEP) Check', conditionDescription: 'Sanctions Check == CLEAR and PEP Match == FALSE', passed: true, triggerDetails: 'Sanctions: Clear, PEP: False', actionIfViolated: 'DENY' },
        { ruleId: 'RULE-AML-04-SOF-VERIFIED', name: 'Source of Funds & Wealth Corroboration', conditionDescription: 'Source of Funds declared AND verified against evidence documents', passed: false, triggerDetails: 'Unverified trade settlement document.', actionIfViolated: 'HUMAN_REVIEW' },
        { ruleId: 'RULE-AML-05-UBO-MATCH', name: 'Beneficiary Entity UBO Matching', conditionDescription: 'Transacting entity UBO must match registered KYC UBO', passed: false, triggerDetails: 'Signatory mismatch.', actionIfViolated: 'HUMAN_REVIEW' },
      ],
      approvalRequired: true,
      evaluatedAt: '2026-08-16T09:02:00Z',
      policyHash: sha256('policy_eval_case_b_starlight'),
    },
    humanApproval: {
      status: 'PENDING',
    },
    actionReceipts: [receiptB],
    events: chainedEventsB,
    telemetrySpans: [
      { spanId: 'span-b01', traceId: caseBId, agentId: 'orchestrator-agent', agentName: 'Aegis Core Orchestrator', operationName: 'INGEST_TRANSACTION_ALERT', startTime: Date.now() - 120000, endTime: Date.now() - 116000, durationMs: 4000, status: 'OK', attributes: { txId: caseBAMLDetails.transactionId, amount: 8200000 } },
      { spanId: 'span-b02', traceId: caseBId, parentSpanId: 'span-b01', agentId: 'aml-investigator-agent', agentName: 'MAS AML/CFT Investigation Agent', operationName: 'ANALYZE_SWIFT_CORRIDOR', startTime: Date.now() - 116000, endTime: Date.now() - 105000, durationMs: 11000, status: 'OK', attributes: { corridor: 'CHE -> CYM -> SGP', riskCategory: 'HIGH' } },
      { spanId: 'span-b03', traceId: caseBId, parentSpanId: 'span-b01', agentId: 'aegis-deterministic-policy-gate', agentName: 'Aegis Policy Gate', operationName: 'EVALUATE_POLICY_THRESHOLD', startTime: Date.now() - 105000, endTime: Date.now() - 104000, durationMs: 1000, status: 'OK', attributes: { decision: 'HUMAN_REVIEW', policyVersion: '1.0.0' } },
      { spanId: 'span-b04', traceId: caseBId, parentSpanId: 'span-b01', agentId: 'aegis-action-gateway', agentName: 'Aegis Action Gateway', operationName: 'ENFORCE_TRANSACTION_HOLD', startTime: Date.now() - 104000, endTime: Date.now() - 102000, durationMs: 2000, status: 'OK', attributes: { holdRef: 'HOLD-SG-2026-88902' } },
    ],
    caseIntegrityRoot: caseBRoot,
    isTampered: false,
  };
  casesStore.set(caseBId, caseB);
}

// Initialize on boot
initializeDemoCases();

export function getAllCases(): Case[] {
  return Array.from(casesStore.values());
}

export function getCaseById(id: string): Case | undefined {
  return casesStore.get(id);
}

export function saveCase(caseData: Case): Case {
  casesStore.set(caseData.id, caseData);
  return caseData;
}

export function applyHumanDecision(caseId: string, decision: 'APPROVED' | 'REJECTED' | 'REQUEST_INFO', reviewerName: string, notes: string, conditions?: string[]): Case {
  const c = casesStore.get(caseId);
  if (!c) throw new Error('Case not found');

  c.humanApproval = {
    status: decision,
    reviewerName,
    reviewerRole: 'Principal Compliance Officer (PBIG SG)',
    reviewedAt: new Date().toISOString(),
    decisionReason: notes,
    digitalSignature: `sig_mas_officer_${sha256(reviewerName + notes + Date.now()).slice(0, 24)}`,
    conditionsApplied: conditions || [],
  };

  c.status = decision === 'APPROVED' ? 'APPROVED' : (decision === 'REJECTED' ? 'REJECTED' : 'INVESTIGATING');
  c.updatedAt = new Date().toISOString();

  // Add Human approval event to Hash Chain
  const newRawEvents: RawAegisEvent[] = c.events.map(e => ({
    eventId: e.eventId,
    caseId: e.caseId,
    timestamp: e.timestamp,
    actor: e.actor,
    action: e.action,
    evidence: e.evidence,
    policy: e.policy,
    decision: e.decision,
    tool: e.tool,
    payloadSnapshot: e.payloadSnapshot,
  }));

  newRawEvents.push({
    eventId: `EVT-${Date.now().toString(36).toUpperCase()}-HUMAN-DECISION`,
    caseId: c.id,
    timestamp: new Date().toISOString(),
    actor: { type: 'HUMAN_OFFICER', id: reviewerName, version: '1.0' },
    action: `HUMAN_COMPLIANCE_${decision}`,
    evidence: c.documents.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
    policy: c.policyEvaluation ? { id: c.policyEvaluation.policyId, version: c.policyEvaluation.policyVersion } : undefined,
    decision,
    payloadSnapshot: { reviewerName, notes, conditions: conditions || [] },
  });

  if (decision === 'APPROVED') {
    newRawEvents.push({
      eventId: `EVT-${Date.now().toString(36).toUpperCase()}-GATEWAY-RELEASE`,
      caseId: c.id,
      timestamp: new Date().toISOString(),
      actor: { type: 'ACTION_GATEWAY', id: 'aegis-action-gateway', version: '1.0.0' },
      action: 'RELEASE_TRANSACTION_HOLD_WITH_SUPERVISORY_RECEIPT',
      evidence: c.documents.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
      policy: c.policyEvaluation ? { id: c.policyEvaluation.policyId, version: c.policyEvaluation.policyVersion } : undefined,
      decision: 'ALLOW',
      payloadSnapshot: { holdReleased: true, authorizationToken: sha256(`AUTH_RELEASE_${c.id}`) },
    });
  }

  c.events = buildHashChain(newRawEvents, c.id);
  c.caseIntegrityRoot = c.events[c.events.length - 1].eventHash;

  const receipt = generateActionReceipt({
    caseId: c.id,
    actionType: decision === 'APPROVED' ? 'RELEASE_TRANSACTION_HOLD' : `HUMAN_COMPLIANCE_${decision}`,
    agentId: 'aegis-action-gateway',
    agentVersion: '1.0.0',
    policyId: c.policyEvaluation?.policyId || 'AML-TRANSACTION-GATE-001',
    policyVersion: c.policyEvaluation?.policyVersion || '1.0.0',
    decision,
    evidenceItems: c.documents.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
    executionStatus: decision === 'APPROVED' ? 'SUCCESS' : 'BLOCKED',
    lastEvent: c.events[c.events.length - 1],
    caseRootHash: c.caseIntegrityRoot,
  });

  c.actionReceipts.push(receipt);
  casesStore.set(c.id, c);
  return c;
}

export function tamperCaseEvent(caseId: string, eventIndex: number, maliciousModification: string): Case {
  const c = casesStore.get(caseId);
  if (!c) throw new Error('Case not found');

  if (eventIndex >= 0 && eventIndex < c.events.length) {
    const target = c.events[eventIndex];
    target.payloadSnapshot = {
      ...target.payloadSnapshot,
      _maliciousTamper: maliciousModification,
      amount: 4200000, // modified amount to try to bypass threshold
      decision: 'ALLOW_FORGED_BYPASS',
      tamperedAt: new Date().toISOString(),
    };
    c.isTampered = true;
    c.tamperedEventIndex = eventIndex;
    c.tamperMessage = `Tampered Event #${eventIndex} (${target.action}): Malicious payload injected ("${maliciousModification}"). Previous recorded hash link is now mathematically invalid.`;
    casesStore.set(c.id, c);
  }
  return c;
}

export function restoreCaseFromTamper(caseId: string): Case {
  initializeDemoCases();
  const restored = casesStore.get(caseId);
  if (!restored) throw new Error('Case not found after restore');
  return restored;
}
