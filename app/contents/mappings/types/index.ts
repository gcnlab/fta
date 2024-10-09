// /app/contents/mappings/types.ts

export interface Column {
    colPos: number;
    filePos: number;
    hdName: string;
    hdNameJ: string;
}

export interface MappingData {
    fileName: string;
    tableName: string;
    tableNameJ: string;
    columns: Column[];
}
