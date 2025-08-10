"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ImageData {
  id: string
  url: string
  alt: string
  filename: string
  dimensions: { width: number; height: number } | null
}

const Home = () => {
    const [randomImage, setRandomImage] = useState<ImageData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch('/api/images');
            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }
            const images = await response.json();
            
            if (images.length > 0) {
                const selectedImage = images[Math.floor(Math.random() * images.length)];
                setRandomImage(selectedImage);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch images:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="relative min-h-screen">
                {/* Admin Button */}
                <div className="absolute top-4 right-4 z-10">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => router.push('/admin')}
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-blue-500 hover:bg-white/30"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl sm:text-6xl font-bold text-white">I love you.</h1>
                </div>
            </div>
        );
    }

    if (!randomImage) {
        return (
            <div className="relative min-h-screen">
                {/* Admin Button */}
                <div className="absolute top-4 right-4 z-10">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => router.push('/admin')}
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-blue-500 hover:bg-white/30"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl sm:text-6xl font-bold text-white">I love you.</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Admin Button */}
            <div className="absolute top-4 right-4 z-10">
                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => router.push('/admin')}
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-blue-500 hover:bg-white/30"
                >
                    <Plus className="h-5 w-5" />
                </Button>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 flex justify-center items-center">
                <Image
                    src={randomImage.url}
                    alt={randomImage.alt}
                    width={randomImage.dimensions?.width || 800}
                    height={randomImage.dimensions?.height || 800}
                    className="rounded-lg shadow-lg"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    quality={95}
                />
            </div>

            {/* Centered Text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-4xl sm:text-6xl font-bold text-white">I love you.</h1>
            </div>
        </div>
    );
};

export default Home;