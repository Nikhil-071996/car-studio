import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from 'three'
import ShowroomFloor from "./components/ShowroomFloor";
import { Suspense, useState } from "react";
import { CARS } from './config/carsConfig'
import CarControls from "./components/CarControls";
import GltfModel from "./components/GltfModel";
import Loader from "./components/Loader";
import state from "./state";
import './App.css'


const textureCache = {}

function App() {

  const [carIndex, setCarIndex] = useState(0)
  const currentCar = CARS[carIndex]

  const loadTexture = async (path) => {
    if (textureCache[path]) {
      return textureCache[path]
    }
    const loader = new THREE.TextureLoader()
    const texture = await loader.loadAsync(path)
    textureCache[path] = texture
    return texture
  }

  const handelColorChange = async (e) => {
    const clickedColor = e.target.style.backgroundColor
    const activeCar = state.cars[state.activeCar]
    if (!activeCar) return

    const texturePath = activeCar.textures[clickedColor]

    if (!texturePath) return

    const selectedTexture = await loadTexture(texturePath)

    activeCar.paintMeshes.forEach((mesh) => {

      const oldMap = mesh.material.map
      const texture = selectedTexture.clone()
      
      texture.flipY = oldMap.flipY
      texture.colorSpace = oldMap.colorSpace
      texture.wrapS = oldMap.wrapS
      texture.wrapT = oldMap.wrapT

      texture.repeat.copy(oldMap.repeat)
      texture.offset.copy(oldMap.offset)
      texture.center.copy(oldMap.center)
      texture.rotation = oldMap.rotation
      texture.needsUpdate = true
      mesh.material.map = texture
      mesh.material.needsUpdate = true
    })
  }
  return (
    <div
      style={{
        background: "#000",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      
            <div style={{ position: "absolute", zIndex: 10, top: 30 }} >
              {
                  Object.keys(currentCar.textures).map((color) => (
                      <div
                          key={color}
                          onClick={handelColorChange}
                          style={{backgroundColor:color,width: 50,height: 50,marginBottom: 10,cursor: 'pointer'}}
                      />
                  ))
              }

            </div>
            <CarControls currentCar={currentCar}  setCarIndex={setCarIndex} />
        <Canvas
          shadows
          camera={{
            position: [3, 3, 4],
            fov: 45,
          }}
        >
        {/* HDR Environment */}
        <Environment files="/hdr/whitestudio.exr" background />

        {/* Product / Car Model */}
        <Suspense
          allback={<Loader />}
        >
          <GltfModel
              key={
                  currentCar.id
              }
              car={currentCar}
          />
        </Suspense>

        {/* Contact shadow */}
        <ContactShadows
          position={[0, -1.01, 0]}
          opacity={0.8}
          scale={15}
          blur={2.5}
          far={10}
        />

        {/* Reflective showroom floor */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#424242"
          />
        </mesh>
        

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          target={[0, 0, 0]}
          minPolarAngle={Math.PI / 3} // 60°
          maxPolarAngle={Math.PI / 2} // 90°
          minDistance={4}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
}

export default App;