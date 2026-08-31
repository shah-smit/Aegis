import { Router } from 'express';
import { 
  getAllCases, 
  getCaseById, 
  saveCase, 
  applyHumanDecision, 
  tamperCaseEvent, 
  restoreCaseFromTamper, 
  initializeDemoCases 
} from './storage';
import { verifyCaseIntegrity, buildHashChain, generateActionReceipt, sha256, RawAegisEvent } from './cryptoUtils';
import { evaluatePolicy, currentPolicyConfig, setPolicyConfig } from './policyEngine';
import { 
  REGISTERED_AGENTS, 
  runDocumentExtraction, 
  runEntityGraphSynthesis, 
  runRegistryVerification, 
  runAMLInvestigation 
} from './agents';
import { Case, DocumentRecord } from '../src/types';

export const apiRouter = Router();

// Get all cases
apiRouter.get('/cases', (req, res) => {
  res.json({ cases: getAllCases() });
});

// Get case by ID
apiRouter.get('/cases/:id', (req, res) => {
  const c = getCaseById(req.params.id);
  if (!c) {
    res.status(404).json({ error: 'Case not found' });
    return;
  }
  res.json({ case: c });
});

// Verify case integrity
apiRouter.post('/cases/:id/verify', (req, res) => {
  const c = getCaseById(req.params.id);
  if (!c) {
    res.status(404).json({ error: 'Case not found' });
    return;
  }

  const result = verifyCaseIntegrity(c.events, c.id, c.caseIntegrityRoot);
  res.json({
    caseId: c.id,
    integrity: result,
    isTampered: c.isTampered,
    tamperMessage: c.tamperMessage,
    eventsCount: c.events.length,
    registeredRoot: c.caseIntegrityRoot,
    calculatedRoot: result.calculatedRoot,
  });
});

