import os
import json
from groq import AsyncGroq

async def call_groq(prompt: str) -> dict:
    """Calls Groq LLaMA/Mixtral model to generate structured JSON output."""
    client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY"))
    
    response = await client.chat.completions.create(
        model="mixtral-8x7b-32768", # You can also use llama3-70b-8192
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": "You are an expert ATS resume optimizer. Respond ONLY in valid JSON matching exactly this schema: {\"summary\": \"...\", \"skills\": \"...\", \"experience\": \"...\", \"projects\": \"...\"}. Do NOT hallucinate new jobs, only enhance existing."
            },
            {
                "role": "user", 
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=2000
    )
    
    content = response.choices[0].message.content
    if not content:
        raise ValueError("Empty response from Groq.")
        
    return json.loads(content)
