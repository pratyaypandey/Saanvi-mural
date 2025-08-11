import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { supabase, MAX_FILE_SIZE, SUPPORTED_IMAGE_TYPES } from '@/lib/supabase'
import sharp from 'sharp'

const FOOD_IMAGE_BUCKET = 'food-images'

export async function GET() {
  try {
    const images = await prisma.foodImage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        url: true,
        alt: true,
        filename: true,
        fileSize: true,
        dimensions: true,
        uploadedAt: true
      }
    })
    
    return NextResponse.json(images)
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch food images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please use JPEG, PNG, WebP, or AVIF' },
        { status: 400 }
      )
    }

    const totalStorage = await prisma.foodImage.aggregate({
      where: { isActive: true },
      _sum: { fileSize: true }
    })
    
    const currentUsage = totalStorage._sum.fileSize || 0
    if (currentUsage + file.size > 1 * 1024 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Storage limit reached. Please delete some images first.' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const filename = `food-${timestamp}.${fileExtension}`
    const storagePath = `${FOOD_IMAGE_BUCKET}/${filename}`

    const { error: uploadError } = await supabase.storage
      .from(FOOD_IMAGE_BUCKET)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image to storage' },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage
      .from(FOOD_IMAGE_BUCKET)
      .getPublicUrl(filename)

    let dimensions = null
    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const metadata = await sharp(buffer).metadata()
      dimensions = { 
        width: metadata.width || 0, 
        height: metadata.height || 0 
      }
    } catch (error) {
      console.warn('Could not get image dimensions:', error)
      dimensions = { width: 0, height: 0 }
    }

    const image = await prisma.foodImage.create({
      data: {
        filename,
        url: urlData.publicUrl,
        storagePath,
        alt: alt || filename.replace(/\.[^/.]+$/, ""),
        fileSize: file.size,
        mimeType: file.type,
        dimensions,
        order: 0
      }
    })
    
    return NextResponse.json(image)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload food image' },
      { status: 500 }
    )
  }
}
