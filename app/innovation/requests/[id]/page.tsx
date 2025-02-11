import { getInnovationRequest } from "@/app/actions";
import { notFound } from "next/navigation";
import { InnovationRequest } from "@/lib/types";
import RequestDetails from "./requestDetails";

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function InnovationRequestDetailPage(props: Props) {
    const params = await props.params;

    let request: InnovationRequest | null = {
        title: '',
        company: '',
        briefDescription: '',
        detailedDescription: '',
        expectedExpertise: '',
        expectedTimeline: '',
        budget: 0,
        concept: '',
        field: '',
        marketingConsent: false,
        ecologyConsent: false,
    };

    if (params.id !== 'new') {
        const res = await getInnovationRequest(params.id);

        if ('error' in res) {
            return notFound();
        }

        request = res as unknown as InnovationRequest;
    }

    return (
        <main className="relative py-8 w-full flex flex-col gap-8">
            <RequestDetails initialRequest={request} />
        </main>
    );
} 