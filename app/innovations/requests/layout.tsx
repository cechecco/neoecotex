import InnovationsLayoutTitleLink from '@/components/innovations/innovationHubHeader'
export default function InnovationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='main flex justify-left items-center border-b border-white/20 mb-4 bg-white/10'>
        <InnovationsLayoutTitleLink />
      </div>
      {children}
    </div>
  )
}
