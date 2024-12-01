import CenteredImage from "@/app/centered-image";

export default function Home() {
    return (
        <div className="relative min-h-screen">
            {/* Background Image */}
            <div className="absolute inset-0">
                <CenteredImage />
            </div>
        </div>
    );
}