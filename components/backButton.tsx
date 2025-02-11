'use client';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    const handleBack = () => {
        const previousPage = document.referrer;
        if (previousPage.includes('/innovation/requests')) {
            window.history.back();
        } else {
            router.push('/innovation/requests');
        }
    };

    return (
        <Button variant="ghost" onClick={handleBack} className="text-white hover:text-white hover:bg-white/20 text-xs">
            <ChevronLeft /> Innovation Hub
        </Button>
    );
}
