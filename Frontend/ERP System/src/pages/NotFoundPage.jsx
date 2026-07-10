import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ar } from '@/constants/ar'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">{ar.notFound.title}</h2>
      <p className="mt-2 text-muted-foreground">{ar.notFound.description}</p>
      <Button asChild className="mt-6">
        <Link to="/">
          <Home className="h-4 w-4" />
          {ar.notFound.back}
        </Link>
      </Button>
    </div>
  )
}
