import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TodoRow } from '@/lib/supabase/types';
import { TodoTable } from './TodoTable';

export const dynamic = 'force-dynamic';

export default async function TodoPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('todo_list')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="To do list" subtitle="Pendientes generales de la organización." />
      <TodoTable rows={(data ?? []) as TodoRow[]} />
    </div>
  );
}
