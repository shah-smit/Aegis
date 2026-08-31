import React, { useState } from 'react';
import { Case, DocumentRecord, OwnershipNode } from '../types';
import { Network, FileText, CheckCircle2, Shield, Lock, Eye, ArrowRight, Share2, Layers, Key } from 'lucide-react';

interface EvidenceGraphViewProps {
  currentCase: Case;
}

export const EvidenceGraphView: React.FC<EvidenceGraphViewProps> = ({ currentCase }) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    currentCase.documents[0]?.id || null
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    currentCase.entityGraph.nodes[0]?.id || null
  );

  const selectedDoc = currentCase.documents.find((d) => d.id === selectedDocId) || currentCase.documents[0];
  const selectedNode = currentCase.entityGraph.nodes.find((n) => n.id === selectedNodeId) || currentCase.entityGraph.nodes[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono mb-1">
            <Network className="w-4 h-4" />
            <span>Multi-Tier Entity & Evidence Graph</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Corporate Ownership Topology & Document Store
          </h2>
          <p className="text-xs text-slate-400">
            {currentCase.entityGraph.nodes.length} Entity Nodes • {currentCase.entityGraph.totalTiers} Holding Tiers • {currentCase.documents.length} Cryptographic Evidence Records
          </p>
        </div>
        <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Identified UBO: </span>
          <span className="text-amber-300 font-bold">{currentCase.entityGraph.uboIdentified.join(', ')}</span>
        </div>
      </div>

      {/* Top Section: Visual Entity Topology Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Multi-Tier Ownership Architecture</span>
          </h3>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-800/60">
            {currentCase.entityGraph.anomaliesDetected.length === 0 ? '✓ No Circular Loops' : '⚠️ Anomalies Flagged'}
          </span>
        </div>

        {/* Visual Graph Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {currentCase.entityGraph.nodes.map((node, index) => {
            const isSelected = node.id === selectedNode?.id;
            return (
              <div key={node.id} className="relative flex flex-col items-center">
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full p-4 rounded-xl border transition-all cursor-pointer text-left relative z-10 ${
                    isSelected
                      ? 'bg-slate-800 border-amber-400 shadow-lg ring-2 ring-amber-400/30'
                      : 'bg-slate-950/80 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                      Tier {index + 1}
                    </span>
                    {node.isUBO && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        UBO ★
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-white text-xs mb-1 truncate">{node.name}</div>
                  <div className="text-[11px] text-slate-400 mb-2">{node.type.replace('_', ' ')}</div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">{node.jurisdiction}</span>
                    <span className="font-bold text-emerald-400">{node.percentage}%</span>
                  </div>
                </div>

                {/* Arrow Connector for larger screens */}
                {index < currentCase.entityGraph.nodes.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-slate-400 text-xs">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Evidence Document Store & Digest Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document List (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Cryptographic Document Repository</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">SHA-256 Anchored</span>
          </div>

          <div className="space-y-3">
            {currentCase.documents.map((doc) => {
              const isSelected = doc.id === selectedDoc?.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="font-semibold text-white font-mono truncate max-w-xs">{doc.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{doc.size}</span>
                  </div>

                  <p className="text-[11px] text-slate-300 mb-2 line-clamp-1">{doc.summary}</p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1.5 border-t border-slate-800/80">
                    <span className="truncate max-w-[240px]">Hash: {doc.sha256}</span>
                    <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Digest / Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Evidence Digest & Merkle Anchor
                </h3>
              </div>
              <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {selectedDoc?.type}
              </span>
            </div>

            {selectedDoc ? (
              <div className="space-y-4 text-xs">
                {/* Title & Type */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono block mb-1">DOCUMENT NAME</span>
                  <div className="font-bold text-white font-mono break-all">{selectedDoc.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Uploaded: {new Date(selectedDoc.uploadedAt).toLocaleString()}</div>
                </div>

                {/* Cryptographic Hash */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-amber-400 font-mono font-semibold block mb-1">SHA-256 EVIDENCE DIGEST</span>
                  <div className="font-mono text-[11px] text-slate-300 break-all bg-slate-900/80 p-2 rounded border border-slate-800">
                    {selectedDoc.sha256}
                  </div>
                </div>

                {/* Extracted Clause Snippet */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Gemini Extracted Clause / Text Excerpt
                  </span>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                    {selectedDoc.extractedSnippet}
                  </div>
                </div>

                {/* Privacy Architecture Notice */}
                <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-[11px] text-emerald-300 flex items-start space-x-2">
                  <Lock className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Zero-PII Leakage Principle:</strong> Private customer documents are stored in enclave storage. Only the cryptographic hash digest is published to the audit log.
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-center py-10">Select a document to inspect digest.</div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Merkle Ingestion: Level 0</span>
            <span className="text-emerald-400 font-semibold">Integrity Root Anchored</span>
          </div>
        </div>
      </div>
    </div>
  );
};
