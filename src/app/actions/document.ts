'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteDocument(id: string, imageUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Decode the image URL to target the storage bucket payload physically
  const urlParts = imageUrl.split('/')
  const fileName = urlParts[urlParts.length - 1]
  
  if (fileName) {
    const { error: storageError } = await supabase
      .storage
      .from('document_scans')
      .remove([`${user.id}/${fileName}`])
      
    if (storageError) console.error("Storage delete error:", storageError)
  }

  // Delete the actual structural database array metadata 
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (dbError) throw new Error('Failed to delete document from Database')

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateReminder(id: string, newDateIso: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('documents')
    .update({ extracted_date: newDateIso || null })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error('Failed to update event timeline')

  revalidatePath('/dashboard')
  return { success: true }
}
