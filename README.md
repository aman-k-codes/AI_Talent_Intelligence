# AI Talent Intelligence 🧠🔍

**AI Talent Intelligence** is an automated pipeline designed to transform raw PDF resumes into enriched candidate profiles. By combining Natural Language Processing (NLP) with concurrent API data fetching, it extracts technical skills, identifies candidate identities, and performs deep-dive enrichment via the GitHub API.

---

## 🚀 Key Features

* **Multi-Layer PDF Extraction**: Uses `PyMuPDF` to extract both visible text and hidden metadata/hyperlinks.
* **NLP Skill Discovery**: Utilizes `spaCy`'s Large Language Model and `PhraseMatcher` to identify technical stacks with high precision.
* **Text Normalization Engine**: A custom regex pipeline that handles Unicode normalization, cleans noise (bullets, non-ASCII characters), and prepares text for analysis.
* **Automated Social Discovery**: Automatically identifies GitHub profiles from resume links and extracts usernames.
* **Concurrent Enrichment**: Uses `ThreadPoolExecutor` to fetch multiple GitHub data points (repositories, organizations, starred projects, etc.) in parallel, significantly reducing processing time.

---

## 🛠️ Tech Stack

* **Language:** Python 3.x
* **NLP Engine:** [spaCy](https://spacy.io/) (`en_core_web_lg`)
* **PDF Parsing:** [PyMuPDF (fitz)](https://pymupdf.readthedocs.io/)
* **Network/API:** [Requests](https://requests.readthedocs.io/) with Session persistence
* **Concurrency:** `concurrent.futures`

---

## 📋 System Architecture



1.  **Ingestion**: Parses PDF files to extract text and URIs.
2.  **Entity Recognition**: Detects the candidate's name using spaCy NER (`PERSON` label).
3.  **Skill Mapping**: Matches text against a comprehensive taxonomy of programming languages, frameworks, and infrastructure tools.
4.  **GitHub Integration**: 
    * Finds `github.com` links.
    * Queries the GitHub API for the user's base profile.
    * Spawns worker threads to fetch sub-resources (Repos, Orgs, Gists) simultaneously.

---

## ⚙️ Setup & Installation

### 1. Clone & Install Dependencies
```bash
git clone [https://github.com/aman-k-codes/AI_Talent_Intelligence.git](https://github.com/aman-k-codes/AI_Talent_Intelligence.git)
cd AI_Talent_Intelligence
pip install pymupdf spacy requests
python -m spacy download en_core_web_lg