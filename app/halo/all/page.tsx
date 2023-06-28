"use client"

import { Suspense, useState } from "react"
import {
  OrbitControls,
  useFBX,
  Stage,
  Html,
  useProgress,
  PerspectiveCamera,
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

const students = [
  { id: "hina", name: "ヒナ" },
  { id: "ako", name: "アコ" },
  { id: "iori", name: "イオリ" },
  { id: "chinatsu", name: "チナツ" },
]

export default function All() {
  const [haloID, setHaloID] = useState("hoshino")

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
        <Halo key={haloID} id={haloID} />
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
  return (
    <div className="rounded-box h-80 w-80 bg-slate-800">
      <Canvas>
        <Suspense fallback={<Loader />}>
          <Stage shadows="accumulative">
            <Scene id={id} />
          </Stage>
          <PerspectiveCamera />
          <OrbitControls enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}

const Scene = ({ id }: HaloProps) => {
  const fbx = useFBX(`/halo/${id}.fbx`)

  return <primitive object={fbx} scale={0.01} />
}
