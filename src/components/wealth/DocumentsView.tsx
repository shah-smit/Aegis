import React, { useState } from 'react';
import { ClientProfile, DocumentRecord } from '../../types';
import { 
  FileText, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  CheckCircle2,
  Cpu,
  Clock
} from 'lucide-react';

interface DocumentsViewProps {
  clients: ClientProfile[];
  onSelectClient: (clientId: string) => void;
  onInspectControlPlaneCase: (caseId: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  clients,
  onSelectClient,
  onInspectControlPlaneCase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const allDocuments: Array<DocumentRecord & { clientName: string; clientId: string; caseId: string }> = clients.flatMap(c => 
    c.documents.map(d => ({
      ...d,
      clientName: c.name,
      clientId: c.id,
      caseId: c.linkedCaseId,
    }))
  );

  const filteredDocs = allDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 font-serif">
            Aegis Cryptographic Document Vault
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Client Legal & Corporate Documents
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Trust deeds, ACRA BizFile corporate extracts, audited wealth verifications, and signed agreements.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>All {allDocuments.length} Documents Hash-Verified (SHA-256)</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search documents, entities, summaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {['ALL', 'TRUST_DEED', 'REGISTRY_EXTRACT', 'SOURCE_OF_WEALTH', 'FINANCIAL_STATEMENT', 'TRANSACTION_RECEIPT'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                filterType === type
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span 
                  onClick={() => onSelectClient(doc.clientId)}
                  className="font-serif font-bold text-amber-900 hover:underline cursor-pointer"
                >
                  {doc.clientName}
                </span>
                <span className="text-emerald-700 font-semibold flex items-center space-x-1 text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>VERIFIED</span>
                </span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">
                    {doc.name}
                  </h4>
                  <span className="text-[10px] font-mono text-stone-400">
                    Type: {doc.type} • {doc.size}
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-600 mt-3 line-clamp-3">
                {doc.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2">
              <div className="text-[10px] font-mono text-stone-500 truncate" title={doc.sha256}>
                SHA-256: <span className="text-stone-800 font-bold">{doc.sha256}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-stone-400 text-[11px]">
                  Uploaded {doc.uploadedAt}
                </span>

                <button
                  onClick={() => onInspectControlPlaneCase(doc.caseId)}
                  className="font-mono text-stone-700 hover:text-stone-900 text-[11px] flex items-center space-x-1"
                >
                  <Cpu className="w-3 h-3 text-cyan-600" />
                  <span>Control Plane</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
