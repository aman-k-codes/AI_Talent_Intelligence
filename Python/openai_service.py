import os
import json
from openai import AsyncOpenAI

async def call_openai(prompt: str) -> dict:
    """Calls OpenAI GPT-4o to generate structured JSON output."""
    client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    
    response = await client.chat.completions.create(
        model="gpt-4o",
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
        raise ValueError("Empty response from OpenAI.")
        
    return json.loads(content)
