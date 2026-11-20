// The space a page leaves open for the 3D car, which SceneBackdrop draws behind the page.
export function Stage({ className = 'flex-1' }: { className?: string }) {
  return <div className={`min-h-48 w-full lg:min-h-80 ${className}`} />
}
