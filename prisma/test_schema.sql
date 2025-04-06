-- スキーマの作成
CREATE SCHEMA IF NOT EXISTS test_schema;

-- ユーザーテーブル
CREATE TABLE test_schema.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品テーブル
CREATE TABLE test_schema.products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 注文テーブル
CREATE TABLE test_schema.orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES test_schema.users(user_id),
    product_id INTEGER REFERENCES test_schema.products(product_id),
    quantity INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
