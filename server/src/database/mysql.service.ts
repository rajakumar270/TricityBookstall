import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: mysql.Pool;

  async onModuleInit() {
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = Number(process.env.DB_PORT) || 3306;
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbName = process.env.DB_NAME || 'ekatva_bookstall_db';

    this.pool = mysql.createPool({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
    });

    console.log(`🔌 MySQL Connection Pool connected to [${dbHost}:${dbPort}/${dbName}]`);
  }

  // Generic query execution method
  async query<T = any>(sql: string, params: any[] = []): Promise<T> {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results as T;
    } catch (error: any) {
      console.error(`❌ MySQL Query Error [${sql}]:`, error.message);
      throw error;
    }
  }

  // Get raw pool connection if needed
  getPool(): mysql.Pool {
    return this.pool;
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      console.log('🔌 MySQL Connection Pool closed.');
    }
  }
}
