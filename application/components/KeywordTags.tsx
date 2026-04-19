import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface KeywordTagsProps {
  matched: string[];
  missing: string[];
}

export function KeywordTags({ matched, missing }: KeywordTagsProps) {
  return (
    <div className="space-y-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8">
      
      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 mb-4">
          <CheckCircle2 size={16} /> Matched Keywords ({matched.length})
        </h3>
        {matched.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {matched.map((kw, i) => (
              <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl text-sm font-semibold border border-emerald-100 dark:border-emerald-500/20">
                {kw}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic">No exact keyword matches found.</p>
        )}
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-600 dark:text-red-500 mb-4">
          <XCircle size={16} /> Missing Keywords ({missing.length})
        </h3>
        {missing.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missing.map((kw, i) => (
              <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 rounded-xl text-sm font-semibold border border-red-100 dark:border-red-500/20">
                {kw}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic">Excellent! You matched all detected keywords.</p>
        )}
      </div>

    </div>
  );
}
