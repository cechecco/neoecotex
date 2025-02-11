'use client';

import { useState } from "react";
import { InnovationRequest } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    request: InnovationRequest;
    isEditing: boolean;
    onSave: (request: InnovationRequest) => Promise<void>;
    onCancel: () => void;
}

function ViewInnovationRequest({ request }: { request: InnovationRequest }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
        >
            <Card>
                <CardHeader>
                    <div className="mb-2">
                        <p className="text-sm text-muted-foreground">Title</p>
                    </div>
                    <h1 className="text-4xl font-bold">{request.title}</h1>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">Brief Description</p>
                            </div>
                            <p className="whitespace-pre-wrap">{request.briefDescription}</p>
                        </div>

                        <div>
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">Detailed Description</p>
                            </div>
                            <p className="whitespace-pre-wrap">{request.detailedDescription}</p>
                        </div>

                        <Separator />

                        <div>
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">Required Expertise</p>
                            </div>
                            <p className="whitespace-pre-wrap">{request.expectedExpertise}</p>
                        </div>

                        <div>
                            <div className="mb-2">
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
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Company</p>
                                </div>
                                <p className="font-semibold">{request.company}</p>
                            </div>

                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Budget</p>
                                </div>
                                <p className="font-semibold">{request.budget}</p>
                            </div>

                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                </div>
                                <p className="font-semibold">
                                    {formatDistance(new Date(request.$createdAt!), new Date(), { addSuffix: true })}
                                </p>
                            </div>

                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Last Update</p>
                                </div>
                                <p className="font-semibold">
                                    {formatDistance(new Date(request.$updatedAt!), new Date(), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function EditInnovationRequest({ request, onSave, onCancel }: Omit<Props, 'isEditing'>) {
    const [editedRequest, setEditedRequest] = useState(request);

    const handleSave = async () => {
        await onSave(editedRequest);
    };

    const fieldOptions = ["IT", "Healthcare", "Manufacturing", "Energy", "Finance"];
    const conceptOptions = ["Research", "Development", "Implementation", "Consulting"];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
        >
            <Card>
                <CardHeader>
                    <div className="mb-2">
                        <p className="text-sm text-muted-foreground">Title</p>
                    </div>
                    <Input
                        value={editedRequest.title}
                        onChange={(e) => setEditedRequest(prev => ({ ...prev, title: e.target.value }))}
                        className="text-4xl font-bold"
                    />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">Brief Description</p>
                            </div>
                            <Textarea
                                value={editedRequest.briefDescription}
                                onChange={(e) => setEditedRequest(prev => ({ ...prev, briefDescription: e.target.value }))}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div>
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">Detailed Description</p>
                            </div>
                            <Textarea
                                value={editedRequest.detailedDescription}
                                onChange={(e) => setEditedRequest(prev => ({ ...prev, detailedDescription: e.target.value }))}
                                className="min-h-[200px]"
                            />
                        </div>

                        <Separator />

                        <div>
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">Required Expertise</p>
                            </div>
                            <Textarea
                                value={editedRequest.expectedExpertise}
                                onChange={(e) => setEditedRequest(prev => ({ ...prev, expectedExpertise: e.target.value }))}
                                className="min-h-[100px]"
                            />
                        </div>

                        <div>
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">Expected Timeline</p>
                            </div>
                            <Textarea
                                value={editedRequest.expectedTimeline}
                                onChange={(e) => setEditedRequest(prev => ({ ...prev, expectedTimeline: e.target.value }))}
                                className="min-h-[100px]"
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
                                    onChange={(e) => setEditedRequest(prev => ({ ...prev, field: e.target.value }))}
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
                                    onChange={(e) => setEditedRequest(prev => ({ ...prev, concept: e.target.value }))}
                                >
                                    {conceptOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Company</p>
                                </div>
                                <Input
                                    value={editedRequest.company}
                                    onChange={(e) => setEditedRequest(prev => ({ ...prev, company: e.target.value }))}
                                />
                            </div>

                            <div>
                                <div className="mb-2">
                                    <p className="text-sm text-muted-foreground">Budget</p>
                                </div>
                                <Input
                                    type="number"
                                    value={editedRequest.budget}
                                    onChange={(e) => setEditedRequest(prev => ({ ...prev, budget: parseFloat(e.target.value) }))}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={onCancel}>Cancel</Button>
                            <Button onClick={handleSave} className="bg-fuchsia-500 hover:bg-fuchsia-500/90">Save</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function EditableInnovationRequest({ request, isEditing, onSave, onCancel }: Props) {
    return (
        <AnimatePresence mode="wait">
            {isEditing ? (
                <EditInnovationRequest key="edit" request={request} onSave={onSave} onCancel={onCancel} />
            ) : (
                <ViewInnovationRequest key="view" request={request} />
            )}
        </AnimatePresence>
    );
} 