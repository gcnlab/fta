import { NextResponse } from 'next/server';
import { getSchemas, getTables, getDatabaseName } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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