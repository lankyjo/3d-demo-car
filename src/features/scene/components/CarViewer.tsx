'use client'
// 3D car on a neon turntable, drawn full-screen behind the pages by SceneBackdrop. Client-only: load via next/dynamic.
import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Environment, Grid, Lightformer, MeshReflectorMaterial, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { View } from '../slice/sceneSelectors'

// react-three-fiber 9 still creates a THREE.Clock internally, which three r183+ reports as deprecated on every load.
// Nothing in this app can change that, so drop that one message; every other three.js log passes through unchanged.
// Remove this when fiber stops using Clock (v10).
THREE.setConsoleFunction((type, message, ...rest) => {
  if (message.startsWith('THREE.Clock: This module has been deprecated')) return
  console[type as 'log' | 'warn' | 'error'](message, ...rest)
})

const CYAN = new THREE.Color('#27e1ff')
const VIOLET = new THREE.Color('#9a5bff')
const CAR_LENGTH = 4
const R = CAR_LENGTH * 0.62 // turntable radius

const FOV = 38
const TARGET = new THREE.Vector3(0, 0.45, 0) // just under the car's waistline
const START = -0.4 // resting pose: side-on three-quarter, nose to the left
const SPIN = 1.4 // top speed of the transition spin, rad/s (one turn in about 4.5s)
const { damp, degToRad } = THREE.MathUtils

// Where the scene sits on the full-screen canvas for each page, on desktop and on phones (< 1024px wide):
//   side  px taken by the page's side cards, so the scene is fitted to what is left between them
//   cy    vertical centre of the scene as a fraction of the viewport height
//   fit   world radius that must fit that width: larger shows the whole base, smaller zooms in on the car
// These mirror the page layouts (FleetConsole, Checkout); retune here if the card widths change.
const VIEWS: Record<View, Record<'desktop' | 'phone', { side: number; cy: number; fit: number }>> = {
  fleet: { desktop: { side: 660, cy: 0.42, fit: R * 1.2 }, phone: { side: 0, cy: 0.3, fit: R * 1.12 } },
  checkout: { desktop: { side: 790, cy: 0.47, fit: R * 1.0 }, phone: { side: 0, cy: 0.45, fit: R * 0.98 } },
}

// Eases the camera distance and vertical placement toward the current page's framing. Once it has settled it lets
// go, so the user's own zoom sticks until the page or the window size changes.
function Framing({ view }: { view: View }) {
  const at = useRef({ distance: 0, shift: 0, key: '' })
  useFrame((state, dt) => {
    const controls = state.controls as OrbitControlsImpl | null
    if (!controls) return
    const { width, height } = state.size
    const v = VIEWS[view][width < 1024 ? 'phone' : 'desktop']
    const tan = Math.tan(degToRad(FOV / 2))
    const distance = Math.max((v.fit * height) / (tan * Math.max(width - v.side, 280)), 2 / tan)
    const shift = (0.5 - v.cy) * height
    const now = at.current
    const key = `${width}x${height}`
    if (!now.key) Object.assign(now, { distance, shift }) // first frame: no animation
    const settled = Math.abs(now.distance - distance) < 0.01 && Math.abs(now.shift - shift) < 0.5
    if (settled && now.key === key) return
    now.distance = settled ? distance : damp(now.distance, distance, 2.4, dt)
    now.shift = settled ? shift : damp(now.shift, shift, 2.4, dt)
    now.key = key
    const camera = state.camera as THREE.PerspectiveCamera
    camera.position.sub(TARGET).setLength(now.distance).add(TARGET)
    camera.setViewOffset(width, height, 0, now.shift, width, height)
    controls.minDistance = now.distance * 0.85
    controls.maxDistance = now.distance * 1.25
    controls.update()
  })
  return null
}

// Flat ring in the XZ plane, coloured cyan on the left fading to violet on the right.
function neonRing(radius: number, tube: number) {
  const g = new THREE.TorusGeometry(radius, tube, 16, 180)
  const pos = g.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) c.lerpColors(CYAN, VIOLET, (pos.getX(i) / radius + 1) / 2).toArray(colors, i * 3)
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return g
}

const ring = neonRing(R, R * 0.009)
const halo = neonRing(R, R * 0.028) // one soft pass around the ring; anything wider smears colour over the disc
const flat = { 'rotation-x': -Math.PI / 2 } as const

// Radial tick lines on the disc surface; with the concentric rings they read as depth.
const spokes = (() => {
  const pts: number[] = []
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2
    const inner = R * (i % 4 === 0 ? 0.22 : 0.62)
    pts.push(Math.cos(a) * inner, 0, Math.sin(a) * inner, Math.cos(a) * R * 0.96, 0, Math.sin(a) * R * 0.96)
  }
  return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
})()

