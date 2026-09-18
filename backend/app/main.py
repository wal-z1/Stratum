from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .finallyze import analyze_capture, build_response


app = FastAPI(title="Stratum")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD = 50 * 1024 * 1024
CHUNK_SIZE = 1024 * 1024
SUPPORTED_EXTENSIONS = {".pcap", ".pcapng", ".cap"}


async def read_upload(file: UploadFile) -> bytes:
    if not file.filename:
        raise HTTPException(400, "Missing file")

    name = file.filename.lower()
    if not any(name.endswith(ext) for ext in SUPPORTED_EXTENSIONS):
        raise HTTPException(400, "Unsupported file type. Use .pcap, .pcapng or .cap")

    data = bytearray()
    while chunk := await file.read(CHUNK_SIZE):
        data.extend(chunk)
        if len(data) > MAX_UPLOAD:
            raise HTTPException(413, "File too large")

    if not data:
        raise HTTPException(400, "Empty file")

    return bytes(data)


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    raw = await read_upload(file)

    try:
        packets, flows, events, findings = analyze_capture(raw)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except Exception as exc:
        raise HTTPException(500, "Analysis failed") from exc

    return build_response(findings, packets, flows, events)