import { getInnovationRequests } from "@/app/actions";
import RequestCard from "./requestCard";

export default async function RequestsList() {
    const innovationRequests = await getInnovationRequests();
    if ('error' in innovationRequests) {
        return <div>
            <h1>Error {innovationRequests.message}</h1>
        </div>
    } else {
        return <div>
            <div className="grid grid-cols-3 gap-4">
                {innovationRequests.documents.map((request) => (
                    <RequestCard key={request.$id} request={request} />
                ))}
            </div>
        </div>
    }
}