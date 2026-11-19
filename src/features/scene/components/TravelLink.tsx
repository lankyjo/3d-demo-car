'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { travel } from '../slice/sceneSlice'

// A link that plays the page choreography before navigating. Still a real <a>, so it works without JS and with
// "open in new tab". `then` runs once the route has changed.
export function TravelLink({ href, then, className, children }: { href: string; then?: () => void; className?: string; children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        dispatch(travel(router.push, pathname, href, then))
      }}
    >
      {children}
    </Link>
  )
}
