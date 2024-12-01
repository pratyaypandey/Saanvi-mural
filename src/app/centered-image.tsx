"use client"

import { useEffect, useState } from "react";
import Image from "next/image";

// List of image paths
const images = [
    "/images/1.jpeg",
    "/images/2.jpeg",
    "/images/3.jpeg",
];

const Home = () => {
    const [randomImage, setRandomImage] = useState(images[0]);

    useEffect(() => {
        // Select a random image on the client side
        const selectedImage = images[Math.floor(Math.random() * images.length)];
        setRandomImage(selectedImage);
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Background Image */}
            <div className="absolute inset-0 flex justify-center items-center">
                <Image
                    src={randomImage}
                    alt="Random image"
                    width={800}
                    height={800}
                    className="rounded-lg shadow-lg"
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