import React, { useState } from 'react';
import { 
  Presentation, 
  X, 
  Shield, 
  Award, 
  CheckCircle2, 
  Sliders, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  Target,
  Video,
  Clock,
  Cloud,
  Cpu,
  Sparkles
} from 'lucide-react';

interface PresentationGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (id: string) => void;
  onOpenTamperModal: () => void;
  onOpenPolicyModal: () => void;
}

export const PresentationGuide: React.FC<PresentationGuideProps> = ({
  isOpen,
  onClose,
  onSelectCase,
  onOpenTamperModal,
  onOpenPolicyModal,
}) => {
  const [activeTab, setActiveTab] = useState<'video_script' | 'singhacks' | 'allhacks'>('video_script');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-5 text-white max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Aegis Hackathon Video & Demo Blueprint</h3>
              <p className="text-[11px] text-slate-400">Strictly under 4-minute time limit • Aligned with hackathon scoring rubric</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Toggle */}
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('video_script')}
            className={`p-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'video_script'
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>4-Min Video Script</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('singhacks')}
            className={`p-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'singhacks'
                ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            <Award className="w-4 h-4 text-indigo-400" />
            <span>SingHacks PBIG</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('allhacks')}
            className={`p-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'allhacks'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>All Hacks Technical</span>
          </button>
        </div>

        {/* Tab 1: Video Script */}
        {activeTab === 'video_script' && (
          <div className="space-y-4 text-xs font-sans">
            {/* Checklist Banner */}
            <div className="bg-gradient-to-r from-amber-950/40 to-stone-900 p-4 rounded-xl border border-amber-500/40 space-y-2">
              <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Required Video Checklist (4:00 Max Evaluation Cap)</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                <div>✓ Problem & Solution Value</div>
                <div>✓ Live Agent Logs & Real Work</div>
                <div>✓ Exact Gemini Model & Framework</div>
                <div>✓ Google Cloud Proof (.run.app URL)</div>
              </div>
            </div>

            {/* Timed Teleprompter Breakdown */}
            <div className="space-y-3 font-sans">
              {/* Segment 1 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-amber-400 font-mono text-[11px] font-bold">
                  <span>0:00 - 0:40 • THE PROBLEM & SOLUTION</span>
                  <span>40 Seconds</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <strong>Screen:</strong> Start on <em>Wealth Experience $\rightarrow$ Overview</em> showing the SGD 98.8M Advisor Workspace.<br />
                  <strong>Voiceover:</strong> "In private banking and wealth management, onboarding a single family office or approving a high-value transfer takes up to 6 weeks due to fragmented KYC, regulatory checks under MAS Notice 626, and manual compliance bottlenecks. AI agents can automate this—but financial institutions cannot deploy unconstrained LLMs that hallucinate or act unpredictably. This is <strong>Aegis</strong>: the Verifiable Autonomous Operating System for Private Wealth. Agents act. Policies constrain. Aegis proves."
                </p>
              </div>

              {/* Segment 2 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px] font-bold">
                  <span>0:40 - 1:15 • EXACT MODELS & AGENT FRAMEWORK</span>
                  <span>35 Seconds</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <strong>Screen:</strong> Switch to <em>Aegis Control Plane $\rightarrow$ Agent Trace (OTel)</em>.<br />
                  <strong>Voiceover:</strong> "Aegis is built using <strong>Google Gemini 2.5 Flash and Gemini 2.5 Pro</strong> via the modern <code>@google/genai</code> SDK, orchestrated through an <strong>OpenTelemetry-native multi-agent framework</strong>. We assign specialized sub-agents: a <em>Registry Extraction Agent</em>, a <em>PEP & Sanctions Screening Agent</em>, and a <em>Flow-of-Funds Investigator</em>, all monitored by a deterministic Policy-as-Code engine."
                </p>
              </div>

              {/* Segment 3 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-indigo-400 font-mono text-[11px] font-bold">
                  <span>1:15 - 2:40 • LIVE AGENT WORK & BOUNDED AUTONOMY</span>
                  <span>85 Seconds</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <strong>Screen:</strong> Open <em>Supervisory Approval Modal</em> for $8.2M Wire Hold (Starlight Commodities), show the live logs, then enter PIN <code>8492</code> to sign off.<br />
                  <strong>Voiceover:</strong> "Here is an agent actively working on an $8.2M international trade advance. Notice our core innovation: <strong>Bounded Autonomy</strong>. The agent extracted ACRA corporate filings and ran PEP screening. But because the transfer exceeded the $5M policy limit, our deterministic policy engine blocked autonomous dispatch. The agent compiled the evidence and escalated to the human advisor. Once signed, the system dispatches the payment gateway and generates an immutable execution record."
                </p>
              </div>

              {/* Segment 4 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-rose-400 font-mono text-[11px] font-bold">
                  <span>2:40 - 3:25 • CRYPTOGRAPHIC MERKLE TAMPER DEMO</span>
                  <span>45 Seconds</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <strong>Screen:</strong> Click <em>"PROOF VERIFIED"</em> pill $\rightarrow$ Click <em>"Simulate Malicious Database Edit"</em>.<br />
                  <strong>Voiceover:</strong> "Aegis never asks regulators to trust an LLM. Every event is linked in a SHA-256 hash chain and Merkle root. If a malicious insider or rogue process tampers with even one byte of the audit log—like changing a risk score from HIGH to LOW—the proof verification fails immediately. It is mathematically impossible to alter the execution history."
                </p>
              </div>

              {/* Segment 5 */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-emerald-400 font-mono text-[11px] font-bold">
                  <span>3:25 - 3:55 • GOOGLE CLOUD PROOF & CONCLUSION</span>
                  <span>30 Seconds</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <strong>Screen:</strong> Point cursor to browser address bar showing the live <code>.run.app</code> Google Cloud Run domain.<br />
                  <strong>Voiceover:</strong> "Aegis is deployed natively on <strong>Google Cloud Run</strong> with full containerized scalability and Vertex AI integration, live at our Cloud Run URL. Aegis delivers a 90% reduction in wealth onboarding cycle time with 100% regulatory determinism. Thank you."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SingHacks PBIG Narrative */}
        {activeTab === 'singhacks' && (
          <div className="space-y-4 text-xs font-sans">
            <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/30">
              <h4 className="font-bold text-indigo-300 text-sm mb-1">
                SingHacks Singapore PBIG 2026 Mandate
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Singapore's Private Banking Industry Group (PBIG) mandated bringing private-bank account openings to <strong>within one month by end-2026</strong>. Aegis accomplishes this in minutes under MAS Notice 626 and Singapore IMDA Agentic AI Governance Framework.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <div className="font-bold text-amber-400">Key Singapore-Specific Highlights:</div>
              <ul className="list-disc pl-5 space-y-1 text-[11px]">
                <li>Live ACRA BizFile API matching for Beneficial Ownership (UBO) structures.</li>
                <li>MAS 626 AML screening and PEP categorization.</li>
                <li>Discretionary Mandate asset allocation drift monitoring in SGD.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: All Hacks Technical */}
        {activeTab === 'allhacks' && (
          <div className="space-y-4 text-xs font-sans">
            <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30">
              <h4 className="font-bold text-emerald-300 text-sm mb-1">
                Technical Thesis: "Never Ask the LLM to Prove Itself"
              </h4>
              <p className="text-slate-300 leading-relaxed">
                The LLM reasons, OpenTelemetry observes, deterministic policies authorize, and cryptography proves.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-rose-400 font-bold">1. Cryptographic Tamper Simulator:</span>
                  <p className="text-slate-400 text-[10px]">Test SHA-256 Merkle root resilience against database alteration.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenTamperModal();
                  }}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold font-sans"
                >
                  Test Tamper
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <div>
                  <span className="text-cyan-400 font-bold">2. Policy Gate Versioning:</span>
                  <p className="text-slate-400 text-[10px]">Inspect Policy-as-Code rules anchored in cryptographic receipts.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenPolicyModal();
                  }}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold font-sans"
                >
                  Inspect Policies
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-mono">Target recording duration: 3 min 45 sec</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

