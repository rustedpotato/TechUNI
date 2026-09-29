import React, { useState } from 'react';
import type { Project, UserRole, BuyerValidation, Milestone, TestLog } from '../types';
import { evaluateStageGate, getNextStage } from '../utils/stageGates';
import { 
  X, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, 
  Building2, FileText, CheckCircle2, Clock, Plus
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onAdvanceStage: (projectId: string) => void;
  onAddBuyerValidation: (projectId: string, validation: BuyerValidation) => void;
  onSignAgreement: (projectId: string) => void;
  onAddMilestone: (projectId: string, milestone: Milestone) => void;
  onAddTestLog: (projectId: string, log: TestLog) => void;
  currentRole: UserRole;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onAdvanceStage,
  onAddBuyerValidation,
  onSignAgreement,
  onAddMilestone,
  onAddTestLog,
  currentRole
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'validation' | 'agreement' | 'prototyping' | 'pilot'>('overview');
  
  // Validation form state
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [interestLevel, setInterestLevel] = useState<BuyerValidation['interestLevel']>('would_pilot');
  const [notes, setNotes] = useState('');

  // Prototyping forms
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const targetTrl = 6;
  const [testTitle, setTestTitle] = useState('');
  const [testResult, setTestResult] = useState('');

  const gate = evaluateStageGate(project);
  const nextStage = getNextStage(project.stage);

  const handleValidationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;
    const newValidation: BuyerValidation = {
      id: `bv-${Date.now()}`,
      companyName,
      contactPerson,
      date: new Date().toISOString().split('T')[0],
      interestLevel,
      notes
    };
    onAddBuyerValidation(project.id, newValidation);
    setCompanyName('');
    setContactPerson('');
    setNotes('');
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle) return;
    const newM: Milestone = {
      id: `ms-${Date.now()}`,
      title: milestoneTitle,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      targetTrl: Number(targetTrl)
    };
    onAddMilestone(project.id, newM);
    setMilestoneTitle('');
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle) return;
    const newLog: TestLog = {
      id: `tl-${Date.now()}`,
      title: testTitle,
      date: new Date().toISOString().split('T')[0],
      location: 'Partner Lab / Field Setup',
      testerName: 'Lead Investigator & Partner Engineer',
      result: testResult || 'Benchmark successfully passed TRL criteria',
      verifiedTrl: 6
    };
    onAddTestLog(project.id, newLog);
    setTestTitle('');
    setTestResult('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Stage: {project.stage}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                TRL {project.trl}
              </span>
              <span className="text-xs font-bold text-slate-300">
                Score: {project.score > 0 ? `${project.score}/100` : 'Unscored'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{project.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{project.institution} · Lead: {project.leadInventor}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage-Gate Verification Status Bar */}
        <div className={`px-6 py-3 border-b ${gate.canAdvance ? 'bg-emerald-950/30 border-emerald-900/40 text-emerald-300' : 'bg-amber-950/30 border-amber-900/40 text-amber-300'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {gate.canAdvance ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
              <span>
                <strong>{gate.label}:</strong> {gate.canAdvance ? 'All gate criteria satisfied.' : gate.missingCriteria[0]}
              </span>
            </div>

            {gate.canAdvance && nextStage && (
              currentRole === 'admin' ? (
                <button
                  onClick={() => onAdvanceStage(project.id)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow transition self-start sm:self-auto"
                >
                  Promote to {nextStage} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 italic">
                  Switch to Admin role to promote stage
                </span>
              )
            )}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition ${
              activeTab === 'overview' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Problem
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'validation' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Buyer Validations ({project.buyerValidations.length}/2)
          </button>
          <button
            onClick={() => setActiveTab('agreement')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'agreement' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            IP Agreement {project.agreement?.isSigned ? '✓' : ''}
          </button>
          <button
            onClick={() => setActiveTab('prototyping')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'prototyping' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            TRL 6 Milestones ({project.milestones.length})
          </button>
          {project.pilot && (
            <button
              onClick={() => setActiveTab('pilot')}
              className={`py-3 px-4 text-xs font-medium border-b-2 transition ${
                activeTab === 'pilot' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Industry Pilot
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Problem</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{project.problem}</p>
                </div>
                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Proposed Innovation & Architecture</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{project.solution}</p>
                </div>
              </div>

              {/* Tags & IP */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-slate-400 font-medium">Domain Tags:</span>
                {project.tags.map(t => (
                  <span key={t} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Stage-Gate Requirements Checklist */}
              <div className="glass-card p-4 rounded-xl border border-slate-800 mt-4">
                <h4 className="text-xs font-bold text-white mb-3">Stage-Gate Exit Criteria Check</h4>
                <div className="space-y-2">
                  {gate.completedCriteria.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                  {gate.missingCriteria.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-amber-400">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-6">
              <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/20">
                <h4 className="text-xs font-bold text-indigo-300">FR-09 Hard Gate Rule</h4>
                <p className="text-xs text-slate-300 mt-1">
                  A project <strong>cannot advance past the Validate stage</strong> until at least <strong>2 independent corporate buyers</strong> explicitly record an interest level of <code>"would_pilot"</code> or <code>"ready_to_contract"</code>.
                </p>
              </div>

              {/* Validations list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300">Logged Buyer Interviews ({project.buyerValidations.length})</h4>
                {project.buyerValidations.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No buyer conversations recorded yet.</p>
                ) : (
                  project.buyerValidations.map(bv => (
                    <div key={bv.id} className="glass-card p-3 rounded-xl border border-slate-800 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{bv.companyName}</span>
                          <span className="text-[10px] text-slate-400">({bv.contactPerson})</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">"{bv.notes}"</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        bv.interestLevel === 'would_pilot' || bv.interestLevel === 'ready_to_contract'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {bv.interestLevel.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Log new buyer interview form */}
              <form onSubmit={handleValidationSubmit} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  Log Corporate Buyer Conversation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Company Name (e.g., L&T, Tata, Bosch)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Contact Name & Designation"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Buyer Signal:</span>
                  <select
                    value={interestLevel}
                    onChange={(e) => setInterestLevel(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  >
                    <option value="would_pilot">Would Pilot (Counts toward gate!)</option>
                    <option value="ready_to_contract">Ready to Contract (Counts toward gate!)</option>
                    <option value="informational">Informational / Curious only</option>
                    <option value="needs_changes">Needs Architecture Changes</option>
                    <option value="not_interested">Not Interested</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  placeholder="Notes from customer interview, pilot site requirements, or procurement timeline..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                />
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  Record Buyer Conversation
                </button>
              </form>
            </div>
          )}

          {activeTab === 'agreement' && (
            <div className="space-y-5">
              <div className="glass-card p-5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Commercialization & Continuation Terms
                  </h4>
                  {project.agreement?.isSigned ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      E-Signed & Active
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                      Signature Pending (Gate 4 Blocked)
                    </span>
                  )}
                </div>

                {project.agreement ? (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase">Inventor Equity / Royalty</span>
                        <p className="text-base font-bold text-white mt-1">{project.agreement.inventorEquityPct}%</p>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase">Platform Equity / Share</span>
                        <p className="text-base font-bold text-white mt-1">{project.agreement.companyEquityPct}%</p>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase">College Royalty Pool</span>
                        <p className="text-base font-bold text-white mt-1">{project.agreement.collegeRoyaltyPct}%</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <span className="font-semibold text-slate-400 block mb-1">Continuation & Survival Clause:</span>
                      {project.agreement.continuationTerms}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="text-slate-400">Document: {project.agreement.documentName}</span>
                      <span className="text-emerald-400">College IP Policy: Cleared</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-3">
                    <p className="text-xs text-slate-400">
                      Standard Template Agreement ready to generate with contribution-based economics.
                    </p>
                    <button
                      onClick={() => onSignAgreement(project.id)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow transition"
                    >
                      Execute E-Signature & Clear College Waiver
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'prototyping' && (
            <div className="space-y-6">
              <div className="bg-blue-950/20 p-4 rounded-xl border border-blue-500/20 text-xs">
                <span className="font-bold text-blue-300">FR-14 TRL 6 Exit Criterion:</span>
                <p className="text-slate-300 mt-1">
                  Prototyping phase requires demonstrable laboratory or field test logs showing subsystem integration in a relevant operational environment (TRL 6).
                </p>
              </div>

              {/* Milestones list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300">Milestone Roadmap ({project.milestones.length})</h4>
                {project.milestones.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">No sprint milestones added yet.</p>
                ) : (
                  project.milestones.map(m => (
                    <div key={m.id} className="glass-card p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{m.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300">
                            Target TRL {m.targetTrl}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">Due: {m.targetDate}</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-400 capitalize">{m.status}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Add milestone */}
              <form onSubmit={handleMilestoneSubmit} className="glass-panel p-4 rounded-xl border border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="New Sprint Milestone (e.g., Fabricate 2kW thermal storage prototype)..."
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  + Add Milestone
                </button>
              </form>

              {/* Test Logs */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300">Verified Test Logs ({project.testLogs.length})</h4>
                {project.testLogs.map(tl => (
                  <div key={tl.id} className="glass-card p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{tl.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        TRL {tl.verifiedTrl} Confirmed
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic">"{tl.result}"</p>
                    <span className="text-[10px] text-slate-500 block">Tested at: {tl.location} · {tl.date}</span>
                  </div>
                ))}

                {/* Add Test Log Form */}
                <form onSubmit={handleTestSubmit} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-white">Record Laboratory / Field Test</h5>
                  <input
                    type="text"
                    placeholder="Test Name (e.g., 500-cycle high voltage stress test)"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Observed Result & Performance Delta"
                    value={testResult}
                    onChange={(e) => setTestResult(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  />
                  <button
                    type="submit"
                    className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Log Verified Test Result
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'pilot' && project.pilot && (
            <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">Active Industry Pilot</h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 capitalize">
                  {project.pilot.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300"><strong>Host Partner:</strong> {project.pilot.companyName}</p>
              <p className="text-xs text-slate-300"><strong>Scope:</strong> {project.pilot.scope}</p>
              <p className="text-xs text-slate-300"><strong>Success Metrics:</strong> {project.pilot.successMetrics}</p>
              {project.pilot.outcomeNotes && (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-400">
                  <strong className="text-slate-300">Outcome Data:</strong> {project.pilot.outcomeNotes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
