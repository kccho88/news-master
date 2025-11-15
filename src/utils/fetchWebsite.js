// 타임아웃을 가진 fetch 함수
const fetchWithTimeout = (url, options = {}, timeout = 15000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('요청 시간이 초과되었습니다')), timeout)
    )
  ])
}

export const fetchWebsiteContent = async (url) => {
  try {
    // CORS 문제를 해결하기 위해 여러 프록시 서비스를 시도합니다
    const proxies = [
      {
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        parser: async (response) => {
          const data = await response.json()
          return data.contents
        }
      },
      {
        url: `https://corsproxy.io/?${encodeURIComponent(url)}`,
        parser: async (response) => {
          return await response.text()
        }
      },
      {
        url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        parser: async (response) => {
          return await response.text()
        }
      }
    ]
    
    let htmlContent = null
    let lastError = null
    
    // 각 프록시를 순차적으로 시도
    for (const proxy of proxies) {
      try {
        const response = await fetchWithTimeout(proxy.url, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
        }, 15000)
        
        if (response.ok) {
          htmlContent = await proxy.parser(response)
          if (htmlContent && htmlContent.length > 100) {
            break
          }
        }
      } catch (error) {
        console.log(`프록시 실패: ${proxy.url}`, error.message)
        lastError = error
        continue
      }
    }
    
    // 프록시가 모두 실패하면 직접 시도 (CORS 에러 가능)
    if (!htmlContent) {
      try {
        const response = await fetchWithTimeout(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
        }, 10000)
        
        if (response.ok) {
          htmlContent = await response.text()
        }
      } catch (error) {
        console.log('직접 접근 실패:', error.message)
        lastError = error
      }
    }
    
    if (!htmlContent) {
      throw new Error('웹사이트를 불러올 수 없습니다. 네트워크 연결을 확인하거나, 직접 텍스트를 입력하는 옵션을 사용해주세요.')
    }

    // HTML에서 텍스트만 추출
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    
    // 스크립트와 스타일 태그 제거
    const scripts = doc.querySelectorAll('script, style, nav, header, footer, iframe, noscript')
    scripts.forEach(el => el.remove())
    
    // 본문 텍스트 추출 (article, main, body 순서로 시도)
    let text = ''
    const article = doc.querySelector('article, main, [role="main"]')
    if (article) {
      text = article.innerText || article.textContent || ''
    } else {
      const body = doc.body || doc.documentElement
      text = body.innerText || body.textContent || ''
    }
    
    // 공백 정리
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim()
    
    if (cleanText.length < 100) {
      throw new Error('웹사이트에서 충분한 텍스트를 추출할 수 없습니다. 다른 웹사이트를 시도해보세요.')
    }

    // 텍스트 길이 제한 (Gemini API 토큰 제한 고려)
    return cleanText.substring(0, 10000)
  } catch (error) {
    console.error('Website fetch error:', error)
    throw new Error(`웹사이트 내용을 가져오는 중 오류가 발생했습니다: ${error.message}`)
  }
}

