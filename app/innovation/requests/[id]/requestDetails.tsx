'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { InnovationRequest } from "@/lib/types";
import { CheckCircleIcon } from "lucide-react";
import BackButton from "@/components/backButton";
import { createInnovationRequest, deleteInnovationRequest, updateInnovationRequest } from "@/app/actions";
import { notFound, redirect } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { EditInnovationRequest, ViewInnovationRequest } from "./EditableInnovationRequest";

interface Props {
    initialRequest: InnovationRequest;
}

export default function EditControls({ initialRequest }: Props) {
    const [isEditing, setIsEditing] = useState(initialRequest.$id ? false : true);
    const [request, setRequest] = useState(initialRequest);
    const [showValidation, setShowValidation] = useState(false);

    const handleChange = (field: keyof InnovationRequest, value: string, maxLength: number) => {
        if (value.length <= maxLength) {
            setRequest(prev => ({ ...prev, [field]: value }));
        }
    };

    const getFieldError = (value: string | number) => {
        if (value === undefined || value === null || value === '') {
            return 'This field is required';
        }
        return null;
    };

    const handleSave = async (updatedRequest: InnovationRequest) => {
        setShowValidation(true);
        
        const hasErrors = [
            request.title,
            request.briefDescription,
            request.detailedDescription,
            request.expectedExpertise,
            request.expectedTimeline,
            request.company,
            request.budget,
        ].some(field => getFieldError(field));

        if (hasErrors) {
            return;
        }
        
        setShowValidation(false);
        
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
                setShowValidation(false);
            }
        } else {
            const req = await createInnovationRequest(updatedRequest);
            if ('error' in req) {
                notFound();
            } else {
                redirect(`/innovation/requests/${req.$id}`);
            }
        }
    };

    const handleDelete = async (id: string) => {
        const req = await deleteInnovationRequest(id);
        if ('error' in req) {
            notFound();
        }
        redirect('/innovation/requests');
    };
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
                <BackButton />
                <h1 className="text-5xl font-bold text-white">Innovation Request</h1>
                <div className="flex items-center gap-4 justify-end">
                    <>
                        <p className="text-muted-foreground text-white flex items-center gap-2">
                            Solution submitted
                            <CheckCircleIcon className="text-white" size={12} />
                        </p>
                        {request.$id && (
                            <Button variant="outline" className="w-20">Submit</Button>
                        )}
                        {request.$id && (
                            <Button variant="outline" className="w-20" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'View' : 'Edit'}
                            </Button>
                        )}
                        <Button variant="outline" className="w-20" onClick={() => handleSave(request)}>Save</Button>
                        {request.$id && <Button variant="destructive" className="w-20" onClick={() => handleDelete(request.$id!)}>Delete</Button>}
                    </>
                </div>
            </div>
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <EditInnovationRequest key="edit" showValidation={showValidation} getFieldError={getFieldError} editedRequest={request} setEditedRequest={setRequest} handleChange={handleChange} />
                ) : (
                    <ViewInnovationRequest key="view" request={request} />
                )}
            </AnimatePresence>
        </div>
    );
} 