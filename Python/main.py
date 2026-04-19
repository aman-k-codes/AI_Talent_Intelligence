from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import spacy
from typing import List, Dict, Any

# Load spaCy NLP model (Using small for fast execution, but in production use 'en_core_web_lg' or specific domain model)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

from spacy.matcher import PhraseMatcher
from collections import Counter

# 1. Strong Stopword Filtering
CUSTOM_STOPWORDS = {
    "work", "team", "member", "year", "role", "responsibility",
    "handle", "look", "hand", "task", "good", "basic", "experience",
    "skill", "knowledge", "ability", "strong", "excellent", "proven",
    "required", "preferred", "application", "environment", "system",
    "project", "client", "business", "technology"
}
for word in CUSTOM_STOPWORDS:
    nlp.vocab[word].is_stop = True

# 3. Domain-Based Keyword Filtering (CRITICAL)
TECH_KEYWORDS = {
    "python", "java", "php", "laravel", "react", "nodejs", "node.js",
    "mysql", "postgresql", "aws", "docker", "kubernetes", "rest api",
    "git", "javascript", "css", "html", "machine learning", "data science",
    "web development", "sql", "nosql", "mongodb", "fastapi", "vue", "angular",
    "typescript", "c++", "c#", ".net", "azure", "gcp", "ci/cd", "linux"
}

# 4. Phrase Detection Setup
phrase_matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
patterns = [nlp.make_doc(text) for text in TECH_KEYWORDS]
phrase_matcher.add("TECH_PHRASES", patterns)

app = FastAPI(title="ATS Resume Scoring API", description="AI Talent Intelligence Extensions")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extracts text from a given PDF byte content using PyMuPDF."""
    text = ""
    try:
        # Open the PDF directly from the byte stream
        pdf_document = fitz.open("pdf", file_content)
        for page_num in range(pdf_document.page_count):
            page = pdf_document.load_page(page_num)
            text += page.get_text()
        pdf_document.close()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF file: {str(e)}")
    return text

def extract_keyword_frequencies(text: str) -> Dict[str, int]:
    """Uses spaCy to extract meaningful technical and domain-relevant keywords."""
    doc = nlp(text.lower())
    keyword_freq = Counter()
    
    # 4. Phrase Detection first
    matches = phrase_matcher(doc)
    matched_spans = []
    for match_id, start, end in matches:
        span = doc[start:end]
        keyword_freq[span.text] += 1
        matched_spans.extend(range(start, end)) # keep track of indices to avoid double counting words
        
    # 2 & 1. POS Filtering & Stopword Filtering
    for i, token in enumerate(doc):
        # Skip if already part of a multi-word phrase match
        if i in matched_spans:
            continue
            
        # Keep only NOUN or PROPN
        if token.pos_ not in ["NOUN", "PROPN"]:
            continue
            
        # Stop words filtering
        if token.is_stop or len(token.text) <= 2:
            continue
            
        word = token.lemma_.lower()
        if word in CUSTOM_STOPWORDS:
            continue
            
        keyword_freq[word] += 1
        
    return dict(keyword_freq)

@app.post("/ats-score")
async def calculate_ats_score(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
) -> Dict[str, Any]:
    """
    Endpoint to score a resume against a given job description.
    """
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
    
    resume_bytes = await resume.read()
    resume_text = extract_text_from_pdf(resume_bytes)
    
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the provided resume.")
    
    # Extract keywords and their frequencies
    jd_freq = extract_keyword_frequencies(job_description)
    resume_freq = extract_keyword_frequencies(resume_text)
    
    # 5. Frequency Filtering & 6. JD-Aware Filtering
    jd_keywords = set()
    for kw, count in jd_freq.items():
        # Keep if it is a known tech word, OR if it appears meaningfully (e.g. at least once is fine for now, 
        # but you can increase threshold if JD is huge)
        if kw in TECH_KEYWORDS or count >= 1:
            jd_keywords.add(kw)
    
    if not jd_keywords:
        raise HTTPException(status_code=400, detail="Job description does not contain discernible keywords.")

    resume_keywords = set(resume_freq.keys())

    # Calculate overlaps (Intersection)
    matched_set = jd_keywords.intersection(resume_keywords)
    
    # Add high-value tech keywords that are in resume but might not strictly be in JD 
    # to show the candidate has extra technical skills
    extra_tech_skills = {kw for kw in resume_keywords if kw in TECH_KEYWORDS}
    matched_set.update(extra_tech_skills)
    
    # Missing keywords should ONLY be important JD terms (missing from resume)
    missing_set = jd_keywords.difference(resume_keywords)
    
    # Optional: Refine missing set to remove single-occurrence non-tech jd words to reduce noise
    refined_missing = {kw for kw in missing_set if kw in TECH_KEYWORDS or jd_freq.get(kw, 0) > 1}
    
    matched_keywords = list(matched_set)
    missing_keywords = list(refined_missing)
    
    # Calculate basic ATS score as percentage of matched JD keywords
    # In a real-world scenario, weights could be applied to specific skills
    match_percentage = (len(matched_keywords) / len(jd_keywords)) * 100
    ats_score = int(round(match_percentage))
    
    # Generate suggestions
    add_suggestions = missing_keywords[:5] if missing_keywords else []
    
    improve_suggestions = []
    if ats_score < 70:
        improve_suggestions.append("Incorporate more keywords from the job description directly into your experience bullet points.")
    if len(resume_text.split()) < 200:
        improve_suggestions.append("Your resume seems slightly brief. Try expanding on your measurable achievements.")
        
    # Fake a removing suggestion for illustration
    # In a fully realized NLP, this could flag cliches like 'hard worker' or 'team player'
    remove_suggestions = []
    cliches = {"hard worker", "team player", "synergy", "think outside the box"}
    for cliche in cliches:
        if cliche in resume_text.lower():
            remove_suggestions.append(f"Consider removing the cliché term '{cliche}' and describing a specific instance instead.")

    return {
        "ats_score": ats_score,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "suggestions": {
            "add": add_suggestions,
            "remove": remove_suggestions,
            "improve": improve_suggestions
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
