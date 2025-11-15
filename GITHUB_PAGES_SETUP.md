# GitHub Pages 배포 설정 가이드

## 현재 상황

워크플로우 파일이 로컬에 생성되었지만, GitHub에 푸시하는 데 권한 문제가 발생했습니다.

## 해결 방법

### 방법 1: GitHub 웹 인터페이스에서 워크플로우 파일 추가 (권장)

1. GitHub 저장소로 이동: https://github.com/kccho88/news-master
2. **Add file** → **Create new file** 클릭
3. 파일 경로 입력: `.github/workflows/deploy.yml`
4. 아래 내용을 복사하여 붙여넣기:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. **Commit new file** 클릭

### 방법 2: GitHub Pages 설정 변경 (수동 배포)

1. GitHub 저장소 Settings → Pages로 이동
2. Source를 **Deploy from a branch**로 선택
3. Branch: `main` 선택
4. Folder: `/dist` 선택
5. Save 클릭

**주의**: 이 방법을 사용하려면 `dist` 폴더를 Git에 포함시켜야 합니다.

### 방법 3: Personal Access Token 권한 업데이트

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 사용 중인 토큰 편집 또는 새 토큰 생성
3. **workflow** 권한 체크
4. 토큰 업데이트 후 다시 푸시 시도

## 배포 확인

워크플로우 파일 추가 후:
1. **Actions** 탭에서 배포 상태 확인
2. 배포 완료 후 https://kccho88.github.io/news-master/ 접속
3. 빈 화면 문제가 해결되어야 합니다

## 로컬 파일 위치

워크플로우 파일은 이미 로컬에 생성되어 있습니다:
- `.github/workflows/deploy.yml`

이 파일을 GitHub 웹 인터페이스에서 직접 추가하면 자동 배포가 시작됩니다.

