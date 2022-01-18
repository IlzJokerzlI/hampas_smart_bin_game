import * as BABYLON from 'babylonjs'
import { double } from "babylonjs/types";

interface Params {
    mat: BABYLON.StandardMaterial
    scene: BABYLON.Scene
    size: BABYLON.Vector3
    weight: double
}

export class Block {
    shape: BABYLON.Mesh
    weight: double
    constructor(params: Params) {
        const size = params.size

        this.shape = BABYLON.MeshBuilder.CreateBox('this.shape', { width: size.x, height: size.y, depth: size.z }, params.scene)
        this.shape.enableEdgesRendering()
        this.shape.edgesColor = new BABYLON.Color4(1, 1, 1, 1)
        this.shape.position = new BABYLON.Vector3(0, 15, 0)
        this.shape.ellipsoid = size.divide(new BABYLON.Vector3(2, 2, 2)).subtract(new BABYLON.Vector3(0.001, 0.001, 0.001))
        this.shape.checkCollisions = true;
        this.shape.material = params.mat

        this.weight = params.weight
    }
}