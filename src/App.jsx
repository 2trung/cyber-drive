import { Canvas, extend } from '@react-three/fiber'
import { Leva } from 'leva'
import * as THREE from 'three/webgpu'

import { Experience } from './components/Experience'
import { useDriveInput } from './hooks/useDriveInput'

function App() {
  const { isTurbo, isTurboRef, targetMouseX } = useDriveInput()

  return (
    <>
      <div className='pointer-events-none absolute left-10 top-10 z-10 text-[#ff00aa] [text-shadow:0_0_10px_rgba(255,0,170,0.4)]'>
        <h1 className='m-0 text-[22px] font-black tracking-[2px]'>
          HORIZON_DRIVE_v30.0
        </h1>
        <div
          className={`mt-2 text-[13px] transition-colors duration-300 ${
            isTurbo
              ? 'text-[#ffaa00] [text-shadow:0_0_10px_#ffaa00]'
              : 'text-[#00ffff] [text-shadow:0_0_8px_#00ffff]'
          }`}
        >
          {isTurbo
            ? '> DRIVE_STATUS: TURBO_SPEED // WARP_DRIVE ENGAGED'
            : '> DRIVE_MODE: CRUISE // SPEED: 90 KM/H'}
        </div>
      </div>

      <div className='pointer-events-none absolute bottom-10 left-1/2 z-10 w-full -translate-x-1/2 text-center text-[11px] tracking-[3px] text-white/40'>
        HOLD{' '}
        <span className='animate-pulse font-bold text-[#00ffff]'>
          LEFT CLICK
        </span>{' '}
        TO ENGAGE HYPER-DRIVE TURBO
      </div>

      <Leva collapsed />

      <Canvas
        style={{ width: '100vw', height: '100dvh' }}
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [0, 1.5, 10], fov: 60, near: 0.1, far: 1000 }}
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
        <Experience isTurboRef={isTurboRef} targetMouseX={targetMouseX} />
      </Canvas>
    </>
  )
}

export default App
