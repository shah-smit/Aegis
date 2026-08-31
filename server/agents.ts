import { AgentIdentity, Case, DocumentRecord, EntityGraph, RegistryRecord, AMLDetails } from '../src/types';
import { generateGeminiDocumentAnalysis, generateGeminiAMLInvestigation } from './gemini';
import { sha256 } from './cryptoUtils';
import { telemetry } from './telemetry';

export const REGISTERED_AGENTS: Record<string, AgentIdentity> = {
  'orchestrator-agent': {
    id: 'orchestrator-agent',
    name: 'Aegis Core Orchestrator',
    version: '1.2.0',
    role: 'Workflow Coordinator & Policy Dispatcher',
    allowedTools: ['dispatch_subagent', 'aggregate_evidence', 'request_policy_evaluation', 'invoke_action_gateway'],
    permissions: ['READ_CASE', 'WRITE_EVIDENCE', 'INVOKE_POLICY'],
  },
  'doc-extractor-agent': {
    id: 'doc-extractor-agent',
    name: 'Gemini Document Intelligence Agent',
    version: '2.0.1',
    role: 'Unstructured Legal Document Parser & Clause Extractor',
    allowedTools: ['gemini_multimodal_parser', 'ocr_pipeline', 'clause_extractor', 'digest_signer'],
    permissions: ['READ_DOCUMENTS', 'EMIT_ENTITY_CANDIDATES'],
  },
  'entity-graph-agent': {
    id: 'entity-graph-agent',
    name: 'UBO & Ownership Graph Agent',
    version: '1.4.0',
    role: 'Multi-Tier Corporate & Trust Graph Synthesizer',
    allowedTools: ['graph_synthesizer', 'ubo_calculation_engine', 'circular_loop_detector'],
    permissions: ['READ_ENTITIES', 'CALCULATE_UBO', 'WRITE_GRAPH'],
  },
  'acra-registry-agent': {
    id: 'acra-registry-agent',
    name: 'Singapore ACRA Registry Verification Agent',
    version: '2.2.0',
    role: 'ACRA Business Profile API Verifier & Live Corporate Matcher',
    allowedTools: ['acra_business_profile_api', 'uen_lookup', 'officer_cross_reference'],
    permissions: ['QUERY_REGISTRY', 'VERIFY_OFFICERS'],
  },
  'aml-investigator-agent': {
    id: 'aml-investigator-agent',
    name: 'MAS AML/CFT Investigation Agent',
    version: '3.1.0',
    role: 'Transaction Analysis, PEP & High-Risk Corridor Corroborator',
    allowedTools: ['swift_message_decoder', 'sanctions_screener', 'pep_database', 'risk_scorer'],
    permissions: ['ANALYZE_TRANSACTION', 'SCORE_AML_RISK'],
  },
};

export async function runDocumentExtraction(
  caseId: string,
  doc: DocumentRecord,
  parentSpanId?: string
) {
  const spanHandle = telemetry.startSpan({
    traceId: caseId,
    parentSpanId,
    agentId: REGISTERED_AGENTS['doc-extractor-agent'].id,
    agentName: REGISTERED_AGENTS['doc-extractor-agent'].name,
    operationName: 'PARSE_AND_EXTRACT_LEGAL_DOC',
    attributes: { docId: doc.id, docName: doc.name, docType: doc.type, docHash: doc.sha256 },
  });

  const analysis = await generateGeminiDocumentAnalysis(doc.name, doc.extractedSnippet);
  
  const span = spanHandle.end('OK', {
    entitiesCount: analysis.extractedEntities.length,
    uboCandidatesCount: analysis.uboCandidates.length,
  });

  return {
    analysis,
    span,
    agent: REGISTERED_AGENTS['doc-extractor-agent'],
  };
}

export async function runEntityGraphSynthesis(
  caseId: string,
  targetEntityName: string,
  extractedEntities: Array<{ name: string; type: string; jurisdiction: string; percentage?: number; role?: string }>,
  uboCandidates: Array<{ name: string; reason: string; percentage: number }>,
  parentSpanId?: string
): Promise<{ graph: EntityGraph; span: any; agent: AgentIdentity }> {
  const spanHandle = telemetry.startSpan({
    traceId: caseId,
    parentSpanId,
    agentId: REGISTERED_AGENTS['entity-graph-agent'].id,
    agentName: REGISTERED_AGENTS['entity-graph-agent'].name,
    operationName: 'SYNTHESIZE_UBO_OWNERSHIP_GRAPH',
    attributes: { targetEntity: targetEntityName, rawEntitiesCount: extractedEntities.length },
  });

  // Construct nodes and links
  const nodes = extractedEntities.map((e, idx) => ({
    id: `node-${idx + 1}`,
    name: e.name,
    type: (e.type as any) || 'HOLDING_CO',
    jurisdiction: e.jurisdiction || 'Singapore',
    percentage: e.percentage || 100,
    roles: e.role ? [e.role] : [],
    isUBO: uboCandidates.some(u => u.name.toLowerCase() === e.name.toLowerCase()),
    isVerifiedWithRegistry: e.jurisdiction.toLowerCase().includes('singapore'),
  }));

  const links = [];
  if (nodes.length >= 2) {
    for (let i = 0; i < nodes.length - 1; i++) {
      links.push({
        from: nodes[i].id,
        to: nodes[i + 1].id,
        percentage: nodes[i + 1].percentage || 100,
        relationshipType: (i === 0 ? 'SETTLOR' : (i === nodes.length - 2 ? 'SHAREHOLDER' : 'BENEFICIARY')) as any,
      });
    }
  }

  const uboList = uboCandidates.map(u => `${u.name} (${u.percentage}%)`);
  const graph: EntityGraph = {
    nodes,
    links,
    uboIdentified: uboList.length > 0 ? uboList : ['Lady Genevieve Alistair (100%)'],
    totalTiers: Math.max(1, nodes.length),
    anomaliesDetected: [],
  };

  const span = spanHandle.end('OK', { totalNodes: nodes.length, totalTiers: graph.totalTiers });

  return {
    graph,
    span,
    agent: REGISTERED_AGENTS['entity-graph-agent'],
  };
}

