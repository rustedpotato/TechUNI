import React, { useState } from 'react';
import type { Project, CompanyDemand } from '../types';
import { Building2, Sparkles, Plus, ArrowUpRight } from 'lucide-react';

interface DemandMatchingViewProps {
  demands: CompanyDemand[];
  projects: Project[];
  onAddDemand: (demand: CompanyDemand) => void;
  onSelectProject: (p: Project) => void;
}

export const DemandMatchingView: React.FC<DemandMatchingViewProps> = ({
  demands,
  projects,
  onAddDemand,
  onSelectProject
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDemandId, setSelectedDemandId] = useState<string>(demands[0]?.id || '');
  
  // New demand form state
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [budgetSignal, setBudgetSignal] = useState('');

  const currentDemand = demands.find(d => d.id === selectedDemandId) || demands[0];

  // Semantic / Tag-based matching calculation (PDR FR-17)
  const getMatchingProjects = (demand: CompanyDemand) => {
    return projects.map(proj => {
      // Calculate overlap between demand tags and project tags / text
      const matchingTags = proj.tags.filter(t => 
        demand.tags.some(dt => dt.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(dt.toLowerCase()))
      );

      // Check keyword similarity in title & problem
      const demandKeywords = demand.title.toLowerCase().split(' ').concat(demand.tags);
      let textMatchScore = 0;
      demandKeywords.forEach(kw => {
        if (kw.length > 3) {
          if (proj.title.toLowerCase().includes(kw)) textMatchScore += 15;
          if (proj.problem.toLowerCase().includes(kw)) textMatchScore += 10;
        }
      });

      const tagScore = matchingTags.length * 25;
      const matchScore = Math.min(98, Math.max(35, tagScore + textMatchScore));

      return {
        project: proj,
        matchScore,
        matchingTags
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const matchedResults = currentDemand ? getMatchingProjects(currentDemand) : [];

  const handleCreateDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName) return;

    const newDemand: CompanyDemand = {
      id: `dem-${Date.now()}`,
      companyName,
      sector: sector || 'Industry Partner',
      title,
      description,
      tags: tagsStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      budgetSignal: budgetSignal || 'Pilot funding available upon technical milestone review',
      targetDeliveryMonths: 6
    };

    onAddDemand(newDemand);
    setSelectedDemandId(newDemand.id);
    setShowAddModal(false);
    setTitle('');
    setCompanyName('');
    setDescription('');
    setTagsStr('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Demand-First Problem Matching Engine</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            PDR FR-17 & Section 5.2 Principle: Match real corporate buyer problem statements with university innovations using semantic tag similarity.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition"
        >
          <Plus className="w-4 h-4" />
          + Post Corporate Problem Statement
        </button>
      </div>

      {/* Main Grid: Problem Statements List + Matched Solutions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Demands List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Active Corporate Problem Statements ({demands.length})
          </h3>

          <div className="space-y-3">
            {demands.map(demand => {
              const isSelected = demand.id === currentDemand?.id;
              return (
                <div
                  key={demand.id}
                  onClick={() => setSelectedDemandId(demand.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                      : 'glass-card border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">{demand.companyName}</span>
                    <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full border border-slate-800">
                      {demand.sector}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-2">{demand.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{demand.description}</p>
                  
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400/90 font-medium">{demand.budgetSignal}</span>
                    <span className="text-slate-500">{demand.targetDeliveryMonths} mo window</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Matched University Innovations */}
        <div className="lg:col-span-7 space-y-4">
          {currentDemand && (
            <>
              <div className="glass-panel p-5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Targeted Matching For:</span>
                <h3 className="text-sm font-bold text-white mt-1">{currentDemand.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentDemand.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Matched University Projects (Ranked by Relevance)
                  </h4>
                  <span className="text-xs text-slate-500">{matchedResults.length} potential matches</span>
                </div>

                {matchedResults.map(({ project, matchScore, matchingTags }) => (
                  <div
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="glass-card p-4 rounded-xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                          {project.stage} · TRL {project.trl}
                        </span>
                        <span className="text-xs text-slate-400">{project.institution}</span>
                      </div>
                      <h5 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                        {project.title}
                      </h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {matchingTags.map(mt => (
                          <span key={mt} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-medium">
                            ✓ {mt}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-400">{matchScore}%</span>
                        <span className="text-[10px] text-slate-500 block">Fit Index</span>
                      </div>
                      <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Demand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateDemand} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Post New Corporate Problem Statement</h3>
            <div>
              <label className="text-xs text-slate-400">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Bosch India Mobility"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Sector / Industry</label>
              <input
                type="text"
                placeholder="e.g. Electric Vehicles / Sensor Systems"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Problem Statement Title</label>
              <input
                type="text"
                placeholder="e.g. Lightweight Thermally Conductive Composites for Battery Enclosures"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Detailed Technical Requirements</label>
              <textarea
                rows={3}
                placeholder="Target thermal conductivity > 2.5 W/m-K, density < 1.4 g/cm3..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Domain Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="battery, thermal, composites, hardware"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Budget / Commercial Incentive Signal</label>
              <input
                type="text"
                placeholder="e.g. INR 10-20 Lakhs pilot with OEM purchase guarantee"
                value={budgetSignal}
                onChange={(e) => setBudgetSignal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white mt-1"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                Publish Statement
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
