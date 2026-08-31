import React, { useState } from 'react';
import { Case, PolicyConfig } from '../types';
import { Sliders, X, CheckCircle2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface PolicyVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case;
  policyConfig: PolicyConfig | null;
  onUpdatePolicyConfig: (newThreshold: number, newVersion: string) => void;
}

export const PolicyVersionModal: React.FC<PolicyVersionModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  policyConfig,
  onUpdatePolicyConfig,
}) => {
  const currentThreshold = policyConfig?.amlTransactionThreshold || 5000000;
  const [selectedThreshold, setSelectedThreshold] = useState<number>(currentThreshold);

  if (!isOpen) return null;

  const currentPolicyVersion = currentCase.policyEvaluation?.policyVersion || '1.0.0';
  const txAmount = currentCase.amlDetails?.amount || 8200000;

  const handleApply = (threshold: number, version: string) => {
    onUpdatePolicyConfig(threshold, version);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Policy-as-Code & Dynamic Versioning Gate</h3>
              <p className="text-[11px] text-slate-400">Demonstrating deterministic policy governance over autonomous agents</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Context Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>Transaction Value Under Investigation:</span>
            <span className="text-amber-300 font-bold font-mono">USD ${txAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Active Policy Applied in Proof Receipt:</span>
            <span className="text-cyan-300 font-semibold font-mono">Policy v{currentPolicyVersion}</span>
          </div>
        </div>

        {/* Comparison Preset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Policy Preset v1.0.0 */}
          <div
            onClick={() => handleApply(5000000, '1.0.0')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              currentPolicyVersion === '1.0.0'
                ? 'bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                : 'bg-slate-950 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold font-mono text-cyan-300 text-xs">Policy v1.0.0</span>
              {currentPolicyVersion === '1.0.0' && (
                <span className="text-[10px] bg-cyan-900 text-cyan-200 px-2 py-0.5 rounded-full font-semibold">Active</span>
              )}
            </div>
            <div className="text-slate-300 mb-1">
              Autonomous Limit: <strong className="text-white font-mono">$5,000,000</strong>
            </div>
            <div className="text-[11px] text-amber-400 font-medium">
              → Decision: <strong className="font-bold">HUMAN_REVIEW</strong>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Requires Senior Compliance Officer manual sign-off for wire exceeding $5M.
            </p>
          </div>

          {/* Policy Preset v1.1.0 */}
          <div
            onClick={() => handleApply(10000000, '1.1.0')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              currentPolicyVersion === '1.1.0'
                ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                : 'bg-slate-950 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold font-mono text-emerald-300 text-xs">Policy v1.1.0 (Tier-2)</span>
              {currentPolicyVersion === '1.1.0' && (
                <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-full font-semibold">Active</span>
              )}
            </div>
            <div className="text-slate-300 mb-1">
              Autonomous Limit: <strong className="text-white font-mono">$10,000,000</strong>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">
              → Decision: <strong className="font-bold">ALLOW</strong>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Transaction ($8.2M) falls within elevated threshold. Autonomous clearance granted.
            </p>
          </div>
        </div>

        {/* Explanatory note */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <span className="font-semibold text-slate-300 block">The All Hacks Architectural Thesis:</span>
          <p>
            The LLM never defines or modifies authority. When policy is updated, the exact policy version and threshold is recorded inside the cryptographic Action Receipt, proving regulatory provenance for MAS audits.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
