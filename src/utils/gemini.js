const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export const summarizeContent = async (apiKey, websiteContent, url) => {
  const prompt = `당신은 세계 최고 수준의 콘텐츠 요약 전문가이자 초등학생도 이해할 수 있게 설명하는 교사입니다.

사용자가 입력한 웹사이트 내용을 기반으로 아래 순서에 따라 출력하세요.

1. [한줄 요약하기]
- 전체 내용을 핵심 한 문장으로 요약하세요.

2. [전체 내용 요약하기]
- 본문을 단락별로 나누고 각 단락의 핵심 내용을 2~3문장으로 정리하세요.

3. [Tip : 쉽게 이해하기]
- 초등학생도 이해할 수 있도록 예시나 비유를 들어 쉽게 설명하세요.
- 각 예시마다 Gemini로 생성할 이미지를 제안하거나 직접 생성하세요.
- 예시 설명은 친근하고 따뜻한 톤으로 작성하세요.

웹사이트 URL: ${url}

웹사이트 내용:
${websiteContent}

위 내용을 JSON 형식으로 출력해주세요. 형식은 다음과 같습니다:
{
  "oneLineSummary": "한 줄 요약 내용",
  "paragraphSummary": [
    {
      "title": "단락 제목",
      "summary": "단락 요약 내용"
    }
  ],
  "easyTip": [
    {
      "example": "쉬운 예시 설명",
      "imagePrompt": "이미지 생성 프롬프트"
    }
  ]
}`

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'API 요청 실패')
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('응답 형식이 올바르지 않습니다')
    }

    const text = data.candidates[0].content.parts[0].text
    
    // JSON 추출 (마크다운 코드 블록 제거)
    let jsonText = text.trim()
    
    // JSON 코드 블록 찾기
    if (jsonText.includes('```json')) {
      const start = jsonText.indexOf('```json') + 7
      const end = jsonText.indexOf('```', start)
      if (end > start) {
        jsonText = jsonText.substring(start, end).trim()
      }
    } else if (jsonText.includes('```')) {
      const start = jsonText.indexOf('```') + 3
      const end = jsonText.indexOf('```', start)
      if (end > start) {
        jsonText = jsonText.substring(start, end).trim()
      }
    }
    
    // JSON 객체만 추출 (중괄호로 시작하고 끝나는 부분)
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonText = jsonMatch[0]
    }

    // JSON 파싱
    let summaryData
    try {
      summaryData = JSON.parse(jsonText)
    } catch (parseError) {
      // 파싱 실패 시 기본 구조로 반환
      console.warn('JSON 파싱 실패, 텍스트를 그대로 반환:', parseError)
      summaryData = {
        oneLineSummary: text.split('\n')[0] || '요약을 생성할 수 없습니다.',
        paragraphSummary: [
          {
            title: '전체 내용',
            summary: text.substring(0, 500)
          }
        ],
        easyTip: [
          {
            example: '내용을 더 자세히 확인하려면 원본 웹사이트를 방문해주세요.',
            imagePrompt: '웹사이트 요약을 나타내는 일러스트'
          }
        ]
      }
    }
    
    return summaryData
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error(`요약 생성 실패: ${error.message}`)
  }
}

export const generateImage = async (apiKey, imagePrompt) => {
  // Gemini의 이미지 생성 API는 현재 제한적이므로
  // 여기서는 이미지 프롬프트를 반환하고, 실제 이미지 생성은
  // Gemini의 이미지 생성 기능이 사용 가능할 때 구현할 수 있습니다.
  // 현재는 이미지 프롬프트를 그대로 반환합니다.
  return imagePrompt
}

