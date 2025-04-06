import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function getSchemas() {
  const result = await query(`
    SELECT schema_name 
    FROM information_schema.schemata 
    WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
  `);
  return result.rows.map(row => row.schema_name);
}

export async function getTables(schema: string) {
  const result = await query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = $1
  `, [schema]);
  return result.rows.map(row => row.table_name);
}

export async function getTableData(schema: string, table: string) {
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
}

export async function getDatabaseName() {
  const result = await query('SELECT current_database() as database_name');
  return result.rows[0].database_name;
} 