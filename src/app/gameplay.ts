import * as BABYLON from 'babylonjs'
import { Block } from './models/block'

export class Gameplay {
    private _scene: BABYLON.Scene
    private _wallHeight: number

    constructor(scene: BABYLON.Scene, wallHeight:number) {
        this._scene = scene
        this._wallHeight = wallHeight
    }


    generateBlock(): Block {
        let mat = new BABYLON.StandardMaterial('', this._scene)
        mat.diffuseColor = new BABYLON.Color3(1, 1, 0)

        let generateNumber = (min: number, max: number): number => {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        // Block
        // let block = new Block({ mat: mat, scene: this._scene, size: new BABYLON.Vector3(generateNumber(1, 4), generateNumber(1, 4), generateNumber(1, 4)), weight: 10, })
        let block = new Block(
            {
                mat: mat,
                scene: this._scene,
                size: new BABYLON.Vector3(1, 1, 1),
                spawnPoint: new BABYLON.Vector3(0, this._wallHeight - 1, 0),
                weight: 10,
            },
        )

        return block
    }
}