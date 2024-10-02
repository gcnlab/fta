// /app/contents/mappings/types/index.ts

export interface MappingData {
    fileName: string;          // ファイル名
    tableName: string;         // テーブル名 (英語)
    tableNameJ: string;        // テーブル名 (日本語)
    columns: {
        colPos: number;        // 出力列番号
        filePos: number;       // 入力ファイル内の列番号
        hdName: string;        // 英語ヘッダ名
        hdNameJ: string;       // 日本語ヘッダ名
    }[];
}
