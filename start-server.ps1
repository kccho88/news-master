# 개발 서버 시작 스크립트
Write-Host "Site Summary Master 개발 서버를 시작합니다..." -ForegroundColor Green
Write-Host ""

cd "c:\Users\PC\Desktop\Cursor_ai_exe\news master"

Write-Host "의존성 확인 중..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules가 없습니다. npm install을 실행합니다..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "개발 서버 시작 중..." -ForegroundColor Green
Write-Host "브라우저에서 http://localhost:5173 을 열어주세요" -ForegroundColor Cyan
Write-Host ""

npm run dev



