import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const texts = [
    {
      text: "Innovator",
      description: [
        "For SMEs, start-ups, and professionals",
        "Connect with companies to develop innovation"
      ]
    },
    {
      text: "Innovator Requestor",
      description: [
        "For companies, SMEs, non-profit initiative",
        "Find innovators to create solutions"
      ]
    }
  ]
  return (
    <div className="flex flex-col gap-4">
    <div className="flex justify-center items-center py-12 text-white">
      <div className="flex gap-2 flex-col text-center w-full justify-center items-center">
        <Image src="/logo.svg" alt="Neoecotex" width={700} height={200} />
        <p className="text-2xl lg:text-3xl px-8">
        Connects companies with innovators to solve challenges and create new solutions</p>
        <p className="font-bold text-2xl lg:text-4xl mt-8 bg-white/20 p-4 w-full">
        Begin your innovation journey today!
        </p>
      </div>
    </div>
    <div className="flex flex-col lg:flex-row justify-stretch mb-48 gap-4">
      {texts.map((text, index) => (
        <Link key={index} href="/signup?type=innovator" className="border border-fuchsia-700 w-1/2 bg-fuchsia-200 p-4 h-48 backdrop-blur-xl shadow-lg flex flex-col gap-4 justify-center items-center align-middle backdrop-blur-sm w-full hover:shadow-lg hover:translate-y-[-10px] hover:bg-white transition-all duration-300">
              <div className="flex flex-col gap-0 justify-center items-end">
              <p className="text-xs text-center text-fuchsia-900">Register as</p>
              <p className="text-2xl font-bold text-fuchsia-700">{text.text}</p>
              </div>
              <div className="text-sm text-center">{text.description.map((description, index) => (
                <div key={index}><span>{description}</span><br /></div>
              ))}</div>
        </Link>
      ))}
      </div>
    </div>
  );
}
