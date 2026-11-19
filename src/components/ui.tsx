// Shared HUD building blocks. Colours, fonts and the bevel shape come from tokens in app/globals.css.

// Cockpit tilt for the side cards on desktop: the outer edge comes toward the viewer.
const tilts = {
  left: 'lg:origin-left lg:[transform:perspective(1100px)_rotateY(7deg)]',
  right: 'lg:origin-right lg:[transform:perspective(1100px)_rotateY(-7deg)]',
}

// Near-black notched card with a thin ice-blue edge and a soft outer glow.
export function Panel({ children, className = '', padding = 'p-5', tilt }: { children: React.ReactNode; className?: string; padding?: string; tilt?: keyof typeof tilts }) {
  return (
    <section className={`drop-shadow-[0_0_10px_rgb(10_108_255/0.22)] ${tilt ? tilts[tilt] : ''} ${className}`}>
      <div className="bevel panel-edge h-full p-px">
        <div className={`bevel h-full bg-panel ${padding}`}>{children}</div>
      </div>
    </section>
  )
}

export const Dot = ({ tone = 'cyan' }: { tone?: 'cyan' | 'alert' }) => (
  <span
    aria-hidden
    className={`inline-block size-2 shrink-0 animate-blink rounded-full ${tone === 'cyan' ? 'bg-cyan shadow-[0_0_8px_var(--color-cyan)]' : 'bg-alert shadow-[0_0_8px_var(--color-alert)]'}`}
  />
)

export const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`hud flex items-center gap-2 text-mute ${className}`}>{children}</p>
)

// Label over a value, with a hairline under it.
export const Row = ({ label, children }: { label: React.ReactNode; children: React.ReactNode }) => (
  <div className="border-b border-line py-3.5 last:border-0">
    <Label>{label}</Label>
    <div className="mt-1.5 flex items-center gap-3 text-[15px] tracking-[0.08em] text-ink uppercase">{children}</div>
  </div>
)

// Big glowing call to action; wrap it in a <Link> or <button> with className="group block".
export const Cta = ({ children }: { children: React.ReactNode }) => (
  <span className="block drop-shadow-[0_0_22px_rgb(58_123_255/0.7)] transition group-hover:drop-shadow-[0_0_30px_rgb(39_225_255/0.8)] group-disabled:opacity-40">
    <span className="bevel block bg-linear-to-r from-cyan via-azure to-violet p-[3px]">
      <span className="bevel flex items-center justify-center gap-5 bg-abyss bg-linear-to-r from-azure/25 via-transparent to-violet/20 px-8 py-5 font-display text-base tracking-[0.28em] whitespace-nowrap text-ink uppercase [-webkit-text-stroke:0.5px_currentColor] [text-shadow:0_0_12px_rgb(230_238_255/0.5)] transition group-hover:from-azure/40">
        {children}
        <svg aria-hidden viewBox="0 0 34 24" className="h-6 w-9 shrink-0 drop-shadow-[0_0_6px_var(--color-cyan)]">
          <defs>
            <linearGradient id="cta-chev" x1="0" x2="1">
              <stop offset="0" stopColor="var(--color-cyan)" /><stop offset="1" stopColor="var(--color-azure)" />
            </linearGradient>
          </defs>
          <path fill="url(#cta-chev)" d="M0 0h7l10 12L7 24H0l10-12zM15 0h7l10 12-10 12h-7l10-12z" />
        </svg>
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
