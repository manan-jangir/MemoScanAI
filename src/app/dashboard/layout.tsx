import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut, LayoutDashboard } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // In a production app, we would enforce authentication:
  // if (!user) redirect('/')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-none z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-extrabold text-2xl text-slate-800 dark:text-white tracking-tight">
            <LayoutDashboard className="text-brand w-7 h-7" />
            MemoScan AI
          </div>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <span className="text-sm font-semibold hidden sm:inline-block bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
              {user?.email || 'Guest Explorer Mode'}
            </span>
            <form action={async () => {
              'use server'
              const supabase = await createClient()
              await supabase.auth.signOut()
              redirect('/')
            }}>
              <button 
                className="p-2.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-full transition-colors flex items-center justify-center" 
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
