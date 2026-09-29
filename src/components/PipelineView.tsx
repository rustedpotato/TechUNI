import React, { useState } from 'react';
import type { Project, UserRole } from '../types';
import { STAGE_CONFIG, evaluateStageGate, getNextStage } from '../utils/stageGates';
import { CheckCircle2, AlertTriangle, ArrowRight, Award, FileText, Activity } from 'lucide-react';

interface PipelineViewProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onAdvanceStage: (projectId: string) => void;
  currentRole: UserRole;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  projects,
  onSelectProject,
  onAdvanceStage,
  currentRole
}) => {
  const [filterDomain, setFilterDomain] = useState<string>('all');

  const domains = ['all', ...Array.from(new Set(projects.map(p => p.domain)))];

  const filteredProjects = filterDomain === 'all' 
    ? projects 
    : projects.filter(p => p.domain === filterDomain);

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Innovations</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{projects.length}</p>
          <span className="text-[11px] text-emerald-400/80">Logged across partner colleges</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Validations & Pilots</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {projects.filter(p => p.stage === 'validate' || p.stage === 'pilot').length}
          </p>
          <span className="text-[11px] text-cyan-400/80">Corporate buyer engagement</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Avg Composite Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {Math.round(projects.reduce((acc, p) => acc + p.score, 0) / (projects.length || 1))}/100
          </p>
          <span className="text-[11px] text-amber-400/80">7-parameter scorecard</span>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Signed IP Agreements</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {projects.filter(p => p.agreement?.isSigned).length}
          </p>
          <span className="text-[11px] text-purple-400/80">With college policy check</span>
        </div>
      </div>

      {/* Filter and Role Notice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-3.5 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Domain Filter:</span>
          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {domains.map(d => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Domains' : d}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>
            Acting as <strong className="text-white capitalize">{currentRole}</strong>
            {currentRole === 'admin' ? ' (Can trigger Stage Gate advances if criteria met)' : ''}
          </span>
        </div>
      </div>

      {/* Stage-Gate Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 overflow-x-auto pb-4">
        {STAGE_CONFIG.map(col => {
          const stageProjects = filteredProjects.filter(p => p.stage === col.stage);

          return (
            <div
              key={col.stage}
              className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col min-w-[240px] max-w-[320px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${col.stage === 'commercialize' ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                  {col.label}
                </span>
                <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-medium">
                  {stageProjects.length}
                </span>
              </div>

              {/* Projects List */}
              <div className="space-y-3 flex-1">
                {stageProjects.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 text-xs italic">
                    No projects in this stage
                  </div>
                ) : (
                  stageProjects.map(project => {
                    const gate = evaluateStageGate(project);
                    const nextStage = getNextStage(project.stage);

                    return (
                      <div
                        key={project.id}
                        onClick={() => onSelectProject(project)}
                        className="glass-card p-3 rounded-lg border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              TRL {project.trl}
                            </span>
                            <span className="text-xs font-bold text-emerald-300">
                              {project.score > 0 ? `${project.score}/100` : 'Unscored'}
                            </span>
                          </div>

                          <h4 className="text-xs font-semibold text-white group-hover:text-emerald-300 line-clamp-2 leading-tight">
                            {project.title}
                          </h4>

                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {project.institution}
                          </p>
                        </div>

                        {/* Gate Status Pill */}
                        <div className="mt-3 pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                          {gate.canAdvance ? (
                            <div className="flex items-center justify-between text-[11px] text-emerald-400">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Gate Met
                              </span>
                              {currentRole === 'admin' && nextStage && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAdvanceStage(project.id);
                                  }}
                                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold flex items-center gap-1 transition"
                                >
                                  Advance <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[11px] text-amber-400/90" title={gate.missingCriteria[0]}>
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                              <span className="truncate">{gate.missingCriteria[0] || 'Criteria Pending'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
