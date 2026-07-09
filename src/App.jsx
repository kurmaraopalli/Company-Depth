import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import CompanyResults from './components/CompanyResults'
import ApiKeySettings from './components/ApiKeySettings'
import './App.css'

function App() {
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [apiKeys, setApiKeys] = useState({
    openCorporates: localStorage.getItem('openCorporatesKey') || '',
    alphaVantage: localStorage.getItem('alphaVantageKey') || ''
  })
  const [showSettings, setShowSettings] = useState(false)

  const handleApiKeyChange = (key, value) => {
    setApiKeys(prev => ({ ...prev, [key]: value }))
    localStorage.setItem(key, value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Company-Depth</h1>
              <p className="text-sm text-slate-400">Corporate Intelligence Tool</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showSettings && (
          <ApiKeySettings 
            apiKeys={apiKeys} 
            onApiKeyChange={handleApiKeyChange}
            onClose={() => setShowSettings(false)}
          />
        )}

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-3">
            Analyze Any Company Worldwide
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Get comprehensive insights into corporate structure, financial data, and digital footprint
          </p>
        </div>

        <SearchBar 
          onCompanySelect={setSelectedCompany}
          apiKeys={apiKeys}
        />

        {selectedCompany && (
          <CompanyResults 
            company={selectedCompany}
            apiKeys={apiKeys}
          />
        )}
      </main>

      <footer className="bg-slate-800/30 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400">
          <p>Company-Depth - Open Source Corporate Intelligence Tool</p>
        </div>
      </footer>
    </div>
  )
}

export default App
