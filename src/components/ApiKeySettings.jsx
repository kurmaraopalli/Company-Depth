import React from 'react'

const ApiKeySettings = ({ apiKeys, onApiKeyChange, onClose }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700 fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">API Key Settings</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            OpenCorporates API Key
          </label>
          <input
            type="password"
            value={apiKeys.openCorporates}
            onChange={(e) => onApiKeyChange('openCorporatesKey', e.target.value)}
            placeholder="Enter your OpenCorporates API key"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Get your free API key from <a href="https://opencorporates.com/api" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">opencorporates.com/api</a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Alpha Vantage API Key
          </label>
          <input
            type="password"
            value={apiKeys.alphaVantage}
            onChange={(e) => onApiKeyChange('alphaVantageKey', e.target.value)}
            placeholder="Enter your Alpha Vantage API key"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Get your free API key from <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">alphavantage.co</a>
          </p>
        </div>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            <strong>Note:</strong> API keys are stored locally in your browser and are never sent to any server other than the respective API endpoints.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ApiKeySettings
