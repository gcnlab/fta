import { NextRequest, NextResponse } from 'next/server';
import { getTableData, getDatabaseName } from '@/lib/db';

const VALID_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const schema = searchParams.get('schema');
    const table = searchParams.get('table');

    if (!schema || !table) {
      return NextResponse.json(
        { error: 'スキーマ名とテーブル名が必要です' },
        { status: 400 }
      );
    }

    if (!VALID_NAME_REGEX.test(schema) || !VALID_NAME_REGEX.test(table)) {
      return NextResponse.json(
        { error: '無効なスキーマ名またはテーブル名です' },
        { status: 400 }
      );
    }

    const database = await getDatabaseName();
    const { columns, data } = await getTableData(schema, table);

    return NextResponse.json({
      database,
      columns,
      data,
    });
  } catch (error) {
    console.error('Table data error:', error);
    return NextResponse.json(
      { error: 'テーブルデータの取得に失敗しました' },
      { status: 500 }
    );
  }
} 