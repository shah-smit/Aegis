import React, { useState, useEffect } from 'react';
import { 
  Plus, X, Upload, Sparkles, FileText, Cpu, AlertTriangle, 
  Bot, Network, Building2, ShieldCheck, Key, CheckCircle2, 
  Loader2, ArrowRight, Activity, Terminal
} from 'lucide-react';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCase: (data: {
    title: string;
    clientName: string;
    type: 'ONBOARDING' | 'AML_ALERT';
    targetEntityName: string;
    documentText: string;
    documentName: string;
    amlAmount?: number;
    amlCorridor?: string;
  }) => Promise<void>;
}

interface AgentPipelineStep {
  agentId: string;
  name: string;
  version: string;
  role: string;
  action: string;
  icon: any;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED';
  logMessage: string;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCreateCase,
}) => {
  const [caseType, setCaseType] = useState<'ONBOARDING' | 'AML_ALERT'>('ONBOARDING');
  const [clientName, setClientName] = useState('Helios Horizon Family Trust / Julian Vance');
  const [targetEntityName, setTargetEntityName] = useState('Helios Global Holdings Pte Ltd');
  const [docName, setDocName] = useState('Helios_Horizon_Trust_Deed_Executed.pdf');
  const [docText, setDocText] = useState(
    `DEED OF SETTLEMENT OF THE HELIOS HORIZON TRUST\n` +
    `Dated: 12 August 2026\n` +
    `Settlor: Julian Vance (Singapore Permanent Resident, NRIC: S****921B)\n` +
    `Trustee: Aegis Trustee Services (Singapore) Ltd\n` +
    `Beneficiaries: Julian Vance (100% sole lifetime beneficiary and protector)\n` +
    `Assets Settled: 100% of the voting equity and ordinary shares of Vance Maritime Ventures Ltd (BVI) which holds 100% of Helios Global Holdings Pte Ltd (Singapore UEN: 202588192K).\n` +
    `Source of Wealth: Repatriation of maritime shipping enterprise IPO proceeds.`
  );
  const [amlAmount, setAmlAmount] = useState<number>(6500000);
  const [amlCorridor, setAmlCorridor] = useState('CHE -> SGP');
  const [loading, setLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const getStepStatus = (stepIdx: number): 'PENDING' | 'RUNNING' | 'COMPLETED' => {
    if (activeStepIndex > stepIdx) return 'COMPLETED';
    if (activeStepIndex === stepIdx && loading) return 'RUNNING';
    return 'PENDING';
  };

  const amlStepOffset = caseType === 'AML_ALERT' ? 1 : 0;

  const pipelineSteps: AgentPipelineStep[] = [
    {
      agentId: 'orchestrator-agent',
      name: 'Aegis Core Orchestrator',
      version: '1.2.0',
      role: 'Workflow Coordinator & Ingestion',
      action: 'INGEST_DOCUMENT_AND_EMIT_TELEMETRY',
      icon: Cpu,
      status: getStepStatus(0),
      logMessage: 'Generating SHA-256 payload digest & initializing OpenTelemetry parent trace...',
    },
    {
      agentId: 'doc-extractor-agent',
      name: 'Gemini Document Extractor Agent',
      version: '2.0.1',
      role: 'Multimodal Legal Parser',
      action: 'PARSE_CLAUSES_AND_EXTRACT_ENTITIES',
      icon: Bot,
      status: getStepStatus(1),
      logMessage: 'Executing Gemini model extraction on Trust Settlement clauses & parties...',
    },
    {
      agentId: 'entity-graph-agent',
      name: 'UBO & Ownership Graph Agent',
      version: '1.4.0',
      role: 'Multi-Tier Graph Synthesizer',
      action: 'SYNTHESIZE_UBO_OWNERSHIP_GRAPH',
      icon: Network,
      status: getStepStatus(2),
      logMessage: 'Calculating 100% Ultimate Beneficial Ownership topology & multi-tier linkages...',
    },
    {
      agentId: 'acra-registry-agent',
      name: 'Singapore ACRA Registry Agent',
      version: '2.2.0',
      role: 'Corporate Registry Verifier',
      action: 'QUERY_ACRA_BUSINESS_PROFILE',
      icon: Building2,
      status: getStepStatus(3),
      logMessage: 'Querying ACRA Singapore registry API & validating corporate status...',
    },
    ...(caseType === 'AML_ALERT'
      ? [
          {
            agentId: 'aml-investigator-agent',
            name: 'MAS AML/CFT Investigation Agent',
            version: '3.1.0',
            role: 'Corridor & PEP Corroborator',
            action: 'ANALYZE_TRANSACTION_CORRIDOR',
            icon: AlertTriangle,
            status: getStepStatus(4),
            logMessage: `Evaluating ${amlCorridor} high-risk corridor against MAS 626 guidelines...`,
          },
        ]
      : []),
    {
      agentId: 'aegis-deterministic-policy-gate',
      name: 'Deterministic Policy Gate',
      version: '1.0.0',
      role: 'Policy-as-Code Engine',
      action: 'DETERMINISTIC_POLICY_EVALUATION',
      icon: ShieldCheck,
      status: getStepStatus(4 + amlStepOffset),
      logMessage: 'Evaluating deterministic threshold rules (zero LLM hallucinations)...',
    },
    {
      agentId: 'aegis-action-gateway',
      name: 'Aegis Action Gateway & Cryptographic Verifier',
      version: '1.0.0',
      role: 'Verifiable Autonomy Layer',
      action: 'MINT_CRYPTOGRAPHIC_ACTION_RECEIPT',
      icon: Key,
      status: getStepStatus(5 + amlStepOffset),
      logMessage: 'Constructing SHA-256 sequential hash chain & signing ed25519 action receipt...',
    },
  ];

  useEffect(() => {
    let timer: any;
    if (loading) {
      const maxSteps = pipelineSteps.length;
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev < maxSteps - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 550);
    } else {
      setActiveStepIndex(0);
    }
    return () => clearInterval(timer);
  }, [loading, pipelineSteps.length]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setActiveStepIndex(0);
    try {
      await onCreateCase({
        title: `${clientName} (${caseType === 'AML_ALERT' ? 'AML Investigation' : 'Onboarding & UBO'})`,
        clientName,
        type: caseType,
        targetEntityName,
        documentName: docName,
        documentText: docText,
        amlAmount: caseType === 'AML_ALERT' ? amlAmount : undefined,
        amlCorridor: caseType === 'AML_ALERT' ? amlCorridor : undefined,
      });
      // Short pause to show final minted state
      setTimeout(() => {
        onClose();
      }, 400);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <span>Multi-Agent Orchestration & Document Intake</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {pipelineSteps.length} Agents Invoked
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Autonomous legal ingestion, registry verification, deterministic policy gate & cryptographic receipt minting
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="text-slate-400 hover:text-white p-1 rounded-lg disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Execution Pipeline State when Loading */}
        {loading ? (
          <div className="space-y-4 py-2 animate-in fade-in">
            <div className="bg-slate-950 border border-emerald-900/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">
                    Live Agent Invocation Pipeline
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center space-x-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    Executing Step {activeStepIndex + 1} of {pipelineSteps.length}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${((activeStepIndex + 1) / pipelineSteps.length) * 100}%` }}
                />
              </div>

              {/* Active Step Cards */}
              <div className="space-y-2 pt-1">
                {pipelineSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCurrent = idx === activeStepIndex;
                  const isPast = idx < activeStepIndex;
                  return (
                    <div
                      key={step.agentId}
                      className={`p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-emerald-950/70 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                          : isPast
                          ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                          : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isCurrent
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                              : isPast
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-900 text-slate-600 border border-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold text-xs ${isCurrent ? 'text-emerald-300' : isPast ? 'text-slate-200' : 'text-slate-500'}`}>
                              {step.name}
                            </span>
                            <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                              v{step.version}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {isCurrent ? step.logMessage : step.action}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {isPast && (
                          <div className="flex items-center space-x-1 text-emerald-400 text-[11px] font-mono font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>VERIFIED</span>
                          </div>
                        )}
                        {isCurrent && (
                          <div className="flex items-center space-x-1.5 text-emerald-300 text-[11px] font-mono font-bold animate-pulse">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>RUNNING</span>
                          </div>
                        )}
                        {!isPast && !isCurrent && (
                          <span className="text-[10px] font-mono text-slate-600">QUEUED</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Case Type Toggle */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Select Case Category:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCaseType('ONBOARDING');
                    setDocName('Helios_Horizon_Trust_Deed_Executed.pdf');
                  }}
                  className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                    caseType === 'ONBOARDING'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <span>Wealth Onboarding & UBO</span>
                  <span className="text-[10px] text-slate-400 font-normal font-mono">Trust Deeds & ACRA Sync</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCaseType('AML_ALERT');
                    setDocName('SWIFT_MT103_Wire_Alert.txt');
                  }}
                  className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                    caseType === 'AML_ALERT'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <span>AML Wire Alert Exception</span>
                  <span className="text-[10px] text-slate-400 font-normal font-mono">MAS 626 Corridor Screening</span>
                </button>
              </div>
            </div>

            {/* Client & Target */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Client / Settlor Name:</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Singapore Operating Entity:</label>
                <input
                  type="text"
                  value={targetEntityName}
                  onChange={(e) => setTargetEntityName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            {/* AML extra fields if AML */}
            {caseType === 'AML_ALERT' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Transaction Value (USD):</label>
                  <input
                    type="number"
                    value={amlAmount}
                    onChange={(e) => setAmlAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Payment Corridor:</label>
                  <input
                    type="text"
                    value={amlCorridor}
                    onChange={(e) => setAmlCorridor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>
            )}

            {/* Document Content Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Document Legal Text / Clauses:</label>
                <span className="text-[10px] text-slate-400 font-mono">{docName}</span>
              </div>
              <textarea
                rows={4}
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed"
                required
              />
            </div>

            {/* Invoked Multi-Agent Architecture Preview */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Invoked Multi-Agent Pipeline ({pipelineSteps.length} Agents)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Autonomous Execution Plan</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {pipelineSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.agentId} className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex items-start space-x-2">
                      <div className="w-5 h-5 rounded bg-slate-800 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-200 truncate">{step.name.split('Agent')[0]}</p>
                        <p className="text-[9px] font-mono text-slate-400 truncate">v{step.version} • {step.role.split(' ')[0]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-colors flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch {pipelineSteps.length}-Agent Orchestration</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

