import * as BABYLON from 'babylonjs'
import { double } from 'babylonjs/types';


interface Params {
    mat?: BABYLON.StandardMaterial
    scene: BABYLON.Scene
    size: BABYLON.Vector3
    spawnPoint: BABYLON.Vector3
    weight: double
    texture?: BABYLON.Texture
}


export class Block {
    shape: BABYLON.Mesh
    weight: double

    constructor(params: Params) {
        const size = params.size

        this.shape = BABYLON.MeshBuilder.CreateBox('this.shape', { width: size.x, height: size.y, depth: size.z }, params.scene)
        this.shape.enableEdgesRendering()
        this.shape.edgesColor = new BABYLON.Color4(1, 1, 1, 1)
        this.shape.edgesWidth = 10
        this.shape.position = params.spawnPoint
        this.shape.ellipsoid = size.divide(new BABYLON.Vector3(2, 2, 2)).subtract(new BABYLON.Vector3(0.001, 0.001, 0.001))
        this.shape.checkCollisions = true;

        // Materials
        if (params.texture != undefined) {
            const texMat = new BABYLON.StandardMaterial('trashTexture', params.scene);
            texMat.diffuseTexture = params.texture
            this.shape.material = texMat
        } else if (params.mat != undefined) {
            this.shape.material = params.mat
        }

        this.weight = params.weight
    }
}