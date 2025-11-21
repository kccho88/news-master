import { useState, useEffect } from 'react'
import ApiKeyInput from './components/ApiKeyInput'
import UrlInput from './components/UrlInput'
import SummaryResult from './components/SummaryResult'
import { getApiKey, saveApiKey } from './utils/storage'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [isApiKeySet, setIsApiKeySet] = useState(false)
  const [summaryData, setSummaryData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const savedKey = getApiKey()
    if (savedKey) {
      setApiKey(savedKey)
      setIsApiKeySet(true)
    }
  }, [])

  const handleApiKeySubmit = (key) => {
    saveApiKey(key)
    setApiKey(key)
    setIsApiKeySet(true)
  }

  const handleApiKeyChange = () => {
    setIsApiKeySet(false)
    setApiKey('')
    setSummaryData(null)
  }

  const handleSummaryComplete = (data) => {
    setSummaryData(data)
    setLoading(false)
    setError(null)
  }

  const handleSummaryStart = () => {
    setLoading(true)
    setError(null)
    setSummaryData(null)
  }

  const handleError = (err) => {
    setError(err)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-semibold text-gray-900 mb-2">
            Site Summary Master
          </h1>
          <p className="text-gray-600 text-lg">
            웹사이트를 쉽고 빠르게 이해하세요
          </p>
        </header>

        {/* API Key Input */}
        {!isApiKeySet ? (
          <ApiKeyInput onSubmit={handleApiKeySubmit} />
        ) : (
          <div className="space-y-8">
            {/* API Key Change Button */}
            <div className="text-right">
              <button
                onClick={handleApiKeyChange}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                API 키 변경
              </button>
            </div>

            {/* URL Input */}
            <UrlInput
              apiKey={apiKey}
              onStart={handleSummaryStart}
              onComplete={handleSummaryComplete}
              onError={handleError}
            />

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">요약 중...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <p className="font-semibold">오류가 발생했습니다</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Summary Result */}
            {summaryData && <SummaryResult data={summaryData} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default App



