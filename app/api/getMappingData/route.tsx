// /app/api/getMappingData/route.tsx

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// GETリクエストを処理する
export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    // JSONファイルのパスを指定
    const filePath = path.join(process.cwd(), 'data', 'mappingData.json');
    console.log('File path:', filePath); // パスを表示して確認
    console.log('Requested fileId:', fileId); // fileIdを表示して確認

    try {
        // 非同期でファイルの読み込み
        const fileData = await fs.readFile(filePath, 'utf-8');
        const mappingData = JSON.parse(fileData);
        //console.log('Mapping data:', mappingData); // 読み込んだデータを表示して確認

        // ファイルIDに対応するデータを返す
        if (fileId && mappingData[fileId]) {
            return NextResponse.json(mappingData[fileId]);
        } else {
            return NextResponse.json({ error: 'Mapping data not found' }, { status: 404 });
        }
    } catch (err) {
        console.error('Error reading file:', err); // エラーの詳細を表示
        return NextResponse.json({ error: 'Failed to read mapping data' }, { status: 500 });
    }
}
