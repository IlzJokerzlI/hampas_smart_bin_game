import * as BABYLON from 'babylonjs'
import { GameBoard } from './game-board'
import { Block } from "./models/block"
import { Label } from "./models/label"
import { RadRotVect, Round, WorldAxes } from './utils'

export class Gameplay {
    label: Label
    board: GameBoard

    blocks: Block[] = []
    getCurrentBlock = (): Block => {
        return this.blocks[this.blocks.length - 1]
    }
    totalWeight = 0
    worldAxes: WorldAxes | null = null
    isGameOver = false

    constructor(scene: BABYLON.Scene) {
        // Board
        this.board = new GameBoard(scene, {})
        this.blocks.push(this.board.generateBlock());

        // Label
        this.label = new Label(
            scene,
            {
                planeWidth: this.board._groundSide,
                initialText: this.totalWeight + ' / 100',
                position: new BABYLON.Vector3(0, -0.5, -this.board._groundSide / 2 - 1.5),
                rotation: RadRotVect({ x: 90 })
            }
        )

        setInterval(() => {
            const currentBlock = this.getCurrentBlock().shape
            currentBlock.moveWithCollisions(new BABYLON.Vector3(0, -1, 0))
            currentBlock.position = new BABYLON.Vector3(Round(currentBlock.position.x, 0.5), Round(currentBlock.position.y, 0.5), Round(currentBlock.position.z, 0.5))
        }, 1000)

        window.addEventListener("keydown", (ev) => {
            if (ev.ctrlKey && ev.shiftKey && ev.altKey) {
                if (ev.key === 'I') { // Hide/show the Inspector (Ctrl+Shift+Alt+I)
                    if (scene.debugLayer.isVisible()) {
                        scene.debugLayer.hide()
                    } else {
                        scene.debugLayer.show()
                    }
                } else if (ev.key === 'X') { // Hide/show the world axes (Ctrl+Shift+Alt+X)
                    if (this.worldAxes === null) {
                        this.worldAxes = new WorldAxes(scene, {})
                    } else {
                        this.worldAxes.dispose()
                        this.worldAxes = null
                    }
                }
            }

            // Block movement
            const currentBlock = this.getCurrentBlock().shape
            if (ev.key === 'w' && currentBlock.position.z < this.board._groundSide / 2 - 1) { // Front
                currentBlock.moveWithCollisions(new BABYLON.Vector3(0, 0, 1))
            } else if (ev.key === 's' && currentBlock.position.z > -this.board._groundSide / 2 + 1) { // Back
                currentBlock.moveWithCollisions(new BABYLON.Vector3(0, 0, -1))
            } else if (ev.key === 'a' && currentBlock.position.x > -this.board._groundSide / 2 + 1) { // Left
                currentBlock.moveWithCollisions(new BABYLON.Vector3(-1, 0, 0))
            } else if (ev.key === 'd' && currentBlock.position.x < this.board._groundSide / 2 - 1) { // Right
                currentBlock.moveWithCollisions(new BABYLON.Vector3(1, 0, 0))
            } else if (!ev.shiftKey && ev.key === ' ' && currentBlock.position.y > 0.5) { // Down
                currentBlock.moveWithCollisions(new BABYLON.Vector3(0, -1, 0))
            } else if (ev.shiftKey && ev.key === ' ' && currentBlock.position.y < this.board._wallHeight - 1.5) { // Up
                currentBlock.moveWithCollisions(new BABYLON.Vector3(0, 1, 0))
            }
            currentBlock.position = new BABYLON.Vector3(Round(currentBlock.position.x, 0.5), Round(currentBlock.position.y, 0.5), Round(currentBlock.position.z, 0.5))
        })

        const engine = scene.getEngine()
        engine.runRenderLoop(() => {
            const currentBlock = this.getCurrentBlock().shape
            const collidedMeshPos = currentBlock.collider?.collidedMesh?.position
            if (currentBlock.collider?.collisionFound && collidedMeshPos != undefined && currentBlock.position.y - collidedMeshPos.y >= 0.5) {
                if (!currentBlock.intersectsMesh(this.board.prop.limit)) {
                    this.totalWeight += this.getCurrentBlock().weight
                    this.label.updateText(scene, this.totalWeight + ' / 100')
                    this.blocks.push(this.board.generateBlock())
                } else {
                    this.isGameOver = true
                }
            }
            scene.render()
        })
    }
}