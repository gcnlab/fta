import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // データベース名を取得
    const dbInfo = await prisma.$queryRaw`
      SELECT current_database() as database_name
    `;
    const databaseName = (dbInfo as { database_name: string }[])[0].database_name;

    // スキーマ一覧を取得
    const schemas = await prisma.$queryRaw`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
    `;

    // 各スキーマのテーブル一覧を取得
    const tablesBySchema = await Promise.all(
      (schemas as { schema_name: string }[]).map(async (schema) => {
        const tables = await prisma.$queryRaw`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = ${schema.schema_name}
        `;
        return {
          schema: schema.schema_name,
          tables: (tables as { table_name: string }[]).map(t => t.table_name)
        };
      })
    );

    return NextResponse.json({
      database: databaseName,
      schemas: (schemas as { schema_name: string }[]).map(s => s.schema_name),
      tablesBySchema
    });
  } catch (error) {
    console.error('データベース情報の取得エラー:', error);
    return NextResponse.json({ error: 'データベース情報の取得に失敗しました' }, { status: 500 });
  }
} 