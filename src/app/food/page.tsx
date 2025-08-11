"use client";

import Image from "next/image";
import Masonry from "react-masonry-css";
import { useState, useEffect } from "react";
import { Dock, DockIcon } from "@/components/ui/dock";
import Link from "next/link";

interface FoodImageData {
  id: string;
  url: string;
  alt: string;
  filename: string;
  dimensions: { width: number; height: number } | null;
}

const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1,
};

export default function FoodPage() {
  const [images, setImages] = useState<FoodImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/food-images');
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Failed to fetch food images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
        <Dock direction="middle" className="shadow-2xl">
          <Link href="/admin">
            <DockIcon>
              <span className="text-2xl">➕</span>
            </DockIcon>
          </Link>
          <Link href="/">
            <DockIcon>
              <span className="text-2xl">❤️</span>
            </DockIcon>
          </Link>
          <Link href="/food">
            <DockIcon>
              <span className="text-2xl">🎂</span>
            </DockIcon>
          </Link>
        </Dock>
      </div>
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600 text-lg">Loading images...</div>
          </div>
        ) : images.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="mb-4 break-inside-avoid cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => setSelectedImage(image.id)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={image.url}
                    alt={image.alt || image.filename}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
                </div>
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="text-center text-gray-600 text-lg py-16">
            No images found
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <Image
                src={images.find(img => img.id === selectedImage)?.url || ""}
                alt="Selected food image"
                width={800}
                height={1200}
                className="max-w-full max-h-full object-contain"
              />
              <button
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
