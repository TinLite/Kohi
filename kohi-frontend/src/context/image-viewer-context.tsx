import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { createContext, useEffect, useRef, useState } from "react";

export const ImageViewerContext = createContext<{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    openImage: (imageUrl: string) => void;
    closeImage: () => void;
}>({
    isOpen: false,
    setIsOpen: () => { },
    openImage: () => { },
    closeImage: () => { },
});

export function ImageViewerProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLImageElement>(null);

    const openImage = (url: string) => {
        if (ref.current) {
            ref.current.src = url;
            setIsOpen(true);
        }
    };

    function closeImage() {
        setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            closeImage();
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [])


    return (
        <ImageViewerContext.Provider
            value={{
                isOpen,
                setIsOpen,
                openImage,
                closeImage,
            }}
        >
            {children}
            <div className="w-dvw h-dvh bg-background fixed top-0 left-0 z-10 flex flex-col items-center transition-all"
                style={{
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "auto" : "none",
                }}
                onClick={() => closeImage()}
            >
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <img
                        ref={ref}
                        alt=""
                        className="max-w-full max-h-full object-contain transition-[scale]"
                        style={{
                            scale: isOpen ? "1.0" : "0.5",
                        }}
                        loading="lazy"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />

                </div>
                <div className="absolute right-5 top-5">
                    <Button size="icon" variant="secondary" onClick={closeImage}>
                        <X />
                    </Button>
                </div>
            </div>
        </ImageViewerContext.Provider>
    );
}