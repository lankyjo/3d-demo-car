import type { NextConfig } from 'next'

const config: NextConfig = {
  // Pin the workspace root to this project; otherwise Next finds a stray package-lock.json in the home directory.
  turbopack: { root: import.meta.dirname },
}

export default config
