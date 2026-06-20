import React, { useImperativeHandle, useMemo, useRef } from 'react'
import { positionLocal, normalLocal, abs, sin, cos } from 'three/tsl'
import { Color, MeshStandardNodeMaterial } from 'three/webgpu'

const GRID_WIDTH = 90
const GRID_LENGTH = 160
const SEGMENTS = 40

const Road = React.forwardRef(({ color = '#ff00aa' }, ref) => {
  const sector1 = useRef(null)
  const sector2 = useRef(null)

  const material = useMemo(() => {
    const mat = new MeshStandardNodeMaterial()

    const x = positionLocal.x
    const y = positionLocal.y

    const waveHeight = sin(y.mul(0.15))
      .mul(5)
      .add(cos(x.mul(0.3)).mul(3.5))
    const mountainHeight = abs(waveHeight)
    const roadMask = abs(x).greaterThan(14)

    mat.positionNode = positionLocal.add(
      normalLocal.mul(roadMask.select(mountainHeight, 0)),
    )
    mat.wireframe = true
    mat.color = new Color(color)
    mat.transparent = true
    mat.opacity = 0.5

    return mat
  }, [])

  useImperativeHandle(ref, () => ({
    sector1: sector1.current,
    sector2: sector2.current,
    material,
  }))

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -80]}
        ref={sector1}
      >
        <planeGeometry args={[GRID_WIDTH, GRID_LENGTH, SEGMENTS, SEGMENTS]} />
        <primitive object={material} attach='material' />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -240]}
        ref={sector2}
      >
        <planeGeometry args={[GRID_WIDTH, GRID_LENGTH, SEGMENTS, SEGMENTS]} />
        <primitive object={material} attach='material' />
      </mesh>
    </>
  )
})

export default Road
