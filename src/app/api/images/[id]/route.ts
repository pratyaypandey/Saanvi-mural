import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { supabase, IMAGE_BUCKET } from '@/lib/supabase'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const image = await prisma.image.findUnique({
      where: { id }
    })
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
    // Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .remove([image.filename])
    
    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue with database deletion even if storage fails
    }
    
    // Soft delete from database
    await prisma.image.update({
      where: { id },
      data: { isActive: false }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
} 