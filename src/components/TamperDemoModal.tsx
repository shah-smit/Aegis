import React, { useState } from 'react';
import { Case } from '../types';
import { AlertTriangle, ShieldAlert, ShieldCheck, X, RefreshCw, Lock, ArrowRight } from 'lucide-react';

interface TamperDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: Case;
  onTamper: (eventIndex: number, maliciousModification: string) => void;
  onRestore: () => void;
}

export const TamperDemoModal: React.FC<TamperDemoModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  onTamper,
  onRestore,
}) => {
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(1);
  const [tamperText, setTamperText] = useState<string>(
    'Malicious modification: Altered transaction amount from $8,200,000 to $4,200,000 to forge policy gate bypass'
  );

  if (!isOpen) return null;

  const isTampered = currentCase.isTampered;

  const handleTamperClick = () => {
    onTamper(selectedEventIndex, tamperText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isTampered ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Cryptographic Tampering & Integrity Attack Simulator</h3>
              <p className="text-[11px] text-slate-400">Prove that historical agent actions cannot be secretly manipulated</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Indicator */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          isTampered
            ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
            : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
        }`}>
          <div className="flex items-center space-x-3">
            {isTampered ? (
              <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            )}
            <div>
              <div className="font-bold text-xs">
                Current Case Status: {isTampered ? '❌ INTEGRITY COMPROMISED' : '✅ 100% PRISTINE & VERIFIED'}
              </div>
              <div className="text-[11px] text-slate-300">
                {isTampered ? 'Event hash mismatch detected. Subsequent chain links are broken.' : 'All sequential block hashes match recorded SHA-256 case root.'}
              </div>
            </div>
          </div>
          {isTampered && (
            <button
              onClick={onRestore}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow"
            >
              Restore Original
            </button>
          )}
        </div>

        {/* Step-by-Step Attack Explainer */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Select Historical Event Node to Inject Malicious Tampering:
            </label>
            <select
              value={selectedEventIndex}
              onChange={(e) => setSelectedEventIndex(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
            >
              {currentCase.events.map((ev, idx) => (
                <option key={ev.eventId} value={idx}>
                  Sequence #{idx}: {ev.action} ({ev.actor.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Malicious Modification Payload:
            </label>
            <textarea
              rows={3}
              value={tamperText}
              onChange={(e) => setTamperText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">How Aegis Verifies Autonomy:</span>
            <p>
              1. Modifying even 1 byte in Event #{selectedEventIndex} changes its computed SHA-256 hash.
            </p>
            <p>
              2. Because Event #{selectedEventIndex + 1} embeds <code className="text-amber-300">previousEventHash</code>, the entire downstream hash chain ruptures.
            </p>
            <p>
              3. The Verifier immediately flags the tampering and pinpoints the exact compromised node.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Cancel
          </button>
          {isTampered ? (
            <button
              onClick={() => {
                onRestore();
                onClose();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore Pristine Evidence & Re-Verify</span>
            </button>
          ) : (
            <button
              onClick={() => {
                handleTamperClick();
                onClose();
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/30 transition-colors flex items-center space-x-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulate Tamper Attack</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
