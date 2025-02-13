import RequestSkeleton from "@/components/innovations/requestSkeleton"
import { RequestView } from "@/components/innovations/requestServer"
import { Suspense } from "react"

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function InnovationRequestPage(props: Props) {
    const params = await props.params;
    return <main>
            <Suspense fallback={<RequestSkeleton />}>
                <RequestView id={params.id} />
            </Suspense>
        </main>
}