import { getInnovationRequests } from "@/app/actions";
import { InnovationRequest } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircleIcon, LayoutDashboardIcon } from "lucide-react";
import { notFound } from "next/navigation";
export const dynamic = 'force-dynamic';

export default async function InnovationRequestsPage() {
    const res = await getInnovationRequests();

    if ('error' in res) {
        return notFound();
    }

    const requests = res.documents as unknown as InnovationRequest[];

    return (
        <main className="py-8 w-full flex flex-col gap-8">
            <div className="flex justify-between items-center">
            <h1 className="text-5xl font-bold text-white">Innovation Hub</h1>
            <Link href="/innovation/requests/dashboard">
                <Button variant="outline">
                    <LayoutDashboardIcon className="w-4 h-4" />
                    Dashboard
                </Button>
            </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {requests?.map((request, index) => (
                    <Card key={request.$id} className="hover:shadow-lg transition-shadow flex flex-col justify-between">
                        <CardHeader className="relative flex flex-col justify-between">
                            <CardTitle className="text-xl line-clamp-1">{request.title}</CardTitle>
                            <div className="flex items-center gap-2 absolute top-2 right-4 text-xs">                    
                                {/* TODO */}
                                {index === 0 && <>
                                <p className="text-muted-foreground text-green-500">
                                    Solution submitted
                                    </p>
                                    
                                <CheckCircleIcon className="text-green-500" size={12} />
                                </>}
                            </div>
                                      
                        </CardHeader>
                        <CardContent className="grow">
                                <p className="text-muted-foreground line-clamp-3">{request.briefDescription}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs text-muted-foreground">Posted {formatDistance(new Date(request.$createdAt!), new Date(), { addSuffix: true })}</p>
                                    </div>
                                    <Link href={`/innovation/requests/${request.$id}`}>
                                        <Button variant="outline" size="sm">View details</Button>
                                    </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    );
} 