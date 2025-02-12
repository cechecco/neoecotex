'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function InnovationsLayoutTitleLink() {
    return <div className="flex justify-left items-center">
        <Link href="/innovations" className="flex items-center">
        <Button variant="link" className="text-white">
            Innovations Hub
            </Button>
        </Link>
    </div>
}