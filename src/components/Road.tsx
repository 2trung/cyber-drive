import { positionLocal, normalLocal, abs, sin, cos } from 'three/tsl'
import { Color, MeshStandardNodeMaterial } from 'three/webgpu'

const Road = () => {
  const material = new MeshStandardNodeMaterial()
  const x = positionLocal.x
  const y = positionLocal.y
  const waveHeight = sin(y.mul(0.15))
    .mul(5)
    .add(cos(x.mul(0.3)).mul(3.5))
  const mountainHeight = abs(waveHeight)
  const roadMask = abs(x).greaterThan(14)
  material.positionNode = positionLocal.add(
    normalLocal.mul(roadMask.select(mountainHeight, 0)),
  )
  material.wireframe = true
  material.color = new Color('#ff00aa')
  material.transparent = true
  material.opacity = 0.5
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -80]}>
        <planeGeometry args={[90, 160, 40, 40]} />
        <primitive object={material} attach='material' />
      </mesh>

      <mesh position={[0, 0, -240]}>
        <planeGeometry args={[90, 160, 40, 40]} />
        <primitive object={material} attach='material' />
      </mesh>
    </>
  )
}

export default Road
