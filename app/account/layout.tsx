import Breadcrumb from '@/components/innovations/requests/breadcrumb'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='main flex justify-between items-center border-b border-white pb-2 mb-2'>
        <Breadcrumb />
      </div>
      {children}
    </div>
  )
}
