-- Bucket público de solo lectura para las fotos de inspo/moodboard
insert into storage.buckets (id, name, public)
values ('inspo', 'inspo', true)
on conflict (id) do nothing;

create policy "inspo_public_read"
on storage.objects for select
using (bucket_id = 'inspo');

create policy "inspo_open_write"
on storage.objects for insert
with check (bucket_id = 'inspo');

create policy "inspo_open_delete"
on storage.objects for delete
using (bucket_id = 'inspo');
