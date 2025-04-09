import { Pool } from 'pg';

// データベース接続情報の型定義
interface DatabaseConfig {
  name: string;
  url: string;
}

// 利用可能なデータベースの設定
const databases: DatabaseConfig[] = [
    { name: 'TestDatabase', url: process.env.DATABASE_URL_TESTDATABASE! },
    { name: 'main_db', url: process.env.DATABASE_URL_MAIN! },
    { name: 'test_db', url: process.env.DATABASE_URL_TEST! },
  { name: 'dev_db', url: process.env.DATABASE_URL_DEV! },
];

// アクティブなデータベースの接続プール
let activePool: Pool | null = null;

// 初期化時にデフォルトのデータベースを設定
async function initializeDefaultDatabase() {
  if (!activePool && databases.length > 0) {
    try {
      activePool = new Pool({
        connectionString: databases[0].url,
        ssl: false, // 開発環境ではSSLを無効化
      });
      // 接続テスト
      const client = await activePool.connect();
      client.release();
    } catch (error) {
      console.error('データベース接続エラー:', error);
      activePool = null;
      throw error;
    }
  }
}

// データベースを切り替える関数
export async function switchDatabase(dbName: string) {
  const config = databases.find(db => db.name === dbName);
  if (!config) {
    throw new Error('指定されたデータベースが見つかりません');
  }

  try {
    // 既存のプールを閉じる
    if (activePool) {
      await activePool.end();
    }

    // 新しいプールを作成
    activePool = new Pool({
      connectionString: config.url,
      ssl: false, // 開発環境ではSSLを無効化
    });

    // 接続テスト
    const client = await activePool.connect();
    client.release();

    return config.name;
  } catch (error) {
    console.error('データベース切り替えエラー:', error);
    activePool = null;
    throw error;
  }
}

// 現在のプールを取得する関数
async function getPool() {
  if (!activePool) {
    await initializeDefaultDatabase();
  }
  if (!activePool) {
    throw new Error('データベースが選択されていません');
  }
  return activePool;
}

// データベース一覧を取得する関数
export function getAvailableDatabases() {
  return databases.map(db => db.name);
}

export async function query(text: string, params?: any[]) {
  const pool = await getPool();
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } catch (error) {
    console.error('クエリ実行エラー:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getSchemas() {
  try {
    const result = await query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
    `);
    return result.rows.map(row => row.schema_name);
  } catch (error) {
    console.error('スキーマ取得エラー:', error);
    throw error;
  }
}

export async function getTables(schema: string) {
  try {
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = $1
    `, [schema]);
    return result.rows.map(row => row.table_name);
  } catch (error) {
    console.error('テーブル一覧取得エラー:', error);
    throw error;
  }
}

export async function getTableData(schema: string, table: string) {
  try {
    const result = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = $1 AND table_name = $2
    `, [schema, table]);

    const data = await query(`
      SELECT * FROM "${schema}"."${table}"
    `);

    return {
      columns: result.rows,
      data: data.rows
    };
  } catch (error) {
    console.error('テーブルデータ取得エラー:', error);
    throw error;
  }
}

export async function getDatabaseName() {
  try {
    const result = await query('SELECT current_database() as database_name');
    return result.rows[0].database_name;
  } catch (error) {
    console.error('データベース名取得エラー:', error);
    throw error;
  }
} 