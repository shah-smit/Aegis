import React, { useState, useEffect } from 'react';
import { 
  Case, 
  PolicyConfig, 
  AppMode, 
  WealthNavTab, 
  ClientProfile 
} from './types';
import { ADVISOR_BOOK_MOCK, CLIENT_PROFILES_MOCK } from './data/wealthData';
import { WealthNavbar } from './components/wealth/WealthNavbar';
import { AdvisorWorkspace } from './components/wealth/AdvisorWorkspace';
import { Client360View } from './components/wealth/Client360View';
import { WorkflowManagerView } from './components/wealth/WorkflowManagerView';
import { InvestmentsPlanningView } from './components/wealth/InvestmentsPlanningView';
import { DocumentsView } from './components/wealth/DocumentsView';
import { AegisIntelligenceView } from './components/wealth/AegisIntelligenceView';

import { Navbar } from './components/Navbar';
import { CaseOverview } from './components/CaseOverview';
import { AgentTraceView } from './components/AgentTraceView';
import { EvidenceGraphView } from './components/EvidenceGraphView';
import { ProofReceiptView } from './components/ProofReceiptView';
import { TamperDemoModal } from './components/TamperDemoModal';
import { PolicyVersionModal } from './components/PolicyVersionModal';
import { HumanApprovalModal } from './components/HumanApprovalModal';
import { NewCaseModal } from './components/NewCaseModal';
import { PresentationGuide } from './components/PresentationGuide';
import { Shield, Loader2, AlertCircle, RefreshCw, Sparkles, Cpu, ArrowLeft } from 'lucide-react';

