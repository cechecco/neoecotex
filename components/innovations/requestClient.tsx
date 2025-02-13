"use client";

import { InnovationRequest } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { createInnovationRequest, deleteInnovationRequest, getInnovationRequest, updateInnovationRequest } from "@/app/actions";
import { CheckCircleIcon, ChevronLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

interface Props {
    request: InnovationRequest;
}

export function RequestViewClient({ request }: Props) {
    return <>
        <div className="flex items-center justify-end gap-2 mb-4">
            <p className="flex items-center gap-2 text-sm text-white">
                Solution Submitted <CheckCircleIcon className="w-4 h-4" />
            </p>
            <Button>
                Submit Solution
            </Button>

            <Button>
                View Submissions
            </Button>
            <Link href={`/innovations/requests/${request.$id}/edit`}>
                <Button>
                    Edit
                </Button>
            </Link>
        </div><Card>
            <CardHeader>
                <CardTitle>{request.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p><span className="text-xs text-muted-foreground">Brief Description</span><br /> {request.briefDescription}</p>
                <p><span className="text-xs text-muted-foreground">Detailed Description</span><br /> {request.detailedDescription}</p>
                <p><span className="text-xs text-muted-foreground">Expected Expertise</span><br /> {request.expectedExpertise}</p>
                <p><span className="text-xs text-muted-foreground">Expected Timeline</span><br /> {request.expectedTimeline}</p>
                <p><span className="text-xs text-muted-foreground">Company</span><br /> {request.company}</p>
                <p><span className="text-xs text-muted-foreground">Budget</span><br /> {request.budget}</p>
                <p><span className="text-xs text-muted-foreground">Concept</span><br /> {request.concept}</p>
                <p><span className="text-xs text-muted-foreground">Field</span><br /> {request.field}</p>
                <p><span className="text-xs text-muted-foreground">Marketing Consent</span><br /> {request.marketingConsent ? 'Yes' : 'No'}</p>
                <p><span className="text-xs text-muted-foreground">Ecology Consent</span><br /> {request.ecologyConsent ? 'Yes' : 'No'}</p>
                <p><span className="text-xs text-muted-foreground">Created At</span><br /> {request.$createdAt}</p>
                <p><span className="text-xs text-muted-foreground">Updated At</span><br /> {request.$updatedAt}</p>
                <p><span className="text-xs text-muted-foreground">ID</span><br /> {request.$id}</p>
            </CardContent>
        </Card></>
}

export function RequestFormClient({ request }: Props) {
    const [state, formAction, pending] = useActionState(updateInnovationRequest, request)

    const [fetchError, setFetchError] = useState<string | false>(false)
    const [formData, setFormData] = useState(request)

    useEffect(() => {
        if (!pending) {

            if ('error' in state) {
                setFetchError(state.message)
            } else {
                setFormData(state)
            }
        }
    }, [state])

    if (fetchError) {
        return <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{fetchError}</p>
        </div>
    }

    return <>
        <form action={formAction}>
            <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                    <Link href={`/innovations/requests/${request.$id}`}>
                        <Button variant="link" className="text-white">
                            <ChevronLeftIcon className="w-4 h-4" />
                            Back
                        </Button>
                    </Link>
                    <Button type="submit">
                        Save
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="title">Title</Label>
                            <div className="relative">
                                <Input type="text" id="title" name="title" defaultValue={formData?.title} className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="briefDescription">Brief Description</Label>
                            <div className="relative">
                                <Textarea id="briefDescription" name="briefDescription" defaultValue={formData?.briefDescription} className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="detailedDescription">Detailed Description</Label>
                            <div className="relative">
                                <Textarea id="detailedDescription" name="detailedDescription" defaultValue={formData?.detailedDescription} className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="expectedExpertise">Expected Expertise</Label>
                            <div className="relative">
                                <Input type="text" id="expectedExpertise" name="expectedExpertise" defaultValue={formData?.expectedExpertise} className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="expectedTimeline">Expected Timeline</Label>
                            <div className="relative">
                                <Input type="text" id="expectedTimeline" name="expectedTimeline" defaultValue={formData?.expectedTimeline} className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="company">Company</Label>
                            <div className="relative">
                                <Input type="text" id="company" name="company" defaultValue={formData?.company} className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="budget">Budget</Label>
                            <div className="relative">
                                <Input type="number" id="budget" name="budget" defaultValue={formData?.budget} required className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="concept">Concept</Label>
                            <div className="relative">
                                <Input type="text" id="concept" name="concept" defaultValue={formData?.concept} className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="field">Field</Label>
                            <div className="relative">
                                <Input type="text" id="field" name="field" defaultValue={formData?.field} className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Checkbox id="marketingConsent" name="marketingConsent" defaultChecked={formData?.marketingConsent} className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                            <Label htmlFor="marketingConsent">Marketing Consent</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Checkbox id="ecologyConsent" name="ecologyConsent" defaultChecked={formData?.ecologyConsent} className={pending ? 'invisible' : ''} />
                                {pending && <Skeleton className="absolute inset-0 z-20 h-full" />}
                            </div>
                            <Label htmlFor="ecologyConsent">Ecology Consent</Label>
                        </div>
                    </div>
                </CardHeader>
                <CardFooter className="w-full">

                    {
                        request.$id &&
                        <div className="flex justify-between items-center gap-2 w-full border border-red-500 bg-red-500/10 p-4 rounded-md">
                            <div className="flex flex-col gap-2">
                                <p className="text-red-500 font-bold">
                                Delete this request
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Once you delete a request, there is no going back. Please be certain.
                            </p>
</div>
                            <Button variant="destructive" onClick={() => request.$id && deleteInnovationRequest(request.$id)}>
                                Delete
                            </Button>
                        </div>
                    }
                </CardFooter>
            </Card>
        </form>
    </>
}