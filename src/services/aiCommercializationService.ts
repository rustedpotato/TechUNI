import OpenAI from 'openai';
import type { Project, Evaluation, AiCommercializationInsight } from '../types';

export const getStoredApiKey = (): string => {
  return localStorage.getItem('unitech_openai_api_key') || 
         (import.meta.env.VITE_OPENAI_API_KEY as string) || '';
};

export const setStoredApiKey = (key: string): void => {
  if (key.trim()) {
    localStorage.setItem('unitech_openai_api_key', key.trim());
  } else {
    localStorage.removeItem('unitech_openai_api_key');
  }
};

export interface AiEvaluationResult {
  evaluation: Evaluation;
  keyStrengths: string[];
  criticalRisks: string[];
  recommendedActions: string[];
  executiveSummary: string;
  isSimulated: boolean;
}

// Fallback intelligent heuristic generator when API key is not present or offline
function generateHeuristicEvaluation(project: Project): AiEvaluationResult {
  const trlFactor = Math.min(project.trl / 9, 1);
  const hasIp = project.ipDisclosure !== 'none';
  const hasValidations = project.buyerValidations.length > 0;

  const problemSeverity = Math.min(20, Math.round(14 + Math.random() * 5));
  const marketPotential = Math.min(20, Math.round(13 + Math.random() * 6));
  const technicalFeasibility = Math.min(15, Math.round(9 + trlFactor * 5));
  const differentiation = Math.min(15, Math.round(10 + Math.random() * 4));
  const ipPotential = Math.min(10, hasIp ? 8 + Math.round(Math.random() * 2) : 5);
  const costScalability = Math.min(10, Math.round(6 + trlFactor * 3));
  const industryDemand = Math.min(10, hasValidations ? 8 + Math.round(Math.random() * 2) : 6);

  const totalScore = 
    problemSeverity + 
    marketPotential + 
    technicalFeasibility + 
    differentiation + 
    ipPotential + 
    costScalability + 
    industryDemand;

  return {
    evaluation: {
      id: `ai-eval-${Date.now()}`,
      reviewerName: 'OpenAI Advisory Engine (PDR FR-07)',
      reviewerRole: 'Automated Commercialization Copilot',
      date: new Date().toISOString().split('T')[0],
      isAiAdvisory: true,
      problemSeverity,
      marketPotential,
      technicalFeasibility,
      differentiation,
      ipPotential,
      costScalability,
      industryDemand,
      totalScore,
      notes: `AI Evaluation for "${project.title}": High market alignment in ${project.domain}. Current TRL ${project.trl} indicates viable functional feasibility. Recommended to accelerate pilot agreements and secure formal IP assignments.`
    },
    keyStrengths: [
      `Strong domain positioning in ${project.domain}`,
      `Current TRL ${project.trl} provides an actionable prototype foundation`,
      hasIp ? `IP is actively protected (${project.ipDisclosure.replace('_', ' ')})` : 'Distinct architecture suitable for defensive patenting'
    ],
    criticalRisks: [
      `Need unit-level BOM cost validation under high-volume fabrication`,
      `Dependency on formal pilot validation data from enterprise stakeholders`
    ],
    recommendedActions: [
      `Engage at least 2 prospective buyers with targeted pilot scope proposals`,
      `Conduct accelerated environmental & operational stress testing to achieve TRL 6+`
    ],
    executiveSummary: `The innovation demonstrates high relevance to ${project.domain} industry pain points with a calculated advisory score of ${totalScore}/100.`,
    isSimulated: true
  };
}

function generateHeuristicInsights(project: Project): AiCommercializationInsight {
  return {
    executivePitch: `${project.title} addresses an urgent bottleneck in ${project.domain}: ${project.problem} By leveraging ${project.solution}, the innovation cuts operational overhead, speeds deployment, and delivers proven market advantages with demonstrable TRL ${project.trl} validation.`,
    targetBuyers: [
      {
        sector: `${project.domain} Enterprise Operators`,
        targetRole: 'VP of Technology / Innovation Director',
        valueHook: 'Immediate reduction in recurring operational losses and faster compliance.'
      },
      {
        sector: 'Regional Integrators & Distribution Partners',
        targetRole: 'Head of Strategic Procurement',
        valueHook: 'High-margin value-add offering with clear installation parameters.'
      }
    ],
    pilotFramework: {
      duration: '6 to 8 Weeks',
      primaryMetric: '30% improvement in baseline throughput or cost efficiency',
      recommendedScope: 'Controlled real-world deployment across 2 field locations with continuous telemetry logging.'
    },
    licensingStrategy: project.ipDisclosure === 'none' 
      ? 'File provisional patent immediately before commercial demonstrations, followed by exclusive field-of-use licensing.'
      : 'Exclusive enterprise license with 8-12% royalty on net sales or sponsored university spinout.',
    trlAdvancementPlan: [
      `Formulate comprehensive Failure Mode and Effects Analysis (FMEA) for TRL ${project.trl + 1}`,
      'Implement real-time sensor monitoring and independent verification logs',
      'Secure signed LOI from enterprise buyer committing to paid pilot trial'
    ],
    generatedAt: new Date().toISOString()
  };
}

