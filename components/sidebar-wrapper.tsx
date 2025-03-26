'use client';

import dynamic from 'next/dynamic';

const AppSidebar = dynamic(
  () => import('@/components/app-sidebar').then(mod => mod.AppSidebar),
  { ssr: false }
);

export function SidebarWrapper() {
  return <AppSidebar />;
}
