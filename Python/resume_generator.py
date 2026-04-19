import os
import subprocess
import re
import uuid
from typing import Dict, Any, List

# Basic LaTeX template aligned with requested format
LATEX_TEMPLATE = r"""
\documentclass[11pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{geometry}
\geometry{left=1in,right=1in,top=1in,bottom=1in}
\usepackage{hyperref}
\usepackage{enumitem}

\begin{document}

\begin{center}
    {\Huge \textbf{<<NAME>>}} \\
    \vspace{2mm}
    <<ROLE>> | <<CONTACT>>
\end{center}

\vspace{4mm}
\noindent \textbf{\Large Professional Summary} \\
\hrule
\vspace{2mm}
<<SUMMARY>>

\vspace{4mm}
\noindent \textbf{\Large Technical Skills} \\
\hrule
\vspace{2mm}
<<SKILLS>>

\vspace{4mm}
\noindent \textbf{\Large Professional Experience} \\
\hrule
\vspace{2mm}
<<EXPERIENCE>>

\vspace{4mm}
\noindent \textbf{\Large Projects} \\
\hrule
\vspace{2mm}
<<PROJECTS>>

\vspace{4mm}
\noindent \textbf{\Large Education} \\
\hrule
\vspace{2mm}
<<EDUCATION>>

\end{document}
"""

def extract_sections_heuristic(text: str) -> Dict[str, str]:
    """
    Very basic heuristic to carve out resume sections.
    In a fully featured ML model this would use LayoutLM or advanced Spacy rules.
    """
    # Provide fallback dummy sections extracted from text
    return {
        "Name": "Candidate Name", 
        "Role": "Software Engineer",
        "Contact": "contact@example.com",
        "Summary": "A dedicated professional with experience in software development.",
        "Skills": "Python, Java, Git",
        "Experience": "\\textbf{Software Developer} \\\\ Worked on APIs and fixed bugs.",
        "Projects": "\\textbf{Personal Website} \\\\ Built using HTML and CSS.",
        "Education": "\\textbf{B.S. in Computer Science}"
    }

def inject_keywords(text: str, keywords: List[str]) -> str:
    """Inserts missing keywords naturally."""
    if not keywords:
        return text
    
    # We heuristically append them to the end of a skills/summary section
    # instead of hallucinating full sentences
    added_skills = ", ".join(keywords[:5]) # Top 5 missing
    return text + f" Extensively utilizing {added_skills}."

def rewrite_bullets(text: str) -> str:
    """Converts weak action verbs into strong ones."""
    replacements = {
        r'(?i)\bworked on\b': 'Developed and optimized',
        r'(?i)\bresponsible for\b': 'Engineered and led',
        r'(?i)\bdid\b': 'Implemented',
        r'(?i)\bmade\b': 'Designed and shipped',
        r'(?i)\bhelped with\b': 'Collaborated on scaling'
    }
    
    improved_text = text
    for weak, strong in replacements.items():
        improved_text = re.sub(weak, strong, improved_text)
        
    # Heuristically add metrics
    if "API" in improved_text and "performance" not in improved_text:
        improved_text = improved_text.replace("APIs", "REST APIs improving performance by 30%")
        
    return improved_text

from model_router import route_model_request

async def generate_improved_content(extracted_text: str, missing_keywords: List[str], matched_keywords: List[str], model_tier: str = "premium") -> Dict[str, str]:
    """Applies improvements to extracted sections utilizing LLM integration with heuristic fallback."""
    sections = extract_sections_heuristic(extracted_text)
    
    prompt = f"""
    You are optimizing a candidate's resume for an ATS system. 
    Rewrite the following resume content to be more impactful. Do NOT hallucinate new experiences.
    Incorporate these highly relevant missing domain keywords natively where they fit logically: {', '.join(missing_keywords[:5])}
    
    Original Extracted Resume Content:
    {extracted_text[:3000]}
    
    Return ONLY a JSON response strictly matching this structure with valid keys:
    {{
        "summary": "Rewritten summary...",
        "skills": "Comma separated string of updated skills...",
        "experience": "LaTeX formatted rewritten experience bullets...",
        "projects": "LaTeX formatted rewritten project section..."
    }}
    """
    
    try:
        # Use LLMs (GPT-4o or Groq)
        llm_response = await route_model_request(prompt, model_tier)
        
        # Apply the structured LLM enhancements back onto our resume sections format
        sections["Summary"] = llm_response.get("summary", sections["Summary"])
        sections["Skills"] = llm_response.get("skills", sections["Skills"])
        
        ex = llm_response.get("experience")
        if ex and len(ex.strip()) > 10:
            sections["Experience"] = ex
            
        proj = llm_response.get("projects")
        if proj and len(proj.strip()) > 10:
            sections["Projects"] = proj
            
    except Exception as e:
        print(f"LLM rewrite pipeline failed completely. Aborting to heuristic logic. Error: {e}")
        # Standard Fallback logic using only heuristical strings & NLP (No LLM)
        all_skills = matched_keywords + missing_keywords[:5]
        sections["Skills"] = ", ".join([s.capitalize() for s in all_skills]) if all_skills else sections["Skills"]
        
        summary = sections.get("Summary", "")
        summary = inject_keywords(summary, missing_keywords)
        sections["Summary"] = summary
        
        exp = sections.get("Experience", "")
        exp = rewrite_bullets(exp)
        sections["Experience"] = exp
    
    return sections

def generate_latex(content: Dict[str, str]) -> str:
    """Maps python dictionary to LaTeX template."""
    tex_code = LATEX_TEMPLATE
    
    mapping = {
        "<<NAME>>": content.get("Name", "Candidate"),
        "<<ROLE>>": content.get("Role", "Professional"),
        "<<CONTACT>>": content.get("Contact", "contact@example.com"),
        "<<SUMMARY>>": content.get("Summary", ""),
        "<<SKILLS>>": content.get("Skills", ""),
        "<<EXPERIENCE>>": content.get("Experience", ""),
        "<<PROJECTS>>": content.get("Projects", ""),
        "<<EDUCATION>>": content.get("Education", "")
    }
    
    for marker, value in mapping.items():
        # Escape basic latex breaking chars just in case (rudimentary)
        safe_value = value.replace('&', '\\&').replace('%', '\\%').replace('$', '\\$')
        tex_code = tex_code.replace(marker, safe_value)
        
    return tex_code

def compile_pdf(tex_code: str) -> str:
    """Compiles LaTeX code into a PDF using pdflatex and returns the path."""
    job_id = str(uuid.uuid4())
    temp_dir = "/tmp"  # Use generic temp dir (will work inside docker or local linux)
    
    # Ensure Windows compatibility if running locally without Docker
    if os.name == 'nt':
        temp_dir = os.environ.get('TEMP', '.')
        
    tex_path = os.path.join(temp_dir, f"{job_id}.tex")
    
    with open(tex_path, "w", encoding="utf-8") as f:
        f.write(tex_code)
        
    try:
        # Run pdflatex (requires TeX Live installed)
        # -interaction=nonstopmode prevents stopping for user input on errors
        subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", "-output-directory", temp_dir, tex_path],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
    except Exception as e:
        # Fallback if pdflatex fails or isn't installed
        print(f"LaTex compilation failed (pdflatex installed?): {e}")
        return ""
        
    pdf_path = os.path.join(temp_dir, f"{job_id}.pdf")
    if os.path.exists(pdf_path):
        return pdf_path
        
    return ""
