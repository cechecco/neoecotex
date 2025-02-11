'use client';

import BackButton from "@/components/backButton";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    return (
        <main className="relative py-8 flex gap-8 justify-between items-center">
            <BackButton />
            <h1 className="text-5xl font-bold text-white">Innovation Dashboard</h1>
            
            <Link href="/innovation/requests/new">
                <Button variant="outline">
                    <PlusIcon className="w-4 h-4" />
                    New Request
                </Button>
            </Link>
            
        </main>
    );
}