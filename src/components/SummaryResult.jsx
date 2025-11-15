import { useState } from 'react'

function SummaryResult({ data }) {
  const [expandedSections, setExpandedSections] = useState({
    oneLine: true,
    paragraphs: true,
    tips: true,
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="space-y-6 mt-8">
      {/* 한 줄 요약 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            ✅ 한줄 요약
          </h2>
          <button
            onClick={() => toggleSection('oneLine')}
            className="text-gray-500 hover:text-gray-700"
          >
            {expandedSections.oneLine ? '접기' : '펼치기'}
          </button>
        </div>
        {expandedSections.oneLine && (
          <p className="text-xl text-gray-800 leading-relaxed">
            {data.oneLineSummary || '요약 내용이 없습니다'}
          </p>
        )}
      </div>

      {/* 전체 요약 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            📘 전체 내용 요약
          </h2>
          <button
            onClick={() => toggleSection('paragraphs')}
            className="text-gray-500 hover:text-gray-700"
          >
            {expandedSections.paragraphs ? '접기' : '펼치기'}
          </button>
        </div>
        {expandedSections.paragraphs && (
          <div className="space-y-6">
            {data.paragraphSummary && data.paragraphSummary.length > 0 ? (
              data.paragraphSummary.map((paragraph, index) => (
                <div key={index} className="border-l-4 border-gray-200 pl-6 py-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {paragraph.title || `단락 ${index + 1}`}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {paragraph.summary}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">요약 내용이 없습니다</p>
            )}
          </div>
        )}
      </div>

      {/* 쉬운 예시 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            💡 Tip: 쉽게 이해하기
          </h2>
          <button
            onClick={() => toggleSection('tips')}
            className="text-gray-500 hover:text-gray-700"
          >
            {expandedSections.tips ? '접기' : '펼치기'}
          </button>
        </div>
        {expandedSections.tips && (
          <div className="space-y-6">
            {data.easyTip && data.easyTip.length > 0 ? (
              data.easyTip.map((tip, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <p className="text-gray-800 leading-relaxed text-lg mb-4">
                    {tip.example}
                  </p>
                  {tip.imagePrompt && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-2 font-medium">🖼️ 이미지 생성 프롬프트:</p>
                      <p className="text-gray-700 italic">{tip.imagePrompt}</p>
                      <p className="text-xs text-gray-500 mt-3">
                        💡 참고: Gemini의 이미지 생성 기능이 활성화되면 자동으로 이미지가 생성됩니다.
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">예시 내용이 없습니다</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SummaryResult

