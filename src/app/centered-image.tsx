import Image from 'next/image';

// List of image paths
const images = [
    "/images/1.jpeg",
    "/images/2.jpeg", "/images/3.jpeg",
];

const CenteredImage = () => {
    // Randomly select an image
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Add a unique query parameter to bypass caching
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cacheBustingImage = `${randomImage}?v=${Math.random()}`;

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="flex justify-center items-center w-full">
                <Image
                    src={randomImage}
                    alt="Randomly selected image"
                    width={800}
                    height={800}
                    className="rounded-lg shadow-lg"
                />
            </div>
        </div>
    );
};

export default CenteredImage;