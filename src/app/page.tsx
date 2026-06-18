import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, FileText, Target, Zap, BrainCircuit, Database, PenTool, MessageSquare } from "lucide-react";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 h-16 flex items-center border-b">
        <div className="font-bold text-xl tracking-tight text-primary">CareerPilot AI</div>
        <div className="ml-auto flex gap-4">
          {session?.user ? (
            <Link href="/dashboard" className={buttonVariants()}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                Log in
              </Link>
              <Link href="/register" className={buttonVariants()}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full overflow-hidden py-24 md:py-32 lg:py-48 flex items-center justify-center text-center px-4 bg-background">
          {/* Subtle Grid and Gradient Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>

          <div className="relative z-10 max-w-[900px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            {/* Pill Badge */}
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary backdrop-blur-md shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-2 animate-pulse"></span>
              The ultimate multi-agent career copilot
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
              Land your dream job <br className="hidden sm:block" />
              with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">Autonomous AI Agents</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-[700px] mx-auto leading-relaxed">
              Elevate your professional profile. Our LangGraph-powered AI analyzes your resume, matches you with real-time roles, and generates perfectly tailored applications in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              {session?.user ? (
                <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-105")}>
                  Launch Copilot <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-105")}>
                  Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}

              <a href="#workflow" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto h-14 px-8 text-base font-semibold backdrop-blur-md bg-background/50 hover:bg-muted/50 transition-all")}>
                See how it works
              </a>
            </div>

            {/* ASCII Stats */}
            <div className="flex justify-center pt-12">
              <pre className="text-muted-foreground/80 text-[10px] sm:text-xs md:text-sm font-mono text-left bg-muted/20 p-4 sm:p-6 rounded-xl border border-border/50 overflow-x-auto shadow-sm">
                {`┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ 5 AI │ │ RAG  │ │ 100+ │ │ Real │
│Agents│ │Search│ │Docs  │ │Jobs  │
└──────┘ └──────┘ └──────┘ └──────┘`}
              </pre>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Powerful Features for Your Job Search</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">Everything you need to stand out to employers and land your dream job faster.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative p-6 rounded-2xl bg-muted/20 border border-border/50 transition-all duration-300 hover:border-primary/50 hover:bg-muted/40">
                <div className="flex flex-col items-start text-left space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold flex items-center gap-2">LangGraph Copilot <span className="text-yellow-500 text-sm">⭐</span></h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">An autonomous network of specialized AI agents working together to build your perfect application package.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-6 rounded-2xl bg-muted/20 border border-border/50 transition-all duration-300 hover:border-primary/50 hover:bg-muted/40">
                <div className="flex flex-col items-start text-left space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Database className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold flex items-center gap-2">RAG Knowledge Base <span className="text-yellow-500 text-sm">⭐</span></h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Your resume, skills, and past experiences are securely stored and retrieved using advanced vector search.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-6 rounded-2xl bg-muted/20 border border-border/50 transition-all duration-300 hover:border-primary/50 hover:bg-muted/40">
                <div className="flex flex-col items-start text-left space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">ATS Resume Analysis</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Instantly parse your resume and receive an accurate ATS compatibility score with missing keyword detection.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative p-6 rounded-2xl bg-muted/20 border border-border/50 transition-all duration-300 hover:border-primary/50 hover:bg-muted/40">
                <div className="flex flex-col items-start text-left space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">Smart Job Matching</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Our AI scans real-time boards to find the highest-matching remote roles based on your extracted skills.</p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group relative p-6 rounded-2xl bg-muted/20 border border-border/50 transition-all duration-300 hover:border-primary/50 hover:bg-muted/40">
                <div className="flex flex-col items-start text-left space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <PenTool className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">AI Cover Letters</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Automatically generate highly personalized cover letters that align your background with the job requirements.</p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative p-6 rounded-2xl bg-muted/20 border border-border/50 transition-all duration-300 hover:border-primary/50 hover:bg-muted/40">
                <div className="flex flex-col items-start text-left space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">Interview Preparation</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Get an actionable roadmap and potential interview questions tailored to the specific role and your resume.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="w-full py-24 bg-muted/30 border-y">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Powered by LangGraph
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Autonomous AI Agent Workflow</h2>
              <p className="text-muted-foreground text-lg max-w-[700px] mx-auto">Upload your resume once, and watch our network of specialized AI agents work together to build your perfect application package.</p>
            </div>

            <div className="relative">
              {/* Vertical line connecting the steps */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2 opacity-30"></div>

              <div className="space-y-12 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="md:w-1/2 flex justify-end">
                    <div className="bg-background p-6 rounded-2xl border shadow-sm w-full max-w-sm transition-all hover:shadow-md hover:-translate-y-1">
                      <h4 className="font-bold text-lg mb-2 text-blue-600">1. Analysis Agent</h4>
                      <p className="text-sm text-muted-foreground">Extracts raw text from your PDF and calculates an initial baseline ATS score.</p>
                    </div>
                  </div>
                  <div className="hidden md:flex h-12 w-12 rounded-full border-4 border-background bg-blue-500 items-center justify-center text-white font-bold shadow-md z-10">1</div>
                  <div className="md:w-1/2"></div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="md:w-1/2"></div>
                  <div className="hidden md:flex h-12 w-12 rounded-full border-4 border-background bg-indigo-500 items-center justify-center text-white font-bold shadow-md z-10">2</div>
                  <div className="md:w-1/2 flex justify-start">
                    <div className="bg-background p-6 rounded-2xl border shadow-sm w-full max-w-sm transition-all hover:shadow-md hover:-translate-y-1">
                      <h4 className="font-bold text-lg mb-2 text-indigo-600">2. Matching Agent</h4>
                      <p className="text-sm text-muted-foreground">Scans RemoteOK APIs to find the highest matching role based on your exact skill profile.</p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="md:w-1/2 flex justify-end">
                    <div className="bg-background p-6 rounded-2xl border shadow-sm w-full max-w-sm border-purple-500/30 relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                      <div className="absolute top-0 right-0 px-2 py-1 bg-purple-500/10 text-purple-600 text-[10px] font-bold rounded-bl-lg">Conditional</div>
                      <h4 className="font-bold text-lg mb-2 text-purple-600">3. Tailoring Agent</h4>
                      <p className="text-sm text-muted-foreground">If your ATS score is below 70, this agent dynamically rewrites your resume bullets to perfectly match the job description.</p>
                    </div>
                  </div>
                  <div className="hidden md:flex h-12 w-12 rounded-full border-4 border-background bg-purple-500 items-center justify-center text-white font-bold shadow-md z-10">3</div>
                  <div className="md:w-1/2"></div>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="md:w-1/2"></div>
                  <div className="hidden md:flex h-12 w-12 rounded-full border-4 border-background bg-pink-500 items-center justify-center text-white font-bold shadow-md z-10">4</div>
                  <div className="md:w-1/2 flex justify-start">
                    <div className="bg-background p-6 rounded-2xl border shadow-sm w-full max-w-sm transition-all hover:shadow-md hover:-translate-y-1">
                      <h4 className="font-bold text-lg mb-2 text-pink-600">4. Application Prep</h4>
                      <p className="text-sm text-muted-foreground">Generates a highly personalized cover letter and an actionable interview roadmap using your tailored profile.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="w-full py-24 bg-muted/10 border-t border-border/50 flex flex-col items-center justify-center px-4">
          <div className="max-w-[800px] w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Technical Architecture</h2>
              <p className="text-muted-foreground">Built for speed, accuracy, and scale.</p>
            </div>

            <div className="flex justify-center">
              <pre className="text-muted-foreground/90 text-xs sm:text-sm font-mono text-left bg-muted/30 p-6 sm:p-10 rounded-2xl border border-border/50 shadow-sm w-full max-w-xl">
                {`Frontend
Next.js + TypeScript

↓

LangGraph Orchestrator

↓

Resume Agent
Job Agent
Tailor Agent
Cover Letter Agent
Interview Agent

↓

Groq LLM

↓

Neon PostgreSQL + pgvector`}
              </pre>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 mt-12 bg-muted/20">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CareerPilot AI. Crafted with <span className="text-red-500">❤️</span> by Karan.</p>
        </div>
      </footer>
    </div>
  );
}
