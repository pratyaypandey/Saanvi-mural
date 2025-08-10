import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket name for images
export const IMAGE_BUCKET = 'mural-images'

// File size limits (staying within Supabase free tier)
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB per file
export const MAX_TOTAL_STORAGE = 1 * 1024 * 1024 * 1024 // 1GB total (free tier limit)

// Supported image types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/avif'
]

// Database connection string (Supabase provides this)
export const getDatabaseUrl = () => {
  // Supabase typically provides POSTGRES_URL or DATABASE_URL
  return process.env.POSTGRES_URL || process.env.DATABASE_URL
} 