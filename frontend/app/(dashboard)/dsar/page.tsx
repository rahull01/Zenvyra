"use client";

import React, { useState } from "react";
import { Fingerprint, Plus, Trash2, Eye, Save, Settings, Layers } from "lucide-react";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import { Button } from "@/components/ui/button";

export default function DsarFormBuilderPage() {
  const [fields, setFields] = useState([
    { id: "email", label: "Email Address", required: true, type: "email" },
    { id: "name", label: "Full Legal Name", required: true, type: "text" },
    { id: "type", label: "Request Category (Deletion/Access)", required: true, type: "select" },
  ]);

  const addField = () => {
    const newField = { id: `custom_${Date.now()}`, label: "New Request Field", required: false, type: "text" };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleSave = () => {
  };

  return (
    <DashboardPageShell
      title="DSAR Form Builder"
      subtitle="Design privacy intake forms for customers to submit data erasure and access requests."
      icon={Fingerprint}
      actions={[
        { label: "Save Form Setup", href: "/dsar", primary: true, onClick: handleSave },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Controls Side */}
        <div className="lg:col-span-4 bg-background-primary border border-border-light rounded-3xl p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-light pb-2">
            <Layers className="text-primary h-4.5 w-4.5" />
            Field Options
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Click to add standard data categories to your public privacy request intake page.
          </p>
          <Button
            onClick={addField}
            className="w-full bg-secondary-dark hover:bg-primary text-white text-caption font-bold py-2.5 rounded-xl gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Custom Input Field
          </Button>
        </div>

        {/* Live Canvas Workspace */}
        <div className="lg:col-span-8 bg-background-primary border border-border-light rounded-3xl p-6 md:p-8 shadow-card space-y-6">
          <div className="flex justify-between items-center border-b border-border-light pb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Public Intake Form Preview</span>
            <span className="text-caption text-primary font-bold uppercase bg-primary/10 px-2.5 py-1 rounded-full">
              Live Link Enabled
            </span>
          </div>

          <div className="space-y-4 max-w-lg bg-background-secondary/40 p-6 rounded-2xl border border-border-light">
            {fields.map((f) => (
              <div key={f.id} className="relative group border-b border-dashed border-border-light pb-4 last:border-none last:pb-0">
                <div className="flex justify-between items-start mb-1.5">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    {f.label} {f.required && <span className="text-status-error">*</span>}
                  </label>
                  <button
                    onClick={() => removeField(f.id)}
                    className="text-text-muted hover:text-status-error opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove field"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {f.type === "select" ? (
                  <select disabled className="w-full text-caption px-3 py-2.5 rounded-xl border border-border-medium bg-background-primary text-text-muted">
                    <option>Select right (Access, Erasure, Correction)...</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    placeholder={`Enter ${f.label.toLowerCase()}...`}
                    className="w-full text-caption px-3 py-2.5 rounded-xl border border-border-medium bg-background-primary text-text-muted"
                  />
                )}
              </div>
            ))}
            <Button disabled className="w-full bg-primary text-white text-caption font-bold py-2.5 rounded-xl">
              Submit Request
            </Button>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
