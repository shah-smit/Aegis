import React from 'react';
import { Case } from '../types';
import { ACRARegistryBadge } from './ACRARegistryBadge';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  FileText, 
  Layers, 
  Network, 
  Cpu, 
  Sliders, 
  Key, 
  ArrowRight,
  Clock,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface CaseOverviewProps {
  currentCase: Case;
  onOpenApprovalModal: () => void;
  onOpenTamperModal: () => void;
  onOpenPolicyModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const CaseOverview: React.FC<CaseOverviewProps> = ({
  currentCase,
  onOpenApprovalModal,
  onOpenTamperModal,
  onOpenPolicyModal,
  onNavigateTab,
}) => {
  const isAml = currentCase.type === 'AML_ALERT';
  const isPendingApproval = currentCase.status === 'PENDING_APPROVAL';
  const policy = currentCase.policyEvaluation;
  const isAllowed = policy?.decision === 'ALLOW';
  const isHumanReview = policy?.decision === 'HUMAN_REVIEW';
  const isDenied = policy?.decision === 'DENY';
  const isTampered = currentCase.isTampered;

  return (
    <div className="space-y-6">
      {/* Top Banner / Case Title Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                {currentCase.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                isAml 
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              }`}>
                {isAml ? 'AML Exception Case' : 'Wealth Onboarding Case'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                currentCase.riskLevel === 'LOW' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                  : currentCase.riskLevel === 'MEDIUM' 
                  ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' 
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                RISK: {currentCase.riskLevel}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              {currentCase.title}
            </h1>
            <p className="text-sm text-slate-400">
              Client / Account: <span className="text-slate-200 font-semibold">{currentCase.clientName}</span> • Target: <span className="text-slate-200 font-semibold">{currentCase.targetEntityName}</span>
            </p>
          </div>

          {/* Action Callout if Pending Approval */}
          {isPendingApproval ? (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-300">Policy Gate: Human Checkpoint</h4>
                <p className="text-xs text-slate-400 mb-2">Automated hold enforced. Requires Principal Compliance Officer authorization.</p>
                <button
                  id="btn-overview-action-approval"
                  onClick={onOpenApprovalModal}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 shadow"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Review & Approve / Hold</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-400">Execution Status</div>
                <div className="text-sm font-bold text-emerald-300">
                  {currentCase.status === 'COMPLETED' || currentCase.status === 'APPROVED' ? 'Fully Authorized & Executed' : currentCase.status}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Six-Pillar Governance Flow Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Aegis Verifiable Autonomy Pipeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* 1. Identity & Ingestion */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">1. Ingestion</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-white truncate">{currentCase.documents.length} Docs SHA-256</div>
            <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">Verified Hashes</div>
          </div>

          {/* 2. Entity & UBO */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">2. UBO Graph</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-white truncate">{currentCase.entityGraph.nodes.length} Corporate Nodes</div>
            <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">{currentCase.entityGraph.totalTiers} Tiers Extracted</div>
          </div>

          {/* 3. Registry */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">3. ACRA SG</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-white truncate">UEN {currentCase.registryRecord?.uen || '202418934K'}</div>
            <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">Match {currentCase.registryRecord?.matchScore || 98}%</div>
          </div>

          {/* 4. Policy Gate */}
          <div className={`p-3 rounded-lg border flex flex-col justify-between ${
            isAllowed 
              ? 'bg-emerald-950/30 border-emerald-500/30' 
              : isHumanReview 
              ? 'bg-amber-950/30 border-amber-500/30' 
              : 'bg-rose-950/30 border-rose-500/30'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">4. Policy Gate</span>
              {isAllowed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <div className={`text-xs font-bold ${isAllowed ? 'text-emerald-300' : isHumanReview ? 'text-amber-300' : 'text-rose-300'}`}>
              {policy?.decision || 'ALLOW'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
              v{policy?.policyVersion || '1.0.0'}
            </div>
          </div>

          {/* 5. Action Gate */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">5. Action Gate</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-white truncate">
              {currentCase.actionReceipts.length} Signed Receipts
            </div>
            <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">Ed25519 Cert</div>
          </div>

          {/* 6. Execution Integrity */}
          <div className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer transition-all ${
            isTampered 
              ? 'bg-rose-950/50 border-rose-500 text-rose-200 animate-pulse' 
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
          }`}
          onClick={onOpenTamperModal}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-300">6. Integrity</span>
              {isTampered ? <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <div className="text-xs font-bold">
              {isTampered ? '❌ TAMPERED' : '✅ 100% VERIFIED'}
            </div>
            <div className="text-[10px] font-mono opacity-80 mt-0.5">
              {currentCase.events.length} Event Hashes
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Policy Evaluation & ACRA Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Deterministic Policy Engine Results */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Deterministic Policy Evaluation</h3>
              </div>
              <button
                onClick={onOpenPolicyModal}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono bg-cyan-950/50 px-2 py-1 rounded border border-cyan-800/60"
              >
                Change Policy v{policy?.policyVersion}
              </button>
            </div>

            {/* Policy Decision Box */}
            <div className={`p-4 rounded-xl border mb-4 ${
              isAllowed 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                : isHumanReview 
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' 
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-wider font-semibold opacity-80">Authority Decision</span>
                <span className="text-[11px] font-mono bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700">
                  {policy?.policyId}
                </span>
              </div>
              <div className="text-xl font-bold font-mono tracking-tight mb-2">
                {policy?.decision === 'ALLOW' ? 'ALLOW (Autonomous Clearance)' : policy?.decision === 'HUMAN_REVIEW' ? 'HUMAN_REVIEW (Autonomous Hold Enforced)' : 'DENY (Prohibited)'}
              </div>
              <ul className="text-xs space-y-1 opacity-90 list-disc list-inside">
                {policy?.reasons.map((r, i) => (
                  <li key={i} className="font-mono text-[11px]">{r}</li>
                ))}
              </ul>
            </div>

            {/* Evaluated Rules List */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Deterministic Rule Evaluations
              </span>
              {policy?.rulesEvaluated.map((rule, idx) => (
                <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200">{rule.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      rule.passed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {rule.passed ? 'PASS' : 'FLAGGED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{rule.triggerDetails}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>LLM proposes cognitive findings; Policy engine holds deterministic veto.</span>
            <button
              onClick={() => onNavigateTab('proof')}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <span>View Aegis Proof</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Singapore ACRA Registry & AML / UBO Intelligence */}
        <div className="space-y-6">
          {/* ACRA Registry Verified Badge */}
          <ACRARegistryBadge 
            record={currentCase.registryRecord} 
            targetEntityName={currentCase.targetEntityName} 
          />

          {/* AML Investigation Overview if applicable */}
          {isAml && currentCase.amlDetails && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-sm">AML Transaction Intelligence (MAS 626)</h3>
                </div>
                <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  {currentCase.amlDetails.currency} {currentCase.amlDetails.amount.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Corridor</span>
                  <span className="font-mono text-slate-200 truncate block">{currentCase.amlDetails.corridor}</span>
                </div>
                <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Originator Bank</span>
                  <span className="font-mono text-slate-200 truncate block">{currentCase.amlDetails.originatorBank}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Agent Findings</span>
                {currentCase.amlDetails.findings.map((f, i) => (
                  <div key={i} className="flex items-start space-x-1.5 text-slate-300 text-[11px]">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tab Jumpers */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('trace')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl p-3.5 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>OpenTelemetry Trace</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">View Agent Spans & Execution</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => onNavigateTab('evidence')}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl p-3.5 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Network className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Evidence & UBO Graph</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Corporate Tiers & Hash Digests</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
