"use client";

import { Mail, MapPin, Phone, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import MarketingCTA from "@/components/marketing/MarketingCTA";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-primary">
      <MarketingPageHero
        eyebrow="Contact"
        title="Talk to our team"
        subtitle="Demos, enterprise pricing, or implementation support — we're here to help you build a compliance stack you can trust."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="standard-card space-y-6 !transform-none hover:!translate-y-0">
              <h2 className="text-xl font-bold text-text-primary">Reach us directly</h2>
              {[
                { icon: Mail, label: "Email", value: "hello@zenvyra.com" },
                { icon: Phone, label: "Phone", value: "+1 (415) 555-0124" },
                { icon: MapPin, label: "Office", value: "San Francisco, CA" },
                { icon: Clock, label: "Support hours", value: "Mon–Fri, 6am–6pm PT" },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <row.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{row.label}</p>
                    <p className="mt-0.5 text-sm text-text-secondary">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="standard-card !transform-none hover:!translate-y-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                {(["name", "email", "company"] as const).map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="mb-1.5 block text-sm font-medium text-text-primary capitalize">
                      {field === "email" ? "Email" : field}
                    </label>
                    <input
                      id={field}
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="text-input"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-primary">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="text-input min-h-[120px] resize-y"
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
              {submitStatus === "success" && (
                <p className="mt-4 rounded-lg bg-status-success/10 px-4 py-3 text-center text-sm font-medium text-status-success">
                  Thank you! We will get back to you shortly.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="mt-4 rounded-lg bg-status-error/10 px-4 py-3 text-center text-sm font-medium text-status-error">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <MarketingCTA title="Prefer to start on your own?" subtitle="Run a free compliance scan in under two minutes." primaryLabel="Start Free Scan" />
    </main>
  );
}
