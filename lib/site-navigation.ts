import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useMemo } from 'react'

export function usePathname() {
  return useRouterState({ select: (state) => state.location.pathname })
}

export function useSiteRouter() {
  const navigate = useNavigate()
  return useMemo(() => ({ push: (href: string) => navigate({ to: href as '/' }) }), [navigate])
}
