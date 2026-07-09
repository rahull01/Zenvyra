"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { Cookie, Edit, Eye, FileText, Globe, Languages, Loader2, Scale, Shield, Sparkles, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type Policy = {
  id: string;
  type: string;
  title: string;
  language: string;
  status: "draft" | "published" | "archived" | string;
  updatedAt?: string;
  websiteId?: string;
};

const policyTypes = [
  { id: "privacy", name: "Privacy Policy", icon: Shield },
  { id: "terms", name: "Terms of Service", icon: FileText },
  { id: "cookie", name: "Cookie Policy", icon: Cookie },
  { id: "gdpr", name: "GDPR Notice", icon: Globe },
  { id: "ccpa", name: "CCPA Notice", icon: Scale },
];

const languages = [
  { code: "en", name: "English", flag: "EN" },
  { code: "de", name: "German", flag: "DE" },
  { code: "fr", name: "French", flag: "FR" },
  { code: "es", name: "Spanish", flag: "ES" },
  { code: "it", name: "Italian", flag: "IT" },
];

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [websites, setWebsites] = useState<Array<{ id: string; name: string; url: string }>>([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("privacy");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedWebsiteId, setSelectedWebsiteId] = useState("");

  const websiteById = useMemo(() => new Map(websites.map((site) => [site.id, site])), [websites]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [policyResponse, websiteResponse] = await Promise.all([
        api.get<Policy[]>("/policies"),
        api.get<any[]>("/websites"),
      ]);
      setPolicies(policyResponse.data || []);
      setWebsites((websiteResponse.data || []).map((site) => ({ id: site.id, name: site.name || site.url, url: site.url })));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unable to load policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedType) {
      toast.error("Please select a policy type");
      return;
    }

    setGenerating(true);
    try {
      const title = policyTypes.find((type) => type.id === selectedType)?.name || "New Policy";
      const response = await api.post<Policy>("/policies", {
        type: selectedType,
        name: title,
        language: selectedLanguage,
        websiteId: selectedWebsiteId || undefined,
      });

      setPolicies((prev) => [response.data, ...prev.filter((policy) => policy.id !== response.data.id)]);
      setShowGenerator(false);
      toast.success("Policy draft created.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to generate policy");
    } finally {
      setGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-status-success/20 text-status-success";
      case "draft":
      case "draft_ready":
        return "bg-status-warning/20 text-status-warning";
      default:
        return "bg-surface-700 text-surface-500";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-3 font-display text-surface-100 mb-2">Policies</h1>
          <p className="text-surface-400">AI-generated policy drafts for your websites. Review with qualified counsel before publishing.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowGenerator(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow"
        >
          <Sparkles className="w-5 h-5" />
          Generate Policy
        </motion.button>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-10 text-center text-surface-400">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Loading policies...
        </div>
      ) : policies.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-brand-400" />
          <h2 className="mt-4 text-heading-3">No policies yet</h2>
          <p className="mt-2 text-sm text-surface-400">Generate your first AI policy from live website data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-brand-400" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                  {policy.status}
                </span>
              </div>

              <h3 className="text-heading-3 mb-2">{policy.title || policy.type}</h3>
              <div className="flex flex-col gap-2 text-sm text-surface-500 mb-4">
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {policy.websiteId ? websiteById.get(policy.websiteId)?.name || "Linked website" : "Account-wide"}
                </span>
                <span className="flex items-center gap-1">
                  <Languages className="w-4 h-4" />
                  {languages.find((language) => language.code === policy.language)?.name || policy.language || "English"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-surface-800/50">
                <span className="text-xs text-surface-500">Updated {formatRelative(policy.updatedAt)}</span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/policies/${policy.id}/preview`} className="p-2 hover:bg-surface-800 rounded-lg transition-colors" title="Preview">
                    <Eye className="w-4 h-4 text-surface-400" />
                  </Link>
                  <Link href={`/policies/${policy.id}`} className="p-2 hover:bg-surface-800 rounded-lg transition-colors" title="Edit">
                    <Edit className="w-4 h-4 text-surface-400" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showGenerator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-heading-2 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-brand-400" />
                    AI Policy Generator
                  </h2>
                  <p className="text-sm text-surface-500 mt-1">Generate a policy from your account and scan context</p>
                </div>
                <button onClick={() => setShowGenerator(false)} className="p-2 hover:bg-surface-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-surface-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-3">Policy Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {policyTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                          selectedType === type.id
                            ? "bg-brand-500/20 border-brand-500/50 text-brand-400"
                            : "bg-surface-800/50 border-surface-700/50 text-surface-400 hover:bg-surface-800"
                        }`}
                      >
                        <type.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-3">Website Context</label>
                  <select
                    value={selectedWebsiteId}
                    onChange={(event) => setSelectedWebsiteId(event.target.value)}
                    className="w-full rounded-xl border border-surface-700/50 bg-surface-800/50 px-4 py-3 text-surface-100"
                  >
                    <option value="">Account-wide policy</option>
                    {websites.map((site) => (
                      <option key={site.id} value={site.id}>{site.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-3">Language</label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => setSelectedLanguage(language.code)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                          selectedLanguage === language.code
                            ? "bg-brand-500/20 border-brand-500/50 text-brand-400"
                            : "bg-surface-800/50 border-surface-700/50 text-surface-400 hover:bg-surface-800"
                        }`}
                      >
                        <span>{language.flag}</span>
                        <span className="text-sm font-medium">{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!selectedType || generating}
                  className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {generating ? "Generating..." : "Generate Draft"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatRelative(value?: string) {
  if (!value) return "recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}
