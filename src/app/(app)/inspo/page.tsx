import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { InspoRow } from '@/lib/supabase/types';
import { InspoUploader } from './InspoUploader';
import { InspoGrid } from './InspoGrid';

export const dynamic = 'force-dynamic';

export default async function InspoPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('inspo').select('*').order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Inspo" subtitle="Moodboard de decoración, flores, vestimenta y más." />
      <InspoUploader />
      <InspoGrid items={(data ?? []) as InspoRow[]} />
    </div>
  );
}
