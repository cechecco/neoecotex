'use client';

import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// TODO improve this

export default function InnovationsLayoutTitleLink() {
    const pathname = usePathname();
    const id = pathname?.match(/\/innovations\/requests\/([^\/]+)/)?.[1];
    const dashboard = pathname?.match(/\/innovations\/requests\/dashboard/);
    return <div className="flex justify-left items-center">
        <Link href="/innovations/requests" className="flex items-center">
            <Button variant="link" size="sm" className="text-white">
                <House className="w-4 h-4" />
                Innovation Hub
            </Button>
        </Link>

        {id && !dashboard ? <p className="text-white">/</p> : null}
        {id && !dashboard ? <Link href={`/innovations/requests/${id}`} className="text-white">
        <Button variant="link" size="sm" className="text-white">
            request {id.slice(0, 6)}
        </Button>
        </Link> : null}
        {dashboard ? <p className="text-white">/</p> : null}
        {dashboard ? <Button variant="link" size="sm" className="text-white">
            Dashboard
        </Button> : null}
    </div>
}