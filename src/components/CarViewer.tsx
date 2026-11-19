'use client'
// 3D car on a neon turntable. Fills its parent (parent needs a size + position: relative). Client-only: load via next/dynamic.
import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Environment, Grid, Lightformer, MeshReflectorMaterial, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

const CYAN = new THREE.Color('#27e1ff')
const VIOLET = new THREE.Color('#9a5bff')
const CAR_LENGTH = 4
const R = CAR_LENGTH * 0.62 // turntable radius

const FOV = 26
const TARGET = new THREE.Vector3(0, 0.45, 0) // just under the car's waistline, so the disc sits low in the frame
// The canvas extends this many px below the stage (see Stage.tsx, `-bottom-28`) so the scene fades out behind the
// button instead of being cut off; the view is shifted up by half of it to keep the car centred in the stage.
const BLEED = 112
const START = -0.4 // opening pose: side-on three-quarter, nose to the left

// Every car is scaled to CAR_LENGTH, so the camera distance only depends on the canvas shape: far enough that the
// platform spans the stage width, and never so close that the roof is cut off. Zoom is limited around that distance.
function Framing() {
  const framed = useRef('')
  useFrame((state) => {
    const controls = state.controls as OrbitControlsImpl | null
    const { width, height } = state.size
    const key = `${width}x${height}`
    if (!controls || key === framed.current) return
    framed.current = key
    const camera = state.camera as THREE.PerspectiveCamera
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const distance = Math.max((R * 1.47) / (tan * (width / (height - BLEED))), 1.55 / tan)
    camera.position.sub(TARGET).setLength(distance).add(TARGET)
    camera.setViewOffset(width, height, 0, BLEED / 2, width, height)
    controls.minDistance = distance * 0.9
    controls.maxDistance = distance * 1.25
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

// Soft dark blob the size of the car's footprint. (drei's ContactShadows rendered nothing in this scene.)
function blobShadow() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(0,2,8,0.95)')
  g.addColorStop(0.55, 'rgba(0,2,8,0.75)')
  g.addColorStop(1, 'rgba(0,2,8,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function Scene({ id }: { id: string }) {
  const { scene } = useGLTF(`/models/${id}.glb`)
  // Every GLB is scaled to the same length so one camera framing fits them all.
  const { model, footprint } = useMemo(() => {
    const model = scene.clone(true)
    const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3())
    const k = CAR_LENGTH / Math.max(size.x, size.z)
    model.scale.setScalar(k)
    return { model, footprint: [size.x * k * 0.62, size.z * k * 0.62, 1] as const }
  }, [scene])
  const shadow = useMemo(() => blobShadow(), [])
  // The car turns on the disc; the camera and the ring's cyan-left / violet-right gradient stay put.
  const turntable = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (turntable.current) turntable.current.rotation.y += dt * 0.08
  })
  return (
    <>
      <Framing />
      <group ref={turntable} rotation-y={START}>
        <Center top>
          <primitive object={model} />
        </Center>
        <mesh {...flat} position-y={0.012} scale={footprint}>
          <circleGeometry args={[1, 48]} />
          <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      <Platform />
      {/* Ground grid under the turntable; fades out with distance so it never meets the canvas edge. */}
      <Grid
        position-y={-R * 0.112}
        infiniteGrid
        cellSize={0.6}
        sectionSize={2.4}
        cellThickness={0.7}
        sectionThickness={1.1}
        cellColor="#1d4f9c"
        sectionColor="#2f7dff"
        fadeDistance={26}
        fadeStrength={2.2}
      />
    </>
  )
}

export function CarViewer({ id }: { id: string }) {
  return (
    <Canvas style={{ position: 'absolute', inset: 0 }} camera={{ position: [5, 1.45, 4.3], fov: FOV }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={1.3} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} />
      <directionalLight position={[-4, 3, -3]} intensity={1.4} color="#9fd4ff" />
      <Suspense fallback={null}>
        <Scene key={id} id={id} />
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
