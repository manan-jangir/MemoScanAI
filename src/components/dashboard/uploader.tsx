'use client'

import { useState, useRef } from 'react'
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Uploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadState, setUploadState] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFile = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    setUploadState('Uploading to Secure Vault...')
    
    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Must be logged in!")

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${userData.user.id}/${fileName}`

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('document_scans')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('document_scans')
        .getPublicUrl(filePath)

      setUploadState('Extracting magic with Gemini AI...')

      // Convert file to base64 to avoid server-to-server fetch blocks (ECONNRESET)
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = error => reject(error)
      })

      // 2. Call our API Route to do OCR and DB insert
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: urlData.publicUrl, base64Image, mimeType: file.type })
      })

      if (!res.ok) throw new Error("AI Extraction failed")

      setUploadState('Success!')
      setTimeout(() => {
        setIsUploading(false)
        router.refresh() // Reload server components to show the newly extracted item
      }, 1500)

    } catch (e: any) {
      console.error(e)
      setUploadState(`Error: ${e.message}`)
      setTimeout(() => setIsUploading(false), 3000)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div 
      className={`border-4 border-dashed rounded-[2rem] p-8 sm:p-12 text-center cursor-pointer transition-all ${
        isDragging 
          ? 'border-brand bg-brand/5' 
          : 'border-slate-300 dark:border-slate-700 hover:border-brand/50 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept="image/*,application/pdf"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) handleFile(e.target.files[0])
        }}
      />

      <div className="mx-auto w-24 h-24 mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center pointer-events-none">
        {isUploading ? (
          uploadState === 'Success!' ? (
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          ) : (
            <Loader2 className="w-10 h-10 text-brand animate-spin" />
          )
        ) : (
          <UploadCloud className="w-10 h-10 text-slate-500 dark:text-slate-400" />
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mb-2 pointer-events-none">
        {isUploading ? uploadState : 'Drag & Drop your Invitation or Bill'}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 font-medium pointer-events-none">
        {!isUploading && 'or click here to open file browser (supports JPG, PNG)'}
      </p>
    </div>
  )
}
