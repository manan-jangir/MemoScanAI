import { Uploader } from '@/components/dashboard/uploader'
import { SmartVault } from '@/components/dashboard/smart-vault'
import { Upcoming } from '@/components/dashboard/upcoming'
import { CalendarGrid } from '@/components/dashboard/calendar-grid'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const sp = await searchParams
  const view = sp.view === 'calendar' ? 'calendar' : 'vault'

  // Standard production route protection
  if (!user) redirect('/')

  // Fetch the actual parsed metadata from Postgres
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  const validDocuments = documents || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full min-h-[calc(100vh-12rem)]">
      <div className="lg:col-span-3 space-y-8 flex flex-col relative w-full h-full">
        {/* Top Section: Upload Area */}
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 sm:p-8 shadow-sm border-2 border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-slate-900 dark:text-white">Frictionless Ingest</h2>
          <Uploader />
        </section>
        
        {/* Bottom Section: The Smart Vault or Calendar View */}
        <section className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] p-4 sm:p-8 shadow-sm border-2 border-slate-100 dark:border-slate-800 flex flex-col min-h-[500px]">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
            {view === 'calendar' ? 'Event Calendar' : 'Smart Vault'}
            <span className="text-sm font-medium bg-brand/10 text-brand px-3 py-1 rounded-full shrink-0">
              {validDocuments.length} Records
            </span>
          </h2>
          {view === 'calendar' ? <CalendarGrid data={validDocuments} /> : <SmartVault data={validDocuments} />}
        </section>
      </div>
      
      {/* Sidebar: Upcoming Extracted Dates */}
      <div className="lg:col-span-1">
        <section className="bg-blue-50 dark:bg-slate-900/50 rounded-[2rem] p-4 sm:p-8 shadow-sm border-2 border-blue-100 dark:border-slate-800 lg:sticky lg:top-24">
          <h2 className="text-2xl font-extrabold mb-6 text-blue-900 dark:text-blue-100">Upcoming</h2>
          <Upcoming data={validDocuments} />
        </section>
      </div>
    </div>
  )
}
