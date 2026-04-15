'use client'

import { X, Calendar, Tag, Trash2, Edit3, Loader2 } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function DocumentModal({ doc, onClose }: { doc: any, onClose: () => void }) {
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [draftDate, setDraftDate] = useState('')
  const [isUpdating, startUpdateTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    if (doc) {
      document.body.style.overflow = 'hidden'
      // Set the draft value ensuring timezone isn't clipped
      if (doc.extracted_date) {
         setDraftDate(new Date(doc.extracted_date).toISOString().slice(0, 16))
      } else {
         setDraftDate('')
      }
    } else {
      document.body.style.overflow = 'unset'
      setIsEditingDate(false)
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [doc])

  if (!doc) return null

  const handleDelete = () => {
    startDeleteTransition(async () => {
      try {
        const { deleteDocument } = await import('@/app/actions/document')
        await deleteDocument(doc.id, doc.image_url)
        onClose()
      } catch (e) {
        alert("Failed to delete record.")
      }
    })
  }

  const handleSaveDate = () => {
    startUpdateTransition(async () => {
      try {
        const { updateReminder } = await import('@/app/actions/document')
        await updateReminder(doc.id, new Date(draftDate).toISOString())
        setIsEditingDate(false)
      } catch (e) {
        alert("Failed to update reminder.")
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl transition-all cursor-pointer" 
        onClick={() => !isDeleting && !isUpdating && onClose()} 
      />
      
      {/* Content Canvas */}
      <div className="relative bg-white dark:bg-slate-950 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        {/* Floating Close Button */}
        <button 
          onClick={onClose} 
          disabled={isDeleting || isUpdating}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/30 hover:bg-black/60 dark:bg-black/50 dark:hover:bg-brand backdrop-blur-md rounded-full text-white flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Original Raw Photo */}
        <div className="md:w-1/2 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative min-h-[300px] h-[40vh] md:h-auto md:max-h-none overflow-hidden group">
          <img 
            src={doc.image_url} 
            alt="Scanned Document Original" 
            className={`w-full h-full object-contain p-4 md:p-8 transition-all ${isDeleting ? 'opacity-20 blur-sm scale-95' : 'opacity-100 group-hover:scale-105'}`}
          />
          {isDeleting && (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 font-bold text-red-600 animate-pulse">
               <Trash2 className="w-12 h-12" />
               <p>Incinerating Record...</p>
            </div>
          )}
        </div>

        {/* Right Side: Structural Metadata Vault Info */}
        <div className="md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="inline-flex items-center bg-brand/10 text-brand px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
               <Tag className="w-4 h-4 mr-2" /> {doc.category}
            </div>
            <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
            >
               <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            {doc.title}
          </h2>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl mb-10 border-b-4 border-b-slate-200 dark:border-b-slate-800 shadow-sm transition-all group hover:border-brand/40">
            <div className="flex items-center text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mb-2 justify-between">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-brand" /> Scheduling Hook</span>
              {!isEditingDate && (
                <button onClick={() => setIsEditingDate(true)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 dark:text-slate-300">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditingDate ? (
              <div className="flex gap-2 items-center mt-2 animate-in slide-in-from-top-2">
                <input 
                  type="datetime-local" 
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.target.value)}
                  className="bg-white dark:bg-slate-950 px-4 py-2 rounded-xl text-lg font-bold border-2 focus:border-brand outline-none flex-1 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800"
                />
                <button 
                  onClick={handleSaveDate}
                  disabled={isUpdating}
                  className="bg-brand text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-brand-hover transition-colors shadow-lg disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
                </button>
                <button 
                  onClick={() => setIsEditingDate(false)}
                  disabled={isUpdating}
                  className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-slate-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p suppressHydrationWarning className="text-xl font-bold text-slate-800 dark:text-white ml-6">
                {doc.extracted_date ? new Date(doc.extracted_date).toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'No embedded date detected.'}
              </p>
            )}
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
