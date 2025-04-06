'use client';

import { useState, useEffect } from 'react';

interface DbInfo {
    database: string;
    schemas: string[];
    tablesBySchema: {
        schema: string;
        tables: string[];
    }[];
}

interface TableData {
    columns: {
        column_name: string;
        data_type: string;
    }[];
    data: any[];
}

export default function DBTest() {
    const [dbInfo, setDbInfo] = useState<DbInfo | null>(null);
    const [selectedSchema, setSelectedSchema] = useState<string>('');
    const [selectedTable, setSelectedTable] = useState<string>('');
    const [tableData, setTableData] = useState<TableData | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchDbInfo();
    }, []);

    useEffect(() => {
        if (selectedSchema && selectedTable) {
            fetchTableData();
        }
    }, [selectedSchema, selectedTable]);

    const fetchDbInfo = async () => {
        try {
            const response = await fetch('/api/db/info');
            const data = await response.json();
            console.log('DB Info:', data);
            setDbInfo(data);
            setError('');
        } catch (error) {
            setError('データベース情報の取得に失敗しました');
        }
    };

    const fetchTableData = async () => {
        try {
            const response = await fetch(`/api/db/table?schema=${selectedSchema}&table=${selectedTable}`);
            const data = await response.json();
            console.log('Table Data:', data);
            if (data.error) {
                setError(data.error);
                setTableData(null);
            } else {
                setTableData(data);
                setError('');
            }
        } catch (error) {
            console.error('Table Data Error:', error);
            setError('テーブルデータの取得に失敗しました');
            setTableData(null);
        }
    };

    const handleSchemaChange = (schema: string) => {
        setSelectedSchema(schema);
        setSelectedTable('');
        setTableData(null);
    };

    const handleTableChange = (table: string) => {
        setSelectedTable(table);
        setTableData(null);
    };

    return (
        <div className="p-4">
            <div className="max-w-[1000px] mx-auto">
                <h2 className="text-base font-semibold text-gray-700 mb-1">DB Test</h2>
            </div>

            <div className="mt-6 max-w-[1000px] mx-auto">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">データベース:</label>
                        <span className="text-sm">{dbInfo?.database}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">スキーマ:</label>
                        <select
                            value={selectedSchema}
                            onChange={(e) => handleSchemaChange(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value="">選択してください</option>
                            {dbInfo?.schemas.map((schema) => (
                                <option key={schema} value={schema}>
                                    {schema}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">テーブル:</label>
                        <select
                            value={selectedTable}
                            onChange={(e) => handleTableChange(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                            disabled={!selectedSchema}
                        >
                            <option value="">選択してください</option>
                            {dbInfo?.tablesBySchema
                                .find((item) => item.schema === selectedSchema)
                                ?.tables.map((table) => (
                                    <option key={table} value={table}>
                                        {table}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                {error && <div className="text-red-500 text-sm mt-4">{error}</div>}

                {tableData && (
                    <div className="mt-6 max-h-[165px] overflow-y-auto">
                        <table className="min-w-full border-collapse text-sm">
                            <thead className="sticky top-0 bg-gray-100">
                                <tr>
                                    {tableData.columns?.map((column) => (
                                        <th key={column.column_name} className="border px-2 py-[2px] text-left">
                                            {column.column_name}
                                            <span className="text-gray-500 text-xs ml-1">({column.data_type})</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.data?.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-gray-50">
                                        {tableData.columns?.map((column) => (
                                            <td key={column.column_name} className="border px-2 py-1">
                                                {row[column.column_name]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
