import React, { useState } from 'react';
import type { Project, UserRole } from '../types';
import { STAGE_CONFIG, evaluateStageGate, getNextStage } from '../utils/stageGates';
import { 
  CheckCircle2, AlertTriangle, ArrowRight, Award, FileText, 
  Activity, LayoutGrid, ListFilter
} from 'lucide-react';

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
  const [activeStageFilter, setActiveStageFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const domains = ['all', ...Array.from(new Set(projects.map(p => p.domain)))];

  const filteredProjects = filterDomain === 'all' 
    ? projects 
    : projects.filter(p => p.domain === filterDomain);

  // Visible stages depending on stage filter
  const visibleStages = activeStageFilter === 'all'
    ? STAGE_CONFIG
    : STAGE_CONFIG.filter(col => col.stage === activeStageFilter);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner / Metrics - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="glass-card p-3 sm:p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Total Innovations</span>
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">{projects.length}</p>
          <span className="text-[10px] sm:text-[11px] text-emerald-400/80 line-clamp-1">Across partner colleges</span>
        </div>

        <div className="glass-card p-3 sm:p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Validations & Pilots</span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">
            {projects.filter(p => p.stage === 'validate' || p.stage === 'pilot').length}
          </p>
          <span className="text-[10px] sm:text-[11px] text-cyan-400/80 line-clamp-1">Corporate buyer engagement</span>
        </div>

        <div className="glass-card p-3 sm:p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Avg Composite</span>
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">
            {Math.round(projects.reduce((acc, p) => acc + p.score, 0) / (projects.length || 1))}/100
          </p>
          <span className="text-[10px] sm:text-[11px] text-amber-400/80 line-clamp-1">7-param scorecard</span>
        </div>

        <div className="glass-card p-3 sm:p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium">IP Agreements</span>
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">
            {projects.filter(p => p.agreement?.isSigned).length}
          </p>
          <span className="text-[10px] sm:text-[11px] text-purple-400/80 line-clamp-1">College policy cleared</span>
        </div>
      </div>

      {/* Filter and Role Notice */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-panel p-3 sm:p-3.5 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs text-slate-400 whitespace-nowrap">Domain:</span>
          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1 sm:flex-initial"
          >
            {domains.map(d => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Domains' : d}
              </option>
            ))}
          </select>

          {/* Mobile view toggle button (Board vs List) */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 xl:hidden">
            <button
              onClick={() => setViewMode('board')}
              title="Swipeable Board View"
              className={`p-1.5 rounded text-xs transition ${
                viewMode === 'board' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="Stage Focus List View"
              className={`p-1.5 rounded text-xs transition ${
                viewMode === 'list' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-2 bg-slate-950/40 p-2 sm:p-0 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
          <span className="leading-tight">
            Acting as <strong className="text-white capitalize">{currentRole}</strong>
            {currentRole === 'mentor' && ' (Authorized to advance Stage Gates)'}
            {currentRole === 'student' && ' (Innovator role: view criteria & complete tasks)'}
            {currentRole === 'buyer' && ' (Corporate Buyer: sponsor pilots & validations)'}
          </span>
        </div>
      </div>

      {/* Horizontal Stage Selector Pills (Specially handy on mobile/tablet) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveStageFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeStageFilter === 'all'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <span>All Stages</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full text-slate-300 font-bold">
            {filteredProjects.length}
          </span>
        </button>

        {STAGE_CONFIG.map(col => {
          const count = filteredProjects.filter(p => p.stage === col.stage).length;
          const isSelected = activeStageFilter === col.stage;
          return (
            <button
              key={col.stage}
              onClick={() => setActiveStageFilter(isSelected ? 'all' : col.stage)}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{col.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                count > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage-Gate Pipeline Board: 
          On Mobile: Smooth horizontal swipeable carousel with snapping in board mode, or stacked in list mode.
          On XL Desktop: Full 7-column simultaneous layout. */}
      <div className={
        viewMode === 'board'
          ? "flex xl:grid xl:grid-cols-7 gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
      }>
        {visibleStages.map(col => {
          const stageProjects = filteredProjects.filter(p => p.stage === col.stage);

          return (
            <div
              key={col.stage}
              className={`bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col transition ${
                viewMode === 'board'
                  ? 'w-[84vw] max-w-[340px] flex-shrink-0 snap-center xl:w-auto xl:max-w-none'
                  : 'w-full'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
                <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${col.stage === 'commercialize' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-400'}`}></span>
                  {col.label}
                </span>
                <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-semibold">
                  {stageProjects.length}
                </span>
              </div>

              {/* Projects List */}
              <div className="space-y-3 flex-1">
                {stageProjects.length === 0 ? (
                  <div className="text-center py-10 text-slate-600 text-xs italic bg-slate-950/20 rounded-xl border border-dashed border-slate-800/50">
                    No innovations in this stage
                  </div>
                ) : (
                  stageProjects.map(project => {
                    const gate = evaluateStageGate(project);
                    const nextStage = getNextStage(project.stage);

                    return (
                      <div
                        key={project.id}
                        onClick={() => onSelectProject(project)}
                        role="button"
                        tabIndex={0}
                        className="glass-card p-3.5 rounded-xl border border-slate-800/90 hover:border-emerald-500/50 active:scale-[0.99] cursor-pointer transition-all duration-200 group flex flex-col justify-between shadow-sm hover:shadow-emerald-500/5"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              TRL {project.trl}
                            </span>
                            <span className="text-xs font-bold text-emerald-300">
                              {project.score > 0 ? `${project.score}/100` : 'Unscored'}
                            </span>
                          </div>

                          <h4 className="text-xs font-semibold text-white group-hover:text-emerald-300 line-clamp-2 leading-snug">
                            {project.title}
                          </h4>

                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                            {project.institution}
                          </p>
                        </div>

                        {/* Gate Status Pill */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col gap-1.5">
                          {gate.canAdvance ? (
                            <div className="flex items-center justify-between text-[11px] text-emerald-400 gap-2">
                              <span className="flex items-center gap-1 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                <span>Gate Met</span>
                              </span>
                              {nextStage && (currentRole === 'mentor' || currentRole === 'student') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAdvanceStage(project.id);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition shadow-sm"
                                >
                                  <span>Advance</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90" title={gate.missingCriteria[0]}>
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                              <span className="truncate text-[10px] sm:text-[11px]">{gate.missingCriteria[0] || 'Criteria Pending'}</span>
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
