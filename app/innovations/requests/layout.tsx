import InnovationsLayoutTitleLink from "@/components/innovations/layoutTitleLink";
export default function InnovationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div>
        <div className="main flex justify-left items-center border-b border-white/20 mb-8">
            <InnovationsLayoutTitleLink />
        </div>
        {children}
    </div>;
}