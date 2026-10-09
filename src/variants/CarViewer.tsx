// PROTOTYPE — shared 3D viewer so variants can drop a GLB anywhere. Fills its parent (parent needs a size + position: relative).
import { Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bounds, Center, ContactShadows, Environment, Lightformer, OrbitControls, useBounds, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

type Props = {
  id: string
  // Model length runs along Z; [x, y, z] camera. Default is a front 3/4 view. Side view ≈ [6, 1.2, 0].
  camera?: [number, number, number]
  autoRotate?: boolean
  // Orbit/zoom with the mouse. Off for small thumbnails.
  interactive?: boolean
  // Dark scenes want brighter lighting.
  dark?: boolean
  // Multiplied into the baked texture: tints light-coloured cars, barely changes dark ones. Omit for factory paint.
  paint?: string
}

// How far the user may zoom relative to the auto-framed fit, so the car never fills or vanishes from the stage.
const ZOOM_IN = 0.85
const ZOOM_OUT = 1.2

// Keeps the orbit zoom inside a band around the auto-framed distance. Bounds' onFit never fires for perspective
// cameras (fit() short-circuits to reset()), so read the fitted size every frame instead; it also tracks resizes.
function ZoomLimits() {
  const bounds = useBounds()
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  useFrame(() => {
    if (!controls) return
    const { distance } = bounds.getSize()
    controls.minDistance = distance * ZOOM_IN
    controls.maxDistance = distance * ZOOM_OUT
  })
  return null
}

function Model({ id, paint }: { id: string; paint?: string }) {
  const { scene } = useGLTF(`/models/${id}.glb`)
  // Own materials per clone so tinting never leaks into useGLTF's shared cache.
  const model = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((o) => {
      if (o instanceof THREE.Mesh) o.material = (o.material as THREE.Material).clone()
    })
    return clone
  }, [scene])
  model.traverse((o) => {
    if (o instanceof THREE.Mesh) (o.material as THREE.MeshStandardMaterial).color.set(paint ?? '#ffffff')
  })
  return <primitive object={model} />
}

export function CarViewer({ id, camera = [3.8, 1.6, 4.8], autoRotate = false, interactive = true, dark = false, paint }: Props) {
  return (
    <Canvas style={{ position: 'absolute', inset: 0 }} camera={{ position: camera, fov: 30 }} dpr={[1, 2]}>
      <ambientLight intensity={dark ? 1.6 : 1.2} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} />
      <directionalLight position={[-4, 3, -3]} intensity={1.1} />
      <Suspense fallback={null}>
        <Bounds key={id} fit observe margin={1.1}>
          <ZoomLimits />
          <Center top>
            <Model id={id} paint={paint} />
          </Center>
        </Bounds>
        <ContactShadows position={[0, 0, 0]} opacity={dark ? 0.8 : 0.5} scale={3} blur={2.2} far={1} />
      </Suspense>
      <Environment resolution={256} environmentIntensity={0.72}>
        <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer intensity={1.5} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={1.5} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
      </Environment>
      <OrbitControls
        makeDefault
        enabled={interactive}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        enablePan={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  )
}
