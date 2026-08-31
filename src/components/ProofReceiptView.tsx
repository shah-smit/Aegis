import React, { useState } from 'react';
import { Case, AegisEvent, ActionReceipt } from '../types';
import { ShieldCheck, ShieldAlert, Shield, CheckCircle2, AlertTriangle, Key, FileCheck, ArrowRight, RefreshCw, Lock, Sparkles, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProofReceiptViewProps {
  currentCase: Case;
  onVerifyIntegrity: () => void;
  onOpenTamperModal: () => void;
}

export const ProofReceiptView: React.FC<ProofReceiptViewProps> = ({
  currentCase,
  onVerifyIntegrity,
  onOpenTamperModal,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    currentCase.events[0]?.eventId || null
  );
  const [copiedReceiptId, setCopiedReceiptId] = useState<string | null>(null);

  const selectedEvent = currentCase.events.find((e) => e.eventId === selectedEventId) || currentCase.events[0];
  const isTampered = currentCase.isTampered;
  const receipts = currentCase.actionReceipts;

  const handleTriggerVerify = () => {
    onVerifyIntegrity();
    if (!isTampered) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#38bdf8'],
      });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReceiptId(id);
    setTimeout(() => setCopiedReceiptId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification Status & Verification CTA */}
      <div className={`border rounded-2xl p-6 shadow-xl transition-all ${
        isTampered
          ? 'bg-rose-950/40 border-rose-500/60 shadow-rose-950/50'
          : 'bg-gradient-to-br from-slate-900 to-slate-950 border-emerald-500/40 shadow-emerald-950/20'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
              isTampered
                ? 'bg-rose-600 text-white shadow-rose-600/40 animate-pulse'
                : 'bg-emerald-600 text-white shadow-emerald-600/40'
            }`}>
              {isTampered ? <ShieldAlert className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {isTampered ? '❌ INTEGRITY FAILURE / TAMPER DETECTED' : '✅ 100% CRYPTOGRAPHICALLY VERIFIED'}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isTampered ? 'bg-rose-900 text-rose-200' : 'bg-emerald-900 text-emerald-200'
                }`}>
                  {isTampered ? 'Chain Broken' : 'SHA-256 Valid'}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">
                {isTampered
                  ? currentCase.tamperMessage || 'Malicious modification detected in historical event payload. Previous hash chain link is broken.'
                  : 'Every agent action, evidence hash, policy version, and supervisory approval is sequentially chained and cryptographically unforgeable.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-re-verify-case"
              onClick={handleTriggerVerify}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-md ${
                isTampered
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Re-Verify Hash Chain</span>
            </button>
            <button
              id="btn-proof-tamper-demo"
              onClick={onOpenTamperModal}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold transition-colors"
            >
              {isTampered ? 'Restore Data' : 'Attack Simulator'}
            </button>
          </div>
        </div>

        {/* Case Root Hash Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Case Integrity Root (H_Final):</span>
            <span className={`px-2 py-0.5 rounded font-bold ${
              isTampered ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-950 text-amber-300 border border-slate-800'
            }`}>
              {currentCase.caseIntegrityRoot || 'GENESIS'}
            </span>
          </div>
          <div className="text-slate-400">
            Chain Height: <span className="text-white font-bold">{currentCase.events.length} sequential blocks</span>
          </div>
        </div>
      </div>

      {/* Hash Chain Visualizer & Event Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: The Hash Chain Blocks */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Sequential Event Hash Chain (H_0 → H_n)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Immutable Audit Trail</span>
          </div>

          <div className="space-y-3">
            {currentCase.events.map((ev, idx) => {
              const isSelected = ev.eventId === selectedEvent?.eventId;
              const isBroken = isTampered && idx === currentCase.tamperedEventIndex;

              return (
                <div
                  key={ev.eventId}
                  onClick={() => setSelectedEventId(ev.eventId)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isBroken
                      ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/50 animate-pulse'
                      : isSelected
                      ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        isBroken ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        #{ev.sequenceIndex}
                      </span>
                      <span className="font-bold text-white font-mono">{ev.action}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                    <span>Actor: {ev.actor.id} (v{ev.actor.version})</span>
                    {ev.decision && (
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                        ev.decision === 'ALLOW' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {ev.decision}
                      </span>
                    )}
                  </div>

                  {/* Hash values snippet */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-slate-800/80">
                    <div className="truncate">
                      <span className="text-slate-500">Prev Hash: </span>
                      <span className="text-slate-400">{ev.previousEventHash.slice(0, 8)}...</span>
                    </div>
                    <div className="truncate text-right">
                      <span className="text-slate-500">Event Hash: </span>
                      <span className={isBroken ? 'text-rose-400 font-bold' : 'text-amber-400 font-semibold'}>
                        {ev.eventHash.slice(0, 10)}...
                      </span>
                    </div>
                  </div>

                  {/* Broken marker */}
                  {isBroken && (
                    <div className="mt-2 text-[10px] text-rose-300 font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      <span>MALICIOUS PAYLOAD MODIFICATION DETECTED HERE</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Selected Event Payload Inspector */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Event Node Payload Inspector
                </h3>
              </div>
              <span className="font-mono text-[10px] text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Block #{selectedEvent?.sequenceIndex}
              </span>
            </div>

            {selectedEvent ? (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block mb-1">EVENT IDENTIFIER</span>
                  <div className="font-bold text-white font-mono">{selectedEvent.eventId}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Action: {selectedEvent.action}</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500">Previous Hash (H_{'{i-1}'}):</span>
                    <div className="text-slate-300 text-[10px] break-all bg-slate-900 p-1.5 rounded mt-0.5">
                      {selectedEvent.previousEventHash}
                    </div>
                  </div>
                  <div>
                    <span className="text-amber-400 font-semibold">Calculated Event Hash (H_{'{i}'}):</span>
                    <div className="text-amber-300 text-[10px] break-all bg-slate-900 p-1.5 rounded mt-0.5">
                      {selectedEvent.eventHash}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Serialized Payload Snapshot
                  </span>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedEvent.payloadSnapshot, null, 2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-center py-10">Select an event block to inspect.</div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Algorithm: SHA-256</span>
            <span className="text-emerald-400">Verifiable Autonomy Layer</span>
          </div>
        </div>
      </div>

      {/* Action Receipts Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Aegis Action Execution Receipts</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {receipts.length} Verifiable Cryptographic Receipts Minted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {receipts.map((rcpt) => (
            <div
              key={rcpt.receiptId}
              className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 text-xs font-mono relative overflow-hidden shadow"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div>
                  <div className="font-bold text-white text-xs">{rcpt.actionType}</div>
                  <span className="text-[10px] text-slate-400">{rcpt.receiptId}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  rcpt.executionStatus === 'SUCCESS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {rcpt.executionStatus}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Case ID:</span>
                  <span className="text-slate-300 font-semibold">{rcpt.caseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Governing Policy:</span>
                  <span className="text-cyan-300">{rcpt.policyId} (v{rcpt.policyVersion})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Decision:</span>
                  <span className="text-emerald-300 font-bold">{rcpt.decision}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Evidence Count:</span>
                  <span className="text-slate-300">{rcpt.evidenceCount} records</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-400">{new Date(rcpt.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Signature Box */}
              <div className="bg-slate-900/90 p-2 rounded border border-slate-800 text-[10px] text-amber-300 break-all mb-2">
                <div className="text-slate-500 text-[9px] mb-0.5">ED25519 DIGITAL SIGNATURE</div>
                {rcpt.signature}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                <span>Cert: {rcpt.verificationCert}</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(rcpt, null, 2), rcpt.receiptId)}
                  className="text-slate-300 hover:text-white flex items-center space-x-1 bg-slate-800 px-2 py-0.5 rounded transition-colors"
                >
                  {copiedReceiptId === rcpt.receiptId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
