'use client';

import { useRef, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { CategoriaInspo } from '@/lib/supabase/types';
import { createInspo } from './actions';

const CATEGORIA_OPTIONS: CategoriaInspo[] = [
  'Decoración',
  'Flores',
  'Vestimenta',
  'Torta',
  'Salón',
  'Papelería',
  'Otro',
];

export function InspoUploader() {
  const [categoria, setCategoria] = useState<CategoriaInspo>('Otro');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) return;

    setUploading(true);
    const supabase = createBrowserSupabaseClient();

    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      setProgressText(`Subiendo ${i + 1} de ${list.length}…`);

      const ext = file.name.split('.').pop();
      const path = `${crypto.randomUUID()}${ext ? `.${ext}` : ''}`;

      const { error: uploadError } = await supabase.storage.from('inspo').upload(path, file);
      if (uploadError) {
        console.error(uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from('inspo').getPublicUrl(path);
      const titulo = file.name.replace(/\.[^/.]+$/, '');

      await createInspo({ titulo, categoria, foto_url: publicUrlData.publicUrl });
    }

    setUploading(false);
    setProgressText('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        uploadFiles(e.dataTransfer.files);
      }}
      className={`mb-6 flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition sm:flex-row sm:justify-between sm:text-left ${
        dragOver ? 'border-accent bg-accent-soft/40' : 'border-border bg-white'
      }`}
    >
      <div>
        <p className="text-sm font-medium text-ink">Arrastrá fotos acá o subilas manualmente</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {uploading ? progressText : 'Podés seleccionar varias a la vez.'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as CategoriaInspo)}
          className="rounded-lg border border-border bg-white px-2.5 py-2 text-sm outline-none focus:border-accent"
        >
          {CATEGORIA_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-ink px-3.5 py-2 text-sm font-medium text-paper transition hover:bg-ink/90 disabled:opacity-50"
        >
          {uploading ? 'Subiendo…' : 'Subir foto'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
