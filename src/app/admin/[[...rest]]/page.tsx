"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ClerkProtectedRoute from "@/components/ClerkProtectedRoute"
import { useUser, SignOutButton } from '@clerk/nextjs'

interface ImageData {
  id: string
  url: string
  alt: string
  filename: string
  uploadedAt: string
  fileSize: number
  mimeType: string
  dimensions: { width: number; height: number } | null
}

interface FoodImageData {
  id: string
  url: string
  alt: string
  filename: string
  uploadedAt: string
  fileSize: number
  mimeType: string
  dimensions: { width: number; height: number } | null
}

const AdminPage = () => {
  const [images, setImages] = useState<ImageData[]>([])
  const [foodImages, setFoodImages] = useState<FoodImageData[]>([])
  const [uploading, setUploading] = useState(false)
  const [foodUploading, setFoodUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFoodFile, setSelectedFoodFile] = useState<File | null>(null)
  const [altText, setAltText] = useState("")
  const [foodAltText, setFoodAltText] = useState("")
  const [storageUsage, setStorageUsage] = useState(0)
  const [foodStorageUsage, setFoodStorageUsage] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [foodUploadError, setFoodUploadError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchImages()
    fetchFoodImages()
  }, [])

  const { user } = useUser()

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images')
      const data = await response.json()
      setImages(data)
      
      // Calculate total storage usage
      const totalSize = data.reduce((sum: number, img: ImageData) => sum + img.fileSize, 0)
      setStorageUsage(totalSize)
    } catch (error) {
      console.error('Failed to fetch images:', error)
    }
  }

  const fetchFoodImages = async () => {
    try {
      const response = await fetch('/api/food-images')
      const data = await response.json()
      setFoodImages(data)
      
      // Calculate total food storage usage
      const totalSize = data.reduce((sum: number, img: FoodImageData) => sum + img.fileSize, 0)
      setFoodStorageUsage(totalSize)
    } catch (error) {
      console.error('Failed to fetch food images:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setAltText(file.name.replace(/\.[^/.]+$/, ""))
      setUploadError(null)
    }
  }

  const handleFoodFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFoodFile(file)
      setFoodAltText(file.name.replace(/\.[^/.]+$/, ""))
      setFoodUploadError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setUploadError(null)
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('alt', altText)

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setSelectedFile(null)
        setAltText("")
        fetchImages()
      } else {
        const errorData = await response.json()
        setUploadError(errorData.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Network error during upload')
    } finally {
      setUploading(false)
    }
  }

  const handleFoodUpload = async () => {
    if (!selectedFoodFile) return

    setFoodUploading(true)
    setFoodUploadError(null)
    const formData = new FormData()
    formData.append('file', selectedFoodFile)
    formData.append('alt', foodAltText)

    try {
      const response = await fetch('/api/food-images', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setSelectedFoodFile(null)
        setFoodAltText("")
        fetchFoodImages()
      } else {
        const errorData = await response.json()
        setFoodUploadError(errorData.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setFoodUploadError('Network error during upload')
    } finally {
      setFoodUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleFoodDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food image?')) return

    try {
      const response = await fetch(`/api/food-images/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchFoodImages()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStoragePercentage = () => {
    const maxStorage = 1 * 1024 * 1024 * 1024 // 1GB
    return Math.round((storageUsage / maxStorage) * 100)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Unknown date'
      }
      // Format as "Aug 10, 2025 at 1:44 PM"
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return 'Unknown date'
    }
  }

  return (
    <ClerkProtectedRoute>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to photos</span>
            </button>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Saanvi&apos;s Mural ❤️</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Signed in as {user?.emailAddresses[0]?.emailAddress}
              </span>
              <SignOutButton>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                  Logout
                </button>
              </SignOutButton>
            </div>
          </div>
          
          {/* Storage Usage */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Storage Usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mural Images Storage */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-700">Mural Images</h3>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Used: {formatFileSize(storageUsage)}</span>
                  <span>1 GB limit</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      getStoragePercentage() > 80 ? 'bg-red-500' : 
                      getStoragePercentage() > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(getStoragePercentage(), 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {getStoragePercentage()}% used • {images.length} images
                </div>
              </div>

              {/* Food Images Storage */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-700">Food Images</h3>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Used: {formatFileSize(foodStorageUsage)}</span>
                  <span>1 GB limit</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      (foodStorageUsage / (1024 * 1024 * 1024) * 100) > 80 ? 'bg-red-500' : 
                      (foodStorageUsage / (1024 * 1024 * 1024) * 100) > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((foodStorageUsage / (1024 * 1024 * 1024) * 100), 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {Math.round((foodStorageUsage / (1024 * 1024 * 1024) * 100))}% used • {foodImages.length} images
                </div>
              </div>
            </div>
          </div>
          
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload New Memories</h2>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Image description"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            
            {uploadError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{uploadError}</p>
              </div>
            )}
            
            {selectedFile && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700 text-sm">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              </div>
            )}
          </div>

          {/* Food Images Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload New Food Images</h2>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFoodFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={foodAltText}
                  onChange={(e) => setFoodAltText(e.target.value)}
                  placeholder="Food image description"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <button
                onClick={handleFoodUpload}
                disabled={!selectedFoodFile || foodUploading}
                className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {foodUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            
            {foodUploadError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{foodUploadError}</p>
              </div>
            )}
            
            {selectedFoodFile && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-orange-700 text-sm">
                  Selected: {selectedFoodFile.name} ({formatFileSize(selectedFoodFile.size)})
                </p>
              </div>
            )}
          </div>

          {/* Images Grid */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Mural Image Collection ({images.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">{image.alt}</p>
                    <div className="text-xs text-gray-500 mb-3 space-y-1">
                      <div>{formatDate(image.uploadedAt)}</div>
                      <div>{formatFileSize(image.fileSize)} • {image.mimeType}</div>
                      {image.dimensions && (
                        <div>{image.dimensions.width} × {image.dimensions.height}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Food Images Grid */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Food Image Collection ({foodImages.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodImages.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">{image.alt}</p>
                    <div className="text-xs text-gray-500 mb-3 space-y-1">
                      <div>{formatDate(image.uploadedAt)}</div>
                      <div>{formatFileSize(image.fileSize)} • {image.mimeType}</div>
                      {image.dimensions && (
                        <div>{image.dimensions.width} × {image.dimensions.height}</div>
                      )}
                    </div>
                    <button
                      onClick={() => handleFoodDelete(image.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClerkProtectedRoute>
  )
}

export default AdminPage 