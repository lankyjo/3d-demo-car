import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, Center, ContactShadows, Environment, Lightformer, MeshReflectorMaterial, OrbitControls, useProgress } from '@react-three/drei'
import { CarModel } from './components/CarModel'

const colors = [
  { name: 'Crimson', value: '#b51724' },
  { name: 'Midnight', value: '#17191e' },
  { name: 'Pearl', value: '#e7e3d8' },
  { name: 'Ocean', value: '#215fa6' },
  { name: 'Forest', value: '#244f3a' },
  { name: 'Graphite', value: '#555861' },
]

export default function App() {
  const [color, setColor] = useState(colors[0].value)
  const [autoRotate, setAutoRotate] = useState(true)
  const { active } = useProgress()

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Toyota Studio home">
          <span className="brand-mark">T</span>
          <span>Toyota Studio</span>
        </a>
        <div className="topbar-actions">
          <span className="model-pill">Concept configurator</span>
          <button className="ghost-button" onClick={() => setAutoRotate((value) => !value)}>
            {autoRotate ? 'Stop spin' : 'Auto spin'}
          </button>
        </div>
      </header>

      <section className="workspace">
        <div className="stage">
          <div className="stage-meta">
            <span>TOYOTA</span>
            <strong>Custom build</strong>
          </div>

          <Canvas
            shadows
            style={{ position: 'absolute', inset: 0 }}
            camera={{ position: [3.8, 2.1, 4.8], fov: 34 }}
            dpr={[1, 2]}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
          >
            <color attach="background" args={['#f1f0ed']} />
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 6, 4]} intensity={2.2} castShadow />
            <directionalLight position={[-4, 3, -3]} intensity={1.1} />

            <Suspense fallback={null}>
              <Bounds fit observe margin={1.05}>
                <group position={[0, -0.76, 0]} scale={2.4}>
                  <Center top>
                    <CarModel color={color} />
                  </Center>
                </group>

                <mesh position={[0, -0.81, 0]} receiveShadow>
                  <cylinderGeometry args={[1.85, 1.92, 0.1, 96]} />
                  <meshStandardMaterial color="#1b1c1f" metalness={0.6} roughness={0.35} />
                </mesh>
                <mesh position={[0, -0.759, 0]} rotation-x={-Math.PI / 2}>
                  <circleGeometry args={[1.85, 96]} />
                  <MeshReflectorMaterial
                    resolution={1024}
                    blur={[200, 60]}
                    mixBlur={1}
                    mixStrength={4}
                    mirror={0.75}
                    roughness={0.45}
                    depthScale={1}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.2}
                    color="#2a2b2f"
                    metalness={0.4}
                  />
                </mesh>
              </Bounds>
            </Suspense>

            <Environment resolution={256} environmentIntensity={0.72}>
              <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
              <Lightformer intensity={1.5} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
              <Lightformer intensity={1.5} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
            </Environment>

            <ContactShadows position={[0, -0.755, 0]} opacity={0.55} scale={5} blur={2.4} far={1.5} />
            <OrbitControls
              makeDefault
              autoRotate={autoRotate}
              autoRotateSpeed={1.25}
              enablePan={false}
              minDistance={2.7}
              maxDistance={8}
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI / 2.02}
              target={[0, 0.15, 0]}
            />
          </Canvas>

          {active && (
            <div className="loader" role="status">
              <span />
              Loading vehicle
            </div>
          )}

          <div className="hint">Drag to rotate · Scroll to zoom</div>
        </div>

        <aside className="panel">
          <div>
            <p className="eyebrow">Vehicle studio</p>
            <h1>Make it yours.</h1>
            <p className="intro">
              Explore the model in 3D and preview different paint finishes in real time.
            </p>
          </div>

          <div className="spec-row">
            <div>
              <span>MODEL</span>
              <strong>Toyota</strong>
            </div>
            <div>
              <span>VEHICLE</span>
              <strong>Camry 2026</strong>
            </div>
          </div>

          <div className="control-block">
            <div className="control-heading">
              <div>
                <span className="label">Exterior paint</span>
                <strong>{colors.find((item) => item.value === color)?.name}</strong>
              </div>
              <span className="hex">{color.toUpperCase()}</span>
            </div>

            <div className="swatches" role="group" aria-label="Car paint colors">
              {colors.map((item) => (
                <button
                  key={item.value}
                  aria-label={item.name}
                  title={item.name}
                  aria-pressed={item.value === color}
                  className={`swatch ${item.value === color ? 'active' : ''}`}
                  onClick={() => setColor(item.value)}
                >
                  <span style={{ background: item.value }} />
                </button>
              ))}
            </div>

            <label className="custom-color">
              <span>Custom color</span>
              <input
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                aria-label="Choose a custom paint color"
              />
            </label>
          </div>

          <div className="note">
            <span className="note-dot" />
            <p>
              This demo recolors the red pixels baked into your uploaded texture. For production, separate the body paint into its own material for cleaner results.
            </p>
          </div>

          <button className="primary-button" onClick={() => setColor(colors[0].value)}>
            Reset configuration
          </button>
        </aside>
      </section>
    </main>
  )
}
