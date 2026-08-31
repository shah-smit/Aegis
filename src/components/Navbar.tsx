import React from 'react';
import { Case, PolicyConfig } from '../types';
import { Shield, ShieldAlert, ShieldCheck, Cpu, Sliders, UserCheck, Play, RotateCcw, Plus, Presentation, CheckCircle2, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  cases: Case[];
  selectedCaseId: string;
  onSelectCase: (id: string) => void;
  onOpenTamperModal: () => void;
  onOpenPolicyModal: () => void;
  onOpenApprovalModal: () => void;
  onOpenNewCaseModal: () => void;
  onOpenPitchGuide: () => void;
  onResetDemo: () => void;
  policyConfig: PolicyConfig | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
  onOpenTamperModal,
  onOpenPolicyModal,
  onOpenApprovalModal,
  onOpenNewCaseModal,
  onOpenPitchGuide,
  onResetDemo,
  policyConfig,
  activeTab,
  setActiveTab,
}) => {
  const currentCase = cases.find(c => c.id === selectedCaseId);
  const isTampered = currentCase?.isTampered;
  const isPendingApproval = currentCase?.status === 'PENDING_APPROVAL';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl backdrop-blur-md bg-opacity-95">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30">
              <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-mono">AEGIS</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  RegTech Verifiable Autonomy
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Agents act. Policies constrain. Aegis proves.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons & Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Integrity Status Pill */}
            <div 
              onClick={onOpenTamperModal}
              className={`cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center space-x-1.5 transition-all shadow-sm ${
                isTampered 
                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 animate-pulse' 
                  : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
              }`}
              title="Click to test cryptographic tamper detection"
            >
              {isTampered ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="font-bold">❌ INTEGRITY COMPROMISED</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% VERIFIED</span>
                </>
              )}
            </div>

            {/* Tamper Attack Demo button */}
            <button
              id="btn-tamper-demo"
              onClick={onOpenTamperModal}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              title="Tamper verification attack experiment"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Tamper Demo</span>
            </button>

            {/* Policy Switcher */}
            <button
              id="btn-policy-modal"
              onClick={onOpenPolicyModal}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Policy v{policyConfig?.policyVersion || '1.0'}</span>
            </button>

            {/* Human in the loop action */}
            {isPendingApproval && (
              <button
                id="btn-human-approval"
                onClick={onOpenApprovalModal}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 animate-bounce"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Action Needed</span>
              </button>
            )}

            {/* Pitch Guide */}
            <button
              id="btn-pitch-guide"
              onClick={onOpenPitchGuide}
              className="px-2.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded-lg border border-indigo-500/40 text-xs font-medium flex items-center space-x-1.5 transition-colors"
              title="SingHacks & All Hacks Pitch Script"
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden lg:inline">Pitch Narrative</span>
            </button>

            {/* New Case Button */}
            <button
              id="btn-new-case"
              onClick={onOpenNewCaseModal}
              className="px-2.5 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 rounded-lg border border-emerald-500/40 text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">New Case</span>
            </button>

            {/* Reset */}
            <button
              id="btn-reset-demo"
              onClick={onResetDemo}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-transparent transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub Bar: Case Selector & Tab Navigation */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* Active Case Selector */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Active Case:
            </span>
            {cases.map((c) => {
              const isSelected = c.id === selectedCaseId;
              const isAml = c.type === 'AML_ALERT';
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCase(c.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isAml ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="font-mono font-semibold">{c.id}</span>
                  <span className="text-[11px] opacity-80 hidden sm:inline">
                    {c.type === 'ONBOARDING' ? 'Clean Onboarding' : '$8.2M AML Alert'}
                  </span>
                  {c.isTampered && <span className="text-rose-400 text-[10px] font-bold">⚠️ TAMPERED</span>}
                </button>
              );
            })}
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-slate-800 text-white font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              1. Case Overview
            </button>
            <button
              onClick={() => setActiveTab('trace')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'trace'
                  ? 'bg-slate-800 text-white font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              2. Agent Trace (OTel)
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'evidence'
                  ? 'bg-slate-800 text-white font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              3. Evidence Graph
            </button>
            <button
              onClick={() => setActiveTab('proof')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center space-x-1 ${
                activeTab === 'proof'
                  ? 'bg-slate-800 text-amber-300 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>4. Aegis Proof</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
