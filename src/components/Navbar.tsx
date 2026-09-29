import React from 'react';
import type { UserRole } from '../types';
import { GraduationCap, Award, Building2, Layers, LogOut } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projectCount: number;
  userProfile?: { name: string; email: string; organization: string };
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setRole,
  activeTab,
  setActiveTab,
  projectCount,
  userProfile,
  onLogout
}) => {
  // Exclude 'admin' role per user requirement
  const roles: { role: UserRole; label: string; icon: React.ReactNode; badge: string }[] = [
    { role: 'student', label: 'Student / Inventor', icon: <GraduationCap className="w-4 h-4" />, badge: 'Intake & Milestones' },
    { role: 'mentor', label: 'Reviewer / Mentor', icon: <Award className="w-4 h-4" />, badge: '7-Param Scorecard' },
    { role: 'buyer', label: 'Corporate Buyer', icon: <Building2 className="w-4 h-4" />, badge: 'Demand & Pilots' }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight">UnitingTech</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                Test Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {userProfile ? `${userProfile.name} (${userProfile.organization})` : 'University Innovation → Industry Commercialization OS'}
            </p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'pipeline'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pipeline & Gates ({projectCount})
          </button>
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'scorecard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7-Param Scorecard
          </button>
          <button
            onClick={() => setActiveTab('demand')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'demand'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Corporate Demand
          </button>
          <button
            onClick={() => setActiveTab('intake')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'intake'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + New Intake
          </button>
        </nav>

        {/* Role Switcher & Sign Out */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-500 px-1.5 uppercase tracking-wider">Role:</span>
            {roles.map(r => (
              <button
                key={r.role}
                onClick={() => setRole(r.role)}
                title={r.badge}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentRole === r.role
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.icon}
                <span className="hidden sm:inline">{r.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <button
            onClick={onLogout}
            title="Sign out back to login"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
