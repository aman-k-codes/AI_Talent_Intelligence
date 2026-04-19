import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ATSScoreProps {
  score: number;
}

export function ATSScore({ score }: ATSScoreProps) {
  let pathColor = "#10b981"; // green
  if (score < 50) pathColor = "#ef4444"; // red
  else if (score < 75) pathColor = "#f59e0b"; // yellow
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">ATS Match Score</h3>
      <div className="w-48 h-48 drop-shadow-xl">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            pathColor,
            textColor: pathColor,
            trailColor: "rgba(161, 161, 170, 0.1)",
            textSize: '24px',
            pathTransitionDuration: 1.5,
          })}
        />
      </div>
      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-xs">
        {score >= 75 && "Great job! This resume is highly aligned with the job description."}
        {score >= 50 && score < 75 && "Good start, but room for improvement to pass strict ATS filters."}
        {score < 50 && "Needs significant updates to match the job requirements."}
      </p>
    </div>
  );
}
