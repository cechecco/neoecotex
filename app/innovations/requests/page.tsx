import RequestsList from "@/components/innovations/requestsList";
import RequestsListSkeleton from "@/components/innovations/requestsListSkeleton";
import { Suspense } from "react";

export const experimental_ppr = true

export default function InnovationsPage() {
    return (
        <main>
            <h1 className="text-5xl font-bold text-white mb-4">Innovation Requests</h1>
            <Suspense fallback={<RequestsListSkeleton />}>
                <RequestsList />
            </Suspense>
        </main>
    );
}