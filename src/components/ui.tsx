// Shared HUD building blocks. Colours, fonts and the bevel shape come from tokens in app/globals.css.

// Glass card with a cyan→violet gradient edge and outer glow.
export function Panel({ children, className = '', padding = 'p-5' }: { children: React.ReactNode; className?: string; padding?: string }) {
  return (
    <section className={`drop-shadow-[0_0_14px_rgb(39_225_255/0.16)] ${className}`}>
      <div className="bevel h-full bg-linear-to-br from-cyan/60 via-line to-violet/55 p-px">
        <div className={`bevel h-full bg-panel backdrop-blur-md ${padding}`}>{children}</div>
      </div>
    </section>
  )
}

export const Dot = ({ tone = 'cyan' }: { tone?: 'cyan' | 'alert' }) => (
  <span
    aria-hidden
    className={`inline-block size-1.5 animate-blink rounded-full ${tone === 'cyan' ? 'bg-cyan shadow-[0_0_8px_var(--color-cyan)]' : 'bg-alert shadow-[0_0_8px_var(--color-alert)]'}`}
  />
)

export const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`hud flex items-center gap-2 text-mute ${className}`}>{children}</p>
)

// Label over a value, with a hairline under it.
export const Row = ({ label, children }: { label: React.ReactNode; children: React.ReactNode }) => (
  <div className="border-b border-line py-3.5 last:border-0">
    <Label>{label}</Label>
    <div className="mt-1.5 flex items-center justify-between gap-3 text-[15px] tracking-[0.08em] text-ink uppercase">{children}</div>
  </div>
)

// Big glowing call to action; wrap it in a <Link> or <button> with className="group block".
export const Cta = ({ children }: { children: React.ReactNode }) => (
  <span className="block drop-shadow-[0_0_18px_rgb(58_123_255/0.55)] transition group-hover:drop-shadow-[0_0_26px_rgb(39_225_255/0.7)] group-disabled:opacity-40">
    <span className="bevel block bg-linear-to-r from-cyan via-azure to-violet p-[2px]">
      <span className="bevel flex items-center justify-center gap-4 bg-abyss/95 px-10 py-5 font-display text-lg tracking-[0.3em] text-ink uppercase transition group-hover:bg-abyss/70">
        {children}
        <Chevrons className="text-cyan" />
      </span>
    </span>
  </span>
)

export const Chevrons = ({ className = '' }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 24 24" className={`size-6 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 5l7 7-7 7M12 5l7 7-7 7" />
  </svg>
)

export const Pin = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-cyan" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 21s7-6.2 7-11.5a7 7 0 10-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

export const Check = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="size-5 text-cyan" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.7 2.7L16 9.8" />
  </svg>
)
