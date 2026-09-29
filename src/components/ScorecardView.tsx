import React, { useState } from 'react';
import type { Project, Evaluation } from '../types';
import { Award, AlertCircle, Sparkles, Scale } from 'lucide-react';

interface ScorecardViewProps {
  projects: Project[];
  onAddEvaluation: (projectId: string, evaluation: Evaluation) => void;
  reviewerName?: string;
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({
  projects,
  onAddEvaluation,
  reviewerName = 'Dr. Reviewer'
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  
  // 7 Parameters according to PDR FR-04
  const [problemSeverity, setProblemSeverity] = useState<number>(16);
  const [marketPotential, setMarketPotential] = useState<number>(15);
  const [technicalFeasibility, setTechnicalFeasibility] = useState<number>(12);
  const [differentiation, setDifferentiation] = useState<number>(11);
  const [ipPotential, setIpPotential] = useState<number>(7);
  const [costScalability, setCostScalability] = useState<number>(7);
  const [industryDemand, setIndustryDemand] = useState<number>(8);
  const [notes, setNotes] = useState<string>('');

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const totalScore = 
    Number(problemSeverity) + 
    Number(marketPotential) + 
    Number(technicalFeasibility) + 
    Number(differentiation) + 
    Number(ipPotential) + 
    Number(costScalability) + 
    Number(industryDemand);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    const newEval: Evaluation = {
      id: `eval-${Date.now()}`,
      reviewerName,
      reviewerRole: 'Peer Review Expert',
      date: new Date().toISOString().split('T')[0],
      problemSeverity: Number(problemSeverity),
      marketPotential: Number(marketPotential),
      technicalFeasibility: Number(technicalFeasibility),
      differentiation: Number(differentiation),
      ipPotential: Number(ipPotential),
      costScalability: Number(costScalability),
      industryDemand: Number(industryDemand),
      totalScore,
      notes: notes || 'Screening assessment submitted with calibrated rubric.'
    };

    onAddEvaluation(currentProject.id, newEval);
    setNotes('');
    alert(`Scorecard for "${currentProject.title}" saved! Total: ${totalScore}/100`);
  };

  // Variance detection if 2 or more reviews exist
  const evals = currentProject?.evaluations || [];
  const hasVarianceRisk = evals.length >= 2 && Math.abs(evals[0].totalScore - evals[1].totalScore) > 20;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">7-Parameter Weighted Screening Scorecard</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            PDR FR-04 & FR-05 Engine: Standardized rubric to eliminate exhibition bias and require 2 independent reviewers.
          </p>
        </div>
        
        {/* Project Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Select Innovation:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 w-full"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.institution.split(',')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentProject && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Project Context & Existing Reviews */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Stage: {currentProject.stage} · TRL {currentProject.trl}
              </span>
              <h3 className="text-base font-bold text-white mt-2">{currentProject.title}</h3>
              <p className="text-xs text-slate-300 mt-1 font-medium">{currentProject.institution}</p>
              
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[10px]">Problem Statement:</span>
                  <p className="text-slate-300 mt-0.5">{currentProject.problem}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[10px]">Proposed Solution:</span>
                  <p className="text-slate-300 mt-0.5">{currentProject.solution}</p>
                </div>
              </div>
            </div>

            {/* Existing Reviewer Assessments */}
            <div className="glass-card p-5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  Existing Assessments ({evals.length}/2)
                </h4>
                {hasVarianceRisk && (
                  <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Variance &gt; 20 pts
                  </span>
                )}
              </div>

              {evals.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-3 text-center">
                  No evaluations yet. Be the first reviewer to evaluate this project.
                </p>
              ) : (
                <div className="space-y-3">
                  {evals.map((ev, i) => (
                    <div key={ev.id} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">Reviewer #{i + 1}: {ev.reviewerName}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {ev.totalScore}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 italic">"{ev.notes}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Advisory Pre-Score Card (PDR FR-07) */}
            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 p-4 rounded-xl border border-indigo-500/20">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Advisory Pre-Score (FR-07)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automated heuristic suggests <strong>82/100</strong> based on clear post-harvest TAM and provisional IP. 
                <em className="text-slate-500 block mt-1">Note: Advisory only. Cannot serve as binding stage gate decision.</em>
              </p>
            </div>
          </div>

          {/* Right Column: 7-Parameter Slider Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmitScore} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">Reviewer Evaluation Form</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Total Calculated:</span>
                  <span className={`text-base font-extrabold px-3 py-1 rounded-lg ${
                    totalScore >= 70 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {totalScore} / 100
                  </span>
                </div>
              </div>

              {/* Slider 1: Problem Severity (20) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">1. Problem Severity & Urgency (Max 20)</label>
                  <span className="font-bold text-emerald-400">{problemSeverity} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={problemSeverity}
                  onChange={(e) => setProblemSeverity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Is the problem acute, costly, and currently unresolved in industry?</span>
              </div>

              {/* Slider 2: Market Potential (20) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">2. Market Potential & Addressable TAM (Max 20)</label>
                  <span className="font-bold text-emerald-400">{marketPotential} / 20</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={marketPotential}
                  onChange={(e) => setMarketPotential(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Commercial viability, clear domestic/global target customers.</span>
              </div>

              {/* Slider 3: Technical Feasibility (15) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">3. Technical Feasibility & Physics (Max 15)</label>
                  <span className="font-bold text-emerald-400">{technicalFeasibility} / 15</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={technicalFeasibility}
                  onChange={(e) => setTechnicalFeasibility(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Sound engineering basis, realistic component availability.</span>
              </div>

              {/* Slider 4: Differentiation (15) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">4. Differentiation & Competitive Moat (Max 15)</label>
                  <span className="font-bold text-emerald-400">{differentiation} / 15</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={differentiation}
                  onChange={(e) => setDifferentiation(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Unique architecture vs off-the-shelf Chinese imports or incumbents.</span>
              </div>

              {/* Slider 5: IP Potential (10) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">5. IP Protectability & Novelty (Max 10)</label>
                  <span className="font-bold text-emerald-400">{ipPotential} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={ipPotential}
                  onChange={(e) => setIpPotential(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Patentability of formula, schematic, or unique process claim.</span>
              </div>

              {/* Slider 6: Cost / Scalability (10) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">6. Cost & Manufacturing Scalability (Max 10)</label>
                  <span className="font-bold text-emerald-400">{costScalability} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={costScalability}
                  onChange={(e) => setCostScalability(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Unit economics can scale using existing contract manufacturing.</span>
              </div>

              {/* Slider 7: Industry Demand (10) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">7. Explicit Corporate Demand Alignment (Max 10)</label>
                  <span className="font-bold text-emerald-400">{industryDemand} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={industryDemand}
                  onChange={(e) => setIndustryDemand(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Matches active RFP or corporate buyer statements in platform.</span>
              </div>

              {/* Reviewer Qualitative Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reviewer Notes & Actionable Feedback
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detail test requirements, critical failure modes, or specific buyers to approach..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-emerald-600/20"
              >
                Submit Scorecard ({totalScore} / 100)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
