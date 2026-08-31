import React from 'react';
import { 
  AppMode, 
  WealthNavTab, 
  AdvisorBookSummary, 
  Case, 
  PolicyConfig 
} from '../../types';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Sliders, 
  UserCheck, 
  Plus, 
  Presentation, 
  RotateCcw, 
  Sparkles, 
  Briefcase, 
  Users, 
  GitBranch, 
  PieChart, 
  Target, 
  FileText, 
  Lightbulb, 
  Cpu, 
  ChevronRight, 
  AlertTriangle 
} from 'lucide-react';

interface WealthNavbarProps {
  appMode: AppMode;
  onToggleAppMode: (mode: AppMode) => void;
  activeWealthTab: WealthNavTab;
  onChangeWealthTab: (tab: WealthNavTab) => void;
  advisorBook: AdvisorBookSummary;
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
}

export const WealthNavbar: React.FC<WealthNavbarProps> = ({
  appMode,
  onToggleAppMode,
  activeWealthTab,
  onChangeWealthTab,
  advisorBook,
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
}) => {
  const currentCase = cases.find(c => c.id === selectedCaseId);
  const isTampered = currentCase?.isTampered;
  const isPendingApproval = currentCase?.status === 'PENDING_APPROVAL';

  const navItems: Array<{ id: WealthNavTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'clients', label: 'Clients (360)', icon: Users },
    { id: 'workflows', label: 'Workflows', icon: GitBranch },
    { id: 'investments', label: 'Investments', icon: PieChart },
    { id: 'planning', label: 'Planning', icon: Target },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'intelligence', label: 'Aegis Intelligence', icon: Lightbulb },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-stone-200/80 text-stone-900 shadow-sm">
      {/* Top Utility & Mode Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center shadow-md ring-1 ring-amber-400/40">
              <Shield className="w-5 h-5 text-amber-400 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight font-serif text-stone-900">AEGIS</span>
                <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  WEALTH OS
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-sans hidden sm:block">
                Agents act. Policies constrain. Aegis proves.
              </p>
            </div>
          </div>

          {/* Center Mode Switcher (Frontstage vs Backstage) */}
          <div className="flex items-center bg-stone-100/90 p-1 rounded-xl border border-stone-200/80 shadow-inner">
            <button
              onClick={() => onToggleAppMode('WEALTH')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                appMode === 'WEALTH'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60 font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Wealth Experience</span>
            </button>
            <button
              onClick={() => onToggleAppMode('CONTROL_PLANE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                appMode === 'CONTROL_PLANE'
                  ? 'bg-stone-900 text-amber-300 shadow-md font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Aegis Control Plane</span>
            </button>
          </div>

          {/* Quick Actions & Integrity Badge */}
          <div className="flex items-center space-x-2">
            {/* Integrity Status Pill */}
            <div
              onClick={onOpenTamperModal}
              className={`cursor-pointer px-2.5 py-1 rounded-lg border text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                isTampered
                  ? 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
              title="Click to test cryptographic tamper detection"
            >
              {isTampered ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-bold text-[11px]">TAMPERED</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px]">PROOF VERIFIED</span>
                </>
              )}
            </div>

            {/* Human Pending Approval Action */}
            {isPendingApproval && (
              <button
                onClick={onOpenApprovalModal}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg font-semibold text-xs flex items-center space-x-1 shadow-sm animate-bounce"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Approval Waiting</span>
              </button>
            )}

            {/* Pitch Guide */}
            <button
              onClick={onOpenPitchGuide}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg border border-indigo-200 text-xs font-medium flex items-center space-x-1"
              title="Presentation Script & Architecture"
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-700" />
              <span className="hidden md:inline">Pitch Narrative</span>
            </button>

            {/* New Client / Intake */}
            <button
              onClick={onOpenNewCaseModal}
              className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Intake</span>
            </button>

            {/* Reset Demo */}
            <button
              onClick={onResetDemo}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="border-t border-stone-200/70 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-1 py-1.5 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeWealthTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeWealthTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white font-semibold shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center space-x-3 text-xs text-stone-500 font-sans">
            <span className="font-medium text-stone-800">{advisorBook.advisorName}</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500">{advisorBook.totalAUMFormatted} Book AUM</span>
          </div>
        </div>
      </div>
    </header>
  );
};
