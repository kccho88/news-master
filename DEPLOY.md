# GitHub Pages 배포 가이드

## 자동 배포 설정

이 프로젝트는 GitHub Actions를 사용하여 자동으로 배포됩니다.

### 1. GitHub 저장소 설정

1. GitHub 저장소로 이동: https://github.com/kccho88/news-master
2. **Settings** → **Pages** 메뉴로 이동
3. **Source**에서 **GitHub Actions** 선택
4. 저장

### 2. 자동 배포

- `main` 브랜치에 푸시하면 자동으로 빌드 및 배포됩니다
- 배포 완료 후 약 1-2분 후에 사이트가 업데이트됩니다
- 배포 상태는 **Actions** 탭에서 확인할 수 있습니다

### 3. 배포 URL

배포 완료 후 다음 URL에서 접속할 수 있습니다:
- https://kccho88.github.io/news-master/

## 수동 배포 (대안)

자동 배포가 작동하지 않는 경우:

```bash
# 1. 프로젝트 빌드
npm run build

# 2. dist 폴더의 내용을 gh-pages 브랜치에 푸시
# (gh-pages 브랜치를 사용하는 경우)
```

## 문제 해결

### 빈 화면이 보이는 경우

1. **base 경로 확인**: `vite.config.js`에서 `base: '/news-master/'` 설정 확인
2. **브라우저 캐시 삭제**: Ctrl+Shift+R (Windows) 또는 Cmd+Shift+R (Mac)
3. **콘솔 확인**: F12를 눌러 개발자 도구에서 오류 확인
4. **배포 상태 확인**: GitHub Actions에서 빌드가 성공했는지 확인

### 404 오류가 발생하는 경우

- `404.html` 파일이 루트에 있는지 확인
- GitHub Pages 설정에서 커스텀 404 페이지가 활성화되어 있는지 확인

