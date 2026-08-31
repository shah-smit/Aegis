import React, { useState } from 'react';
import { Case, TelemetrySpan } from '../types';
import { Cpu, Activity, Clock, Layers, ArrowDownRight, CheckCircle2, Shield, AlertCircle, Sparkles } from 'lucide-react';

interface AgentTraceViewProps {
  currentCase: Case;
}

export const AgentTraceView: React.FC<AgentTraceViewProps> = ({ currentCase }) => {
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(
    currentCase.telemetrySpans[0]?.spanId || null
  );

  const spans = currentCase.telemetrySpans;
  const selectedSpan = spans.find((s) => s.spanId === selectedSpanId) || spans[0];

  // Calculate total duration
  const minStart = spans.length > 0 ? Math.min(...spans.map((s) => s.startTime)) : 0;
  const maxEnd = spans.length > 0 ? Math.max(...spans.map((s) => s.endTime)) : 1;
  const totalDuration = Math.max(1, maxEnd - minStart);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-mono mb-1">
            <Activity className="w-4 h-4" />
            <span>OpenTelemetry OTLP / Google ADK Tracing Specification</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Multi-Agent Execution Traces & Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Case Trace ID: <span className="font-mono text-slate-300">{currentCase.id}</span> • {spans.length} Telemetry Spans Recorded
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            <span className="text-slate-400">Total Latency: </span>
            <span className="text-amber-300 font-bold">{totalDuration} ms</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            <span className="text-slate-400">Collector: </span>
            <span className="text-emerald-300 font-bold">Cloud Trace / OTel</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Spans List / Timeline + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Timeline & Spans */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Execution Timeline (Gantt)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Parallel Agent Coordination</span>
          </div>

          <div className="space-y-2.5">
            {spans.map((span, idx) => {
              const isSelected = span.spanId === selectedSpan?.spanId;
              const leftPercent = Math.max(0, Math.min(95, ((span.startTime - minStart) / totalDuration) * 100));
              const widthPercent = Math.max(8, Math.min(100 - leftPercent, (span.durationMs / totalDuration) * 100));

              return (
                <div
                  key={span.spanId}
                  onClick={() => setSelectedSpanId(span.spanId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-slate-300">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                        {span.operationName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-amber-300 text-[11px] font-semibold">
                        {span.durationMs} ms
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {span.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                    <span>{span.agentName}</span>
                    <span className="text-[10px] text-slate-500">{span.agentId}</span>
                  </div>

                  {/* Relative Timeline Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full ${
                        span.agentId.includes('gemini') || span.agentId.includes('doc')
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                          : span.agentId.includes('acra')
                          ? 'bg-gradient-to-r from-red-500 to-rose-400'
                          : span.agentId.includes('aml')
                          ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                          : span.agentId.includes('policy')
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-400'
                      }`}
                      style={{
                        marginLeft: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Span Attribute Inspector */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Span Telemetry Inspector
                </h3>
              </div>
              <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {selectedSpan?.spanId}
              </span>
            </div>

            {selectedSpan ? (
              <div className="space-y-4 text-xs">
                {/* Operation details */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block mb-1">OPERATION NAME</span>
                  <div className="font-bold text-white font-mono">{selectedSpan.operationName}</div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    Agent: <span className="text-slate-200">{selectedSpan.agentName}</span> ({selectedSpan.agentId})
                  </div>
                </div>

                {/* Timing */}
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">START TIME</span>
                    <span className="text-slate-200">{new Date(selectedSpan.startTime).toLocaleTimeString()}</span>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">DURATION</span>
                    <span className="text-amber-300 font-bold">{selectedSpan.durationMs} ms</span>
                  </div>
                </div>

                {/* Attributes / Key-Value Map */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    OpenTelemetry Span Attributes
                  </span>
                  <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[11px] space-y-1.5 max-h-56 overflow-y-auto">
                    {Object.entries(selectedSpan.attributes || {}).map(([key, val]) => (
                      <div key={key} className="flex items-start justify-between border-b border-slate-900 pb-1">
                        <span className="text-indigo-400">{key}:</span>
                        <span className="text-slate-300 font-semibold text-right max-w-[200px] truncate">
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Notice */}
                <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3 text-[11px] text-indigo-300 flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Every span event is serialized and hashed into the Aegis cryptographic event tree, guaranteeing immutable execution proof.
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-center py-10">Select a span to inspect attributes.</div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Trace Standard: OTel v1.28</span>
            <span className="text-emerald-400">Span Status: OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
