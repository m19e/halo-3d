"use client"

import { Suspense, useState, useRef } from "react"
import type { RefObject } from "react"
import {
  OrbitControls,
  useFBX,
  Stage,
  Html,
  useProgress,
  PerspectiveCamera,
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

const useCanvas = (): [RefObject<HTMLCanvasElement>, { save: () => void }] => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a")
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const save = () => {
    const uri = canvasRef.current?.toDataURL()
    if (uri) {
      const fileName = `halo-${Date.now().toString(16)}.png`
      downloadURI(uri, fileName)
    }
  }

  return [canvasRef, { save }]
}

const students = [
  { id: "hina", name: "ヒナ" },
  { id: "ako", name: "アコ" },
  { id: "iori", name: "イオリ" },
  { id: "chinatsu", name: "チナツ" },
]

export default function All() {
  const [haloID, setHaloID] = useState("hoshino")
  const [canvasRef, { save }] = useCanvas()

  const options = students.map(s => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))

  return (
    <div className="min-h-screen">
      <h1>#ブルアカ #ヘイロー #3D</h1>
      <div className="flex flex-col items-center gap-4">
        <select
          className="select min-w-[8rem]"
          onChange={e => setHaloID(e.currentTarget.value)}
        >
          <option value="hoshino">ホシノ</option>
          <option value="nonomi">ノノミ</option>
          <option value="shiroko">シロコ</option>
          <option value="serika">セリカ</option>
          <option value="ayane">アヤネ</option>
          {options}
        </select>
        <div className="rounded-box h-80 w-80 bg-slate-800">
          <Canvas
            ref={canvasRef}
            camera={{ position: [0, 0, 1] }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <Halo key={haloID} id={haloID} />
          </Canvas>
        </div>
        <button className="btn" onClick={save}>
          save
        </button>
      </div>
    </div>
  )
}

const Loader = () => {
  const { progress } = useProgress()
  return (
    <Html center>
      <span className="loading loading-ring loading-lg text-info"></span>
    </Html>
  )
}

type HaloProps = {
  id: string
}
const Halo = ({ id }: HaloProps) => {
  // const { camera, controls } = useThree()
  // const [rotation, setRotation] = useControls(() => ({
  //   x: { value: 0, min: -12, max: 12, steps: 0.1 },
  //   y: { value: 0, min: -12, max: 12, steps: 0.1 },
  //   z: { value: 1, min: 1, max: 3, steps: 0.1 },
  // }))

  // useEffect(() => {
  //   const { x, y, z } = rotation
  //   camera.position.set(x, y, z)
  // }, [rotation])

  return (
    <Suspense fallback={<Loader />}>
      <Stage shadows="accumulative">
        <Scene id={id} />
      </Stage>
      <PerspectiveCamera />
      <OrbitControls enablePan={false} minDistance={1} maxDistance={7} />
    </Suspense>
  )
}

const Scene = ({ id }: HaloProps) => {
  const fbx = useFBX(`/halo/${id}.fbx`)

  return <primitive object={fbx} scale={0.01} />
}
