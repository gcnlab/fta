import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// スキーマ名とテーブル名の検証用正規表現
const VALID_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export async function GET(request: NextRequest) {
  try {
    const schema = request.nextUrl.searchParams.get('schema');
    const table = request.nextUrl.searchParams.get('table');

    if (!schema || !table) {
      return NextResponse.json({ error: 'スキーマとテーブル名を指定してください' }, { status: 400 });
    }

    // スキーマ名とテーブル名の検証
    if (!VALID_NAME_REGEX.test(schema) || !VALID_NAME_REGEX.test(table)) {
      return NextResponse.json({ error: '無効なスキーマ名またはテーブル名です' }, { status: 400 });
    }

    // データベース名を取得
    const dbInfo = await prisma.$queryRaw`
      SELECT current_database() as database_name
    `;
    const databaseName = (dbInfo as { database_name: string }[])[0].database_name;

    // テーブルの存在確認
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = ${schema} 
        AND table_name = ${table}
      ) as exists
    `;

    if (!(tableExists as { exists: boolean }[])[0].exists) {
      return NextResponse.json({ error: '指定されたテーブルは存在しません' }, { status: 404 });
    }

    // テーブルのカラム情報を取得
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = ${schema} AND table_name = ${table}
      ORDER BY ordinal_position
    `;

    // テーブルのデータを取得（動的なテーブル名を使用）
    const data = await prisma.$queryRawUnsafe(
      `SELECT * FROM "${schema}"."${table}"`
    );

    return NextResponse.json({
      database: databaseName,
      columns: (columns as { column_name: string; data_type: string }[]).map(col => ({
        column_name: col.column_name,
        data_type: col.data_type
      })),
      data: data as any[]
    });
  } catch (error) {
    console.error('テーブルデータの取得エラー:', error);
    return NextResponse.json({ error: 'テーブルデータの取得に失敗しました' }, { status: 500 });
  }
} 