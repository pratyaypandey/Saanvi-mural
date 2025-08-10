"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface ImageData {
  id: string
  url: string
  alt: string
  filename: string
  fileSize: number
  dimensions: { width: number; height: number } | null
}

const ScalableMural = () => {
  const [images, setImages] = useState<ImageData[]>([])
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setError(null)
      const response = await fetch('/api/images')
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }
      const data = await response.json()
      setImages(data)
      
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length)
        setCurrentImage(data[randomIndex])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch images:', error)
      setError('Failed to load images')
      setLoading(false)
    }
  }

  const changeImage = () => {
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length)
      setCurrentImage(images[randomIndex])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-2xl text-white">Loading your love mural...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-4">{error}</div>
          <button 
            onClick={fetchImages}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="text-2xl mb-4">No images found</div>
          <div className="text-gray-400">Upload some images to get started</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 flex justify-center items-center">
        {currentImage && (
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            width={800}
            height={800}
            className="rounded-lg shadow-2xl object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
        )}
      </div>

      {/* Centered Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-2xl text-center px-4">
          I love you.
        </h1>
      </div>

      {/* Image Navigation & Info */}
      <div className="absolute bottom-4 right-4 space-y-2">
        <button
          onClick={changeImage}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          Next Image ({images.length} total)
        </button>
        
        {currentImage && (
          <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
            <div>{currentImage.alt}</div>
            <div className="text-gray-300 text-xs">
              {formatFileSize(currentImage.fileSize)}
              {currentImage.dimensions && ` • ${currentImage.dimensions.width}×${currentImage.dimensions.height}`}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScalableMural 