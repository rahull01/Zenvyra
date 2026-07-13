"use client";

import { useState } from "react";
import { Loader2, Mic, Play, Save, Volume2 } from "lucide-react";
import toast from "react-hot-toast";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";

const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Italian"];

export default function VoiceConsentPage() {
  const [enabled, setEnabled] = useState(false);
  const [language, setLanguage] = useState("English");
  const [voice, setVoice] = useState("neutral");
  const [speed, setSpeed] = useState(1);
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Voice consent settings saved.");
    }, 500);
  };

  return (
    <DashboardPageShell
      title="Voice-Enabled Consent"
      subtitle="Let visitors manage cookie and privacy preferences using voice commands."
      icon={Mic}
    >
      <div className="space-y-6">
        <div className="standard-card hover:!translate-y-0">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <Volume2 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Accessibility-first consent</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Voice commands help visitors accept, reject, or customize cookie categories without needing to
                interact with on-screen controls.
              </p>
            </div>
          </div>
        </div>

        <div className="standard-card hover:!translate-y-0">
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-lg border border-border-light bg-background-secondary p-4 text-sm font-semibold text-text-primary">
              Enable voice consent
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="h-5 w-5 rounded text-accent"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">Language</label>
                <select
                  className="text-input w-full"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">Voice style</label>
                <select
                  className="text-input w-full"
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                >
                  <option value="neutral">Neutral</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">Speech speed</label>
                <input
                  type="number"
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="text-input w-full"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="rounded-xl border border-border-light bg-background-secondary p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">Preview phrase</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    "You can accept necessary cookies, accept all, or customize your preferences."
                  </p>
                </div>
                <button
                  onClick={() => toast.success("Preview played")}
                  className="btn-secondary !px-3 !py-1.5 text-xs"
                >
                  <Play className="h-3 w-3" />
                  Play
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-status-warning/30 bg-status-warning/10 p-4 text-sm text-text-secondary">
              <p>
                Voice output uses the browser's built-in speech synthesis. A backend TTS integration can be
                enabled for production deployments.
              </p>
            </div>

            <button onClick={save} disabled={saving} className="btn-primary w-full justify-center sm:w-auto">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save settings
            </button>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
