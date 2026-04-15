'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { DocumentModal } from '@/components/dashboard/document-modal'

export function CalendarGrid({ data }: { data: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null)

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
        <button onClick={prevMonth} className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:text-brand border border-slate-200 dark:border-slate-700 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>  
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white">
            {monthNames[month]} {year}
        </h3>
        <button onClick={nextMonth} className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:text-brand border border-slate-200 dark:border-slate-700 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-3 flex-1 overflow-x-auto min-w-[500px] w-full">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-xs sm:text-sm tracking-widest uppercase text-slate-400 dark:text-slate-500 py-2">
            {day}
          </div>
        ))}

        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="p-2 sm:p-4 rounded-2xl bg-transparent" />
        ))}

        {days.map(day => {
          const checkDate = new Date(year, month, day)
          checkDate.setHours(0,0,0,0)

          const dayDocs = data.filter(doc => {
            if (!doc.extracted_date) return false
            const dDate = new Date(doc.extracted_date)
            dDate.setHours(0,0,0,0)
            return dDate.getTime() === checkDate.getTime()
          })

          const isToday = new Date().setHours(0,0,0,0) === checkDate.getTime()

          return (
            <div key={day} className={`p-2 sm:p-4 rounded-2xl border-2 min-h-[90px] sm:min-h-[140px] transition-all relative group ${
                isToday ? 'bg-brand/5 border-brand' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-brand/40'
              }`}>
              <span className={`font-bold text-lg ${isToday ? 'text-brand' : 'text-slate-800 dark:text-white'}`}>{day}</span>
              
              <div className="mt-2 space-y-1.5 pt-1">
                {dayDocs.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="truncate bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-bold px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg cursor-pointer hover:bg-brand hover:text-white transition-colors"
                  >
                    <FileText className="hidden sm:inline w-3 h-3 mr-1" />
                    {doc.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <DocumentModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  )
}
