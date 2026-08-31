import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.analysis import router as analysis_router
from .api.live import router as live_router
from .api.reports import router as reports_router
from .api.history import router as history_router
from .storage.database import init_db

app = FastAPI(
    title="IPsec AI Analyzer Engine API",
    version="1.0.0",
    description="Standalone Python engine for real-time and PCAP network security assessment & traffic classification."
)

# Enable CORS for frontend (e.g. http://localhost:5173 or http://localhost:3000)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers under /api prefix
app.include_router(analysis_router, prefix="/api", tags=["Analysis"])
app.include_router(live_router, prefix="/api", tags=["Live Capture"])
app.include_router(reports_router, prefix="/api", tags=["Reports"])
app.include_router(history_router, prefix="/api", tags=["History"])

@app.on_event("startup")
def on_startup():
    init_db()
    print("[SERVER STARTUP] IPsec AI Analyzer Engine initialized successfully on port 8000.")

@app.get("/")
def root():
    return {
        "service": "IPsec AI Analyzer Engine API",
        "status": "ONLINE",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("analyzer.app.main:app", host="127.0.0.1", port=8000, reload=True)
