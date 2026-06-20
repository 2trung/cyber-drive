import { Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Particles from './Particles'
import Road from './Road'

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Environment preset='sunset' />

      {/* Road */}
      <Road />

      {/* Sun */}
      <mesh position={[0, 8, -140]}>
        <circleGeometry args={[14, 32]} />
        <meshBasicMaterial color={0xffaa00} side={THREE.DoubleSide} />
      </mesh>

      {/* Particles */}
      <Particles />
    </>
  )
}
