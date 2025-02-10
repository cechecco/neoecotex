import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex items-stretch gap-16 p-16">
      <div className="backdrop-blur-sm row-span-2 flex flex-col p-12 rounded-2xl bg-red-500/70 text-white justify-between">
        <div>
          <h2 className="text-5xl font-bold mb-6">I am an Innovator</h2>
          <p className="mb-8 text-lg">For SMEs, start-ups, and independent professionals, as innovators, register and reply to innovation post to connect with companies to develop eco-innovation.</p>
        </div>
        <Button asChild>
          <Link href="/signup?type=innovator">Register Now</Link>
        </Button>
      </div>

      <div className="backdrop-blur-sm flex flex-col p-12 rounded-2xl bg-blue-500/70 text-white justify-between">
        <div>
          <h2 className="text-5xl font-bold mb-6">I am an Innovation Requestor</h2>
          <p className="mb-8 text-lg">For companies, SMEs, non-profit initiative, in search of innovation for your product, process, or marketing, register and create innovation post.</p>
        </div>
        <Button asChild>
          <Link href="/signup?type=requestor">Register Now</Link>
        </Button>
      </div>
    </div>
  );
}
