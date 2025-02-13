import { getInnovationRequest } from "@/app/actions";
import { RequestFormClient, RequestViewClient } from "./requestClient";
import { notFound } from "next/navigation";
import { InnovationRequest } from "@/lib/types";

interface Props {
    id: string;
}

export async function RequestView({ id }: Props) {
    const request = await getInnovationRequest(id);
    if ('error' in request) {
        return notFound();
    }
    return <div>
        <RequestViewClient request={request as unknown as InnovationRequest} />
    </div>
}

export async function RequestForm({ id }: Props) {
    const request = await getInnovationRequest(id);
    if ('error' in request) {
        return <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{request.message}</p>
        </div>
    }
    return <div>
        <RequestFormClient request={request as unknown as InnovationRequest} />
    </div>
}