const offsets = { left: ['-48px', '0px'], right: ['48px', '0px'], up: ['0px', '-24px'], down: ['0px', '28px'] }

// One step of the page choreography: slides in from `from` when the page mounts and back out when it leaves.
// `i` is its place in the sequence. The motion itself is the `stagger` utility in globals.css.
export function Stagger({ i, from = 'down', className = '', children }: { i: number; from?: keyof typeof offsets; className?: string; children: React.ReactNode }) {
  const [dx, dy] = offsets[from]
  return (
    <div className={`stagger ${className}`} style={{ '--i': i, '--dx': dx, '--dy': dy } as React.CSSProperties}>
      {children}
    </div>
  )
}
