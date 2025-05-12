import { Button } from "@/components/ui/button";
import { ArrowUpToLine } from "lucide-react";
import { useEffect, useRef } from "react";

export function ButtonScrollToTop() {
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const btnElement = ref.current!;
        const scrollable = window;
        const scrollHandler = () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (currentScroll > 100) {
                btnElement.classList.remove('opacity-0');
            } else {
                btnElement.classList.add('opacity-0');
            }
        }
        const clickHandler = () => {
            scrollable.scrollTo({ top: 0, behavior: 'smooth' });
        }
        btnElement.addEventListener('click', clickHandler);
        scrollHandler(); // Initial check
        return () => {
            scrollable.removeEventListener('scroll', scrollHandler);
            btnElement.removeEventListener('click', clickHandler);
        }
    }, [])
    return (
        <Button ref={ref} variant="ghost" className="fixed bottom-5 right-5 transition-opacity opacity-0"><ArrowUpToLine /></Button>
    )
}