// Two-tier turntable: a dark glossy disc edged by the neon ring, on a wider low base.
function Platform() {
  return (
    <group>
      <mesh position-y={-R * 0.09}>
        <cylinderGeometry args={[R * 1.11, R * 1.13, R * 0.04, 128]} />
        <meshStandardMaterial color="#05182e" metalness={0.3} roughness={0.7} envMapIntensity={0.2} />
      </mesh>
      <mesh {...flat} position-y={-R * 0.068}>
        <ringGeometry args={[R * 1.1, R * 1.108, 128]} />
        <meshBasicMaterial color="#3a7bff" transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <mesh position-y={-R * 0.035}>
        <cylinderGeometry args={[R * 1.03, R * 1.05, R * 0.07, 128]} />
        <meshStandardMaterial color="#061c36" metalness={0.3} roughness={0.7} envMapIntensity={0.15} />
      </mesh>
      {/* Navy top face with a soft, blurred mirror of the car. Mostly metal and no env map, so the scene lights
          tint it instead of washing it out to grey. */}
      <mesh {...flat} position-y={0.002}>
        <circleGeometry args={[R * 1.03, 128]} />
        <MeshReflectorMaterial
          resolution={1024}
          blur={[160, 50]}
          mixBlur={0.7}
          mixStrength={7}
          mirror={0.8}
          depthScale={1.1}
          minDepthThreshold={0.25}
          maxDepthThreshold={1.4}
          color="#06203d"
          metalness={0.75}
          roughness={0.85}
          envMapIntensity={0}
        />
      </mesh>
      {[0.22, 0.42, 0.62, 0.82].map((r) => (
        <mesh key={r} {...flat} position-y={0.004}>
          <ringGeometry args={[R * r, R * (r + 0.003), 128]} />
          <meshBasicMaterial color="#3a7bff" transparent opacity={0.3} toneMapped={false} />
        </mesh>
      ))}
      <lineSegments geometry={spokes} position-y={0.004}>
        <lineBasicMaterial color="#3a7bff" transparent opacity={0.16} toneMapped={false} />
      </lineSegments>
      <mesh {...flat} position-y={0.006} geometry={ring}>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </mesh>
      <mesh {...flat} position-y={0.006} geometry={halo}>
        <meshBasicMaterial vertexColors toneMapped={false} transparent opacity={0.14} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

// Soft dark blob stretched to the car's footprint. (drei's ContactShadows rendered nothing in this scene.)
// Built once on first use and shared by every car, so switching cars doesn't leak textures.
let shadowTexture: THREE.CanvasTexture | undefined
function blobShadow() {
  if (shadowTexture) return shadowTexture
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(0,2,8,0.95)')
  g.addColorStop(0.55, 'rgba(0,2,8,0.75)')
  g.addColorStop(1, 'rgba(0,2,8,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return (shadowTexture = new THREE.CanvasTexture(c))
}

// The car on its turntable. Suspends while the GLB downloads; the platform and grid are drawn outside it, so the
// room is there from the first frame.
function Car({ id, view }: { id: string; view: View }) {
  const { scene } = useGLTF(`/models/${id}.glb`)
  // Every GLB is scaled to the same length so one camera framing fits them all.
  const { model, footprint } = useMemo(() => {
    const model = scene.clone(true)
    const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3())
    const k = CAR_LENGTH / Math.max(size.x, size.z)
    model.scale.setScalar(k)
    return { model, footprint: [size.x * k * 0.62, size.z * k * 0.62, 1] as const }
  }, [scene])
  // The car turns on the disc; the camera and the ring's cyan-left / violet-right gradient stay put.
  // Fleet: slow endless spin. Checkout: one unhurried spin on to the resting pose, then it stays still.
  const turntable = useRef<THREE.Group>(null)
  const rest = useRef<number | null>(null)
  useFrame((_, dt) => {
    const car = turntable.current
    if (!car) return
    if (view === 'fleet') {
      rest.current = null
      car.rotation.y += dt * 0.08
      return
    }
    // The next resting pose at least a third of a turn ahead; approach it at no more than SPIN rad/s, easing out.
    rest.current ??= START + Math.ceil((car.rotation.y + Math.PI * 0.66 - START) / (Math.PI * 2)) * Math.PI * 2
    car.rotation.y += Math.min(damp(car.rotation.y, rest.current, 2, dt) - car.rotation.y, SPIN * dt)
  })
  return (
    <group ref={turntable} rotation-y={START}>
      <Center top>
        <primitive object={model} />
      </Center>
      <mesh {...flat} position-y={0.012} scale={footprint}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial map={blobShadow()} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

export function CarViewer({ id, view }: { id: string; view: View }) {
  return (
    <Canvas style={{ position: 'absolute', inset: 0 }} camera={{ position: [5, 1.45, 4.3], fov: FOV }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={1.3} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} />
      <directionalLight position={[-4, 3, -3]} intensity={1.4} color="#9fd4ff" />
      <Framing view={view} />
      <Platform />
      {/* Wide soft shadow on the floor so the base reads as standing on the grid, not hovering over it. */}
      <mesh {...flat} position-y={-R * 0.111} scale={[R * 1.75, R * 1.75, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial map={blobShadow()} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {/* Ground grid under the turntable; fades out with distance so it never meets the canvas edge. */}
      <Grid
        position-y={-R * 0.11}
        infiniteGrid
        cellSize={0.6}
        sectionSize={2.4}
        cellThickness={0.7}
        sectionThickness={1.1}
        cellColor="#2460b8"
        sectionColor="#3d8bff"
        fadeDistance={42}
        fadeStrength={2.2}
      />
      <Suspense fallback={null}>
        <Car key={id} id={id} view={view} />
      </Suspense>
      <Environment resolution={256} environmentIntensity={0.8}>
        <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer intensity={2.5} color="#27e1ff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={2.5} color="#6fc3ff" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
      </Environment>
      <OrbitControls makeDefault target={TARGET} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.08} />
    </Canvas>
  )
}
