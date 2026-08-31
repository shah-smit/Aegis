import React from 'react';
import { RegistryRecord } from '../types';
import { Building2, CheckCircle2, ShieldCheck, ExternalLink, Calendar, MapPin, User, FileText } from 'lucide-react';

interface ACRARegistryBadgeProps {
  record?: RegistryRecord;
  targetEntityName: string;
}

export const ACRARegistryBadge: React.FC<ACRARegistryBadgeProps> = ({ record, targetEntityName }) => {
  if (!record) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-slate-400 text-xs flex items-center justify-between">
        <span>No Singapore ACRA registry record linked to this entity.</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">ACRA Singapore</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Verified Match ({record.matchScore}%)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Business Profile Data API v2</p>
          </div>
        </div>
        <div className="text-right font-mono text-[11px]">
          <span className="text-slate-400">UEN: </span>
          <span className="font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">{record.uen}</span>
        </div>
      </div>

      {/* Entity Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-xs">
        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block mb-1">Registered Entity Name</span>
          <span className="font-semibold text-white font-mono">{record.entityName}</span>
        </div>
        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Company Status</span>
            <span className="inline-flex items-center space-x-1 font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{record.status} (Active)</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block mb-1">Paid-up Capital</span>
            <span className="font-semibold text-white font-mono">{record.paidUpCapital}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60 text-xs mb-3 flex items-start space-x-2">
        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
        <div>
          <span className="text-[11px] text-slate-400 block">Registered Office Address</span>
          <span className="text-slate-200 font-mono text-[11px]">{record.registeredAddress}</span>
        </div>
      </div>

      {/* Registered Officers & Shareholders */}
      <div className="text-xs">
        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
          Registered Officers & Key Personnel
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {record.officers.map((officer, idx) => (
            <div key={idx} className="bg-slate-950/70 p-2 rounded border border-slate-800/80 text-[11px]">
              <div className="font-semibold text-white truncate">{officer.name}</div>
              <div className="text-amber-400 text-[10px]">{officer.role}</div>
              <div className="text-slate-500 font-mono text-[9px] mt-0.5">NRIC: {officer.idNumberMasked}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cryptographic Proof Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Proof Hash: {record.proofHash.slice(0, 16)}...{record.proofHash.slice(-8)}</span>
        </span>
        <span className="text-slate-500">Verified {new Date(record.verifiedAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
