import RequestSkeleton from "@/components/innovations/requestSkeleton"
import Request from "@/components/innovations/request"
import { Suspense } from "react"

export default function InnovationRequestPage() {
    return <main>
            <h1 className="text-5xl font-bold text-white mb-4">Innovation Request</h1>
            <Suspense fallback={<RequestSkeleton />}>
                <Request />
            </Suspense>
        </main>
}