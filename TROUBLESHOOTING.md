# 문제 해결 가이드

## '사이트에 연결할 수 없음' 오류 해결 방법

### 1. 서버가 실행 중인지 확인

PowerShell 또는 명령 프롬프트를 열고 다음 명령어를 실행하세요:

```powershell
cd "c:\Users\PC\Desktop\Cursor_ai_exe\news master"
npm run dev
```

### 2. 올바른 주소로 접속

서버가 시작되면 다음과 같은 메시지가 표시됩니다:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

**브라우저에서 `http://localhost:5173` 으로 접속하세요.**

### 3. 포트가 사용 중인 경우

다른 포트를 사용하려면:

```powershell
npm run dev -- --port 3000
```

그리고 브라우저에서 `http://localhost:3000` 으로 접속하세요.

### 4. 방화벽 문제

Windows 방화벽이 차단하는 경우:
- Windows 보안 설정에서 Node.js에 대한 방화벽 예외 추가

### 5. 수동으로 서버 시작

1. PowerShell을 관리자 권한으로 실행
2. 프로젝트 디렉토리로 이동:
   ```powershell
   cd "c:\Users\PC\Desktop\Cursor_ai_exe\news master"
   ```
3. 서버 시작:
   ```powershell
   npm run dev
   ```
4. 브라우저에서 `http://localhost:5173` 접속

### 6. 포트 확인

다른 프로그램이 5173 포트를 사용 중인지 확인:
```powershell
netstat -ano | findstr :5173
```

포트가 사용 중이면 다른 포트를 사용하세요.