export function App() {
  const [appMode, setAppMode] = useState<AppMode>('WEALTH');
  const [activeWealthTab, setActiveWealthTab] = useState<WealthNavTab>('overview');
  const [clients, setClients] = useState<ClientProfile[]>(CLIENT_PROFILES_MOCK);
  const [selectedClientId, setSelectedClientId] = useState<string>('client-emerald-crest');

  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-2026-8492');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [policyConfig, setPolicyConfig] = useState<PolicyConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isTamperModalOpen, setIsTamperModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isPitchGuideOpen, setIsPitchGuideOpen] = useState(false);

  // Load cases and policy config
  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      const data = await res.json();
      setCases(data.cases || []);

      if (data.cases && data.cases.length > 0 && !selectedCaseId) {
        setSelectedCaseId(data.cases[0].id);
      }

      // Fetch policy config
      const pRes = await fetch('/api/policy/config');
      if (pRes.ok) {
        const pData = await pRes.json();
        setPolicyConfig(pData.config);
      }
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error connecting to Aegis Backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Helper to jump directly from Wealth Experience into Control Plane
  const handleInspectControlPlaneCase = (caseId: string, preferredTab: string = 'trace') => {
    setSelectedCaseId(caseId);
    setActiveTab(preferredTab);
    setAppMode('CONTROL_PLANE');
  };

  // Tamper action
  const handleTamper = async (eventIndex: number, maliciousModification: string) => {
    if (!currentCase) return;
    try {
      const res = await fetch(`/api/cases/${currentCase.id}/tamper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventIndex, maliciousModification }),
      });
      if (!res.ok) throw new Error('Failed to simulate tamper');
      const data = await res.json();
      setCases((prev) => prev.map((c) => (c.id === data.case.id ? data.case : c)));
      setActiveTab('proof');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Restore action
  const handleRestore = async () => {
    if (!currentCase) return;
    try {
      const res = await fetch(`/api/cases/${currentCase.id}/restore`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to restore case');
      const data = await res.json();
      setCases((prev) => prev.map((c) => (c.id === data.case.id ? data.case : c)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Verify integrity
  const handleVerifyIntegrity = async () => {
    if (!currentCase) return;
    try {
      const res = await fetch(`/api/cases/${currentCase.id}/verify`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!data.integrity.isValid) {
        alert(`❌ Integrity Failure: ${data.integrity.message}`);
      }
    } catch (err: any) {
      alert('Verification request failed: ' + err.message);
    }
  };

  // Human decision submission
  const handleHumanDecision = async (
    decision: 'APPROVED' | 'REJECTED' | 'REQUEST_INFO',
    reviewerName: string,
    notes: string,
    conditions?: string[]
  ) => {
    if (!currentCase) return;
    try {
      const res = await fetch(`/api/cases/${currentCase.id}/human-decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, reviewerName, notes, conditions }),
      });
      if (!res.ok) throw new Error('Failed to submit approval');
      const data = await res.json();
      setCases((prev) => prev.map((c) => (c.id === data.case.id ? data.case : c)));
      setActiveTab('proof');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Policy threshold update
  const handleUpdatePolicy = async (newThreshold: number, newVersion: string) => {
    if (!currentCase) return;
    try {
      // 1. Update config
      const res = await fetch('/api/policy/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amlTransactionThreshold: newThreshold,
          policyVersion: newVersion,
        }),
      });
      const data = await res.json();
      setPolicyConfig(data.config);

      // 2. Re-evaluate case
      const reRes = await fetch(`/api/cases/${currentCase.id}/re-evaluate-policy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configOverride: data.config }),
      });
      const reData = await reRes.json();
      setCases((prev) => prev.map((c) => (c.id === reData.case.id ? reData.case : c)));
      setActiveTab('proof');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Create new case
  const handleCreateCase = async (payload: any) => {
    try {
      const res = await fetch('/api/cases/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create case');
      const data = await res.json();
      setCases((prev) => [data.case, ...prev]);
      setSelectedCaseId(data.case.id);
      setActiveTab('overview');
    } catch (err: any) {
      alert('Error creating case: ' + err.message);
    }
  };

  // Reset demo
  const handleResetDemo = async () => {
    try {
      await fetch('/api/demo/reset', { method: 'POST' });
      await fetchCases();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading && cases.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center text-stone-900 space-y-4 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center font-serif">
          <h2 className="text-lg font-bold">Booting Aegis Wealth Operating System...</h2>
          <p className="text-xs text-stone-500 font-sans">Synthesizing Advisor Workspace & Policy Control Plane</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      appMode === 'WEALTH' ? 'bg-[#FAF9F6] text-stone-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* 1. Top Navbar depending on Mode */}
      {appMode === 'WEALTH' ? (
        <WealthNavbar
          appMode={appMode}
          onToggleAppMode={(mode) => setAppMode(mode)}
          activeWealthTab={activeWealthTab}
          onChangeWealthTab={(tab) => setActiveWealthTab(tab)}
          advisorBook={ADVISOR_BOOK_MOCK}
          cases={cases}
          selectedCaseId={selectedCaseId}
          onSelectCase={(id) => setSelectedCaseId(id)}
          onOpenTamperModal={() => setIsTamperModalOpen(true)}
          onOpenPolicyModal={() => setIsPolicyModalOpen(true)}
          onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
          onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
          onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
          onResetDemo={handleResetDemo}
          policyConfig={policyConfig}
        />
      ) : (
        <div>
          {/* Backstage Quick Switcher Banner */}
          <div className="bg-stone-900 text-amber-300 px-4 py-2 text-xs border-b border-stone-800 flex items-center justify-between font-mono">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">AEGIS BACKSTAGE CONTROL PLANE</span>
              <span className="text-stone-400">• Deterministic Policy-as-Code & OpenTelemetry Traces</span>
            </div>
            <button
              onClick={() => setAppMode('WEALTH')}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Wealth Experience</span>
            </button>
          </div>

          <Navbar
            cases={cases}
            selectedCaseId={selectedCaseId}
            onSelectCase={(id) => setSelectedCaseId(id)}
            onOpenTamperModal={() => setIsTamperModalOpen(true)}
            onOpenPolicyModal={() => setIsPolicyModalOpen(true)}
            onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
            onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
            onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
            onResetDemo={handleResetDemo}
            policyConfig={policyConfig}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center justify-between font-mono">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchCases}
              className="px-3 py-1 bg-rose-800 hover:bg-rose-700 rounded font-semibold text-white flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* FRONTSTAGE: WEALTH EXPERIENCE */}
        {appMode === 'WEALTH' && (
          <>
            {activeWealthTab === 'overview' && (
              <AdvisorWorkspace
                advisorBook={ADVISOR_BOOK_MOCK}
                clients={clients}
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setActiveWealthTab('clients');
                }}
                onNavigateToTab={(tab) => setActiveWealthTab(tab)}
                onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
                onInspectControlPlaneCase={(caseId) => handleInspectControlPlaneCase(caseId)}
              />
            )}

            {activeWealthTab === 'clients' && (
              <Client360View
                clients={clients}
                selectedClientId={selectedClientId}
                onSelectClient={(id) => setSelectedClientId(id)}
                onInspectControlPlaneCase={(caseId) => handleInspectControlPlaneCase(caseId)}
                onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
              />
            )}

            {activeWealthTab === 'workflows' && (
              <WorkflowManagerView
                clients={clients}
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setActiveWealthTab('clients');
                }}
                onInspectControlPlaneCase={(caseId) => handleInspectControlPlaneCase(caseId)}
                onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
              />
            )}

            {(activeWealthTab === 'investments' || activeWealthTab === 'planning') && (
              <InvestmentsPlanningView
                clients={clients}
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setActiveWealthTab('clients');
                }}
                onInspectControlPlaneCase={(caseId) => handleInspectControlPlaneCase(caseId)}
              />
            )}

            {activeWealthTab === 'documents' && (
              <DocumentsView
                clients={clients}
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setActiveWealthTab('clients');
                }}
                onInspectControlPlaneCase={(caseId) => handleInspectControlPlaneCase(caseId)}
              />
            )}

            {activeWealthTab === 'intelligence' && (
              <AegisIntelligenceView
                clients={clients}
                onSelectClient={(id) => {
                  setSelectedClientId(id);
                  setActiveWealthTab('clients');
                }}
                onInspectControlPlaneCase={(caseId) => handleInspectControlPlaneCase(caseId)}
                onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
              />
            )}
          </>
        )}

        {/* BACKSTAGE: AEGIS CONTROL PLANE */}
        {appMode === 'CONTROL_PLANE' && currentCase && (
          <>
            {activeTab === 'overview' && (
              <CaseOverview
                currentCase={currentCase}
                onOpenApprovalModal={() => setIsApprovalModalOpen(true)}
                onOpenTamperModal={() => setIsTamperModalOpen(true)}
                onOpenPolicyModal={() => setIsPolicyModalOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'trace' && <AgentTraceView currentCase={currentCase} />}

            {activeTab === 'evidence' && <EvidenceGraphView currentCase={currentCase} />}

            {activeTab === 'proof' && (
              <ProofReceiptView
                currentCase={currentCase}
                onVerifyIntegrity={handleVerifyIntegrity}
                onOpenTamperModal={() => setIsTamperModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`py-4 px-4 sm:px-6 lg:px-8 text-xs font-mono border-t transition-colors ${
        appMode === 'WEALTH' 
          ? 'border-stone-200/80 bg-[#FAF9F6] text-stone-500' 
          : 'border-slate-900 bg-slate-950 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Aegis Wealth OS • PBIG Private Banking Industry Group / MAS 626 / IMDA Agentic AI Controls
          </div>
          <div className="flex items-center space-x-3">
            <span>Deterministic Policy Gates</span>
            <span>•</span>
            <span>Bounded Autonomy</span>
            <span>•</span>
            <span>OpenTelemetry Traces</span>
            <span>•</span>
            <span>SHA-256 Hash Chained Proofs</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      {currentCase && (
        <>
          <TamperDemoModal
            isOpen={isTamperModalOpen}
            onClose={() => setIsTamperModalOpen(false)}
            currentCase={currentCase}
            onTamper={handleTamper}
            onRestore={handleRestore}
          />

          <PolicyVersionModal
            isOpen={isPolicyModalOpen}
            onClose={() => setIsPolicyModalOpen(false)}
            currentCase={currentCase}
            policyConfig={policyConfig}
            onUpdatePolicyConfig={handleUpdatePolicy}
          />

          <HumanApprovalModal
            isOpen={isApprovalModalOpen}
            onClose={() => setIsApprovalModalOpen(false)}
            currentCase={currentCase}
            onSubmitDecision={handleHumanDecision}
          />

          <NewCaseModal
            isOpen={isNewCaseModalOpen}
            onClose={() => setIsNewCaseModalOpen(false)}
            onCreateCase={handleCreateCase}
          />

          <PresentationGuide
            isOpen={isPitchGuideOpen}
            onClose={() => setIsPitchGuideOpen(false)}
            onSelectCase={(id) => setSelectedCaseId(id)}
            onOpenTamperModal={() => {
              setIsPitchGuideOpen(false);
              setIsTamperModalOpen(true);
            }}
            onOpenPolicyModal={() => {
              setIsPitchGuideOpen(false);
              setIsPolicyModalOpen(true);
            }}
          />
        </>
      )}
    </div>
  );
}
export default App;

