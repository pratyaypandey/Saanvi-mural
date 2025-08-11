import CenteredImage from "@/app/centered-image";
import { Dock, DockIcon } from "@/components/ui/dock";
import Link from "next/link";

export default function Home() {
    return (
        <div className="relative min-h-screen">
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
            <CenteredImage />
        </div>
    );
}