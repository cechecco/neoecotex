'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { InnovationRequest } from "@/lib/types";
import { CheckCircleIcon } from "lucide-react";
import EditableInnovationRequest from "./EditableInnovationRequest";
import BackButton from "@/components/backButton";
import { updateInnovationRequest } from "@/app/actions";
import { notFound } from "next/navigation";

interface Props {
    initialRequest: InnovationRequest;
}

export default function EditControls({ initialRequest }: Props) {

    const [isEditing, setIsEditing] = useState(false);
    const [request, setRequest] = useState(initialRequest);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <BackButton />
                <div className="flex items-center gap-4 justify-end">
                    <p className="text-muted-foreground text-white flex items-center gap-2">
                        Solution submitted
                        <CheckCircleIcon className="text-white" size={12} />
                    </p>
                <Button variant="outline" size="sm">Submit Proposal</Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancel" : "Edit"}</Button>
                <Button variant="destructive" size="sm">Delete</Button>
</div>
            </div>
            <EditableInnovationRequest
                request={request}
                isEditing={isEditing}
                onSave={async (updatedRequest) => {
                    if (request.$id) {
                        const req = await updateInnovationRequest(request.$id, {
                            title: updatedRequest.title,
                            company: updatedRequest.company,
                            briefDescription: updatedRequest.briefDescription,
                            detailedDescription: updatedRequest.detailedDescription,
                            expectedExpertise: updatedRequest.expectedExpertise,
                            expectedTimeline: updatedRequest.expectedTimeline,
                            budget: updatedRequest.budget,
                            concept: updatedRequest.concept,
                            field: updatedRequest.field,
                            marketingConsent: updatedRequest.marketingConsent,
                            ecologyConsent: updatedRequest.ecologyConsent,
                        });
                        if ('error' in req) {
                            notFound();
                        } else {
                            setRequest(req as unknown as InnovationRequest);
                            setIsEditing(false);
                        }
                    }
                }}
                onCancel={() => setIsEditing(false)}
            />
        </div>
    );
} 