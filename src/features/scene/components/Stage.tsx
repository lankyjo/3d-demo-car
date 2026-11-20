// The space a page leaves open for the 3D car. SceneBackdrop draws the car behind the page and fits it to this
// element's on-screen box (found by id), so the car always sits exactly in the gap the layout leaves.
export const STAGE_ID = 'stage'

export function Stage({ className = 'flex-1' }: { className?: string }) {
  return <div id={STAGE_ID} className={`min-h-24 w-full ${className}`} />
}
