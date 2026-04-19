import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Sparkles } from "lucide-react";
import clsx from "clsx";

interface UploadFormProps {
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  modelTier: string;
  setModelTier: (tier: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function UploadForm({
  jobDescription,
  setJobDescription,
  file,
  setFile,
  modelTier,
  setModelTier,
  onSubmit,
  loading,
}: UploadFormProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none">
      
      <div>
        <label className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
          <Sparkles size={14} /> AI Processing Model
        </label>
        <select 
          value={modelTier}
          onChange={(e) => setModelTier(e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800 dark:bg-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-semibold cursor-pointer"
        >
          <option value="premium">Premium Engine (OpenAI GPT-4o)</option>
          <option value="free">Free Engine (Groq Mixtral)</option>
        </select>
      </div>

      <div>
        <label className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
          <FileText size={14} /> Job Description
        </label>
        <textarea
          required
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 p-5 min-h-[160px] dark:border-zinc-800 dark:bg-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400"
          placeholder="Paste the Job Description (JD) here to analyze against..."
        />
      </div>

      <div>
        <label className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
          <Upload size={14} /> Resume (PDF)
        </label>
        
        {!file ? (
          <div
            {...getRootProps()}
            className={clsx(
              "flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 transition-all",
              isDragActive 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                : "border-zinc-200 bg-zinc-50 hover:bg-white hover:border-blue-400 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-900"
            )}
          >
            <input {...getInputProps()} />
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-full shadow-sm mb-4">
              <Upload size={24} className={clsx("transition-transform text-blue-600", isDragActive && "scale-110")} />
            </div>
            <p className="text-sm font-medium dark:text-zinc-300">
              {isDragActive ? "Drop the PDF here..." : "Click to upload or drag & drop a PDF resume"}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 rounded-2xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600 dark:text-blue-400" size={24} />
              <div className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {file.name}
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setFile(null)}
              className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !file || !jobDescription}
        className="relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-blue-600 font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Analyzing Resume...</span>
          </div>
        ) : (
          <span>Score Resume ATS</span>
        )}
      </button>
    </form>
  );
}
