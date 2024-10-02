// /app/contents/wizards/migration/types/index.ts

export interface Category {
    name: string;
    subSteps: string[];
}

export interface Step {
    id: number;
    name: string;
    details: StepDetails;
}

export enum StepType {

    HD_BK_PRE = '■ 事前バックアップ',
    HD_BK = '■ バックアップ',
    HD_RL = '■ リリース',

    CN_DB = '接続 - DB',
    CN_RDT = '接続 - RDT',
    CN_SMB = '接続 - 共有',

    BK_DB_OBJ = 'バックアップ - DB - オブジェクト',
    BK_DB_DATA = 'バックアップ - DB - データ',
    BK_FILE = 'バックアップ - FILE',

    RL_TOOL = 'リリース - ツール操作',
    RL_FILE = 'リリース - ファイル改廃',
    RL_DATA = 'リリース - データ改廃 - テーブル直接編集',
    RL_EXEC_DIRECT = 'リリース - スクリプト実行 - 手順書に記載',
    RL_EXEC_USEFILE = 'リリース - スクリプト実行 - ファイルに記載',
    RL_ADDITIONAL = 'リリース - 外部手順書使用',

    FR_TX_ONE = '  - 追加入力（１行）',
    FR_TX_MLP = '  - 追加入力（複数行）',

    // 他のステップタイプを必要に応じて追加
}

export interface StepDetails {

    title?: string; // タイトル
    duration?: number; // 所要時間
    direction?: string; // 作業指示
    user?: string; // ユーザ名
    password?: string; // パスワード
    connectTo?: string; // 接続先
    objType?: string; // オブジェクトタイプ
    objName?: string; // オブジェクト名
    srcPath?: string; // コピー元
    dstPath?: string; // コピー先
    script?: string; // 実行スクリプト
    description?: string // 記述
    confirmation?: string; // 確認事項
    additional?: string; // 追加入力

}
