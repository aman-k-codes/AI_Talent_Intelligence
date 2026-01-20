import requests
import os
import re
import fitz
import spacy
import unicodedata
from spacy.matcher import PhraseMatcher
from concurrent.futures import ThreadPoolExecutor, as_completed



def get_refined_skills(text):
    doc = nlp(text)
    matcher = PhraseMatcher(nlp.vocab)
    
    # List of skills you want to ensure are caught
    skill_list = ["Python", "Machine Learning", "REST API", "Docker", "Flask", "Laravel", "MySQL"]
    patterns = [nlp.make_doc(text) for text in skill_list]
    matcher.add("SKILLS", patterns)
    
    matches = matcher(doc)
    found_skills = set([doc[start:end].text for match_id, start, end in matches])
    
    return found_skills

nlp = spacy.load("en_core_web_lg")

candidateRawData = {
    "name": None,
    "address": None,
    "education": None,
    "experience": None,
    "skills": [],
    "resume_text": "",
    "links": [],
    "github": None,
}
github_details = {
    "name": None,
    "followers": None,
    "followings": None,
    "repositories": [],
}

def normalize_text(text: str) -> str:
    if not text:
        return ""

    text = unicodedata.normalize("NFKD", text)
    text = text.lower()
    text = re.sub(r"[–—−]", "-", text)
    text = re.sub(r"[•●▪►■·]", " ", text)
    text = re.sub(r"[\x00-\x1f\x7f-\x9f]", " ", text)
    text = re.sub(r"[^a-z0-9\.\-\+\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text


def extract_text_from_pdf(path):
    pages = fitz.open(path)
    text = ''
    links = []

    for page in pages:
        text += page.get_text()
        for url in page.get_links():
            if 'uri' in url:
                links.append(url['uri'])

    return text, links

def extract_github_links(links):
    github_links = set()

    for link in links:
        if link and "github.com" in link:
            github_links.add(link.split("?")[0])

    return list(github_links)

def get_github_username(url):
    return url.rstrip("/").split("github.com/")[-1].split("/")[0]

def call_api(url,timeout=10):
    """
    Fetch GitHub user profile. Token can be passed or provided via
    GITHUB_TOKEN or GH_TOKEN env var. Returns JSON on success or raises an HTTPError.
    """
    gittoken = os.environ.get("GITHUB_TOKEN")
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "my-script-or-app",  # set a descriptive user agent
    }
    if gittoken:
        headers["Authorization"] = f"Bearer {gittoken}"
    resp = requests.get(url, headers=headers, timeout=timeout)

    resp.raise_for_status()
    return resp.json()


def get_github_profile(username, timeout=10):
    url = f"https://api.github.com/users/{username}"
    resp = call_api(url)
    return resp

def get_resume_name(text):
    tokens = nlp(text)
    for token in tokens.ents:
        if token.label_ == 'PERSON':
            return token
        else:
            return null
            

SKILLS = {
    # Languages & Frameworks
    "python", "java", "php", "laravel", "sql", "mysql", "javascript", "typescript",
    "flask", "django", "fastapi", "node.js", "react", "vue",
    
    # Machine Learning & AI
    "ml", "machine learning", "nlp", "natural language processing", "deep learning", 
    "computer vision", "pytorch", "tensorflow", "keras", "scikit-learn", "pandas", 
    "numpy", "opencv", "huggingface", "llm", "bert", "transformers",
    
    # Backend & Infrastructure
    "backend", "rest", "api", "rest api", "graphql", "microservices", "docker", 
    "kubernetes", "aws", "gcp", "azure", "linux", "git", "postman", "redis", 
    "rabbitmq", "celery", "nginx", "ci/cd",
    
    # Data & Database
    "postgresql", "mongodb", "sqlite", "elasticsearch", "data engineering", 
    "data science", "web scraping", "beautifulsoup", "selenium"
}

def get_resume_skills(text):
    doc = nlp(text.lower())
    found_skills = set()

    for token in doc:
        if token.text in SKILLS:
            found_skills.add(token.text)

    return list(found_skills)


# Improvement reuqired bacause not accurate details
def extract_address(text):

    doc = nlp(text)
    address = []

    for ent in doc.ents:
        if ent.label_ in ["GPE", "LOC", "FAC"]:
            address.append(ent.text)

    return list(set(address))

def extract_experience(text):
    DATE_PATTERN = r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s?\d{4}\s?[-–]\s?(present|\d{4})"
    experience = []
    lines = text.lower().split("\n")

    for line in lines:
        if re.search(DATE_PATTERN, line):
            experience.append(line.strip())

    return experience

def extract_education(text):
    DEGREES = [
        "bachelor", "b.tech", "b.e", "bsc", "msc",
        "master", "m.tech", "mba", "phd", "doctorate"
    ]

    education = []
    lines = text.lower().split("\n")

    for line in lines:
        for degree in DEGREES:
            if degree in line:
                education.append(line.strip())
                break

    return education

rawText, rawLinks = extract_text_from_pdf("resume/Aman_Kumar_Resume_entry_lvl_mld.pdf")
candidateRawData["resume_text"] = rawText
candidateRawData["links"] = rawLinks

github_url = extract_github_links(rawLinks)
github_username = get_github_username(github_url[0])

github_profile = get_github_profile(github_username)
candidateRawData["github"] = github_profile

github_details['followers'] = call_api(candidateRawData['github']["followers_url"])
# Format the following_url by removing the {/other_user} template
following_url = candidateRawData['github']["following_url"].replace("{/other_user}", "")
github_details['followings'] = call_api(following_url)
repos = call_api(candidateRawData['github']["repos_url"])
repositories = []
for repo in repos:
    repositories.append({
        'id': repo['id'],
        'node_id': repo['node_id'],
        'name': repo['name'],
        'full_name': repo['full_name'],
        'private': repo['private'],
        'owner': repo['owner'],
        'html_url': repo['html_url'],
        'description': repo['description'],
        'branches_url': repo['branches_url'],
        
        'tools': call_api(repo['languages_url']),

        'contributors_url': repo['contributors_url'],
        'created_at': repo['created_at'],
        'updated_at': repo['updated_at'],
        'pushed_at': repo['pushed_at'],
        'git_url': repo['git_url'],
        'ssh_url': repo['ssh_url'],
        'clone_url': repo['clone_url'],

        'size': repo['size'],
        'stargazers_count': repo['stargazers_count'],
        'watchers_count': repo['watchers_count'],
        'language': repo['language'],
        'forks_count': repo['forks_count'],
        'open_issues_count': repo['open_issues_count'],
        'topics': repo['topics'],
        'visibility': repo['visibility'],
        'forks': repo['forks'],
        'default_branch': repo['default_branch'],
    })

github_details['repositories'] = repositories
github_details['name'] = candidateRawData['github']["name"]
candidateRawData['github'] = github_details

candidateRawData['name'] = get_resume_name(candidateRawData['resume_text'])
candidateRawData['resume_text'] = normalize_text(candidateRawData['resume_text'])

candidateRawData['address'] = extract_address(candidateRawData['resume_text'])
candidateRawData['education'] = extract_education(candidateRawData['resume_text'])
candidateRawData['experience'] = extract_experience(candidateRawData['resume_text'])
candidateRawData['skills'] = get_resume_skills(candidateRawData['resume_text'])

print(candidateRawData)