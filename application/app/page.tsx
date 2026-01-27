"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Upload, 
  Search, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Sparkles,
  ChevronRight
} from "lucide-react";

type Candidate = {
  id: number;
  name: string;
  role: string;
  experience: string;
  matchScore: number;
  tags: string[];
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [fileName, setFileName] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileName(Array.from(e.target.files).map(f => f.name));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setCandidates([
        { id: 1, name: "Alex Rivera", role: "Senior Fullstack Engineer", experience: "8 years", matchScore: 98, tags: ["Python", "Next.js", "AWS"] },
        { id: 2, name: "Sarah Chen", role: "Frontend Developer", experience: "5 years", matchScore: 85, tags: ["React", "TypeScript", "Tailwind"] },
        { id: 3, name: "Jordan Smith", role: "Product Engineer", experience: "4 years", matchScore: 72, tags: ["Go", "React", "SQL"] },
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="mx-auto max-w-5xl px-6 py-12">
        
        {/* TOP NAVBAR */}
        <header className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
                <Sparkles size={20} className="text-white" />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Recruit<span className="text-blue-600">AI</span></h2>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-500 italic">
            "Augmenting human intelligence in hiring."
          </nav>
        </header>

        {!candidates ? (
          <div className="max-w-3xl mx-auto">
            {/* HERO SECTION */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
                    Intelligent Talent Sourcing
                </h1>
                <p className="text-zinc-500 text-lg">
                    Upload resumes and match them against your JD using proprietary NLP models.
                </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
                    <FileText size={14} /> Job Description
                  </label>
                  <textarea
                    required
                    className="w-full rounded-2xl border border-zinc-200 p-5 min-h-[160px] dark:border-zinc-800 dark:bg-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none text-sm leading-relaxed"
                    placeholder="Describe the ideal candidate, core technologies, and expectations..."
                  />
                </div>

                <div>
                  <label className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
                    <Users size={14} /> Resume Batch
                  </label>
                  <div className="group relative">
                    <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-12 transition-all group-hover:bg-white group-hover:border-blue-400 dark:border-zinc-800 dark:bg-black dark:group-hover:bg-zinc-900">
                      <div className="bg-white dark:bg-zinc-800 p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <Upload size={24} className="text-blue-600" />
                      </div>
                      <p className="text-sm font-medium">Click to upload or drag multiple PDF/DOCX</p>
                      <p className="text-xs text-zinc-400 mt-2">Maximum 50 resumes per batch</p>
                      <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  
                  {fileName.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {fileName.map((name, i) => (
                            <span key={i} className="text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                                {name}
                            </span>
                        ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-900 font-bold text-white transition-all hover:bg-black dark:bg-white dark:text-black disabled:opacity-70"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Running AI Analysis...</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">Identify Best Fits <ArrowRight size={18} /></span>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight">AI Rankings</h2>
                <p className="text-zinc-500 text-sm mt-1">Found {candidates.length} candidates meeting your criteria.</p>
              </div>
              <button 
                onClick={() => setCandidates(null)} 
                className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg"
              >
                Reset Search
              </button>
            </div>

            <div className="grid gap-4">
              {candidates.map((person) => (
                <div
                  key={person.id}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <div className="flex gap-5">
                    <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl font-black text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {person.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{person.name}</h3>
                        {person.matchScore > 90 && <CheckCircle2 size={16} className="text-blue-500" />}
                      </div>
                      <p className="font-medium text-zinc-600 dark:text-zinc-400">{person.role}</p>
                      <div className="flex gap-2 mt-3">
                        {person.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-black uppercase tracking-tighter bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-100 dark:border-zinc-700 text-zinc-500">
                                {tag}
                            </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">Match Accuracy</p>
                      <div className="text-2xl font-black text-blue-600 tabular-nums">
                        {person.matchScore}<span className="text-sm font-normal">%</span>
                      </div>
                    </div>
                    <Link
                      href={`/candidate/${person.id}`}
                      className="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-600 dark:bg-white dark:text-black dark:hover:bg-blue-600 dark:hover:text-white group-hover:translate-x-1"
                    >
                      Dossier <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}