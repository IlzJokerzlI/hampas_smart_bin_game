import * as BABYLON from 'babylonjs'

export class Gameplay {
    private _scene: BABYLON.Scene

    constructor(scene: BABYLON.Scene) {
        this._scene = scene
    }


    generateBlock(): BABYLON.Mesh {
        // Block
        let block = BABYLON.MeshBuilder.CreateBox('block', { height: 1, width: 1, depth: 1, }, this._scene)
        block.enableEdgesRendering()
        block.edgesColor = new BABYLON.Color4(1, 1, 1, 1)
        block.position = new BABYLON.Vector3(0, 15, 0)
        block.ellipsoid = new BABYLON.Vector3(0.4999, 0.4999, 0.4999)
        block.checkCollisions = true;

        // Material
        let mat = new BABYLON.StandardMaterial('', this._scene)
        mat.diffuseColor = new BABYLON.Color3(1, 1, 0)
        block.material = mat

        return block
    }
}