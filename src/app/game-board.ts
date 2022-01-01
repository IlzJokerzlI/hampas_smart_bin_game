import * as BABYLON from 'babylonjs'
import { GridMaterial } from 'babylonjs-materials'
import { RadRotVect } from './utils'

interface Wall {
    name: string
    xPos: number
    yPos: number
    zPos: number
    yRot: number
}

export class GameBoard {
    private _scene: BABYLON.Scene
    private _groundSide: number
    private _wallHeight: number

    constructor(scene: BABYLON.Scene, { size = 11 }) {
        this._scene = scene
        this._groundSide = size
        this._wallHeight = size * 2
        this._create()
    }

    private _createGridMat(): GridMaterial {
        const mat = new GridMaterial('grid', this._scene)
        mat.majorUnitFrequency = 0
        mat.gridOffset = new BABYLON.Vector3(0.5, 0, 0.5)
        mat.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0)
        mat.mainColor = new BABYLON.Color3(1.0, 1.0, 1.0)
        mat.opacity = 0.99
        return mat
    }

    private _create() {
        const mat = this._createGridMat()
        const wallsData = [
            <Wall>{ name: 'fWall', xPos: 0, yPos: this._wallHeight / 2 - 0.5, zPos: this._groundSide / 2, yRot: 0 },
            <Wall>{ name: 'bWall', xPos: 0, yPos: this._wallHeight / 2 - 0.5, zPos: -this._groundSide / 2, yRot: 180 },
            <Wall>{ name: 'lWall', xPos: -this._groundSide / 2, yPos: this._wallHeight / 2 - 0.5, zPos: 0, yRot: 270 },
            <Wall>{ name: 'rWall', xPos: this._groundSide / 2, yPos: this._wallHeight / 2 - 0.5, zPos: 0, yRot: 90 },
        ]

        // Ground
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: this._groundSide, height: this._groundSide, subdivisions: this._groundSide }, this._scene)
        ground.material = mat
        ground.position = new BABYLON.Vector3(0, -0.5, 0)

        // Lid
        const lid = BABYLON.MeshBuilder.CreatePlane('lid', { width: this._groundSide, height: this._groundSide }, this._scene)
        lid.position = new BABYLON.Vector3(0, this._wallHeight - 0.5, 0)
        lid.rotation = RadRotVect({ x: 90 })
        lid.checkCollisions = true
        lid.visibility = 0

        // Walls
        wallsData.forEach((v) => {
            // Graphical wall
            let wall = BABYLON.MeshBuilder.CreatePlane(v.name, { width: this._groundSide, height: this._wallHeight }, this._scene)
            wall.position = new BABYLON.Vector3(v.xPos, v.yPos, v.zPos)
            wall.rotation = RadRotVect({ y: v.yRot })
            wall.material = mat

            // Collision
            if (this._scene.collisionsEnabled) {
                let wallCollision = BABYLON.MeshBuilder.CreatePlane(v.name, { width: this._groundSide, height: this._wallHeight, sideOrientation: BABYLON.Mesh.BACKSIDE }, this._scene)
                wallCollision.position = new BABYLON.Vector3(v.xPos, v.yPos, v.zPos)
                wallCollision.rotation = RadRotVect({ y: v.yRot })
                wallCollision.checkCollisions = true
                wallCollision.visibility = 0
            }
        })
    }
}