"use client";

import Link from "next/link";
import { Github, MapPin, GraduationCap, Briefcase, Code2, ExternalLink, User } from "lucide-react";

const candidate = {
  name: "AMAN KUMAR SAHU",
  role: "Backend Engineer | Laravel & Python",
  location: "Bangalore, India",
  skills: [
    "NLP", "Machine Learning", "Scikit-Learn", 
    "Document Processing", "Scalable Systems", "REST APIs"
  ],
  education: [
    {
      institution: "Chhattisgarh Swami Vivekanand Technical University",
      degree: "B.Tech in Computer Science"
    }
  ],
  experience: [
    { period: "Jul 2024 – Present", role: "Software Engineer", company: "Current Corp" },
    { period: "2019 – 2023", role: "Academic Tenure / Internships", company: "Various" }
  ],
  github: {
    username: "aman-k-codes",
    bio: "Building ML-powered tools and robust REST APIs",
    followers: 3,
    repositories: [
      {
        name: "AI_Talent_Intelligence",
        url: "https://github.com/aman-k-codes/AI_Talent_Intelligence",
        tech: ["Python", "NLP"],
        description: "AI-driven talent analysis and matching engine."
      },
      {
        name: "CraftMyDoc",
        url: "https://github.com/aman-k-codes/CraftMyDoc",
        tech: ["PHP", "Laravel", "Blade"],
        description: "Advanced document processing and generation system."
      }
    ]
  }
};

export default function CandidateProfile() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-zinc-950 p-6 md:p-12 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-5xl">
        
        {/* Navigation */}
        <Link href="/" className="group flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors mb-8 text-sm font-medium">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Talent Pool
        </Link>

        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8 border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-5 items-center">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {candidate.name[0]}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{candidate.name}</h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium">{candidate.role}</p>
              <div className="flex items-center gap-4 mt-2 text-zinc-500 text-sm">
                <span className="flex items-center gap-1"><MapPin size={14} /> {candidate.location}</span>
                <span className="flex items-center gap-1"><Github size={14} /> @{candidate.github.username}</span>
              </div>
            </div>
          </div>
          <button className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
            Download Dossier
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-10">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="md:col-span-2 space-y-10">
            
            <Section title="Professional Experience" icon={<Briefcase size={18} />}>
              <div className="space-y-6">
                {candidate.experience.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l border-zinc-200 dark:border-zinc-800">
                    <div className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-blue-600" />
                    <h4 className="font-bold text-zinc-800 dark:text-zinc-200">{exp.role}</h4>
                    <p className="text-sm text-zinc-500">{exp.company} • {exp.period}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Featured Projects" icon={<Code2 size={18} />}>
              <div className="grid gap-4">
                {candidate.github.repositories.map(repo => (
                  <div key={repo.name} className="group border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-all">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{repo.name}</h4>
                      <a href={repo.url} target="_blank" className="text-zinc-400 hover:text-zinc-900"><ExternalLink size={16} /></a>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">{repo.description}</p>
                    <div className="flex gap-2 mt-4">
                      {repo.tech.map(t => (
                        <span key={t} className="text-[10px] uppercase tracking-wider font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* RIGHT COLUMN: Skills & Education */}
          <div className="space-y-10">
            <Section title="Technical Skills" icon={<User size={18} />}>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-md px-3 py-1 text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Education" icon={<GraduationCap size={18} />}>
              {candidate.education.map((edu, i) => (
                <div key={i} className="mb-4">
                  <h4 className="text-sm font-bold leading-tight">{edu.institution}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{edu.degree}</p>
                </div>
              ))}
            </Section>

            <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Github Insights</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{candidate.github.followers}</span>
                <span className="text-sm text-zinc-500 mb-1">Followers</span>
              </div>
              <p className="text-xs text-zinc-500 mt-4 leading-relaxed italic">"{candidate.github.bio}"</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-zinc-400">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );
}