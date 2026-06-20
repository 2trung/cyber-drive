import { Canvas, extend } from '@react-three/fiber'
import { Experience } from './components/Experience'

import * as THREE from 'three/webgpu'

function App() {
  return (
    <Canvas
      style={{ width: '100vw', height: '100dvh' }}
      dpr={[1, 1.5]}
      shadows
      camera={{ position: [0, 1.5, 0], fov: 60, near: 0.1, far: 1000 }}
      gl={async (props) => {
        extend(THREE)

        const renderer = new THREE.WebGPURenderer(props)

        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.3

        await renderer.init()

        return renderer
      }}
    >
      <fogExp2 attach='fog' args={[0x010103, 0.015]} />
      <Experience />
    </Canvas>
  )
}

export default App
