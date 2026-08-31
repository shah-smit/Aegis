import { Case, PolicyEvaluation, PolicyRuleResult, PolicyDecision, PolicyConfig } from '../src/types';
import { sha256 } from './cryptoUtils';

export let currentPolicyConfig: PolicyConfig = {
  amlTransactionThreshold: 5000000, // $5M
  strictUboThreshold: 25, // 25%
  requireAcraDirectMatch: true,
  policyVersion: '1.0.0',
};

export function setPolicyConfig(newConfig: Partial<PolicyConfig>) {
  currentPolicyConfig = { ...currentPolicyConfig, ...newConfig };
  return currentPolicyConfig;
}

export function evaluatePolicy(caseData: Case, configOverride?: PolicyConfig): PolicyEvaluation {
  const cfg = configOverride || currentPolicyConfig;
  const rulesEvaluated: PolicyRuleResult[] = [];
  const reasons: string[] = [];
  let finalDecision: PolicyDecision = 'ALLOW';
  let approvalRequired = false;

  const policyId = caseData.type === 'AML_ALERT' ? 'AML-TRANSACTION-GATE-001' : 'PB-ONBOARDING-STD-002';
  const policyName = caseData.type === 'AML_ALERT' 
    ? 'MAS AML/CFT Complex Transaction Gate' 
    : 'PBIG Private Banking Onboarding & UBO Standard';

  if (caseData.type === 'AML_ALERT' && caseData.amlDetails) {
    const aml = caseData.amlDetails;

    // Rule 1: High Transaction Value Threshold
    const isOverThreshold = aml.amount > cfg.amlTransactionThreshold;
    rulesEvaluated.push({
      ruleId: 'RULE-AML-01-THRESHOLD',
      name: 'High-Value Wire Transfer Threshold Check',
      conditionDescription: `Transaction Amount (${aml.currency} ${aml.amount.toLocaleString()}) > Permitted Autonomous Threshold (${aml.currency} ${cfg.amlTransactionThreshold.toLocaleString()})`,
      passed: !isOverThreshold,
      triggerDetails: isOverThreshold 
        ? `Exceeds autonomous limit by ${aml.currency} ${(aml.amount - cfg.amlTransactionThreshold).toLocaleString()}. Mandatory human checkpoint.`
        : `Within current policy threshold limit ($${cfg.amlTransactionThreshold.toLocaleString()}).`,
      actionIfViolated: 'HUMAN_REVIEW',
    });

    if (isOverThreshold) {
      reasons.push(`TRANSACTION_ABOVE_THRESHOLD: Value of ${aml.currency} ${aml.amount.toLocaleString()} exceeds Policy v${cfg.policyVersion} autonomous limit of ${aml.currency} ${cfg.amlTransactionThreshold.toLocaleString()}`);
      finalDecision = 'HUMAN_REVIEW';
      approvalRequired = true;
    }

    // Rule 2: High Risk Jurisdiction Corridor
    const isHighRiskCorridor = aml.corridorRisk === 'HIGH' || aml.corridorRisk === 'CRITICAL';
    rulesEvaluated.push({
      ruleId: 'RULE-AML-02-CORRIDOR',
      name: 'FATF High-Risk Jurisdiction Corridor Filter',
      conditionDescription: `Corridor ${aml.corridor} Risk Level <= MEDIUM`,
      passed: !isHighRiskCorridor,
      triggerDetails: isHighRiskCorridor 
        ? `Corridor ${aml.corridor} flagged as ${aml.corridorRisk} AML risk corridor.`
        : `Corridor risk evaluated as compliant (${aml.corridorRisk}).`,
      actionIfViolated: 'HUMAN_REVIEW',
    });

    if (isHighRiskCorridor) {
      reasons.push(`HIGH_RISK_JURISDICTION: Corridor ${aml.corridor} triggers heightened regulatory review`);
      finalDecision = 'HUMAN_REVIEW';
      approvalRequired = true;
    }

    // Rule 3: Sanctions & PEP Hit
    const hasSanctionsOrPep = aml.sanctionsCheckStatus !== 'CLEAR' || aml.pepMatch;
    rulesEvaluated.push({
      ruleId: 'RULE-AML-03-SANCTIONS-PEP',
      name: 'Sanctions List & Politically Exposed Persons (PEP) Check',
      conditionDescription: 'Sanctions Check == CLEAR and PEP Match == FALSE',
      passed: !hasSanctionsOrPep,
      triggerDetails: aml.sanctionsCheckStatus !== 'CLEAR' 
        ? `Sanctions alert: ${aml.sanctionsCheckStatus}` 
        : aml.pepMatch ? `PEP Associated Match: ${aml.pepDetails || 'True'}` : 'Clear',
      actionIfViolated: aml.sanctionsCheckStatus === 'BLOCKED' ? 'DENY' : 'HUMAN_REVIEW',
    });

    if (aml.sanctionsCheckStatus === 'BLOCKED') {
      reasons.push('SANCTIONS_BLOCKED: Matched global designated entity sanctions register');
      finalDecision = 'DENY';
      approvalRequired = true;
    } else if (aml.pepMatch) {
      reasons.push('PEP_MATCH_DETECTED: Source or Beneficiary linked to PEP profile');
      if ((finalDecision as string) !== 'DENY') finalDecision = 'HUMAN_REVIEW';
      approvalRequired = true;
    }

    // Rule 4: Source of Funds Verification
    const isSofIncomplete = !aml.sourceOfFundsVerified;
    rulesEvaluated.push({
      ruleId: 'RULE-AML-04-SOF-VERIFIED',
      name: 'Source of Funds & Wealth Corroboration',
      conditionDescription: 'Source of Funds declared AND verified against evidence documents',
      passed: !isSofIncomplete,
      triggerDetails: isSofIncomplete 
        ? `Source of funds declared ("${aml.sourceOfFundsDeclared}") lacks full cryptographic documentary corroboration.`
        : 'Source of funds verified against bank confirmations & audited financials.',
      actionIfViolated: 'HUMAN_REVIEW',
    });

    if (isSofIncomplete) {
      reasons.push('INCOMPLETE_SOURCE_OF_FUNDS: Supporting wealth documentation incomplete or uncorroborated');
      if (finalDecision !== 'DENY') finalDecision = 'HUMAN_REVIEW';
      approvalRequired = true;
    }

    // Rule 5: UBO Mismatch
    if (aml.uboMismatch) {
      rulesEvaluated.push({
        ruleId: 'RULE-AML-05-UBO-MATCH',
        name: 'Beneficiary Entity UBO Matching',
        conditionDescription: 'Transacting entity UBO must match registered KYC UBO',
        passed: false,
        triggerDetails: 'Discrepancy detected between transacting entity signatory and KYC registered UBO.',
        actionIfViolated: 'HUMAN_REVIEW',
      });
      reasons.push('UBO_MISMATCH: Beneficiary entity ownership structure differs from established KYC baseline');
      if (finalDecision !== 'DENY') finalDecision = 'HUMAN_REVIEW';
      approvalRequired = true;
    }
  } else {
    // ONBOARDING WORKFLOW POLICY
    const graph = caseData.entityGraph;
    const registry = caseData.registryRecord;

    // Rule 1: UBO Identification completeness
    const hasUbo = graph.uboIdentified && graph.uboIdentified.length > 0;
    rulesEvaluated.push({
      ruleId: 'RULE-ONB-01-UBO-IDENTIFIED',
      name: 'Ultimate Beneficial Ownership (UBO >= 25%) Identification',
      conditionDescription: `At least one natural person identified with >= ${cfg.strictUboThreshold}% direct/indirect equity or effective control`,
      passed: hasUbo,
      triggerDetails: hasUbo 
        ? `Identified UBO(s): ${graph.uboIdentified.join(', ')}`
        : 'No natural person identified with controlling beneficial interest.',
      actionIfViolated: 'HUMAN_REVIEW',
    });

    if (!hasUbo) {
      reasons.push('UBO_NOT_IDENTIFIED: Complex nested structure without clear natural person UBO');
      finalDecision = 'HUMAN_REVIEW';
      approvalRequired = true;
    }

    // Rule 2: ACRA Registry Verification
    const hasRegistryMatch = registry && registry.status === 'Live' && registry.matchScore >= 80;
    rulesEvaluated.push({
      ruleId: 'RULE-ONB-02-REGISTRY-VERIFIED',
      name: 'Singapore ACRA Registry Corporate Verification',
      conditionDescription: 'Entity verified on Singapore ACRA Business Profile API with Match Score >= 80%',
      passed: !!hasRegistryMatch,
      triggerDetails: registry 
        ? `UEN ${registry.uen} Status: ${registry.status}, Match Score: ${registry.matchScore}%`
        : 'No ACRA registry record verified.',
      actionIfViolated: 'HUMAN_REVIEW',
    });

    if (!hasRegistryMatch) {
      reasons.push('REGISTRY_VERIFICATION_INCOMPLETE: ACRA entity record mismatch or unverified status');
      finalDecision = 'HUMAN_REVIEW';
      approvalRequired = true;
    }

    // Rule 3: Anomalies in Corporate Structure
    const hasAnomalies = graph.anomaliesDetected && graph.anomaliesDetected.length > 0;
    rulesEvaluated.push({
      ruleId: 'RULE-ONB-03-STRUCTURE-ANOMALY',
      name: 'Corporate Layering & Multi-Tier Anomaly Filter',
      conditionDescription: 'No flagged corporate layering anomalies or circular ownership loops',
      passed: !hasAnomalies,
      triggerDetails: hasAnomalies 
        ? `Anomalies detected: ${graph.anomaliesDetected.join('; ')}`
        : 'No circular or opaque holding structures detected.',
      actionIfViolated: 'HUMAN_REVIEW',
    });

    if (hasAnomalies) {
      reasons.push(`STRUCTURAL_ANOMALY: ${graph.anomaliesDetected[0]}`);
      finalDecision = 'HUMAN_REVIEW';
      approvalRequired = true;
    }

    // Rule 4: Mandatory Document Set Check
    const docTypes = new Set(caseData.documents.map(d => d.type));
    const hasRequiredDocs = (docTypes.has('TRUST_DEED') || docTypes.has('ACRA_BIZFILE')) && docTypes.size >= 2;
    rulesEvaluated.push({
      ruleId: 'RULE-ONB-04-EVIDENCE-COMPLETE',
      name: 'Cryptographic Document Completeness Check',
      conditionDescription: 'Mandatory trust deed / corporate constitution + KYC ID documents verified',
      passed: hasRequiredDocs,
      triggerDetails: hasRequiredDocs 
        ? `Complete set of ${caseData.documents.length} verified documents present.`
        : 'Incomplete document package submitted.',
      actionIfViolated: 'HUMAN_REVIEW',
    });

    if (!hasRequiredDocs) {
      reasons.push('INCOMPLETE_ONBOARDING_PACKAGE: Missing required legal entity formation documents');
      finalDecision = 'HUMAN_REVIEW';
      approvalRequired = true;
    }
  }

  if (reasons.length === 0) {
    reasons.push('ALL_POLICY_RULES_SATISFIED: All deterministic criteria met within autonomous clearance authority.');
  }

  const policyHash = sha256({
    policyId,
    policyVersion: cfg.policyVersion,
    threshold: cfg.amlTransactionThreshold,
    decision: finalDecision,
    reasons,
    rules: rulesEvaluated.map(r => ({ id: r.ruleId, passed: r.passed })),
  });

  return {
    policyId,
    policyName,
    policyVersion: cfg.policyVersion,
    thresholdAmount: cfg.amlTransactionThreshold,
    decision: finalDecision,
    reasons,
    rulesEvaluated,
    approvalRequired,
    evaluatedAt: new Date().toISOString(),
    policyHash,
  };
}
