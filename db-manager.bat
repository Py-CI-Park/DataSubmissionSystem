@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo    SQLite 데이터베이스 관리 도구
echo ==========================================
echo.

if not exist "database.db" (
    echo ❌ database.db 파일이 존재하지 않습니다.
    echo 먼저 서버를 실행하여 데이터베이스를 생성하세요.
    echo.
    pause
    exit /b 1
)

:menu
echo.
echo 1. 데이터베이스 접속 (SQLite3 명령어 모드)
echo 2. 테이블 목록 보기
echo 3. 이벤트 목록 보기
echo 4. 제출 목록 보기
echo 5. 활동 로그 보기
echo 6. 데이터베이스 백업
echo 7. 데이터베이스 복원
echo 8. 종료
echo.
set /p choice="선택하세요 (1-8): "

if "%choice%"=="1" goto sqlite_mode
if "%choice%"=="2" goto show_tables
if "%choice%"=="3" goto show_events
if "%choice%"=="4" goto show_submissions
if "%choice%"=="5" goto show_activities
if "%choice%"=="6" goto backup_db
if "%choice%"=="7" goto restore_db
if "%choice%"=="8" goto exit

echo 잘못된 선택입니다.
goto menu

:sqlite_mode
echo.
echo SQLite3 명령어 모드로 진입합니다...
echo 종료하려면 .quit 또는 .exit를 입력하세요.
echo.
sqlite3 database.db
goto menu

:show_tables
echo.
echo ==========================================
echo           테이블 목록
echo ==========================================
sqlite3 database.db ".tables"
goto menu

:show_events
echo.
echo ==========================================
echo           이벤트 목록
echo ==========================================
sqlite3 database.db "SELECT id, title, deadline, is_active, created_at FROM events ORDER BY created_at DESC;"
goto menu

:show_submissions
echo.
echo ==========================================
echo           제출 목록
echo ==========================================
sqlite3 database.db "SELECT s.id, s.submitter_name, s.submitter_department, e.title as event_title, s.submitted_at FROM submissions s JOIN events e ON s.event_id = e.id ORDER BY s.submitted_at DESC LIMIT 20;"
goto menu

:show_activities
echo.
echo ==========================================
echo           활동 로그
echo ==========================================
sqlite3 database.db "SELECT id, type, description, created_at FROM activities ORDER BY created_at DESC LIMIT 20;"
goto menu

:backup_db
echo.
set backup_name=database_backup_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%.db
set backup_name=%backup_name: =0%
copy database.db "%backup_name%" >nul
if %errorlevel%==0 (
    echo ✅ 백업 완료: %backup_name%
) else (
    echo ❌ 백업 실패
)
goto menu

:restore_db
echo.
echo 백업 파일 목록:
dir database_backup_*.db /b 2>nul
echo.
set /p backup_file="복원할 백업 파일명을 입력하세요: "
if exist "%backup_file%" (
    copy "%backup_file%" database.db >nul
    if %errorlevel%==0 (
        echo ✅ 복원 완료: %backup_file%
    ) else (
        echo ❌ 복원 실패
    )
) else (
    echo ❌ 파일을 찾을 수 없습니다: %backup_file%
)
goto menu

:exit
echo.
echo 데이터베이스 관리 도구를 종료합니다.
pause 