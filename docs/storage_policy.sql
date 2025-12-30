-- Storage Bucketの作成とポリシー設定（写真アップロード用）

-- 1. trip-photos バケットが無ければ作成 (public)
insert into storage.buckets (id, name, public)
values ('trip-photos', 'trip-photos', true)
on conflict (id) do nothing;

-- 2. "trip-photos" バケットへのアップロード許可 (ログインユーザーのみ)
create policy "Allow Authenticated Uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'trip-photos' );

-- 3. "trip-photos" バケットの閲覧許可 (誰でも)
create policy "Allow Public Select"
on storage.objects for select
to public
using ( bucket_id = 'trip-photos' );
