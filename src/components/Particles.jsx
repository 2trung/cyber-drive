import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 1200

const Particles = () => {
  const pointsRef = useRef()

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const speeds = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120
      positions[i * 3 + 1] = Math.random() * 40 - 2
      positions[i * 3 + 2] = Math.random() * -200
      speeds[i] = 0.5 + Math.random() * 1.2
    }
    return { positions, speeds }
  }, [])

  useFrame((_, delta) => {
    const geo = pointsRef.current.geometry
    const pos = geo.attributes.position.array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 2] += speeds[i] * delta * 20
      if (pos[i * 3 + 2] > 4) {
        pos[i * 3 + 2] = -200
        pos[i * 3] = (Math.random() - 0.5) * 120
        pos[i * 3 + 1] = Math.random() * 40 - 2
      }
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0x00ffff}
        size={0.08}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
export default Particles
