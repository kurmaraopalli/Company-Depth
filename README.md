# Company-Depth

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
* Node.js (v18+)
* **No API keys required** for basic functionality (uses free sources)
* Optional API keys for enhanced data:
  - OpenCorporates API key (for detailed corporate registry data)
  - Alpha Vantage API key (for financial market data)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Company-Depth.git
   cd Company-Depth
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development environment:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:3000/Company-Depth/`

### Data Source Options
The app supports **three data source modes**:

1. **Free Sources Only** (No API keys required)
   - Uses Wikidata, Wikipedia, and GitHub APIs
   - Provides company search, descriptions, structure info, and digital footprint
   - Works immediately without any setup

2. **Auto Mode** (Recommended)
   - Uses free sources by default
   - Automatically enhances with API keys when available
   - Best of both worlds

3. **API Only** (Requires API keys)
   - Uses OpenCorporates and Alpha Vantage APIs
   - More detailed corporate registry and financial data
   - Requires API key setup

### Optional API Keys Setup
For enhanced data, click the **Settings** button and add:
- **OpenCorporates API key** (detailed corporate data)
  - Get free key at: https://opencorporates.com/api
- **Alpha Vantage API key** (financial market data)
  - Get free key at: https://www.alphavantage.co/support/#api-key

---

## 🌐 Deployment to GitHub Pages

1. Navigate to your repository settings on GitHub.
2. Scroll down to the **Pages** section in the left sidebar.
3. Under **Build and deployment**, set the source to **Deploy from a branch**.
4. Select `main` (or `gh-pages`) and the `/root` (or `/docs`) folder, then click **Save**.
5. Your app will be live at `https://YOUR_USERNAME.github.io/Company-Depth`.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Current Implementation

The project has been implemented using **Option A (Serverless/Client-Side)** architecture:

### ✅ Implemented Features
- **Company Search**: Real-time search using Wikidata (free) or OpenCorporates API
- **Entity Resolution**: Company selection from search results
- **Free Data Sources**: Integration with Wikidata, Wikipedia, and GitHub APIs (no keys required)
- **Financial Data**: Integration with Alpha Vantage API for market data (optional)
- **Structural Visualization**: D3.js-based corporate hierarchy tree
- **Financial Charts**: Chart.js-based revenue and profit analytics
- **Digital Footprint**: GitHub organization data, Wikipedia presence, official websites
- **API Key Management**: Secure local storage of API keys
- **Data Source Modes**: Auto, Free Only, and API Only options
- **Responsive UI**: Modern interface with Tailwind CSS

### 🔧 Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Visualization**: D3.js
- **API Client**: Axios

### 🚀 Usage
1. Select data source mode (Auto recommended for best results)
2. Enter a company name in the search bar
3. Select the matching company from the dropdown
4. View comprehensive analysis across Overview, Financial, Structure, and Digital tabs
5. Switch between companies using the "New Search" button

### 📝 API Integration Notes
- **Free Sources**: Wikidata, Wikipedia, GitHub APIs (no keys required)
- **OpenCorporates**: Optional for detailed corporate registry data
- **Alpha Vantage**: Optional for financial market data
- API keys are stored locally in browser localStorage
- No server-side components needed - fully client-side architecture
- Works immediately without any API keys using free sources
