import { Suspense } from 'react'
import { PageLoader } from '@/components/ui/loader'

export function LazyPage({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}
