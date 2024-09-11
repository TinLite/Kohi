import { Button } from "@/components/ui/button";
import { ArrowUpToLine } from "lucide-react";
import { useEffect, useRef } from "react";

export function ButtonScrollToTop() {
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const btnElement = ref.current!;
        const scrollable = btnElement.parentElement!.parentElement!;
        const scrollHandler = () => {
            if (scrollable.scrollTop > 100) {
                btnElement.classList.remove('opacity-0');
            } else {
                btnElement.classList.add('opacity-0');
            }
        }
        const clickHandler = () => {
            scrollable.scrollTo({ top: 0, behavior: 'smooth' });
        }
        scrollable.addEventListener('scroll', scrollHandler);
        btnElement.addEventListener('click', clickHandler);
        return () => {
            scrollable.removeEventListener('scroll', scrollHandler);
            btnElement.removeEventListener('click', clickHandler);
        }
    })
    return (
        <Button ref={ref} variant="ghost" className="fixed bottom-5 right-5 transition-opacity"><ArrowUpToLine /></Button>
    )
}