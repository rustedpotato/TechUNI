import React, { useState } from 'react';
import type { UserRole } from '../types';
import { GraduationCap, Award, Building2, ArrowRight, Shield, CheckCircle2, Lock, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole, userProfile: { name: string; email: string; organization: string }) => void;
}

interface RoleOption {
  role: UserRole;
  title: string;
  badge: string;
  description: string;
  defaultOrg: string;
  defaultName: string;
  defaultEmail: string;
  icon: React.ReactNode;
  accentColor: string;
  capabilities: string[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [name, setName] = useState<string>('Aarav Sharma');
  const [email, setEmail] = useState<string>('aarav.sharma@nitt.edu');
  const [organization, setOrganization] = useState<string>('NIT Trichy');

  const roleOptions: RoleOption[] = [
    {
      role: 'student',
      title: 'Student / Inventor',
      badge: 'Innovator Portal',
      description: 'Submit technical innovations, track TRL milestones, log field tests, and clear institutional IP.',
      defaultOrg: 'NIT Trichy',
      defaultName: 'Aarav Sharma',
      defaultEmail: 'aarav.sharma@nitt.edu',
      icon: <GraduationCap className="w-6 h-6 text-emerald-400" />,
      accentColor: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400',
      capabilities: [
        'Submit new inventions & disclosures',
        'Upload verified test logs & proof-of-concept demos',
        'Review stage gates & agreement drafts'
      ]
    },
    {
      role: 'mentor',
      title: 'Reviewer / Technical Mentor',
      badge: 'Evaluation Portal',
      description: 'Evaluate university projects with the 7-parameter weighted rubric and provide expert feedback.',
      defaultOrg: 'Regional Technical Review Board',
      defaultName: 'Dr. R. Venkatraman',
      defaultEmail: 'r.venkat@evaluators.org',
      icon: <Award className="w-6 h-6 text-amber-400" />,
      accentColor: 'border-amber-500/50 bg-amber-950/20 text-amber-400',
      capabilities: [
        'Score projects across all 7 PDR criteria',
        'Detect score variance & validate feasibility',
        'Advance projects through screening stage gates'
      ]
    },
    {
      role: 'buyer',
      title: 'Corporate Industry Partner',
      badge: 'Procurement & Pilot Portal',
      description: 'Post real problem statements, match university solutions via semantic tags, and sponsor pilots.',
      defaultOrg: 'Bosch Mobility India',
      defaultName: 'Vikramaditya Rao',
      defaultEmail: 'vikram.rao@bosch.in',
      icon: <Building2 className="w-6 h-6 text-cyan-400" />,
      accentColor: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400',
      capabilities: [
        'Post corporate problem statements & budget signals',
        'Filter matched technologies by fit percentage',
        'Record buyer validation interviews & pilot agreements'
      ]
    }
  ];

  const handleSelectRole = (r: RoleOption) => {
    setSelectedRole(r.role);
    setName(r.defaultName);
    setEmail(r.defaultEmail);
    setOrganization(r.defaultOrg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole, {
      name: name.trim() || 'Demo User',
      email: email.trim() || 'user@unitingtech.org',
      organization: organization.trim() || 'Partner Organization'
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            Commercialization Platform Access · Test Environment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Sign in to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">UnitingTech</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Choose your persona below to experience role-tailored pipelines, stage gates, scoring rubrics, and buyer matching.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleOptions.map((r) => {
            const isSelected = selectedRole === r.role;
            return (
              <div
                key={r.role}
                onClick={() => handleSelectRole(r)}
                className={`relative rounded-2xl p-5 border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? `${r.accentColor} shadow-xl shadow-black/40 ring-2 ring-emerald-500/40`
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      {r.icon}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60">
                      {r.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5">{r.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{r.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/60">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Key Capabilities:</span>
                  <ul className="space-y-1.5 text-xs">
                    {r.capabilities.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3">
                    <div className={`w-full py-1.5 rounded-lg text-xs font-semibold text-center transition ${
                      isSelected 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'bg-slate-800/80 text-slate-400'
                    }`}>
                      {isSelected ? '✓ Selected' : 'Select Persona'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Credentials / Profile confirmation form */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Confirm Persona Credentials ({selectedRole.toUpperCase()})
              </h3>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-500" /> Test Session Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Institution / Company</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
            <p className="text-xs text-slate-400">
              Entering platform with <strong className="text-emerald-400 capitalize">{selectedRole}</strong> access.
            </p>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
            >
              Enter Dashboard as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
