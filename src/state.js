import * as THREE from 'three'

const state = {

    cars: {},

    activeCar: 'mustang',
    paintType: 'metallic',
    cameraPos: new THREE.Vector3(1,3,4),
    cameraTarget: new THREE.Vector3(0,0,0),
    shouldCameraUpdate: true,
}

export default state

