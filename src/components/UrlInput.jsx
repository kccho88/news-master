import { useState } from 'react'
import { fetchWebsiteContent } from '../utils/fetchWebsite'
import { summarizeContent } from '../utils/gemini'

function UrlInput({ apiKey, onStart, onComplete, onError }) {
  const [url, setUrl] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [inputMode, setInputMode] = useState('url') // 'url' or 'text'
  const [textContent, setTextContent] = useState('')

  const validateUrl = (urlString) => {
    try {
      const url = new URL(urlString)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setIsValidating(true)
    onStart()

    try {
      let websiteContent = ''
      let sourceUrl = ''

      if (inputMode === 'url') {
        if (!url.trim()) {
          throw new Error('URL을 입력해주세요')
        }

        let finalUrl = url.trim()
        
        // http:// 또는 https://가 없으면 추가
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
          finalUrl = 'https://' + finalUrl
        }

        if (!validateUrl(finalUrl)) {
          throw new Error('올바른 URL 형식이 아닙니다')
        }

        sourceUrl = finalUrl
        // 1. 웹사이트 내용 가져오기
        websiteContent = await fetchWebsiteContent(finalUrl)
      } else {
        // 텍스트 직접 입력 모드
        if (!textContent.trim()) {
          throw new Error('텍스트를 입력해주세요')
        }

        if (textContent.trim().length < 100) {
          throw new Error('최소 100자 이상의 텍스트를 입력해주세요')
        }

        websiteContent = textContent.trim()
        sourceUrl = '직접 입력된 텍스트'
      }
      
      // 2. Gemini로 요약하기
      const summaryData = await summarizeContent(apiKey, websiteContent, sourceUrl)
      
      onComplete(summaryData)
    } catch (error) {
      onError(error.message)
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      {/* 입력 모드 선택 */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            inputMode === 'url'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔗 URL 입력
        </button>
        <button
          type="button"
          onClick={() => setInputMode('text')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            inputMode === 'text'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📝 텍스트 직접 입력
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputMode === 'url' ? (
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              🔗 사이트 주소 입력
            </label>
            <div className="flex gap-3">
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={isValidating}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isValidating}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isValidating ? '처리 중...' : '요약 시작'}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              💡 연결이 실패할 경우 "텍스트 직접 입력" 모드를 사용하세요
            </p>
          </div>
        ) : (
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              📝 요약할 텍스트 입력 (최소 100자)
            </label>
            <textarea
              id="text"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="요약하고 싶은 텍스트를 여기에 붙여넣으세요..."
              disabled={isValidating}
              rows="8"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed resize-y"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {textContent.length}자 입력됨 {textContent.length < 100 && '(최소 100자 필요)'}
              </p>
              <button
                type="submit"
                disabled={isValidating || textContent.trim().length < 100}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isValidating ? '처리 중...' : '요약 시작'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default UrlInput

