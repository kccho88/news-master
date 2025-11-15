# Site Summary Master

웹사이트 내용을 자동으로 분석하고 요약해주는 서비스입니다. Gemini API를 활용하여 한 줄 요약, 단락별 요약, 그리고 초등학생도 이해할 수 있는 쉬운 예시를 제공합니다.

## 주요 기능

- 🔑 **API Key 관리**: Gemini API 키를 안전하게 저장하고 관리
- 🔗 **URL 입력**: 웹사이트 주소를 입력하면 자동으로 내용을 가져와 분석
- ✨ **한 줄 요약**: 전체 내용을 핵심 한 문장으로 요약
- 📘 **전체 요약**: 본문을 단락별로 구분하여 각 단락의 핵심 요약 제공
- 💡 **쉬운 예시**: 초등학생도 이해할 수 있도록 비유와 예시로 설명

## 기술 스택

- React 18
- Vite
- Tailwind CSS
- Gemini API

## 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 빌드:
```bash
npm run build
```

## 사용 방법

1. Google AI Studio에서 Gemini API 키를 발급받습니다.
   - https://makersuite.google.com/app/apikey

2. 앱에 접속하여 API 키를 입력합니다.

3. 요약하고 싶은 웹사이트의 URL을 입력합니다.

4. "요약 시작" 버튼을 클릭하면 자동으로 요약이 생성됩니다.

## 주의사항

- CORS 문제로 인해 일부 웹사이트는 직접 접근이 불가능할 수 있습니다. 이 경우 백엔드 서버를 통해 프록시를 구성하는 것을 권장합니다.
- API 키는 브라우저의 localStorage에 저장되며, 서버로 전송되지 않습니다.
- Gemini API의 사용량 제한에 주의하세요.

## 라이선스

MIT

