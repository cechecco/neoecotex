import Breadcrumb from '@/components/innovations/requests/breadcrumb'
export default function InnovationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='main flex justify-left items-center border-b border-white/20 mb-4'>
        <Breadcrumb />
      </div>
      {children}
    </div>
  )
}
