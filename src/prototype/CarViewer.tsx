// PROTOTYPE — shared 3D viewer so variants can drop a GLB anywhere. Fills its parent (parent needs a size + position: relative).
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, Center, Clone, ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei'

type Props = {
  id: string
  // Model length runs along Z; [x, y, z] camera. Default is a front 3/4 view. Side view ≈ [6, 1.2, 0].
  camera?: [number, number, number]
  autoRotate?: boolean
  // Orbit/zoom with the mouse. Off for small thumbnails.
  interactive?: boolean
  // Dark scenes want brighter lighting.
  dark?: boolean
}

function Model({ id }: { id: string }) {
  return <Clone object={useGLTF(`/models/${id}.glb`).scene} />
}

export function CarViewer({ id, camera = [3.8, 1.6, 4.8], autoRotate = false, interactive = true, dark = false }: Props) {
  return (
    <Canvas style={{ position: 'absolute', inset: 0 }} camera={{ position: camera, fov: 30 }} dpr={[1, 2]}>
      <ambientLight intensity={dark ? 1.6 : 1.2} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} />
      <directionalLight position={[-4, 3, -3]} intensity={1.1} />
      <Suspense fallback={null}>
        <Bounds key={id} fit clip observe margin={1.1}>
          <Center top>
            <Model id={id} />
          </Center>
        </Bounds>
        <ContactShadows position={[0, 0, 0]} opacity={dark ? 0.8 : 0.5} scale={3} blur={2.2} far={1} />
      </Suspense>
      <Environment resolution={256} environmentIntensity={0.72}>
        <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer intensity={1.5} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={1.5} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
      </Environment>
      <OrbitControls makeDefault enabled={interactive} autoRotate={autoRotate} autoRotateSpeed={1} enablePan={false} minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.05} />
    </Canvas>
  )
}
