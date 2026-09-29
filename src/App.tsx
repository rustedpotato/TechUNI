import React, { useState } from 'react';
import type { Project, UserRole, Evaluation, BuyerValidation, Milestone, TestLog, CompanyDemand } from './types';
import { INITIAL_PROJECTS, INITIAL_DEMANDS } from './data/mockData';
import { getNextStage, evaluateStageGate } from './utils/stageGates';
import { Navbar } from './components/Navbar';
import { PipelineView } from './components/PipelineView';
import { ScorecardView } from './components/ScorecardView';
import { DemandMatchingView } from './components/DemandMatchingView';
import { IntakeForm } from './components/IntakeForm';
import { ProjectDetailModal } from './components/ProjectDetailModal';

export const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [demands, setDemands] = useState<CompanyDemand[]>(INITIAL_DEMANDS);
  const [currentRole, setRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('pipeline');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Stage gate advance handler
  const handleAdvanceStage = (projectId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      const gate = evaluateStageGate(proj);
      if (!gate.canAdvance) {
        alert(`Cannot advance: ${gate.missingCriteria[0]}`);
        return proj;
      }
      const next = getNextStage(proj.stage);
      if (!next) return proj;

      // Update TRL level based on stage progression
      let newTrl = proj.trl;
      if (next === 'prototype' && newTrl < 5) newTrl = 5;
      if (next === 'pilot' && newTrl < 6) newTrl = 6;
      if (next === 'commercialize' && newTrl < 7) newTrl = 7;

      return {
        ...proj,
        stage: next,
        trl: newTrl
      };
    }));

    if (selectedProject?.id === projectId) {
      const updated = projects.find(p => p.id === projectId);
      if (updated) {
        const next = getNextStage(updated.stage);
        if (next) setSelectedProject({ ...updated, stage: next });
      }
    }
  };

  // Add evaluation handler (7-param scorecard)
  const handleAddEvaluation = (projectId: string, evaluation: Evaluation) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      const updatedEvals = [...proj.evaluations, evaluation];
      const avgScore = Math.round(updatedEvals.reduce((acc, e) => acc + e.totalScore, 0) / updatedEvals.length);
      return {
        ...proj,
        evaluations: updatedEvals,
        score: avgScore
      };
    }));
  };

  // Add buyer validation interview
  const handleAddBuyerValidation = (projectId: string, validation: BuyerValidation) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        buyerValidations: [...proj.buyerValidations, validation]
      };
    }));
  };

  // E-sign agreement
  const handleSignAgreement = (projectId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        agreement: {
          id: `agr-${Date.now()}`,
          signedDate: new Date().toISOString().split('T')[0],
          isSigned: true,
          collegeCleared: true,
          inventorEquityPct: 65,
          companyEquityPct: 25,
          collegeRoyaltyPct: 10,
          continuationTerms: 'Standard commercialization agreement with college IP clearance and student graduation survival clauses.',
          documentName: `Executed_Commercial_License_${proj.id}.pdf`
        }
      };
    }));
  };

  // Add milestone
  const handleAddMilestone = (projectId: string, milestone: Milestone) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        milestones: [...proj.milestones, milestone]
      };
    }));
  };

  // Add test log
  const handleAddTestLog = (projectId: string, testLog: TestLog) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      return {
        ...proj,
        testLogs: [...proj.testLogs, testLog],
        trl: Math.max(proj.trl, testLog.verifiedTrl)
      };
    }));
  };

  // Add project intake
  const handleAddProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setActiveTab('pipeline');
  };

  // Add demand
  const handleAddDemand = (newDemand: CompanyDemand) => {
    setDemands(prev => [newDemand, ...prev]);
  };

  const currentModalProject = selectedProject 
    ? projects.find(p => p.id === selectedProject.id) || selectedProject 
    : null;

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col font-sans">
      <Navbar
        currentRole={currentRole}
        setRole={setRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectCount={projects.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'pipeline' && (
          <PipelineView
            projects={projects}
            onSelectProject={(p) => setSelectedProject(p)}
            onAdvanceStage={handleAdvanceStage}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'scorecard' && (
          <ScorecardView
            projects={projects}
            onAddEvaluation={handleAddEvaluation}
            reviewerName={currentRole === 'mentor' ? 'Senior Technical Reviewer' : 'Admin Evaluator'}
          />
        )}

        {activeTab === 'demand' && (
          <DemandMatchingView
            demands={demands}
            projects={projects}
            onAddDemand={handleAddDemand}
            onSelectProject={(p) => {
              setSelectedProject(p);
            }}
          />
        )}

        {activeTab === 'intake' && (
          <IntakeForm
            onAddProject={handleAddProject}
            existingProjects={projects}
          />
        )}
      </main>

      {/* Project Detail & Stage-Gate Inspection Modal */}
      {currentModalProject && (
        <ProjectDetailModal
          project={currentModalProject}
          onClose={() => setSelectedProject(null)}
          onAdvanceStage={handleAdvanceStage}
          onAddBuyerValidation={handleAddBuyerValidation}
          onSignAgreement={handleSignAgreement}
          onAddMilestone={handleAddMilestone}
          onAddTestLog={handleAddTestLog}
          currentRole={currentRole}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        Commercialization Pipeline Platform · Operationalizing PDR 1 & PDR 2 · Turn University Projects into Market-Ready Technologies
      </footer>
    </div>
  );
};

export default App;