export async function analyzeProjectWithAi(
  project: Project,
  customApiKey?: string
): Promise<AiEvaluationResult> {
  const apiKey = customApiKey || getStoredApiKey();

  if (!apiKey) {
    // Return heuristic response with slight simulated async delay
    await new Promise(r => setTimeout(r, 600));
    return generateHeuristicEvaluation(project);
  }

  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    const prompt = `
You are an expert Technology Commercialization and Venture Evaluator for university deep-tech innovations following the PDR 7-parameter rubric:
1. Problem Severity (0-20)
2. Market Potential & TAM (0-20)
3. Technical Feasibility (0-15)
4. Differentiation & Competitive Moat (0-15)
5. IP Protectability & Novelty (0-10)
6. Cost & Manufacturing Scalability (0-10)
7. Industry & Corporate Demand Alignment (0-10)

Analyze this innovation:
Title: ${project.title}
Domain: ${project.domain}
Institution: ${project.institution}
Current TRL: ${project.trl} (Scale 1-9)
Problem: ${project.problem}
Solution: ${project.solution}
IP Status: ${project.ipDisclosure}
Tags: ${project.tags.join(', ')}

Return ONLY a valid JSON object with the following structure:
{
  "problemSeverity": number,
  "marketPotential": number,
  "technicalFeasibility": number,
  "differentiation": number,
  "ipPotential": number,
  "costScalability": number,
  "industryDemand": number,
  "notes": string,
  "keyStrengths": string[],
  "criticalRisks": string[],
  "recommendedActions": string[],
  "executiveSummary": string
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You evaluate university technologies for commercialization potential. Return valid JSON only.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(content);
    const totalScore = 
      Number(parsed.problemSeverity || 15) +
      Number(parsed.marketPotential || 15) +
      Number(parsed.technicalFeasibility || 10) +
      Number(parsed.differentiation || 10) +
      Number(parsed.ipPotential || 7) +
      Number(parsed.costScalability || 7) +
      Number(parsed.industryDemand || 7);

    return {
      evaluation: {
        id: `ai-eval-${Date.now()}`,
        reviewerName: 'OpenAI Commercialization Copilot',
        reviewerRole: 'AI Model (gpt-4o-mini)',
        date: new Date().toISOString().split('T')[0],
        isAiAdvisory: true,
        problemSeverity: Number(parsed.problemSeverity || 15),
        marketPotential: Number(parsed.marketPotential || 15),
        technicalFeasibility: Number(parsed.technicalFeasibility || 10),
        differentiation: Number(parsed.differentiation || 10),
        ipPotential: Number(parsed.ipPotential || 7),
        costScalability: Number(parsed.costScalability || 7),
        industryDemand: Number(parsed.industryDemand || 7),
        totalScore,
        notes: parsed.notes || parsed.executiveSummary || 'AI evaluation complete.'
      },
      keyStrengths: parsed.keyStrengths || [],
      criticalRisks: parsed.criticalRisks || [],
      recommendedActions: parsed.recommendedActions || [],
      executiveSummary: parsed.executiveSummary || '',
      isSimulated: false
    };
  } catch (err) {
    console.warn('OpenAI API call failed or encountered error, falling back to heuristic engine:', err);
    return generateHeuristicEvaluation(project);
  }
}

export async function generateCommercializationStrategyWithAi(
  project: Project,
  customApiKey?: string
): Promise<AiCommercializationInsight> {
  const apiKey = customApiKey || getStoredApiKey();

  if (!apiKey) {
    await new Promise(r => setTimeout(r, 600));
    return generateHeuristicInsights(project);
  }

  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    const prompt = `
You are an expert commercialization director turning academic technology into licensed market solutions.
Analyze this innovation:
Title: ${project.title}
Domain: ${project.domain}
Current TRL: ${project.trl}
Problem: ${project.problem}
Solution: ${project.solution}
IP Status: ${project.ipDisclosure}

Provide a commercialization strategy. Return ONLY a valid JSON object matching this schema:
{
  "executivePitch": string,
  "targetBuyers": [
    {
      "sector": string,
      "targetRole": string,
      "valueHook": string
    }
  ],
  "pilotFramework": {
    "duration": string,
    "primaryMetric": string,
    "recommendedScope": string
  },
  "licensingStrategy": string,
  "trlAdvancementPlan": string[]
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You generate commercialization insights, buyer matching hooks, and pilot plans. Output strict JSON.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(content);
    return {
      executivePitch: parsed.executivePitch || '',
      targetBuyers: parsed.targetBuyers || [],
      pilotFramework: parsed.pilotFramework || {
        duration: '6 Weeks',
        primaryMetric: 'Efficiency increase',
        recommendedScope: 'Initial cohort test'
      },
      licensingStrategy: parsed.licensingStrategy || '',
      trlAdvancementPlan: parsed.trlAdvancementPlan || [],
      generatedAt: new Date().toISOString()
    };
  } catch (err) {
    console.warn('OpenAI API call failed, falling back to heuristic insights:', err);
    return generateHeuristicInsights(project);
  }
}
