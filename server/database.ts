import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { events, submissions, activities, files } from "@shared/schema";
import path from "path";
import fs from "fs";

// 데이터베이스 디렉토리 생성
const dbDir = path.dirname("./database.db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// SQLite 데이터베이스 연결
const sqlite = new Database("./database.db");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Drizzle ORM 인스턴스 생성
export const db = drizzle(sqlite);

// 데이터베이스 초기화 함수
export async function initializeDatabase() {
  try {
    console.log("🔄 데이터베이스 초기화 중...");
    
    // 마이그레이션 디렉토리 확인
    const migrationDir = "./drizzle";
    if (!fs.existsSync(migrationDir)) {
      console.log("📁 마이그레이션 디렉토리 생성 중...");
      fs.mkdirSync(migrationDir, { recursive: true });
    }
    
    // 테이블 생성 (마이그레이션 파일이 없는 경우)
    const migrationFiles = fs.readdirSync(migrationDir).filter(f => f.endsWith('.sql'));
    if (migrationFiles.length === 0) {
      console.log("📋 테이블 생성 중...");
      
      // Events 테이블 생성
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          deadline INTEGER NOT NULL,
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
          initial_files TEXT,
          initial_storage_path TEXT,
          submission_storage_path TEXT
        );
      `);
      
      // Submissions 테이블 생성
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_id INTEGER NOT NULL,
          submitter_name TEXT NOT NULL,
          submitter_department TEXT NOT NULL,
          submitter_contact TEXT,
          files TEXT NOT NULL DEFAULT '[]',
          submitted_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
          FOREIGN KEY (event_id) REFERENCES events(id)
        );
      `);
      
      // Activities 테이블 생성
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          description TEXT NOT NULL,
          event_id INTEGER,
          submission_id INTEGER,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
          FOREIGN KEY (event_id) REFERENCES events(id),
          FOREIGN KEY (submission_id) REFERENCES submissions(id)
        );
      `);
      
      // Files 테이블 생성
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          filename TEXT NOT NULL UNIQUE,
          original_name TEXT NOT NULL,
          mime_type TEXT,
          size INTEGER NOT NULL,
          data BLOB NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
        );
      `);
      
      console.log("✅ 테이블 생성 완료");
    } else {
      console.log("🔄 마이그레이션 실행 중...");
      migrate(db, { migrationsFolder: migrationDir });
      console.log("✅ 마이그레이션 완료");
    }
    
    console.log("✅ 데이터베이스 초기화 완료");
  } catch (error) {
    console.error("❌ 데이터베이스 초기화 실패:", error);
    throw error;
  }
}

// 데이터베이스 연결 종료
export function closeDatabase() {
  sqlite.close();
} 