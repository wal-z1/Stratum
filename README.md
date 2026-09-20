# Stratum

Stratum is a web-based PCAP network traffic analyzer that transforms packet captures into flows, protocol events, correlated activity, and security findings through a compact investigation interface.

Stratum is open source, and contributions are welcome.

**Live Demo:** https://stratum-pcap.vercel.app

## Features

* Upload `.pcap`, `.pcapng`, and `.cap` capture files up to **4.5 MB**
* PCAP and PCAPNG parsing
* Packet-to-flow sessionization
* Protocol event extraction for:

  * HTTP
  * DNS
  * TLS
  * DHCP
  * ICMP
  * TCP
  * SMTP
  * FTP
  * IMAP
* DNS-to-connection correlation
* Event deduplication
* Security findings with:

  * Severity
  * Confidence
  * Category
  * Status
  * Details
  * Evidence
* Investigation views for:

  * Overview
  * Flows
  * Events
  * Findings
  * Hosts / Protocols
  * Technical Details
* Expandable flow and event metadata
* Protocol and endpoint summaries
* Drag-and-drop capture uploads
* Built-in sample capture browser
* Loading and error states
* Summary statistics for packets, flows, events, and findings
* Responsive light and dark themes
* Theme persistence using `stratum-theme`
* Configurable backend URL through `VITE_API_URL`

## Security Detectors

Stratum currently includes detectors for:

* Possible port scans
* Cleartext HTTP Basic credentials
* High DNS NXDOMAIN ratios
* Large network transfers

## Project Structure

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
    data/
      sampleCaptures.ts
    hooks/
      useCaptureAnalysis.ts
    lib/
      api.ts
      capture.ts
      utils.ts
    providers/
    types/
  package.json
  vite.config.ts
  tsconfig.app.json
```

## Requirements

Before running Stratum locally, make sure you have the following installed:

* Python 3.14+
* Node.js
* npm
* `uv`

## Local Development

### Backend

From the project root:

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend will run at:

```text
http://127.0.0.1:8000
```

### Frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend/Startum
npm install
```

Set the backend URL.

#### PowerShell

```powershell
$env:VITE_API_URL="http://127.0.0.1:8000"
```

Then start the development server:

```bash
npm run dev -- --host localhost --port 5173
```

The frontend will be available at:

```text
http://localhost:5173
```

## API

### Health Check

```http
GET /health
```

Example response:

```json
{
  "ok": true
}
```

### Analyze a Capture

```http
POST /analyze
Content-Type: multipart/form-data
```

The request must include the capture file in a form field named:

```text
file
```

Example:

```text
file=<pcap file>
```

Supported file extensions:

* `.pcap`
* `.pcapng`
* `.cap`

Maximum upload size:

```text
4.5 MB
```

The response includes capture metadata along with packet, flow, event, finding, and summary information.

## Validation

Before opening a pull request, validate both the frontend and backend.

### Frontend

```bash
cd frontend/Startum
npm run build
npm run lint
```

### Backend

```bash
cd backend
uv sync
uv run python -m compileall app
```

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make and test your changes.
4. Run the frontend and backend validation commands.
5. Commit your changes.
6. Open a pull request against the `main` branch.

Bug reports, improvements, documentation updates, and new features are all welcome.
