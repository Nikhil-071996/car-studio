import { useTexture } from "@react-three/drei";
import { RepeatWrapping } from "three";

export default function ShowroomFloor() {
  const textures = useTexture({
    map: "/textures/garage_floor/floor.jpg",
    aoMap: "/textures/garage_floor/floorao.png",
    roughnessMap: "/textures/garage_floor/garage_floor_rough.jpg",
    normalMap: "/textures/garage_floor/garage_floor_nor_gl.jpg",
    displacementMap: "/textures/garage_floor/garage_floor_disp.jpg",
  });

  Object.values(textures).forEach((tex) => {
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(20, 20);
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      receiveShadow
    >
      {/* subdivisions needed for displacement */}
      <planeGeometry args={[1000, 1000, 256, 256]} />

      <meshStandardMaterial
        map={textures.map}
        aoMap={textures.aoMap}
        roughnessMap={textures.roughnessMap}
        normalMap={textures.normalMap}
        displacementMap={textures.displacementMap}
        displacementScale={0.02}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}