import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { fetchWikidataCompany } from '../services/freeDataSources'

const SearchBar = ({ onCompanySelect, apiKeys }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [dataSource, setDataSource] = useState('free') // 'auto', 'free', 'api'

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 1) {
        searchCompanies()
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [query, dataSource])

  const searchCompanies = async () => {
    setLoading(true)
    setError(null)

    // Auto mode: try API first, fall back to free sources
    if (dataSource === 'auto' && apiKeys.openCorporates) {
      try {
        const response = await axios.get(
          `https://api.opencorporates.com/companies/search?q=${encodeURIComponent(query)}&api_token=${apiKeys.openCorporates}`
        )

        if (response.data && response.data.results && response.data.results.companies?.length > 0) {
          setResults(response.data.results.companies)
          setShowResults(true)
          setLoading(false)
          return
        }
      } catch (err) {
        console.log('API search failed, trying free sources')
      }
    }

    // Free sources mode or API fallback
    if (dataSource === 'free' || dataSource === 'auto') {
      try {
        const wikidataResult = await fetchWikidataCompany(query)
        
        if (wikidataResult) {
          const freeResult = {
            company: {
              name: wikidataResult.label,
              jurisdiction_code: wikidataResult.country || 'GLOBAL',
              company_type: 'Public Company',
              company_number: wikidataResult.id,
              address: wikidataResult.headquarters || '',
              source: 'free'
            },
            wikidata: wikidataResult
          }
          setResults([freeResult])
          setShowResults(true)
        } else {
          setResults([])
          setShowResults(true)
        }
      } catch (err) {
        setError('Failed to search companies. Try a different search term.')
        console.error('Free search error:', err)
      }
    }

    setLoading(false)
  }

  const handleCompanySelect = (company) => {
    onCompanySelect(company)
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Data Source Selector */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input
            type="radio"
            name="dataSource"
            value="auto"
            checked={dataSource === 'auto'}
            onChange={(e) => setDataSource(e.target.value)}
            className="w-4 h-4 text-blue-500"
          />
          <span>Auto (API + Free)</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input
            type="radio"
            name="dataSource"
            value="free"
            checked={dataSource === 'free'}
            onChange={(e) => setDataSource(e.target.value)}
            className="w-4 h-4 text-blue-500"
          />
          <span>Free Sources Only</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input
            type="radio"
            name="dataSource"
            value="api"
            checked={dataSource === 'api'}
            onChange={(e) => setDataSource(e.target.value)}
            className="w-4 h-4 text-blue-500"
          />
          <span>API Only</span>
        </label>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter company name (e.g., Alphabet, Microsoft, Tesla)"
          className="w-full px-6 py-4 bg-slate-800 border-2 border-slate-600 rounded-xl text-white text-lg placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-6 h-6 text-blue-400 loading-spinner" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          {results.map((company, index) => (
            <button
              key={index}
              onClick={() => handleCompanySelect(company)}
              className="w-full px-6 py-4 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{company.company.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    {company.company.jurisdiction_code} • {company.company.company_type}
                  </p>
                  {company.company.address && (
                    <p className="text-xs text-slate-500 mt-1">
                      {company.company.address}
                    </p>
                  )}
                </div>
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && !loading && (
        <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-400">
          No companies found. Try a different search term or switch data source.
        </div>
      )}
    </div>
  )
}

export default SearchBar
