import React, {
    useEffect,
    useMemo
} from 'react'

import {
    useLoader
} from '@react-three/fiber'

import * as THREE from 'three'

import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader'

import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader'

import {
    SkeletonUtils
} from 'three/examples/jsm/Addons.js'

import state from '../state'

function GltfModel({ car }) {

    const gltf = useLoader(
        GLTFLoader,
        car.model,
        (loader) => {

            const dracoLoader =
                new DRACOLoader()

            dracoLoader.setDecoderPath(
                '/draco/'
            )

            loader.setDRACOLoader(
                dracoLoader
            )
        }
    )

    // VERY IMPORTANT
    // CLONE CACHED GLTF
    const scene = useMemo(() => {

        return SkeletonUtils.clone(
            gltf.scene
        )

    }, [gltf])

    useEffect(() => {

        if (!scene) return

        const paintMeshes = []

        scene.traverse((child) => {

            if (!child.isMesh) return

            child.castShadow = true
            child.receiveShadow = true

            if (!child.material) return

            // CLONE MATERIAL
            child.material =
                child.material.clone()

            const texture =
                child.material.map

            if (texture) {

                texture.flipY = false

                texture.colorSpace =
                    THREE.SRGBColorSpace

                if (
                    texture.name.includes(
                        car.paintKeyword
                    )
                ) {

                    paintMeshes.push(child)
                }
            }

            child.material.metalness =
                0.8

            child.material.roughness =
                0.35
        })

        state.cars[car.id] = {

            id: car.id,

            scene,

            paintMeshes,

            textures: car.textures,

            cameraPos:
                new THREE.Vector3(
                    ...car.cameraPos
                ),

            cameraTarget:
                new THREE.Vector3(
                    ...car.cameraTarget
                )
        }

        state.activeCar = car.id

        state.cameraPos.set(
            ...car.cameraPos
        )

        state.cameraTarget.set(
            ...car.cameraTarget
        )

        state.shouldCameraUpdate =
            true

        return () => {

            delete state.cars[car.id]
        }

    }, [scene, car])

    return (

        <primitive
            object={scene}
            scale={car.scale}
            rotation={car.rotation}
            position={car.positions ? car.positions : [0,0,0]}
        />

    )
}

export default GltfModel