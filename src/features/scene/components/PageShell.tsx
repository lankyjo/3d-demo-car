'use client'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { selectLeaving } from '../slice/sceneSelectors'

// Page wrapper: flags the page as leaving so every <Stagger> inside animates out.
export function PageShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const pathname = usePathname()
  const leaving = useAppSelector((s) => selectLeaving(s, pathname))
  return <div data-leaving={leaving || undefined} className={className}>{children}</div>
}
