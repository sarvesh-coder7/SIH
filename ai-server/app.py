import os
import sys
from pathlib import Path

# Automatically switch to project virtualenv if running outside it
venv_python = Path(__file__).resolve().parent / "venv" / "Scripts" / "python.exe"
if venv_python.exists() and sys.executable.lower() != str(venv_python).lower():
    import subprocess
    sys.exit(subprocess.call([str(venv_python)] + sys.argv))

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from groq import Groq
import uvicorn


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

# Ensure .env is loaded from the same directory as this file
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()


# =========================================================
# AI CLIENTS INITIALIZATION
# =========================================================

gemini_client = None
groq_client = None

if GEMINI_API_KEY:
    try:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Gemini client: {e}", file=sys.stderr)

if GROQ_API_KEY:
    try:
        groq_client = Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Groq client: {e}", file=sys.stderr)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="SolveSphere AI Server",
    version="1.0.0"
)


# =========================================================
# CORS MIDDLEWARE
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3003",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8001",
        "http://127.0.0.1:8001",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST / RESPONSE MODELS
# =========================================================

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    provider: str


# =========================================================
# SYSTEM PROMPT
# =========================================================

SYSTEM_PROMPT = """You are SolveSphere AI, the virtual assistant for JH Innovation Connect (Jharkhand's societal problem-solving and innovation platform).

CORE INSTRUCTIONS:
1. BE CRISP & CONCISE: Give only the necessary, direct answer to the user's question. Do NOT dump long unsolicited essays, feature dumps, or lengthy overviews. Keep answers to 1-3 short paragraphs or 2-4 brief bullet points.
2. SIMPLE GREETINGS: If the user says "hi", "hello", "hey", "namaste", or similar greetings, reply with a simple, polite 1-2 sentence greeting (e.g., "Hello! Welcome to JH Innovation Connect. How can I help you today?"). NEVER dump platform features or lists for a greeting.
3. RELEVANT ANSWERS ONLY: Answer strictly what was asked. If the user asks how to report, explain reporting briefly. If they ask about tracking, explain tracking.
4. ROUTING & NAVIGATION COMMANDS: If the user asks to navigate or open a page (e.g. "open report", "report a problem", "go to dashboard", "view challenges", "login", "track problem"):
   - Acknowledge their request directly.
   - Include a navigation tag in your response:
     - `[NAVIGATE:submit-challenge]` for reporting a problem / submitting a challenge
     - `[NAVIGATE:citizen-my-challenges]` for tracking complaints or viewing my reported challenges
     - `[NAVIGATE:dashboard]` for opening the user dashboard
     - `[NAVIGATE:explore-challenges]` for exploring public challenges
     - `[NAVIGATE:industry-open-challenges]` for open problem statements
     - `[NAVIGATE:login]` for login
     - `[NAVIGATE:signup]` for registration
5. LANGUAGE: Respond naturally in the user's language (English, Hindi, etc.) politely and concisely."""


# =========================================================
# GEMINI - PRIMARY AI
# =========================================================

def ask_gemini(message: str) -> str:
    if not gemini_client:
        raise RuntimeError("Gemini client is not configured with GEMINI_API_KEY.")

    response = gemini_client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=(
            f"{SYSTEM_PROMPT}\n\n"
            f"Citizen message:\n{message}"
        ),
    )

    text = (response.text or "").strip()

    if not text:
        raise RuntimeError(
            "Gemini returned an empty response."
        )

    return text


# =========================================================
# GROQ - FALLBACK AI
# =========================================================

def ask_groq(message: str) -> str:
    if not groq_client:
        raise RuntimeError("Groq client is not configured with GROQ_API_KEY.")

    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": message,
            },
        ],
        temperature=0.3,
    )

    text = (
        response.choices[0]
        .message
        .content
        or ""
    ).strip()

    if not text:
        raise RuntimeError(
            "Groq returned an empty response."
        )

    return text


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "SolveSphere AI",
        "primary": "Gemini 3.1 Flash-Lite",
        "fallback": "Groq",
        "gemini_ready": gemini_client is not None,
        "groq_ready": groq_client is not None,
    }


# =========================================================
# CHAT ENDPOINT
# =========================================================

@app.post(
    "/chat",
    response_model=ChatResponse
)
def chat(request: ChatRequest):
    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    # -----------------------------------------------------
    # PRIMARY: GEMINI
    # -----------------------------------------------------
    try:
        response = ask_gemini(message)
        return ChatResponse(
            response=response,
            provider="gemini"
        )
    except Exception as gemini_error:
        print("Gemini error:", str(gemini_error), file=sys.stderr)

    # -----------------------------------------------------
    # FALLBACK: GROQ
    # -----------------------------------------------------
    try:
        response = ask_groq(message)
        return ChatResponse(
            response=response,
            provider="groq-fallback"
        )
    except Exception as groq_error:
        print("Groq fallback error:", str(groq_error), file=sys.stderr)
        raise HTTPException(
            status_code=502,
            detail="AI service is temporarily unavailable. Please verify API keys in .env."
        )


# =========================================================
# DIRECT EXECUTION
# =========================================================

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True)
