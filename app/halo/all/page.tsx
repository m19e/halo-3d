"use client"

import Image from "next/image"
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

const useCanvas = (): [
  RefObject<HTMLCanvasElement>,
  { save: (id: string) => void },
] => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a")
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const save = (id: string) => {
    const uri = canvasRef.current?.toDataURL()
    if (uri) {
      // const fileName = `halo-${Date.now().toString(16)}.png`
      const fileName = `${id}-${Date.now().toString(16)}.png`
      downloadURI(uri, fileName)
    }
  }

  return [canvasRef, { save }]
}

const STUDENTS = {
  hoshino: "ホシノ",
  nonomi: "ノノミ",
  shiroko: "シロコ",
  serika: "セリカ",
  ayane: "アヤネ",
  hina: "ヒナ",
  ako: "アコ",
  iori: "イオリ",
  chinatsu: "チナツ",
  aru: "アル",
  kayoko: "カヨコ",
  haruka: "ハルカ",
  mutsuki: "ムツキ",
} as const

type StudentID = keyof typeof STUDENTS

export default function All() {
  const [haloID, setHaloID] = useState<StudentID>("hoshino")
  const [canvasRef, { save }] = useCanvas()

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <div className="bg-triangle min-h-screen">
          <h1>#ブルアカ #ヘイロー #3D</h1>
          <label htmlFor="my-drawer" className="btn-primary drawer-button btn">
            Open drawer
          </label>

          <div className="flex flex-col items-center gap-4">
            <div className="rounded-box h-80 w-80 bg-slate-800">
              <Canvas
                key={haloID}
                ref={canvasRef}
                camera={{ position: [0, 0, 1] }}
                gl={{ preserveDrawingBuffer: true }}
              >
                <Halo id={haloID} />
              </Canvas>
            </div>
            <button className="btn" onClick={() => save(haloID)}>
              save
            </button>

            <div className="bg-white p-1">
              <div className="grid grid-cols-6 gap-2 rounded bg-gray-200 p-2">
                {Object.entries(STUDENTS).map(([id, name]) => (
                  <div
                    key={id}
                    className="rounded-box flex cursor-pointer flex-col gap-2 bg-white p-1 shadow-md"
                    onClick={() => setHaloID(id as StudentID)}
                  >
                    <Image
                      className="rounded-box relative aspect-square h-16 w-16 bg-slate-800"
                      src={`/thumbnail/${id}.png`}
                      alt={`${id} thumbnail`}
                      width={480}
                      height={480}
                      priority
                    />
                    <span className="bg-slate-600 text-center text-sm text-white">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu h-full w-80 overflow-y-auto bg-base-200 p-4 text-base-content">
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
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
