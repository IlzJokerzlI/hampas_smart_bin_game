import * as BABYLON from 'babylonjs'
import { Block } from './models/block'

export class Gameplay {
    private _scene: BABYLON.Scene

    constructor(scene: BABYLON.Scene) {
        this._scene = scene
    }


    generateBlock(): Block {
        let mat = new BABYLON.StandardMaterial('', this._scene)
        mat.diffuseColor = new BABYLON.Color3(1, 1, 0)

        // Block
        let block = new Block({mat: mat, scene: this._scene, size: new BABYLON.Vector3(1,1,1), weight: 10})

        return block
    }
}