// /app/api/uploadFile/route.tsx

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Next.js App Router で Node.js の機能を使うために runtime を指定
export const runtime = 'nodejs';

interface FormDataFile {
  name: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

interface UploadResponse {
  message: string;
  file?: {
    filename: string;
    url: string;
    originalName: string;
  };
}

export const POST = async (req: Request): Promise<NextResponse<UploadResponse>> => {
  try {
    // フォームデータを解析
    const formData = await req.formData();
    const file = formData.get('file') as FormDataFile | null;
    if (!file) {
      throw new Error('ファイルが送信されていません');
    }
    // Web API の File オブジェクトから ArrayBuffer を取得し、Buffer に変換
    const buffer = Buffer.from(await file.arrayBuffer());
    // public/uploads に保存するディレクトリを設定
    const uploadDir = path.join(process.cwd(), 'file', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    // 元のファイル名（ファイルIDとして利用）を保持
    const originalName = file.name;
    const baseName = path.basename(originalName, path.extname(originalName));
    const ext = path.extname(originalName);
    // タイムスタンプを付与して一意のファイル名にする
    const filename = `${baseName}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);
    // ファイルをディスクに保存
    fs.writeFileSync(filePath, buffer);
    console.log('アップロードされたファイル:', filePath);
    // public 内に保存しているので /uploads/filename でアクセス可能
    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({
      message: 'ファイルアップロード成功',
      file: { filename, url: fileUrl, originalName },
    });
  } catch (error) {
    console.error('アップロードエラー:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '不明なエラー' },
      { status: 500 }
    );
  }
};
