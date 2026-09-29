import React, { useState } from 'react';
import type { Project } from '../types';
import { Send, Shield, CheckCircle, Info } from 'lucide-react';

interface IntakeFormProps {
  onAddProject: (project: Project) => void;
  existingProjects: Project[];
}

export const IntakeForm: React.FC<IntakeFormProps> = ({
  onAddProject,
  existingProjects
}) => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Agritech & Food Tech');
  const [institution, setInstitution] = useState('');
  const [leadInventor, setLeadInventor] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [ipDisclosure, setIpDisclosure] = useState<Project['ipDisclosure']>('provisional_filed');
  const [tagsStr, setTagsStr] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Duplicate detection logic (PDR FR-03: title, team and institution)
  const isDuplicate = existingProjects.some(p => 
    p.title.trim().toLowerCase() === title.trim().toLowerCase() ||
    (p.institution.trim().toLowerCase() === institution.trim().toLowerCase() && 
     p.leadInventor.trim().toLowerCase() === leadInventor.trim().toLowerCase() &&
     leadInventor.trim().length > 3)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !institution || !leadInventor) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title,
      domain,
      institution,
      leadInventor,
      leadEmail: leadEmail || 'inventor@university.edu',
      stage: 'discover',
      trl: 3,
      score: 0,
      summary: title,
      problem,
      solution,
      demoUrl,
      ipDisclosure,
      tags: tagsStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      createdDate: new Date().toISOString().split('T')[0],
      evaluations: [],
      buyerValidations: [],
      milestones: [],
      testLogs: []
    };

    onAddProject(newProject);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto glass-panel p-8 rounded-2xl border border-emerald-500/30 text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Innovation Logged Successfully!</h3>
        <p className="text-xs text-slate-300">
          Your project has been registered in the <strong>Discover stage</strong> and queued for deduplication checks and dual-expert screening.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setTitle('');
            setInstitution('');
            setLeadInventor('');
            setProblem('');
            setSolution('');
            setTagsStr('');
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
        >
          Submit Another Innovation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-emerald-400" />
          University Project Intake Wizard (FR-01)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Designed for student & faculty inventors. Fast submission under 10 minutes with India DPDP Act consent and automated duplicate detection.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        {isDuplicate && (
          <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>Warning: An innovation with a matching title or team/institution already exists in the registry.</span>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-300">Innovation Title</label>
          <input
            type="text"
            placeholder="e.g. Ultrasonic cavitation reactor for bio-diesel synthesis"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Technology Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Agritech & Thermal Systems">Agritech & Thermal Systems</option>
              <option value="Industrial IoT & Rail Tech">Industrial IoT & Rail Tech</option>
              <option value="Sustainable Materials & Textiles">Sustainable Materials & Textiles</option>
              <option value="Clean Energy & Storage">Clean Energy & Storage</option>
              <option value="MedTech & Diagnostics">MedTech & Diagnostics</option>
              <option value="Robotics & Automation">Robotics & Automation</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">College / Institution</label>
            <input
              type="text"
              placeholder="e.g. NIT Trichy, IIT Madras, PSG Tech"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Lead Inventor / Team Members</label>
            <input
              type="text"
              placeholder="e.g. Rahul Verma & Priya Sen"
              value={leadInventor}
              onChange={(e) => setLeadInventor(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Contact Email</label>
            <input
              type="email"
              placeholder="lead.inventor@university.edu"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">The Real-World Industry Problem Solved</label>
          <textarea
            rows={2}
            placeholder="Quantify the acute pain point (e.g. 35% crop spoilage, 12-hour machine downtime)..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Your Engineering Solution & Architecture</label>
          <textarea
            rows={2}
            placeholder="Explain how your subsystem or prototype works, key specifications, and materials..."
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">IP Disclosure Status</label>
            <select
              value={ipDisclosure}
              onChange={(e) => setIpDisclosure(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="none">No IP Filed Yet</option>
              <option value="provisional_filed">Provisional Patent Filed</option>
              <option value="college_disclosed">Disclosed to College TTO</option>
              <option value="patented">Complete Patent Granted</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Video / Demo Link (Optional)</label>
            <input
              type="url"
              placeholder="https://youtu.be/... or Google Drive link"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Keywords & Tags (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g. iot, solar, predictive-maintenance, hardware"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white mt-1 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            By submitting, you consent to technology assessment under India's Digital Personal Data Protection (DPDP) Act. All project information is kept confidential and only shared with corporate buyers upon mutual opt-in.
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
        >
          Submit Innovation for Screening
        </button>
      </form>
    </div>
  );
};
