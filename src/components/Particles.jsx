import { useRef } from 'react'
import * as THREE from 'three'

const Particles = ({ ref, positions, count, color = '#00ffff' }) => {
  const innerRef = useRef()
  const pointsRef = ref ?? innerRef

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.08}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default Particles
