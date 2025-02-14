import RequestSkeleton from "@/components/innovations/requestSkeleton"
import { RequestView } from "@/components/innovations/requestServer"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil } from "lucide-react"

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function InnovationRequestPage(props: Props) {
    const params = await props.params;
    return <main>
        <div className="flex justify-between items-center mb-4">
            <p className="text-3xl font-bold text-white">Innovation Request</p>
            <div className="flex items-center justify-end gap-2">
                <Button size="sm">Submit Solution</Button>
                <Button size="sm">View Submissions</Button>
                <Link href={`/innovations/requests/${params.id}/edit`}>
                    <Button size="sm"><Pencil /> Edit</Button>
                </Link>
            </div>
        </div>
        <Suspense fallback={<RequestSkeleton />}>
            <RequestView id={params.id} />
        </Suspense>
    </main>
}