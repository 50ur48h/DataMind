"use client";

import { ArrowRight, Database, BookOpen, Search, ShieldCheck, ChartNoAxesCombined } from "lucide-react";
import { SignIn } from "./sign-in";

const stages = [
  { icon: Database, name: "Your data", detail: "Sales, orders, and the records you already keep." },
  { icon: BookOpen, name: "Your business", detail: "The definitions and documents that give numbers meaning." },
  { icon: Search, name: "An investigation", detail: "Plan, query, compare. Follow the evidence further." },
  { icon: ShieldCheck, name: "Checked evidence", detail: "Read-only access, clear limits, and work you can inspect." },
  { icon: ChartNoAxesCombined, name: "A clearer next step", detail: "Plain English, useful visuals, and the facts behind them." },
];

export function Landing() {
  return (
    <main className="min-h-screen bg-background text-text">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <span className="font-serif text-2xl font-semibold">DataMind<span className="text-brand-ink">.</span></span>
        <a href="#start" className="rounded-full border border-border-soft px-5 py-2 text-sm font-medium hover:bg-brand-soft">Get started <ArrowRight className="ml-2 inline size-4" /></a>
      </nav>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-24">
        <div>
          <p className="mb-5 text-sm font-semibold tracking-wide text-brand-ink">A QUESTION IS A GOOD PLACE TO START</p>
          <h1 className="max-w-2xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl">Your numbers have a story.<br /><span className="text-brand-ink">Find your next move.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">It’s Monday morning. What should you stock? Which offer is worth trying? Why did sales slow down?</p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">Meet DataMind, your data and business analyst. Ask in everyday English. It investigates your connected data and business knowledge, checks the evidence, and helps you decide where to focus.</p>
          <a href="#workflow" className="mt-7 inline-flex items-center gap-2 font-medium text-brand-ink">See how it works <ArrowRight className="size-4" /></a>
        </div>
        <div id="start" className="scroll-mt-6 rounded-3xl border border-border-soft bg-surface p-7 shadow-sm sm:p-9">
          <h2 className="font-serif text-2xl">Start with a question.</h2>
          <p className="mb-6 mt-2 text-sm text-muted-foreground">Sign in, create your workspace, and connect your database.</p>
          <SignIn />
        </div>
      </section>
      <section id="workflow" className="mx-auto max-w-6xl scroll-mt-8 px-6 pb-20">
        <p className="text-sm font-semibold text-brand-ink">HOW DATAMIND WORKS</p>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">From scattered records to a useful answer.</h2>
        <div className="relative mt-10 grid gap-4 md:grid-cols-5">
          {stages.map(({ icon: Icon, name, detail }, index) => (
            <article key={name} className="workflow-node relative rounded-2xl border border-border-soft bg-surface p-5" style={{ animationDelay: `${index * 0.8}s` }}>
              <span className="mb-5 grid size-11 place-items-center rounded-xl bg-brand-soft text-brand-ink"><Icon className="size-5" /></span>
              <p className="text-xs text-muted-foreground">0{index + 1}</p>
              <h3 className="mt-1 font-semibold">{name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">Each investigation reads the data available in your connected database. Suggestions depend on the records you provide. Open the supporting work to see what the answer establishes and what is still missing.</p>
      </section>
      <footer className="border-t border-border-soft px-6 py-6 text-center text-sm text-muted-foreground">For one shop, a growing business, or a team with bigger questions.</footer>
      <style jsx>{`
        .workflow-node { animation: evidence-pulse 5s ease-in-out infinite; }
        @keyframes evidence-pulse { 0%, 75%, 100% { transform: translateY(0); } 15% { transform: translateY(-6px); border-color: var(--accent-ink); } }
        @media (prefers-reduced-motion: reduce) { .workflow-node { animation: none; } }
      `}</style>
    </main>
  );
}
