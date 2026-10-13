import React, { useState } from 'react';
import { Sparkles, Key, CheckCircle, X, ShieldAlert, Cpu } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/aiCommercializationService';

interface AiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiConfigModal: React.FC<AiConfigModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    setTestStatus(null);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestStatus({
        success: false,
        message: 'Please enter an OpenAI API key first.'
      });
      return;
    }

    setIsTesting(true);
    setTestStatus(null);

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`
        }
      });

      if (response.ok) {
        setTestStatus({
          success: true,
          message: 'Connection verified successfully! OpenAI API is active.'
        });
        setStoredApiKey(apiKey.trim());
      } else {
        const errorData = await response.json().catch(() => ({}));
        setTestStatus({
          success: false,
          message: errorData.error?.message || `HTTP ${response.status}: Failed to authenticate with OpenAI.`
        });
      }
    } catch (err: unknown) {
      setTestStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Network error testing OpenAI connection.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Copilot & OpenAI Settings</h3>
              <p className="text-[11px] text-slate-400">Configure GPT-4o powered commercialization scoring & pitch generator</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Zero-Setup Fallback Enabled</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If an OpenAI API key is not supplied, the platform automatically utilizes high-fidelity 
              commercialization heuristics calibrated to the 7-parameter PDR rubric (FR-07).
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
            <p className="text-[10px] text-slate-500">
              Stored locally in your browser session (<code className="text-slate-400">localStorage</code>). Never sent to external third parties.
            </p>
          </div>

          {testStatus && (
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              testStatus.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {testStatus.success ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />}
              <span>{testStatus.message}</span>
            </div>
          )}

          {isSaved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              API Key saved successfully!
            </div>
          )}

          <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isTesting ? 'Verifying...' : 'Test Connection'}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-emerald-600/20"
            >
              Save Key
            </button>
            {apiKey && (
              <button
                onClick={handleClear}
                className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
