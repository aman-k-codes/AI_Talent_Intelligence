import React from "react";
import { PlusCircle, MinusCircle, Lightbulb } from "lucide-react";

interface SuggestionsProps {
  suggestions: {
    add: string[];
    remove: string[];
    improve: string[];
  };
}

export function Suggestions({ suggestions }: SuggestionsProps) {
  const { add, remove, improve } = suggestions;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 space-y-8">
      <h3 className="text-xl font-black mb-6">Optimization Suggestions</h3>

      {add.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500 mb-3">
            <PlusCircle size={16} /> Suggested Additions
          </h4>
          <ul className="space-y-3">
            {add.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Evaluate if you have experience with <strong className="text-emerald-600 dark:text-emerald-400">{item}</strong> and add it.</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {improve.length > 0 && (
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-500 mb-3">
            <Lightbulb size={16} /> Suggested Improvements
          </h4>
          <ul className="space-y-3">
            {improve.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {remove.length > 0 && (
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-600 dark:text-red-500 mb-3">
            <MinusCircle size={16} /> Suggested Removals
          </h4>
          <ul className="space-y-3">
            {remove.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {add.length === 0 && remove.length === 0 && improve.length === 0 && (
        <p className="text-sm text-zinc-500 italic">No specific suggestions at this time.</p>
      )}
    </div>
  );
}
