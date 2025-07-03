# Data Submission System

A modern, full-stack web application for event management and file submissions.

## 🚀 Quick Start

### Windows
1. **Install**: Double-click `install.bat` or run `scripts/install.bat`
2. **Run**: Double-click `run.bat` or run `scripts/run.bat`
3. **Access**: Open http://localhost:5000 in your browser
4. **Admin Login**: Use password `0000`

### Manual Setup
```bash
npm install
npm run dev
```

## 📁 Project Structure

```
/
├── client/           # Frontend React application
├── server/           # Backend Express server
├── config/           # Configuration files
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── drizzle.config.ts
│   └── tailwind.config.ts
├── scripts/          # Batch scripts
│   ├── install.bat   # Installation script
│   ├── run.bat       # Server runner
│   └── db-manager.bat # Database manager
├── docs/             # Documentation
├── backup/           # Backup files
├── shared/           # Shared utilities
└── database.db       # SQLite database
```

## 🔧 Features

- **Event Management**: Create and manage events
- **File Uploads**: Secure file submission system
- **Admin Dashboard**: Real-time statistics and management
- **Modern UI**: Built with React and Tailwind CSS
- **Database**: SQLite with Drizzle ORM

## 🛠️ Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:studio    # Open database studio
```

## 📋 Admin Features

- Password: `0000`
- Event creation and management
- File submission monitoring
- Statistics dashboard
- User management

## 🔧 Troubleshooting

- If installation fails: Run `scripts/install.bat` again
- If server won't start: Check if port 5000 is available
- If browser doesn't open: Manually visit http://localhost:5000

## 📄 License

MIT License