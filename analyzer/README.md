# IPsec AI Analyzer Backend Engine

Independent Python engine and standalone CLI for analyzing IPsec VPN captures, extracting statistical flow features, running ML traffic classifiers, evaluating security policy compliance, calculating security/risk scores, and generating executive/technical PDF reports.

## Features
- **PCAP & PCAPNG Parsing**: Inspects IKEv1/IKEv2 exchange proposals, ESP SPIs, and AH headers.
- **Statistical Feature Extraction**: Calculates flow duration, packet rates, byte rates, packet length metrics, and inter-arrival time distributions.
- **ML Traffic Classifier**: Predicts encrypted traffic categories (VoIP, Web, File Transfer, etc.) with feature explainability.
- **Security Assessment Engine**: Deterministically computes 0-100 Security & Risk Scores and generates a Threat Matrix.
- **Report Generation**: Builds Executive and Technical PDF reports using ReportLab.
- **FastAPI REST API**: Provides endpoints for the React frontend client.
- **Standalone CLI**: Runs directly from the terminal without React.

## Quickstart

### 1. Run FastAPI Server
```bash
python -m analyzer.app.main
# Server runs on http://127.0.0.1:8000
```

### 2. Standalone CLI Usage
```bash
# Analyze PCAP capture
python -m analyzer.cli analyze capture.pcap

# Live interface capture
python -m analyzer.cli live --interface eth0 --duration 10

# Generate reports
python -m analyzer.cli report capture.pcap
```
