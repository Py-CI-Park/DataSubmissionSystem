# 📁 Data Submission System

A modern web-based data submission and management system built with React, TypeScript, and Express.

## 🚀 Quick Start

### 1️⃣ Installation
```bash
# Right-click and "Run as Administrator"
install.bat
```

### 2️⃣ Run Application
```bash
# Double-click to start server
run.bat
```

### 3️⃣ Access Application
- **URL**: http://localhost:5000
- **Admin Password**: 0000

## 📁 File Structure

```
DataSubmissionSystem/
├── install.bat          # 🔧 Installation script (English)
├── run.bat             # 🚀 Server startup script (English)
├── README_USAGE.txt    # 📖 Detailed usage guide
├── backup_korean_files/ # 📂 Korean version backups
├── client/             # 🎨 Frontend React application
├── server/             # ⚙️ Backend Express server
├── shared/             # 🔗 Shared TypeScript schemas
└── package.json        # 📦 Dependencies and scripts
```

## ✨ Features

- **📊 Event Management**: Create and manage data submission events
- **📤 File Upload**: Secure file upload and submission system
- **👥 Admin Dashboard**: Real-time statistics and submission management
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🔐 Admin Authentication**: Secure admin access with password protection
- **🌐 Real-time Updates**: Live submission tracking and notifications

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components
- **React Query** for data fetching
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database
- **Zod** for validation
- **Multer** for file uploads
- **WebSocket** for real-time updates

## 🔧 Development

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 8+

### Manual Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📋 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type checking with TypeScript

## 🌐 Environment

### Development
- Server: http://localhost:5000
- Hot reload enabled
- Debug mode active

### Production
- Optimized build
- Error logging
- Performance monitoring

## 🔐 Admin Features

1. **Event Management**
   - Create new submission events
   - Set deadlines and requirements
   - Monitor submission status

2. **File Management**
   - View all submitted files
   - Download submissions
   - Bulk operations

3. **Statistics Dashboard**
   - Real-time submission counts
   - Event participation rates
   - System usage analytics

## 📱 User Features

1. **Event Participation**
   - Browse available events
   - Submit files with metadata
   - Track submission status

2. **File Upload**
   - Drag & drop interface
   - Multiple file support
   - Progress indicators

## 🛡️ Security

- Input validation with Zod schemas
- File type restrictions
- Size limitations
- Admin authentication
- CSRF protection

## 🎨 UI/UX

- Modern, clean interface
- Responsive design (mobile-first)
- Accessible components
- Dark/light theme support
- Intuitive navigation

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔍 Testing

The system has been thoroughly tested using:
- **Playwright** for end-to-end testing
- **Manual testing** across different devices
- **Performance testing** for load handling

## 📞 Support

For issues or questions:
1. Check `README_USAGE.txt` for detailed instructions
2. Verify Node.js installation
3. Ensure port 5000 is available
4. Run `install.bat` as administrator

## 📄 License

MIT License - see LICENSE file for details

## 🎉 Recent Updates

- ✅ English batch files with ASCII art
- ✅ Improved error handling and user feedback
- ✅ Enhanced installation process
- ✅ Automatic browser launch
- ✅ Port conflict detection
- ✅ Comprehensive testing with Playwright

---

**Made with ❤️ for efficient data submission management**

## 🗄️ 데이터베이스

이 시스템은 **SQLite 데이터베이스**를 사용하여 모든 데이터를 로컬에 저장합니다:
- 📁 `database.db`: 메인 데이터베이스 파일
- 📁 `database.db-wal`: Write-Ahead Logging 파일
- 📁 `database.db-shm`: 공유 메모리 파일

### 데이터베이스 구조

1. **events** - 이벤트 정보
   - 이벤트 제목, 설명, 마감일
   - 초기 자료 및 제출 자료 저장 경로
   - 활성 상태 관리

2. **submissions** - 제출 정보
   - 제출자 정보 (이름, 팀/파트)
   - 제출된 파일 목록
   - 제출 시간

3. **activities** - 활동 로그
   - 이벤트 생성, 파일 제출 등의 활동 기록

4. **files** - 파일 저장
   - 업로드된 파일의 바이너리 데이터
   - 파일 메타데이터 (이름, 크기, 타입)

## 🛠️ 데이터베이스 관리

### GUI 데이터베이스 관리 도구
```bash
# 데이터베이스 관리 도구 실행 (SQLite3 명령어 포함)
db-manager.bat
```

### 데이터베이스 스크립트
```bash
# 마이그레이션 파일 생성
npm run db:generate

# 마이그레이션 실행
npm run db:migrate

# 스키마를 데이터베이스에 직접 푸시
npm run db:push

# Drizzle Studio로 데이터베이스 관리
npm run db:studio
```

### 데이터베이스 백업
SQLite 파일을 직접 복사하거나 관리 도구를 사용하여 백업할 수 있습니다:
```bash
# 백업 생성
copy database.db database_backup_20241201.db

# 복원
copy database_backup_20241201.db database.db
```
