import { NextRequest, NextResponse } from 'next/server';
import { getSchemas, getTables, getDatabaseName, getAvailableDatabases, switchDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dbName = searchParams.get('db');

    // データベースが指定されている場合は切り替え
    if (dbName) {
      await switchDatabase(dbName);
    }

    const database = await getDatabaseName();
    const schemas = await getSchemas();
    
    const tablesBySchema = await Promise.all(
      schemas.map(async (schema) => {
        const tables = await getTables(schema);
        return { schema, tables };
      })
    );

    return NextResponse.json({
      database,
      availableDatabases: getAvailableDatabases(),
      schemas,
      tablesBySchema,
    });
  } catch (error) {
    console.error('Database info error:', error);
    return NextResponse.json(
      { error: 'データベース情報の取得に失敗しました' },
      { status: 500 }
    );
  }
} 