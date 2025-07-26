import Database from "better-sqlite3";
import { join } from "path";

const dbPath = join(process.cwd(), "lib/agenda42.sqlite");
const db = new Database(dbPath);

console.log("Connected to SQLite database:", dbPath);

try {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      eventStart TEXT NOT NULL,
      eventEnd TEXT NOT NULL,
      reminderTime TEXT NOT NULL,
      chatId TEXT NOT NULL
    )
  `).run();
    console.log("Events table created or already exists.");
} catch (err) {
    console.error("Error creating events table:", err.message);
}

export default db;