import { useState } from 'react'

function ApiKeyInput({ onSubmit }) {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요')
      return
    }

    if (apiKey.length < 20) {
      setError('올바른 API 키 형식이 아닙니다')
      return
    }

    setError('')
    onSubmit(apiKey.trim())
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Gemini API 키 입력
        </h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Google AI Studio에서 발급받은 API 키를 입력해주세요
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setError('')
              }}
              placeholder="API 키를 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            시작하기
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            API 키는 브라우저에 안전하게 저장되며, 서버로 전송되지 않습니다.
            <br />
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 underline"
            >
              Google AI Studio에서 API 키 발급받기
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ApiKeyInput

