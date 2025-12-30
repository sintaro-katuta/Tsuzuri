-- Supabase Realtime をテーブルで有効化するコマンド
-- これを実行しないと、クライアント側で変更イベントを受け取れません。

-- 1. timeline_items テーブルの変更を配信
alter publication supabase_realtime add table timeline_items;

-- 2. trips テーブルの変更も配信（必要であれば）
alter publication supabase_realtime add table trips;
