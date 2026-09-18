# Stratum

Stratum is a web-based PCAP network traffic analyzer. It parses packet captures, groups traffic into flows, extracts protocol events, correlates activity, runs security detectors, and presents investigation data through a compact web interface.

Open source and open for pull requests.

## Features

- Upload `.pcap`, `.pcapng`, `.cap` captures (max 4.5 MB)
- PCAP and PCAPNG parsing
- Packet-to-flow sessionization
- HTTP, DNS, TLS, DHCP, ICMP, TCP, SMTP, FTP, and IMAP event extraction
- DNS-to-connection correlation and event deduplication
- Security findings with severity, confidence, category, status, detail, and evidence
- Investigation UI: Overview, Flows, Events, Findings, Hosts / Protocols, Technical details
- Expandable flow and event metadata
- Protocol and endpoint summaries
- Drag-and-drop uploads and sample capture browser
- Loading and error states
- Summary statistics for packets, flows, events, and findings
- Responsive light and dark themes
- Theme persistence using `stratum-theme`
- Backend URL configurable through `VITE_API_URL`

## Detectors

- Possible port scans
- Cleartext HTTP Basic credentials
- High DNS NXDOMAIN ratios
- Large network transfers

## Structure

```text
backend/
  app/
    main.py
    parser.py
    session.py
    extractors.py
    correlator.py
    findings.py
    finallyze.py
    models.py
    analyzer.py
  pyproject.toml
  uv.lock

frontend/Startum/
  public/
  src/
    components/
    data/sampleCaptures.ts
    hooks/useCaptureAnalysis.ts
    lib/api.ts
    lib/capture.ts
    lib/utils.ts
    providers/
    types/
  package.json
  vite.config.ts
  tsconfig.app.json
```

## Requirements

- Python 3.14+
- Node.js, npm, uv

## Local development

Backend:

```powershell
cd backend
uv sync
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend, in another terminal:

```powershell
cd frontend/Startum
$env:VITE_API_URL="http://127.0.0.1:8000"
npm install
npm run dev -- --host localhost --port 5173
```

Runs at `http://localhost:5173`.

## API

Health:

```http
GET /health
```

```json
{ "ok": true }
```

Analyze:

```http
POST /analyze
Content-Type: multipart/form-data
```

Form field: `file=<pcap file>`

Supported: `.pcap`, `.pcapng`, `.cap`
Max size: `4.5 MB`

Response includes summary counts, packets, flows, events, findings, and capture metadata.

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

## Contributing

Pull requests are welcome. Fork, branch, validate, and open a PR against `main`.