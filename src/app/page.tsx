import CenteredImage from "@/app/centered-image";

export default function Home() {
    return (
        <div className="relative min-h-screen bg-gray-900 font-[family-name:var(--font-geist-sans)]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <CenteredImage />
            </div>

            {/* Centered Text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-4xl sm:text-6xl font-bold text-white">I love you.</h1>
            </div>
        </div>
    );
}