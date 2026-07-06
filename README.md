# Corporate Depth Analyzer

An Open Source Intelligence (OSINT) tool designed to map the global footprint, financial scale, and structural hierarchy of any corporate company using just its name. This application is designed to be hosted entirely within the GitHub ecosystem.

## 🚀 Overview

"Corporate Depth" measures a company's global influence across three core dimensions:
1. **Structural Depth:** Legal entities, parent companies, ultimate owners, and subsidiaries.
2. **Financial Depth:** Revenue, funding rounds, market capitalization, and acquisition history.
3. **Digital Depth:** Domain footprints, infrastructure tech stacks, and public code repositories.

---

## 🏗️ Architecture Options

Since GitHub Pages only hosts static frontend files, you can deploy this project using one of two architectural patterns:

### Option A: Serverless / Client-Side (Live Queries)
The frontend UI captures the company name and triggers direct API requests from the user's browser.
* **Frontend:** React, Vue, or Vanilla JS + Tailwind CSS hosted on **GitHub Pages**.
* **Data Fetching:** Direct browser-based `fetch()` calls to third-party APIs.
* **Security Note:** Requires users to input their own API keys in a settings panel, or routes requests through a free serverless proxy (e.g., Vercel/Netlify Functions) to protect private keys.

### Option B: Scheduled Automation (Pre-defined List)
Best for tracking a specific list of corporations (e.g., Fortune 500, top global tech firms).
* **Backend Automation:** A Python/Node.js scraper triggered daily or weekly via **GitHub Actions**.
* **Data Storage:** The automated script commits updated JSON files directly into this GitHub repository.
* **Frontend:** The GitHub Pages UI fetches and visualizes these pre-calculated JSON files instantly.

---

## 🔌 API Integration Matrix

To resolve a raw company name into a deep profile, this project integrates the following open and commercial data sources:

| Layer | Target Data | Recommended APIs |
| :--- | :--- | :--- |
| **Identity Lookup** | Entity Resolution | OpenCorporates API, People Data Labs (PDL) |
| **Structural** | Subsidiaries & Hierarchy | OpenCorporates, Wikidata API |
| **Financial (Public)** | Market Cap, Revenue, Officers | Yahoo Finance (yfinance), Alpha Vantage |
| **Financial (Private)**| Funding, Investors, Valuation | Crunchbase API, Dealroom |
| **Digital Footprint** | Tech Stack & Web Domains | BuiltWith API, Hunter.io, Shodan |

---

## 🛠️ Step-by-Step Implementation Plan

1. **Entity Resolution (The Search Bar):**
   * User types a query (e.g., "Alphabet").
   * The app calls the OpenCorporates API to find matching legal entities.
   * User selects the exact matching corporation from the list.

2. **Concurrent Deep Scraping:**
   * Trigger parallel async fetches to financial, structural, and digital APIs using the confirmed entity name or website domain.

3. **Data Synthesis (Optional LLM Layer):**
   * Send the combined raw JSON payload to a lightweight LLM API (OpenAI/Anthropic) to generate a concise narrative summary of the corporation's market positioning.

4. **Interactive Visualization:**
   * **Corporate Tree:** Render a hierarchical family tree (Parent companies vs. Subsidiaries) using **D3.js** or **Vis.js**.
   * **Financial Analytics:** Display historical revenue trends and valuation milestones using **Chart.js** or **ApexCharts**.

---

## ⚙️ Quick Start (Local Development)

### Prerequisites
* Node.js (v18+) or Python (3.10+)
* API Keys for OpenCorporates and Yahoo Finance

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com
   cd corporate-depth-analyzer
   ```
2. Install dependencies:
   ```bash
   npm install  # For frontend setup
   # OR
   pip install -r requirements.txt  # For Python GitHub Actions setup
   ```
3. Run the development environment:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment to GitHub Pages

1. Navigate to your repository settings on GitHub.
2. Scroll down to the **Pages** section in the left sidebar.
3. Under **Build and deployment**, set the source to **Deploy from a branch**.
4. Select `main` (or `gh-pages`) and the `/root` (or `/docs`) folder, then click **Save**.
5. Your app will be live at `https://github.io`.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
