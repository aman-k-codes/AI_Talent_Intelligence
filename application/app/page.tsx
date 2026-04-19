"use client";

import { useState } from "react";
import { Sparkles, ArrowLeft, RefreshCw } from "lucide-react";
import { UploadForm } from "@/components/UploadForm";
import { ATSScore } from "@/components/ATSScore";
import { KeywordTags } from "@/components/KeywordTags";
import { Suggestions } from "@/components/Suggestions";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      // Connect to the FastAPI backend running locally
      const res = await fetch("http://localhost:8000/ats-score", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to analyze resume.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setJobDescription("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* TOP NAVBAR */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Sparkles size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Recruit<span className="text-blue-600">AI</span> ATS
            </h2>
          </div>
          <nav className="text-sm font-medium text-zinc-500 italic hidden md:block">
            "Automated ATS Resume Scoring & Optimization"
          </nav>
        </header>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 flex items-center gap-3">
            <div className="font-bold">Error:</div>
            <div>{error}</div>
            <button 
              className="ml-auto underline text-sm font-medium"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {!result ? (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Score Your Resume
              </h1>
              <p className="text-zinc-500 text-lg">
                Upload your resume and a target job description to get instant, actionable feedback.
              </p>
            </div>

            <UploadForm 
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              file={file}
              setFile={setFile}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <div className="flex flex-col md:flex-row items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Analysis Results</h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Based on your resume <strong>{file?.name}</strong>
                </p>
              </div>
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md"
              >
                <RefreshCw size={16} /> Re-analyze
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <ATSScore score={result.ats_score} />
              </div>
              
              <div className="md:col-span-2 space-y-8">
                <KeywordTags 
                  matched={result.matched_keywords} 
                  missing={result.missing_keywords} 
                />
                
                <Suggestions suggestions={result.suggestions} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}