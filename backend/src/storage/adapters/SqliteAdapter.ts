import sqlite3 from 'sqlite3';
import path from 'path';
import { StorageAdapter } from '../StorageAdapter.js';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbInstance: sqlite3.Database | null = null;

function getDb(): sqlite3.Database {
  if (dbInstance) return dbInstance;

  const dbPath = path.join(DATA_DIR, 'dentpro.sqlite');
  dbInstance = new sqlite3.Database(dbPath);

  dbInstance.serialize(() => {
    dbInstance!.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      data TEXT
    )`);
    dbInstance!.run(`CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      data TEXT
    )`);
    dbInstance!.run(`CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      data TEXT
    )`);
    dbInstance!.run(`CREATE TABLE IF NOT EXISTS formTemplates (
      id TEXT PRIMARY KEY,
      data TEXT
    )`);
    dbInstance!.run(`CREATE TABLE IF NOT EXISTS formSubmissions (
      id TEXT PRIMARY KEY,
      data TEXT
    )`);
    dbInstance!.run(`CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      data TEXT
    )`);
  });

  return dbInstance;
}

export class SqliteAdapter<T extends { id: string }> implements StorageAdapter<T> {
  private collectionName: string;
  private db: sqlite3.Database;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.db = getDb();
  }

  private runCommand(query: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  private queryAll(query: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  private queryGet(query: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async getAll(): Promise<T[]> {
    try {
      const rows = await this.queryAll(`SELECT data FROM ${this.collectionName}`);
      return rows.map(r => JSON.parse(r.data));
    } catch (e) {
      console.warn(`Table ${this.collectionName} not fully supported or empty.`);
      return [];
    }
  }

  async getById(id: string): Promise<T | undefined> {
    try {
      const row = await this.queryGet(`SELECT data FROM ${this.collectionName} WHERE id = ?`, [id]);
      if (!row) return undefined;
      return JSON.parse(row.data);
    } catch (e) {
      return undefined;
    }
  }

  async insert(item: T): Promise<T> {
    await this.runCommand(
      `INSERT INTO ${this.collectionName} (id, data) VALUES (?, ?)`,
      [item.id, JSON.stringify(item)]
    );
    return item;
  }

  async update(id: string, updates: Partial<T>): Promise<T | undefined> {
    const existing = await this.getById(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...updates };
    await this.runCommand(
      `UPDATE ${this.collectionName} SET data = ? WHERE id = ?`,
      [JSON.stringify(merged), id]
    );
    return merged;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) return false;
    await this.runCommand(`DELETE FROM ${this.collectionName} WHERE id = ?`, [id]);
    return true;
  }
}
