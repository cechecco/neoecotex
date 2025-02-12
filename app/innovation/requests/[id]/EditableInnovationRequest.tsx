'use client';

import {  InnovationRequest } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ViewInnovationRequest({ request }: { request: InnovationRequest }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Card>
                <CardHeader>
                    <div className="mb-2 flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Title</p>
                    </div>
                    <h1 className="text-4xl font-bold">{request.title}</h1>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">Brief Description</p>
                            </div>
                            <p className="whitespace-pre-wrap">{request.briefDescription}</p>
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">Detailed Description</p>
                            </div>
                            <p className="whitespace-pre-wrap">{request.detailedDescription}</p>
                        </div>

                        <Separator />

                        <div>
                            <div className="mb-2 flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">Required Expertise</p>
                            </div>
                            <p className="whitespace-pre-wrap">{request.expectedExpertise}</p>
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">Expected Timeline</p>
                            </div>
                            <p className="whitespace-pre-wrap">{request.expectedTimeline}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Field</p>
                                </div>
                                <Badge variant="secondary">{request.field}</Badge>
                            </div>

                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Concept</p>
                                </div>
                                <Badge variant="secondary">{request.concept}</Badge>
                            </div>

                            <div>
                                <div className="mb-2 flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground">Company</p>
                                </div>
                                <p className="font-semibold">{request.company}</p>
                            </div>

                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Budget</p>
                                </div>
                                <p className="font-semibold">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(Number(request.budget || 0))}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 justify-end">
                                    <p className="text-sm text-muted-foreground">Created {" "}
                                    {request.$createdAt ? formatDistance(new Date(request.$createdAt), new Date(), { addSuffix: true }) : ''}
                                </p>
                                <p className="text-sm text-muted-foreground">{" | "}</p>
                                    <p className="text-sm text-muted-foreground">Last Update {" "}
                                    {request.$updatedAt ? formatDistance(new Date(request.$updatedAt), new Date(), { addSuffix: true }) : ''}
                                </p>
                            </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function EditInnovationRequest({
    showValidation,
    getFieldError,
    editedRequest,
    setEditedRequest,
    handleChange
}: {
    showValidation: boolean;
    getFieldError: (field: string) => string | null;
    editedRequest: InnovationRequest;
    setEditedRequest: (request: InnovationRequest) => void;
    handleChange: (field: keyof InnovationRequest, value: string, maxLength: number) => void;
}) {
    const ValidationIcon = ({ error }: { error: string | null }) => {
        if (!showValidation || !error) return null;
        
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{error}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    const fieldOptions = ["IT", "Healthcare", "Manufacturing", "Energy", "Finance"];
    const conceptOptions = ["Research", "Development", "Implementation", "Consulting"];

    return (
        <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Card>
                <CardHeader>
                    <div className="mb-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">Title</p>
                            <ValidationIcon error={getFieldError(editedRequest.title)} />
                        </div>
                        <p className="text-sm text-muted-foreground">{editedRequest.title.length}/64</p>
                    </div>
                    <Input
                        value={editedRequest.title}
                        onChange={(e) => handleChange('title', e.target.value, 64)}
                        className={`text-4xl font-bold ${showValidation && getFieldError(editedRequest.title) ? 'border-red-500' : ''}`}
                        maxLength={64}
                    />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">Brief Description</p>
                                    <ValidationIcon error={getFieldError(editedRequest.briefDescription)} />
                                </div>
                                <p className="text-sm text-muted-foreground">{editedRequest.briefDescription.length}/140</p>
                            </div>
                            <Textarea
                                value={editedRequest.briefDescription}
                                onChange={(e) => handleChange('briefDescription', e.target.value, 140)}
                                className={`min-h-[100px] ${showValidation && getFieldError(editedRequest.briefDescription) ? 'border-red-500' : ''}`}
                                maxLength={140}
                            />
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">Detailed Description</p>
                                    <ValidationIcon error={getFieldError(editedRequest.detailedDescription)} />
                                </div>
                                <p className="text-sm text-muted-foreground">{editedRequest.detailedDescription.length}/1000</p>
                            </div>
                            <Textarea
                                value={editedRequest.detailedDescription}
                                onChange={(e) => handleChange('detailedDescription', e.target.value, 1000)}
                                className={`min-h-[200px] ${showValidation && getFieldError(editedRequest.detailedDescription) ? 'border-red-500' : ''}`}
                                maxLength={1000}
                            />
                        </div>

                        <Separator />

                        <div>
                            <div className="mb-2 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">Required Expertise</p>
                                    <ValidationIcon error={getFieldError(editedRequest.expectedExpertise)} />
                                </div>
                                <p className="text-sm text-muted-foreground">{editedRequest.expectedExpertise.length}/140</p>
                            </div>
                            <Textarea
                                value={editedRequest.expectedExpertise}
                                onChange={(e) => handleChange('expectedExpertise', e.target.value, 140)}
                                className={`min-h-[100px] ${showValidation && getFieldError(editedRequest.expectedExpertise) ? 'border-red-500' : ''}`}
                                maxLength={140}
                            />
                        </div>

                        <div>
                            <div className="mb-2 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground">Expected Timeline</p>
                                    <ValidationIcon error={getFieldError(editedRequest.expectedTimeline)} />
                                </div>
                                <p className="text-sm text-muted-foreground">{editedRequest.expectedTimeline.length}/140</p>
                            </div>
                            <Textarea
                                value={editedRequest.expectedTimeline}
                                onChange={(e) => handleChange('expectedTimeline', e.target.value, 140)}
                                className={`min-h-[100px] ${showValidation && getFieldError(editedRequest.expectedTimeline) ? 'border-red-500' : ''}`}
                                maxLength={140}
                            />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Field</p>
                                </div>
                                <select 
                                    className="w-full p-2 border rounded-md"
                                    value={editedRequest.field}
                                    onChange={(e) => setEditedRequest(({ ...editedRequest, field: e.target.value }))}
                                >
                                    {fieldOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Concept</p>
                                </div>
                                <select 
                                    className="w-full p-2 border rounded-md"
                                    value={editedRequest.concept}
                                    onChange={(e) => setEditedRequest({ ...editedRequest, concept: e.target.value })}
                                >
                                    {conceptOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="mb-2 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-muted-foreground">Company</p>
                                        <ValidationIcon error={getFieldError(editedRequest.company)} />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{editedRequest.company.length}/64</p>
                                </div>
                                <Input
                                    value={editedRequest.company}
                                    onChange={(e) => handleChange('company', e.target.value, 64)}
                                    className={showValidation && getFieldError(editedRequest.company) ? 'border-red-500' : ''}
                                    maxLength={64}
                                />
                            </div>

                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Budget</p>
                                </div>
                                <Input
                                    type="number"
                                    value={editedRequest.budget}
                                    onChange={(e) => setEditedRequest({ ...editedRequest, budget: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
