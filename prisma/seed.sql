-- サンプルデータの挿入
INSERT INTO test_schema.users (username, email) VALUES
('山田太郎', 'yamada@example.com'),
('鈴木花子', 'suzuki@example.com'),
('佐藤一郎', 'sato@example.com'),
('田中健一', 'tanaka@example.com'),
('中村美咲', 'nakamura@example.com'),
('小林正', 'kobayashi@example.com'),
('加藤優子', 'kato@example.com'),
('伊藤誠', 'ito@example.com'),
('渡辺真理', 'watanabe@example.com'),
('山本健太', 'yamamoto@example.com');

INSERT INTO test_schema.products (name, price, stock_quantity) VALUES
('ノートパソコン', 120000, 10),
('スマートフォン', 80000, 20),
('タブレット', 50000, 15),
('デスクトップPC', 150000, 8),
('ワイヤレスイヤホン', 25000, 30),
('スマートウォッチ', 35000, 25),
('ゲーミングマウス', 8000, 40),
('キーボード', 12000, 35),
('モニター', 45000, 12),
('プリンター', 30000, 15);

INSERT INTO test_schema.orders (user_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 3, 1),
(3, 1, 1),
(3, 3, 2),
(4, 4, 1),
(4, 5, 2),
(5, 6, 1),
(5, 7, 3),
(6, 8, 2),
(6, 9, 1),
(7, 10, 1),
(7, 1, 1),
(8, 2, 2),
(8, 3, 1),
(9, 4, 1),
(9, 5, 2),
(10, 6, 1),
(10, 7, 1),
(10, 8, 1); 