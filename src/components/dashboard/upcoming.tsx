'use client'

import { CalendarDays, AlertCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function Upcoming({ data }: { data: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isCalendarView = searchParams.get('view') === 'calendar'

  // Filter items strictly with dates in the future
  const now = new Date()
  now.setHours(0, 0, 0, 0) // ignore time of day for exact date matches

  const upcomingEvents = data
    .filter(doc => doc.extracted_date && new Date(doc.extracted_date) >= now)
    .sort((a, b) => new Date(a.extracted_date).getTime() - new Date(b.extracted_date).getTime())
    .slice(0, 5) // Render top 5 closest events

  const formatRelative = (dateStr: string) => {
    const target = new Date(dateStr)
    const diffTime = target.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today!'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `In ${diffDays} Days`
    return target.toLocaleDateString("en-US")
  }

  const toggleView = () => {
    if (isCalendarView) {
      router.push('/dashboard')
    } else {
      router.push('/dashboard?view=calendar')
    }
  }

  return (
    <div className="space-y-4">
      {upcomingEvents.length === 0 && (
        <p className="text-blue-900/60 dark:text-blue-200/50 font-bold py-6 text-center text-sm">
          No impending dates detected from your documents!
        </p>
      )}
      {upcomingEvents.map((event) => {
        const diffTime = new Date(event.extracted_date).getTime() - now.getTime()
        const urgent = diffTime < (1000 * 60 * 60 * 24 * 3) // Extremely urgent flag if < 3 dys

        return (
          <div
            key={event.id}
            className={`p-5 rounded-2xl border-2 flex items-start gap-4 transition-all hover:scale-[1.02] cursor-pointer ${urgent
                ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900'
                : 'bg-white border-blue-100/50 dark:bg-slate-800 dark:border-slate-700'
              }`}
          >
            <div className={`p-3 rounded-xl shrink-0 ${urgent ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-slate-700'}`}>
              {urgent ? (
                <AlertCircle className={`w-7 h-7 ${urgent ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
              ) : (
                <CalendarDays className={`w-7 h-7 text-blue-600 dark:text-blue-400`} />
              )}
            </div>
            <div>
              <h4 className={`font-extrabold text-sm sm:text-lg mb-1 leading-tight line-clamp-2 ${urgent ? 'text-red-900 dark:text-red-200' : 'text-slate-800 dark:text-white'}`}>
                {event.title}
              </h4>
              <p suppressHydrationWarning className={`font-bold text-xs sm:text-base ${urgent ? 'text-red-700 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {formatRelative(event.extracted_date)}
              </p>
            </div>
          </div>
        )
      })}

      <button
        onClick={toggleView}
        className="w-full py-5 mt-6 text-brand font-extrabold text-lg bg-white dark:bg-slate-800 border-2 border-brand/20 rounded-2xl hover:bg-brand hover:text-white transition-all shadow-sm"
      >
        {isCalendarView ? 'Return to Smart Vault' : 'View Full Calendar'}
      </button>
    </div>
  )
}
