import { getInnovationRequest } from "@/lib/server/appwrite";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EuroIcon, Building2Icon, CalendarIcon, UserIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/backButton";
import { notFound } from "next/navigation";
import { InnovationRequest } from "@/lib/types";

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function InnovationRequestDetailPage(props: Props) {
    const params = await props.params;
    const res = await getInnovationRequest(params.id);

    if ('error' in res) {
        return notFound();
    }

    const request = res as unknown as InnovationRequest;

    return (
        <main className="py-8 w-full flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <BackButton />
                {/* TODO */}
                <div className="flex items-center gap-4">
                    <p className="text-muted-foreground text-white flex items-center gap-2">
                        Solution submitted
                        <CheckCircleIcon className="text-white" size={12} />
                    </p>
                    <Button variant="outline" size="sm">Submit Proposal</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <h1 className="text-4xl font-bold">{request.title}</h1>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <p className="text-muted-foreground whitespace-pre-wrap">{request.detailedDescription}</p>
                        </div>

                        <Separator />

                        

                        <div className="flex items-center gap-2">
                                <UserIcon className="text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Competenze Richieste</p>
                                    <p className="font-semibold">{request.expectedExpertise}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <CalendarIcon className="text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Tempistiche Previste</p>
                                    <p className="font-semibold">{request.expectedTimeline}</p>
                                </div>
                            </div>

                        <Separator />

                        
                    
                <div className="flex gap-2 mb-4">
                        <Badge variant="secondary">{request.field}</Badge>
                        <Badge variant="secondary">{request.concept}</Badge>
                    </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-2">
                                <Building2Icon className="text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Azienda</p>
                                    <p className="font-semibold">{request.company}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <EuroIcon className="text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Budget</p>
                                    <p className="font-semibold">{request.budget.toFixed(2)} €</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <CalendarIcon className="text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Data Pubblicazione</p>
                                    <p className="font-semibold">
                                        {formatDistance(new Date(request.$createdAt!), new Date(), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <CalendarIcon className="text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Ultimo Aggiornamento</p>
                                    <p className="font-semibold">
                                        {formatDistance(new Date(request.$updatedAt!), new Date(), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
} 