import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const image = await prisma.foodImage.findUnique({
      where: { id }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete from Supabase storage
    const { error: deleteError } = await supabase.storage
      .from('food-images')
      .remove([image.filename])

    if (deleteError) {
      console.error('Supabase delete error:', deleteError)
    }

    // Delete from database
    await prisma.foodImage.delete({
      where: { id }
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
