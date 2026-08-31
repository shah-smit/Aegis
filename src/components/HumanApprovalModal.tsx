import React, { useState } from 'react';
import { Case } from '../types';
import { UserCheck, X, CheckCircle2, XCircle, HelpCircle, Shield, Key } from 'lucide-react';

interface HumanApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case;
  onSubmitDecision: (decision: 'APPROVED' | 'REJECTED' | 'REQUEST_INFO', reviewerName: string, notes: string, conditions?: string[]) => void;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  onSubmitDecision,
}) => {
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | 'REQUEST_INFO'>('APPROVED');
  const [reviewerName, setReviewerName] = useState('Sarah Chen (Head of RegTech Compliance, PBIG)');
  const [notes, setNotes] = useState(
    'Corroborated counterparty invoice with First Zurich Private Bank confirmation. Source of funds accepted under MAS Notice 626 guidance with enhanced ongoing monitoring condition.'
  );
  const [conditionText, setConditionText] = useState('Enhanced 90-day ongoing transaction velocity monitoring');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitDecision(decision, reviewerName, notes, conditionText ? [conditionText] : []);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Senior Compliance Officer Supervisory Console</h3>
              <p className="text-[11px] text-slate-400">Meaningful human checkpoint mandated by IMDA Agentic AI Framework</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Summary */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Case ID:</span>
            <span className="text-white font-semibold">{currentCase.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Subject Entity:</span>
            <span className="text-amber-300 font-semibold">{currentCase.targetEntityName}</span>
          </div>
          {currentCase.amlDetails && (
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction Value:</span>
              <span className="text-emerald-400 font-bold">USD ${currentCase.amlDetails.amount.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Decision Selector */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Supervisory Decision:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecision('APPROVED')}
                className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                  decision === 'APPROVED'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>APPROVE & RELEASE</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('REJECTED')}
                className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                  decision === 'REJECTED'
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>REJECT & BLOCK</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('REQUEST_INFO')}
                className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                  decision === 'REQUEST_INFO'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>REQUEST DOCS</span>
              </button>
            </div>
          </div>

          {/* Reviewer Name */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Authorizing Officer Name & Title:</label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Compliance Audit Notes */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Compliance Audit Justification & Rationale:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Applied Condition */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Condition of Approval (Optional):</label>
            <input
              type="text"
              value={conditionText}
              onChange={(e) => setConditionText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <Key className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <span>
              Submitting this decision appends a signed supervisory event into the case hash chain and mints an updated Aegis Action Receipt.
            </span>
          </div>

          {/* Footer CTA */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-colors"
            >
              Sign & Commit Decision to Chain
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
