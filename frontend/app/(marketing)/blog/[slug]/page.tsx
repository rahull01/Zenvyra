"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Heart, MessageSquare, Share2, Twitter, Linkedin, Facebook, Send } from "lucide-react";
import PageContainer from "@/components/shared/PageContainer";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Button } from "@/components/ui/button";

const POSTS: Record<
  string,
  {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    body: string[];
    author: { name: string; role: string; avatar: string };
  }
> = {
  "gdpr-checklist-2026": {
    title: "GDPR Compliance Checklist for 2026",
    excerpt: "Essential steps every SaaS team should complete before your next audit.",
    date: "May 15, 2026",
    readTime: "8 min read",
    author: { name: "Sarah Jenkins", role: "Head of Legal & Compliance", avatar: "SJ" },
    body: [
      "Regulators continue to prioritize consent transparency and data minimization. Start with an accurate record of processing activities.",
      "Ensure your privacy policy references lawful bases, retention periods, and international transfers. Cookie banners must block non-essential scripts until consent.",
      "Document DSAR workflows with SLA targets. Zenvyra automates intake, identity verification, and export packaging.",
    ],
  },
  "cookie-consent-best-practices": {
    title: "Cookie Consent Best Practices",
    excerpt: "How to design banners that convert while staying compliant globally.",
    date: "May 8, 2026",
    readTime: "6 min read",
    author: { name: "Alex Rivera", role: "Lead Product Designer", avatar: "AR" },
    body: [
      "Use clear, plain language for accept, reject, and customize actions. Avoid dark patterns that pre-check marketing categories.",
      "Implement Google Consent Mode v2 and IAB TCF 2.3 when running programmatic ads in the EU.",
      "Log consent events with timestamps and policy versions for audit defense.",
    ],
  },
  "ccpa-vs-gdpr": {
    title: "CCPA vs GDPR: Key Differences",
    excerpt: "A practical comparison for teams operating in the US and EU.",
    date: "April 28, 2026",
    readTime: "10 min read",
    author: { name: "Marcus Thorne", role: "VP of Product Engineering", avatar: "MT" },
    body: [
      "GDPR applies broadly to processing of EU residents' data. CCPA/CPRA focuses on California consumers and introduces opt-out rights for sale/sharing.",
      "Both require accessible privacy notices, but GDPR emphasizes lawful basis while CCPA emphasizes do-not-sell links and sensitive data limits.",
      "A unified compliance program maps controls once and applies regional overlays through geolocation rules.",
    ],
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug];
  if (!post) notFound();

  const [likes, setLikes] = useState(24);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([
    { author: "Devin K.", text: "Super helpful overview, especially for SaaS startups.", time: "2 days ago" },
    { author: "Claire M.", text: "Google Consent Mode v2 has been a headache. Thanks for the breakdown.", time: "5 days ago" },
  ]);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setHasLiked(!hasLiked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments([{ author: "You", text: commentInput, time: "Just now" }, ...comments]);
    setCommentInput("");
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary pt-24 pb-20">
      <PageContainer>
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-8">
            <header className="space-y-4">
              <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-caption font-bold text-primary uppercase tracking-wider">
                Compliance Insights
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed font-medium">
                {post.excerpt}
              </p>

              {/* Author & Telemetry */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-b border-border-light pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {post.author.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary">{post.author.name}</h4>
                    <p className="text-[11px] text-text-muted font-medium">{post.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-text-muted">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime}</span>
                </div>
              </div>
            </header>

            {/* Article Body */}
            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-text-secondary">
              {post.body.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between border-y border-border-light py-4 my-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                    hasLiked ? "text-primary" : "text-text-secondary hover:text-primary"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${hasLiked ? "fill-primary" : ""}`} />
                  <span>{likes} Likes</span>
                </button>
                <div className="flex items-center gap-2 text-sm font-bold text-text-secondary">
                  <MessageSquare className="h-5 w-5" />
                  <span>{comments.length} Comments</span>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-text-muted flex items-center gap-1">
                  <Share2 className="h-4 w-4" /> Share
                </span>
                <button className="h-8 w-8 rounded-lg bg-background-secondary hover:bg-border-light flex items-center justify-center text-text-secondary transition-all">
                  <Twitter className="h-4 w-4" />
                </button>
                <button className="h-8 w-8 rounded-lg bg-background-secondary hover:bg-border-light flex items-center justify-center text-text-secondary transition-all">
                  <Linkedin className="h-4 w-4" />
                </button>
                <button className="h-8 w-8 rounded-lg bg-background-secondary hover:bg-border-light flex items-center justify-center text-text-secondary transition-all">
                  <Facebook className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-text-primary">Discussion</h3>
              <form onSubmit={handleAddComment} className="flex gap-3 bg-background-primary p-2 rounded-2xl border border-border-medium shadow-card">
                <input
                  type="text"
                  placeholder="Share your thoughts on this post..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 text-sm outline-none px-3 bg-transparent placeholder-text-muted text-text-primary"
                />
                <Button type="submit" className="bg-primary hover:bg-primary-hover text-white rounded-xl">
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              <div className="space-y-4">
                {comments.map((c, i) => (
                  <div key={i} className="bg-background-secondary/40 border border-border-light p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-text-primary">{c.author}</span>
                      <span className="text-[11px] text-text-muted font-medium">{c.time}</span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar (CTA / Related Posts) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* CTA Box */}
            <div className="bg-gradient-to-br from-primary/10 to-background-primary border border-primary/20 p-6 rounded-3xl text-center shadow-card">
              <span className="text-caption font-bold text-primary uppercase tracking-wider block mb-2">Automate Compliance</span>
              <h4 className="text-lg font-bold text-text-primary mb-3">Tired of drafting policies manually?</h4>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                Use our automated generator tool to launch GDPR and CCPA policies in less than 5 minutes.
              </p>
              <Link href="/dashboard/policies/new">
                <Button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl shadow-button">
                  Generate Policy Now
                </Button>
              </Link>
            </div>

            {/* Related Posts */}
            <div className="bg-background-primary border border-border-light p-6 rounded-3xl shadow-card space-y-4">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border-light pb-2">Related Articles</h4>
              <div className="space-y-4">
                {Object.entries(POSTS)
                  .filter(([slug]) => slug !== params.slug)
                  .map(([slug, postVal]) => (
                    <Link key={slug} href={`/blog/${slug}`} className="block group">
                      <h5 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                        {postVal.title}
                      </h5>
                      <span className="text-[11px] text-text-muted font-medium mt-1 block">{postVal.date}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>
    </main>
  );
}
