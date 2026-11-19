'use client'
// 3D car on a neon turntable. Fills its parent (parent needs a size + position: relative). Client-only: load via next/dynamic.
import { Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bounds, Center, ContactShadows, Environment, Lightformer, OrbitControls, useBounds, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

const CYAN = new THREE.Color('#27e1ff')
const VIOLET = new THREE.Color('#9a5bff')
const CAR_LENGTH = 4
const R = CAR_LENGTH * 0.62 // turntable radius

// How far the user may zoom relative to the auto-framed fit, so the car never fills or vanishes from the stage.
const ZOOM_IN = 0.8
const ZOOM_OUT = 1.25

// Bounds' onFit never fires for perspective cameras, so read the fitted size every frame; it also tracks resizes.
function ZoomLimits() {
  const bounds = useBounds()
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  useFrame(() => {
    if (!controls) return
    const { distance } = bounds.getSize()
    // eslint-disable-next-line react-hooks/immutability -- three.js controls are mutable by design
    controls.minDistance = distance * ZOOM_IN
    controls.maxDistance = distance * ZOOM_OUT
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

const ring = neonRing(R, R * 0.012)
const halo = neonRing(R, R * 0.06)

function Platform() {
  return (
    <group>
      <mesh position-y={-R * 0.04}>
        <cylinderGeometry args={[R * 1.02, R * 1.06, R * 0.08, 128]} />
        <meshStandardMaterial color="#070b16" metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.002} geometry={ring}>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.002} geometry={halo}>
        <meshBasicMaterial vertexColors toneMapped={false} transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.003}>
        <ringGeometry args={[R * 0.72, R * 0.725, 128]} />
        <meshBasicMaterial color="#3a7bff" transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Scene({ id }: { id: string }) {
  const { scene } = useGLTF(`/models/${id}.glb`)
  // Every GLB is scaled to the same length so the default camera frames it even before Bounds' fit animation runs.
  const model = useMemo(() => {
    const model = scene.clone(true)
    const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3())
    model.scale.setScalar(CAR_LENGTH / Math.max(size.x, size.z))
    return model
  }, [scene])
  // Shadows sit outside Bounds so their large plane doesn't shrink the auto-fit.
  return (
    <>
      <Bounds fit observe margin={1.02}>
        <ZoomLimits />
        <Center top>
          <primitive object={model} />
        </Center>
        <Platform />
      </Bounds>
      <ContactShadows position-y={0.004} opacity={0.85} scale={R * 2.2} blur={2.2} far={R} />
    </>
  )
}

export function CarViewer({ id }: { id: string }) {
  return (
    <Canvas style={{ position: 'absolute', inset: 0 }} camera={{ position: [5.2, 2.6, 4.4], fov: 30 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} />
      <directionalLight position={[-4, 3, -3]} intensity={1.2} color="#9ab8ff" />
      <Suspense fallback={null}>
        <Scene key={id} id={id} />
      </Suspense>
      <Environment resolution={256} environmentIntensity={0.8}>
        <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer intensity={2} color="#27e1ff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={2} color="#9a5bff" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
      </Environment>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.6} enablePan={false} minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  )
}