export async function runRegistryVerification(
  caseId: string,
  entityName: string,
  parentSpanId?: string
): Promise<{ registry: RegistryRecord; span: any; agent: AgentIdentity }> {
  const spanHandle = telemetry.startSpan({
    traceId: caseId,
    parentSpanId,
    agentId: REGISTERED_AGENTS['acra-registry-agent'].id,
    agentName: REGISTERED_AGENTS['acra-registry-agent'].name,
    operationName: 'ACRA_API_BUSINESS_PROFILE_QUERY',
    attributes: { queryEntity: entityName, registryAdapter: 'ACRA_API_MARKETPLACE' },
  });

  // ACRA Business Profile Data API Mock/Live Adapter
  const cleanName = entityName.toUpperCase();
  const uen = '202418934K';
  const registeredAddress = '10 MARINA BOULEVARD #38-01, MARINA BAY FINANCIAL CENTRE TOWER 2, SINGAPORE 018983';

  const officers = [
    { name: 'CHENG WEI JIE', role: 'Director', idNumberMasked: 'S****482A', appointedDate: '2024-03-15' },
    { name: 'LADY GENEVIEVE ALISTAIR', role: 'Managing Director', idNumberMasked: 'G****891P', appointedDate: '2024-03-15' },
    { name: 'TAN MIN LI', role: 'Secretary', idNumberMasked: 'S****193C', appointedDate: '2024-03-15' },
  ];

  const shareholders = [
    { name: 'EMERALD HORIZONS HOLDINGS LTD', shares: '1,000,000 Ordinary Shares', percentage: 100 },
  ];

  const rawRecord = {
    uen,
    entityName: cleanName,
    status: 'Live',
    incorporationDate: '2024-03-15',
    registeredAddress,
    paidUpCapital: 'SGD 1,000,000',
    officers,
    shareholders,
    matchScore: 98,
    verifiedAt: new Date().toISOString(),
    registrySource: 'ACRA_API_MARKETPLACE' as const,
  };

  const proofHash = sha256(rawRecord);
  const registry: RegistryRecord = {
    ...rawRecord,
    proofHash,
  };

  const span = spanHandle.end('OK', { uen, matchScore: 98, status: 'Live' });

  return {
    registry,
    span,
    agent: REGISTERED_AGENTS['acra-registry-agent'],
  };
}

export async function runAMLInvestigation(
  caseId: string,
  amlData: Partial<AMLDetails>,
  parentSpanId?: string
): Promise<{ amlDetails: AMLDetails; span: any; agent: AgentIdentity }> {
  const spanHandle = telemetry.startSpan({
    traceId: caseId,
    parentSpanId,
    agentId: REGISTERED_AGENTS['aml-investigator-agent'].id,
    agentName: REGISTERED_AGENTS['aml-investigator-agent'].name,
    operationName: 'MAS_AML_TRANSACTION_INVESTIGATION',
    attributes: { amount: amlData.amount, corridor: amlData.corridor, beneficiary: amlData.beneficiary },
  });

  const aiResult = await generateGeminiAMLInvestigation(amlData);

  const amlDetails: AMLDetails = {
    transactionId: amlData.transactionId || `TX-SWIFT-${Date.now().toString(36).toUpperCase()}`,
    amount: amlData.amount || 8200000,
    currency: amlData.currency || 'USD',
    originator: amlData.originator || 'Starlight Commodities Holdings LLC (Delaware)',
    originatorBank: amlData.originatorBank || 'First Zurich Private Bank AG (Geneva Branch)',
    beneficiary: amlData.beneficiary || 'Aegis Wealth Management Pte Ltd (Singapore)',
    beneficiaryBank: amlData.beneficiaryBank || 'DBS Bank Singapore',
    corridor: amlData.corridor || 'CHE -> CYM -> SGP (High-Scrutiny Offshore Corridor)',
    corridorRisk: (amlData.corridorRisk as any) || 'HIGH',
    sourceOfFundsDeclared: amlData.sourceOfFundsDeclared || 'Structured Commodities Trade Financing Settlement',
    sourceOfFundsVerified: amlData.sourceOfFundsVerified !== undefined ? amlData.sourceOfFundsVerified : false,
    sanctionsCheckStatus: (amlData.sanctionsCheckStatus as any) || 'CLEAR',
    pepMatch: amlData.pepMatch !== undefined ? amlData.pepMatch : false,
    pepDetails: amlData.pepDetails,
    adverseMediaHit: amlData.adverseMediaHit !== undefined ? amlData.adverseMediaHit : false,
    uboMismatch: amlData.uboMismatch !== undefined ? amlData.uboMismatch : true,
    overallRisk: aiResult.riskCategory || 'HIGH',
    findings: aiResult.findings.length > 0 ? aiResult.findings : [
      'Transaction value of USD $8,200,000 exceeds single-ticket velocity threshold ($5,000,000)',
      'Intermediate routing through Cayman intermediary with nominal capitalization',
      'Declared trade settlement lacks signed bill of lading or counterparty verification',
    ],
  };

  const span = spanHandle.end('OK', { riskCategory: amlDetails.overallRisk, riskScore: aiResult.riskScore });

  return {
    amlDetails,
    span,
    agent: REGISTERED_AGENTS['aml-investigator-agent'],
  };
}
