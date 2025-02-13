import RequestsList from "@/components/innovations/requestsList";
import RequestsListSkeleton from "@/components/innovations/requestsListSkeleton";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
export const experimental_ppr = true

export default function InnovationsPage() {
    return (
        <main>
            <div className="flex justify-between items-center">
<h1 className="text-5xl font-bold text-white mb-4">Innovation Requests</h1>
            <Link href="/innovations/requests/dashboard">
                <Button>
                    <LayoutDashboard />
                    Dashboard
                </Button>
            </Link>
</div>
            <Suspense fallback={<RequestsListSkeleton />}>
                <RequestsList />
            </Suspense>
        </main>
    );
}