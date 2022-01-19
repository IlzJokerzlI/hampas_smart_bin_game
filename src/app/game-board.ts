import * as BABYLON from 'babylonjs'
import { GridMaterial } from 'babylonjs-materials'
import { Block } from './models/block'
import { RadRotVect } from './utils'

interface Wall {
    name: string
    xPos: number
    yPos: number
    zPos: number
    yRot: number
}

interface Board {
    ground: BABYLON.Mesh
    lid: BABYLON.Mesh
    frontWall: BABYLON.Mesh
    backWall: BABYLON.Mesh
    leftWall: BABYLON.Mesh
    rightWall: BABYLON.Mesh
}

export class GameBoard {
    private _defaultGroundSide = 11
    private _scene: BABYLON.Scene
    readonly _groundSide: number
    readonly _wallHeight: number
    readonly prop: Board

    constructor(scene: BABYLON.Scene, { height = 0, side = 0 }) {
        this._scene = scene
        this._groundSide = (side > 3 || side % 2 != 0) ? side : this._defaultGroundSide
        this._wallHeight = (height > this._defaultGroundSide * 2) ? height : this._defaultGroundSide * 2
        this.prop = <Board>{}
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
        this.prop.ground = BABYLON.MeshBuilder.CreateGround('ground', { width: this._groundSide, height: this._groundSide, subdivisions: this._groundSide }, this._scene)
        this.prop.ground.material = mat
        this.prop.ground.position = new BABYLON.Vector3(0, -0.5, 0)
        this.prop.ground.checkCollisions = true

        // Lid
        this.prop.lid = BABYLON.MeshBuilder.CreatePlane('lid', { width: this._groundSide, height: this._groundSide }, this._scene)
        this.prop.lid.position = new BABYLON.Vector3(0, this._wallHeight - 0.5, 0)
        this.prop.lid.rotation = RadRotVect({ x: 90 })
        this.prop.lid.checkCollisions = true
        this.prop.lid.visibility = 0

        // Walls
        wallsData.forEach((v) => {
            // Graphical wall
            const wall = BABYLON.MeshBuilder.CreatePlane(v.name, { width: this._groundSide, height: this._wallHeight }, this._scene)
            wall.position = new BABYLON.Vector3(v.xPos, v.yPos, v.zPos)
            wall.rotation = RadRotVect({ y: v.yRot })
            wall.material = mat

            // Collision
            if (this._scene.collisionsEnabled) {
                const wallCollision = BABYLON.MeshBuilder.CreatePlane(v.name, { width: this._groundSide, height: this._wallHeight, sideOrientation: BABYLON.Mesh.BACKSIDE }, this._scene)
                wallCollision.position = new BABYLON.Vector3(v.xPos, v.yPos, v.zPos)
                wallCollision.rotation = RadRotVect({ y: v.yRot })
                wallCollision.checkCollisions = true
                wallCollision.visibility = 0
            }

            // Record walls into array
            switch (wall.name) {
                case 'fWall': {
                    this.prop.leftWall = wall
                    break
                }
                case 'bWall': {
                    this.prop.backWall = wall
                    break
                }
                case 'lWall': {
                    this.prop.leftWall = wall
                    break
                }
                default: {
                    this.prop.rightWall = wall
                }
            }
        })
    }

    generateBlock(): Block {
        let mat = new BABYLON.StandardMaterial('', this._scene)
        mat.diffuseColor = new BABYLON.Color3(1, 1, 0)

        let generateNumber = (min: number, max: number): number => {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        const maxSize = Math.round(this._groundSide / 2)
        const size = new BABYLON.Vector3(generateNumber(1, maxSize), generateNumber(1, maxSize), generateNumber(1, maxSize))
        const spawnPoint = new BABYLON.Vector3(
            (size.x % 2 == 0) ? 0.5 : 0,
            this._wallHeight - Math.floor(size.y / 2) - 1,
            (size.z % 2 == 0) ? 0.5 : 0,
        )
        const block = new Block(
            {
                mat: mat,
                scene: this._scene,
                size: size,
                spawnPoint: spawnPoint,
                weight: 10,
            },
        )

        return block
    }
}