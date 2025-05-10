import { ImageViewerProvider } from "@/context/image-viewer-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Toaster } from "sonner";

export default function LayoutSystem({ children }: { children?: React.ReactNode }) {
    const isWideScreen = useMediaQuery("(min-width: 768px");
    return (
        <>
            <ImageViewerProvider>
                <>
                    {children}
                    <Toaster
                        closeButton
                        position={isWideScreen ? "bottom-right" : "top-center"}
                    />
                </>
            </ImageViewerProvider>
        </>
    );
}