import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type CarModelProps = {
  color: string
}

type PaintMaterial = THREE.MeshStandardMaterial & {
  userData: {
    sourceTexture?: THREE.Texture
  }
}

function hexToRgb01(hex: string) {
  const normalized = hex.replace('#', '')
  const n = Number.parseInt(normalized, 16)
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
  }
}

function recolorRedTexture(texture: THREE.Texture, color: string) {
  const image = texture.image as CanvasImageSource | undefined
  if (!image) return texture

  const width = (image as { width?: number }).width ?? 0
  const height = (image as { height?: number }).height ?? 0
  if (!width || !height) return texture

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return texture

  ctx.drawImage(image, 0, 0, width, height)
  const pixels = ctx.getImageData(0, 0, width, height)
  const data = pixels.data
  const target = hexToRgb01(color)

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255
    const g = data[i + 1] / 255
    const b = data[i + 2] / 255

    const maxGb = Math.max(g, b)
    const redness = r - maxGb
    const saturation = Math.max(r, g, b) - Math.min(r, g, b)

    if (r > 0.18 && redness > 0.07 && saturation > 0.08) {
      const strength = Math.min(1, Math.max(0, (redness - 0.07) / 0.28))
      const luminance = Math.max(0.08, 0.299 * r + 0.587 * g + 0.114 * b)
      const scale = Math.min(1.9, 0.5 + luminance * 1.35)

      const nr = Math.min(1, target.r * scale)
      const ng = Math.min(1, target.g * scale)
      const nb = Math.min(1, target.b * scale)

      data[i] = Math.round((r * (1 - strength) + nr * strength) * 255)
      data[i + 1] = Math.round((g * (1 - strength) + ng * strength) * 255)
      data[i + 2] = Math.round((b * (1 - strength) + nb * strength) * 255)
    }
  }

  ctx.putImageData(pixels, 0, 0)
  const result = new THREE.CanvasTexture(canvas)
  result.flipY = texture.flipY
  result.colorSpace = texture.colorSpace
  result.wrapS = texture.wrapS
  result.wrapT = texture.wrapT
  result.magFilter = texture.magFilter
  result.minFilter = texture.minFilter
  result.anisotropy = texture.anisotropy
  result.needsUpdate = true
  return result
}

export function CarModel({ color }: CarModelProps) {
  const { scene } = useGLTF('/models/sample.glb')
  const group = useRef<THREE.Group>(null)

  const model = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return

      if (Array.isArray(object.material)) {
        object.material = object.material.map((material) => material.clone())
      } else if (object.material) {
        object.material = object.material.clone()
      }

      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial && material.map) {
          const paintMaterial = material as PaintMaterial
          paintMaterial.userData.sourceTexture = material.map
        }
      })

      object.castShadow = true
      object.receiveShadow = true
    })

    return clone
  }, [scene])

  useEffect(() => {
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      const materials = Array.isArray(object.material) ? object.material : [object.material]

      materials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return
        const paintMaterial = material as PaintMaterial
        const source = paintMaterial.userData.sourceTexture
        if (!source) return

        const previous = paintMaterial.map
        const next = recolorRedTexture(source, color)
        paintMaterial.map = next
        paintMaterial.needsUpdate = true

        if (previous && previous !== source) previous.dispose()
      })
    })
  }, [model, color])

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload('/models/sample.glb')
