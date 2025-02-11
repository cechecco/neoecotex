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
        <Button variant="link" onClick={handleBack} className="absolute top-0 left-0 p-0 m-0 text-white text-xs">
            <ChevronLeft /> Innovation Hub
        </Button>
    );
}
