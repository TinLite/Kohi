import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { createContext, useState } from "react";

export const ImageViewerContext = createContext<{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    imageUrl: string;
    setImageUrl: (imageUrl: string) => void;
    openImage: (imageUrl: string) => void;
    closeImage: () => void;
    }>({
    isOpen: false,
    setIsOpen: () => {},
    imageUrl: "",
    setImageUrl: () => {},
    openImage: () => {},
    closeImage: () => {},
});

export function ImageViewerProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const openImage = (url: string) => {
        setImageUrl(url);
        setIsOpen(true);
    };

    const closeImage = () => {
        setIsOpen(false);
    };

    return (
        <ImageViewerContext.Provider
            value={{
                isOpen,
                setIsOpen,
                imageUrl,
                setImageUrl,
                openImage,
                closeImage,
            }}
        >
            {children}
            <div className="w-dvw h-dvh bg-background fixed top-0 left-0 z-10 flex flex-col items-center transition-all"
                style={{
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "auto" : "none",
                }}>
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <img
                        src={imageUrl}
                        alt=""
                        className="max-w-full max-h-full object-contain transition-[scale]"
                        style={{
                            scale: isOpen ? "1.0" : "0.5",
                        }}
                    />

                </div>
                <div className="absolute right-5 top-5">
                    <Button size="icon" variant="ghost" onClick={closeImage}>
                        <X />
                    </Button>
                </div>
            </div>
        </ImageViewerContext.Provider>
    );
}