import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FinancialChart from './FinancialChart'
import CorporateTree from './CorporateTree'
import { fetchFreeCompanyData } from '../services/freeDataSources'

const CompanyResults = ({ company, apiKeys }) => {
  const [financialData, setFinancialData] = useState(null)
  const [structuralData, setStructuralData] = useState(null)
  const [freeData, setFreeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchCompanyData()
  }, [company])

  const fetchCompanyData = async () => {
    setLoading(true)
    
    try {
      // Always fetch free data first
      const freeResults = await fetchFreeCompanyData(company.company.name)
      setFreeData(freeResults)

      // Fetch financial data if Alpha Vantage key is available
      if (apiKeys.alphaVantage) {
        await fetchFinancialData()
      }

      // Fetch structural data from OpenCorporates if key is available
      if (apiKeys.openCorporates && company.company.source !== 'free') {
        await fetchStructuralData()
      }
    } catch (error) {
      console.error('Error fetching company data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFinancialData = async () => {
    try {
      // Try to get stock symbol from company name (this is a simplified approach)
      const symbol = getStockSymbol(company.company.name)
      
      if (symbol) {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKeys.alphaVantage}`
        )
        
        if (response.data && !response.data['Error Message']) {
          setFinancialData(response.data)
        }
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
    }
  }

  const fetchStructuralData = async () => {
    try {
      const response = await axios.get(
        `https://api.opencorporates.com/companies/${company.company.jurisdiction_code}/${company.company.company_number}?api_token=${apiKeys.openCorporates}`
      )
      
      if (response.data && response.data.results) {
        setStructuralData(response.data.results.company)
      }
    } catch (error) {
      console.error('Error fetching structural data:', error)
    }
  }

  const getStockSymbol = (companyName) => {
    // Simplified symbol mapping - in production, use a proper API
    const symbolMap = {
      'alphabet': 'GOOGL',
      'google': 'GOOGL',
      'microsoft': 'MSFT',
      'apple': 'AAPL',
      'amazon': 'AMZN',
      'tesla': 'TSLA',
      'meta': 'META',
      'facebook': 'META',
      'nvidia': 'NVDA',
      'netflix': 'NFLX',
      'ibm': 'IBM',
      'oracle': 'ORCL',
      'intel': 'INTC',
      'amd': 'AMD',
      'salesforce': 'CRM',
      'adobe': 'ADBE'
    }
    
    const lowerName = companyName.toLowerCase()
    return symbolMap[lowerName] || null
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'financial', label: 'Financial', icon: '💰' },
    { id: 'structure', label: 'Structure', icon: '🏢' },
    { id: 'digital', label: 'Digital', icon: '🌐' }
  ]

  if (loading) {
    return (
      <div className="mt-8 bg-slate-800 rounded-xl p-8 border border-slate-700">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="w-12 h-12 text-blue-400 loading-spinner mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-400">Analyzing company data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 fade-in">
      {/* Company Header */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{company.company.name}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {company.company.jurisdiction_code}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {company.company.company_type}
              </span>
              {company.company.company_number && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  #{company.company.company_number}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Search
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        {activeTab === 'overview' && <OverviewTab company={company} financialData={financialData} structuralData={structuralData} freeData={freeData} />}
        {activeTab === 'financial' && <FinancialTab financialData={financialData} freeData={freeData} />}
        {activeTab === 'structure' && <StructureTab structuralData={structuralData} company={company} freeData={freeData} />}
        {activeTab === 'digital' && <DigitalTab company={company} freeData={freeData} />}
      </div>
    </div>
  )
}

const OverviewTab = ({ company, financialData, structuralData, freeData }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-3 gap-6">
      <MetricCard 
        title="Market Cap" 
        value={financialData?.MarketCapitalization ? `$${(parseFloat(financialData.MarketCapitalization) / 1000000000).toFixed(2)}B` : 'N/A'} 
        icon="💰"
      />
      <MetricCard 
        title="Revenue" 
        value={financialData?.RevenueTTM ? `$${(parseFloat(financialData.RevenueTTM) / 1000000000).toFixed(2)}B` : 'N/A'} 
        icon="📈"
      />
      <MetricCard 
        title="Employees" 
        value={financialData?.FullTimeEmployees ? parseInt(financialData.FullTimeEmployees).toLocaleString() : (freeData?.wikidata?.employees || 'N/A')} 
        icon="👥"
      />
    </div>

    <div className="border-t border-slate-700 pt-6">
      <h3 className="text-xl font-semibold text-white mb-4">Company Summary</h3>
      <p className="text-slate-300 leading-relaxed">
        {freeData?.wikipedia?.extract || freeData?.wikidata?.description || financialData?.Description || company.company.name + ' is a company registered in ' + company.company.jurisdiction_code + '. ' +
          'This analysis provides insights into the company\'s corporate structure, financial performance, and digital presence.'}
      </p>
    </div>

    <div className="border-t border-slate-700 pt-6">
      <h3 className="text-xl font-semibold text-white mb-4">Key Information</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <InfoItem label="Jurisdiction" value={company.company.jurisdiction_code} />
        <InfoItem label="Company Type" value={company.company.company_type} />
        <InfoItem label="Founded" value={freeData?.wikidata?.founded || structuralData?.incorporation_date || 'N/A'} />
        <InfoItem label="Headquarters" value={freeData?.wikidata?.headquarters || structuralData?.registered_address_in_full || 'N/A'} />
        <InfoItem label="Industry" value={freeData?.wikidata?.industry || 'N/A'} />
        <InfoItem label="Website" value={freeData?.wikidata?.website || 'N/A'} />
      </div>
    </div>
  </div>
)

const FinancialTab = ({ financialData, freeData }) => {
  if (!financialData && !freeData?.wikidata?.revenue) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Financial data requires Alpha Vantage API key</p>
        <p className="text-sm text-slate-500">Add your API key in Settings to view financial information</p>
        {freeData?.wikidata?.revenue && (
          <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-lg">
            <p className="text-green-300 text-sm">Basic revenue data available from Wikidata: {freeData.wikidata.revenue}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <MetricCard title="52 Week High" value={financialData?.FiftyTwoWeekHigh || 'N/A'} icon="📊" />
        <MetricCard title="52 Week Low" value={financialData?.FiftyTwoWeekLow || 'N/A'} icon="📊" />
        <MetricCard title="P/E Ratio" value={financialData?.PERatio || 'N/A'} icon="📈" />
        <MetricCard title="Dividend Yield" value={financialData?.DividendYield || 'N/A'} icon="💰" />
      </div>

      {freeData?.wikidata?.revenue && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Wikidata Revenue Info</h4>
          <p className="text-slate-300">{freeData.wikidata.revenue}</p>
        </div>
      )}

      {financialData && (
        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Financial Performance</h3>
          <FinancialChart financialData={financialData} />
        </div>
      )}
    </div>
  )
}

const StructureTab = ({ structuralData, company, freeData }) => (
  <div className="space-y-6">
    <div className="bg-slate-700/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Corporate Structure</h3>
      <CorporateTree company={company} structuralData={structuralData} freeData={freeData} />
    </div>

    {freeData?.wikidata && (
      <div className="border-t border-slate-700 pt-6">
        <h3 className="text-xl font-semibold text-white mb-4">Wikidata Structure Info</h3>
        <div className="space-y-3">
          <InfoItem label="Parent Company" value={freeData.wikidata.parentCompany || 'N/A'} />
          <InfoItem label="Subsidiaries" value={freeData.wikidata.subsidiaries?.length ? `${freeData.wikidata.subsidiaries.length} entities` : 'N/A'} />
          <InfoItem label="Stock Symbol" value={freeData.wikidata.stockSymbol || 'N/A'} />
        </div>
      </div>
    )}

    {structuralData && (
      <div className="border-t border-slate-700 pt-6">
        <h3 className="text-xl font-semibold text-white mb-4">Registered Details</h3>
        <div className="space-y-3">
          <InfoItem label="Registered Address" value={structuralData?.registered_address_in_full || 'N/A'} />
          <InfoItem label="Registry URL" value={structuralData?.registry_url || 'N/A'} />
        </div>
      </div>
    )}
  </div>
)

const DigitalTab = ({ company, freeData }) => (
  <div className="space-y-6">
    <div className="bg-slate-700/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Digital Footprint Analysis</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {freeData?.github ? (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <span className="text-xl">🐙</span>
              GitHub Organization
            </h4>
            <div className="space-y-1 text-sm">
              <InfoItem label="Repositories" value={freeData.github.publicRepos} />
              <InfoItem label="Followers" value={freeData.github.followers} />
              <InfoItem label="Created" value={new Date(freeData.github.createdAt).toLocaleDateString()} />
            </div>
            {freeData.github.url && (
              <a href={freeData.github.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline mt-2 block">
                View GitHub Profile →
              </a>
            )}
          </div>
        ) : (
          <DigitalMetric title="GitHub Organization" status="Not Found" />
        )}
        
        {freeData?.wikipedia?.url ? (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <span className="text-xl">📖</span>
              Wikipedia Presence
            </h4>
            <p className="text-slate-300 text-sm mb-2">Company has Wikipedia page</p>
            <a href={freeData.wikipedia.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">
              Read Wikipedia Article →
            </a>
          </div>
        ) : (
          <DigitalMetric title="Wikipedia Presence" status="Not Found" />
        )}
        
        {freeData?.wikidata?.website ? (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <span className="text-xl">🌐</span>
              Official Website
            </h4>
            <a href={freeData.wikidata.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline">
              {freeData.wikidata.website} →
            </a>
          </div>
        ) : (
          <DigitalMetric title="Official Website" status="Not Found" />
        )}
        
        <DigitalMetric title="Tech Stack" status="Requires BuiltWith API" />
        <DigitalMetric title="Domain Analysis" status="Requires Shodan API" />
        <DigitalMetric title="Email Patterns" status="Requires Hunter.io API" />
      </div>
    </div>

    <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
      <p className="text-sm text-green-300">
        <strong>✓ Free Data Sources:</strong> Wikipedia, Wikidata, and GitHub API data shown above. Add API keys in Settings for enhanced digital footprint analysis.
      </p>
    </div>
  </div>
)

const MetricCard = ({ title, value, icon }) => (
  <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <h4 className="text-sm font-medium text-slate-400">{title}</h4>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
)

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-slate-400">{label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
)

const DigitalMetric = ({ title, status }) => (
  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
    <h4 className="text-white font-medium mb-2">{title}</h4>
    <span className="text-xs text-slate-500">{status}</span>
  </div>
)

export default CompanyResults
