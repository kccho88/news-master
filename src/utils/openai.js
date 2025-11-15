// OpenAI API를 사용한 요약 기능
// 참고: https://platform.openai.com/docs/api-reference

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export const summarizeContent = async (apiKey, websiteContent, url) => {
  const prompt = `당신은 세계 최고 수준의 콘텐츠 요약 전문가이자 초등학생도 이해할 수 있게 설명하는 교사입니다.

사용자가 입력한 웹사이트 내용을 기반으로 아래 순서에 따라 출력하세요.

1. [한줄 요약하기]
- 전체 내용을 핵심 한 문장으로 요약하세요.

2. [전체 내용 요약하기]
- 본문을 단락별로 나누고 각 단락의 핵심 내용을 2~3문장으로 정리하세요.

3. [Tip : 쉽게 이해하기]
- 초등학생도 이해할 수 있도록 예시나 비유를 들어 쉽게 설명하세요.
- 각 예시마다 이미지 생성 프롬프트를 제안하세요.
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
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.error?.message || 'API 요청 실패'
      
      // API 키 오류인 경우
      if (errorMessage.includes('Invalid API key') || errorMessage.includes('Incorrect API key')) {
        throw new Error('API 키가 올바르지 않습니다. OpenAI에서 발급받은 API 키를 확인해주세요.')
      }
      
      // 사용량 제한 오류
      if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
        throw new Error('API 사용량 제한에 도달했습니다. 잠시 후 다시 시도해주세요.')
      }
      
      throw new Error(`요약 생성 실패: ${errorMessage}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('응답 형식이 올바르지 않습니다')
    }

    const text = data.choices[0].message.content
    
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
    console.error('OpenAI API Error:', error)
    throw error
  }
}

export const generateImage = async (apiKey, imagePrompt) => {
  // OpenAI의 이미지 생성 API (DALL-E) 사용
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || '이미지 생성 실패')
    }

    const data = await response.json()
    return data.data[0].url
  } catch (error) {
    console.error('이미지 생성 실패:', error)
    // 이미지 생성 실패 시 프롬프트 반환
    return imagePrompt
  }
}

