import { AuthForm } from "@/components/auth/auth-form"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <main className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-brand rounded-3xl text-white mb-4 shadow-lg shadow-brand/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="m9 15 2 2 4-4"/>
            </svg>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            MemoScan AI
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
            Digitize your documents and never forget an important date again.
          </p>
        </div>

        <div className="pt-4">
          <AuthForm />
        </div>

        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Frictionless Ingest</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Snap a photo and immediately save it.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Smart Vault</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Search by text directly from the document.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Auto Alerts</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Upcoming events magically appear.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
