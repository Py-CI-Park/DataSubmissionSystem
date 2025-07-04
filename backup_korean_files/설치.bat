@echo off
chcp 65001 > nul
title 데이터 제출 시스템 설치
color 0A
cls

echo =====================================================
echo           데이터 제출 시스템 설치
echo =====================================================
echo.

cd /d "%~dp0"

echo [1/3] Node.js 확인 중...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js가 필요합니다.
    echo 💡 https://nodejs.org 에서 다운로드하세요.
    pause
    exit /b 1
)
echo ✅ Node.js 설치됨

echo [2/3] 패키지 설치 중...
npm install
if %errorlevel% neq 0 (
    echo ❌ 설치 실패
    pause
    exit /b 1
)
echo ✅ 설치 완료

echo [3/3] 설치 확인 중...
if not exist "node_modules" (
    echo ❌ 설치 실패
    pause
    exit /b 1
)
echo ✅ 설치 확인 완료

cls
color 0E
echo.
echo =====================================================
echo              🎉 설치 완료! 🎉
echo =====================================================
echo.
echo ✨ 데이터 제출 시스템이 성공적으로 설치되었습니다!
echo.
echo 📋 사용 방법:
echo ┌─────────────────────────────────────────────────┐
echo │  1️⃣  실행.bat 파일을 더블클릭하세요               │
echo │  2️⃣  자동으로 브라우저가 열립니다                │
echo │  3️⃣  http://localhost:5000 에서 사용하세요       │
echo │  4️⃣  관리자 로그인 비밀번호: 0000               │
echo └─────────────────────────────────────────────────┘
echo.
echo 🔧 주요 기능:
echo   • 이벤트 생성 및 관리
echo   • 파일 업로드 및 제출
echo   • 제출 현황 대시보드
echo   • 관리자 통계 확인
echo.
echo 💡 팁:
echo   • 서버 중지: 실행 창에서 Ctrl+C
echo   • 재시작: 실행.bat 다시 실행
echo   • 문제 발생 시: 이 설치.bat 다시 실행
echo.
echo 🚀 지금 바로 시작하시겠습니까? (Y/N)
set /p start_now=선택: 
if /i "%start_now%"=="Y" (
    echo.
    echo 🎯 실행.bat를 시작합니다...
    timeout /t 2 /nobreak > nul
    call 실행.bat
) else (
    echo.
    echo 👍 준비되면 "실행.bat"를 실행하세요!
    echo.
    pause
) 