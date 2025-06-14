'use client'

import dynamic from 'next/dynamic'

// This wrapper component is necessary because `next/dynamic` with `ssr: false`
// is not allowed in Server Components. We use this Client Component to handle
// the dynamic, client-side-only import of the main Sidebar.
const Sidebar = dynamic(
  () => import('@/components/layout/Sidebar').then((mod) => mod.Sidebar),
  {
    ssr: false,
  },
)

export default function SidebarWrapper() {
  return <Sidebar />
} 