// Tamper simulation
apiRouter.post('/cases/:id/tamper', (req, res) => {
  const { eventIndex, maliciousModification } = req.body;
  try {
    const updated = tamperCaseEvent(
      req.params.id, 
      eventIndex !== undefined ? Number(eventIndex) : 1, 
      maliciousModification || 'Forged payload: Altered transaction amount to bypass policy gate'
    );
    res.json({ success: true, case: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Restore case from tamper
apiRouter.post('/cases/:id/restore', (req, res) => {
  try {
    const restored = restoreCaseFromTamper(req.params.id);
    res.json({ success: true, case: restored });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Human decision submission
apiRouter.post('/cases/:id/human-decision', (req, res) => {
  const { decision, reviewerName, notes, conditions } = req.body;
  if (!decision || !['APPROVED', 'REJECTED', 'REQUEST_INFO'].includes(decision)) {
    res.status(400).json({ error: 'Invalid decision' });
    return;
  }

  try {
    const updated = applyHumanDecision(
      req.params.id,
      decision,
      reviewerName || 'Senior Compliance Officer',
      notes || 'Compliance check completed pursuant to MAS Notice 626 guidance.',
      conditions
    );
    res.json({ success: true, case: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Policy Config Get & Update
apiRouter.get('/policy/config', (req, res) => {
  res.json({ config: currentPolicyConfig });
});

apiRouter.post('/policy/config', (req, res) => {
  const { amlTransactionThreshold, strictUboThreshold, policyVersion } = req.body;
  const updated = setPolicyConfig({
    amlTransactionThreshold: amlTransactionThreshold ? Number(amlTransactionThreshold) : undefined,
    strictUboThreshold: strictUboThreshold ? Number(strictUboThreshold) : undefined,
    policyVersion: policyVersion || (amlTransactionThreshold ? (Number(amlTransactionThreshold) > 5000000 ? '1.1.0' : '1.0.0') : undefined),
  });
  res.json({ success: true, config: updated });
});

// Re-evaluate policy for a case (for the Policy Version demo!)
apiRouter.post('/cases/:id/re-evaluate-policy', (req, res) => {
  const c = getCaseById(req.params.id);
  if (!c) {
    res.status(404).json({ error: 'Case not found' });
    return;
  }

  const { configOverride } = req.body;
  const evaluation = evaluatePolicy(c, configOverride);
  c.policyEvaluation = evaluation;

  // Add policy evaluation update to hash chain
  const rawEvents: RawAegisEvent[] = c.events.map(e => ({
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

  rawEvents.push({
    eventId: `EVT-${Date.now().toString(36).toUpperCase()}-POLICY-UPDATE`,
    caseId: c.id,
    timestamp: new Date().toISOString(),
    actor: { type: 'POLICY_ENGINE', id: 'aegis-deterministic-policy-gate', version: evaluation.policyVersion },
    action: 'REEVALUATE_POLICY_VERSION',
    evidence: c.documents.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
    policy: { id: evaluation.policyId, version: evaluation.policyVersion },
    decision: evaluation.decision,
    payloadSnapshot: {
      newPolicyVersion: evaluation.policyVersion,
      threshold: evaluation.thresholdAmount,
      decision: evaluation.decision,
      reasons: evaluation.reasons,
    },
  });

  if (evaluation.decision === 'ALLOW') {
    rawEvents.push({
      eventId: `EVT-${Date.now().toString(36).toUpperCase()}-AUTONOMOUS-ALLOW`,
      caseId: c.id,
      timestamp: new Date().toISOString(),
      actor: { type: 'ACTION_GATEWAY', id: 'aegis-action-gateway', version: '1.0.0' },
      action: 'AUTONOMOUS_POLICY_CLEARANCE_UNDER_UPDATED_POLICY',
      evidence: c.documents.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
      policy: { id: evaluation.policyId, version: evaluation.policyVersion },
      decision: 'ALLOW',
      payloadSnapshot: { executionStatus: 'AUTHORIZED_AUTONOMOUSLY', policyVersion: evaluation.policyVersion },
    });
    c.status = 'APPROVED';
  } else {
    c.status = 'PENDING_APPROVAL';
  }

  c.events = buildHashChain(rawEvents, c.id);
  c.caseIntegrityRoot = c.events[c.events.length - 1].eventHash;

  const receipt = generateActionReceipt({
    caseId: c.id,
    actionType: 'POLICY_VERSION_UPDATE_EVALUATION',
    agentId: 'aegis-action-gateway',
    agentVersion: '1.0.0',
    policyId: evaluation.policyId,
    policyVersion: evaluation.policyVersion,
    decision: evaluation.decision,
    evidenceItems: c.documents.map(d => ({ id: d.id, name: d.name, sha256: d.sha256 })),
    executionStatus: evaluation.decision === 'ALLOW' ? 'SUCCESS' : 'BLOCKED',
    lastEvent: c.events[c.events.length - 1],
    caseRootHash: c.caseIntegrityRoot,
  });

  c.actionReceipts.push(receipt);
  saveCase(c);

  res.json({ success: true, case: c, evaluation });
});

// Create and run a new autonomous case
apiRouter.post('/cases/create', async (req, res) => {
  const { title, clientName, type, targetEntityName, documentText, documentName, amlAmount, amlCorridor } = req.body;

  try {
    const caseId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const docId = `DOC-INGEST-${Date.now().toString(36).toUpperCase()}`;
    const docPayload = documentText || `Irrevocable Trust Agreement for ${clientName || 'Beneficiary'}. Settling assets into ${targetEntityName || 'Holding Co'}. UBO candidate holds 100% beneficial interest.`;
    const docHash = sha256(docPayload);

    const docRecord: DocumentRecord = {
      id: docId,
      name: documentName || 'Legal_Trust_Deed_Ingested.pdf',
      type: (type === 'AML_ALERT' ? 'SWIFT_MESSAGE' : 'TRUST_DEED') as any,
      size: `${Math.round(docPayload.length / 10) / 100} KB`,
      uploadedAt: new Date().toISOString(),
      sha256: docHash,
      extractedSnippet: docPayload.slice(0, 300) + '...',
      summary: 'Ingested document analyzed by Gemini multi-agent extraction pipeline.',
    };

    // Step 1: Run Document Agent
    const docExtraction = await runDocumentExtraction(caseId, docRecord);

    // Step 2: Run Entity Agent
    const entityResult = await runEntityGraphSynthesis(
      caseId,
      targetEntityName || 'Target Asset Entity',
      docExtraction.analysis.extractedEntities,
      docExtraction.analysis.uboCandidates
    );

    // Step 3: Run Registry Agent
    const registryResult = await runRegistryVerification(caseId, targetEntityName || 'Aegis Wealth Management Pte Ltd');

    // Step 4: Run AML Agent if AML case
    let amlDetailsResult = undefined;
    if (type === 'AML_ALERT') {
      const amlRes = await runAMLInvestigation(caseId, {
        amount: Number(amlAmount) || 6500000,
        corridor: amlCorridor || 'CHE -> CYM -> SGP',
        beneficiary: targetEntityName || 'Aegis Wealth Management Pte Ltd',
      });
      amlDetailsResult = amlRes.amlDetails;
    }

    // Step 5: Build provisional case
    const provisionalCase: Case = {
      id: caseId,
      title: title || `${clientName || 'New Client'} (${type === 'AML_ALERT' ? 'AML Wire Investigation' : 'Onboarding & UBO'})`,
      clientName: clientName || 'Private Wealth Client',
      type: type || 'ONBOARDING',
      status: 'POLICY_EVALUATION',
      riskLevel: type === 'AML_ALERT' ? 'HIGH' : 'LOW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetEntityName: targetEntityName || 'Aegis Client Entity Pte Ltd',
      documents: [docRecord],
      entityGraph: entityResult.graph,
      registryRecord: registryResult.registry,
      amlDetails: amlDetailsResult,
      actionReceipts: [],
      events: [],
      telemetrySpans: [docExtraction.span, entityResult.span, registryResult.span],
      caseIntegrityRoot: '',
      isTampered: false,
    };

    // Step 6: Policy Engine evaluation
    const policyResult = evaluatePolicy(provisionalCase);
    provisionalCase.policyEvaluation = policyResult;
    provisionalCase.status = policyResult.decision === 'ALLOW' ? 'COMPLETED' : 'PENDING_APPROVAL';

    // Step 7: Build Hash Chain
    const rawEvents: RawAegisEvent[] = [
      {
        eventId: `EVT-${caseId}-01-INGEST`,
        caseId,
        timestamp: new Date().toISOString(),
        actor: { type: 'AGENT', id: 'orchestrator-agent', version: '1.2.0' },
        action: 'INITIALIZE_CASE_WORKFLOW',
        evidence: [{ id: docRecord.id, name: docRecord.name, sha256: docRecord.sha256 }],
        payloadSnapshot: { title: provisionalCase.title, client: provisionalCase.clientName },
      },
      {
        eventId: `EVT-${caseId}-02-DOC-EXTRACT`,
        caseId,
        timestamp: new Date().toISOString(),
        actor: { type: 'AGENT', id: 'doc-extractor-agent', version: '2.0.1' },
        action: 'DOCUMENT_EXTRACTION_AND_ENTITY_IDENTIFICATION',
        evidence: [{ id: docRecord.id, name: docRecord.name, sha256: docRecord.sha256 }],
        tool: { name: 'gemini_multimodal_parser', resultHash: sha256(docExtraction.analysis) },
        payloadSnapshot: { summary: docExtraction.analysis.summary, uboCount: docExtraction.analysis.uboCandidates.length },
      },
      {
        eventId: `EVT-${caseId}-03-ENTITY-GRAPH`,
        caseId,
        timestamp: new Date().toISOString(),
        actor: { type: 'AGENT', id: 'entity-graph-agent', version: '1.4.0' },
        action: 'SYNTHESIZE_UBO_OWNERSHIP_GRAPH',
        evidence: [{ id: docRecord.id, name: docRecord.name, sha256: docRecord.sha256 }],
        payloadSnapshot: { nodesCount: entityResult.graph.nodes.length, tiers: entityResult.graph.totalTiers },
      },
      {
        eventId: `EVT-${caseId}-04-REGISTRY-QUERY`,
        caseId,
        timestamp: new Date().toISOString(),
        actor: { type: 'AGENT', id: 'acra-registry-agent', version: '2.2.0' },
        action: 'VERIFY_ACRA_CORPORATE_PROFILE',
        evidence: [{ id: docRecord.id, name: docRecord.name, sha256: docRecord.sha256 }],
        tool: { name: 'acra_business_profile_api', resultHash: registryResult.registry.proofHash },
        payloadSnapshot: { uen: registryResult.registry.uen, matchScore: registryResult.registry.matchScore },
      },
      {
        eventId: `EVT-${caseId}-05-POLICY-GATE`,
        caseId,
        timestamp: new Date().toISOString(),
        actor: { type: 'POLICY_ENGINE', id: 'aegis-deterministic-policy-gate', version: policyResult.policyVersion },
        action: 'DETERMINISTIC_POLICY_GATE_EVALUATION',
        evidence: [{ id: docRecord.id, name: docRecord.name, sha256: docRecord.sha256 }],
        policy: { id: policyResult.policyId, version: policyResult.policyVersion },
        decision: policyResult.decision,
        payloadSnapshot: { decision: policyResult.decision, reasons: policyResult.reasons },
      },
    ];

    if (policyResult.decision === 'ALLOW') {
      rawEvents.push({
        eventId: `EVT-${caseId}-06-GATEWAY-CLEAR`,
        caseId,
        timestamp: new Date().toISOString(),
        actor: { type: 'ACTION_GATEWAY', id: 'aegis-action-gateway', version: '1.0.0' },
        action: 'EXECUTE_AUTONOMOUS_CLEARANCE',
        evidence: [{ id: docRecord.id, name: docRecord.name, sha256: docRecord.sha256 }],
        policy: { id: policyResult.policyId, version: policyResult.policyVersion },
        decision: 'ALLOW',
        payloadSnapshot: { clearance: 'AUTHORIZED_AUTONOMOUSLY' },
      });
    }

    provisionalCase.events = buildHashChain(rawEvents, caseId);
    provisionalCase.caseIntegrityRoot = provisionalCase.events[provisionalCase.events.length - 1].eventHash;

    const receipt = generateActionReceipt({
      caseId,
      actionType: policyResult.decision === 'ALLOW' ? 'EXECUTE_AUTONOMOUS_CLEARANCE' : 'PLACE_POLICY_HOLD',
      agentId: 'aegis-action-gateway',
      agentVersion: '1.0.0',
      policyId: policyResult.policyId,
      policyVersion: policyResult.policyVersion,
      decision: policyResult.decision,
      evidenceItems: [{ id: docRecord.id, name: docRecord.name, sha256: docRecord.sha256 }],
      executionStatus: policyResult.decision === 'ALLOW' ? 'SUCCESS' : 'BLOCKED',
      lastEvent: provisionalCase.events[provisionalCase.events.length - 1],
      caseRootHash: provisionalCase.caseIntegrityRoot,
    });

    provisionalCase.actionReceipts = [receipt];
    saveCase(provisionalCase);

    res.json({ success: true, case: provisionalCase });
  } catch (err: any) {
    console.error('Error creating case:', err);
    res.status(500).json({ error: err.message });
  }
});

// Reset demo to default seed state
apiRouter.post('/demo/reset', (req, res) => {
  initializeDemoCases();
  res.json({ success: true, message: 'Cases reset to default seed state.' });
});

// Get registered agents metadata
apiRouter.get('/agents', (req, res) => {
  res.json({ agents: Object.values(REGISTERED_AGENTS) });
});
