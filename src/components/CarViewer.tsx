'use client'
// 3D car on a neon turntable. Fills its parent (parent needs a size + position: relative). Client-only: load via next/dynamic.
import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, ContactShadows, Environment, Lightformer, MeshReflectorMaterial, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

const CYAN = new THREE.Color('#27e1ff')
const VIOLET = new THREE.Color('#9a5bff')
const CAR_LENGTH = 4
const R = CAR_LENGTH * 0.62 // turntable radius

const FOV = 26
const TARGET = new THREE.Vector3(0, 0.45, 0) // just under the car's waistline, so the disc sits low in the frame

// Every car is scaled to CAR_LENGTH, so the camera distance only depends on the canvas shape: far enough that the
// ring spans the stage width, and never so close that the roof is cut off. Zoom is limited around that distance.
function Framing() {
  const framed = useRef(0)
  useFrame((state) => {
    const controls = state.controls as OrbitControlsImpl | null
    const aspect = state.size.width / state.size.height
    if (!controls || aspect === framed.current) return
    framed.current = aspect
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const distance = Math.max((R * 1.16) / (tan * aspect), 1.55 / tan)
    state.camera.position.sub(TARGET).setLength(distance).add(TARGET)
    controls.minDistance = distance * 0.8
    controls.maxDistance = distance * 1.3
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

// Thin glossy disc that mirrors the car, edged by the neon ring.
function Platform() {
  return (
    <group>
      <mesh position-y={-R * 0.02}>
        <cylinderGeometry args={[R * 1.03, R * 1.05, R * 0.04, 128]} />
        <meshBasicMaterial color="#04060c" />
      </mesh>
      <mesh {...flat} position-y={0.001}>
        <circleGeometry args={[R * 1.03, 128]} />
        <MeshReflectorMaterial
          resolution={1024}
          blur={[260, 80]}
          mixBlur={1}
          mixStrength={1.1}
          mirror={0.6}
          roughness={1}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#03050b"
          metalness={0}
        />
      </mesh>
      {[0.45, 0.72].map((r) => (
        <mesh key={r} {...flat} position-y={0.004}>
          <ringGeometry args={[R * r, R * (r + 0.003), 128]} />
          <meshBasicMaterial color="#3a7bff" transparent opacity={0.3} toneMapped={false} />
        </mesh>
      ))}
      <mesh {...flat} position-y={0.006} geometry={ring}>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </mesh>
      <mesh {...flat} position-y={0.006} geometry={halo}>
        <meshBasicMaterial vertexColors toneMapped={false} transparent opacity={0.14} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

function Scene({ id }: { id: string }) {
  const { scene } = useGLTF(`/models/${id}.glb`)
  // Every GLB is scaled to the same length so one camera framing fits them all.
  const model = useMemo(() => {
    const model = scene.clone(true)
    const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3())
    model.scale.setScalar(CAR_LENGTH / Math.max(size.x, size.z))
    return model
  }, [scene])
  // The car turns on the disc; the camera and the ring's cyan-left / violet-right gradient stay put.
  const turntable = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (turntable.current) turntable.current.rotation.y += dt * 0.12
  })
  return (
    <>
      <Framing />
      <group ref={turntable} rotation-y={-0.45}>
        <Center top>
          <primitive object={model} />
        </Center>
      </group>
      <Platform />
      <ContactShadows position-y={0.008} opacity={0.9} scale={R * 2} blur={2} far={R} />
    </>
  )
}

export function CarViewer({ id }: { id: string }) {
  return (
    <Canvas style={{ position: 'absolute', inset: 0 }} camera={{ position: [5, 1.95, 4.3], fov: FOV }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={1.3} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} />
      <directionalLight position={[-4, 3, -3]} intensity={1.4} color="#9ab8ff" />
      <Suspense fallback={null}>
        <Scene key={id} id={id} />
      </Suspense>
      <Environment resolution={256} environmentIntensity={0.8}>
        <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer intensity={2.5} color="#27e1ff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={2.5} color="#8fb4ff" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
      </Environment>
      <OrbitControls makeDefault target={TARGET} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.08} />
    </Canvas>
  )
}
