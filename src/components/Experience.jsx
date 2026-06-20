import { Environment } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

import Particles from './Particles'
import Road from './Road'

const GRID_LENGTH = 160

export const Experience = ({ isTurboRef, targetMouseX }) => {
  const { camera } = useThree()

  const roadRef = useRef()
  const synthSun = useRef()
  const skyStars = useRef()

  const turboProgress = useRef(0)

  const {
    baseSpeed,
    turboBoost,
    particleCount,
    roadCruise,
    roadTurbo,
    starCruise,
    starTurbo,
    sunCruise,
    sunTurbo,
  } = useControls('Cyber Drive', {
    baseSpeed: { value: 0.35, min: 0, max: 2, step: 0.01 },
    turboBoost: { value: 4.15, min: 0, max: 12, step: 0.05 },
    particleCount: { value: 1200, min: 100, max: 4000, step: 100 },
    roadCruise: '#ff00aa',
    roadTurbo: '#ffaa00',
    starCruise: '#00ffff',
    starTurbo: '#ff0055',
    sunCruise: '#ffaa00',
    sunTurbo: '#ff0055',
  })

  const colors = useMemo(
    () => ({
      roadCruise: new THREE.Color(roadCruise),
      roadTurbo: new THREE.Color(roadTurbo),
      starCruise: new THREE.Color(starCruise),
      starTurbo: new THREE.Color(starTurbo),
      sunCruise: new THREE.Color(sunCruise),
      sunTurbo: new THREE.Color(sunTurbo),
    }),
    [roadCruise, roadTurbo, starCruise, starTurbo, sunCruise, sunTurbo],
  )

  const { positions, starData } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const starData = new Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 120
      const y = Math.random() * 40 - 2
      const z = Math.random() * -200

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      starData[i] = { x, y, z, speed: 0.5 + Math.random() * 1.2 }
    }

    return { positions, starData }
  }, [particleCount])

  useFrame((state) => {
    const road = roadRef.current
    if (!road?.sector1 || !road?.sector2 || !skyStars.current) return

    const elapsedTime = state.clock.getElapsedTime()
    const isTurbo = isTurboRef.current

    turboProgress.current = THREE.MathUtils.lerp(
      turboProgress.current,
      isTurbo ? 1 : 0,
      isTurbo ? 0.05 : 0.07,
    )
    const t = turboProgress.current

    road.material.color.lerpColors(colors.roadCruise, colors.roadTurbo, t)

    const starMat = skyStars.current.material
    starMat.color.lerpColors(colors.starCruise, colors.starTurbo, t)
    starMat.opacity = THREE.MathUtils.lerp(0.6, 0.9, t)

    const sunMat = synthSun.current.material
    sunMat.color.lerpColors(colors.sunCruise, colors.sunTurbo, t)

    // Infinite scroll (recycle a sector once it passes the camera)
    const currentSpeed = baseSpeed + t * turboBoost
    road.sector1.position.z += currentSpeed
    road.sector2.position.z += currentSpeed

    if (road.sector1.position.z > GRID_LENGTH / 2) {
      road.sector1.position.z = road.sector2.position.z - GRID_LENGTH
    }
    if (road.sector2.position.z > GRID_LENGTH / 2) {
      road.sector2.position.z = road.sector1.position.z - GRID_LENGTH
    }

    // Particles (recycle to the horizon once behind the camera)
    const posAttr = skyStars.current.geometry.attributes.position
    const pArr = posAttr.array

    for (let i = 0; i < starData.length; i++) {
      const data = starData[i]
      const idx = i * 3

      data.z += data.speed * (1 + t * 15)

      if (data.z > 4) {
        data.z = -200
        data.x = (Math.random() - 0.5) * 120
        data.y = Math.random() * 40 - 2
      }

      pArr[idx] = data.x
      pArr[idx + 1] = data.y
      pArr[idx + 2] = data.z
    }
    posAttr.needsUpdate = true

    const sunPulse = 1 + Math.sin(elapsedTime * 4) * 0.03 * (1 + t * 2)
    synthSun.current.scale.set(sunPulse, sunPulse, 1)

    const steer = targetMouseX.current
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      steer * 12,
      0.05,
    )
    camera.rotation.z = THREE.MathUtils.lerp(
      camera.rotation.z,
      -steer * 0.35,
      0.05,
    )
    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      -steer * 0.15,
      0.05,
    )

    if (isTurbo) {
      camera.position.x += (Math.random() - 0.5) * 0.05 * t
      camera.position.y = 1.5 + (Math.random() - 0.5) * 0.05 * t
    } else {
      camera.position.y = 1.5
    }
  })

  return (
    <>
      <Environment preset='sunset' />

      {/* Road */}
      <Road ref={roadRef} color={roadCruise} />

      {/* Sun */}
      <mesh position={[0, 8, -140]} ref={synthSun}>
        <circleGeometry args={[14, 32]} />
        <meshBasicMaterial color={sunCruise} side={THREE.DoubleSide} />
      </mesh>

      {/* Particles */}
      <Particles
        ref={skyStars}
        key={particleCount}
        positions={positions}
        count={particleCount}
        color={starCruise}
      />
    </>
  )
}
