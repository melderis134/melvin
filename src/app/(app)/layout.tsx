import { Sidebar } from '@/components/layout/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:pl-64">
      <Sidebar />
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
