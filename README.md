# Stratum

Stratum is a web-based PCAP network traffic analyzer. It parses packet captures, groups traffic into flows, extracts protocol events, correlates network activity, and returns security findings through a simple web interface.

Stratum is open source and open for pull requests.

## Features

* Upload `.pcap`, `.pcapng`, and `.cap` network captures
* Maximum capture size of 50 MB
* PCAP and PCAPNG parsing
* Packet-to-flow sessionization
* HTTP, DNS, TLS, DHCP, ICMP, TCP, SMTP, FTP, and IMAP event extraction
* DNS-to-connection correlation and event deduplication
* Severity, confidence, category, status, detail, and evidence for findings
* React interface with drag-and-drop capture uploads
* Sample capture analysis
* Loading and backend error states
* Summary statistics for packets, flows, events, and findings
* Severity-sorted findings
* Responsive interface built with React, Vite, Tailwind CSS, and reusable UI components
* In-memory capture processing without application-level database or file persistence

### Current detectors

Stratum currently includes detectors for:

* Possible port scans
* Cleartext HTTP Basic credentials
* High DNS NXDOMAIN ratios
* Large network transfers

Current detector thresholds include:

* Port scan: 15 or more unique TCP destination ports between a source and target
* Cleartext credentials: HTTP Basic Authorization transmitted without TLS
* NXDOMAIN activity: at least 20 DNS responses with an NXDOMAIN ratio of 40% or greater
* Large transfer: TCP or UDP flow containing at least 10 MB of traffic

## Structure

```text
backend/
    app/
        main.py             FastAPI application and upload endpoint
        parser.py           PCAP and PCAPNG packet parsing
        session.py          Packet-to-flow sessionization
        extractors.py       Protocol event extraction
        correlator.py       Event enrichment, DNS linking, deduplication
        findings.py         Security detectors
        finallyze.py        Analysis pipeline and API response packaging
        models.py           Packet, flow, event, and finding models
        analyzer.py         Event extraction compatibility layer

    pyproject.toml           Python project dependencies
    uv.lock                 Locked Python environment

frontend/
    Startum/
        src/
            App.tsx                     Main application composition
            components/
                layout/                 Application shell and header
                upload/                 Capture upload interface
                results/                Summary and finding components
                ui/                     Shared UI primitives
            hooks/
                useCaptureAnalysis.ts    Capture analysis state and workflow
            lib/
                api.ts                  Backend API client
                utils.ts                Shared frontend utilities
            types/
                analysis.ts             API TypeScript types

        package.json
        vite.config.ts
        tsconfig.app.json
```

## Requirements

* Python 3.14+
* Node.js
* npm
* uv

## Local development

Backend:

```powershell
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

The API runs at:

```text
http://127.0.0.1:8000
```

Health endpoint:

```text
http://127.0.0.1:8000/health
```

Frontend, in another terminal:

```powershell
cd frontend/Startum
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

Frontend environment:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## API

### Health check

```http
GET /health
```

Response:

```json
{
  "ok": true
}
```

### Analyze capture

```http
POST /analyze
Content-Type: multipart/form-data
```

Form field:

```text
file=<pcap file>
```

Supported file extensions:

```text
.pcap
.pcapng
.cap
```

Maximum upload size:

```text
50 MB
```

Example response:

```json
{
  "summary": {
    "packets": 3,
    "flows": 2,
    "events": 3
  },
  "count": 0,
  "findings": []
}
```

A finding can contain:

```json
{
  "id": "finding-id",
  "title": "Possible port scan",
  "category": "recon",
  "severity": "medium",
  "status": "warn",
  "confidence": "medium",
  "detail": "Description of the detected activity",
  "evidence": [
    "Evidence item"
  ]
}
```

## Analysis pipeline

```text
PCAP
  ↓
Packets
  ↓
Flows
  ↓
Protocol Events
  ↓
Correlation
  ↓
Security Detectors
  ↓
Findings
  ↓
API Response
  ↓
Web Interface
```

## Capture storage

Stratum does not currently persist uploaded captures in an application database or write them to permanent server storage.

The frontend keeps the selected capture and result in memory during the browser session. The capture is uploaded to the FastAPI backend, processed in memory, and the resulting analysis is returned to the browser.

Refreshing the page clears the current frontend analysis state.

Stratum should therefore not be considered a browser-only analyzer: uploaded captures are transmitted to the configured backend server for processing.

## Validation

Frontend:

```powershell
cd frontend/Startum
npm run build
npm run lint
```

Backend:

```powershell
cd backend
uv sync
uv run python -m compileall app
```

Run the backend locally and verify:

```text
GET http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "ok": true
}
```

## Contributing

Pull requests are welcome.

Fork the repository, create a feature branch, make your changes, validate the frontend and backend, and open a pull request against `main`.

## About

Stratum — A web-based network capture analyzer for converting PCAP traffic into structured flows, protocol events, and security findings.

Built with FastAPI, Python, dpkt, React, TypeScript, Vite, and Tailwind CSS.
