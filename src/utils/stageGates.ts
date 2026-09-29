import type { Project, StageType } from '../types';

export interface StageGateStatus {
  stage: StageType;
  label: string;
  canAdvance: boolean;
  missingCriteria: string[];
  completedCriteria: string[];
}

export const STAGE_CONFIG: { stage: StageType; label: string; order: number; color: string }[] = [
  { stage: 'discover', label: '1. Discover', order: 1, color: 'bg-slate-700 text-slate-200' },
  { stage: 'screen', label: '2. Screen', order: 2, color: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/50' },
  { stage: 'validate', label: '3. Validate', order: 3, color: 'bg-amber-900/60 text-amber-300 border-amber-700/50' },
  { stage: 'agree', label: '4. Agreement', order: 4, color: 'bg-purple-900/60 text-purple-300 border-purple-700/50' },
  { stage: 'prototype', label: '5. Prototype (TRL 6)', order: 5, color: 'bg-blue-900/60 text-blue-300 border-blue-700/50' },
  { stage: 'pilot', label: '6. Pilot', order: 6, color: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/50' },
  { stage: 'commercialize', label: '7. Deal & Scale', order: 7, color: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50' },
];

export function evaluateStageGate(project: Project): StageGateStatus {
  const currentStage = project.stage;

  switch (currentStage) {
    case 'discover': {
      const hasDetails = Boolean(project.title && project.summary && project.institution);
      const isEligible = project.ipDisclosure !== undefined;
      return {
        stage: 'discover',
        label: 'Discover Gate',
        canAdvance: hasDetails && isEligible,
        completedCriteria: [
          hasDetails ? 'Intake profile and technical problem logged' : '',
          isEligible ? 'IP disclosure status confirmed' : ''
        ].filter(Boolean),
        missingCriteria: [
          !hasDetails ? 'Incomplete project description or institution' : '',
          !isEligible ? 'IP disclosure policy check missing' : ''
        ].filter(Boolean)
      };
    }

    case 'screen': {
      const evalCount = project.evaluations.length;
      const hasTwoReviews = evalCount >= 2;
      const avgScore = evalCount > 0 
        ? Math.round(project.evaluations.reduce((acc, e) => acc + e.totalScore, 0) / evalCount) 
        : 0;
      const scoreAboveCutoff = avgScore >= 70;

      // Variance check (PDR FR-05: flags scores that differ by more than 20 points)
      let scoreVarianceClean = true;
      if (evalCount >= 2) {
        const diff = Math.abs(project.evaluations[0].totalScore - project.evaluations[1].totalScore);
        scoreVarianceClean = diff <= 20;
      }

      const canAdvance = hasTwoReviews && scoreAboveCutoff && scoreVarianceClean;

      const completedCriteria: string[] = [];
      const missingCriteria: string[] = [];

      if (hasTwoReviews) completedCriteria.push(`2 independent reviews completed (${evalCount})`);
      else missingCriteria.push(`Requires 2 reviewer evaluations (Current: ${evalCount})`);

      if (scoreAboveCutoff) completedCriteria.push(`Average score ${avgScore}/100 exceeds cutoff (70)`);
      else missingCriteria.push(`Average score (${avgScore}/100) below cutoff threshold of 70`);

      if (!scoreVarianceClean) missingCriteria.push('Reviewer variance exceeds 20 points! Requires admin calibration');
      else if (hasTwoReviews) completedCriteria.push('Reviewer score variance is within normal tolerance (≤20 pts)');

      return {
        stage: 'screen',
        label: 'Screening Gate',
        canAdvance,
        completedCriteria,
        missingCriteria
      };
    }

    case 'validate': {
      // PDR FR-09: Gate rule: project cannot advance until at least 2 buyers record "would pilot"
      const pilotWillingBuyers = project.buyerValidations.filter(
        b => b.interestLevel === 'would_pilot' || b.interestLevel === 'ready_to_contract'
      );
      const hasTwoBuyers = pilotWillingBuyers.length >= 2;

      return {
        stage: 'validate',
        label: 'Validation Gate',
        canAdvance: hasTwoBuyers,
        completedCriteria: [
          hasTwoBuyers ? `${pilotWillingBuyers.length} corporate buyers recorded "Would Pilot" / "Ready to Contract"` : ''
        ].filter(Boolean),
        missingCriteria: [
          !hasTwoBuyers ? `Hard Gate: Requires at least 2 corporate buyers to record "Would Pilot" (Current: ${pilotWillingBuyers.length}/2)` : ''
        ].filter(Boolean)
      };
    }

    case 'agree': {
      // PDR FR-12: Hard gate: no Prototype stage without a signed agreement
      const isSigned = Boolean(project.agreement?.isSigned);
      const isCollegeCleared = Boolean(project.agreement?.collegeCleared);
      const canAdvance = isSigned && isCollegeCleared;

      return {
        stage: 'agree',
        label: 'Agreement Gate',
        canAdvance,
        completedCriteria: [
          isSigned ? 'Inventor Commercialization Agreement executed with e-signature' : '',
          isCollegeCleared ? 'College institutional IP ownership and continuation policy checked' : ''
        ].filter(Boolean),
        missingCriteria: [
          !isSigned ? 'Hard Gate: E-signed inventor agreement required before prototyping spend' : '',
          !isCollegeCleared ? 'College institution IP waiver / policy check pending' : ''
        ].filter(Boolean)
      };
    }

    case 'prototype': {
      // PDR FR-14: TRL 6 is the exit criterion for Prototype
      const trl6Reached = project.trl >= 6;
      const hasTestLog = project.testLogs.length > 0;
      const canAdvance = trl6Reached && hasTestLog;

      return {
        stage: 'prototype',
        label: 'Prototype TRL 6 Gate',
        canAdvance,
        completedCriteria: [
          trl6Reached ? `TRL level ${project.trl} meets or exceeds exit criterion (TRL 6)` : '',
          hasTestLog ? `${project.testLogs.length} verified laboratory/field test log(s) recorded` : ''
        ].filter(Boolean),
        missingCriteria: [
          !trl6Reached ? `Exit requirement: TRL 6 demonstration in relevant environment (Current: TRL ${project.trl})` : '',
          !hasTestLog ? 'At least 1 formal test log with environment & result required' : ''
        ].filter(Boolean)
      };
    }

    case 'pilot': {
      const pilotComplete = project.pilot?.status === 'completed_successful';
      const canAdvance = pilotComplete;

      return {
        stage: 'pilot',
        label: 'Pilot Exit Gate',
        canAdvance,
        completedCriteria: [
          pilotComplete ? 'Industry pilot completed successfully with documented performance metrics' : ''
        ].filter(Boolean),
        missingCriteria: [
          !pilotComplete ? 'Corporate pilot must be marked "completed_successful" with outcome metrics' : ''
        ].filter(Boolean)
      };
    }

    case 'commercialize': {
      const hasDeal = Boolean(project.deal);
      return {
        stage: 'commercialize',
        label: 'Commercialization Closed',
        canAdvance: false, // terminal positive stage
        completedCriteria: [
          hasDeal ? `Commercial deal executed: ${project.deal?.type} with ${project.deal?.companyName} (INR ${(project.deal?.valueInr || 0).toLocaleString()})` : 'Active commercial deployment'
        ],
        missingCriteria: []
      };
    }
  }
}

export function getNextStage(current: StageType): StageType | null {
  const order: StageType[] = ['discover', 'screen', 'validate', 'agree', 'prototype', 'pilot', 'commercialize'];
  const idx = order.indexOf(current);
  if (idx >= 0 && idx < order.length - 1) {
    return order[idx + 1];
  }
  return null;
}
