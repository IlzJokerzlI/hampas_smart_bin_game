import * as BABYLON from 'babylonjs'
import { GridMaterial } from 'babylonjs-materials'
import { RadRotVect } from './utils'

interface Wall {
    side: string
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

    private _createGridMat(name: string, { gridOffset = new BABYLON.Vector3(0.5, 0, 0.5) }): GridMaterial {
        const mat = new GridMaterial('grid', this._scene)
        mat.majorUnitFrequency = 0
        mat.gridOffset = gridOffset
        mat.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0)
        mat.mainColor = new BABYLON.Color3(1.0, 1.0, 1.0)
        mat.opacity = 0.99
        return mat
    }

    private _create() {
        const wallsData = [
            <Wall>{ side: 'f', xPos: 0, yPos: this._wallHeight / 2 - 0.5, zPos: this._groundSide / 2, yRot: 0 },
            <Wall>{ side: 'b', xPos: 0, yPos: this._wallHeight / 2 - 0.5, zPos: -this._groundSide / 2, yRot: 180 },
            <Wall>{ side: 'l', xPos: -this._groundSide / 2, yPos: this._wallHeight / 2 - 0.5, zPos: 0, yRot: 270 },
            <Wall>{ side: 'r', xPos: this._groundSide / 2, yPos: this._wallHeight / 2 - 0.5, zPos: 0, yRot: 90 },
        ]

        // Ground
        const ground = BABYLON.MeshBuilder.CreatePlane('ground', { size: this._groundSide, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, this._scene)
        ground.material = this._createGridMat('groundMat', { gridOffset: new BABYLON.Vector3(0.5, 0.5, 0) })
        ground.position = new BABYLON.Vector3(0, -0.5, 0)
        ground.rotation = RadRotVect({ x: 90 })
        ground.checkCollisions = true

        // Lid
        const lid = BABYLON.MeshBuilder.CreatePlane('lid', { size: this._groundSide }, this._scene)
        lid.position = new BABYLON.Vector3(0, this._wallHeight - 0.5, 0)
        lid.rotation = RadRotVect({ x: 90 })
        lid.checkCollisions = true
        lid.visibility = 0

        // Walls
        wallsData.forEach((v) => {
            // Graphical wall
            let wall = BABYLON.MeshBuilder.CreatePlane(v.side + 'Wall', { width: this._groundSide, height: this._wallHeight }, this._scene)
            wall.position = new BABYLON.Vector3(v.xPos, v.yPos, v.zPos)
            wall.rotation = RadRotVect({ y: v.yRot })
            wall.material = this._createGridMat('wallMat', { gridOffset: new BABYLON.Vector3(0.5, 0, 0) })

            // Collision
            if (this._scene.collisionsEnabled) {
                let wallCollision = BABYLON.MeshBuilder.CreatePlane(v.side + 'Mat', { width: this._groundSide, height: this._wallHeight, sideOrientation: BABYLON.Mesh.BACKSIDE }, this._scene)
                wallCollision.position = new BABYLON.Vector3(v.xPos, v.yPos, v.zPos)
                wallCollision.rotation = RadRotVect({ y: v.yRot })
                wallCollision.checkCollisions = true
                wallCollision.visibility = 0
            }
        })
    }
}