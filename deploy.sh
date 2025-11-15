#!/bin/bash
# GitHub Pages 배포 스크립트

# 빌드
npm run build

# dist 폴더의 내용을 루트로 복사 (GitHub Pages 배포용)
# 주의: 이 방법은 dist 폴더의 내용을 루트에 복사합니다
# 대신 GitHub Pages 설정에서 /dist 폴더를 선택하는 것을 권장합니다

echo "빌드 완료! 다음 단계:"
echo "1. GitHub 저장소 Settings → Pages로 이동"
echo "2. Source를 'Deploy from a branch'로 설정"
echo "3. Branch를 'main'으로 선택"
echo "4. Folder를 '/dist'로 선택"
echo "5. Save 클릭"

