'use client'

import { X, Calendar, Tag } from 'lucide-react'
import { useEffect } from 'react'

export function DocumentModal({ doc, onClose }: { doc: any, onClose: () => void }) {
  // Prevent body scroll only when modal is actively populated
  useEffect(() => {
    if (doc) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [doc])

  if (!doc) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl transition-all cursor-pointer" 
        onClick={onClose} 
      />
      
      {/* Content Canvas */}
      <div className="relative bg-white dark:bg-slate-950 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        {/* Floating Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/30 hover:bg-black/60 dark:bg-black/50 dark:hover:bg-brand backdrop-blur-md rounded-full text-white flex items-center justify-center transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Original Raw Photo */}
        <div className="md:w-1/2 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative min-h-[300px] h-[40vh] md:h-auto md:max-h-none overflow-hidden">
          <img 
            src={doc.image_url} 
            alt="Scanned Document Original" 
            className="w-full h-full object-contain p-4 md:p-8"
          />
        </div>

        {/* Right Side: Structural Metadata Vault Info */}
        <div className="md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-full">
          <div className="inline-flex items-center w-max mb-6 bg-brand/10 text-brand px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
             <Tag className="w-4 h-4 mr-2" /> {doc.category}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
            {doc.title}
          </h2>
          
          <div className="flex items-center text-slate-500 dark:text-slate-400 font-bold text-lg mb-10 pb-6 border-b-2 border-slate-100 dark:border-slate-800/50">
            <Calendar className="w-6 h-6 mr-3 text-brand" />
            {doc.extracted_date ? new Date(doc.extracted_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No embedded date detected.'}
          </div>

          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Gemini AI Synthesis</h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg md:text-xl font-medium">
            {doc.excerpt || "No summary parameters were synthesized for this record."}
          </p>
        </div>

      </div>
    </div>
  )
}
