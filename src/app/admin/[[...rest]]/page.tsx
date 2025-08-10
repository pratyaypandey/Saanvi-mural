"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import ClerkProtectedRoute from "@/components/ClerkProtectedRoute"
import { useUser, SignOutButton } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  HardDrive, 
  Calendar, 
  FileText,
  MoreHorizontal,
  User,
  LogOut
} from "lucide-react"

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

const AdminPage = () => {
  const [images, setImages] = useState<ImageData[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [altText, setAltText] = useState("")
  const [storageUsage, setStorageUsage] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const { user } = useUser()

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images')
      const data = await response.json()
      setImages(data)
      
      const totalSize = data.reduce((sum: number, img: ImageData) => sum + img.fileSize, 0)
      setStorageUsage(totalSize)
    } catch (error) {
      console.error('Failed to fetch images:', error)
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

  const getStorageColor = () => {
    const percentage = getStoragePercentage()
    if (percentage > 80) return 'bg-red-500'
    if (percentage > 60) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  return (
    <ClerkProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <ImageIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Saanvi's Mural
                    </CardTitle>
                    <CardDescription className="text-lg text-slate-600">
                      Admin Dashboard
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                  
                  <SignOutButton>
                    <Button variant="outline" size="sm" className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </SignOutButton>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Images</CardTitle>
                <ImageIcon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{images.length}</div>
                <p className="text-xs text-slate-500">Uploaded to mural</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Storage Used</CardTitle>
                <HardDrive className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{formatFileSize(storageUsage)}</div>
                <p className="text-xs text-slate-500">{getStoragePercentage()}% of 1GB limit</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Storage Status</CardTitle>
                <div className={`w-3 h-3 rounded-full ${getStorageColor()}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {getStoragePercentage() > 80 ? 'Critical' : getStoragePercentage() > 60 ? 'Warning' : 'Good'}
                </div>
                <p className="text-xs text-slate-500">Storage health</p>
              </CardContent>
            </Card>
          </div>

          {/* Storage Progress */}
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Used: {formatFileSize(storageUsage)}</span>
                  <span className="text-slate-600">1 GB limit</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getStorageColor()}`}
                    style={{ width: `${Math.min(getStoragePercentage(), 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{getStoragePercentage()}% used</span>
                  <span>{images.length} images</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Image
              </CardTitle>
              <CardDescription>
                Add new images to the mural collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="file">Select Image</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alt">Alt Text</Label>
                  <Input
                    id="alt"
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Image description"
                  />
                </div>
                
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || uploading}
                  className="gap-2"
                  size="lg"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
              
              {uploadError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{uploadError}</p>
                </div>
              )}
              
              {selectedFile && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-blue-900 font-medium">{selectedFile.name}</p>
                      <p className="text-blue-700 text-sm">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images Table */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Collection ({images.length})
              </CardTitle>
              <CardDescription>
                Manage all uploaded images in the mural
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {images.map((image) => (
                      <TableRow key={image.id}>
                        <TableCell>
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-slate-900">{image.alt}</p>
                            <p className="text-sm text-slate-500">{image.filename}</p>
                            {image.dimensions && (
                              <Badge variant="secondary" className="text-xs">
                                {image.dimensions.width} × {image.dimensions.height}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {formatDate(image.uploadedAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {formatFileSize(image.fileSize)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleDelete(image.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClerkProtectedRoute>
  )
}

export default AdminPage 