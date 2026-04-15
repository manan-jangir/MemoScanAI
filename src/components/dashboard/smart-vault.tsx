'use client'

import { useState } from 'react'
import { Search, Calendar, FileText } from 'lucide-react'
import { DocumentModal } from '@/components/dashboard/document-modal'

export function SmartVault({ data }: { data: any[] }) {
  const [query, setQuery] = useState('')
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null)

  const filtered = data.filter(doc =>
    doc.title.toLowerCase().includes(query.toLowerCase()) ||
    doc.excerpt?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-7 h-7" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search through extracted text..."
          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 text-xl rounded-2xl py-6 pl-16 pr-6 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-4">
        {filtered.length === 0 && data.length > 0 && <p className="text-slate-500 font-medium col-span-full py-4 text-center">No documents found matching "{query}"</p>}
        {data.length === 0 && <p className="text-slate-400 font-bold col-span-full py-12 text-center text-lg">Your vault is looking empty!<br />Drop an invoice or invitation up top to see the AI magic.</p>}

        {filtered.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 hover:border-brand hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4 gap-4">
              <h3 className="font-bold text-xl text-slate-800 dark:text-white group-hover:text-brand transition-colors line-clamp-1">
                {doc.title}
              </h3>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
                {doc.category}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
              <FileText className="w-4 h-4 inline mr-1 align-text-bottom opacity-50" /> {doc.excerpt || "No summary available."}
            </p>
            <div className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl">
              <Calendar className="w-5 h-5 mr-3 text-brand" />
              Date: <span suppressHydrationWarning className="ml-1 text-slate-900 dark:text-white inline-block">{doc.extracted_date ? new Date(doc.extracted_date).toLocaleDateString("en-US") : 'None found'}</span>
            </div>
          </div>
        ))}
      </div>

      <DocumentModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  )
}
